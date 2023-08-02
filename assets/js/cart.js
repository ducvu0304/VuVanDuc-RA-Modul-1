let loginForm = document.getElementById('loginForm');
let userData = JSON.parse(localStorage.getItem("UserData")) || [];
let fullName = JSON.parse(localStorage.getItem("fullname")) || ""; 
const CHECK = JSON.parse(localStorage.getItem("check")) ||  JSON.parse(sessionStorage.getItem("check"))|| "";
let productId = JSON.parse(localStorage.getItem("productID")) || "";
const productData = JSON.parse(localStorage.getItem("ProductData")) || [];
let countQuantity = document.querySelector("countQuantity");
let count = 1;

/* Login*/
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
    var x = document.getElementById("snackbar");
    x.innerHTML = message;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

let flag = false;

function confirmInformation(id) {
    let x = document.getElementById("confirmMessage");
    let body = document.querySelector('body');
    x.classList.toggle("show") ; 
    body.classList.toggle("sroll");
    document.querySelector('.btn--yes').setAttribute("onclick", `remove(${id})`);
    document.querySelector('.btn--no').setAttribute("onclick", `confirmInformation()`)
  

}

// Login-Event
function login (event) {
    event.preventDefault();
    var email = document.getElementById('loginEmail');
    var password = document.getElementById('loginPassword');
    var username = document.getElementById('username');
    var checkRemember = document.getElementById('checked');
    var emailValid = document.getElementById('emailMessage');
    var passwordValid = document.getElementById('passwordMessage');
    

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

// Logout
function logout() {
    document.querySelector(".logout").style.display = "none";
    document.getElementById('username').innerHTML = "";
    document.getElementById("login").setAttribute("onclick", "showLoginform(event)")
    localStorage.removeItem('check') | sessionStorage.removeItem('check')
    const NEWCHECK =JSON.parse(localStorage.getItem("check")) || JSON.parse(sessionStorage.getItem("check")) || ""; 
    loginStatus(NEWCHECK);
}

//  Show-Nackbar
function showNackbar(message) {
    var x = document.getElementById("snackbar");
    x.innerHTML = message;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

// Login Status 
function loginStatus(CHECK) {
    for(let i in userData) {
        if(userData[i].id === CHECK) {
            username.innerHTML = userData[i].fullName;
            document.getElementById("login").removeAttribute("onclick");
            document.querySelector(".logout").style.display = "block";
            loginForm.classList.remove('show');   
            render(CHECK);
        }else {
            username.innerHTML = "";
            document.querySelector(".logout").style.display = "none";
            document.getElementById("login").setAttribute("onclick", "showLoginform(event)")
            render(CHECK);
        }
    }
}
loginStatus(CHECK);

/* Render Box  */
// Get  User-Carts 
function getUserCart(CHECK) {
    let carts = [] 
    for(let i in userData) {
        if(userData[i].id == CHECK) {
            carts  = userData[i].cart;
        }
    }
    return carts;
}

// Change VND
function changeVND(money) {
    let changeMoney = money.split('');
    let length = changeMoney.length;

    for(let i = length-3; i > 0; i-=3) {
        changeMoney.splice(i,0,".")    
    }

    return changeMoney.join('');
}
/* End Render-Box !! */

// Render Cart-Box 
function render(CHECK) {
    let userCart = getUserCart(CHECK);
    let cartBox = '';
    let tableData = '';
    let subTotal = 0;
    let cartQuantity = document.querySelector(".cart-quantity");

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

            tableData +=
            `<tr>
                <td >
                    <img class="product-image" src="../${userCart[i].img}" alt="product-img">
                </td>
                <td class="product-info">
                    <label class="product-info">
                        <span class="product-catlog">${userCart[i].name}</span><br>
                        <span class="product-color">COLORS: BLACK/HAZARD GREEN</span><br>
                        <span class="product-width">WIDTH: STANDARD</span><br>
                        <span class="product-size">SIZE(US): ${userCart[i].size}</span><br>
                        <span class="edit-dettail"><a href="">Edit Details</a></span>
                    </label>
                </td>
                <td class="product-price">${changeVND(userCart[i].price)}đ</td>
                <td>
                    <div class="product-quantity">
                        <span class="minus" onclick="quantity(${i},-1)">-</span>
                        <span class="product-quantity__number number">${userCart[i].quantity}</span>
                        <span class="plus" onclick="quantity(${i}, 1)">+</span>
                    </div>   
                </td>
                <td class="total">
                    ${changeVND(total)}đ
                </td>
                <td class="action">
                    <span class="remove"  onclick="confirmInformation(${userCart[i].id})"><i class="fa-solid fa-xmark"></i></span>    
                </td>
            </tr>`
        }
    }else {
        cartBox += 
        ` <img class="cart-box__img" src="../image/general/cart_empty.png" alt="cart_empty.png">
        <p class="sub-title cart-box__text">Your Shopping Cart is Empty</p>`
    }

    document.querySelector(".sub-total").innerHTML = `${changeVND(`${subTotal}`)}đ`
    document.getElementById("tableDetail").innerHTML = tableData;
    document.getElementById('sumary').innerHTML = `${changeVND(`${subTotal}`)}đ`
    cartQuantity.innerHTML = userCart.length
    document.querySelector(".cart-box").innerHTML = cartBox;
}
render(CHECK);

// Quantity
function quantity(id, value) {
    let productQuantity = document.querySelector(".product-quantity__number");
    const NEWCHECK =JSON.parse(localStorage.getItem("check")) || JSON.parse(sessionStorage.getItem("check")) || ""; 
    let carts = getUserCart(NEWCHECK);
    let cart = {}

    for (let i in carts) {
        if(i == id)  {
            cart = carts[i];
        }
    }

    console.log(cart);

    if(value == 1) {
        ++cart.quantity
    }else if(cart.quantity == 1) {
        cart.quantity == 1;

    }else {
        --cart.quantity;
    }

    updateUserData();
    render(NEWCHECK);
}

// Get User 
function getUser(CHECK) {
    let user = {}
    for(let i in userData) {
        if(userData[i].id == CHECK) {
            user  = userData[i];
        }
    }
    return user;
}

// Get  User-Carts 
function getUserCart(CHECK) {
    let carts = [] 
    for(let i in userData) {
        if(userData[i].id == CHECK) {
            carts  = userData[i].cart;
        }
    }
    return carts;
}

// Set Product
function setProduct(id) {
    var  carts = getUserCart();
    var product = {}
    
    for (let i in carts) {
        if (carts[i].id == id) {
            console.log(carts[i]);
        }
    }
}

// Remove-Item 
function remove(id) {
    const NEWCHECK =JSON.parse(localStorage.getItem("check")) || JSON.parse(sessionStorage.getItem("check")) || ""; 
    let carts = getUserCart(NEWCHECK);
    let user = getUser(NEWCHECK);

    for (let i = 0; i < carts.length; i++) {
        if(carts[i].id == id) {
            carts.splice(i,1);
            document.getElementById("confirmMessage").classList.remove("show");
            document.querySelector('body').classList.remove("sroll");
        }
    }
    
    updateUserData();
    render(NEWCHECK);
}

function updateUserData() {
    localStorage.setItem("UserData", JSON.stringify(userData));
}

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
            localStorage.setItem("searchValue", JSON.stringify(searchValue));
        }
    }

    window.location.href= "../torus/detail.html"
}
/* End Search-Function */

// View-cart
function viewCart() {
    window.location.href = "./cart.html"
}

