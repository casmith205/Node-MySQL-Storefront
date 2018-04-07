DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT AUTO_INCREMENT,
    product_name VARCHAR(100),
    department_name VARCHAR(100),
    price INT,
    stock_quantity INT,
    PRIMARY KEY (item_id)
);

INSERT INTO products
(product_name, department_name, price, stock_quantity)
VALUES
("paper towels", "supplies", 10, 300),
("dog food", "pets", 60, 30),
("bleach", "supplies", 4, 150),
("sun dress", "clothes", 30, 20),
("eggs", "food", 3, 500),
("gummy worms", "food", 2, 15),
("nail polish", "beauty", 12, 100),
("side table", "furniture", 150, 5),
("couch", "furniture", 300, 3),
("sqeaky toy", "pets", 9, 7);


SELECT * FROM products;
