// Initializes the npm packages
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

// Initializes the connection with a MySQL database
var connection = mysql.createConnection({
  host: "localhost",

  // Port;
  port: 3306,

  // Username
  user: "root",

  // Password
  password: "",
  database: "bamazonDB"
});

// Creates a connection with the server and loads the manager start menu on a successful connection
connection.connect(function(err) {
  if (err) {
    console.error("Error connecting: " + err.stack);
  }
  startManager();
});

// Gets product data from the database
function startManager() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    // Shows possible manager options and product data
    managerOptions(res);
  });
}

// Load the manager options and pass in the products data from the database
function managerOptions(products) {
  inquirer
    .prompt({
      type: "list",
      name: "choice",
      choices: ["Show Products for Sale", "Show Items w/ Low Inventory", "Refill Inventory", "Create New Product", "Quit"],
      message: "What would you like to do?"
    })
    .then(function(val) {
      switch (val.choice) {
      case "Show Products for Sale":
        console.table(products);
        startManager();
        break;
      case "Show Items w/ Low Inventory":
        lowInventory();
        break;
      case "Refill Inventory":
        refillInventory(products);
        break;
      case "Create New Product":
        createNewProduct(products);
        break;
      default:
        console.log("Goodbye!");
        process.exit(0);
        break;
      }
    });
}

// Query the DB for low inventory products
function lowInventory() {
  // Selects all of the products that have a quantity of 7 or less
  connection.query("SELECT * FROM products WHERE stock_quantity <= 7", function(err, res) {
    if (err) throw err;
    // Draws the table in the terminal using the response, load the manager menu
    console.table(res);
    startManager();
  });
}

// Prompt the manager for a product to replenish
function refillInventory(inventory) {
  console.table(inventory);
  inquirer
    .prompt([
      {
        type: "input",
        name: "choice",
        message: "What's the ID # of the item you would you like refill?",
        validate: function(val) {
          return !isNaN(val);
        }
      }
    ])
    .then(function(val) {
      var choiceId = parseInt(val.choice);
      var product = checkInventory(choiceId, inventory);

      // If a product can be found with the chosen id
      if (product) {
        // Pass the chosen product to promptQuantityManager
        promptQuanitityManager(product);
      }
      else {
        // Otherwise let the user know and re-load the manager menu
        console.log("\nThat item is not in the inventory.");
        startManager();
      }
    });
}

// Ask for the quantity that should be added to the chosen product
function promptQuanitityManager(product) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "quantity",
        message: "How many would you like to add?",
        validate: function(val) {
          return val > 0;
        }
      }
    ])
    .then(function(val) {
      var quantity = parseInt(val.quantity);
      addQuantity(product, quantity);
    });
}

// Updates quantity of selected product
function addQuantity(product, quantity) {
  connection.query(
    "UPDATE products SET stock_quantity = ? WHERE id = ?",
    [product.stock_quantity + quantity, product.id],
    function(err, res) {
      // Let the user know the purchase was successful, re-run loadProducts
      console.log("\nSuccessfully added " + quantity + " " + product.product_name + "'s!\n");
      startManager();
    }
  );
}

// Asks the manager details about the new product
// Adds new product to the db when complete
function createNewProduct(products) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "product_name",
        message: "What is the name of the product you would like to add?"
      },
      {
        type: "list",
        name: "department_name",
        choices: getDepartments(products),
        message: "Which department does this product belong in?"
      },
      {
        type: "input",
        name: "price",
        message: "How much does it cost?",
        validate: function(val) {
          return val > 0;
        }
      },
      {
        type: "input",
        name: "quantity",
        message: "How many do we have?",
        validate: function(val) {
          return !isNaN(val);
        }
      }
    ])
    .then(addNewProduct);
}

// Adds a new product to the database, loads the manager menu
function addNewProduct(val) {
  connection.query(
    "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",
    [val.product_name, val.department_name, val.price, val.quantity],
    function(err, res) {
      if (err) throw err;
      console.log(val.product_name + " ADDED TO BAMAZONDB!\n");
      // When done, re run startManager, effectively restarting our app
      startManager();
    }
  );
}

// Take an array of product objects, return an array of their unique departments
function getDepartments(products) {
  var departments = [];
  for (var i = 0; i < products.length; i++) {
    if (departments.indexOf(products[i].department_name) === -1) {
      departments.push(products[i].department_name);
    }
  }
  return departments;
}

// Check to see if the product the user chose exists in the inventory
function checkInventory(choiceId, inventory) {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].id === choiceId) {
      // If a matching product is found, return the product
      return inventory[i];
    }
  }
  // Otherwise return null
  return null;
}
