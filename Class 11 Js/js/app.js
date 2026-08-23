const fetchData = async () => {
  try {
    // console.log(1);
    // console.log(2);
    // console.log(username);
    // console.log(4);

    let response = await fetch("https://fakestoreapi.com/products");
    let productData = await response.json();

    mapData(productData);
  } catch (error) {
    console.log(error);
  }
};

fetchData();

const mapData = (productData) => {
  console.log("productData", productData);
  //   let userName = document.getElementById("userName");
  //   userName.innerHTML = "<span>sarim </span>";

  let cardContainer = document.getElementById("card-container");

  for (let i = 0; i < productData.length; i++) {
    let productCard = `
  <div class="product-card">
        <!-- Product Image -->
        <div class="image-wrapper">
          <span class="category"> ${productData[i].category} </span>

          <img
            class="product-image"
            src= ${productData[i].image}
            alt="Fjallraven Foldsack Backpack"
          />
        </div>

        <!-- Product Information -->
        <div class="content">
          <h2 class="product-title">
            ${productData[i].title}
          </h2>

          <p class="description">
            ${productData[i].description}
          </p>

          <!-- Rating -->
          <div class="rating">
            <span class="stars"> ★★★★☆ </span>

            <span class="rating-number">
            ${productData[i].rating.rate}
             </span>

            <span class="review-count"> 
            ${productData[i].rating.count} reviews
            
            </span>
          </div>

          <!-- Price + Button -->
          <div class="bottom">
            <div class="price">
            $ ${productData[i].price}
            </div>

            <button class="add-btn" onclick="addToCart(${productData[i].id})">Add to Cart</button>
          </div>
        </div>
      </div>
  `;
    cardContainer.innerHTML += productCard;
  }
};
let cartArr = JSON.parse(localStorage.getItem("cartArr")) || [];

let cartItems = document.getElementById("cartItems");
cartItems.innerText = cartArr.length;
console.log(cartArr);
const addToCart = async (id) => {
  let response = await fetch(`https://fakestoreapi.com/products/${id}`);
  let productData = await response.json();
  cartArr.push(productData);

  localStorage.setItem("cartArr", JSON.stringify(cartArr));
  cartItems.innerText = cartArr.length;

  console.log(" cartArr.length", cartArr.length);
};
