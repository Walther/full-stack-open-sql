const jwt = require("jsonwebtoken");
const router = require("express").Router();

const { SECRET } = require("../util/config");
const { User, Session } = require("../models");
const tokenExtractor = require("../middlewares/tokenExtractor");

router.post("/", async (req, res) => {
  const body = req.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });

  // ensure user has not been disabled
  if (user.disabled) {
    return res.status(401).json({ error: "user account disabled" });
  }

  const passwordCorrect = body.password === "secret";

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  await Session.upsert({
    userId: user.id,
    token: token,
  });

  res.status(200).send({ token, username: user.username, name: user.name });
});

router.delete("/", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const session = await Session.findOne({ userId: user.id });
  if (!session) {
    res.status(204).send();
    return;
  }

  await session.destroy();
  res.status(200).send();
});

module.exports = router;
