"use strict";

/** Express app for skillet. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError.js");

const { authenticateJWT } = require("./middleware/auth.js");
const authRoutes = require("./routes/auth/auth.js");
const groceryListRoutes = require("./routes/groceryLists/groceryLists.js");
const usersRoutes = require("./routes/users/users.js");
// const jobsRoutes = require("./routes/jobs.cjs");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/grocery-lists", groceryListRoutes);
app.use("/users", usersRoutes);
// app.use("/jobs", jobsRoutes);


/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
