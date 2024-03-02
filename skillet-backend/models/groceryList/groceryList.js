"use strict";

const db = require("../../db");
const { NotFoundError } = require("../../expressError");
const { sqlForPartialUpdate } = require("../../helpers/sql");
const { addIngredient, updateIngredient } = require("../../helpers/groceryListHelpers");


/** Related functions for companies. */

class GroceryList {
  /** Create a grocery list 
   *
   * requires userId to create
   * @userId stored {here} when user is logged in
   *
   * Returns { id: int, groceryListName: string, createdAt: string  }
   * 
   **/

  static async create(userId, groceryListName) {
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

    const variables =
      groceryListName ?
        [userId, groceryListName]
        :
        [userId]

    const result = await db.query(queryString, variables);
    let groceryList = result.rows[0];

    return groceryList;
  }

  /** Find all grocery lists for a specific user.
   *
   * requires userId to run
   * @userId stored {here} when user is logged in
   *
   * Returns list of grocery list objects [{ id: int, groceryListName: string, createdAt: date}, ...]
   * 
   * */

  static async getGroceryLists(userId) {
    const groceryListsRes = await db.query(`SELECT id,
                                                  created_at as "createdAt",
                                                  grocery_list_name as "groceryListName"
                                            FROM grocery_lists 
                                            WHERE created_by = $1`,
      [userId]);
    return groceryListsRes.rows;
  }

  /** Given a grocery list id, return data about grocery list.
   *
   * Returns { id, title, salary, equity, companyHandle, company }
   *   where company is { handle, name, description, numEmployees, logoUrl }
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

  /** Update job data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: { title, salary, equity }
   *
   * Returns { id, title, salary, equity, companyHandle }
   *
   * Throws NotFoundError if not found.
   */

  static async updateOrAddIngredient(groceryListId, ingredientData) {
    const groceryList = await GroceryList.get(groceryListId);
    const ingredientList = groceryList.groceryList.ingredients;

    for (let ingredient of ingredientData.ingredients) {
      const { ingredientId, ingredientName, amount, unit, consistency } = ingredient;
      const isInList = ingredientList.some(ingredient => ingredient.ingredientId === ingredientId);
      console.log(ingredient.ingredientName);
      console.log(isInList)
      if (isInList) {
        const updatedIngredient = await updateIngredient(groceryListId, ingredientId, amount, unit, consistency)
        return updatedIngredient;
      } else {
        const addedIngredient = await addIngredient(groceryListId, ingredientId, ingredientName, amount, unit, consistency);
        return addedIngredient;
      }
    }
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
    const ingredient = result.rows[0];

    if (!ingredient) throw new NotFoundError(`No such ingredient in grocery list`);

    return { removed: ingredient };
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
