DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT AUTO_INCREMENT,
    product_name VARCHAR(100),
    department_name VARCHAR(100),
    price INT,
    stock_quantity INT,
    PRIMARY KEY (id)
);


SELECT * FROM products;
