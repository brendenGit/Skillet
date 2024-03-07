"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../../expressError.js");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../../middleware/auth.js");
const GroceryList = require("../../models/groceryList/groceryList.js");

const newGroceryListSchema = require("../../schemas/newGroceryList.json");
const updateGroceryListSchema = require("../../schemas/updateGroceryList.json");

const router = new express.Router();


/** GET / groceryListId =>  { groceryList: { ...groceryList, ingredients: [ingredientList] } };
 *
 * @groceryListId is an int value from DOM key
 *
 * Returns  { groceryList: { ...groceryList, ingredients: [ingredientList] } }
 *
 * Authorization required: ensureCorrectUserOrAdmin
 */

router.get("/:username/:groceryListId", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const groceryList = await GroceryList.get(req.params.groceryListId);
    return res.json(groceryList);
  } catch (err) {
    return next(err);
  }
});

/** GET /  groceryLists => {groceryLists: [{groceryList}, {groceryList}, ...]}
 *                where groceryList => { createdAt: String, groceryListName: String, id: Int }
 *
 * Authorization required: correct user or admin
 */

router.get("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const groceryLists = await GroceryList.getGroceryLists(req.params.username);
    return res.json(groceryLists);
  } catch (err) {
    return next(err);
  }
});

/** POST /  groceryLists => {groceryLists: [{groceryList}, {groceryList}, ...]}
 *                where groceryList => { createdAt: String, groceryListName: String, id: Int }
 *
 * Authorization required: correct user or admin
 */

router.post("/:username/new", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate({ username: req.params.username, groceryListName: req.body.groceryListName || null }, newGroceryListSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const groceryList = await GroceryList.create(req.params.username, req.body.groceryListName || null);
    return res.status(201).json({ groceryList: groceryList });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /grocery-lists/:username/:groceryListId (groceryListId, [ingredients]) => {[added/updated ingredients]}
 *
 * Patches grocery list ingredients.
 *
 * Authorization required: correct user or admin
 */

router.patch("/:username/:groceryListId", ensureCorrectUserOrAdmin, async function (req, res, next) {
  console.log({ groceryListId: req.params.groceryListId, ...req.body });
  try {
    const validator = jsonschema.validate({ groceryListId: req.params.groceryListId, ...req.body }, updateGroceryListSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const ingredients = await GroceryList.updateOrAddIngredient(req.params.groceryListId, req.body);
    return res.json(ingredients);
  } catch (err) {
    return next(err);
  }
});

/** DELETE /:username/:groceryListId  =>  { deleted: "deleted grocery list" }
 *
 * Authorization: correct user or admin
 */

router.delete("/:username/:groceryListId", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    await GroceryList.remove(req.params.groceryListId);
    return res.json({ success: "deleted grocery list" });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
