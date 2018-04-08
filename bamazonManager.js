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

// Ask what the manager wants to do and run a function based on their answer
function actionList() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Welcome to the management portal! What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        })
        .then(function (response) {
            switch (response.action) {
                case "View Products for Sale":
                    viewProducts();
                    break;

                case "View Low Inventory":
                    viewLow();
                    break;

                case "Add to Inventory":
                    addQuantity();
                    break;

                case "Add New Product":
                    addProduct();
                    break;
            }
        });
};

// Function used to query the DB and show all product information
function viewProducts() {
    console.log("\nHere is everything currently in inventory: \n")
    connection.query("SELECT * FROM products",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            console.log("\n------------------------------------------------------\n")
            // Re-start the process 
            actionList();
        });
};

// Function used to query the DB and show only the low inventory, defined as less than 10 units available 
function viewLow(){
    console.log("\nThe following products are running low (**less than 10 units in stock): \n")
    connection.query("SELECT * FROM products WHERE stock_quantity<10",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            // Re-start the process 
            actionList();
        });
};

// Function used to add more inventory based on management input
function addQuantity() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "item_id",
                    type: "input",
                    message: "What's the id of the product?"
                },
                {
                    name: "stock_quantity",
                    type: "input",
                    message: "How many units of the product are being added to inventory?"
                }
            ]).then(function (userResponse) {
                // Getting the relevant product we want to update from the database
                var productChosen;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].item_id == userResponse.item_id) {
                        productChosen = res[i];
                    }
                };
                // Set stock quantity to the current quantity plus the additions by the manager where the item id === the item id of the productChosen
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: (productChosen.stock_quantity + parseFloat(userResponse.stock_quantity))
                        },
                        {
                            item_id: productChosen.item_id
                        }
                    ],
                );
                console.log("-------------------------------------------\nStock quantity was successfully updated!\n-------------------------------------------\n");
                // Re-start the process 
                actionList();
            });
    })
};

// Function used to add a new product (line in the table) based on user input
function addProduct() {
            inquirer
                .prompt([
                    {
                        name: "product_name",
                        type: "input",
                        message: "What's the name of the product?"
                    },
                    {
                        name: "department_name",
                        type: "input",
                        message: "What department does this product belong to?"
                    },
                    {
                        name: "price",
                        type: "input",
                        message: "What is the cost per unit?"
                    },
                    {
                        name: "stock_quantity",
                        type: "input",
                        message: "How many units of the product are available for purchase?"
                    }
                ]).then(function (response) {
                    connection.query(
                        "INSERT INTO products SET ?",
                        {
                            product_name: response.product_name,
                            department_name: response.department_name,
                            price: response.price,
                            stock_quantity: response.stock_quantity
                        },
                        function (err, res) {
                            if (err) throw err;
                            console.log("-------------------------------------------\nProduct was successfully added into inventory!\n-------------------------------------------\n");
                            // Re-start the process 
                            actionList();
                        }
                    );
                });
        };
