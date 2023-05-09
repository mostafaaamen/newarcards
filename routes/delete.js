import { Router } from "express";
import authenticate from "../middlewere/auth.js";
const router = Router();

router.put("/socialmedia/:id", authenticate, async (req, res) => {
  //  social media
});

export default router;
