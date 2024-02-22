CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULl CHECK (position('@' IN email) > 1),
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  is_creator BOOLEAN NOT NULL DEFAULT FALSE,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  creator_description TEXT
);

CREATE TABLE user_created_recipes (
  id SERIAL PRIMARY KEY,
  created_by INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  image_url VARCHAR(255) DEFAULT 'skillet_logo.png'
);

CREATE TABLE recipe_steps (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER NOT NULL REFERENCES user_created_recipes ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE recipe_ingredients (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER NOT NULL REFERENCES user_created_recipes ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  quantity VARCHAR(255) NOT NULL,
  unit VARCHAR(255) NOT NULL
);

CREATE TABLE recipe_saved (
  recipe_id INTEGER NOT NULL,
  recipe_source VARCHAR(255) NOT NULL,
  saved_by INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
  UNIQUE (recipe_id, saved_by)
);

CREATE TABLE recipe_stats (
  recipe_id INTEGER NOT NULL PRIMARY KEY,
  rating INTEGER NOT NULL DEFAULT 0,
  save_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE recipe_rated_by (
  recipe_id INTEGER NOT NULL,
  rated_by INTEGER NOT NULL REFERENCES users,
  UNIQUE (recipe_id, rated_by)
);

CREATE TABLE grocery_lists (
  id SERIAL PRIMARY KEY,
  created_by INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  grocery_list_name VARCHAR(255) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ingredient_in_grocery_list (
  grocery_list_id INTEGER NOT NULL REFERENCES grocery_lists ON DELETE CASCADE ,
  ingredient_name VARCHAR(255) NOT NULL,
  amount NUMERIC(5, 2) NOT NULL, 
  unit VARCHAR(255) NOT NULL
);

CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_usercreatedrecipe_created_by ON user_created_recipes(created_by);
CREATE INDEX idx_recipestep_recipe_id ON recipe_steps(recipe_id);
CREATE INDEX idx_recipesaved_saved_by ON recipe_saved(saved_by);
CREATE INDEX idx_grocerylist_created_by ON grocery_lists(created_by);
CREATE INDEX idx_ingredientingrocerylist_grocery_list_id ON ingredient_in_grocery_list(grocery_list_id);