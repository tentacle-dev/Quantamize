// Function to check if the user is logged in
function checkLoggedIn() {
  const user_id = localStorage.getItem("user_id");
  if (!user_id) {
    alert("Please login to view your cart.");
    window.location.href = "login.html";
  }
}

let totalPrice = 0;

// Function to retrieve cart items for the user from IndexedDB and join with product table
function displayCartItems() {
  const userId = localStorage.getItem("user_id");
  const dbName = "Quantamize";
  const request = window.indexedDB.open(dbName);

  request.onerror = function () {
    console.error("Failed to open database");
  };

  request.onsuccess = function (event) {
    try {
      const db = event.target.result;
      const transaction = db.transaction(["cart", "product"], "readonly");
      const cartStore = transaction.objectStore("cart");
      const productStore = transaction.objectStore("product");

      const index = cartStore.index("user_id");
      const range = IDBKeyRange.only(userId);
      const cartItemsRequest = index.openCursor(range);

      cartItemsRequest.onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
          const cartItem = cursor.value;

          // Retrieve product details for each cart item
          const productRequest = productStore.get(cartItem.product_id);

          productRequest.onsuccess = function (event) {
            const product = event.target.result;
            // Combine cart item and product details and display on the cart page
            displayCartItem(cartItem, product);
          };

          cursor.continue();
        }
      };
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
}

function displayCartItem(cartItem, product) {
  const mainDiv = document.createElement("div");
  mainDiv.classList.add(
    "w-full",
    "max-w-sm",
    "bg-white",
    "border",
    "border-gray-200",
    "rounded-lg",
    "shadow",
    "dark:bg-gray-800",
    "dark:border-gray-700",
    "cursor-pointer"
  );

  const imageElement = document.createElement("img");
  imageElement.classList.add("p-1", "rounded-t-lg", "product-img");
  imageElement.src = product.image_path;
  mainDiv.appendChild(imageElement);

  const contentDiv = document.createElement("div");
  contentDiv.classList.add("px-5", "pb-5", "mt-2");

  const productNameElement = document.createElement("h5");
  productNameElement.classList.add(
    "text-xl",
    "font-semibold",
    "tracking-tight",
    "text-gray-900",
    "dark:text-white"
  );
  productNameElement.textContent = product.name;
  contentDiv.appendChild(productNameElement);

  const productDescriptionElement = document.createElement("h5");
  productDescriptionElement.classList.add(
    "text-md",
    "tracking-tight",
    "text-gray-900",
    "dark:text-gray-100"
  );
  productDescriptionElement.textContent = product.description;
  contentDiv.appendChild(productDescriptionElement);

  const quantityInput = document.createElement("input");
  quantityInput.type = "number";
  quantityInput.value = cartItem.quantity;
  quantityInput.classList.add(
    "bg-gray-50",
    "border",
    "border-gray-300",
    "text-gray-900",
    "text-sm",
    "rounded-lg",
    "focus:ring-blue-500",
    "focus:border-blue-500",
    "block",
    "w-full",
    "p-2.5",
    "dark:bg-gray-700",
    "dark:border-gray-600",
    "dark:placeholder-gray-400",
    "dark:text-white",
    "dark:focus:ring-blue-500",
    "dark:focus:border-blue-500"
  );
  quantityInput.addEventListener("change", function (event) {
    const newQuantity = parseInt(event.target.value);
    updateCartItemQuantity(cartItem.cart_id, newQuantity, product.price);
  });
  contentDiv.appendChild(quantityInput);

  const priceButtonDiv = document.createElement("div");
  priceButtonDiv.classList.add(
    "flex",
    "items-center",
    "justify-between",
    "lg:mt-1",
    "m-1"
  );

  const priceElement = document.createElement("span");
  priceElement.classList.add(
    "text-3xl",
    "font-bold",
    "text-gray-900",
    "dark:text-white",
    "mb-4",
    "ml-2"
  );
  priceElement.textContent = cartItem.price; // Display the price from the cart item
  priceButtonDiv.appendChild(priceElement);

  const removeButton = document.createElement("a");
  removeButton.classList.add(
    "text-white",
    "bg-blue-700",
    "hover:bg-blue-800",
    "focus:ring-4",
    "focus:outline-none",
    "focus:ring-blue-300",
    "font-medium",
    "rounded-lg",
    "text-sm",
    "px-5",
    "py-2.5",
    "mb-1",
    "mr-1",
    "text-center",
    "dark:bg-red-600",
    "dark:hover:bg-red-700",
    "dark:focus:ring-red-800"
  );
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", function () {
    removeCartItem(cartItem.cart_id, product.price); // Pass the product price to removeCartItem function
    mainDiv.remove();
  });
  priceButtonDiv.appendChild(removeButton);

  mainDiv.appendChild(contentDiv);
  mainDiv.appendChild(priceButtonDiv);

  const cartContainer = document.getElementById("cart-container");
  cartContainer.appendChild(mainDiv);

  totalPrice += cartItem.price * cartItem.quantity; // Update total price
  updateTotalPrice(totalPrice);
}

function updateTotalPrice(price) {
  const totalElement = document.getElementById("total");
  totalElement.textContent = `Total: $${price.toFixed(2)}`;
}

function updateCartItemQuantity(cartItemId, newQuantity, productPrice) {
  const dbName = "Quantamize";
  const request = window.indexedDB.open(dbName);

  request.onerror = function () {
    console.error("Failed to open database");
  };

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(["cart"], "readwrite");
    const cartStore = transaction.objectStore("cart");

    const getRequest = cartStore.get(Number(cartItemId));

    getRequest.onsuccess = function (event) {
      const cartItem = event.target.result;
      if (cartItem) {
        const oldQuantity = cartItem.quantity;

        cartItem.quantity = newQuantity;

        // Update the cart item with the new quantity and calculate the new price
        cartItem.price = newQuantity * productPrice;

        const updateRequest = cartStore.put(cartItem);

        updateRequest.onsuccess = function () {
          const quantityChange = newQuantity - oldQuantity;
          totalPrice += quantityChange * productPrice;
          updateTotalPrice(totalPrice);
        };

        updateRequest.onerror = function () {
          console.error("Failed to update cart item quantity");
        };
      } else {
        console.error("Cart item not found");
      }
    };

    getRequest.onerror = function () {
      console.error("Failed to retrieve cart item for updating quantity");
    };
  };
}

function removeCartItem(cartItemId, productPrice) {
  const dbName = "Quantamize";
  const request = window.indexedDB.open(dbName);

  request.onerror = function () {
    console.error("Failed to open database");
  };

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(["cart"], "readwrite");
    const cartStore = transaction.objectStore("cart");

    const deleteRequest = cartStore.delete(cartItemId);

    deleteRequest.onsuccess = function () {
      location.reload();
    };

    deleteRequest.onerror = function () {
      console.error("Failed to remove cart item");
    };
  };
}

// Call the function to check if the user is logged in when the cart page loads
// Call the function to display cart items when the window loads

window.onload = function () {
  checkLoggedIn();
  displayCartItems();
};

document.addEventListener("DOMContentLoaded", function () {
  const signinLink = document.getElementById("signin-link");
  const userId = localStorage.getItem("user_id");

  if (userId) {
    signinLink.href = "logout.html";
    signinLink.innerText = "Logout";
  } else {
    signinLink.href = "login.html";
    signinLink.innerText = "Sign in";
  }
});
