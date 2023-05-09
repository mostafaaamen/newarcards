import { Router } from "express";
import authenticate from "../middlewere/auth.js";
import { User } from "../model/users.js";

const router = Router();

router.get("/", authenticate, async (req, res) => {
  req.user.password = undefined;
  res.send(req.user);
});
router.post("/add/socail", authenticate, async (req, res) => {
  const { facebook, twitter, linkedin, instgram } = req.body;
  const data = {
    facebook,
    twitter,
    linkedin,
    instgram,
  };
  const userId = req.user._id;
    const user = await User.findById(userId)
     user.links = data;
     user.save();
   console.log(req.body)
   console.log(user)
  });
router.post("/add/address", authenticate, async (req, res) => {
    const { phone, city, address, country } = req.body;
    const data = {
      phone,
      city,
      address,
      country,
    };
    const userId = req.user._id;
    const user = await User.findById(userId);
  user.dataInfo = data
  user.save()
    console.log(user)
});
export default router;
