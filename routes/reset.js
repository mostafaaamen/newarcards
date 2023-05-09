import dotenv from "dotenv";
dotenv.config();
import { Router } from "express";
import { User } from "../model/users.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import bcrypt from "bcryptjs";
const router = Router();

router.post("/", async (req, res) => {
  let { email } = req.body;
  let user = await User.findOne({ email });
  if (!user) return res.status(404).send("email not found");
  const token = jwt.sign({ _id: user._id }, "thistakenoutfixion6@5!2!@@_)", {
    expiresIn: "30m",
  });

  //send password token
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ACCOUNT,
      // generated ethereal user
      pass: process.env.PASSWORD_EMALI,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ACCOUNT,
    to: user.email,
    subject: "Reset your password",
    html: `
        <p>Please click the link below to reset your password:</p>
        <a href="${process.env.DOMAIN_CLIENT}reset/${token}">${process.env.DOMAIN_CLIENT}reset/${token}</a>
      `,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error sending email" });
    } else {
      console.log(info);
      return res.status(200).json({ message: "Reset password email sent" });
    }
  });
});
router.post("/:token", async (req, res) => {
  let token = req.params.token;
  console.log(token);
  let decodedToken = jwt.verify(token, "thistakenoutfixion6@5!2!@@_)");
  console.log(decodedToken);
  const user = await User.findOne({ _id: decodedToken._id });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  console.log(req.body.password);
  console.log(hashedPassword);
  user.password = req.body.password;
  await user.save();
  res.status(200).json({ message: "Password reset successful" });
});
export default router;
