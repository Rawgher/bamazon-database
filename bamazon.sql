-- Creating new database --
CREATE DATABASE bamazon_db;

-- Telling sql to use this new database --
USE bamazon_db;

-- Setting up products table -- 
CREATE TABLE products (
	 item_id INT AUTO_INCREMENT NOT NULL,

	 product_name VARCHAR(50) NOT NULL,

	 department_name VARCHAR(100) NOT NULL,
     
     price DECIMAL(10,2) NOT NULL,
     
     stock_quantity INTEGER(10) NOT NULL,
     
     product_sales DECIMAL(10,2) NOT NULL,
     
     PRIMARY KEY (item_id)
);

-- Setting up departments table --
CREATE TABLE departments (
	department_id INT AUTO_INCREMENT NOT NULL,
    
    department_name VARCHAR(100) NOT NULL,
    
    over_head_cost DECIMAL(10,2) NOT NULL,
    
    PRIMARY KEY (department_id)
    
);

-- Making a view to store the total product sales for all departments to use in the view below --
CREATE VIEW bamazon_db.sumtotal AS SELECT department_name, SUM(product_sales) AS total_product_sales FROM products GROUP BY department_name ORDER BY department_name;

-- Making a view to show the total profits dynamically -- 
CREATE VIEW bamazon_db.TotalProfits AS
SELECT d.department_id, p.department_name, d.over_head_cost, c.total_product_sales, c.total_product_sales - d.over_head_cost AS total_profit
FROM products p JOIN (departments d, sumtotal c) 
ON p.department_name = d.department_name AND p.department_name = c.department_name
GROUP BY d.department_name
ORDER BY d.department_name ASC;
