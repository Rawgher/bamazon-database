CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	 item_id INT AUTO_INCREMENT NOT NULL,

	 product_name VARCHAR(50) NOT NULL,

	 department_name VARCHAR(100) NOT NULL,
     
     price DECIMAL(10,2) NOT NULL,
     
     stock_quantity INTEGER(10) NOT NULL,
     
     product_sales DECIMAL(10,2) NOT NULL,
     
     PRIMARY KEY (item_id)
);

CREATE TABLE departments (
	department_id INT AUTO_INCREMENT NOT NULL,
    
    department_name VARCHAR(100) NOT NULL,
    
    over_head_cost DECIMAL(10,2) NOT NULL,
    
    PRIMARY KEY (department_id)
    
);


CREATE VIEW bamazon_db.sumtotal AS SELECT department_name, SUM(product_sales) AS total_product_sales FROM products GROUP BY department_name ORDER BY department_name;

CREATE VIEW bamazon_db.TotalProfits AS
SELECT d.department_id, p.department_name, d.over_head_cost, c.total_product_sales, c.total_product_sales - d.over_head_cost AS total_profit
FROM products p JOIN (departments d, sumtotal c) 
ON p.department_name = d.department_name AND p.department_name = c.department_name
GROUP BY d.department_name
ORDER BY d.department_name ASC;
