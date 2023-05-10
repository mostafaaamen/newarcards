import { Router } from "express";
import express from "express"
import multer from "multer";
import authenticate from "../middlewere/auth.js";
// import fs from "fs";
const app=express()
const router = Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "videos");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const fileFilter = function (req, file, cb) {
  if (file.mimetype === "video/mp4") {
    cb(null, true);
  } else {
       cb(new Error("File type not supported. Only MP4 files are allowed."));

  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});
router.post("/", authenticate, upload.single("file"), async (req, res) => {
  console.log(req.file)
    const file = req.file;
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }
    res.send(file);
});
// handle error
app.use(function (err, req, res, next) {
  if (err instanceof multer.MulterError) {
    // Multer error occurred
    res.status(400).json({ message: "File upload error: " + err.message });
  } else if (err) {
    // Other error occurred
    res.status(500).json({ message: "Internal server error: " + err.message });
  } else {
    next();
  }
});
export default router;
