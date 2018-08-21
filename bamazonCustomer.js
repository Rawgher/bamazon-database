// Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

let inquirer = require("inquirer");

let mysql = require("mysql");

const cTable = require("console.table");

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


connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// function which prompts the user for what action they should take
function start() {
  
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;

    var choiceArray = [];
    for (var i = 0; i < results.length; i++) {
      // push into the array a string like this: "2: Car"
      // choiceArray.push("Item Id: " + results[i].item_id + ", Item Name: " + results[i].product_name + ", $" + results[i].price);
      choiceArray.push(results[i].item_id + results[i].product_name + results[i].price);
    }

 
        console.log("\nHere is everything we have for sale at Bamazon.\n")
        console.table(results);

    
    
    var itemArray = [];
    for (var j = 0; j < results.length; j++) {
      // push into the array a string like this: "2: Car"
      itemArray.push(results[j].item_id + ": " + results[j].product_name);
    }
    // once you have the items, prompt the user for which they'd like to bid on
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
      .then(function(answer) {
        // get the information of the chosen item
        if (answer.buy > 0 ) {
        let chosenItem;
        var components = answer.choice.trim().split(':');
        for (var k = 0; k < results.length; k++) {
          // test if results id = the first element of the components array (ie: the id)
          if (results[k].item_id === parseInt(components[0])) {
            chosenItem = results[k];
          }
        }

        if (parseInt(chosenItem.stock_quantity) < parseInt(answer.buy)) {
          console.log("\nWe do not have enough products in stock to match your order.\nPlease check back after we restock!");
          connection.end();
        } else {
          let newStock = chosenItem.stock_quantity - answer.buy;
          let updateStock = [
            {
              stock_quantity: newStock
            },
            {
              item_id: components[0]
            }
          ];
          connection.query(
            "UPDATE products SET ? WHERE ?", updateStock, function(error) {
              if (error) throw error;
              console.log("\nWe've received your order");
            });

        let totalCost = parseInt(answer.buy) * chosenItem.price;
        console.log("\nOur system shows that you have ordered " + answer.buy + " " + chosenItem.product_name +".\nYour cart total was $" + totalCost);
        connection.end()
        }

      } else {
        console.log("\nYou need to choose a proper amount to buy. Try again")
        connection.end()
      }
      })
    })
  }