// Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
//setting up required npms
let inquirer = require("inquirer");

let mysql = require("mysql");

const cTable = require("console.table");

//setting up mysql connection
let connection = mysql.createConnection({

  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon_db"

});

//initiall connection to database
connection.connect(function (err) {

  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  display();
  start();

});

// function to display product id, name and price for the user
function display () {
  connection.query("SELECT item_id, product_name, price FROM products", function (err, results) {
    if (err) throw err;

    console.log("\nHere is everything we have for sale at Bamazon.\n")
    console.table(results);
});
}

// function which prompts the user for what action they would like to take
function start() {

  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;

    // console.log("\nHere is everything we have for sale at Bamazon.\n")
    // console.table(results);

    var itemArray = [];
    for (var j = 0; j < results.length; j++) {

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
          name: "buy",
          type: "input",
          message: "How many would you like to buy?"
        }

      ])
      // after an item is selected and a quantity is chosen, function runs
      .then(function (answer) {

        // function that runs if the user inputs a number and it is more than 0
        if (answer.buy > 0) {

          // get the information of the chosen item and store it
          let chosenItem;
          var components = answer.choice.trim().split(':');

          for (var k = 0; k < results.length; k++) {

            // test if results id = the first element of the components array (ie: the id)
            if (results[k].item_id === parseInt(components[0])) {

              chosenItem = results[k];

            };

          };

          // only runs if there is a there are not enough items in stock
          if (parseInt(chosenItem.stock_quantity) <= parseInt(answer.buy)) {

            console.log("\nWe do not have enough products in stock to match your order.\nPlease check back after we restock!");
            connection.end();

          }

          // else statement that runs if there are enough items in stock
          else {

            // subtracting the amount purchased from the current stock
            let newStock = chosenItem.stock_quantity - answer.buy;

            // setting up variable that will change the database
            let updateStock = [
              {
                stock_quantity: newStock
              },
              {
                item_id: components[0]
              }
            ];

            // updating the mySQL database based on user's input
            connection.query("UPDATE products SET ? WHERE ?", updateStock, function (error) {

              if (error) throw error;
              console.log("\nWe've received your order.\n");

            });

            // calculating cost to user based off of how mnay products bought
            let totalCost = parseInt(answer.buy) * chosenItem.price;
            console.log("\nOur system shows that you have ordered " + answer.buy + " " + chosenItem.product_name + ".\nYour cart total was $" + totalCost + ".\n");
            connection.end()

          };

        }

        // else statement that runs if user does not input a number or their choice is equal to 0
        else {

          console.log("\nYou need to choose a proper amount to buy. Try again.")
          connection.end()

        };

      });

  });

};