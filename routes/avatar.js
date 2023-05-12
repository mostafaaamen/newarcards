import dotenv from "dotenv";
dotenv.config();
import AWS from "aws-sdk"
import multerS3 from "multer-s3"
import { Router } from "express";
import multer from "multer";
import authenticate from "../middlewere/auth.js";
import fs from "fs";
import express from "express"
const app=express()
const router = Router();


AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION,
});
const BUCKET = process.env.BUCKET;
const s3 = new AWS.S3();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('Invalid file type. Only JPEG and PNG files are allowed.');
    error.code = 'LIMIT_FILE_TYPES';
    return cb(error, false);
  }
  cb(null, true);
};

const limits = {
  fileSize: 5 * 1024 * 1024, // 4 megabytes
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
  console.log(req.file)
  console.log(req.file)
  if (req.user.img === "/images/avatar.png") {
    req.user.img = req.file.location;
    await req.user.save();
  } else {
    let x = await s3
      .deleteObject({ Bucket: BUCKET, Key: req.user.img })
      .promise();
    console.log(`File`);
    console.log(req.file);
    req.user.img = req.file.location;
    req.user.save();
  }
});


export default router;
