"use strict";

const request = require("supertest");
const GroceryList = require("../../models/groceryList/groceryList.js");
const User = require("../../models/user/user.js");
const app = require("../../app.js");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken,
} = require("../_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /grocery-list (individual list) */

describe("GET /:username/:groceryListId", function () {
  test("works for signed in user", async function () {
    const glRes = await GroceryList.create('u1', "Test Grocery List");
    const glId = glRes.id

    const resp = await request(app)
      .get(`/grocery-lists/u1/${glId}`)
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.body).toEqual({
      groceryList: {
        createdAt: expect.any(String),
        groceryListName: "Test Grocery List",
        id: expect.any(Number),
        ingredients: []
      },
    });
  });

  test("auth for not correct user but IS admin", async function () {
    const glRes = await GroceryList.create('u1', "Test Grocery List");
    const glId = glRes.id

    const resp = await request(app)
      .get(`/grocery-lists/u1/${glId}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(200);
  });

  test("unauth for non-admin and not correct user", async function () {
    const glRes = await GroceryList.create('u1', "Test Grocery List");
    const glId = glRes.id

    const resp = await request(app)
      .get(`/grocery-lists/u1/${glId}`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** GET /grocery-lists (all grocery lists) */

describe("GET /:username", function () {
  test("works for signed in user", async function () {
    await GroceryList.create('u1', "Test Grocery List");
    await GroceryList.create('u1', "Test Grocery List 2");

    const resp = await request(app)
      .get("/grocery-lists/u1")
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.body).toEqual({
      groceryLists: [
        {
          createdAt: expect.any(String),
          groceryListName: "Test Grocery List",
          id: expect.any(Number),
        },
        {
          createdAt: expect.any(String),
          groceryListName: "Test Grocery List 2",
          id: expect.any(Number),
        }
      ]
    });
  });

  test("auth for not correct user but IS admin", async function () {
    await GroceryList.create('u1', "Test Grocery List");
    await GroceryList.create('u1', "Test Grocery List 2");

    const resp = await request(app)
      .get("/grocery-lists/u1")
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(200);
  });

  test("unauth for non-admin and not correct user", async function () {
    await GroceryList.create('u1', "Test Grocery List");
    await GroceryList.create('u1', "Test Grocery List 2");

    const resp = await request(app)
      .get("/grocery-lists/u1")
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

});

/************************************** POST /grocery-lists/:username/new */

describe("POST /grocery-lists/:username/new", function () {
  const newGroceryListWithTitle = {
    groceryListName: "New Test Grocery List",
  };

  test("ok for correct user", async function () {
    const resp = await request(app)
      .post("/grocery-lists/u1/new")
      .send(newGroceryListWithTitle)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      groceryList: {
        createdAt: expect.any(String),
        groceryListName: "New Test Grocery List",
        id: expect.any(Number)
      }
    });
  });

  test("auth for not correct user but IS admin", async function () {
    const resp = await request(app)
      .post("/grocery-lists/u1/new")
      .send(newGroceryListWithTitle)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
  });

  test("unauth for non-admin and not correct user", async function () {
    const resp = await request(app)
      .post("/grocery-lists/u1/new")
      .send(newGroceryListWithTitle)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** PATCH /grocery-lists/:username/:groceryListId */

describe("PATCH /grocery-lists/", function () {
  test("works for correct user adding multiple ingredients", async function () {
    const glRes = await GroceryList.create('u1', "Test Grocery List");
    const glId = glRes.id

    const resp = await request(app)
      .patch(`/grocery-lists/u1/${glId}`)
      .send({
        ingredients: [
          {
            ingredientId: 1,
            ingredientName: 'white rice',
            amount: 2,
            unit: 'cups',
            consistency: 'SOLID'
          },
          {
            ingredientId: 2,
            ingredientName: 'alaskan salmon',
            amount: 1,
            unit: 'pound',
            consistency: 'SOLID'
          },
          {
            ingredientId: 3,
            ingredientName: 'soy sauce',
            amount: 2,
            unit: 'tbsp',
            consistency: 'LIQUID'
          },
        ]
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.body).toEqual([
      {
        "amount": "16.00",
        "ingredientName": "white rice",
        "unit": "oz"
      },
      {
        "amount": "16.00",
        "ingredientName": "alaskan salmon",
        "unit": "oz"
      },
      {
        "amount": "1.00",
        "ingredientName": "soy sauce",
        "unit": "fl oz",
      },
    ]);
  });

  test("works for correct user adding a single ingredient", async function () {
    const glRes = await GroceryList.create('u1', "Test Grocery List");
    const glId = glRes.id

    const resp = await request(app)
      .patch(`/grocery-lists/u1/${glId}`)
      .send({
        ingredients: [
          {
            ingredientId: 1,
            ingredientName: 'white rice',
            amount: 2,
            unit: 'cups',
            consistency: 'SOLID'
          }
        ]
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.body).toEqual([
      {
        "amount": "16.00",
        "ingredientName": "white rice",
        "unit": "oz"
      }
    ]);
  });

  test("works for correct user updating a single ingredient", async function () {
    const glRes = await GroceryList.create('u1', "Test Grocery List");
    const glId = glRes.id

    await GroceryList.updateOrAddIngredient(glId, { ingredients: [{ ingredientId: 1, ingredientName: 'white rice', amount: 1, unit: 'cup', consistency: 'SOLID' }] })

    const resp = await request(app)
      .patch(`/grocery-lists/u1/${glId}`)
      .send({
        ingredients: [
          {
            ingredientId: 1,
            ingredientName: 'white rice test',
            amount: 2,
            unit: 'cups',
            consistency: 'SOLID'
          }
        ]
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.body).toEqual([
      {
        "amount": "24.00",
        "ingredientName": "white rice",
        "unit": "oz"
      }
    ]);
  });

  test("works for correct user updating a single ingredient causing zero remainder", async function () {
    const glRes = await GroceryList.create('u1', "Test Grocery List");
    const glId = glRes.id

    await GroceryList.updateOrAddIngredient(glId, { ingredients: [{ ingredientId: 1, ingredientName: 'white rice', amount: 1, unit: 'cup', consistency: 'SOLID' }] })

    const resp = await request(app)
      .patch(`/grocery-lists/u1/${glId}`)
      .send({
        ingredients: [
          {
            ingredientId: 1,
            ingredientName: 'white rice test',
            amount: -1,
            unit: 'cups',
            consistency: 'SOLID'
          }
        ]
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.body).toEqual([
      {
        "removed": "white rice"
      }
    ]);
  });

  test("works for correct user updating multiple ingredients causing zero remainder", async function () {
    const glRes = await GroceryList.create('u1', "Test Grocery List");
    const glId = glRes.id

    const ingredientData = {
      ingredients: [
        {
          ingredientId: 1,
          ingredientName: 'white rice',
          amount: 1,
          unit: 'cup',
          consistency: 'SOLID'
        },
        {
          ingredientId: 2,
          ingredientName: 'soy sauce',
          amount: 1,
          unit: 'tbsp',
          consistency: 'LIQUID'
        }
      ]
    }

    await GroceryList.updateOrAddIngredient(glId, ingredientData)

    const resp = await request(app)
      .patch(`/grocery-lists/u1/${glId}`)
      .send({
        ingredients: [
          {
            ingredientId: 1,
            ingredientName: 'white rice test',
            amount: -1,
            unit: 'cups',
            consistency: 'SOLID'
          },
          {
            ingredientId: 2,
            ingredientName: 'soy sauce',
            amount: -1,
            unit: 'tbsp',
            consistency: 'LIQUID'
          }
        ]
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.body).toEqual([
      {
        "removed": "white rice"
      },
      {
        "removed": "soy sauce"
      }
    ]);
  });

  test("works for correct user updating multiple ingredients", async function () {
    const glRes = await GroceryList.create('u1', "Test Grocery List");
    const glId = glRes.id

    const ingredientData = {
      ingredients: [
        {
          ingredientId: 1,
          ingredientName: 'white rice',
          amount: 1,
          unit: 'cup',
          consistency: 'SOLID'
        },
        {
          ingredientId: 2,
          ingredientName: 'soy sauce',
          amount: 1,
          unit: 'tbsp',
          consistency: 'LIQUID'
        }
      ]
    }

    await GroceryList.updateOrAddIngredient(glId, ingredientData)

    const resp = await request(app)
      .patch(`/grocery-lists/u1/${glId}`)
      .send({
        ingredients: [
          {
            ingredientId: 1,
            ingredientName: 'white rice',
            amount: 2,
            unit: 'cups',
            consistency: 'SOLID'
          },
          {
            ingredientId: 2,
            ingredientName: 'soy sauce',
            amount: 2,
            unit: 'tbsp',
            consistency: 'LIQUID'
          }
        ]
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.body).toEqual([
      {
        "amount": "24.00",
        "ingredientName": "white rice",
        "unit": "oz"
      },
      {
        "amount": "1.50",
        "ingredientName": "soy sauce",
        "unit": "fl oz"
      }
    ]);
  });

  test("auth for not correct user but IS admin", async function () {
    const glRes = await GroceryList.create('u1', "Test Grocery List");
    const glId = glRes.id

    const resp = await request(app)
      .patch(`/grocery-lists/u1/${glId}`)
      .send({
        ingredients: [
          {
            ingredientId: 1,
            ingredientName: 'white rice',
            amount: 2,
            unit: 'cups',
            consistency: 'SOLID'
          },
          {
            ingredientId: 2,
            ingredientName: 'alaskan salmon',
            amount: 1,
            unit: 'pound',
            consistency: 'SOLID'
          },
        ]
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(200);
  });

  test("unauth for non-admin and not correct user", async function () {
    const glRes = await GroceryList.create('u1', "Test Grocery List");
    const glId = glRes.id

    const resp = await request(app)
      .patch(`/grocery-lists/u1/${glId}`)
      .send({
        ingredients: [
          {
            ingredientId: 1,
            ingredientName: 'white rice',
            amount: 2,
            unit: 'cups',
            consistency: 'SOLID'
          },
          {
            ingredientId: 2,
            ingredientName: 'alaskan salmon',
            amount: 1,
            unit: 'pound',
            consistency: 'SOLID'
          },
        ]
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** DELETE /grocery-lists/:username/:groceryListId/ingredients/:ingredientId */

describe("DELETE /grocery-lists/:username/:groceryListId/ingredients/:ingredientId", function () {

  test("works for correct user", async function () {
    const glRes = await GroceryList.create('u1', "Test Grocery List");
    const glId = glRes.id

    await GroceryList.updateOrAddIngredient(glId, { ingredients: [{ ingredientId: 1, ingredientName: 'white rice', amount: 1, unit: 'cup', consistency: 'SOLID' }] })

    const resp = await request(app)
      .delete(`/grocery-lists/u1/${glId}/ingredients/1`)
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.body).toEqual(
      {
        "removed": "white rice"
      }
    );
  });

  test("auth for not correct user but IS admin", async function () {
    const glRes = await GroceryList.create('u1', "Test Grocery List");
    const glId = glRes.id

    await GroceryList.updateOrAddIngredient(glId, { ingredients: [{ ingredientId: 1, ingredientName: 'white rice', amount: 1, unit: 'cup', consistency: 'SOLID' }] })

    const resp = await request(app)
      .delete(`/grocery-lists/u1/${glId}/ingredients/1`)
      .set("authorization", `Bearer ${adminToken}`);

    expect(resp.statusCode).toEqual(200);
  });

  test("unauth for non-admin and NOT correct user", async function () {
    const glRes = await GroceryList.create('u1', "Test Grocery List");
    const glId = glRes.id

    await GroceryList.updateOrAddIngredient(glId, { ingredients: [{ ingredientId: 1, ingredientName: 'white rice', amount: 1, unit: 'cup', consistency: 'SOLID' }] })

    const resp = await request(app)
      .delete(`/grocery-lists/u1/${glId}/ingredients/1`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** DELETE /grocery-lists/:username/:groceryListId */

describe("DELETE /grocery-lists/:username/:groceryListId", function () {

  test("works for correct user", async function () {
    const glRes = await GroceryList.create('u1', "Test Grocery List");
    const glId = glRes.id

    const resp = await request(app)
      .delete(`/grocery-lists/u1/${glId}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ success: "deleted grocery list" });
  });

  test("auth for not correct user but IS admin", async function () {
    const glRes = await GroceryList.create('u1', "Test Grocery List");
    const glId = glRes.id

    const resp = await request(app)
      .delete(`/grocery-lists/u1/${glId}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ success: "deleted grocery list" });
  });

  test("unauth for non-admin and NOT correct user", async function () {
    const glRes = await GroceryList.create('u1', "Test Grocery List");
    const glId = glRes.id

    const resp = await request(app)
      .delete(`/grocery-lists/u1/${glId}`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });
});
