const errorHandler = (error, _request, response, next) => {
  console.error(error.message);

  if (error.name === "SequelizeValidationError") {
    const message = error.errors[0].message;
    return response.status(400).send({ error: message });
  }

  if (error.name === "SequelizeDatabaseError") {
    return response.status(400).send({ error: "malformatted content" });
  }

  next(error);
};

module.exports = errorHandler;
