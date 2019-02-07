CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    id INTEGER(255) NOT NULL AUTO_INCREMENT,
    productName VARCHAR(255) NOT NULL,
    departmentName VARCHAR(255) NOT NULL,
    price DEC(15,4) NOT NULL,
    stockQuantity INT(255) NOT NULL,
    productSales DEC(15,4),
    PRIMARY KEY(id)
);

CREATE TABLE departments(
    departmentId INTEGER(255) NOT NULL AUTO_INCREMENT,
    departmentName VARCHAR(255) NOT NULL,
    overheadCosts DEC(15,4) NOT NULL,
    PRIMARY KEY(departmentId),
    -- FOREIGN KEY(departmentName) REFERENCES products(departmentName)
);