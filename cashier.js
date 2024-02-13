/**
 * cashier.js
 */



const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// CLASSES

// Product
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

// Basket
class Basket {
  constructor() {
    this.items = {}; // { <id drink>: <integer quantity> }
  }

  addItem(id, newOrderQuantity) {
    const currentQuantity = this.items[id] || 0
    this.items[id] = currentQuantity + newOrderQuantity
  }

  displayBasket(applyDiscount) {
    const discountFactor = applyDiscount ? "0.9" : 1
    let totalItems = 0;
    let totalPrice = 0;


    Object.entries(this.items).forEach(([ id, quantity ]) => {
      totalItems += quantity;
      const product = getProductById(id)

      totalPrice += product.price * quantity * discountFactor
    });

    console.log(`Total items ordered: ${totalItems}`);
    console.log(`Total price: ${totalPrice.toFixed(2)}€`);
  }
}

// PRODUCTS

// const espresso = new Product(1, "Espresso", 1.99);
// const doubleEspresso = new Product(2, "Double Espresso", 2.99);
// const americano = new Product(3, "Americano", 3.59);
// const latte = new Product(4, "Latte", 3.9);
// const cappuccino = new Product(5, "Cappuccino", 4.5);
// const macchiato = new Product(6, "Macchiato", 2.69);
// const mocha = new Product(7, "Mocha", 3.5);
// const flatWhite = new Product(8, "Flatwhite", 4.99);
// const mocha2 = new Product(9, "Mocha2", 5.99);
// const dopio = new Product(10, "Dopio", 3.19);

// const products = [
//   espresso,
//   doubleEspresso,
//   americano,
//   latte,
//   cappuccino,
//   macchiato,
//   mocha,
//   flatWhite,
//   mocha2,
//   dopio,
// ];

// You can create the products array directly from the instances
// of the Product class.

// I made the prices the same as the product ids, to make it
// easier to check if the total price is correctly calculated.
const products = [
  new Product(1,  "Espresso",        1),
  new Product(2,  "Double Espresso", 2),
  new Product(3,  "Americano",       3),
  new Product(4,  "Latte",           4),
  new Product(5,  "Cappuccino",      5),
  new Product(6,  "Macchiato",       6),
  new Product(7,  "Mocha",           7),
  new Product(8,  "Flatwhite",       8),
  new Product(9,  "Mocha2",          9),
  new Product(10, "Dopio",          10),
];


// An "Immediately Invoked Function Expression" (IIFE) will run
// automatically. You don't need to call...
//
//   takeOrder()
//
// ... to make it run.

;(async function takeOrder() {
  const basket = new Basket()
  let state =  { action: "greetCustomer", basket }
  // { action, basket, drink, more, applyDiscount}
  // basket.items will be { <drink id>: <quantity>, ... }
  // action will be set to "" when the order is complete

  while (state.action) {
    state = await askQuestion(state)
  }

  if (state.drink) { //
    basket.displayBasket(state.applyDiscount)
  }

  console.log("Thank you! See you next time!");
  rl.close();
})()


// Switch statement to call a different function for each
// action state of the conversation
async function askQuestion(state) {
  switch (state.action) {
    case "greetCustomer":
      return await greetCustomer(state)
    case "orderDrink":
      return await orderDrink(state)
    case "getQuantity":
      return await getQuantity(state)
    case "anythingElse":
      return await anythingElse(state)
    case "checkForDiscount":
      return await checkForDiscount(state)
    }
}


// Utilities

// Define affirmativeAnswers once, so it is not recreated each
// time answerIsAffirmative() is called
const affirmativeAnswers = ["y", "yes", "yeah", "sure", "ok"]

function answerIsAffirmative(answer) {
  // Convert to lower case and remove any punctuation, so
  // "Sure!" will be converted to "sure"
  answer = answer.toLowerCase().replace(/[.?!]/, "")
  return affirmativeAnswers.indexOf(answer) > -1
}



function inputIsValidInteger(input, min, max) {
  input = Number(input)
  const isValid = !isNaN(input)
                && input >= min
                && input <= max
                && !(input % 1) // no floating point numbers
  return isValid && input // false or integer (which may be 0)
}



function getProductById(id) {
  return products.find( product => (
    product.id === Number(id)
  ));
}



// The rl function expects a callback, so it's not possible to
// return a value directly from the conversation function calls.
// Each of the functions below:
// * Is asynchronous
// * Returns a Promise
// * Resolves the Promise with a state object
// * May update the value of the `action` property of the state
//   object, if the conversation is to move to a different topic.

// Welcome
async function greetCustomer(state) {
  return new Promise( resolve => {
    rl.question(
      "Welcome to the coffee shop! Would you like to order? (y/n) ",
      treatAnswerToGreeting
    )

    function treatAnswerToGreeting(answer) {
      if (answerIsAffirmative(answer)) {
        console.log(
          "Great! Have you already decided? Here is our offer to see one more time!"
        );
        products.forEach((product) => product.display());
        resolve({ ...state, action: "orderDrink" })

      } else { // No order
        resolve({}) // no action, basket is not used
      }
    }
  })
}



// Order
async function orderDrink(state) {
  const { more } = state

  return new Promise( resolve => {
    rl.question(
      `What ${more ? "else " : ""}would you like to drink? (Enter ID) `,
      chooseDrink
    )

    function chooseDrink(id) {
      const drink = getProductById(id) // undefined if id invalid

      if (drink) {
        const action = id ? "getQuantity" : ""
        resolve({ ...state, drink, action })

      } else {
        console.log("I'm sorry, we don't have that on the menu.")
        resolve (state) // unchanged. action = "orderDrink"
      }
    }
  })
}



// Number of drinks
async function getQuantity(state) {
  const { drink } = state
  const { id } = drink

  return new Promise( resolve => {
    rl.question(
      `How many ${drink.name} would you like? `,
      checkQuantity
    )

    function checkQuantity(quantity) {
      quantity = inputIsValidInteger(quantity, 1, 100)

      if (typeof quantity === "number") {
        const { basket } = state

        basket.addItem(id, quantity);
        console.log(`${quantity} ${drink.name} added to your basket.`);
        resolve({ ...state, action: "anythingElse" })

      } else {
        console.log(
          "Invalid quantity. Please enter a number greater than 0."
        );

        resolve( state )
        // action is still "getQuantity"
        // drink and basket are unchanged
      }
    }
  })
}



// Order more
async function anythingElse(state) {
  return new Promise ( resolve => {
    rl.question(
      "Would you like to order anything else? (y/n) ",
      additionalOrder
    )

    function additionalOrder(answer) {
      if (answerIsAffirmative(answer)) {
        resolve({ ...state, more: true, action: "orderDrink" })

      } else {
        resolve({ ...state, action: "checkForDiscount" })
      }
    }
  })
}



// Membership card
async function checkForDiscount(state) {
  return new Promise( resolve => {
    rl.question(
      "Do you have our membership card? (y/n) ",
      clientHasMembershipCard
    )

    function clientHasMembershipCard(membership) {
      const applyDiscount =  membership.toLowerCase() === "y"

      if (applyDiscount) {
        console.log(`You have a 10% discount.`);
      }

      resolve({ ...state, applyDiscount, action: "" })
    }
  })
}