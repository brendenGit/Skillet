"use strict";

const { NotFoundError, BadRequestError } = require("../../expressError.js");
const db = require("../../db.js");
const GroceryList = require("../groceryList/groceryList.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
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
    const userId = await getUserId("u1");
    let goceryList = await GroceryList.create(userId);
    expect(goceryList).toEqual({
      id: expect.any(Number),
      groceryListName: null,
      createdAt: expect.any(Date)
    });
  });

  test("works with grocery list title", async function () {
    const userId = await getUserId("u1");
    const groceryListName = "test grocery list";
    let goceryList = await GroceryList.create(userId, groceryListName);
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
    const userId = await getUserId("u1");
    let groceryLists = await GroceryList.getGroceryLists(userId);
    expect(groceryLists).toEqual([
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
    ])
  });

  test("returns empty list if no lists in db", async function () {
    const userId = await getUserId("u2");
    let groceryLists = await GroceryList.getGroceryLists(userId);
    expect(groceryLists).toEqual([])
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

  test("not found if no such job", async function () {
    try {
      await GroceryList.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// /************************************** update */

// describe("update", function () {
//   let updateData = {
//     title: "New",
//     salary: 500,
//     equity: "0.5",
//   };
//   test("works", async function () {
//     let job = await Job.update(testJobIds[0], updateData);
//     expect(job).toEqual({
//       id: testJobIds[0],
//       companyHandle: "c1",
//       ...updateData,
//     });
//   });

//   test("not found if no such job", async function () {
//     try {
//       await Job.update(0, {
//         title: "test",
//       });
//       fail();
//     } catch (err) {
//       expect(err instanceof NotFoundError).toBeTruthy();
//     }
//   });

//   test("bad request with no data", async function () {
//     try {
//       await Job.update(testJobIds[0], {});
//       fail();
//     } catch (err) {
//       expect(err instanceof BadRequestError).toBeTruthy();
//     }
//   });
// });

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    const groceryListId = await getGroceryListId();
    await GroceryList.remove(groceryListId);
    const res = await db.query(
        "SELECT id FROM grocery_lists WHERE id=$1", [groceryListId]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await GroceryList.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
