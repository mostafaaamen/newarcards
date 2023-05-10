
import { User } from "../model/users.js";
import { Router } from "express";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"


const router=Router()


// Reset password request
router.post("/", async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset password token
    const token = jwt.sign({ _id: user._id }, "thistakenoutfixion6@5!2!@@_)", {
      expiresIn: "30m",
    });

    // Send reset password email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "email",
        pass: "password",
      },
    });

    const mailOptions = {
      from: "email",
      to: user.email,
      subject: "Reset your password",
      html: `
        <p>Please click the link below to reset your password:</p>
        <a href="http://localhost:4040/reset-password/${token}">http://localhost:4040/reset-password/${token}</a>
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
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Reset password








// #####################################
router.post("/reset-password/:token", async (req, res) => {
  try {
    // Verify reset password token
    const decodedToken = jwt.verify(
      req.params.token,
      "thistakenoutfixion6@5!2!@@_)"
    );

    // Check if user exists
    const user = await User.findOne({ _id: decodedToken._id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default  router;
