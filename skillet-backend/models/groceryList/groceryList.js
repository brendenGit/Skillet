"use strict";

const db = require("../../db");
const { NotFoundError } = require("../../expressError");
const { sqlForPartialUpdate } = require("../../helpers/sql");


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
      `SELECT ingredient_name AS "ingredientName",
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

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
      data,
      {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE jobs 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                title, 
                                salary, 
                                equity,
                                company_handle AS "companyHandle"`;
    const result = await db.query(querySql, [...values, id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);

    return job;
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
