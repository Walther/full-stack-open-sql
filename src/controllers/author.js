const router = require("express").Router();
const { Blog } = require("../models");
const { fn, col } = require("sequelize");

router.get("/", async (_req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      "author",
      [fn("COUNT", col("author")), "articles"],
      [fn("SUM", col("likes")), "likes"],
    ],
    group: "author",
    order: [["likes", "DESC"]],
  });
  res.json(authors);
});

module.exports = router;
