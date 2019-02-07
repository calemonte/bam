CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    id INTEGER(255) NOT NULL AUTO_INCREMENT,
    productName VARCHAR(255) NOT NULL,
    departmentName VARCHAR(255) NOT NULL,
    price DEC(15,4) NOT NULL,
    stockQuantity INT(255) NOT NULL,
    PRIMARY KEY(id)
);
