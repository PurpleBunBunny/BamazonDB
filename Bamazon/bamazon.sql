DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DEC(7,2) NOT NULL,
  stock_quantity INT(10) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Broken Piano", "Electronics", 99.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Blender", "Kitchen", 49.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Clock", "Electronics", 19.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pencil", "Office", .99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("IPhone X Case", "Electronics", 9.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Space Heater", "Electronics", 64.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Rake", "Garden", 12.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Red Lipstick", "Make-up", 14.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("BasketBall", "Sports", 19.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("V-Neck Tee Shirt", "Clothing", 12.99, 100);