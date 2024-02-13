const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }

  display() {
    console.log(`${this.id}. ${this.name} ${this.price}€`);
  }
}
const espresso = new Product(1, "Espresso", 1.99);
const doubleEspresso = new Product(2, "Double Espresso", 2.99);
const americano = new Product(3, "Americano", 3.59);
const latte = new Product(4, "Latte", 3.9);
const cappuccino = new Product(5, "Cappuccino", 4.5);
const macchiato = new Product(6, "Macchiato", 2.69);
const mocha = new Product(7, "Mocha", 3.5);
const flatWhite = new Product(8, "Flatwhite", 4.99);
const mocha2 = new Product(9, "Mocha2", 5.99);
const dopio = new Product(10, "Dopio", 3.19);

const products = [
  espresso,
  doubleEspresso,
  americano,
  latte,
  cappuccino,
  macchiato,
  mocha,
  flatWhite,
  mocha2,
  dopio,
];

// Basket
class Basket {
  constructor() {
    this.items = {};
  }

  addItem(id, item) {
    if (this.items[id]) {
      this.items[id].quantity += item.quantity;
    } else {
      this.items[id] = item;
    }
  }

  displayBasket(discount) {
    let totalItems = 0;
    let totalPrice = 0;

  const discountFactor = discount === "y" ? 0.9 : 1;

  Object.values(this.items).forEach((item) => {
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity * discountFactor;
  });
      
    console.log(`Total items ordered: ${totalItems}`);
    console.log(`Total price: ${totalPrice.toFixed(2)}€`);
  }
}

const basket = new Basket();

//Welcome
rl.question(
  "Welcome to the coffee shop! Would you like to order? ",
  function (answer) {
    if (answer.toLowerCase() === "y") {
      console.log(
        "Great! Have you already decided? Here is our offer to see one more time!"
      );
      products.forEach((product) => product.display());
      orderDrink();
    } else {
      console.log("Thank you! See you next time!");
      rl.close();
    }
  }
);

// Order
function orderDrink() {
  rl.question("What would you like to drink? (Enter ID) ", function (id) {
    const drink = products.find((product) => product.id === parseInt(id));
    if (drink) {
      // quantity

      rl.question(
        `How many ${drink.name} would you like? `,
        function (quantity) {
          if (!isNaN(quantity) && parseInt(quantity) > 0) {
            drink.quantity = parseInt(quantity);
            basket.addItem(id, drink);
            console.log(`${quantity} ${drink.name}  added to your basket.`);
          } else {
            console.log(
              "Invalid quantity. Please enter a valid number greater than 0."
            );
          }

          // Order more

          rl.question(
            "Would you like to order anything else? (yes/no) ",
            function (additionalOrder) {
              if (additionalOrder.toLowerCase() === "y") {
                orderDrink();
              } else {
                // Membership card

                rl.question(
                  "Do you have our membership card? ",
                  function (membership) {
                    if (membership.toLowerCase() === "y") {
                      console.log(`You have a 10% discount.`);
                    }
                    if (membership.toLowerCase() === "y") {
                      basket.displayBasket("y");
                    } else {
                      basket.displayBasket();
                    }
                    rl.close();
                    console.log("Thank you! See you next time!");
                  }
                );
              }
            }
          );
        }
      );
    } else {
      console.log("Invalid drink ID. Please try again.");
      orderDrink();
    }
  });
}
