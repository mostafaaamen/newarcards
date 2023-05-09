import { Router } from "express";
import { User } from "../model/users.js";
const router = Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  if (!email) return res.status(401).send("email required");
  if (!password) return res.status(401).send("password required");

  let user = await User.findOne({ email });

  if (!user) return res.status(403).send("This Email Not found");
  let isMatch = await user.checkPassword(password);
  // let match = await user.password                                   -----\
  //                                                                   |       without crypt password 
  // if (!match) return res.status(404).send("password not matched");  -----/
  if (!isMatch) return res.status(404).send("password not matched");

  res.send(user.getToken());
});

export default router;
