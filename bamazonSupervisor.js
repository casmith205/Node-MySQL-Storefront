var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

// On connection to the database, run the actionList function
connection.connect(function (err) {
    if (err) throw err;
    actionList();
});

function actionList() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Welcome to the supervisor portal! What would you like to do?",
            choices: [
                "View Product Sales by Department",
                "Create New Department"
            ]
        })
        .then(function (response) {
            switch (response.action) {
                case "View Product Sales by Department":
                    viewProductSales();
                    break;

                case "Create New Department":
                    createDepartment();
                    break;
            }
        });
};

// JOIN DEPARTMENTS TABLE*******
function viewProductSales() {
    // Select the department id, dept name and products sales. Right join the departments table to the products table
    // Group by the department_name and order by ID, ascending 
    connection.query("SELECT d.department_id, p.department_name, product_sales FROM products p RIGHT JOIN departments d ON p.department_name=d.department_name GROUP BY d.department_name ORDER by d.department_id ASC",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            actionList();
        });
};

// Function to create a new department (new line) in the departments table 
function createDepartment() {
    // Ask the necessary information
    inquirer
        .prompt([
            {
                name: "department_name",
                type: "input",
                message: "What's the name of the new department?"
            },
            {
                name: "over_head_costs",
                type: "input",
                message: "What are the total overhead costs associated with this department?"
            }
        ]).then(function (response) {
            // Input information into the database
            connection.query(
                "INSERT INTO departments SET ?",
                {
                    department_name: response.department_name,
                    over_head_costs: response.over_head_costs
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("-------------------------------------------\nThe department was successfully added!\n-------------------------------------------\n");
                    // Re-start the process 
                    actionList();
                }
            );
        });
};

