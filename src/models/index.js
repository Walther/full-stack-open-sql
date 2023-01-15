const Blog = require("./blog");
const Readinglist = require("./readinglist");
const User = require("./user");
const Session = require("./sessions");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, {
  through: Readinglist,
  as: "reading_list",
  onDelete: "cascade",
});
Blog.belongsToMany(User, {
  through: Readinglist,
  as: "user_list",
  onDelete: "cascade",
});

User.hasOne(Session);
Session.belongsTo(User);

module.exports = {
  Blog,
  User,
  Readinglist,
  Session,
};
