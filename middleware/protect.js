let jwt = require("jsonwebtoken");

let protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .send({ msg: "No token provided, authorization denied" });
  }
  try {
    let decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({ msg: "Invalid token, authorization denied" });
  }
};
module.exports = protect;
