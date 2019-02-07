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