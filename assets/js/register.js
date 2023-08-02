const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName')
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const EMAILREGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CHECK = JSON.parse(localStorage.getItem("check")) ||  JSON.parse(sessionStorage.getItem("check"))|| "";
const userData = JSON.parse(localStorage.getItem("UserData")) || [];
const productData = JSON.parse(localStorage.getItem("ProductData")) || [];
// localStorage.removeItem("UserData");

/* Login-Form */
// Show-Hide Login-Form
function showLoginform (event){ 
    event.preventDefault()
    loginForm.classList.add("show");
    document.querySelector('body').style.overflow = "hidden";
}

function closeLoginForm(){
    loginForm.classList.remove("show");
    document.querySelector('body').style.overflow = "scroll"
}

document.addEventListener('keydown', function (e) {
    if (e.key === "Escape") {
        closeLoginForm ();
    }
});

//  Show-Nackbar
function showNackbar(message) {
    const x = document.getElementById("snackbar");
    x.innerHTML = message;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}


// Login-Event
function login (event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');
    const username = document.getElementById('username');
    const checkRemember = document.getElementById('checked');
    const emailValid = document.getElementById('emailMessage');
    const passwordValid = document.getElementById('passwordMessage');
    

    if (email.value !== "") {
        for (let i in userData) {
            if (userData[i].email.toUpperCase() != email.value.toUpperCase()) {
                emailValid.innerHTML =  
                `<span class="valid-marker"><i class="fa-solid fa-exclamation"></i></span> 
                The email was incorrect or the account has not been created yet`;
            }else if (userData[i].password !== password.value) {
                emailValid.innerHTML = ``;
                passwordValid.innerHTML = 
                `<span class="valid-marker"><i class="fa-solid fa-exclamation"></i></span> 
                The password was incorrect`;
            }else if (checkRemember.checked) {
                localStorage.setItem("check", JSON.stringify(userData[i].id));
                const NEWCHECK = JSON.parse(localStorage.getItem("check")); 
                loginStatus(NEWCHECK);
                closeLoginForm();
                showNackbar("Login successfully!")
            }else{
                sessionStorage.setItem("check", JSON.stringify(userData[i].id));
                const NEWCHECK = JSON.parse(sessionStorage.getItem("check"));
                console.log(NEWCHECK);
                loginStatus(NEWCHECK);
                closeLoginForm();
                showNackbar("Login successfully!")
            }
        }
    }else {
        emailValid.innerHTML =  
        `<span class="valid-marker"><i class="fa-solid fa-exclamation"></i></span> 
        Please enter your email`;
    }

    if (password.value == "") {
        passwordValid.innerHTML =
        `<span class="valid-marker"><i class="fa-solid fa-exclamation"></i></span> 
        Please enter your password`;
    }
}

// Logout-Event
function logout () {
    document.querySelector(".logout").style.display = "none";
    document.getElementById('username').innerHTML = "";
    document.getElementById("login").setAttribute("onclick", "showLoginform(event)")
    localStorage.removeItem("check") || sessionStorage.removeItem("check");
    const NEWCHECK = JSON.parse(localStorage.getItem("check")) ||  JSON.parse(sessionStorage.getItem("check"))|| "";
    loginStatus(NEWCHECK);
}


// Login Status 
function loginStatus(CHECK) {
    for(let user of userData) {
        if(user.id === CHECK) {
            username.innerHTML = user.fullName;
            document.getElementById("login").removeAttribute("onclick");
            document.querySelector(".logout").style.display = "block";
            loginForm.classList.remove('show');
            renderBox(CHECK)   
        }else {
            username.innerHTML = "";
            document.querySelector(".logout").style.display = "none";
            document.getElementById("login").setAttribute("onclick", "showLoginform(event)");
            renderBox(CHECK)
        }
    }
}
loginStatus(CHECK);

// User
function uuid() {
    let uuid = Math.floor(Math.random()*999999999) + (new Date()).getMilliseconds();
    return uuid;
}

class Account {
    constructor(firstName, lastName, email, password) {
        this.id = uuid();
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = this.firstName + this.lastName;
        this.email = email;
        this.password = password;
        this.createDate = createDate();
        this.author = "Customer"
        this.cart = [];
    }
}

function createDate() {
    const d = new Date();

    let date = `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`;

    return date;
}

// Reset Form
function resetForm() {
    firstName.value = '';
    lastName.value = '';
    email.value = '';
    password.value = '';
    confirmPassword.value = ''; 
}

