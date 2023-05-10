import { Router } from "express";
import authenticate from "../middlewere/auth.js";
import { Card } from "../model/cards.js";

const router = Router();

router.get("/", async (req, res) => {
    const card = await Card.find({});
    res.send(card);
});

router.post("admin/add/cards", authenticate, async (req, res) => {
  const { title, price, img } = req.body;
  const createCard = new Card({
    price,
    title,
    img,
  });
  await createCard.save();
});
export default router;
