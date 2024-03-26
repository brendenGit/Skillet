"use strict";

const {
  NotFoundError,
} = require("../../expressError.js");
const db = require("../../db.js");
const Recipe = require("./recipe.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} = require("../_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** getSaved */

describe("getSaved", function () {
  test("works", async function () {
    const recipes = await Recipe.getSaved("u1");
    if (recipes.length === 0) {
      expect(recipes).toEqual([]);
    } else {
      expect(recipes).toEqual(expect.arrayContaining(
        recipes.map((item) => expect.any(Number))
      ));
    }
  });
});

/************************************** getRated */

describe("getRated", function () {
  test("works", async function () {
    const recipes = await Recipe.getRated("u1");
    if (recipes.length === 0) {
      expect(recipes).toEqual([]);
    } else {
      expect(recipes).toEqual(expect.arrayContaining(
        recipes.map((item) => expect.any(Number))
      ));
    }
  });
});

/************************************** getStats */

describe("getStats", function () {
  test("works", async function () {
    const recipeStats = await Recipe.getStats({ id: 1 });
    expect(recipeStats).toEqual({ "id": 1, "rating": 4, "saveCount": 5 });
  });

  test("creates new stats if none found", async function () {
    const recipeStats = await Recipe.getStats({ id: 4 });
    expect(recipeStats).toEqual({ "id": 4, "rating": 0, "recipeId": 4, "saveCount": 0 });
  });
});

/************************************** createStats */

describe("createStats", function () {
  test("works", async function () {
    const newStats = await Recipe.createStats(50);
    expect(newStats).toEqual({ "rating": 0, "recipeId": 50, "saveCount": 0 });
  });

  test("fails if recipe's stats already exsist", async function () {
    await expect(Recipe.createStats(1)).rejects.toThrow();
  });
});

/************************************** save */

describe("save", function () {
  test("works", async function () {
    let savedRecipe = await Recipe.save(5, 'u1');
    expect(savedRecipe).toEqual({ "recipeId": 5 });
  });

  test("fails if recipe is already saved", async function () {
    await expect(Recipe.save(1, 'u1')).rejects.toThrow();
  });
});

/************************************** rate */

describe("rate", function () {
  test("works", async function () {
    let ratedRecipe = await Recipe.rate(2, 'u2', 5);
    expect(ratedRecipe).toEqual({ "newRating": 4, "recipeId": 2 });
  });

  test("works for exsisting stats but not yet rated by user", async function () {
    let ratedRecipe = await Recipe.rate(2, 'u2', 5);
    expect(ratedRecipe).toEqual({ "newRating": 4, "recipeId": 2 });
  });

  test("fails if recipe is already rated", async function () {
    await expect(Recipe.rate(1, 'u1')).rejects.toThrow();
  });
});

/************************************** removeSaved */

describe("removeSaved", function () {
  test("works", async function () {
    let removedRecipe = await Recipe.removeSaved(1, 'u1');
    expect(removedRecipe).toEqual({ "recipeId": 1 });
  });

  test("not found if recipe not yet saved", async function () {
    try {
      await Recipe.removeSaved(50, 'u1');
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** updateCount */

describe("updateCount", function () {
  test("works with positive number", async function () {
    let saveCount = await Recipe.updateCount(1, +1);
    expect(saveCount).toEqual({ "saveCount": 6 });
  });

  test("works with negative number", async function () {
    let saveCount = await Recipe.updateCount(1, -1);
    expect(saveCount).toEqual({ "saveCount": 4 });
  });
});

/************************************** updateRating */

describe("updateRating", function () {
  test("works with exsisting stats", async function () {
    let rating = await Recipe.updateRating(1, 2);
    expect(rating).toEqual(4);
  });
});
