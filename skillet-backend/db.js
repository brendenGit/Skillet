"use strict";

const { Pool } = require("pg");
const { getDatabaseUri } = require("./config.js");

const dbConfig = getDatabaseUri();
const db = new Pool(dbConfig);

module.exports = db;