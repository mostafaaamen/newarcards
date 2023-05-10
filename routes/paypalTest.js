import dotenv from "dotenv"
dotenv.config()
import { Router } from "express";
const router=Router()
import paypal from "@paypal/checkout-server-sdk"
import { Order } from "../model/orders.js";
import { TransAcrion } from "../model/transaction-paypal.js";
import { Card } from "../model/cards.js";
import authenticate from "../middlewere/auth.js";



const Environment = paypal.core.SandboxEnvironment;
const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
);
// const Environment =
//   process.env.NODE_ENV === "production"
//     ? paypal.core.LiveEnvironment
//     : paypal.core.SandboxEnvironment;
// const paypalClient = new paypal.core.PayPalHttpClient(
//   new Environment(
//     process.env.PAYPAL_CLIENT_ID,
//     process.env.PAYPAL_CLIENT_SECRET
//   )
// );


router.post("/", authenticate, async (req, res) => {
  // console.log(req.body)
  // #########################
 const card = await Card.find({});
  // #########################
    const data = [];
    for (let i = 0; i < card.length; i++) {
      data.push([card[i].id, card[i]]);
    }
    const dataCard = new Map(data);
  const total = req.body.items.reduce((sum, item) => {
      return sum + dataCard.get(item.id).price * item.quantity;
    }, 0);
    const request = new paypal.orders.OrdersCreateRequest();
    // const total=totalPrice
  console.log(total);
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: total,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: total,
            },
          },
        },
        items: req.body.items.map((item) => {
          const card = dataCard.get(item.id);
          return {
            name: card.title,
            unit_amount: {
              currency_code: "USD",
              value: card.price,
            },
            quantity: item.quantity,
          };
        }),
      },
    ],
  });

  try {
    const order = await paypalClient.execute(request);
    res.json({ id: order.result.id });
    console.log("done");
    console.log("#".repeat(30));
    console.log(order);
    console.log("#".repeat(30));
    // console.log(order.result.purchase_units[0].items);
    // console.log(order.result.purchase_units);
    // res.send({ data: order.result.purchase_units[0].items });
    console.log("#".repeat(30));
    // console.log("done");
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.post("/test", authenticate, async (req, res) => {
  
    const data = req.body
  console.log("# success".repeat(20))
  console.log(data)
  console.log("# success".repeat(20));
  const transaction = new TransAcrion({
    user: req.user._id,
    data: req.body.data,
    cards: data.cartProducts,
  });
  await transaction.save()
  const createOrder = new Order({
    cards: data.cartProducts,
    user: req.user._id,
    email: req.user.email,
    address:req.user.dataInfo
  });
    await createOrder.save()

});

router.get("/get", authenticate, async (req, res) => {
  req.user.password = undefined;
  res.send(req.user);
});
router.post("/total", async(req, res) => {
    const card = await Card.find({})
    const getTotalTest = (dataArray, dataInput) => {
      const data1 = [];
      for (let i = 0; i < dataArray.length; i++) {
        data1.push([dataArray[i].id, dataArray[i]]);
      }
      const newdata = new Map(data1);
      const testTotalTest = dataInput.items.reduce((sum, item) => {
        return sum + newdata.get(item.id).price * item.quantity;
      }, 0);
      return testTotalTest;
    };
    let totalPrice = getTotalTest(card, req.body);
  console.log(totalPrice);
  // res.send(totalPrice)
})

export default router