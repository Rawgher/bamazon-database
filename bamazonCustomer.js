// Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

var inquirer = require("inquirer");

var mysql = require("mysql");

var connection = mysql.createConnection({
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
      choiceArray.push("Item Id: " + results[i].item_id + ", Item Name: " + results[i].product_name + ", $" + results[i].price);
    }
    
    console.log("Here is everything we have for sale at Bamazon.")
    console.log(choiceArray);
    
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
        }
      
        // ,
  //       {
  //         name: "bid",
  //         type: "input",
  //         message: "How much would you like to bid?"
  //       }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
          }
        }
      })
    })
  }

  //       // determine if bid was high enough
  //       if (chosenItem.highest_bid < parseInt(answer.bid)) {
  //         // bid was high enough, so update db, let the user know, and start over
  //         connection.query(
  //           "UPDATE auctions SET ? WHERE ?",
  //           [
  //             {
  //               highest_bid: answer.bid
  //             },
  //             {
  //               id: chosenItem.id
  //             }
  //           ],
  //           function(error) {
  //             if (error) throw err;
  //             console.log("Bid placed successfully!");
  //             start();
  //           }
  //         );
  //       }
  //       else {
  //         // bid wasn't high enough, so apologize and start over
  //         console.log("Your bid was too low. Try again...");
  //         start();
  //       }
  //     });
  // });
  
  
  // inquirer
  //   .prompt({
  //     name: "postOrBid",
  //     type: "rawlist",
  //     message: "Here is what we have for sale. Please choose an item or you can exit the store.",
  //     choices: ["POST", "BID"]
  //   })
  //   .then(function(answer) {
  //     // based on their answer, either call the bid or the post functions
  //     if (answer.postOrBid.toUpperCase() === "POST") {
  //       postAuction();
  //     }
  //     else {
  //       bidAuction();
  //     }
  //   });
// }

// function to handle posting new items up for auction
function postAuction() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "What is the item you would like to submit?"
      },
      {
        name: "category",
        type: "input",
        message: "What category would you like to place your auction in?"
      },
      {
        name: "startingBid",
        type: "input",
        message: "What would you like your starting bid to be?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO auctions SET ?",
        {
          item_name: answer.item,
          category: answer.category,
          starting_bid: answer.startingBid,
          highest_bid: answer.startingBid
        },
        function(err) {
          if (err) throw err;
          console.log("Your auction was created successfully!");
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
}

function bidAuction() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM auctions", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].item_name);
            }
            return choiceArray;
          },
          message: "What auction would you like to place a bid in?"
        },
        {
          name: "bid",
          type: "input",
          message: "How much would you like to bid?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
          }
        }

        // determine if bid was high enough
        if (chosenItem.highest_bid < parseInt(answer.bid)) {
          // bid was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE auctions SET ? WHERE ?",
            [
              {
                highest_bid: answer.bid
              },
              {
                id: chosenItem.id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Bid placed successfully!");
              start();
            }
          );
        }
        else {
          // bid wasn't high enough, so apologize and start over
          console.log("Your bid was too low. Try again...");
          start();
        }
      });
  });
}
// The app should then prompt users with two messages.
// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.



// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.



// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.



// However, if your store does have enough of the product, you should fulfill the customer's order.


// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.