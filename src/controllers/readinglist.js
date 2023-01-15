const router = require("express").Router();

const { User, Readinglist } = require("../models");
const tokenExtractor = require("../middlewares/tokenExtractor");

router.put("/:id", tokenExtractor, async (req, res) => {
  const read = req.body.read;
  if (read === undefined) {
    res.status(400).json({
      error: "read status required",
    });
  }
  const user = await User.findByPk(req.decodedToken.id);
  const readinglist = await Readinglist.findByPk(req.params.id);
  if (user.id !== readinglist.userId) {
    res.status(403).end();
  }

  readinglist.read = read;
  readinglist.save();
  res.json({ read });
});

module.exports = router;
