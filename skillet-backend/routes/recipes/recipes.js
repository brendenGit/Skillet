"use strict";

/** Routes for recipes. */

const jsonschema = require("jsonschema");
const savedRecipeSchema = require("../../schemas/savedRecipe.json");
const ratedRecipeSchema = require("../../schemas/rateRecipe.json");

const FEATURED_RECIPE_ID = process.env.FEATURED_RECIPE_ID;

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../../middleware/auth.js");
const { BadRequestError } = require("../../expressError.js");
const Recipe = require("../../models/recipe/recipe.js");
const SpoonApi = require("../../helpers/spoonApi.js");

const router = express.Router();

/** GET gets all saved recipes savedRecipes => { savedRecipes: [recipeId, recipeId, ...] }
 *
 * @recipeId is an Integer
 * Returns { savedRecipes: [recipeId, recipeId, ...] }
 *
 * Authorization required: admin or correct user
 **/

router.get("/random", async function (req, res, next) {
  try {
    const recipes = await SpoonApi.getRandomRecipes({ number: 5, ...req.query });
    return res.json({ recipes });
  } catch (err) {
    return next(err);
  }
});

/** GET gets all saved recipes savedRecipes => { savedRecipes: [recipeId, recipeId, ...] }
 *
 * @recipeId is an Integer
 * Returns { savedRecipes: [recipeId, recipeId, ...] }
 *
 **/

router.get("/search", async function (req, res, next) {
  try {
    const recipes = await SpoonApi.getRecipes({ number: 18, ...req.query });
    return res.json({ recipes });
  } catch (err) {
    return next(err);
  }
});

/** GET gets data for featured recipe
 *
 * @recipeId is an Integer
 * Returns { savedRecipes: [recipeId, recipeId, ...] }
 *
 **/

router.get("/featured", async function (req, res, next) {
  try {
    console.log('inside featured')
    const featuredRecipe = await SpoonApi.getRecipeInfo(FEATURED_RECIPE_ID);
    return res.json({ featuredRecipe });
  } catch (err) {
    return next(err);
  }
});


/** GET gets a specific recipes data from the Spoonacular API
 *
 * @recipeId is an Integer
 * Returns { savedRecipes: [recipeId, recipeId, ...] }
 *
 **/

router.get("/:recipeId/info", async function (req, res, next) {
  console.log('inside get recipe route')
  try {
    const recipeId = req.params.recipeId;
    const recipe = await SpoonApi.getRecipeInfo(recipeId);
    return res.json({ recipe });
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
  const recipes = req.body.recipes;
  try {
    const recipeStats = await Promise.all(recipes.map(async (recipe) => {
      return Recipe.getStats(recipe);
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
