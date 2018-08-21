let inquirer = require("inquirer");

let mysql = require("mysql");

const cTable = require("console.table");

var command = process.argv.slice(2).join(" ");

let connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon_db"
});


connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

function start() {
    inquirer.prompt({
        name: "managerOptions",
        type: "rawlist",
        message: "What would you like to do, manager",
        choices: ["View All Products", "View Low Inventory", "Add to Inventory", "Add New Products", "Exit"]
    }).then(function(answers) {
        if (answers.managerOptions.toLowerCase() === "view all products") {
            forSale()
        }
        else if (answers.managerOptions.toLowerCase() === "view low inventory") {
            lowInv()
        }
        else if (answers.managerOptions.toLowerCase() === "add to inventory") {
            addInv()
        }
        else if (answers.managerOptions.toLowerCase() === "add new product") {
            addProduct()
        } else {
            connection.end();
        }
    })
}

function forSale() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        console.log("\nHere is everything currently on sale at Bamazon.\n")
        console.table(results);
        start();
    })
};

function lowInv() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, results) {
        
        if (err) throw err;

        console.log("\nHere are all items on Bamazon with that's stock is lower than 5.\n")
        console.table(results);
        start();
    })

}

function addInv() {

}

function addProduct() {

}

