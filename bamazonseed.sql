-- Starter data to insert into products table --
INSERT INTO bamazon_db.products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Xbox One", "Electronics", 399.99, 15, 0),
("Playstation 4", "Electronics", 299.99, 10, 0),
("Litter Robot III", "Pets", 499.99, 3, 0),
("Ergonomic Desk", "Household Appliances", 299.96, 15, 0),
("Game of Thrones", "Books", 15.99, 200, 0),
("Futuristic Desk Lamp", "Household Appliances", 149.55, 17, 0),
("Mechanical Keyboard", "Electronics", 99.99, 8, 0),
("Coding For Dummies", "Books", 19.99, 200, 0),
("Cracking the Coding Interview", "Books", 18.95, 20, 0),
("Bose Desk Speakers", "Electronics", 199.99, 20, 0);

-- Starter data to insert into departments table -- 
INSERT INTO bamazon_db.departments (department_name, over_head_cost)
VALUES ("Electronics", 5000),
("Pets", 1500),
("Household Appliances", 1000),
("Books", 200);