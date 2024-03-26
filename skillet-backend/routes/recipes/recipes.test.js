"use strict";

const request = require("supertest");

const db = require("../../db.js");
const app = require("../../app.js");
const Recipe = require("../../models/recipe/recipe.js");


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

/************************************** POST /rate/:recipeId */

describe("POST /rate", function () {
  test("works", async function () {
    const resp = await request(app)
      .post("/recipes/u2/rate/2")
      .send({
        rating: 5
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.body).toEqual({ "newRating": 3, "recipeId": 2 })
    expect(resp.statusCode).toEqual(201)
  })

  test("fails for already rated recipe", async function () {
    const resp = await request(app)
      .post("/recipes/u2/rate/2")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for non-admin and not correct user", async function () {
    const resp = await request(app)
      .post("/recipes/u2/rate/2")
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** POST /:username/save/:recipeId */

describe("POST /:username/save/:recipeId", function () {
  test("works for correct user", async function () {
    const resp = await request(app)
      .post("/recipes/u1/saved/3")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({ "recipeId": 3, });
  });

  test("fails for already saved recipe", async function () {
    const resp = await request(app)
      .post("/recipes/u1/saved/2")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(500);
  });

  test("auth for not correct user but IS admin", async function () {
    const resp = await request(app)
      .post("/recipes/u1/saved/3")
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({ "recipeId": 3, });
  });

  test("unauth for non-admin and not correct user", async function () {
    const resp = await request(app)
      .post("/recipes/u1/saved/3")
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** DELETE /:username/save/:recipeId */

describe("DELETE /:username/save/:recipeId", function () {
  test("works for correct user", async function () {
    const resp = await request(app)
      .delete("/recipes/u1/saved/1")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({ "recipeId": 1, });
  });

  test("fails for not already saved recipe", async function () {
    const resp = await request(app)
      .delete("/recipes/u1/saved/3")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("auth for not correct user but IS admin", async function () {
    const resp = await request(app)
      .delete("/recipes/u1/saved/2")
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({ "recipeId": 2, });
  });

  test("unauth for non-admin and not correct user", async function () {
    const resp = await request(app)
      .delete("/recipes/u1/saved/1")
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** GET /:username/saved */

describe("GET /users", function () {
  test("works for correct user", async function () {
    const resp = await request(app)
      .get("/recipes/u1/saved")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ savedRecipes: [1, 2] });
  });

  test("auth for not correct user but IS admin", async function () {
    const resp = await request(app)
      .get("/recipes/u1/saved")
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({ savedRecipes: [1, 2] });
  });

  test("unauth for non-admin and not correct user", async function () {
    const resp = await request(app)
      .get("/recipes/u1/saved")
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** GET /:username/rated */

describe("GET /users", function () {
  test("works for correct user", async function () {
    const resp = await request(app)
      .get("/recipes/u1/rated")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ ratedRecipes: [1, 2] });
  });

  test("auth for not correct user but IS admin", async function () {
    const resp = await request(app)
      .get("/recipes/u1/rated")
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({ ratedRecipes: [1, 2] });
  });

  test("unauth for non-admin and not correct user", async function () {
    const resp = await request(app)
      .get("/recipes/u1/rated")
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** POST /stats */

describe("POST /stats", function () {
  test("works", async function () {
    const resp = await request(app)
      .post("/recipes/stats")
      .send({
        recipes: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual([
      { "id": 1, "rating": 4, "saveCount": 1 },
      { "id": 2, "rating": 2, "saveCount": 1 },
      { "id": 3, "rating": 0, "recipeId": 3, "saveCount": 0 },
      { "id": 4, "rating": 0, "recipeId": 4, "saveCount": 0 }
    ]);
  });
});