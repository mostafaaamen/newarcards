import { Router } from "express";
import multer from "multer";
// import { User } from "../model/users.js";
import authenticate from "../middlewere/auth.js";
import fs from "fs";
const router =Router()
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() +"-"+ file.originalname);
  },
});
const upload = multer({ storage: storage });
router.post("/", authenticate, upload.single("file"), async (req, res) => {
    if (req.user.img === "/images/avatar.png") {
      req.user.img = "/Images/"+req.file.filename;
      await req.user.save();
      console.log(true)
    } else {
      console.log("req.user.img");
      console.log(req.user.img);
        fs.unlink(`./${req.user.img}`,(err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(`File`);
          console.log(req.file);
        req.user.img = "/Images/" + req.file.filename;
          req.user.save();
        }); 
    }
});

export default router;