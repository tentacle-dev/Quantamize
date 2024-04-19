// Function to handle user registration
let email = document.getElementById('email');
let password = document.getElementById('password');
let personalURL = document.getElementById('personalURL');
let yearOfBirth = document.getElementById('yearOfBirth');

let comments = document.getElementById('comments');
let confirmData = document.getElementById('confirmData');

let genderInputs = document.querySelectorAll('input[name="gender"]');

// Define a variable to hold the selected gender value
let genderVal = null;

// Assign event listeners to gender radio buttons
genderInputs.forEach(input => {
    input.addEventListener('change', function() {
        genderVal = this.value;
    });
});

function registerUser() {
    // Retrieve form data
    const emailVal = email.value;
    const passwordVal = password.value;
    const personalURLVal = personalURL.value;
    const yearOfBirthVal = yearOfBirth.value;
    const commentsVal = comments.value;
    const confirmDataVal = confirmData.checked;
    const userData = {
                email: emailVal,
                password: passwordVal,
                personalUrl: personalURLVal,
                yearOfBirth: yearOfBirthVal,
                gender: genderVal,
                comments: commentsVal,
                dataValidityConfirmed: true 
    };
    // console.log(genderVal)
    // alert(userData);

    // Check if all fields are filled and data validity is confirmed
    if (email && password && personalURL && yearOfBirth && genderVal && comments && confirmData) {
        // Open IndexedDB database
        const dbName = 'Quantamize';
        const request = window.indexedDB.open(dbName);

        request.onerror = function() {
            console.error('Failed to open database');
        };

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(['user'], 'readwrite');
            const userStore = transaction.objectStore('user');

            console.log(genderVal)

            // Prepare user data object
            const userData = {
                email: email.value,
                password: password.value,
                personalUrl: personalURL.value,
                yearOfBirth: yearOfBirth.value,
                gender: genderVal,
                comments: comments.value,
                dataValidityConfirmed: true 
            };

            console.log(userData)
            // Add user data to IndexedDB user table
            const addUserRequest = userStore.add(userData);

            addUserRequest.onsuccess = function() {
                console.log('User registration successful');
                // Redirect user to login page
                window.location.href = 'login.html';
            };

            addUserRequest.onerror = function() {
                console.error('Failed to register user');
                // Handle error, if needed
            };
        };
    } else {
        // Inform user to fill in all fields and confirm data validity
        alert('Please fill in all fields and confirm data validity.');
    }
}

function calculateProgress(email, password, personalURL, yearOfBirth, genderVal, comments, confirmData) {
    let progress = 0;
    if (email.value) progress += 15;
    if (password.value) progress += 15;
    if (personalURL.value) progress += 15;
    if (yearOfBirth.value) progress += 15;
    if (genderVal != null) progress += 15;
    if (comments.value) progress += 15;
    if (confirmData.checked) progress += 10; // Confirm data checkbox contributes less
    return progress;
}

function handleProgressBar(){
    let progress = calculateProgress(email, password, personalURL, yearOfBirth, genderVal, comments, confirmData);
    updateProgressBar(progress);

}

function updateProgressBar(progress) {
    const progressBar = document.getElementById('progress');
    progressBar.style.width = '${progress}%';
    if (progress == 100){
        progressBar.className += bg-green-500;
    }
}


function handleInputEvent() {
    handleProgressBar();
}

// Add event listeners to form fields for input events
document.getElementById('email').addEventListener('input', handleInputEvent);
document.getElementById('password').addEventListener('input', handleInputEvent);
document.getElementById('personalURL').addEventListener('input', handleInputEvent);
document.getElementById('yearOfBirth').addEventListener('input', handleInputEvent);
document.querySelectorAll('input[name="gender"]').forEach(input => {
    input.addEventListener('change', handleInputEvent);
});
document.getElementById('comments').addEventListener('input', handleInputEvent);
document.getElementById('confirmData').addEventListener('change', handleInputEvent);


// Function to handle form submission
function handleRegistrationForm(event) {
    event.preventDefault(); // Prevent default form submission behavior
    registerUser(); // Call registerUser function to handle user registration
    
}



// Add event listener to registration form for form submission
const registrationForm = document.getElementById('registrationForm');
registrationForm.addEventListener('submit', handleRegistrationForm);