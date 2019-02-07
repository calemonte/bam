"use strict";

require("dotenv").config();
const mysql = require("mysql");
const inquirer = require("inquirer");
const keys = require("./keys");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: keys.mysqlDB.id,
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    start();
});

function start() {

    connection.query("SELECT productName, price FROM products", function(error, results) {
        if (error) throw error;

        inquirer.prompt({
            name: "itemsForSale",
            type: "list",
            message: "Welcome! Please select one of the products below to make a purchase.",
            choices: () => {
                let output = [];
                for (let i = 0; i < results.length; i++) {
                    output.push(`${results[i].productName}, $${results[i].price}`);
                }
                return output;
            }
        });

    })

    connection.end();
}