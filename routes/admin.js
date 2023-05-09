import { Router } from "express";
import multer from "multer";
import authenticate from "../middlewere/auth.js";
import authorizeAdmin from "../middlewere/admin.js";
import { User } from "../model/users.js";
import { Card } from "../model/cards.js";
import { Order } from "../model/orders.js";
import { Subscribe } from "../model/subscribe.js";
import { TransacrionSubscriptions } from "../model/transaction-subscriptions.js";
import { TransAcrion } from "../model/transaction-paypal.js";

import {PriceSubscribe}from "../functional/priceSubscribe.js"
import { PriceOrder } from "../functional/priceOrder.js";
import { ConnectPrice } from "../functional/connectPrice.js";
const router = Router();
// return country count number form array
 const getCountReturn = (array) => {
   const count = {};
   for (let i = 0; i < array.length; i++) {
     if (count[array[i]]) {
       count[array[i]]++;
     } else {
      count[array[i]] = 1;
     }
   }
   return count;
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "cards");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });
// ##############################################################################
// ##############################################################################
router.get("/deteles", authenticate, authorizeAdmin, async (req, res) => {
  const user=await User.find()
  const order = await Order.find();
  const subscribe = await Subscribe.find();
  const country = user.map((obj) => obj.dataInfo[0].country);
  const lowercaseCountry = country.map((c) => c.toLowerCase()); 
      const data = {
      userNum: user.length,
      countryCount: getCountReturn(lowercaseCountry),
      orderNum: order.length,
      subscribeNum: subscribe.length,
     };    
    res.send(data);
});
// ##############################################################################
router.get("/deteles/visual", authenticate, authorizeAdmin, async (req, res) => {
  const subscriptions = await TransacrionSubscriptions.find();
  const order = await Order.find();
  const data = ConnectPrice(PriceSubscribe(subscriptions), PriceOrder(order));
  const toArrayVisual = (object) => {
    const dataArray = [];
    Object.entries(object).forEach(([key, value]) => {
      dataArray.push({ name: key, Total: value });
    });
    return dataArray;
  };
  res.send(toArrayVisual(data));

});
// ##############################################################################
// ##############################################################################
router.get("/users", authenticate, authorizeAdmin, async (req, res) => {
  const users = await User.find()
  const validUsers = users.filter((user) => user.userAuth !== "true");
  if (validUsers) return res.status(201).send(validUsers)
  return res.send({massage:"users not found"});
});
router.get("/users/:id", authenticate, authorizeAdmin, async (req, res) => {
   const _id = req.params.id;
   if (_id.length != 24) return res.status(404).send("Error on URl");
   const user = await User.findById(_id);
   const paypal = await TransAcrion.find({user:_id});
   const subscribe = await TransacrionSubscriptions.find({ user: _id });
  if (!user) return res.status(403).send("user not found");
  const dataUser = {
    user,
    paypal,
    subscribe,
  };
  return res.send(dataUser);
});
router.post("/add/admin", authenticate, authorizeAdmin, async (req, res) => {
  const { email, password,username } = req.body
  console.log(email)
  console.log(password)
  let emailFound = await User.findOne({ email });
  if (emailFound)
    return res
      .status(404)
      .send("this email found in data base please try ather email");
  const user = new User({
    username,
    password,
    email,
    usersShow: 0,
    valid: null,
    experimental: true,
    created: Date(),
    userAuth: true,
    dataInfo: {},
    video: "null",
  });
  console.log(user);
  await user.save();
  // res.send(user)
})
router.get("/show/admin", authenticate, authorizeAdmin, async (req, res) => {
  const users = await User.find();
  const validUsers = users.filter((user) => user.userAuth !== "false");
  if (validUsers) return res.status(201).send(validUsers);
  return res.send({ massage: "users not found" });
});
router.delete(
  "/delete/admin/:id",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    const _id = req.params.id;
    if (_id.length != 24) return res.status(404).send("Error on URl");
    try {
      const deletedUser = await User.findByIdAndDelete(_id);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "An error occurred" });
    }
    // if (validUsers) return res.status(201).send(validUsers);
    // return res.send({ massage: "users not found" });
  }
);

// ################################## START #####################################
/*
                                     CARDS
              SHOW      CARDS                           ALL 
              ADD       CARDS                           
              UPDATE    CARDS                           BY ID
              DELETE    CARDS                           BY ID
                                __________________
                                |                |
################################ CREATED BY AZMOS ############################
                                |_________________| 
*/ 
router.get("/show/cards", authenticate, authorizeAdmin, async (req, res) => {
  const cards = await Card.find();
  if(!cards)return res.send("cards not found")
  await res.status(201).send(cards);
});
router.post("/add/cards", authenticate,authorizeAdmin,upload.single("file"), async (req, res) => {
  const { title, price } = req.body;
     
         const createCard = new Card({
           price,
           title,
           img:"/cards/"+req.file.filename
         });
  await createCard.save();
  res.send("sucess to create card")
});

