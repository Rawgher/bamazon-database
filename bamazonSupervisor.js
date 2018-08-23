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

        name: "supervisorOptions",
        type: "list",
        message: "What would you like to do, supreme leader?",
        choices: ["View Product Sales by Department", "Add a New Department", "Exit"]

    }).then(function (answers) {
        
        if (answers.supervisorOptions.toLowerCase() === "view product sales by department") {
            
            productSales()

        }
        else if (answers.supervisorOptions.toLowerCase() === "add a new department") {

            newDepartment()

        } else {

            connection.end();

        };

    });

};

// function that logs the totalprofits view to the console
function productSales () {

    connection.query("SELECT * FROM totalprofits", function (error, results) {

        if (error) throw error;
        console.table(results);
        start();

    });
    
};

// function to add a new department
function newDepartment () {

    inquirer.prompt([

        {
            name: "departmentName",
            type: "input",
            message: "Please enter the department you want to add!"
        },
        {
            name: "overhead",
            type: "input",
            message: "What is the overhead cost of this new department?"
        }

    ]).then(function (answer) {
        // when finished prompting, insert a new department into the db that starts with 0 overhead coset

        var sqlString = "INSERT INTO departments SET ?";

        var replacements = {

            department_name: answer.departmentName,
            over_head_cost: answer.overhead

        };

        // query that adds the new item to the database
        connection.query(sqlString, replacements, function (err) {

            if (err) throw err;
            console.log("\nThe department has been successfully added!\n");
            start();

        });

    });

}