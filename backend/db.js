"use strict";

const { Pool, Client } = require("pg");
const { getDatabaseUri } = require("./config.js");
require("dotenv").config();

const dbConfig = getDatabaseUri();
const db = process.env.NODE_ENV === "test" 
        ? new Client(dbConfig)
        : new Pool(dbConfig);

db.connect();

module.exports = db;