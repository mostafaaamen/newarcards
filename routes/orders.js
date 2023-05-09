import { Router } from "express";
import authenticate from "../middlewere/auth.js";
const router = Router();
import { Order } from "../model/orders.js";
router.get("/", authenticate, async (req, res) => {
   const order = await Order.find({});
   res.send(order);
});

export default router;
