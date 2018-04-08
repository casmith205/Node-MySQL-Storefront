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

// On connection to the database, run the start function
connection.connect(function (err) {
    if (err) throw err;
    start();
});

// Shows the table of available products and kicks off the buyItem function
function start() {
    connection.query("SELECT item_id, product_name, price FROM products",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            buyItem();
        });
};

// Gives the user a choice of which product to buy and updates product revenue & quantity (if there is enough in stock to complete the purchase)
function buyItem() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "itemList",
                type: "list",
                choices: function () {
                    var itemArr = [];
                    for (i = 0; i < res.length; i++) {
                        itemArr.push(res[i].product_name);
                    };
                    return (itemArr);
                },
                message: "What item would you like to buy?"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to buy?"
            }
        ]).then(function (userResponse) {
            // Getting the relevant product we want to update from the database
            var productChosen;
            // If the item name is equal to response choice, then get that info from the DB
            for (var i = 0; i < res.length; i++) {
                if (res[i].product_name === userResponse.itemList) {
                    productChosen = res[i];
                }
            };
            // If there is enough in stock to complete the purchase, update the quantity and sales $ in the database
            if (productChosen.stock_quantity > parseFloat(userResponse.quantity)) {
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: (productChosen.stock_quantity - parseFloat(userResponse.quantity)),
                            product_sales: (productChosen.price * parseFloat(userResponse.quantity))
                        },
                        {
                            item_id: productChosen.item_id
                        }
                    ],
                );
                console.log("\nThank you for your purchase totaling " + (productChosen.price * userResponse.quantity) +
                    " dollars for " + userResponse.quantity + " units of " + productChosen.product_name);
                console.log("\n-----------------------------------------------------------\n");
            // If there is not enough of the item in stock, console.log a message to the user 
            } else {
                console.log("Sorry, we do not have enough in stock right now to fulfill your purchase. Please try again!");
            }
            // Re-start the process
            start();
        }
        )
    });
};