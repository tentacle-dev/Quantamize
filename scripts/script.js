// chooses the first one that is available/found
const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

// Some browsers may not support
if (!indexedDB) {
  console.log("IndexedDB could not be found in this browser.");
}

let dbName = "Quantamize";
window.onload = () => {
  // Database Name
  // We pass the name of the database and its version
  let request = indexedDB.open(dbName, 1);

  // Error handler
  request.onerror = function () {
    console.log("Database failed to open");
  };

  // Success handler
  request.onsuccess = function () {
    console.log("Database connected");

    let db = request.result;

    let productTransaction = db.transaction("product", ["readwrite"]);
    let productStore = productTransaction.objectStore("product");

    let requestUser = productStore.openCursor();

    requestUser.onsuccess = function (event) {
      const cursor = event.target.result;
      if (cursor) {
        console.log("Product:", cursor.value);
        cursor.continue();
      } else {
        console.log("All users logged");
      }
    };

    requestUser.onerror = function (event) {
      console.error("Error reading users: " + event.target.errorCode);
    };
  };

  // This function is fired when our database changes, or when the version is incremented.
  request.onupgradeneeded = function (event) {
    let db = request.result;

    // Product
    // User
    // Cart

    // Stores are like tables in indexedDb context

    //Product table
    let productStore = db.createObjectStore("product", {
      keyPath: "product_id",
      autoIncrement: true,
    });

    productStore.createIndex("product_name", "product_name");
    productStore.createIndex("product_description", "product_description");
    productStore.createIndex("product_type", "product_type");
    productStore.createIndex("product_price", "product_price");
    productStore.createIndex("product_tags", "product_tags");
    productStore.createIndex("product_image_path", "product_image_path");

    console.log("Product table created successfully");

    // Add initial data to product
    let prodTransaction = event.target.transaction;
    // Sample robot data
    const robot1 = {
      name: "Nexus Prime",
      type: "Robot",
      price: 9999.99,
      description:
        "Advanced humanoid robot capable of performing various tasks.",
      image_path: "assets/products/bot1ultra.jpg",
    };

    const robot2 = {
      name: "NeoGenesis",
      type: "Robot",
      price: 14499.99,
      description:
        "Versatile robot with advanced AI capabilities for home and industrial use.",
      image_path: "assets/products/bot2ultra.jpg",
    };

    // Sample drone data
    const drone1 = {
      name: "SkyGlide Infinity",
      type: "Drone",
      price: 299.99,
      description:
        "Compact drone with HD camera and GPS for aerial photography and videography.",
      image_path: "assets/products/drone1ultra.jpg",
    };

    const drone2 = {
      name: "AeroSphere Horizon",
      type: "Drone",
      price: 499.99,
      description:
        "Professional-grade drone with long flight time and obstacle avoidance features.",
      image_path: "assets/products/drone2ultra.jpg",
    };

    productStore.put(robot1);
    productStore.put(robot2);
    productStore.put(drone1);
    productStore.put(drone2);

    prodTransaction.oncomplete = function () {
      console.log("Products added successfully");
    };

    prodTransaction.onerror = function (event) {
      console.error("Error adding products: " + event.target.errorCode);
    };

    const userStore = db.createObjectStore("user", {
      keyPath: "user_id",
      autoIncrement: true,
    });

    // Define the structure of the user data and create indexes
    userStore.createIndex("email", "email", { unique: true });
    userStore.createIndex("personalUrl", "personalUrl", { unique: false });
    userStore.createIndex("yearOfBirth", "yearOfBirth", { unique: false });
    userStore.createIndex("gender", "gender", { unique: false });
    userStore.createIndex("comments", "comments", { unique: false });
    userStore.createIndex("dataValidityConfirmed", "dataValidityConfirmed", {
      unique: false,
    });

    console.log("User table created successfully");

    let userTransaction = event.target.transaction;
    // Sample user data
    const user1 = {
      email: "user1@example.com",
      personalUrl: "http://example.com/user1",
      yearOfBirth: 1995,
      gender: "male",
      password: "user1@example.com",
      comments: "Sample comments for user 1.",
      dataValidityConfirmed: true,
    };

    const user2 = {
      email: "user2@example.com",
      personalUrl: "http://example.com/user2",
      yearOfBirth: 1988,
      gender: "female",
      password: "user2@example.com",
      comments: "Sample comments for user 2.",
      dataValidityConfirmed: true,
    };

    userStore.add(user1);
    userStore.add(user2);

    userTransaction.oncomplete = function () {
      console.log("Users added successfully");
    };

    userTransaction.onerror = function (event) {
      console.error("Error adding users: " + event.target.errorCode);
    };

    // Cart Table
    let cartStore = db.createObjectStore("cart", {
      keyPath: "cart_id",
      autoIncrement: true,
    });
    cartStore.createIndex("product_id", "product_id", { unique: false });
    cartStore.createIndex("user_id", "user_id", { unique: false });
    cartStore.createIndex("quantity", "quantity", { unique: false });
    cartStore.createIndex("price", "price", { unique: false });

    console.log("Cart Table created successfully");
  };
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
