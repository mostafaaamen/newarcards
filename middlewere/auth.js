
import jwt from "jsonwebtoken"
import { User } from "../model/users.js";

function authenticate(req, res, next) {
  const token = req.header("x-auth-token");

  try {
    const decoded = jwt.verify(token, "thistakenoutfixion6@5!2!@@_)");
    User.findById(decoded._id).then((user) => {
      if (!user) {
        return res.status(401).send({ error: "Unauthorized" });
      }
      req.user = user;
      next();
    });
  } catch (e) {
    res.status(401).send({ error: "Unauthorized" });
  }
}

export default authenticate