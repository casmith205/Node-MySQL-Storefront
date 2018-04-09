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

// Ask what the supervisor wants to do and run a function based on their answer
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

// Function to show the product sales and total profit by department
function viewProductSales() {
    // Creating a variable to hold the alias information -- this is how we get total profit. Take the products table's product_sales and subtract the department table's OH costs
    var alias = "(SUM(p.product_sales) - d.over_head_costs) AS total_profit";
    // Creating a variable to hold the columns we want to see in our table
    var columns =  "d.department_id, p.department_name, over_head_costs, product_sales, "+alias;
    // Select the columns given above (with the alias) & right join the departments table to the products table
    // Group by the department_name and order by ID, ascending 
    connection.query("SELECT "+ columns+ " FROM departments d RIGHT JOIN products p ON d.department_name=p.department_name GROUP BY d.department_name ORDER by d.department_id ASC",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            // Re-start the process 
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

