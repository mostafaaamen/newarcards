import { Router } from "express";
import authenticate from "../middlewere/auth.js";
// const paypal = require("paypal-rest-sdk");
import paypal from"paypal-rest-sdk"
const router = Router();
paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AWYmnVNRyVzXaS9n8ESyF0SvvAlA72Yl-IDL4Bk87tklQqW-oQRv71nJfBFnVoK3S6qfgCvDCINkz3cm",
  client_secret:
    "EJuc5n68C-h5etnANbI0EFbyuVDTualC3X3KdSrahWNjT6XS34UkrJRZshFmtad7zgB_KzYPs-oLvpAq",
});

router.post("/pay", authenticate, (req, res) => {
 
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:4040/paypal-payment/success",
      cancel_url: "http://localhost:4040/cancel",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Red Sox Hat",
              sku: "001",
              price: "25.00",
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: "25.00",
        },
        description: "Hat for the best team ever",
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      console.log("done")
      //  console.log(req.body);
      //  console.log(req.user.username);
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
        //   res.redirect(payment.links[i].href);
            res.json({ forwardLink: payment.links[i].href });

        }
      }
    }
  });
});


router.get("/success", (req, res) => {
  console.log("done")
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  console.log("#".repeat(30));
  console.log("user id is");
  console.log("#".repeat(30));
  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: "25.00",
        },
      },
    ],
  };

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        console.log(JSON.stringify(payment));
        res.send("Success");
      }
    }
  );
});

router.get("/cancel", (req, res) => res.send("Cancelled"));

// router.get("/", authenticate, async (req, res) => {
//   // console.log(req.user.username);
//   req.user.password = undefined;
// //   res.send(req.user);
//   // res.send(req.user.getToken())
// });

export default router;
