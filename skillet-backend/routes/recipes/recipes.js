"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");
const savedRecipeSchema = require("../../schemas/savedRecipe.json");
const ratedRecipeSchema = require("../../schemas/rateRecipe.json");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../../middleware/auth.js");
const { BadRequestError } = require("../../expressError.js");
const Recipe = require("../../models/recipe/recipe.js");

const router = express.Router();

/** GET gets all saved recipes savedRecipes => { savedRecipes: [recipeId, recipeId, ...] }
 *
 * @recipeId is an Integer
 * Returns { savedRecipes: [recipeId, recipeId, ...] }
 *
 * Authorization required: admin or correct user
 **/

router.get("/:username/saved", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const savedRecipes = await Recipe.getSaved(req.params.username);
    return res.json({ savedRecipes });
  } catch (err) {
    return next(err);
  }
});

/** GET gets all rated recipes ratedRecipes => { ratedRecipes: [recipeId, recipeId, ...] }
 *
 * @recipeId is an Integer
 * Returns { ratedRecipes: [recipeId, recipeId, ...] }
 *
 * Authorization required: admin or correct user
 **/

router.get("/:username/rated", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const ratedRecipes = await Recipe.getRated(req.params.username);
    return res.json({ ratedRecipes });
  } catch (err) {
    return next(err);
  }
});

/** GET gets all saved recipes savedRecipes => { savedRecipes: [recipeId, recipeId, ...] }
 *
 * @recipeId is an Integer
 * Returns { savedRecipes: [recipeId, recipeId, ...] }
 *
 * Authorization required: admin or correct user
 **/

router.post("/stats", async function (req, res, next) {
  const recipeIds = req.body.recipeIds;
  try {
    const recipeStats = await Promise.all(recipeIds.map(async (recipeId) => {
      return Recipe.getStats(recipeId);
    }));
    return res.json(recipeStats);
  } catch (err) {
    return next(err);
  }
});

/** POST rates a recipe => { recipeId }
 *
 * @recipeId is an Integer
 * Returns { recipeId: rating }
 *
 * Authorization required: admin or correct user
 **/

router.post("/:username/rate/:recipeId", ensureCorrectUserOrAdmin, async function (req, res, next) {
  const username = req.params.username;
  const recipeId = parseInt(req.params.recipeId);
  const rating = parseInt(req.body.rating);

  try {
    const validator = jsonschema.validate({ recipeId, rating, username }, ratedRecipeSchema);
    if (validator.errors.length > 0) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const ratedRecipe = await Recipe.rate(recipeId, username, rating);
    return res.status(201).json(ratedRecipe);
  } catch (err) {
    return next(err);
  }
});

/** POST saves a recipe saveRecipe => { recipeId }
 *
 * @recipeId is an Integer
 * Returns { recipeId }
 *
 * Authorization required: admin or correct user
 **/

router.post("/:username/saved/:recipeId", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate({ recipeId: parseInt(req.params.recipeId), username: req.params.username }, savedRecipeSchema);
    if (validator.errors.length > 0) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const savedRecipe = await Recipe.save(req.params.recipeId, req.params.username);
    return res.status(201).json(savedRecipe);
  } catch (err) {
    return next(err);
  }
});

/** DELETE removes a saved recipe savedRecipe => { recipeId }
 *
 * @recipeId is an Integer
 * Returns { recipeId }
 *
 * Authorization required: admin or correct user
 **/

router.delete("/:username/saved/:recipeId", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate({ recipeId: parseInt(req.params.recipeId), username: req.params.username }, savedRecipeSchema);
    if (validator.errors.length > 0) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const removedRecipe = await Recipe.removeSaved(req.params.recipeId, req.params.username);
    return res.status(201).json(removedRecipe);
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
