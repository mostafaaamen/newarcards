import dotenv from "dotenv";
dotenv.config();
import AWS from "aws-sdk";
import multerS3 from "multer-s3";
import { Router } from "express";
import express from "express";
import multer from "multer";
import authenticate from "../middlewere/auth.js";
// import fs from "fs";
const app = express();
const router = Router();


AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION,
});
const BUCKET = process.env.BUCKET;
const s3 = new AWS.S3();


const limits = {
  fileSize: 15 * 1024 * 1024, // 4 megabytes
};

const fileFilter = function (req, file, cb) {
  if (file.mimetype === "video/mp4") {
    cb(null, true);
  } else {
    cb(new Error("File type not supported. Only MP4 files are allowed."));
  }
};
const upload = multer({
  fileFilter: fileFilter,
  limits: limits,
  storage: multerS3({
    s3: s3,
    bucket: BUCKET,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});
router.post("/", authenticate, upload.single("file"), async (req, res) => {

  console.log(req.file);
  //  console.log(req.file);
   if (req.user.video === null) {
     req.user.video = req.file.location;
     await req.user.save();
   } else {
     let x = await s3
       .deleteObject({ Bucket: BUCKET, Key: req.user.video })
       .promise();
     console.log(`File`);
     console.log(req.file);
     req.user.video = req.file.location;
     req.user.save();
   }
});

export default router;
