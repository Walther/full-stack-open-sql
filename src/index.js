const express = require("express");
require("express-async-errors");
const app = express();
app.use(express.json());
const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const blogRouter = require("./controllers/blog");
app.use("/api/blogs", blogRouter);

const errorHandler = (error, request, response, next) => {
  console.log(error.name);
  console.error(error.message);

  if (error.name === "SequelizeValidationError") {
    return response.status(400).send({ error: "malformatted content" });
  }

  if (error.name === "SequelizeDatabaseError") {
    return response.status(400).send({ error: "malformatted content" });
  }

  next(error);
};

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
