const router = require("express").Router();
const { Op } = require("sequelize");

const { Blog, User } = require("../models");
const tokenExtractor = require("../middlewares/tokenExtractor");

const blogFinder = async (req, _res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get("/", async (req, res) => {
  let where = {};

  if (req.query.search) {
    where = {
      [Op.or]: [
        { author: { [Op.iRegexp]: req.query.search } },
        { title: { [Op.iRegexp]: req.query.search } },
      ],
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
    order: [["likes", "DESC"]],
  });
  res.json(blogs);
});

router.post("/", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.create({ ...req.body, userId: user.id });
  res.json(blog);
});

router.get("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

router.put("/:id", blogFinder, async (req, res) => {
  const likes = req.body.likes;
  if (req.blog) {
    req.blog.likes = likes;
    await req.blog.save();
    res.json({ likes });
  } else {
    res.status(404).end();
  }
});

router.delete("/:id", tokenExtractor, blogFinder, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  if (req.blog) {
    if (req.blog.userId !== user.id) {
      res.status(403).end();
      return;
    }
    req.blog.destroy();
    res.status(200).end();
  }

  res.status(404).end();
});

module.exports = router;
