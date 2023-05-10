import { Router } from "express";
import { User } from "../model/users.js";
// const multer = require("multer");
import multer from "multer"
import authenticate from "../middlewere/auth.js";
const router = Router();



// multer handel midlerwere

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+ file.originalname);
  },
});
const upload = multer({ storage: storage });



router.post("/", upload.single("file"), async (req, res) => {
  const { username, password, email } = req.body;
    console.log(req.file)

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
    valid: false,
    experimental: true,
    created: Date(),
    userAuth: false,
    dataInfo: {},
    video:"null"
  });
  console.log(user);
  await user.save();
  res.send(user.getToken());

  console.log(username, password, email);
});

// router.get('/test',authenticate, (req, res) => {
//     res.send({ message: `Hello, ${req.user.username}!` });

// })


export default router;
