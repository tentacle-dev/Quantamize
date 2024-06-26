// Function to display products

function displayProducts() {
  const dbName = "Quantamize";
  const request = window.indexedDB.open(dbName);

  request.onerror = function () {
    console.error("Failed to open database");
  };

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(["product"], "readwrite");
    const productStore = transaction.objectStore("product");

    const productListDiv = document.getElementById("product-list");

    productStore.openCursor().onsuccess = function (event) {
      const cursor = event.target.result;
      if (cursor) {
        const product = cursor.value;
        console.log(product);
        if (product.type == "Robot") {
          const productDiv = document.createElement("div");
          productDiv.classList.add("product"); // Add a class to the product div
          productDiv.innerHTML = `
                        

<div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer ">
    
        <img class="p-1 rounded-t-lg product-img zoomable-image" src="${product.image_path}" />
    <div class="px-5 pb-5 mt-2">
        <div>
            <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">${product.name}</h5>
            <h5 class="text-md tracking-tight text-gray-900 dark:text-gray-100">${product.description}</h5>
        </div>
        
        <div class="flex items-center justify-between lg:mt-1">
            <span class="text-3xl font-bold text-gray-900 dark:text-white">${product.price}</span>
            <a class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add to cart</a>
        </div>
    </div>
</div>

                    `;
          // Add click event listener to the product div
          productDiv.addEventListener("click", function () {
            addToCart(product); // Call function to add product to cart
          });
          productListDiv.appendChild(productDiv);
        }
        cursor.continue();
      } else {
        console.log("All products displayed");
      }
    };
  };
}

// Function to add product to cart
function addToCart(product) {
  const user_id = localStorage.getItem("user_id"); // Retrieve user ID from sessionStorage
  if (!user_id) {
    // User is not logged in, redirect to login page
    window.location.href = "login.html";
    return;
  }

  const dbName = "Quantamize";
  const request = window.indexedDB.open(dbName);

  request.onerror = function () {
    console.error("Failed to open database");
  };

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(["cart"], "readwrite");
    const cartStore = transaction.objectStore("cart");

    // Get all cart items
    const getAllRequest = cartStore.getAll();
    getAllRequest.onsuccess = function () {
      const cartItems = getAllRequest.result;
      // Check if the combination of product ID and user ID already exists in the cart
      const existingCartItem = cartItems.find(
        (item) =>
          item.product_id === product.product_id && item.user_id === user_id
      );
      if (existingCartItem) {
        // Entry already exists, update quantity or any other field if needed
        existingCartItem.quantity++; // For example, increase quantity
        cartStore.put(existingCartItem); // Update the existing entry
<<<<<<< HEAD
        alert("Existing entry updated in cart");
=======
        console.log("Existing entry updated in cart");
>>>>>>> origin/main
      } else {
        // Entry doesn't exist, add new entry to cart
        const cartItem = {
          product_id: product.product_id,
          user_id: user_id,
          quantity: 1, // Initial quantity
          price: product.price, // Add the price of the product to the cart item
        };
        // Add the new cart item to the cart table
        const addToCartRequest = cartStore.add(cartItem);
        addToCartRequest.onsuccess = function () {
<<<<<<< HEAD
          alert("Product added to cart");
=======
          console.log("Product added to cart");
>>>>>>> origin/main
        };
        addToCartRequest.onerror = function () {
          console.error("Failed to add product to cart");
        };
      }
    };
  };
}

// Call the function to display products when the window loads
window.onload = function () {
  displayProducts();
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

let lastTouchDistance = 0;
let currentScale = 1;
let activeImage = null;

const images = document.querySelectorAll(".zoomable-image");

images.forEach((image) => {
  image.addEventListener("touchstart", function (event) {
    activeImage = this;
    if (event.touches.length >= 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      lastTouchDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
    }
  });

  image.addEventListener("touchmove", function (event) {
    if (activeImage === this && event.touches.length >= 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const touchDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      const scaleChange = touchDistance / lastTouchDistance;
      currentScale *= scaleChange;

      this.style.transform = `scale(${currentScale})`;

      lastTouchDistance = touchDistance;

      event.preventDefault();
    }
  });

  image.addEventListener("touchend", function (event) {
    if (activeImage === this) {
      activeImage = null;
    }
  });
});
