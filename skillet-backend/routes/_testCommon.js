"use strict";

const db = require("../db.js");
const User = require("../models/user/user.js");
const { createToken } = require("../helpers/tokens.js");


async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");

  await User.register({
    username: "u1",
    email: "user1@user.com",
    password: "password1",
    firstName: "U1F",
    lastName: "U1L",
    isAdmin: false,
  });
  await User.register({
    username: "u2",
    email: "user2@user.com",
    password: "password2",
    firstName: "U2F",
    lastName: "U2L",
    isAdmin: false,
  });
  await User.register({
    username: "u3",
    email: "user3@user.com",
    password: "password3",
    firstName: "U3F",
    lastName: "U3L",
    isAdmin: false,
  });
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({ username: "u2", isAdmin: false });
const adminToken = createToken({ username: "admin", isAdmin: true });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken,
};
