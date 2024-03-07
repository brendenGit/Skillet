"use strict";

const db = require("../../db");
const { NotFoundError } = require("../../expressError");
const { sqlForPartialUpdate } = require("../../helpers/sql");
const { addIngredient, updateIngredient } = require("../../helpers/groceryListHelpers");


/** Related functions for grocery lists. */

class GroceryList {
  /** Create a grocery list 
   *
   * REQUIRED
   * @username stored {here} when user is logged in
   * 
   * OPTIONAL
   * @groceryListName user sent name for grocery list
   * 
   * Returns { id: int, groceryListName: string, createdAt: string  }
   * 
   **/

  static async create(username, groceryListName) {
    const queryString =
      groceryListName ?
        `INSERT INTO grocery_lists (created_by,
                                    grocery_list_name)
        VALUES ($1, $2)
        RETURNING id, grocery_list_name AS "groceryListName", created_at AS "createdAt"`
        :
        `INSERT INTO grocery_lists (created_by)
        VALUES ($1)
        RETURNING id, grocery_list_name AS "groceryListName", created_at AS "createdAt"`

    const queryVariables =
      groceryListName ?
        [username, groceryListName]
        :
        [username]

    const result = await db.query(queryString, queryVariables);
    let groceryList = result.rows[0];

    return groceryList;
  }

  /** Find all grocery lists for a specific user.
   *
   * REQUIRED
   * @userId stored {here} when user is logged in
   *
   * Returns list of grocery list objects [{ id: int, groceryListName: string, createdAt: date}, ...]
   * 
   * */

  static async getGroceryLists(username) {
    const groceryListsRes = await db.query(`SELECT id,
                                                  created_at as "createdAt",
                                                  grocery_list_name as "groceryListName"
                                            FROM grocery_lists 
                                            WHERE created_by = $1`,
      [username]);
    return { groceryLists: groceryListsRes.rows };
  }

  /** Given a grocery list id, return data about grocery list.
   *
   * REQUIRED
   * @id a grocery list ID
   * 
   * Returns { id: int, createdAt: date, groceryListName: string/null }
   *   where ingredients => [{ ingredientId: int, ingredientName: string, amount: string, unit: string (oz/fl oz) }, {ingredient}, ...]
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const groceryListRes = await db.query(
      `SELECT id,
              created_at AS "createdAt",
              grocery_list_name AS "groceryListName"
      FROM grocery_lists
      WHERE id = $1`,
      [id]);

    const ingredientRes = await db.query(
      `SELECT ingredient_id AS "ingredientId",
              ingredient_name AS "ingredientName",
              amount,
              unit
        FROM ingredient_in_grocery_list
        WHERE grocery_list_id = $1`,
      [id]);


    const groceryList = groceryListRes.rows[0];
    const ingredientList = ingredientRes.rows;

    if (!groceryList) throw new NotFoundError(`No grocery list: ${id}`);

    return { groceryList: { ...groceryList, ingredients: ingredientList } };
  }

  /** Update or add ignredient from/to grocery list.
   *
   * This is method can either update or add an ingredient
   * we check to see if the grocery list has the ingredient already in it
   * if it does we update
   * if it does not we add
   *
   * REQUIRED
   * @groceryListId the ID of the grocery list
   * @ingredientData is a list of ingredients - must be at least 1 ingredient obj
   * where @ingredientObj => { ingredientId: int, ingredientName: string, amount: int, unit: string, consistency: string (@SOLID OR @LIQUID) }
   *
   * Returns @addedIngredient or @updatedIngredient
   * where @addedIngredient => { ingredientName: string, amount: string, unit: string (oz/fl oz) }
   * where @updatedIngredient => { ingredientName: string, amount: string, unit: string (oz/fl oz) }
   * 
   * If the @updatedIngredient results in an amount of '0.00', we've removed it to the point where it is no longer needed, we remove it from the table
   */

  static async updateOrAddIngredient(groceryListId, ingredientData) {
    const groceryList = await GroceryList.get(groceryListId);
    const ingredientList = groceryList.groceryList.ingredients;
    const returnedIngredients = [];

    for (let ingredient of ingredientData.ingredients) {
      const { ingredientId, ingredientName, amount, unit, consistency } = ingredient;
      const isInList = ingredientList.some(ingredient => ingredient.ingredientId === ingredientId);
      if (isInList) {
        let updatedIngredient = await updateIngredient(groceryListId, ingredientId, amount, unit, consistency, ingredientName)
        if (updatedIngredient.amount === '0.00') {
          updatedIngredient = await GroceryList.removeIngredient(groceryListId, ingredientId);
          returnedIngredients.push({ removed: updatedIngredient });
        } else {
          returnedIngredients.push(updatedIngredient);
        }
      } else {
        const addedIngredient = await addIngredient(groceryListId, ingredientId, ingredientName, amount, unit, consistency);
        returnedIngredients.push(addedIngredient);
      }
    }
    return returnedIngredients;
  }

  /** Delete given ingredient from grocery list.
   *
   * Throws NotFoundError if grocery list not found.
   **/

  static async removeIngredient(groceryListId, ingredientId) {
    const result = await db.query(
      `DELETE
      FROM ingredient_in_grocery_list
      WHERE grocery_list_id = $1 AND ingredient_id = $2
      RETURNING ingredient_name AS "ingredientName"`, [groceryListId, ingredientId]);

    if (result.rows.length === 0) throw new NotFoundError(`No such ingredient in grocery list`);
    const removedIngredient = result.rows[0].ingredientName;

    return removedIngredient;
  }

  /** Delete given grocery list from database; returns undefined.
   *
   * Throws NotFoundError if grocery list not found.
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE
           FROM grocery_lists
           WHERE id = $1
           RETURNING id`, [id]);
    const groceryList = result.rows[0];

    if (!groceryList) throw new NotFoundError(`No grocery list: ${id}`);
  }
}

module.exports = GroceryList;
