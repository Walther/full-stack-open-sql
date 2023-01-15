const Blog = require("./blog");
const Readinglist = require("./readinglist");
const User = require("./user");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: Readinglist, as: "reading_list" });
Blog.belongsToMany(User, { through: Readinglist, as: "user_list" });

module.exports = {
  Blog,
  User,
  Readinglist,
};
