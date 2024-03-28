"use strict";

/** Database setup for skillet. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

const db = new Client(getDatabaseUri());
db.connect();

module.exports = db;
