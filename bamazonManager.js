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

// Function for handling the main menu interface.
function start() {
    console.log(gradient.instagram(figlet.textSync("BAMAZON", {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    })));
    console.log(gradient.instagram("Welcome to the backend Manager interface!\n"));

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

function viewProducts() {
    connection.query("SELECT * FROM products", function(error, results) {
        if (error) throw error;

        let header = returnTableHeader();
        
        let rows = [];
        results.forEach(item => {
            rows.push([item.id, item.productName, item.departmentName, "$"+item.price, item.stockQuantity]);
        });

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
       
        console.log("Sending you to the main menu...");
        setTimeout(start, 1000);
    });
}

function viewLowInventory() {
    console.log("Viewing low inventory!");
    start();
}

function addToInventory() {
    console.log("Adding to inventory!");
    start();
}

function addNewProduct() {
    console.log("Adding new product!");
    start();
}

function returnTableHeader() {
    const header = [
        {
            value: "ID",
            headerColor: "cyan",
            color: "white",
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
    return header;
}