// Sumit Handler
function createAccount (event) {
    event.preventDefault();
    var firstNamelValid = document.getElementById('firtNameValid');
    var lastNameValid = document.getElementById('lastNameValid')
    var emailValid = document.getElementById('emailValid');
    var passwordValid = document.getElementById('passwordValid');
    var confirmPasswordValid = document.getElementById('confirmPasswordValid')
    var checkPassword = password.value;

    // Validate FirstName
    if (firstName.value == "") {
        firstNamelValid.innerHTML = 
        `<span class="valid-marker"><i class="fa-solid fa-exclamation"></i></span> 
        Please enter a first name.`
    }else {
        firstNamelValid.innerHTML = ''
    }

    // Validate LastName
    if (lastName.value == "") {
        lastNameValid.innerHTML = 
        `<span class="valid-marker"><i class="fa-solid fa-exclamation"></i></span> 
        Please enter a last name.`
    }else {
        lastNameValid.innerHTML = '';
    }

    // Validate Email
    if (email.value == "" || !EMAILREGEX.test(email.value)) {
        email.value = "";
        emailValid.innerHTML = 
        `<span class="valid-marker"><i class="fa-solid fa-exclamation"></i></span> 
        The email field cannot be blank.`
    }else {
        for (let account of userData) {
            if (account.email.toUpperCase() == email.value.toUpperCase()) {
                email.value = '';
                emailValid.innerHTML =  
                `<span class="valid-marker"><i class="fa-solid fa-exclamation"></i></span> 
                The email was registered`;
            }else {
                emailValid.innerHTML = '';
            }
        }
    }
    
        // Validate Password
        if(checkPassword.length < 6) {
            passwordValid.innerHTML = 
            `<span class="valid-marker"><i class="fa-solid fa-exclamation"></i></span>
            The password at least 6 character.`
        }else if (confirmPassword.value == '') {
            passwordValid.innerHTML = '';
            confirmPasswordValid.innerHTML = 
            `<span class="valid-marker"><i class="fa-solid fa-exclamation"></i></span>
            The password field cannot be empty.`
        }else if (confirmPassword.value != password.value) {
            passwordValid.innerHTML = '';
            password.value = '';
            confirmPassword.value = '';
            confirmPasswordValid.innerHTML = 
            `<span class="valid-marker"><i class="fa-solid fa-exclamation"></i></span>
            The confirm password is  incorrect!`
        }else {
            passwordValid.innerHTML = '';
            confirmPasswordValid.innerHTML = ''
        }

    // Create Account
    let isCheck = firstName.value != '' && lastName.value != '' 
                  && email.value != '' && password.value != ''
                  &&  confirmPassword.value != ''

    if (isCheck) {
        const account = new Account(firstName.value, lastName.value, email.value, password.value);
        resetForm();
        userData.push(account);
        localStorage.setItem("UserData", JSON.stringify(userData));
        localStorage.setItem("check", JSON.stringify(account.id))
        window.location.href = "../../index.html"
    }
}

function viewCart() {
    window.location.href = "./cart.html"
}

// Render Box 
function renderBox(CHECK) {
    let userCart = [];
    let cartBox = '';    
    let cartQuantity = document.querySelector(".cart-quantity");
    let subTotal = 0;

    for (let i in userData) {
        if (userData[i].id == CHECK) {
            userCart = [... userData[i].cart]
        }
    }

    if (userCart.length > 0 ) {
        for(let i in userCart) {
            let total = `${userCart[i].price*userCart[i].quantity}`;
            subTotal += Number(total)

            cartBox += 
            `<div class="cart-box__list">
                <img src=../${userCart[i].img} alt="">
                <span class="cart-box__content">
                    <span class="sub-title cart-box__item-catlog">${userCart[i].catalog}</span><br>
                    <span class="sub-title cart-box__item-name">${userCart[i].name}</span>
                </span>
                <span class="sub-title cart-box__item-price">${changeVND(userCart[i].price)}đ</span>
            </div>
            <hr class="separate">`
        }
    }else {
        cartBox += 
        ` <img class="cart-box__img" src="../image/general/cart_empty.png" alt="cart_empty.png">
        <p class="sub-title cart-box__text">Your Shopping Cart is Empty</p>`
    }

    cartQuantity.innerHTML = userCart.length
    document.querySelector(".cart-box").innerHTML = cartBox;
}
renderBox(CHECK);

/* Search-Function*/
function search() {
    let searchValue = document.getElementById('searchValue').value
    let keyWord = searchValue.toUpperCase();
    let element = '';
    let hintSearchData = [];

    for(let i in productData) {
        // console.log(productData[i].gender);
        if (productData[i].gender.toUpperCase() == keyWord) {
            hintSearchData.push(productData[i])
       }else if (productData[i].catalog.toUpperCase().match(keyWord)) {
           hintSearchData.push(productData[i])
       }else if (productData[i].name.toUpperCase().match(keyWord)) {
            hintSearchData.push(productData[i])
       }
    }

    if (hintSearchData != []) {
        for(let j = 0; j < 3 ; j++) {
            if (hintSearchData[j] != undefined) {
                console.log(hintSearchData[j].img);  
                element += 
                `<div class="hints__search-wrapper" >
                    <img src="../${hintSearchData[j].img}" alt="">
                    <span class="hints__search-content" onclick="findProduct(${j})">
                        ${hintSearchData[j].catalog}<br>
                        ${hintSearchData[j].name}
                    </span>
                </div>`
            }
        }
        document.querySelector('.hints__search').innerHTML = element;
    }

    if(keyWord == '') {
        document.querySelector('.hints__search').innerHTML = ''
    }

    return hintSearchData;
}

function findProduct(value) {
    let hintSearchData = search();

    let searchValue = ''

    for(let i in hintSearchData) {
        if(i == value) {
            searchValue = hintSearchData[i].id;
            localStorage.setItem("searchValue", JSON.stringify(searchValue))
        }
    }

    window.location.href= "../torus/detail.html"
}
/* End Search-Function */