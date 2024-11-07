
// check if user is logged in or not . to show logout and login button
document.addEventListener("DOMContentLoaded", function () {
    const jwtToken = localStorage.getItem("jwt_token");
    const currentPath = window.location.pathname;

    const logoutLink = document.getElementById("logoutLink");
    const loginLink = document.getElementById("loginLink");

    if (jwtToken) { //if user is logged in
        logoutLink.style.display = "block";
        if (currentPath === "/login.html") {
            window.location = "/"
        } else if (currentPath === "/registration.html") {
            window.location = "/"
        }
    } else { //if user is not logged in
        if (currentPath === "/") {
            window.location = "login.html"
        }
        loginLink.style.display = "block";

    }
});

// show error or succss alert
const showAlert = (alert_type, message) => {

    const alertDiv = document.getElementById('alertDiv');

    if (alert_type === "error") {
        alertDiv.innerHTML = ` <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>Error!</strong>${message}.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`
    } else {

    }
}

// logout user
const logout = () => {
    localStorage.removeItem("jwt_token")
    window.location = "login.html"
}




// handle login
document.getElementById('loginForm')?.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission
    const submit_btn = document.getElementById("submit_btn")
    submit_btn.disabled = true
    // Get the form data
    const formData = new FormData(event.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
    };


    axios.post('/api/user/login', loginData)
        .then(response => {
            localStorage.setItem("jwt_token", response.data.data.token)
            window.location = "/"
        })
        .catch(error => {
            showAlert("error", error.response.data.message)
            submit_btn.disabled = false
        });
});





const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


