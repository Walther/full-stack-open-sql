const express = require("express");
require("express-async-errors");
const app = express();
app.use(express.json());
const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const blogRouter = require("./controllers/blog");
const userRouter = require("./controllers/user");
const loginRouter = require("./controllers/login");
const authorRouter = require("./controllers/author");
const readinglistRouter = require("./controllers/readinglist");
const errorHandler = require("./middlewares/errorHandler");

app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorRouter);
app.use("/api/readinglists", readinglistRouter);

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
