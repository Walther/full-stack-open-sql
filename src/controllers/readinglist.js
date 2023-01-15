const router = require("express").Router();

const { User, Blog } = require("../models");
const tokenExtractor = require("../middlewares/tokenExtractor");

router.post("/", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.findByPk(req.body.id);

  res.json({ blogId: blog.id, userId: user.id });
});
