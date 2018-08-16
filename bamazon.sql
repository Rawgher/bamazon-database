CREATE DATABASE bamazon_db;

use bamazon_db;

CREATE TABLE products (
	 item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
  -- Make a string column called "artist" --
	 product_name VARCHAR(20) NOT NULL,
  -- Make an integer column called "score" --
	 department_name VARCHAR(20) NOT NULL,
     
     price INTEGER(10) NOT NULL,
     
     stock_quantity INTEGER(10) NOT NULL
);

-- need to add 10 mock products here -- 