let searchValue = JSON.parse(localStorage.getItem('searchValue')) || '';
let loginForm = document.getElementById('loginForm');
let userData = JSON.parse(localStorage.getItem("UserData")) || [];
let productData = JSON.parse(localStorage.getItem("ProductData")) || [];
let fullName = JSON.parse(localStorage.getItem("fullname")) || ""; 
const CHECK = JSON.parse(localStorage.getItem("check")) ||  JSON.parse(sessionStorage.getItem("check"))|| "";
let productId = JSON.parse(localStorage.getItem("productID")) || "";
let countQuantity = document.getElementById("countQuantity");
let count = 1;

console.log("productId", productId);
/* Login*/
// Show-Hide Login-Form
function showLoginform (event){ 
    event.preventDefault();
    location.href = "#top"
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
    let x = document.getElementById("snackbar");
    x.innerHTML = message;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

// Login-Event
function login (event) {
    event.preventDefault();
    let email = document.getElementById('loginEmail');
    let password = document.getElementById('loginPassword');
    let username = document.getElementById('username');
    let checkRemember = document.getElementById('checked');
    let emailValid = document.getElementById('emailMessage');
    let passwordValid = document.getElementById('passwordMessage');
    

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
    localStorage.removeItem("check")
    const NEWCHECK =JSON.parse(localStorage.getItem("check")) || ""; 
    loginStatus(NEWCHECK);
}

//  Show-Nackbar
function showNackbar(message) {
    let x = document.getElementById("snackbar");
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
            renderBox(CHECK);
        }else {
            username.innerHTML = "";
            document.querySelector(".logout").style.display = "none";
            document.getElementById("login").setAttribute("onclick", "showLoginform(event)")
            renderBox(CHECK)
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


/* Product-Detail */
// View-cart
function viewCart() {
    window.location.href = "./cart.html"
}

// Quantity
function quantity (value) {
    if(value == 1) {
        count += 1;
        countQuantity.value = count
    }else if(count == 1) {
        countQuantity.value == 1;
    }else {
        count -= 1;
        countQuantity.value = count
    }
}

// Add To Cart
function addToCart() {
    let size = document.getElementById("size").innerHTML;
    let quantity = document.getElementById("countQuantity").value;

    if(CHECK != "") {
       for(let user of  userData) {
            if(user.id == CHECK) {
                let product = {...getProduct(), quantity: "1"};
                product.size = size;
                product.quantity = quantity;
                user.cart.push(product);
                localStorage.setItem("UserData", JSON.stringify(userData))
            }
       }
    }else {
        showLoginform(event);

    }
    renderBox (CHECK);
}

// Set Size 
function setSize (value) {
    let sizes = document.querySelectorAll(".size");
    let size = document.getElementById("size");

    for (let i = 0; i < sizes.length; i++) {
        if (i == value) {
            sizes[i].classList.add("size-active");
            size.innerHTML = sizes[i].innerHTML;
        }else {
            sizes[i].classList.remove("size-active")
        }
    }
}

// Get Product
function getProduct() {
    console.log(productId);
    for(let i in productData) {
        if (productData[i].id == productId) {
            return productData[i];
        }
    } 
}
getProduct()
// Rating-Star
function ratingStar(rating) {
    var element = '';
   
    if (rating >= 4.8) {
        element = 
        `<span class="fa fa-star checked"></span>
        <span class="fa fa-star checked"></span>
        <span class="fa fa-star checked"></span>
        <span class="fa fa-star checked"></span>
        <span class="fa fa-star checked"></span>`
    }else if (rating >= 4.5) {
        element = 
        `<span class="fa fa-star checked"></span>
        <span class="fa fa-star checked"></span>
        <span class="fa fa-star checked"></span>
        <span class="fa fa-star checked"></span>
        <span class="fa-solid fa-star-half-stroke checked"></span>`
    }else if (rating >= 4) {
        element = 
        `<span class="fa fa-star checked"></span>
        <span class="fa fa-star checked"></span>
        <span class="fa fa-star checked"></span>
        <span class="fa fa-star checked"></span>
        <span class="fa fa-star"></span>`
    }else if (rating >= 3.8) {
        element = 
        `<span class="fa fa-star checked"></span>
        <span class="fa fa-star checked"></span>
        <span class="fa fa-star checked"></span>
        <span class="fa-solid fa-star-half-stroke checked"></span>
        <span class="fa fa-star"></span>`
    }

    return element;
}

// Choose-size
function size(value) {
    let element = '';

    if(value.toUpperCase() == "MEN") {
        element = 
        `<span class="size" onclick="setSize(0)">40</span>
        <span class="size" onclick="setSize(1)" >41</span>
        <span class="size size-active" onclick="setSize(2)">42</span>
        <span class="size" onclick="setSize(3)">43</span>`;

        document.getElementById("size").innerHTML = "42"
    }else {
        element = 
        `<span class="size" onclick="setSize(0)">36</span>
        <span class="size" onclick="setSize(1)" >37</span>
        <span class="size size-active" onclick="setSize(2)">38</span>
        <span class="size" onclick="setSize(3)">39</span>`

        document.getElementById("size").innerHTML = "38";
    }

    return element;
}

// Render Product-detail
function renderProduct() {
    let img = document.getElementById("detailImg");
    let catlog = document.querySelector(".product-catlog");
    let name = document.querySelector(".product-name");
    let price = document.querySelector(".product-price");
    let rating = document.querySelector('.rating')
    let sizes = document.querySelector('.choose-size');

 
    for(let i in productData) {
        if(productData[i].id == productId) {
            img.src = `../${productData[i].img}`;
            catlog.innerHTML = productData[i].catalog;
            name.innerHTML = productData[i].name;
            price.innerHTML = `${changeVND(productData[i].price)} đ`;
            rating.innerHTML = ratingStar(productData[i].rating);
            sizes.innerHTML = size(productData[i].gender);
        }
    }

}
renderProduct();
/* End Product-Detail !! */

/* Search-Function*/
function search() {
    let searchValue = document.getElementById('searchValue').value
    let keyWord = searchValue.toUpperCase();
    let element = '';
    let hintSearchData = [];

    for(let i in productData) {
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
    console.log(hintSearchData);
    return hintSearchData;
}

function findProduct(value) {
    var hintSearchData = search();


    for(let i in hintSearchData) {
        if(i == value) {
            localStorage.setItem("productID", JSON.stringify(hintSearchData[i].id))
        }
    }

    window.location.href= "../torus/detail.html"
}
/* End Search-Function */


