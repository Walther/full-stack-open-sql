const router = require("express").Router();

const { User, Blog, Readinglist } = require("../models");
const tokenExtractor = require("../middlewares/tokenExtractor");
const { Op } = require("sequelize");

router.get("/", async (_req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: {
        exclude: ["userId"],
      },
    },
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
  let where = {};
  if (req.query.read) {
    let status;
    if (req.query.read === "false") {
      status = false;
    } else if (req.query.read === "true") {
      status = true;
    } else {
      res
        .status(400)
        .json({ error: "unknown read status state, use true or false" });
    }
    where = { read: { [Op.is]: status } };
  }

  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: Blog,
        attributes: {
          exclude: ["userId"],
        },
      },
      {
        model: Blog,
        as: "reading_list",
        attributes: { exclude: ["userId"] },
        through: {
          attributes: ["id", "read"],
          as: "status",
          where,
        },
        include: {
          model: User,
          attributes: ["name"],
        },
      },
    ],
  });
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
