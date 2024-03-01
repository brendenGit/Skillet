const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM recipe_stats");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");

  const userIdRes = await db.query(`
        INSERT INTO users(username,
                          email,
                          password,
                          first_name,
                          last_name,
                          is_admin)
        VALUES ('u1', 'u1@email.com', $1, 'U1F', 'U1L', FALSE),
               ('u2', 'u2@email.com', $2, 'U2F', 'U2L', FALSE)
        RETURNING id`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    ]);

  const userId = userIdRes.rows[0].id;
  const glIdResawait = await db.query(`
        INSERT INTO grocery_lists(created_by,
                                  grocery_list_name)
        VALUES (${userId}, null),
               (${userId}, 'test list 1'),
               (${userId}, 'test list 2'),
               (${userId}, null)
        RETURNING id`);

  const groceryListId = glIdResawait.rows[0].id;
  await db.query(`
        INSERT INTO ingredient_in_grocery_list(grocery_list_id,
                                               ingredient_name,
                                               amount,
                                               unit)
        VALUES (${groceryListId}, 'white rice', 2, 'cups'),
               (${groceryListId}, 'salmon', 1, 'pound'),
               (${groceryListId}, 'olive oil', 2, 'tablespoons'),
               (${groceryListId}, 'broccoli', 2, 'heads')
        RETURNING ingredient_name`);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};