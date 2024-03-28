"use strict";

const { NotFoundError } = require("../../expressError.js");
const db = require("../../db.js");
const GroceryList = require("../groceryList/groceryList.js");
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

//helper function to get userId

async function getUserId(username) {
  const userId = await db.query(
    `SELECT id
    FROM users
    WHERE username = $1`, [username]
  );
  return userId.rows[0].id;
}

//helper function to get groceryListId

async function getGroceryListId() {
  const groceryListId = await db.query(
    `SELECT id
    FROM grocery_lists`
  );
  return groceryListId.rows[0].id;
}

/************************************** create */

describe("create", function () {
  test("works without grocery list title", async function () {
    let goceryList = await GroceryList.create('u1');
    expect(goceryList).toEqual({
      id: expect.any(Number),
      groceryListName: null,
      createdAt: expect.any(Date)
    });
  });

  test("works with grocery list title", async function () {
    const groceryListName = "test grocery list";
    let goceryList = await GroceryList.create('u1', groceryListName);
    expect(goceryList).toEqual({
      id: expect.any(Number),
      groceryListName: "test grocery list",
      createdAt: expect.any(Date)
    });
  });
});

/************************************** getGroceryLists */

describe("getGroceryLists", function () {
  test("works", async function () {
    let groceryLists = await GroceryList.getGroceryLists('u1');
    expect(groceryLists).toEqual({
      groceryLists: [
        {
          id: expect.any(Number),
          groceryListName: null,
          createdAt: expect.any(Date)
        },
        {
          id: expect.any(Number),
          groceryListName: "test list 1",
          createdAt: expect.any(Date)
        },
        {
          id: expect.any(Number),
          groceryListName: "test list 2",
          createdAt: expect.any(Date)
        },
        {
          id: expect.any(Number),
          groceryListName: null,
          createdAt: expect.any(Date)
        },
      ]
    })
  });

  test("returns empty list if no lists in db", async function () {
    let groceryLists = await GroceryList.getGroceryLists('u2');
    expect(groceryLists).toEqual({ groceryLists: [] })
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    const groceryListId = await getGroceryListId();
    let groceryList = await GroceryList.get(groceryListId);
    expect(groceryList).toEqual({
      groceryList: {
        id: expect.any(Number),
        groceryListName: null,
        createdAt: expect.any(Date),
        ingredients: expect.any(Array)
      }
    });
  });

  test("not found if no such grocery list", async function () {
    try {
      await GroceryList.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** updateOrAddIngredient */

describe("updateOrAddIngredient", function () {
  const ingredientAddData = {
    ingredientId: 10,
    ingredientName: "flour",
    amount: 2,
    unit: "cups",
    consistency: "SOLID"
  }

  const ingredientsAdd = {
    ingredients: [ingredientAddData]
  };

  const ingredientAddExistingData = {
    ingredientId: 1,
    ingredientName: "white rice",
    amount: 2,
    unit: "cups",
    consistency: "SOLID"
  }

  const ingredientsAddExisting = {
    ingredients: [ingredientAddExistingData]
  };

  const zerodIngredient = {
    ingredientId: 1,
    ingredientName: "white rice",
    amount: -2,
    unit: "cups",
    consistency: "SOLID"
  }

  const removeZerodIngredient = {
    ingredients: [zerodIngredient]
  };

  test("adding new ingredient works", async function () {
    const groceryListId = await getGroceryListId();
    const addedIngredient = await GroceryList.updateOrAddIngredient(groceryListId, ingredientsAdd);
    const groceryList = await GroceryList.get(groceryListId);
    expect(addedIngredient).toEqual([{
      ingredientName: "flour",
      amount: "16.00",
      unit: "oz"
    }]);
    expect(groceryList.groceryList.ingredients.some(ingredient => ingredient.ingredientName === "flour")).toBe(true);
  });

  test("adding an existing ingredient works", async function () {
    const groceryListId = await getGroceryListId();
    const updatedIngredient = await GroceryList.updateOrAddIngredient(groceryListId, ingredientsAddExisting);
    expect(updatedIngredient).toEqual([{
      amount: "32.00",
      ingredientName: "white rice",
      unit: "oz"
    }]);
  });

  test("updating an existing ingredient to 0 works", async function () {
    const groceryListId = await getGroceryListId();
    await GroceryList.updateOrAddIngredient(groceryListId, removeZerodIngredient);
    let groceryList = await GroceryList.get(groceryListId);
    expect(groceryList.groceryList.ingredients.some(ingredient => ingredient.ingredientName === 'white rice')).toBe(false);
  });
});

/************************************** remove ingredient from grocery list */

describe("removeIngredient", function () {
  test("works", async function () {
    const groceryListId = await getGroceryListId();
    const res = await GroceryList.removeIngredient(groceryListId, 1);
    expect(res).toEqual('white rice');
  });

  test("not found if no such ingredient", async function () {
    try {
      const groceryListId = await getGroceryListId();
      await GroceryList.removeIngredient(groceryListId, 50);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** remove grocery list*/

describe("remove", function () {
  test("works", async function () {
    const groceryListId = await getGroceryListId();
    await GroceryList.remove(groceryListId);
    const res = await db.query(
      "SELECT id FROM grocery_lists WHERE id=$1", [groceryListId]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such grocery list", async function () {
    try {
      await GroceryList.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
