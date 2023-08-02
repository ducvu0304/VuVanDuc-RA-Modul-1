const productData = JSON.parse(localStorage.getItem("ProductData")) || []
const userData = JSON.parse(localStorage.getItem("UserData")) || [];
const fullName = JSON.parse(localStorage.getItem("fullname")) || ""; 
const CHECK = JSON.parse(localStorage.getItem("check")) ||  JSON.parse(sessionStorage.getItem("check"))|| "";
const loginForm = document.getElementById('loginForm');

/* Login*/
// Show-Hide Login-Form
function showLoginform (event){ 
    event.preventDefault()
    loginForm.classList.add("show");
    document.querySelector('body').style.overflow = "hidden";
    window.location.href = "#loginForm";
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

// Login-Event
function login (event) {
    event.preventDefault();
    var email = document.getElementById('loginEmail');
    var password = document.getElementById('loginPassword');
    // var username = document.getElementById('username');
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
            }else if (userData[i].author == "Admin") {
                localStorage.setItem("check", JSON.stringify(userData[i].id));
                const NEWCHECK = JSON.parse(localStorage.getItem("check")); 
                closeLoginForm();
                window.location.href = "./assets/torus/dasboard.html";
            }else if (checkRemember.checked) {
                console.log("@2222222");
                localStorage.setItem("check", JSON.stringify(userData[i].id));
                const NEWCHECK = JSON.parse(localStorage.getItem("check")); 
                console.log(NEWCHECK);
                closeLoginForm();
                loginStatus(NEWCHECK);
                showNackbar("Login successfully!")
            }else{
                sessionStorage.setItem("check", JSON.stringify(userData[i].id));
                const NEWCHECK = JSON.parse(sessionStorage.getItem("check"));
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

function renderBox(CHECK) {
    let carts = getUserCart(CHECK);
    let cartBox = '';    
    let cartQuantity = document.querySelector(".cart-quantity");
 
    if (carts.length > 0 ) {
        for(let i = 0; i < carts.length; i++) {
            cartBox += 
            `<div class="cart-box__list">
                <img src="./assets/${carts[i].img}" alt="">
                <span class="cart-box__content">
                    <span class="sub-title cart-box__item-catlog">${carts[i].catalog}</span><br>
                    <span class="sub-title cart-box__item-name">${carts[i].name}</span>
                </span>
                <span class="sub-title cart-box__item-price">${changeVND(carts[i].price)}đ</span>
            </div>
            <hr class="separate">`
        }
    }else {
        cartBox += 
        ` <img class="cart-box__img" src="./assets/image/general/cart_empty.png" alt="cart_empty.png">
        <p class="sub-title cart-box__text">Your Shopping Cart is Empty</p>`
    }

    cartQuantity.innerHTML = carts.length
    document.querySelector(".cart-box").innerHTML = cartBox;
}
/* End Render-Box !! */

/* Top-Banner */
let bannerList = ['./assets/image/banner/OIP.jpg', './assets/image/banner/OIP-1.jpg', './assets/image/banner-03.jpg'];
let topBanner = document.getElementById("topBanner");
let count = 0

function slide() {
    count++;
    if (count == bannerList.length) {
        count = -1;
    }else {
        topBanner.setAttribute("src", bannerList[count])
    }
}

setInterval("slide()", 2000);

function viewCart() {
    window.location.href = "./assets/torus/cart.html"
}

/* End promo-product-block!! */

function changeVND(money) {
    let changeMoney = money.split('');
    let length = changeMoney.length;

    for(let i = length-3; i > 0; i-=3) {
        changeMoney.splice(i,0,".")    
    }

    return changeMoney.join('');
}


/* Render Promot-Product */
function getRenderData() {
    var data = [];

    for(let i = 0; i < productData.length; i++) {
        if(productData[i].rating >= 4.5) {
            if(productData[i].other.toUpperCase().match("NEW ARRIVALS")) {
                data.push(productData[i]);
            }
        }
    }

    data.sort((a,b) => {
        return a.rating < b.rating ? 1 : -1;
    })

    return data;
}

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
    }

    return element;
}

/* promo-product-block */
let startIndex = 0;
let endIndex = startIndex + 3;

function plusSlides(value) {
    if (value == -1) {
        if(startIndex == 0) {
            startIndex = 0;
            endIndex = startIndex + 3
        }else {
            startIndex -= 3;
            endIndex = startIndex + 3
        }
    }else if (value == 1) {
        if (endIndex == 12) {
            startIndex = 0 
            endIndex = startIndex + 3
        }else {
            startIndex += 3;
            endIndex = startIndex + 3
        }
    } 
    renderPromoProduct();
}

function renderPromoProduct() {
    var data = getRenderData();
    var renderData = "";
    
    for(let i = startIndex ; i < endIndex; i++) {
        renderData += 
        `<div class="promo-product">
            <ul class="product-info">
                <li class="product-title">
                    <span class="title">New<i>Arrivals</i></span>
                </li>
                <li class="product-img">
                    <img src="./assets/${data[i].img}" alt="">
                </li>
                <li class="sub-title product-name">${data[i].catalog} <br>${data[i].name}</li>
                <li class="sub-title product-vote">
                    <div class="rating">
                       ${ratingStar(data[i].rating)}
                    </div>
                </li>
                <li class="sub-title product-gender">${data[i].gender.toUpperCase()} </li>
                <li class="sub-title"><button class="btn btn-buy" onclick="buyNow(${data[i].id})">Buy Now</button></li>
            </ul>   
        </div>`
    }

    renderData += 
    `<span class="prev" onclick="setTimeout(plusSlides(-1), 500)">&#10094;</span>
    <span class="next" onclick="setTimeout(plusSlides(1), 500)">&#10095;</span>`
    
    document.querySelector(".promo-product-wrapper").innerHTML = renderData;
}
renderPromoProduct();
/* End promo-product-block!! */

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
                    <img src="./assets/${hintSearchData[j].img}" alt="">
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
    var hintSearchData = search();

    for(let i in hintSearchData) {
        if(i == value) {
            localStorage.setItem("productID", JSON.stringify(hintSearchData[i].id))
        }
    }

    window.location.href= "./assets/torus/detail.html"
}

// Buy-Now
function buyNow(id) {
    localStorage.setItem("productID", JSON.stringify(id));
    window.location.href="./assets/torus/detail.html";
}

/* End Search-Function !! */

