let userData = JSON.parse(localStorage.getItem("UserData")) || [];
let fullName = JSON.parse(localStorage.getItem("fullname")) || ""; 
let loginForm = document.getElementById('loginForm');
let checkUser = JSON.parse(localStorage.getItem("check")) || "";

/* Login-Form */
// Show-Hide Login-Form
function showLoginform (event){
    event.preventDefault()
    loginForm.classList.add("show");
    document.querySelector('body').style.overflow = "hidden";
}

document.addEventListener('keydown', function (e) {
    if (e.key === "Escape") {
        loginForm.classList.remove("show");
    }
    document.querySelector('body').style.overflow = "scroll"
});

// Login Status 
function loginStatus () {
    for(let user of userData) {
        if(user.id === checkUser) {
            username.innerHTML = user.fullName;
            document.getElementById("login").removeAttribute("onclick");
            document.querySelector(".logout").style.display = "block";
            loginForm.classList.remove('show');   
        }else {
            username.innerHTML = "";
            document.querySelector(".logout").style.display = "none";
            document.getElementById("login").setAttribute("onclick", "showLoginform(event)")
        }
    }
}

loginStatus();

// Login-Event
function login (event) {
    event.preventDefault();
    var email = document.getElementById('loginEmail');
    var password = document.getElementById('loginPassword');
    var username = document.getElementById('username');
    var checkRemember = document.getElementById('checked');
    var emailValid = document.getElementById('emailMessage');
    var passwordValid = document.getElementById('passwordMessage');
    
    if (email.value == "") {
        emailValid.innerHTML =  
        `<span class="valid-marker"><i class="fa-solid fa-exclamation"></i></span> 
        Please enter your email`;
    }else {
        for (let user of userData) {
            if (user.email.toUpperCase() != email.value.toUpperCase()) {
                emailValid.innerHTML =  
                `<span class="valid-marker"><i class="fa-solid fa-exclamation"></i></span> 
                The email was incorrect`;
            }else if (user.password !== password.value) {
                emailValid.innerHTML = ``;
                passwordValid.innerHTML = 
                `<span class="valid-marker"><i class="fa-solid fa-exclamation"></i></span> 
                The password was incorrect`;
            }else if (checkRemember.checked) {
                alert("login success!!");
                localStorage.setItem("check", JSON.stringify(user.id));
                loginStatus();
                window.location.reload();
            }else{
                sessionStorage.setItem("user", JSON.stringify(user));
                sessionStorage.setItem("fullname", JSON.stringify(user.fullName));
                let fullname = JSON.parse(sessionStorage.getItem("fullname"));
                document.getElementById("login").removeAttribute("onclick")
                document.querySelector(".logout").style.display = "block"
                loginForm.classList.remove('show');
                username.innerHTML = fullname;
            }
        }
    }

    if (password.value == "") {
        passwordValid.innerHTML =
        `<span class="valid-marker"><i class="fa-solid fa-exclamation"></i></span> 
        Please enter your password`;
    }
}

// Logout
function logout () {
    document.querySelector(".logout").style.display = "none";
    document.getElementById('username').innerHTML = "";
    document.getElementById("login").setAttribute("onclick", "showLoginform(event)")
    localStorage.removeItem("check")
    // window.location.reload();
}