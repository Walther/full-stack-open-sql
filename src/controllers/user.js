const router = require("express").Router();

const { User, Blog } = require("../models");
const tokenExtractor = require("../middlewares/tokenExtractor");

router.get("/", async (_req, res) => {
  const users = await User.findAll({
    include: { model: Blog },
    attributes: { exclude: ["userId"] },
  });
  res.json(users);
});

router.post("/", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

router.put("/:username", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const new_username = req.params.username;
  if (user) {
    user.username = new_username;
    await user.save();
    res.json({ username: new_username });
  } else {
    res.status(404).end();
  }
});

router.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;