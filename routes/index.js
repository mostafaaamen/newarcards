import Auth from "./auth.js"
import SignUp from './signUp.js'
import Me from './me.js'
import Reset from './reset.js'
import profile from './profile.js'
import avatar from './avatar.js'
import paypal from './paypal_payment.js'
import paypal_payment from './paypalTest.js'
import card from './card.js'
import orders from './orders.js'
import del from './delete.js' 
import updata from './updata.js' 
import subscribe from "./subscribe.js"; 
import subscribePayment from "./subscribe_payment.js"
import userId from "./userId.js"
import video from "./video.js";
import admin from "./admin.js";

export default function setupRoutes(app) {
  app.use("/api/signin", Auth);
  app.use("/api/signup", SignUp);
  app.use("/api/profile", profile);
  app.use("/api/avatar", avatar);
  app.use("/api/me", Me);
  app.use("/api/admin", admin);
  app.use("/api/reset", Reset);
  app.use("/api/paypal-payment", paypal);
  app.use("/api/create-order", paypal_payment);
  app.use("/api/orders", orders);
  app.use("/api/card", card);
  app.use("/api/subscribe", subscribe);
  app.use("/api/subscribe/payment", subscribePayment);
  app.use("/api/updata", updata);
  app.use("/api/delete", del);
  app.use("/api/user", userId);
  app.use("/api/video", video);
}