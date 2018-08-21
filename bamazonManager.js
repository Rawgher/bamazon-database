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
        type: "list",
        message: "What would you like to do, manager?",
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
    
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

    var itemArray = [];
    for (var j = 0; j < results.length; j++) {
      // push into the array a string like this: "2: Car"
      itemArray.push(results[j].item_id + ": " + results[j].product_name);
    }

    inquirer
      .prompt([
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
      ]).then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        if (answer.stock > 0) {
            let chosenItem;
            var components = answer.choice.trim().split(':');
            for (var k = 0; k < results.length; k++) {
              // test if results id = the first element of the components array (ie: the id)
              if (results[k].item_id === parseInt(components[0])) {
                chosenItem = results[k];
              }
            }
        let updateSock = [
              {
                stock_quantity: parseInt(answer.stock) + chosenItem.stock_quantity
              },
              {
                item_id: components[0]
              }
            ];
        connection.query(
            "UPDATE products SET ? WHERE ?", updateSock, function(error) {
            if (error) throw error;
            console.log("\nThe product was successfully restocked!");
            start();
          }
        );
      } else {
          console.log("\nYou need to input a proper amount to update. Try again")
          connection.end();
      }
  })
    });
};



function addProduct() {

    inquirer.prompt(questions).then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        
        var sqlString = "INSERT INTO auctions SET ?";
        var replacements = {
          item_name: answer.item,
          category: answer.category,
          starting_bid: answer.startingBid,
          highest_bid: answer.startingBid
        };
        connection.query(sqlString, replacements, function(err) {
            if (err) throw err;
            console.log("Your auction was created successfully!");
            // re-prompt the user for if they want to bid or post
            start();
          }
        );
      });
  }

