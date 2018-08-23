// setting up required npms
let inquirer = require("inquirer");

let mysql = require("mysql");

const cTable = require("console.table");

// setting up mySQL connection
let connection = mysql.createConnection({
    
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"

});

// setting up initial connection
connection.connect(function (err) {

    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();

});

// initial display that prompts user to choose what they would like to do
function start() {

    inquirer.prompt({

        name: "managerOptions",
        type: "list",
        message: "What would you like to do, manager?",
        choices: ["View All Products", "View Low Inventory", "Add to Inventory", "Add New Products", "Exit"]

    }).then(function (answers) {
        
        if (answers.managerOptions.toLowerCase() === "view all products") {
            
            forSale()

        }
        else if (answers.managerOptions.toLowerCase() === "view low inventory") {

            lowInv()

        }
        else if (answers.managerOptions.toLowerCase() === "add to inventory") {

            addInv()

        }
        else if (answers.managerOptions.toLowerCase() === "add new products") {

            addProduct()

        } else {

            connection.end();

        };

    });

};

// function that displays everything that is on sale
function forSale() {

    connection.query("SELECT * FROM products", function (err, results) {

        if (err) throw err;
        console.log("\nHere is everything currently on sale at Bamazon.\n")
        console.table(results);
        start();

    });

};

// function that shows everything on sale that has less than 5 items
function lowInv() {

    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, results) {

        if (err) throw err;
        console.log("\nHere are all items on Bamazon with that's stock is lower than 5.\n")
        console.table(results);
        start();

    });

};

// function that allows the manager to add to an items stock
function addInv() {

    connection.query("SELECT * FROM products", function (err, results) {

        if (err) throw err;
        var itemArray = [];
        for (var j = 0; j < results.length; j++) {

            itemArray.push(results[j].item_id + ": " + results[j].product_name);
            
        };

        // prompt asking which item and how much they would like to add to it
        inquirer.prompt([

                {
                    name: "choice",
                    type: "list",
                    choices: itemArray,
                    message: "Please select the item id you are interested in!"
                },
                {
                    name: "stock",
                    type: "input",
                    message: "How many would you like to add?"
                }

            ]).then(function (answer) {

                // will only run if the user inputs a number and it is higher than 0
                if (answer.stock > 0) {

                              // get the information of the chosen item and store it
                    let chosenItem;
                    var components = answer.choice.trim().split(':');

                    for (var k = 0; k < results.length; k++) {

                        // test if results id = the first element of the components array (ie: the id)
                        if (results[k].item_id === parseInt(components[0])) {

                            chosenItem = results[k];

                        };
                    };

                    // setting up update of stock
                    let updateSock = [
                        {
                            stock_quantity: parseInt(answer.stock) + chosenItem.stock_quantity
                        },
                        {
                            item_id: components[0]
                        }
                    ];

                    // query to update stock on the database
                    connection.query("UPDATE products SET ? WHERE ?", updateSock, function (error) {

                            if (error) throw error;
                            console.log("\nThe product was successfully restocked!\n");
                            start();

                        });

                }

                // else statement that runs if user does not input a proper amount
                else {

                    console.log("\nYou need to input a proper amount to update. Try again\n")
                    connection.end();

                };

            });

    });

};

// function to add a completely new product to the database
function addProduct() {

    // inquirer prompt that takes all the input needed to add item to the database
    inquirer.prompt([

        {
            name: "itemName",
            type: "input",
            message: "Please enter the item you want to add!"
        },
        {
            name: "departmentName",
            type: "input",
            message: "Please enter a department name!"
        },
        {
            name: "price",
            type: "input",
            message: "How much does this item cost?"
        },
        {
            name: "stock",
            type: "input",
            message: "How much of this product would you like to add?"
        }

    ]).then(function (answer) {
        // when finished prompting, insert a new item into the db with the input info

        var sqlString = "INSERT INTO products SET ?";

        var replacements = {

            product_name: answer.itemName,
            department_name: answer.departmentName,
            price: parseFloat(answer.price).toFixed(2),
            stock_quantity: parseInt(answer.stock),
            product_sales: 0

        };

        // query that adds the new item
        connection.query(sqlString, replacements, function (err) {

            if (err) throw err;
            console.log("\nThe product has been successfully added!\n");
            start();

        });

    });
    
};