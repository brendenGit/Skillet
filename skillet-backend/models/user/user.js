"use strict";

const db = require("../../db.js");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../../helpers/sql.js");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../../expressError.js");

const { BCRYPT_WORK_FACTOR } = require("../../config.js");

/** Related functions for users. */

class User {

  /** Register user with data.
   *
   * Returns { user : {  id: int, username: string, firstName: string , isAdmin: boolean }}
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register(
    { username, email, password, firstName, lastName, isAdmin }) {
    const duplicateEmailCheck = await db.query(
      `SELECT email
       FROM users
       WHERE email = $1`,
      [email],
    );

    if (duplicateEmailCheck.rows[0]) {
      throw new BadRequestError(`An account with that email already exists`);
    }

    const duplicateUsernameCheck = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`,
      [username],
    );

    if (duplicateUsernameCheck.rows[0]) {
      throw new BadRequestError(`An account with that username already exists`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
           (username,
            email,
            password,
            first_name,
            last_name,
            is_admin)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, username, is_admin AS "isAdmin"`,
      [
        username,
        email,
        hashedPassword,
        firstName,
        lastName,
        isAdmin
      ],
    );
    
    return result.rows[0];
  }


  /** authenticate user with username, password.
   * 
   * Returns { user : {  id: int, username: string, firstName: string , isAdmin: boolean }}
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT id,
              username,
              password,
              first_name AS "firstName",
              is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
      [username],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }


  /** Given a username, return data about user.
   *
   * Returns { id, username, email, first_name, last_name  }
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(username) {
    const userRes = await db.query(
      `SELECT id,
              username,
              email,
              first_name AS "firstName", 
              last_name AS "lastName"
           FROM users
           WHERE username = $1`,
      [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user with username: ${username}`);

    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email, isAdmin }
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws NotFoundError if not found.
   */

  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        firstName: "first_name",
        lastName: "last_name",
        isAdmin: "is_admin"
      });
      
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                is_admin AS "isAdmin"`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(username) {
    let result = await db.query(
      `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
      [username],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }
}


module.exports = User;
