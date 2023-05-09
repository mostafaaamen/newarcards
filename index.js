import dotenv from "dotenv"
dotenv.config()
import express from "express";
import setupRoutes from "./routes/index.js";
import mongoose from "mongoose";
import cors from "cors"
// ########## use es6 to use __dirname ###################
import path from "path";                               //#
import { fileURLToPath } from "url";                   //#
const __filename = fileURLToPath(import.meta.url);     //#
const __dirname = path.dirname(__filename);            //#
// #######################################################
const app = express()
mongoose.connect(process.env.MONGODB_CONTECTED).then(() => console.log("monodb connected"));
app.use(express.json())
app.use(cors())
app.use("/images", express.static(__dirname + "/images"));
app.use("/cards", express.static(__dirname + "/cards"));
app.use("/videos", express.static(__dirname + "/videos"));
setupRoutes(app)
app.use(express.static("public"))
app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
})
const PORT=process.env.PORT ||4040
app.listen(PORT, (req, res) => {
  console.log("server done");
});
// ##############################################################################
//                              CREATED BY AZMOS 
// ##############################################################################
