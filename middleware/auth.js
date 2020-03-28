const jwt = require("jsonwebtoken");
const config = require("config");

function authenticate(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ errors: [{ msg: "Invalid Token" }] });
  }
  try {
    const decode = jwt.verify(token, config.get("jwtSecret"));
    req.user = decode.user;
    next();
  } catch (error) {
    return res.status(401).json({ errors: [{ msg: "Invalid Token" }] });
  }
}

module.exports = authenticate;
