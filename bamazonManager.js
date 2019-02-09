"use strict";

require("dotenv").config();
const mysql = require("mysql");
const inquirer = require("inquirer");
const keys = require("./keys");
const gradient = require('gradient-string'); // String gradient colorizer package.
const figlet = require("figlet"); // Implements the FIGfont spec for displaying cool ASCII art.
const Table = require("tty-table"); // Create formatted tables in terminal.

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

// Function for display the main menu interface to the manager.
function start() {
    console.log(gradient.pastel(figlet.textSync("BAMAZON", {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    })));
    console.log(gradient.pastel("Welcome to the MANAGER interface!\n"));

    inquirer.prompt({
        name: "main",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }).then(function(inquirerResponse) {
        
        switch (inquirerResponse.main) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                addToInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
            case "Exit":
                console.log("Exiting backend Manager interface...");
                connection.end();
                process.exit();
            default:
                break;
        }

    }).catch(error => { return console.log(error) } );
}

// Function that displays a table of all products for sale in the store, organized by product ID.
function viewProducts() {
    connection.query("SELECT * FROM products", function(error, results) {
        if (error) throw error;

        renderTable(results);
       
        console.log("Sending you to the main menu...");
        setTimeout(start, 1000);
    });
}

// Function that displays a table of items with less than 5 units of inventory.
function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stockQuantity < 5", function(error, results) {
        if (error) throw error;

        renderTable(results);
       
        console.log("Sending you to the main menu...");
        setTimeout(start, 1000);
    });
}

// Function that provides an interface for a manager to add more units of inventory for a particular item.
function addToInventory() {
    connection.query("SELECT id, productName, stockQuantity FROM products", function(error, results) {
        if (error) throw error;

        inquirer.prompt([
            {
                name: "selectedItem",
                type: "list",
                message: "Select an item to increase its inventory",
                choices: () => {
                    let output = [];
                    for (let i = 0; i < results.length; i++) {
                        output.push({

                            name: `Product Name: ${results[i].productName} | Inventory: ${results[i].stockQuantity}`,

                            value: [results[i].id, results[i].stockQuantity, results[i].productName]

                        });
                    }
                    return output;
                }
            }, {
                name: "amount",
                type: "input",
                message: "How many items are you adding to this item's inventory?",
                validate: function(value) {
                    const pass = value.match(/^[0-9]\d*$/);
                    if (pass) return true;
                    return "Please enter a valid (non-negative) number."
                }
            }
        ])
        .then(function(inquirerResponse) {
            const selectedItem = inquirerResponse.selectedItem;
            const inventoryIncrease = inquirerResponse.amount;
        
            postNewInventory(selectedItem, inventoryIncrease);
        })
        .catch(error => { return console.log(error) } );

    });
    
}

// Helper function for posting a selected item and inventory increase to the database from the addToInventory() function.
function postNewInventory(selectedItem, inventoryIncrease) {
    const currentID = parseInt(selectedItem[0]);
    const currentStock = parseInt(selectedItem[1]);
    const newStock = currentStock + parseInt(inventoryIncrease);
    const currentProductName = selectedItem[2];

    connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                stockQuantity: newStock
            },
            {
                id: currentID
            }
        ],
        function(error) {
          if (error) throw error;

          console.log(`Your request was succesfully processed: ${currentProductName}'s inventory increased by ${inventoryIncrease} units. To see the updated inventory, select "View Products for Sale" on the main menu.`);

          start();
        }
    );
}

// Function that provides an interface for a manager to add a new product for sale.
function addNewProduct() {

    connection.query("SELECT departmentName FROM departments", function(error, results) {
        if (error) throw error;

        inquirer.prompt([
            {
                name: "newItemName",
                type: "input",
                message: "Enter the name of the new product"
            }, {
                name: "departmentName",
                type: "list",
                message: "What department does this fall under?",
                choices: () => {
                    let output = [];
                    for (let i = 0; i < results.length; i++) {
                        if (!output.includes(results[i].departmentName)) {
                            output.push(results[i].departmentName);
                        }
                    }
                    return output;
                }
            }, {
                name: "newItemPrice",
                type: "input",
                message: "Enter the price of the new product",
                validate: function(value) {
                    const pass = value.match(/^[0-9]+(\.[0-9]{1,2})?$/);
                    if (pass) return true;
                    return "Please enter a valid (non-negative) decimal greater than 0."
                }
            }, {
                name: "newItemStock",
                type: "input",
                message: "Enter the inital inventory of the new product",
                validate: function(value) {
                    const pass = value.match(/^[0-9]\d*$/);
                    if (pass) return true;
                    return "Please enter a valid (non-negative) integer."
                }
            }
        ])
        .then(function(inquirerResponse) {
            connection.query("INSERT INTO products SET ?",
                {
                    productName: inquirerResponse.newItemName,
                    departmentName: inquirerResponse.departmentName,
                    price: parseFloat(inquirerResponse.newItemPrice).toFixed(2),
                    stockQuantity: inquirerResponse.newItemStock
                }, function(error) {
                    if (error) throw error;
                    console.log("Success! Your new item has been added.\n");
                    setTimeout(start, 1000);
                }
            );
        })
        .catch(error => { return console.log(error) } );
    });
}

// Function for rendering a command line table based on the results of the SQL query.
function renderTable(results) {

    const header = [
        {
            value: "ID",
            headerColor: "cyan",
            color: "cyan",
            align: "center"
        }, {
            value: "Product Name",
            headerColor: "cyan",
            color: "white",
            align: "center"
        }, {
            value: "Department Name",
            headerColor: "cyan",
            color: "white",
            align: "center"
        }, {
            value: "Item Price",
            headerColor: "cyan",
            color: "white",
            align: "center",
        }, {
            value: "Item Inventory",
            headerColor: "cyan",
            color: "white",
            align: "center"
        }
    ];
    
    // Generate rows from the database call.
    let rows = [];
    results.forEach(item => {
        rows.push([item.id, item.productName, item.departmentName, "$"+item.price, item.stockQuantity]);
    });

    // Construct the table.
    const t1 = Table(header, rows, {
        borderStyle : 1,
        borderColor : "blue",
        paddingBottom : 0,
        headerAlign : "center",
        align : "center",
        color : "white",
        truncate: "..."
    });

    console.log(t1.render());
}