// console.log("Hello, World!");

// if(){}
// keyword, condition, block of code
//else{}
// keyword, block of code

// let number = 11;
// //comparision operators
// let name;
// if (name) {
//   console.log("Print True");
// } else {
//   console.log("Print False");
// }

// let number = 59;

// if (number >= 80) {
//   console.log("Grade A");
// } else if (number >= 70) {
//   console.log("Grade B");
// } else if (number >= 60) {
//   console.log("Grade C");
// } else {
//   console.log("Fail");
// }

// let num1 = +prompt("Enter num1");
// let num2 = +prompt("Enter num2");
// let opr = prompt("Enter operator(+,-,*,/)");

// if (opr == "+") {
//   console.log("sum:", num1 + num2);
// } else if (opr == "-") {
//   console.log("sub:", num1 - num2);
// } else if (opr == "*") {
//   console.log("mul:", num1 * num2);
// } else if (opr == "/") {
//   console.log("div:", num1 / num2);
// } else {
//   console.warn("Please enter correct operator");
// }

let bunType = prompt("Enter bun type ( plain, sweet, garlic )");
let meatType = prompt("Enter meat type (beef, chicken)");
let meatQuantity = +prompt("Enter meat quantity(in numbers)");
// let isVeg = prompt("Want to include vegs(yes/no)");
// let isDrink = prompt("Drink (black, white)");

let menu = {
  plain: 50,
  sweet: 60,
  garlic: 80,
  beef: 200,
  chicken: 150,
  veg: 50,
  black: 120,
  white: 100,
};

let totalBill = menu[bunType] + menu[meatType] * meatQuantity;

// let plainBun = 50;
// let sweetBun = 60;
// let garlicBun = 80;
// let beefPiece = 200;
// let chickenPiece = 150;
// let veg = 50;
// let blackDrink = 120;
// let whiteDrink = 100;

// let totalBill = 0;

// if (bunType == "plain") {
//   totalBill = totalBill + plainBun;
// } else if (bunType == "sweet") {
//   totalBill = totalBill + sweetBun;
// } else if (bunType == "garlic") {
//   totalBill = totalBill + garlicBun;
// } else {
//   console.log("Please enter correct bun type");
// }

// if (meatType == "beef") {
//   totalBill = totalBill + beefPiece * meatQuantity;
// } else if (meatType == "chicken") {
//   totalBill = totalBill + chickenPiece * meatQuantity;
// } else {
//   console.log("Please enter correct meat type");
// }

console.log("Total Bill is:", totalBill);
