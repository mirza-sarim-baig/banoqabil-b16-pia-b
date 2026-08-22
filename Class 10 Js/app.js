let menu = {
  buns: {
    plain: 50,
    sweet: 60,
    garlic: 80,
  },
  meat: {
    beef: 200,
    chicken: 150,
  },
  veg: {
    tomato: 10,
    onion: 8,
    lattice: 5,
  },
  drinks: {
    string: 150,
    pepsi: 130,
    fizzup: 120,
  },
};

function billGenerator() {
  let userName = document.getElementById("userName").value;
  let meatType = document.getElementById("meatType").value;
  let bunType = document.getElementById("bunType").value;
  let drinkType = document.getElementById("drinkFlavour").value;
  let orderQuantity = document.getElementById("orderQuantity").value;

  let totalBill = 0;

  totalBill +=
    menu.buns[bunType] + menu.meat[meatType] + menu.drinks[drinkType];

  totalBill = totalBill * orderQuantity;

  console.log("Total Bill is:", totalBill);
}

const signupFunc = () => {
  const loginName = document.getElementById("loginName");
  const email = document.getElementById("email");
  const pass = document.getElementById("pass");
  const cPass = document.getElementById("cPass");

  if (!loginName.value || !email.value || !pass.value || !cPass.value) {
    alert("Please fill the form");
    return;
  }

  if (pass.value != cPass.value) {
    alert("Please enter correct password");
    return;
  }

  let userObj = {
    userName: loginName.value,
    email: email.value,
    pass: pass.value,
  };

  localStorage.setItem("userObj", JSON.stringify(userObj));

  alert("Login Successful");

  loginName.value = "";
  email.value = "";
  pass.value = "";
  cPass.value = "";

  window.location.href = "home.html";
};
