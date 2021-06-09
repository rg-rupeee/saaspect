const express = require("express");
const morgan = require("morgan");
const app = express();

const AppError = require("./utils/appError");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

// logging routes accessed to console in development
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Routes
const edibleRouter = require("./routes/edibleRoutes");
const costumerRouter = require("./routes/costumerRoutes");
app.use("/api/edible", edibleRouter);
app.use("/api/costumer", costumerRouter);

// 404 route not found
app.all("*", (req, res, next) => {
  next(new AppError(`Cannot  find ${req.originalUrl} on this server`, 404));
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "fail";
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
