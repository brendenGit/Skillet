-- users
INSERT INTO "users" (email, password, first_name, last_name, is_creator, is_admin, creator_description)
VALUES
('john.doe@example.com', 'password123', 'John', 'Doe', TRUE, FALSE, 'Experienced chef with a passion for Italian cuisine'),
('bob.baker@example.com', 'password123', 'Robert', 'Baker', FALSE, FALSE, NULL),
('jane.smith@example.com', 'password456', 'Jane', 'Smith', FALSE, TRUE, NULL);

-- user_created_recipes
INSERT INTO user_created_recipes (created_by, title, description, image_url)
VALUES
(1, 'Spaghetti Carbonara', 'Delicious spaghetti carbonara recipe', 'spaghetti_carbonara.jpg'),
(1, 'Authentic Lasagna', 'Authentic lasagna recipe', 'lasagna.jpg'),
(2, 'Healthy Quinoa Salad', 'Healthy quinoa salad recipe', 'quinoa_salad.jpg');

-- recipe_steps
INSERT INTO recipe_steps (recipe_id, step_number, description)
VALUES
(1, 1, 'Cook spaghetti in a large pot of boiling salted water until al dente.'),
(1, 2, 'Fry pancetta in a large skillet until crisp, then remove from heat.'),
(1, 3, 'Mix eggs, cheese, and pepper in a bowl, then add cooked spaghetti and pancetta.'),
(2, 1, 'Preheat oven to 375°F and cook lasagna noodles according to package instructions.'),
(2, 2, 'Spread a layer of meat sauce in a baking dish, then add a layer of noodles and cheese.'),
(2, 3, 'Repeat layers until all ingredients are used, then bake for 30 minutes.'),
(3, 1, 'Cook quinoa according to package instructions and let cool.'),
(3, 2, 'Mix quinoa with vegetables, herbs, and dressing in a large bowl.');

-- recipe_ingredients
INSERT INTO recipe_ingredients (recipe_id, name, quantity, unit)
VALUES
(1, 'Spaghetti', '8', 'oz'),
(1, 'Pancetta', '4', 'oz'),
(1, 'Eggs', '2', 'unit'),
(1, 'Parmesan cheese', '1/2', 'cup'),
(2, 'Lasagna noodles', '1', 'box'),
(2, 'Ground beef', '1', 'lb'),
(2, 'Tomato sauce', '24', 'oz'),
(2, 'Ricotta cheese', '15', 'oz'),
(3, 'Quinoa', '1', 'cup'),
(3, 'Cucumber', '1', 'unit'),
(3, 'Tomato', '1', 'unit'),
(3, 'Red onion', '1/2', 'unit');

-- recipe_saved
INSERT INTO recipe_saved (recipe_id, recipe_source, saved_by)
VALUES
(1, 'user created', 2),
(2, 'user created', 1),
(3, 'user created', 1),
(3, 'user created', 2);

-- recipe_stats
INSERT INTO recipe_stats (recipe_id, rating, save_count)
VALUES
(1, 4, 10),
(2, 5, 5),
(3, 4, 3);

-- recipe_rated_by
INSERT INTO recipe_rated_by (recipe_id, rated_by)
VALUES
(1, 1),
(2, 1),
(3, 2),
(3, 3);

-- grocery_lists
INSERT INTO grocery_lists (created_by, grocery_list_name)
VALUES
(1, 'Weekly groceries'),
(2, 'Party supplies');

-- ingredient_in_grocery_list
INSERT INTO ingredient_in_grocery_list (grocery_list_id, ingredient_name, amount, unit)
VALUES
(1, 'Spaghetti', 16, 'oz'),
(1, 'Pancetta', 16, 'oz'),
(1, 'Eggs', 2, 'unit'),
(1, 'Parmesan cheese', 2, 'cup'),
(2, 'Lasagna noodles', 1, 'box'),
(2, 'Ground beef', 2, 'lb'),
(2, 'Tomato sauce', 60, 'oz'),
(2, 'Ricotta cheese', 16, 'oz'),
(2, 'Cucumber', 4, 'unit'),
(2, 'Tomato', 4, 'unit'),
(2, 'Red onion', 4, 'unit');
