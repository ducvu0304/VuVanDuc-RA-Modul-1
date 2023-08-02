/* Global-Value */
let searchValue = JSON.parse(localStorage.getItem('searchValue')) || '';
const loginForm = document.getElementById('loginForm');
const userData = JSON.parse(localStorage.getItem("UserData")) || [];
const productData = JSON.parse(localStorage.getItem("ProductData")) || [];
let renderData = JSON.parse(localStorage.getItem("renderData")) || [];
const fullName = JSON.parse(localStorage.getItem("fullname")) || ""; 
const CHECK = JSON.parse(localStorage.getItem("check")) ||  JSON.parse(sessionStorage.getItem("check"))|| "";
const productId = JSON.parse(localStorage.getItem("productID")) || "";
const countQuantity = document.querySelector("countQuantity");
const pagination =  JSON.parse(localStorage.getItem("pagination")) || {};
let count = 1;

//  Filter-Value
const sliderContainer = document.querySelector('.slider-container');
const sliderTrack = document.querySelector('.slider-track');
const sliderThumbMin = document.querySelector('.slider-thumb--min');
const sliderThumbMax = document.querySelector('.slider-thumb--max');
const sliderValueMin = document.querySelector('.value--min');
const sliderValueMax = document.querySelector('.value--max');
const currencyUnit = 3100000/(sliderContainer.offsetWidth - (sliderThumbMin.offsetWidth + sliderThumbMax.offsetWidth));
const filterPirce = JSON.parse(localStorage.getItem('filterPirce'));
const filter = JSON.parse(localStorage.getItem("filterValue"));

sliderThumbMin.style.left = filterPirce.minThumbX + 'px';
sliderThumbMax.style.left = filterPirce.maxThumbX + 'px';
sliderTrack.style.left = filterPirce.minThumbX +  'px';
sliderTrack.style.width = sliderThumbMax.offsetLeft  - filterPirce.minThumbX +  sliderThumbMax.offsetWidth + 'px';
sliderValueMin.value = filterPirce.minValue;
sliderValueMax.value = filterPirce.maxValue;

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

