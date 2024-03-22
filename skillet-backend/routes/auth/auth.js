"use strict";

/** Routes for authentication. */

const User = require("../../models/user/user.js");
const jsonschema = require("jsonschema");
const express = require("express");
const authUserSchema = require("../../schemas/authUser.json");
const userRegisterSchema = require("../../schemas/userRegister.json");
const { createToken } = require("../../helpers/tokens.js");
const { BadRequestError } = require("../../expressError.js");

const router = new express.Router();

/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/token", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, authUserSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token, ...user });
  } catch (err) {
    return next(err);
  }
});


/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.register({ ...req.body, isAdmin: false });
    const token = createToken(user);
    return res.status(201).json({ token, ...user });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
