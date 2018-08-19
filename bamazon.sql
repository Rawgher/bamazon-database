CREATE DATABASE bamazon_db;

use bamazon_db;

CREATE TABLE products (
	 item_id INT AUTO_INCREMENT NOT NULL,

	 product_name VARCHAR(50) NOT NULL,

	 department_name VARCHAR(100) NOT NULL,
     
     price DECIMAL(10,2) NOT NULL,
     
     stock_quantity INTEGER(10) NOT NULL,
     
     PRIMARY KEY (item_id)
);

