"use strict";

const db = require("../db.js");
const User = require("../models/user/user.js");
const Recipe = require("../models/recipe/recipe.js");
const { createToken } = require("../helpers/tokens.js");


async function commonBeforeAll() {
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM grocery_lists")
  await db.query("DELETE FROM recipe_saved")
  await db.query("DELETE FROM recipe_stats")

  // create users
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

  //create recipe stats
  await Recipe.createStats(1);
  await Recipe.createStats(2);

  // create saved recipes
  await Recipe.save(1, 'u1');
  await Recipe.save(2, 'u1');

  // create rated recipes
  await Recipe.rate(1, 'u1', 4);
  await Recipe.rate(2, 'u1', 2);
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
