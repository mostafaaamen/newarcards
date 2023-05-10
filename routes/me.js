import { Router } from "express";
import { User } from "../model/users.js";
import jwt from "jsonwebtoken";

const router = Router();

router.get('/', (req, res) => {
    let token = req.header("x-auth-token")
    if(!token)return res.status(404).send("Token Not vaild Try Login agin")
    let user = jwt.verify(token, "thistakenoutfixion6@5!2!@@_)");
    res.send(user)
    // res.send("me")
})



export default router;
