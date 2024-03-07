const { BadRequestError } = require("../expressError.js");
const db = require("../db.js");

/**
 * Helpers for making selective update queries.
 * 
 * func @normalizeUnit converts a units name to a standard abreviation
 * func @convertToOunces converts the unit to either solid or liquid ounces
 * 
 * both of these functions help us accurately sum ingredients when we find common ingredients 
 * in a grocery list
 * 
 */

function normalizeUnit(unit) {
    switch (unit.toLowerCase()) {
        case 'oz':
        case 'ounce':
        case 'ounces':
            return 'oz';
        case 'lb':
        case 'pound':
        case 'pounds':
            return 'lb';
        case 'g':
        case 'gram':
        case 'grams':
            return 'g';
        case 'kg':
        case 'kilogram':
        case 'kilograms':
            return 'kg';
        case 'c':
        case 'cup':
        case 'cups':
            return 'c';
        case 'tbsp':
        case 'tablespoon':
        case 'tablespoons':
            return 'tbsp';
        case 'tsp':
        case 'teaspoon':
        case 'teaspoons':
            return 'tsp';
        case 'ml':
        case 'milliliter':
        case 'milliliters':
            return 'ml';
        case 'l':
        case 'liter':
        case 'liters':
            return 'l';
        case 'fl oz':
        case 'fluid ounce':
        case 'fluid ounces':
            return 'fl oz';
        case 'pt':
        case 'pint':
        case 'pints':
            return 'pt';
        case 'qt':
        case 'quart':
        case 'quarts':
            return 'qt';
        case 'gal':
        case 'gallon':
        case 'gallons':
            return 'gal';
        default:
            return null; // Invalid unit or whole unit
    }
}

function convertToOunces(amount, unit, consistency) {
    unit = normalizeUnit(unit);
    const nullResult = { "convertedAmount": null, "convertedUnit": null }
    if (!unit) {
        return nullResult;
    }

    let conversionFactor;
    let convertedUnit;

    if (consistency === "SOLID") {
        convertedUnit = 'oz';
        switch (unit) {
            case 'oz':
                conversionFactor = 1;
                break;
            case 'lb':
                conversionFactor = 16;
                break;
            case 'g':
                conversionFactor = 0.035274;
                break;
            case 'kg':
                conversionFactor = 35.274;
                break;
            case 'c':
                conversionFactor = 8;
                break;
            case 'tbsp':
                conversionFactor = 0.5;
                break;
            case 'tsp':
                conversionFactor = 0.166667;
                break;
            case 'ml':
                conversionFactor = 0.033814;
                break;
            case 'l':
                conversionFactor = 33.814;
                break;
            default:
                return nullResult; // Invalid unit
        }
    } else if (consistency === "LIQUID") {
        convertedUnit = 'fl oz';
        switch (unit) {
            case 'fl oz':
                conversionFactor = 1;
                break;
            case 'c':
                conversionFactor = 8;
                break;
            case 'pt':
                conversionFactor = 16;
                break;
            case 'qt':
                conversionFactor = 32;
                break;
            case 'gal':
                conversionFactor = 128;
                break;
            case 'tsp':
                conversionFactor = 0.166667;
                break;
            case 'tbsp':
                conversionFactor = 0.5;
                break;
            case 'ml':
                conversionFactor = 0.033814;
                break;
            case 'l':
                conversionFactor = 33.814;
                break;
            default:
                return nullResult;
        }
    } else {
        return nullResult;
    }

    return { convertedAmount: amount * conversionFactor, convertedUnit: convertedUnit };
}

/**
 * Helper functions for making selective update queries or adding initial add of ingredient
 * 
 */

/************************************** add ingredient */

async function addIngredient(groceryListId, ingredientId, ingredientName, amount, unit, consistency) {
    const { convertedAmount, convertedUnit } = convertToOunces(amount, unit, consistency);
    if (convertedAmount) {
        const result = await db.query(
            `INSERT INTO ingredient_in_grocery_list(grocery_list_id,
                                                      ingredient_id,
                                                      ingredient_name,
                                                      amount,
                                                      unit)
              VALUES ($1, $2, $3, $4, $5)
              RETURNING ingredient_name AS "ingredientName", amount, unit`,
            [groceryListId, ingredientId, ingredientName, convertedAmount, convertedUnit]);
        return result.rows[0];
    } else {
        return { customConversionRequired: ingredientName };
    }
}

/************************************** update ingredient */

async function updateIngredient(groceryListId, ingredientId, amount, unit, consistency) {
    const { convertedAmount } = convertToOunces(amount, unit, consistency);
    if (convertedAmount) {
        const result = await db.query(
            `UPDATE ingredient_in_grocery_list
            SET amount = amount + $1
            WHERE grocery_list_id = $2 AND ingredient_id = $3
            RETURNING ingredient_name AS "ingredientName", amount, unit`,
            [convertedAmount, groceryListId, ingredientId]);
        return result.rows[0];
    } else {
        return { customConversionRequired: ingredientName };
    }
}

module.exports = { normalizeUnit, convertToOunces, addIngredient, updateIngredient };
