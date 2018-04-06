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

connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    connection.query("SELECT * FROM products",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            buyItem();
        });
};

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
            console.log(userResponse.itemList);
            console.log(userResponse.quantity);

        });
    }
    )
};