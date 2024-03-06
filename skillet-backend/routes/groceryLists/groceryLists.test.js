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

// /************************************** GET /companies/:handle */

// describe("GET /companies/:handle", function () {
//   test("works for anon", async function () {
//     const resp = await request(app).get(`/companies/c1`);
//     expect(resp.body).toEqual({
//       company: {
//         handle: "c1",
//         name: "C1",
//         description: "Desc1",
//         numEmployees: 1,
//         logoUrl: "http://c1.img",
//         jobs: [
//           { id: testJobIds[0], title: "J1", equity: "0.1", salary: 1 },
//           { id: testJobIds[1], title: "J2", equity: "0.2", salary: 2 },
//           { id: testJobIds[2], title: "J3", equity: null, salary: 3 },
//         ],
//       },
//     });
//   });

//   test("works for anon: company w/o jobs", async function () {
//     const resp = await request(app).get(`/companies/c2`);
//     expect(resp.body).toEqual({
//       company: {
//         handle: "c2",
//         name: "C2",
//         description: "Desc2",
//         numEmployees: 2,
//         logoUrl: "http://c2.img",
//         jobs: [],
//       },
//     });
//   });

//   test("not found for no such company", async function () {
//     const resp = await request(app).get(`/companies/nope`);
//     expect(resp.statusCode).toEqual(404);
//   });
// });

// /************************************** PATCH /companies/:handle */

// describe("PATCH /companies/:handle", function () {
//   test("works for admin", async function () {
//     const resp = await request(app)
//         .patch(`/companies/c1`)
//         .send({
//           name: "C1-new",
//         })
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.body).toEqual({
//       company: {
//         handle: "c1",
//         name: "C1-new",
//         description: "Desc1",
//         numEmployees: 1,
//         logoUrl: "http://c1.img",
//       },
//     });
//   });

//   test("unauth for non-admin", async function () {
//     const resp = await request(app)
//         .patch(`/companies/c1`)
//         .send({
//           name: "C1-new",
//         })
//         .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//         .patch(`/companies/c1`)
//         .send({
//           name: "C1-new",
//         });
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found on no such company", async function () {
//     const resp = await request(app)
//         .patch(`/companies/nope`)
//         .send({
//           name: "new nope",
//         })
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });

//   test("bad request on handle change attempt", async function () {
//     const resp = await request(app)
//         .patch(`/companies/c1`)
//         .send({
//           handle: "c1-new",
//         })
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(400);
//   });

//   test("bad request on invalid data", async function () {
//     const resp = await request(app)
//         .patch(`/companies/c1`)
//         .send({
//           logoUrl: "not-a-url",
//         })
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(400);
//   });
// });

// /************************************** DELETE /companies/:handle */

// describe("DELETE /companies/:handle", function () {
//   test("works for admin", async function () {
//     const resp = await request(app)
//         .delete(`/companies/c1`)
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.body).toEqual({ deleted: "c1" });
//   });

//   test("unauth for non-admin", async function () {
//     const resp = await request(app)
//         .delete(`/companies/c1`)
//         .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//         .delete(`/companies/c1`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found for no such company", async function () {
//     const resp = await request(app)
//         .delete(`/companies/nope`)
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });
// });
