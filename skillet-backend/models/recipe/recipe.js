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

/** Related functions for recipes. */

class Recipe {

  /** gets a list of saved recipes for a user.
   * 
   * Returns [recipeId, recipeId, ...]
   * @recipeId is a Number
   *
   * This can return an empty list if the user has not saved any recipes
   */

  static async getSaved(username) {
    const res = await db.query(
      `SELECT recipe_id AS "recipeId"
      FROM recipe_saved
      WHERE saved_by = $1`,
      [username],
    );

    const savedRecipes = res.rows.map(recipe => recipe.recipeId);

    return savedRecipes;
  }

  /** create a row for a new recipe id
   * 
   * @recipeId is a Number
   *
   */

  static async createStats(recipeId) {
    const res = await db.query(
      `INSERT INTO recipe_stats
      VALUES ($1, 0, 0)
      RETURNING recipe_id AS "recipeId", rating, save_count AS "saveCount"`,
      [recipeId],
    );

    const newStats = res.rows[0];

    return newStats;
  }

  /** gets a list of saved recipes for a user.
   * 
   * Returns [recipeId, recipeId, ...]
   * @recipeId is a Number
   *
   * This can return an empty list if the user has not saved any recipes
   */

  static async getStats(recipeId) {
    const res = await db.query(
      `SELECT recipe_id AS "recipeId",
              rating,
              save_count AS "saveCount"
      FROM recipe_stats
      WHERE recipe_id = $1`,
      [recipeId],
    );

    const savedRecipes = res.rows.map(recipe => recipe.recipeId);

    return savedRecipes;
  }

  /** updates the count of a saved recipe 
   * 
   * Returns {saveCount: Number}
   * @recipeId is a Number
   * @value is either +1 or -1
   *
   * This handles both incrementing and decrementing
   * if no stats are available we create a new entry in recipe_stats before we update
   */

  static async updateCount(recipeId, value) {
    const exsistsRes = await db.query(
      `SELECT recipe_id AS "recipeId"
      FROM recipe_stats
      WHERE recipe_id = $1`,
      [recipeId]
    );
    const noStats = exsistsRes.rows.length === 0;
    if(noStats) this.createStats(recipeId);

    const res = await db.query(
      `UPDATE recipe_stats
      SET save_count = save_count + $2
      WHERE recipe_id = $1
      RETURNING save_count AS "saveCount"`,
      [recipeId, value],
    );

    const saveCount = res.rows[0];

    return saveCount;
  }

  /** updates the count of a saved recipe 
   * 
   * Returns {saveCount: Number}
   * @recipeId is a Number
   * @value is either +1 or -1
   *
   * This handles both incrementing and decrementing
   * if no stats are available we create a new entry in recipe_stats before we update
   */

  static async updateRating(recipeId, rating) {
    const exsistsRes = await db.query(
      `SELECT recipe_id AS "recipeId", rating
      FROM recipe_stats
      WHERE recipe_id = $1`,
      [recipeId]
    );

    const stats = exsistsRes.rows[0];
    let currentRating;

    if(stats.length ===0 ) {
      this.createStats(recipeId);
      currentRating = stats.rating;
    } else {
      currentRating = 0;
    }

    const currRatedCountRes = await db.query(
      `SELECT recipe_id, COUNT(*) AS rating_count
      FROM recipe_rated_by
      GROUP BY $1`,
      [recipeId]
    );

    let currRatedCount = currRatedCountRes.rows[0];
    const sumOfRatings = (currentRating * currRatedCount) + rating;
    currRatedCount += 1;
    const newAverageRating = sumOfRatings / currRatedCount;

    const res = await db.query(
      `UPDATE recipe_stats
        SET rating = $2
        WHERE recipe_id = $1
        RETURNING rating`,
      [recipeId, newAverageRating],
    );

    const newRating = res.rows[0];

    return newRating;
  }

  /** saves a recipeId to recipe_saved table.
   *
   * Returns { recipe_id: Number }
   * increments the recipes saveCount inside of recipe_stats
   *
   * Throws error if recipe already saved.
   */

  static async save(recipeId, username) {
    const res = await db.query(
      `INSERT INTO recipe_saved (recipe_id, saved_by)
      VALUES ($1, $2)
      RETURNING recipe_id AS "recipeId"`,
      [recipeId, username]
    );

    const savedRecipe = res.rows[0];

    if (!savedRecipe) throw new NotFoundError(`Error saving recipe with id, ${recipeId}.`);

    await this.updateCount(recipeId, +1);

    return savedRecipe;
  }

  /** removes a saved recipe from the recipe_saved table.
 *
 * Returns { recipe_id: Number }
 * decrements the recipes saveCount inside of recipe_stats
 *
 * Throws error if recipe already saved.
 */

  static async removeSaved(recipeId, username) {
    const res = await db.query(
      `DELETE
      FROM recipe_saved
      WHERE recipe_id = $1 AND saved_by = $2
      RETURNING recipe_id AS "recipeId"`,
      [recipeId, username]
    );
    const removedRecipe = res.rows[0];

    if (!removedRecipe) throw new NotFoundError(`Recipe with id, ${recipeId} has not yet been saved`);

    await this.updateCount(recipeId, -1);

    return removedRecipe;
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


module.exports = Recipe;
