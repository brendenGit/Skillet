"use strict";

const db = require("../../db.js");
const {
  NotFoundError,
} = require("../../expressError.js");

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

  /** gets a list of rated recipes for a user.
   * 
   * Returns [recipeId, recipeId, ...]
   * @recipeId is a Number
   *
   * This can return an empty list if the user has not saved any recipes
   */

  static async getRated(username) {
    const res = await db.query(
      `SELECT recipe_id AS "recipeId"
      FROM recipe_rated_by
      WHERE rated_by = $1`,
      [username],
    );

    const ratedRecipes = res.rows.map(recipe => recipe.recipeId);

    return ratedRecipes;
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

    const recipeStats = res.rows[0];

    return recipeStats;
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
    if (noStats) this.createStats(recipeId);

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
    let currentRating;
    let newRating;

    const exsistsRes = await db.query(
      `SELECT recipe_id AS "recipeId", rating
      FROM recipe_stats
      WHERE recipe_id = $1`,
      [recipeId]
    );
    
    // if we have no stats - create them and set the new rating to the rating passed in
    if (exsistsRes.rows.length === 0) {
      this.createStats(recipeId);
      const res = await db.query(
        `UPDATE recipe_stats
          SET rating = $2
          WHERE recipe_id = $1
          RETURNING rating`,
        [recipeId, rating],
      );
      newRating = res.rows[0].rating;
      return newRating
    } else {
      currentRating = exsistsRes.rows[0].rating;
    }

    const currRatedCountRes = await db.query(
      `SELECT COUNT(*) AS "ratingCount"
      FROM recipe_rated_by
      WHERE recipe_id = $1`,
      [recipeId]
    );

    //calc new average
    let currRatedCount = parseInt(currRatedCountRes.rows[0].ratingCount);
    const sumOfRatings = (currentRating * currRatedCount) + rating;
    currRatedCount += 1;
    const newAverageRating = Math.ceil(sumOfRatings / currRatedCount);

    const res = await db.query(
      `UPDATE recipe_stats
        SET rating = $2
        WHERE recipe_id = $1
        RETURNING rating`,
      [recipeId, newAverageRating],
    );

    newRating = res.rows[0].rating;
    return newRating;
  }

  /** rates a recipe.
   *
   * Returns { recipeId: Number, newRating: Number }
   * creates new entry on recipe_rated_by table and updates rating
   *
   * Throws error if recipe already is already rated.
   */

  static async rate(recipeId, username, value) {
    const res = await db.query(
      `INSERT INTO recipe_rated_by (recipe_id, rated_by)
      VALUES ($1, $2)
      RETURNING recipe_id AS "recipeId"`,
      [recipeId, username]
    );

    const ratedRecipeId = res.rows[0].recipeId;

    if (!ratedRecipeId) throw new NotFoundError(`Error rating recipe with id, ${recipeId}.`);

    const newRating = await this.updateRating(recipeId, value);

    return { ratedRecipeId , newRating };
  }

  /** saves a recipeId to recipe_saved table.
   *
   * Returns { recipeId: Number }
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
