import dotenv from "dotenv";
dotenv.config();
import { Router } from "express";
const router = Router();
import paypal from "@paypal/checkout-server-sdk";
import { Order } from "../model/orders.js";
import { User } from "../model/users.js";
import { Subscribe } from "../model/subscribe.js";
import { TransacrionSubscriptions } from "../model/transaction-subscriptions.js";
import authenticate from "../middlewere/auth.js";
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

router.post("/", authenticate, async (req, res) => {
    const {_id:subscribeId} = req.body.subscribe[0];
    console.log(req.body.subscribe[0]);
    // #########################
    const subscribeData = await Subscribe.findById(subscribeId);
    const { month,price } = subscribeData;
    console.log(subscribeData);
  // #########################

    const total = price;
  const request = new paypal.orders.OrdersCreateRequest();
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
      },
    ],
  });
  try {
    const order = await paypalClient.execute(request);
    res.json({ id: order.result.id });
    console.log("done");
    console.log("#".repeat(30));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.post("/success", authenticate, async (req, res) => {
  console.log(req.body)
  console.log("data")
  console.log(req.body.data)

  const transactionSubscribe = new TransacrionSubscriptions({
    user: req.user._id,
    data: req.body.data,
    subscribe: req.body.dataSubscribe[0],
  });
  await transactionSubscribe.save();

  const endEx = (month, expired, dateformdatabase) => {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
    };
    let date = new Date();
    date.setMonth(date.getMonth() + month);
    const formattedDate = date.toLocaleString("en-US", options);
    if (expired) {
      var oldDate = new Date();
      oldDate.setTime(dateformdatabase);
      oldDate.setMonth(oldDate.getMonth() + month);
      const formattedDate = oldDate.toLocaleString("en-US", options);
      if (dateformdatabase != undefined) {
        return {
          dateNum: oldDate,
          dateStr: formattedDate,
          dateMilli: Date.parse(oldDate),
        };
      }
      throw new Error(
        `dateformdatabase is undefined. To solve this error, you can set \x1b[31mendEX(value, value, value)\x1b[0m`
      );
    }
    return {
      dateNum: date,
      dateStr: formattedDate,
      dateMilli: Date.parse(date),
    };
  };
  const data = req.body.dataSubscribe[0];
  const userId = req.user._id;
  const user = await User.findById(userId);
  console.log(" # ".repeat(10));
  console.log(user);
  console.log(user.endExperimental);
  if (user.endExperimental.dateMilli < Date.now()) {
    user.endExperimental = endEx(data.month, true, Date.now());
    await user.save();
  } else {
    user.endExperimental = endEx(
      data.month,
      true,
      user.endExperimental.dateMilli
    );
    await user.save();
  }

});
export default router;
