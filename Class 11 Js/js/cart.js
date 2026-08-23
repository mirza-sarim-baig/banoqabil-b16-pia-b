let cartItems = JSON.parse(localStorage.getItem("cartArr") || "[]");
const cartContainer = document.getElementById("cartItems");

function escapeHtml(value) {
  const element = document.createElement("div");
  element.textContent = value;
  return element.innerHTML;
}

function groupedItems() {
  return cartItems.reduce((groups, item) => {
    const existing = groups.find((group) => group.id === item.id);
    if (existing) existing.quantity += 1;
    else groups.push({ ...item, quantity: 1 });
    return groups;
  }, []);
}

function updateQuantity(id, change) {
  if (change > 0) {
    const item = cartItems.find((product) => product.id === id);
    if (item) cartItems.push(item);
  } else {
    const itemIndex = cartItems.findIndex((product) => product.id === id);
    if (itemIndex !== -1) cartItems.splice(itemIndex, 1);
  }
  localStorage.setItem("cartArr", JSON.stringify(cartItems));
  renderCart();
}

function removeItem(id) {
  cartItems = cartItems.filter((item) => item.id !== id);
  localStorage.setItem("cartArr", JSON.stringify(cartItems));
  renderCart();
}

function renderCart() {
  const items = groupedItems();
  const totalQuantity = cartItems.length;
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 0 && subtotal < 50 ? 5.99 : 0;
  cartContainer.innerHTML = "";
  document.getElementById("itemCount").textContent =
    `${totalQuantity} ${totalQuantity === 1 ? "item" : "items"}`;
  document.getElementById("uniqueCount").textContent =
    `${items.length} ${items.length === 1 ? "product" : "products"}`;
  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("shipping").textContent = shipping
    ? `$${shipping.toFixed(2)}`
    : "Free";
  document.getElementById("total").textContent =
    `$${(subtotal + shipping).toFixed(2)}`;
  document.getElementById("emptyCart").hidden = items.length > 0;

  items.forEach((item) => {
    const product = document.createElement("article");
    product.className = "cart-item";
    product.innerHTML = `<div class="item-image"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}"></div><div class="item-details"><span class="item-category">${escapeHtml(item.category)}</span><h3>${escapeHtml(item.title)}</h3><p>$${item.price.toFixed(2)} each</p></div><div class="quantity-control"><button type="button" data-change="-1" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button type="button" data-change="1" aria-label="Increase quantity">+</button></div><strong class="item-total">$${(item.price * item.quantity).toFixed(2)}</strong><button class="remove-item" type="button" aria-label="Remove ${escapeHtml(item.title)}">×</button>`;
    product
      .querySelectorAll("[data-change]")
      .forEach((button) =>
        button.addEventListener("click", () =>
          updateQuantity(item.id, Number(button.dataset.change)),
        ),
      );
    product
      .querySelector(".remove-item")
      .addEventListener("click", () => removeItem(item.id));
    cartContainer.appendChild(product);
  });
}

document.getElementById("checkoutButton").addEventListener("click", () => {
  if (!cartItems.length) return;
  alert("Thanks! Checkout is ready to be connected to a payment service.");
});

renderCart();
