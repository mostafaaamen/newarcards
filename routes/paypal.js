import { Router } from "express";
import authenticate from "../middlewere/auth.js";
import paypal from "@paypal/checkout-server-sdk"
import env from "dotenv";
const router = Router();

env.config()
const Environment =
  process.env.NODE_ENV === "production"
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment;
const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
);

const storeItems = new Map([
  [1, { price: 100, name: "Learn React Today" }],
  [2, { price: 200, name: "Learn CSS Today" }],
  [3, { price: 50, name: "Learn CSS Today" }],
]);

router.post("/",authenticate, async (req, res) => {
  const request = new paypal.orders.OrdersCreateRequest();
  const total = req.body.items.reduce((sum, item) => {
    return sum + storeItems.get(item.id).price * item.quantity;
  }, 0);
  console.log(total);
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: total,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: total,
            },
          },
        },
        items: req.body.items.map((item) => {
          const storeItem = storeItems.get(item.id);
          return {
            name: storeItem.name,
            unit_amount: {
              currency_code: "USD",
              value: storeItem.price,
            },
            quantity: item.quantity,
          };
        }),
      },
    ],
  });

  try {
    const order = await paypalClient.execute(request);
    res.json({ id: order.result.id });
    console.log("done");
    console.log("#".repeat(30));
    console.log(order);
    console.log("#".repeat(30));
    console.log(order.result.purchase_units[0].items);
    console.log(order.result.purchase_units);
    // res.send({ data: order.result.purchase_units[0].items });
    console.log("#".repeat(30));
    console.log("done");
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.post("/test", (req, res) => {
  console.log(req.user.username)
  console.log(req.body);
});

export default router;
