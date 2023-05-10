import { Router } from "express";
import authenticate from "../middlewere/auth.js";
import { Subscribe } from "../model/subscribe.js";

const router = Router();

router.get("/profile", authenticate, async (req, res) => {
  const subscribe = await Subscribe.find({});
  res.send(subscribe);
});
// admin auth
router.post("/admin/add/subscribe", authenticate, async (req, res) => {

});
export default router;
