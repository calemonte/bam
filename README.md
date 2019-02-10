# Bamazon
Bamazon is a trio of command line Node.js applications that allows customers to purchase items (bamazonCustomer.js), managers to view products for sale and replenish inventories (bamazonManager.js), among other tasks, and supervisors to view gross sales by department and add new departments (bamazonSupervisor.js).

## Install

Clone the repository and then `npm install` the dependencies listed in `package.json`.

```
git clone <this repo>
cd /bam
npm install
```

## How to Use

This is a series of three Node.js CLI applications: bamazonCustomer.js, bamazonManager.js, and bamazonSupervisor.js. Instructions on using each of these applications is included below. For a video demonstration of the application in action, [click here](https://drive.google.com/open?id=14AQaI723BcbhvNPfX2xOOeYRvLoBiq0V).

Before you get started with any of these applications though, you will need to start your MySQL server. Once you've spun up your server,please enter your personal MySQL database password into a `.env` file in the repo (this file is not included in the repo, so you will need to create one).

```
MYSQL_SECRET=YOURPASSWORDHERE
```
The app runs on the local server (see the PORT number in the .js files). With your MySQL server up and running, use the `schema.sql` query to create the `bamazon` database and `products` and `departments` tables. You can then use the `seeds.sql` to seed data into the newly create database and tables. With all of that complete, you can begin using the applications(s).

### bamazonCustomer.js

Fire up the Customer app by running:
```
node bamazonCustomer.js
```
You can now "purchase" items using the CLI. Browse your options and pick an item to purchase, but make sure you don't pick more units than are in stock. 

![Screenshot of the Customer interface](/assets/customer.png "Screenshot of the Customer interface.")

All of the data related to your purchase is reflected in the Manager and Supervisor views. Once done, exit the application to try out the other two applications.

### bamazonManager.js

Fire up the Manager app by running:
```
node bamazonManager.js
```
You can now execute a number of tasks as a "manager" of the Bamazon storefront, all of which is reflective of data stored in the MySQL database.

![Screenshot of the Manager interface](/assets/manager.png "Screenshot of the Manager interface.")

Making changes here will be reflected in the storefront Customer experience and the backend Supervisor experience.

### bamazonSupervisor.js

Fire up the Supervisor app by running:
```
node bamazonSupervisor.js
```
You can now execute a number of tasks as a "supervisor" of the Bamazon storefront, all of which is reflective of data stored in the MySQL database. A number of the columns represented in the "View Product Sales" option join together data from the two tables in the database, "products" and "departments."

![Screenshot of the Supervisor interface](/assets/supervisor.png "Screenshot of the Supervisor interface.")

Making changes here will be reflected in the backend Manager experience, mainly in that it will give managers new departments to which they can add products.

## Technologies Used
- JavaScript
- Node.js
- SQL / MySQL
- Inquirer (npm)
- Dotenv (npm)
- Gradient-String (npm)
- Figlet (npm)
- TTY-Table (npm)

## Contribute

This was built by Kenny Whitebloom (https://github.com/calemonte) as part of a coding class, but if you are interested in contributing, feel free to open a pull request from a new branch.

## Notes

This was my first exposure to SQL and MySQL. Working with persistent data was fun, though I look forward to improving my SQL queries in the future. For instance, the Supervisor view pulls in data from both the products and departments tables using a LEFT JOIN, but I can imagine that I could do this more cleanly. Suggestions welcome!