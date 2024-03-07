-- users
INSERT INTO users (username, email, password, first_name, last_name, is_admin)
VALUES
  ('HungryCoder', 'hungrycoder@email.com', '$2b$12$DbgNSfk4Ii936pTkNVUfbeIc99Pw89wpeIeU8vrwLfowebCjb9lo2', 'Jane', 'Doe', FALSE), 
  ('Foodie2023', 'foodie2023@mailhost.net',  '$2b$12$DbgNSfk4Ii936pTkNVUfbeIc99Pw89wpeIeU8vrwLfowebCjb9lo2', 'John', 'Smith', FALSE),
  ('SpiceLover', 'spice_lover@email.com', '$2b$12$DbgNSfk4Ii936pTkNVUfbeIc99Pw89wpeIeU8vrwLfowebCjb9lo2', 'Sarah', 'Williams', FALSE),
  ('AdminChef', 'admin@chefsite.com', '$2b$12$DbgNSfk4Ii936pTkNVUfbeIc99Pw89wpeIeU8vrwLfowebCjb9lo2', 'Max', 'Parker', TRUE); 

-- recipe_saved
INSERT INTO recipe_saved (recipe_id, saved_by)
VALUES 
  (1, 'HungryCoder'),
  (3, 'HungryCoder'), 
  (2, 'Foodie2023');

-- recipe_stats
INSERT INTO recipe_stats (recipe_id, rating, save_count)
VALUES
  (1, 4, 5),
  (2, 3, 2),
  (3, 5, 1);

-- recipe_rated_by
INSERT INTO recipe_rated_by (recipe_id, rated_by)
VALUES
 (1, 1),
 (1, 2),
 (1, 3),
 (2, 1); 

-- grocery_lists
INSERT INTO grocery_lists (created_by, grocery_list_name)
VALUES
 ('HungryCoder', 'Week of 2024-02-26'),
 ('Foodie2023', 'Party Snacks'); 

-- ingredient_in_grocery_list
INSERT INTO ingredient_in_grocery_list (grocery_list_id, ingredient_id, ingredient_name, amount, unit)
VALUES 
  (1, 1, 'Apples', 2.00, 'lbs'),
  (1, 2, 'Ground Beef', 1.50, 'lbs'),
  (2, 3, 'Potato Chips', 1.00, 'bag'),
  (2, 4, 'Salsa', 16.00, 'oz');