import { Router } from "express";
import authenticate from "../middlewere/auth.js";
import { User } from "../model/users.js";

const router = Router();

router.get("/:id", async (req, res) => {
    const _id = req.params.id
    console.log(_id.length)
    if(_id.length !=24) return res.status(404).send("Error on URl")
    const user = await User.findById(_id)
    if (!user) return res.status(403).send("user not found")
    if (user.endExperimental.dateMilli >= Date.now()) {
        user.password = undefined;
        return res.send(user)
    } else {
            return res.status(406).send({massage:"Subscription has expired or Not Subscribed"})
        }   
});


export default router;
