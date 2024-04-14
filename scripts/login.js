// Function to handle user login
const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

function loginUser() {
    // Retrieve form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Open IndexedDB database
    const dbName = 'Quantamize';
    const request = window.indexedDB.open(dbName);

    request.onerror = function() {
        console.error('Failed to open database');
    };

    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(['user'], 'readonly');
        const userStore = transaction.objectStore('user');
        const emailIndex = userStore.index('email');

        // Retrieve user data based on email
        const getUserRequest = emailIndex.get(email);

        getUserRequest.onsuccess = function(event) {
            const userData = event.target.result;
            console.log(userData)
            if (userData && userData.password === password) {
                // User exists and password matches, redirect to index.html
                console.log('Login successful');
                // Store data in localStorage
                localStorage.setItem('user_id', userData.user_id);

                // Retrieve data from localStorage
                // const storedValue = localStorage.getItem('user_id');
                // console.log(storedValue)



                window.location.href = 'index.html';
            } else {
                // User does not exist or password is incorrect
                
                console.error('Login failed');
                alert('Invalid email or password. Please try again.');
            }
        };

        getUserRequest.onerror = function() {
            // Error retrieving user data
            console.error('Failed to retrieve user data');
            alert('An error occurred while logging in. Please try again later.');
        };
    };
}

// Function to handle form submission
function handleLoginForm(event) {
    event.preventDefault(); // Prevent default form submission behavior
    loginUser(); // Call loginUser function to handle user login
}

// Add event listener to login form for form submission
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', handleLoginForm);
