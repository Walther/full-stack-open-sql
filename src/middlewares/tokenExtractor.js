const jwt = require("jsonwebtoken");
const { Session, User } = require("../models");
const { SECRET } = require("../util/config");

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (!authorization) {
    return res.status(400).json({ error: "authorization header missing" });
  }
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    // validate token
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (e) {
      console.log(e);
      return res.status(401).json({ error: "token invalid" });
    }

    // ensure token is in a valid session
    const session = await Session.findOne({
      where: { userId: req.decodedToken.id },
    });
    if (!session) {
      return res.status(401).json({ error: "session expired" });
    }

    // ensure user has not been disabled
    const user = await User.findByPk(req.decodedToken.id);
    if (user.disabled) {
      return res.status(401).json({ error: "user account disabled" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

module.exports = tokenExtractor;
