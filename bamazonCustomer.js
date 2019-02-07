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

    connection.query("SELECT productName, price, stockQuantity FROM products", function(error, results) {
        if (error) throw error;

        inquirer.prompt({
            name: "selectedItem",
            type: "list",
            message: "Welcome! Please select one of the products below to make a purchase.",
            choices: () => {
                let output = [];
                for (let i = 0; i < results.length; i++) {
                    output.push(`${results[i].productName}, $${results[i].price}`);
                }
                return output;
            }
        })
        .then(function(inquirerResponse) {
            requestUnits(inquirerResponse, results);
        })
        .catch(error => { return console.log(error) } );

    });
}

function requestUnits(inquirerResponse, results) {
    let chosenItem;

    for (let i = 0; i < results.length; i++) {
        if (`${results[i].productName}, $${results[i].price}` === inquirerResponse.selectedItem) {
            chosenItem = results[i];
        }
    }

    console.log(chosenItem);

    inquirer.prompt({
        name: "unitsRequested",
        type: "input",
        message: `How many units of ${chosenItem.productName} would you like? There are currently ${chosenItem.stockQuantity} units available.`
    })
    .then(function(inquirerResponse) {
        console.log(inquirerResponse);
        console.log("The next step is to handle the actual purchase: purchase()");
    })
    .catch(error => { return console.log(error) } );

    connection.end();
}