// Logout-Event
function logout () {
    console.log();
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

function getProductList(gender) {
    var list = [];
    
    for (let i = 0; i < productData.length; i++) {
        if (productData[i].gender == gender) {
            list.push(productData[i])
        }
    }

    return list;
}

// Get Render-Data 
function getRenderData() {
    let arr = []

    for (let i in productData) {
        if(productData[i].other == "SALE") {
            arr.push(productData[i])
        }
    }
   
    let filterDataPrice = filterDataByPrice(arr, sliderValueMin.value, sliderValueMax.value);
    // let filterDataCategory = filterByCategory(filterDataPrice,  filter.checkNewArrival, filter.checkSaleProduct)
    
    renderData = filterDataPrice;

    pagination.totalPage = Math.ceil(renderData.length/9);
    
    localStorage.setItem('pagination', JSON.stringify(pagination));
    localStorage.setItem('renderData',  JSON.stringify(renderData));

    return renderData;
}
getRenderData();

function getProductTag(id) {
    let element = '';

    for (let i in renderData) {
        if(renderData[i].id == id) {
            if(renderData[i].other.match("SALE")) {
                element = `<li class="product-tag"><span>SALE ${renderData[i].discount}% OFF</span></li>`
            }else {
                element = `<li class="product-tag"><span>NEW ARRIVAL</span></li>`
            }
        }
    }

    return element;
}


// Render Product
function render(renderData, page) {
    console.log(renderData);
    let length = 9;
    let end = page*length || length;
    let i = end - length || 0;
    let produts = document.getElementById("products");
    let product = '';
    let totalPage = pagination.totalPage
    let pagesData = `<span class="previous-page" onclick="previousPage()"><i class="fa-solid fa-angles-left"></i></span>`;

    for (i; i < end; i++) {
        if (renderData[i] != undefined) {
            product += 
            ` <div onclick="getProduct(${renderData[i].id})">
                <div class="bucket">
                    <ul class="product">
                        ${getProductTag(renderData[i].id)}
                        <li class="product-image"><img class="image" src="../${renderData[i].img}" alt="${renderData[i].name}.img"></li>
                        <li class="product-catlog"><h3 class="title">${renderData[i].catalog}</h3></li>
                        <li class="product-name"><h3 class="title">${renderData[i].name}</h3></li>
                        <li class="product-price">${changeVND(renderData[i].price.toString())} ₫</li>
                    </ul>
                </div>                    
            </div>`     
        }else{
            continue;
        }
    }

    for (let j = 0; j < totalPage; j++){
        if(j+1 == page) {
            pagesData += `<span class="page active" onclick="pageNow(${j+1})">${j+1}</span>`
        }else {
            pagesData += `<span class="page" onclick="pageNow(${j+1})">${j+1}</span>`
        }
    }
    pagesData += `<span class="next-page" onclick="nextPage()"><i class="fa-solid fa-angles-right"></i></span>`
    document.querySelector(".pagination").innerHTML = pagesData;
    produts.innerHTML = product;
}
render(renderData, pagination.currentPage);

// Pagination
function pageNow (page) {
    pagination.currentPage = page;
    localStorage.setItem('pagination', JSON.stringify(pagination));
    render(renderData, pagination.currentPage);
}

function nextPage () {
    if(pagination.currentPage < pagination.totalPage) {
        pagination.currentPage += 1;
        localStorage.setItem('pagination', JSON.stringify(pagination));
        render(renderData, pagination.currentPage);
    }else {
        render(renderData, pagination.currentPage);
    }
    location.href = "#top";
}

function previousPage () {
    if(pagination.currentPage == 1) {
        render(renderData, pagination.currentPage);
    }else {
        pagination.currentPage -= 1;
        localStorage.setItem('pagination', JSON.stringify(pagination));
        render(renderData, pagination.currentPage);
    }
    location.href = "#top";
}

// Detail Product
function getProduct(id) {
    for(let product of productData) {
        if(product.id == id) {
            localStorage.setItem("productID", JSON.stringify(product.id))
        }
    }
    window.location.href = "./detail.html"
}

/* Filter-Function */
/* Filter By Category */
function getValueOfCategory() {
    filter.checkNewArrival = document.getElementById("new").checked;
    filter.checkSaleProduct  = document.getElementById("sale").checked;
    localStorage.setItem("filterValue", JSON.stringify(filter))
    getRenderData();
    render(renderData, pagination.currentPage);
}

function filterByCategory(arr, isNewArrival, isSaleProduct) {
    let filterDataCategory = []
    
    if (isNewArrival && isSaleProduct) {
        filterDataCategory = arr;
    }else if (isNewArrival) {
        filterDataCategory = arr.filter((product) => {
            return product.other == "NEW ARRIVALS";
        })
    }else if (isSaleProduct) {
        filterDataCategory = arr.filter((product) => {
            return product.other == "SALE";
        })
    }else {
        filterDataCategory = arr; 
    }

    return filterDataCategory;
}

// Filter Data By Gender
function filterDataByGender() {   
    filter.checkMen = document.getElementById("men").checked;
    filter.checkWomen = document.getElementById("women").checked;

    localStorage.setItem("filterValue", JSON.stringify(filter))

    if(filter.checkMen && filter.checkWomen) {
        window.location.href = "./sports.html"
    }else if (filter.checkWomen) {
        window.location.href = "./women.html"
    }else {
        window.location.href = "./men.html"
    }
}

document.getElementById("new").checked = filter.checkNewArrival;
document.getElementById("sale").checked = filter.checkSaleProduct;
document.getElementById("men").checked = filter.checkMen ;
document.getElementById("women").checked = filter.checkWomen;

/* Filter Data By Price */
sliderThumbMin.addEventListener('mousedown', function(event) {
    const startX = event.clientX;
    const thumbX = sliderThumbMin.offsetLeft;
    const maxThumbX = sliderThumbMax.offsetLeft - sliderThumbMax.offsetWidth;

    document.addEventListener('mousemove', moveThumb);
    document.addEventListener('mouseup', removeHandler);
    document.addEventListener('mouseup', filter);

    function moveThumb(event) {
        const sliderValueMin = document.querySelector('.value--min');   
        let newThumbX = thumbX + event.clientX - startX;
        newThumbX = Math.max(newThumbX, 0);
        newThumbX = Math.min(newThumbX, maxThumbX);
 
        sliderThumbMin.style.left = newThumbX + "px";
        sliderTrack.style.left = newThumbX + "px";
        sliderTrack.style.width = sliderThumbMax.offsetLeft + sliderThumbMax.offsetWidth - newThumbX + 'px';
        sliderValueMin.value =  Math.ceil(1900000 + currencyUnit*newThumbX);

        filterPirce.minThumbX = newThumbX;
        filterPirce.minValue = sliderValueMin.value;
        localStorage.setItem('filterPirce' , JSON.stringify(filterPirce));
    }

    function filter() {
        location.reload();
    }

    function removeHandler() {
        document.removeEventListener('mousemove', moveThumb);
        document.removeEventListener('moveup', removeHandler)
        document.removeEventListener('moveup', filter)
    }
});

sliderThumbMax.addEventListener('mousedown', function(event) {
    const startX = event.clientX;
    const thumbX= sliderThumbMax.offsetLeft;
    const maxThumbX = sliderContainer.offsetWidth - sliderThumbMax.offsetWidth;
    const minThumbX = sliderThumbMin.offsetLeft + sliderThumbMin.offsetWidth;

    document.addEventListener('mousemove', moveThumb);
    document.addEventListener('mouseup', removeHandler)
    document.addEventListener('mouseup', filter)

    function moveThumb(event) {
        const sliderValueMax = document.querySelector('.value--max');
        let value = 0;

        let newThumbX = thumbX + event.clientX - startX;
        newThumbX = Math.max(minThumbX, newThumbX);
        newThumbX = Math.min(maxThumbX, newThumbX);

        sliderThumbMax.style.left = newThumbX + 'px';
        sliderTrack.style.offsetLeft = sliderThumbMin.offsetLeft + 'px'
        sliderTrack.style.width = newThumbX - sliderThumbMin.offsetLeft + sliderThumbMax.offsetWidth + 'px';
        
        if ((sliderThumbMax.offsetWidth + sliderThumbMax.offsetLeft) == sliderContainer.offsetWidth) {
            sliderValueMax.value = 5500000
        }else {
            sliderValueMax.value = Math.ceil(currencyUnit*Number(sliderThumbMax.offsetLeft) + 1900000);
        }

        filterPirce.maxValue = sliderValueMax.value;
        filterPirce.maxThumbX = newThumbX;
        localStorage.setItem('filterPirce' , JSON.stringify(filterPirce));
    }

    function filter() {
        location.reload();
    }

    function removeHandler() {
        document.removeEventListener('mousemove', moveThumb);
        document.removeEventListener('moveup', removeHandler)
        document.removeEventListener('moveup', filter)
    }
})

function filterDataByPrice(arr, min, max) {
    const  filterDataPrice = []
    
    for (let i in arr) {
        if(Number(arr[i].price) >= Number(min) && Number(arr[i].price) <= Number(max))  {
            filterDataPrice.push(arr[i])
        }
    }

    return filterDataPrice;
}

function resetFilterData() {
    filter.checkMen = false;
    filter.checkWomen = false;
    filter.checkNewArrival = false;
    filter.checkSaleProduct = false;
    filterPirce.minThumbX = 0;
    filterPirce.maxThumbX = sliderContainer.offsetWidth;
    filterPirce.minValue = 1900000;
    filterPirce.maxValue = 5500000;
    localStorage.setItem("filterValue", JSON.stringify(filter));
    localStorage.setItem('filterPirce' , JSON.stringify(filterPirce));
}

document.querySelector('.navigation-home').addEventListener('click', resetFilterData);
document.querySelector('.navigation-men').addEventListener('click', resetFilterData);
document.querySelector('.navigation-women').addEventListener('click', resetFilterData);
document.querySelector('.navigation-sports').addEventListener('click', resetFilterData);
document.querySelector('.navigation-sale').addEventListener('click', resetFilterData);
/* End Filter */

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
    var hintSearchData = search();

    var searchValue = ''

    for(let i in hintSearchData) {
        if(i == value) {
            searchValue = hintSearchData[i].id;
            localStorage.setItem("searchValue", JSON.stringify(searchValue))
        }
    }

    window.location.href= "../torus/detail.html"
}
/* End Search-Function */
