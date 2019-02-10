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
    console.log(gradient.summer(figlet.textSync("BAMAZON", {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    })));
    console.log(gradient.summer("Welcome to the SUPERVISOR interface!\n"));

    inquirer.prompt({
        name: "main",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products by Department", "Create New Department", "Exit"]
    }).then(function(inquirerResponse) {
        
        switch (inquirerResponse.main) {
            case "View Products by Department":
                viewProductsbyDepartment();
                break;
            case "Create New Department":
                createNewDepartment();
                break;
            case "Exit":
                console.log("Exiting backend Supervisor interface...");
                connection.end();
                process.exit();
            default:
                break;
        }

    }).catch(error => { return console.log(error) } );
}

// Function that queries the database for information about total product sales, costs, and profits organized by department.
function viewProductsbyDepartment() {
    let query = "SELECT d.departmentId, d.departmentName, d.overheadCosts AS overhead, SUM(p.productSales) AS productSales ";
    query += "FROM departments AS d LEFT JOIN products AS p ON (d.departmentName = p.departmentName) ";
    query += "GROUP BY d.departmentId, d.departmentName, d.overheadCosts";

    connection.query(query, function(error, results) {
        if (error) throw error;

        // console.log(results);
        renderTable(results);
       
        console.log("Sending you to the main menu...");
        setTimeout(start, 1000);
    });
}

// Function that provides an interface for a supervisor to add a new department to the store.
function createNewDepartment() {
    inquirer.prompt([
        {
            name: "newDepartmentName",
            type: "input",
            message: "Enter the name of the new department",
            validate: function(value) {
                const pass = value.match( /([A-Za-z0-9-]+)/i);
                if (pass) return true;
                return "Please enter a valid entry containing letters or integers."
            }
        }, {
            name: "newDepartmentOverhead",
            type: "input",
            message: "Enter the operating costs for the new department",
            validate: function(value) {
                const pass = value.match(/^[0-9]+(\.[0-9]{1,2})?$/);
                if (pass) return true;
                return "Please enter a valid (non-negative) decimal."
            } 
        }
    ])
    .then(function(inquirerResponse) {
        connection.query("INSERT INTO departments SET ?", 
            { 
                departmentName: inquirerResponse.newDepartmentName,
                overheadCosts: inquirerResponse.newDepartmentOverhead
            }, function(error) {
                if (error) throw error;
                console.log("Success! Your new department has been added.\n");
                setTimeout(start, 1000);
            }
        );
        
    })
    .catch(error => console.log(error));
}

// Function for rendering a command line table based on the results of the SQL query.
function renderTable(results) {

    const header = [
        {
            value: "Department ID",
            headerColor: "cyan",
            color: "cyan",
            align: "center"
        }, {
            value: "Department Name",
            headerColor: "cyan",
            color: "white",
            align: "center"
        }, {
            value: "Overhead Costs",
            headerColor: "cyan",
            color: "white",
            align: "center"
        }, {
            value: "Product Sales",
            headerColor: "cyan",
            color: "white",
            align: "center",
        }, {
            value: "Total Profit",
            headerColor: "cyan",
            color: "white",
            align: "center"
        }
    ];
    
    // Generate rows from the database call.
    let rows = [];
    results.forEach(item => {

        // if (!item.productSales) {
        //     item.productSales = 0;
        // }

        let totalProfit = (item.productSales - item.overhead).toFixed(2);

        rows.push([item.departmentId, item.departmentName, item.overhead, item.productSales || 0, totalProfit]);
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