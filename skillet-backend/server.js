"use strict";

const app = require("./app.cjs");
const { PORT } = require("./config.cjs");

app.listen(PORT, function () {
  console.log(`Started on http://localhost:${PORT}`);
});
