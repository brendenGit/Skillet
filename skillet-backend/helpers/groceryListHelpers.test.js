"use strict";

const db = require("../db.js");
const GroceryList = require("../models/groceryList/groceryList.js")
const {
    normalizeUnit,
    convertToOunces,
    addIngredient,
    updateIngredient
} = require("./groceryListHelpers.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

//helper function to get groceryListId

async function getGroceryListId() {
    const groceryListId = await db.query(
        `SELECT id
    FROM grocery_lists`
    );
    return groceryListId.rows[0].id;
}

/************************************** normalizeUnit */

describe('normalizeUnit function', () => {
    test('it should normalize units to their abbreviations', () => {
        expect(normalizeUnit('ounce')).toEqual('oz');
        expect(normalizeUnit('pound')).toEqual('lb');
        expect(normalizeUnit('g')).toEqual('g');
        // Add more test cases as needed
    });

    test('it should return null for invalid units', () => {
        expect(normalizeUnit('invalid')).toBeNull();
        // Add more test cases as needed
    });
});

/************************************** convertToOunces */

describe('convertToOunces function', () => {
    test('it should convert amounts to ounces for solid ingredients', () => {
        expect(convertToOunces(1, 'ounce', 'SOLID')).toEqual({ "convertedAmount": 1, "convertedUnit": "oz" });
        expect(convertToOunces(2, 'pound', 'SOLID')).toEqual({ "convertedAmount": 32, "convertedUnit": "oz" });
        expect(convertToOunces(100, 'g', 'SOLID')).toEqual({ "convertedAmount": 3.5274, "convertedUnit": "oz" });
        // Add more test cases as needed
    });

    test('it should convert amounts to fluid ounces for liquid ingredients', () => {
        expect(convertToOunces(8, 'fl oz', 'LIQUID')).toEqual({ "convertedAmount": 8, "convertedUnit": "fl oz" });
        expect(convertToOunces(2, 'c', 'LIQUID')).toEqual({ "convertedAmount": 16, "convertedUnit": "fl oz" });
        expect(convertToOunces(500, 'ml', 'LIQUID')).toEqual({ "convertedAmount": 16.907, "convertedUnit": "fl oz" });
        // Add more test cases as needed
    });

    test('it should return null for invalid units or consistency', () => {
        expect(convertToOunces(1, 'invalid', 'SOLID')).toEqual({ "convertedAmount": null, "convertedUnit": null });
        expect(convertToOunces(1, 'oz', 'invalid')).toEqual({ "convertedAmount": null, "convertedUnit": null });
        // Add more test cases as needed
    });
});

/************************************** addIngredient */

describe("addIngredient", function () {
    test("works", async function () {
        const groceryListId = await getGroceryListId();
        const addedIngredient = await addIngredient(groceryListId, 1, 'white rice', 2, 'cups', "SOLID")
        expect(addedIngredient).toEqual({
            amount: "16.00",
            ingredientName: "white rice",
            unit: "oz"
        });
    });

    test("prompts custom add if conversion was unsuccesful", async function () {
        const groceryListId = await getGroceryListId();
        const addedIngredient = await addIngredient(groceryListId, 1, 'white rice', 2, '', "SOLID")
        expect(addedIngredient).toEqual('custom conversion required');
    });
});

/************************************** update ingredient */

describe("updateIngredient", function () {
    test("works", async function () {
        const groceryListId = await getGroceryListId();
        const addedIngredient = await addIngredient(groceryListId, 1, 'white rice', 2, 'cups', "SOLID")
        const groceryList = await GroceryList.get(groceryListId)
        const updatedIngredient = await updateIngredient(groceryListId, 1, 2, 'cups', "SOLID")
        expect(updatedIngredient).toEqual({
            amount: "32.00",
            ingredientName: "white rice",
            unit: "oz"
        });
    });

    test("prompts custom update if conversion was unsuccesful", async function () {
        const groceryListId = await getGroceryListId();
        await addIngredient(groceryListId, 1, 2, 'cups', "SOLID")
        const updatedIngredient = await updateIngredient(groceryListId, 1, 2, 'cupss', "SOLID")
        expect(updatedIngredient).toEqual('custom conversion required');
    });
});
