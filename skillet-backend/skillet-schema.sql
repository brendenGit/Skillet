CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULl CHECK (position('@' IN email) > 1),
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE recipe_saved (
  recipe_id INTEGER NOT NULL,
  saved_by INTEGER NOT NULL REFERENCES users ON DELETE CASCADE
);

CREATE TABLE recipe_stats (
  recipe_id INTEGER NOT NULL PRIMARY KEY,
  rating INTEGER NOT NULL DEFAULT 0,
  save_count INTEGER NOT NULL DEFAULT 0
); 

CREATE TABLE recipe_rated_by (
  recipe_id INTEGER NOT NULL,
  rated_by INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
  UNIQUE (recipe_id, rated_by)
);

CREATE TABLE grocery_lists (
  id SERIAL PRIMARY KEY,
  created_by VARCHAR(50) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  grocery_list_name VARCHAR(255) DEFAULT NULL
);

CREATE TABLE ingredient_in_grocery_list (
  grocery_list_id INTEGER NOT NULL REFERENCES grocery_lists ON DELETE CASCADE,
  ingredient_id INTEGER NOT NULL UNIQUE,
  ingredient_name VARCHAR(255) NOT NULL UNIQUE,
  amount NUMERIC(5, 2) NOT NULL, 
  unit VARCHAR(255) NOT NULL
);

CREATE TABLE recipe_in_grocery_list (
  grocery_list_id INTEGER NOT NULL REFERENCES grocery_lists ON DELETE CASCADE,
  recipe_id INTEGER NOT NULL,
  recipe_title VARCHAR(255) NOT NULL,
  UNIQUE (grocery_list_id, recipe_id)
);

CREATE INDEX idx_user_username ON users(username);
CREATE INDEX idx_recipesaved_saved_by ON recipe_saved(saved_by);
CREATE INDEX idx_grocerylist_created_by ON grocery_lists(created_by);
CREATE INDEX idx_ingredientingrocerylist_grocery_list_id ON ingredient_in_grocery_list(grocery_list_id);
CREATE INDEX idx_recipesaved_recipe_id ON recipe_saved(recipe_id);
CREATE INDEX idx_recipestats_save_count ON recipe_stats(save_count);
CREATE INDEX idx_reciperatedby_recipe_id ON recipe_rated_by(recipe_id);
CREATE INDEX idx_ingredientingrocerylist_ingredient_name ON ingredient_in_grocery_list(ingredient_name);
