const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/config");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (!authorization) {
    return res.status(400).json({ error: "authorization header missing" });
  }
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (e) {
      console.log(e);
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

module.exports = tokenExtractor;
