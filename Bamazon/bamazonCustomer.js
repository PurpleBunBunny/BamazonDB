// Initializes the npm packages 
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

// Initializes the connection with a MySQL database
var connection = mysql.createConnection({
  host: "localhost",

  // Port
  port: 3306,

  // Username
  user: "root",

  // Password
  password: "",
  database: "bamazonDB"
});

// Creates a connection with the server and loads the product data on a successful connection
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  start();
});

// Function to show the products table from the database and print results to the console
function start() {
  // Selects all of the data from the MySQL products table
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    // Shows the table in the terminal using the response
    console.table(res);

    // Then prompts the customer for their choice of product, pass all the products to startPrompt
    startPrompt(res);
  });
}

// Prompt the customer for a product ID
function startPrompt(inventory) {
  // Prompts user for what they would like to purchase
  inquirer
    .prompt([
      {
        type: "input",
        name: "choice",
        message: "What item(ID) you would you like to purchase? [Quit with Q]",
        validate: function(val) {
          return !isNaN(val) || val.toLowerCase() === "q";
        }
      }
    ])
    .then(function(val) {
      // Check if the user wants to quit the program
      quitFunction(val.choice);
      var choiceId = parseInt(val.choice);
      var product = checkQuantity(choiceId, inventory);

      // If there is a product with the id the user chose, prompt the customer for a desired quantity
      if (product) {
        // Pass the chosen product to quantityPrompt
        quantityPrompt(product);
      }
      else {
        // Otherwise let them know the item is not in stock, re-run start
        console.log("\nThat item is not in stock.");
        start();
      }
    });
}

// Prompt the customer for a product quantity
function quantityPrompt(product) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "quantity",
        message: "How many would you like? [Quit with Q]",
        validate: function(val) {
          return val > 0 || val.toLowerCase() === "q";
        }
      }
    ])
    .then(function(val) {
      // Check if the user wants to quit the program
      quitFunction(val.quantity);
      var quantity = parseInt(val.quantity);

      // If there isn't enough of the chosen product and quantity, let the user know and re-run start
      if (quantity > product.stock_quantity) {
        console.log("\nInsufficient quantity!");
        start();
      }
      else {
        // Otherwise run buy, give it the product information and desired quantity to purchase
        buy(product, quantity);
      }
    });
}

// Purchase the desired quantity of the desired item
function buy(product, quantity) {
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [{stock_quantity: quantity}, {id: product.id}],
    function(err, res) {
        console.log('RES AFTER PURCHASE: ', res)
      // Let the user know the purchase was successful, re-run start
      console.log("\nSuccessfully purchased " + quantity + " " + product.product_name + "'s!");
      start();
    }
  );
}

// Check to see if the product the user chose exists in the inventory
function checkQuantity(choiceId, inventory) {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].id === choiceId) {
      // If a matching product is found, return the product
      return inventory[i];
    }
  }
  // Otherwise return null
  return null;
}

// Check to see if the user wants to quit the program
function quitFunction(choice) {
  if (choice.toLowerCase() === "q") {
    // Log a message and exit the current node process
    console.log("Thank you come again!");
    process.exit(0);
  }
}