// update
router.post(
  "/update/card/:id",
  authenticate,
  authorizeAdmin,
  upload.single("file"),
  async (req, res) => {
    const { title, price } = req.body;
    const _id = req.params.id;
    if (_id.length != 24) return res.status(404).send("Error on URl");
    try {
      const updateSubscribe = await Card.findById(_id);
      if (!updateSubscribe) {
        return res.status(404).json({ message: "subscribe not found" });
      }
      updateSubscribe.price = price;
      updateSubscribe.title = title;
      updateSubscribe.img = "/cards/" + req.file.filename;
      await updateSubscribe.save();
      res.json({ message: "Card update successfully" });
    } catch (error) {
      res.status(500).json({ message: "An error occurred" });
    }
    return;
  }
);
// delete
router.delete("/delete/cards/:id",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    const _id = req.params.id;
    if (_id.length != 24) return res.status(404).send("Error on URl");
    try {
      const deletedCard = await Card.findByIdAndDelete(_id);
      if (!deletedCard) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "An error occurred" });
    }
  }
);





// ################################## END CARD #####################################
router.get("/subscribe", authenticate, authorizeAdmin, async (req, res) => {
  const subscriptions = await TransacrionSubscriptions.find();
  if (!subscriptions) return res.send("TransacrionSubscriptions not found");
  await res.status(201).send(subscriptions);
});
// ##############################################################################
// ##############################################################################
router.get("/show/subscribe", authenticate, authorizeAdmin, async (req, res) => {
  const subscribe = await Subscribe.find();
  if (subscribe) return res.status(201).send(subscribe);
  return res.send({ massage: "subscribe not found" });
});
router.post("/add/subscribe", authenticate, authorizeAdmin, async (req, res) => {
  const { title, price, month } = req.body;
  console.log(req.body)
       const createSubscribe = new Subscribe({
         price,
         title,
         month,
       });
  await createSubscribe.save();
  console.log(createSubscribe)
});
router.post("/update/subscribe/:id", authenticate, authorizeAdmin, async (req, res) => {
  const { title, price, month } = req.body;
  const _id = req.params.id;
  if (_id.length != 24) return res.status(404).send("Error on URl");

  try {
       const updateSubscribe = await Subscribe.findById(_id);
       if (!updateSubscribe) {
         return res.status(404).json({ message: "subscribe not found" });
       }
         updateSubscribe.price=price
         updateSubscribe.title = title;
         updateSubscribe.month=month
       await updateSubscribe.save();
    //    console.log(updateSubscribe);
      res.json({ message: "User update successfully" });
    } catch (error) {
      res.status(500).json({ message: "An error occurred" });
    }
    return
  });
  // delete

router.delete(
  "/delete/subscribe/:id",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    const _id = req.params.id;
    if (_id.length != 24) return res.status(404).send("Error on URl");
    try {
      const deletedSubscribe = await Subscribe.findByIdAndDelete(_id);
      if (!deletedSubscribe) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "An error occurred" });
    }
  }
);

// ##############################################################################

// ##############################################################################
router.get("/order", authenticate, authorizeAdmin, async (req, res) => {
  const order = await Order.find();
  if (order) return res.status(201).send(order);
  return res.send({ massage: "order not found" });
});
router.get("/order/:id", authenticate, authorizeAdmin, async (req, res) => {
  const _id = req.params.id;
  if (_id.length != 24) return res.status(404).send("Error on URl");
    const order = await Order.findById(_id);
  if (!order) return res.status(403).send("user not found");
  return res.send(order);
});
router.post("/order/:id/status", authenticate, authorizeAdmin, async (req, res) => {
  const { status } = req.body
  console.log(status);
  const _id = req.params.id;
  if (_id.length != 24) return res.status(404).send("Error on URl");
  const order = await Order.findById(_id);
  if (!order) return res.status(403).send("user not found");
  if(order.status==="successfully")return res.status(405).send("finsh set status , status now is successfully");
  const data = ["sendding", "successfully"];
  if (data.includes(status)) {
    order.status = status;
    order.save()
  }
  else {
    // res.status(402).send("Error when try update status try again or status not valid")
  }
});
export default router;
// ##############################################################################
//                              CREATED BY AZMOS 
//            #mostafa => linkedIn https://www.linkedin.com/in/mostafaamen/
// ##############################################################################
