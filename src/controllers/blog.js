const router = require("express").Router();

const { Blog } = require("../models");

const blogFinder = async (req, _res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get("/", async (_req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.post("/", async (req, res) => {
  const blog = await Blog.create(req.body);
  return res.json(blog);
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

router.delete("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.destroy();
    res.status(200).end();
  } else {
    res.status(404).end();
  }
});

module.exports = router;
