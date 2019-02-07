"use strict";

require("dotenv").config();
const mysql = require("mysql");
const inquirer = require("inquirer");
const keys = require("./keys");
const gradient = require('gradient-string'); // String gradient colorizer package.
const figlet = require("figlet"); // Implements the FIGfont spec for displaying cool ASCII art.

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: keys.mysqlDB.id,
    database: "bamazon"
});

// Establish a connection to the MySQL server and SQL database, then execute start() callback.
connection.connect(function(err) { 
    if (err) throw err;
    start();
});

// Function for handling the main menu interface.
function start() {
    console.log(gradient.instagram(figlet.textSync("BAMAZON", {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    })));
    console.log(gradient.instagram("Serving customers since 2019\n"));
    inquirer.prompt({
        name: "main",
        type: "list",
        message: "What would you like to do?",
        choices: ["Purchase products", "Exit"]
    }).then(function(inquirerResponse) {
        
        switch (inquirerResponse.main) {
            case "Purchase products":
                offerAvailableItems();
                break;
            case "Exit":
                console.log("Thanks for shopping with Bamazon!");
                connection.end();
                process.exit();
            default:
                break;
        }

    }).catch(error => { return console.log(error) } );
}

// Function displays list of available products drawn from the SQL database's products table. Allows user to select an item, the data for which is then passed to the requestUnits() function.
function offerAvailableItems() {
    connection.query("SELECT id, productName, price, stockQuantity FROM products", function(error, results) {
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

// Function for gathering the amount of units requested by the customer.
function requestUnits(inquirerResponse, results) {
    let chosenItem;

    for (let i = 0; i < results.length; i++) {
        if (`${results[i].productName}, $${results[i].price}` === inquirerResponse.selectedItem) {
            chosenItem = results[i];
        }
    }

    inquirer.prompt({
        name: "unitsRequested",
        type: "input",
        message: `How many units of ${chosenItem.productName} would you like? There are currently ${chosenItem.stockQuantity} units available.`,
        validate: function(value) {
            const pass = value.match(/^[1-9]\d*$/);
            if (pass) return true;
            return "Please enter a valid (non-negative) number greater than 0."
        }
    })
    .then(function(inquirerResponse) {
        fulfillRequest(chosenItem, inquirerResponse.unitsRequested)
    })
    .catch(error => { return console.log(error) } );

}

function fulfillRequest(chosenItem, unitsRequested) {
    
    if (unitsRequested > chosenItem.stockQuantity) {
        console.log("\nSorry, you've requested more units than are currently in stock. Please try again!\n");
        return start();
    }

    connection.query(
        "UPDATE products SET ? WHERE ?", 
        [ 
          {
            stockQuantity: `${chosenItem.stockQuantity - unitsRequested}`
          }, {
            id: chosenItem.id 
          }
        ],
        function(error) {
            if (error) throw error;
            if (unitsRequested > 1) {
                console.log(`\nYou succesfully purchased ${unitsRequested} ${chosenItem.productName}s for a total price of $${parseFloat(chosenItem.price * unitsRequested).toFixed(2)}.`);
            } else {
                console.log(`\nYou succesfully purchased ${unitsRequested} ${chosenItem.productName} for a total price of $${parseFloat(chosenItem.price * unitsRequested).toFixed(2)}.`);
            }

            console.log("Sending you to the main menu...\n");
            
            setTimeout(start, 1000);
        }
    )
}