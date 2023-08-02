document.getElementById('instockDate').value = createDate();
const productData = JSON.parse(localStorage.getItem("ProductData")) || [];
const catelog = ['Running', 'Tennis', 'Indoor'];
const NAME = document.getElementById('name');
const PRICE = document.getElementById('price');
const DESCRIPTION = document.getElementById('description');
const FEATURE = document.getElementById('feature');
const CATELOG = document.getElementById('catelog');
const GENDER = document.getElementById('gender');
const DATE = document.getElementById('instockDate');
const UNITS = document.getElementById('stock');
const IMAGE =  document.getElementById('productImg');
let currentPage = 1;

// Login Status 
const userData = JSON.parse(localStorage.getItem("UserData")) || [];
const CHECK = JSON.parse(localStorage.getItem("check")) ||  JSON.parse(sessionStorage.getItem("check"))|| "";
function loginStatus(CHECK) {
    for(let i in userData) {
        if(userData[i].id === CHECK) {
            document.getElementById('username').innerHTML = `${userData[i].fullName}`;
        }
    }
}
loginStatus(CHECK);

// Logout
function logout() {
    localStorage.removeItem("check");
    window.location.href = "../../index.html";
}


class Product {
    constructor (catelog, name, price, gender, feature, date, units, description, img) {
        this.id = uuid();
        this.img = img;
        this.name = name;
        this.price = price;
        this.instockDate = date;
        this.catalog = `${gender} + ${catelog} + shoes`.toLocaleUpperCase();
        this.other = feature;
        this.gender = gender;
        this.quantity = units
        this.description = description;
        this.rating = 5;
    }
}

function uuid() {
    let uuid = Math.floor(Math.random()*999999999) + (new Date()).getMilliseconds();
    return uuid;
}

function createDate() {
    const d = new Date();
    const date = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
    return date;
}

function pagination(pages, curPage) {
    let li = '';

    for(let i = 1; i <= pages; i++) {
        if (curPage == i) {
            li += ` <li class="page-item"><a class="page-link bg-primary text-white" onclick="pageNow(${i})">${i}</a></li>`
        }else {
            li += ` <li class="page-item "><a class="page-link text-dark" onclick="pageNow(${i})">${i}</a></li>`
        }
    }
  
    document.querySelector('.pagination').innerHTML = li;
}

function pageNow(page) {
    currentPage = page;
    renderProduct(productData, currentPage);
}

function renderProduct(data, currentPage) {
    let perPage = 10
    let totalPages = Math.ceil(data.length/perPage);
    let end = perPage*currentPage;
    let i = end - perPage;
    let tr = ''; 
    let stt = 1 + i;

    for (i; i < end; i++) {
        if(productData[i] != undefined) {
            // productData[i].instockDate = createDate();
            // productData[i].quantity = Math.ceil(Math.random()*20 + 10);

            tr +=  
            `<tr class="text-center" >
                <td>${stt++}</td>
                <td>
                    <img class="product-img " src="${productData[i].img}" alt="">
                </td>
                <td>${productData[i].name}</td>
                <td>${productData[i].quantity}</td>
                <td>${productData[i].instockDate}</td>
                <td class="text-center">${productData[i].catalog}</td>
                <td> 
                    <div class="d-flex justify-content-center">
                        <span onclick="removeProduct(${productData[i].id})" class="tm-product-delete-link mx-2">
                            <i class="far fa-trash-alt tm-product-delete-icon"></i>
                        </span>
                        <span onclick="edit(${productData[i].id})"  class="tm-product-delete-link mx-2 ">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </span>
                    </div>  
                </td>
            </tr>`
        }
    }

    // localStorage.setItem('ProductData', JSON.stringify(productData));
    pagination(totalPages, currentPage);
    document.getElementById('account-body').innerHTML = tr;
} 

renderProduct(productData, currentPage)

function getFeature(value) {
    let feature = '';
    
    if(value == 1) {
        feature = 'New Arrival'
    }else if (value == 2) {
        feature = 'Best Sellers'
    }else if (value == 3) {
        feature = 'Sale'
    }else {
        feature = 'Undefined'
    }

    return feature.toLocaleUpperCase();
}

function convertFeature(feature) {
    let value = 0;
    
    if(feature == 'NEW ARRIVAL') {
        value =  1;
    }else if (feature == 'BEST SELLERS') {
        value = 2 ;
    }else if (feature == 'SALE') {
        value = 3 ;
    }

    return value;
}

function getCatelog(value) {
    let catelog = '';
    
    if(value == 1) {
        catelog = 'Running'
    }else if (value == 2) {
        catelog = 'Tennis'
    }else if (value == 3) {
        catelog = 'Indoor'
    }else {
        catelog = 'Undefined'
    }

    return catelog.toLocaleUpperCase();
}

function convertCatelog(catelog) {
    let value = 0;
    
    if(catelog == 'RUNNING') {
        value = 1;
    }else if (catelog = 'TENNIS') {
        value = 2;
    }else if (catelog == 'INDOORS') {
         value = 3;
    }

    return value;
}

function getGender(value) {
    let gender = '';
    
    if(value == 1) {
        gender == 'Men';
    }else if (value == 2) {
        gender = 'women';
    }else {
        gender == 'Undefined';
    }

    return gender;
}

function resetForm () {
    NAME.value = '';
    PRICE.value = '';
    DESCRIPTION.innerHTML;
    FEATURE.value = 0;
    CATELOG.value = 0;
    GENDER.value = 0;
    DATE.value = createDate();
    UNITS.value = 0;
    IMAGE.src= "../../assets/image/upload-img.jpg"  ;
}

function addProduct() {
    event.preventDefault();

    const NAME = document.getElementById('name').value;
    const PRICE = document.getElementById('price').value;
    const DESCRIPTION = document.getElementById('description').innerHTML;
    const FEATURE = document.getElementById('feature').value;
    const CATELOG = document.getElementById('catelog').value;
    const GENDER = document.getElementById('gender').value;
    const DATE = document.getElementById('instockDate').value;
    const UNITS = document.getElementById('stock').value;
    const IMAGE =  document.getElementById('productImg');


    let product =  new Product();
    product.img = IMAGE.src || 'Undefined'; 
    product.name = NAME || 'Undefined';
    product.price = PRICE || 'Undefined';
    product.instockDate = DATE;
    product.catalog = getCatelog(CATELOG);
    product.other = getFeature(FEATURE);
    product.gender = getGender(GENDER);
    product.quantity = UNITS || 0;
    product.description = DESCRIPTION;
    product.rating = 5;
    
    productData.push(product);
    localStorage.setItem('ProductData', JSON.stringify(productData));

    resetForm ();
    renderProduct(productData, currentPage)
    // console.log('NAME', NAME);
    // console.log('DESCRIPTION', DESCRIPTION);
    // console.log('FEATURE', FEATURE);
    // console.log('CATELOG', CATELOG);
    // console.log('GENDER', GENDER);
    // console.log('DATE', DATE);
    // console.log('UNITS', UNITS);
    // console.log(IMAGE.src);
}

function upload() {
    let file = document.getElementById('fileInput');

    document.getElementById('fileInput').click();
    document.getElementById('fileInput').addEventListener('change', () => {
        changeImge(file.files[0]);
    })
}

function changeImge(file) {
    const reader = new FileReader();
    
    reader.onloadend = (event) => {
        document.getElementById('productImg').src = event.target.result;
    };  

    reader.readAsDataURL(file);
}   

function removeProduct(id) {
    for(let i in productData) {
        if(productData[i].id == id) {
            productData.splice(i,1);
        }
    }

    localStorage.setItem('ProductData', JSON.stringify(productData));
    renderProduct(productData, currentPage)
}

// EDIT
function edit(id) {
    for(let i in productData) {
        if(productData[i].id == id) {
            NAME.value = productData[i].name;
            PRICE.value = productData[i].price;
            DESCRIPTION.innerHTML = '';
            FEATURE.value = convertFeature(productData[i].other);
            CATELOG.value = convertCatelog(productData[i].catalog);
            GENDER.value = productData[i].gender == "Men" ? 1 : 2;
            DATE.value = productData[i].instockDate;
            UNITS.value = productData[i].quantity;
            IMAGE.src= productData[i].img ;
        }
    }
    document.getElementById('btn-edit').setAttribute('onclick', `editProduct(${id})`)
    location.href = "#addForm"
}

function editProduct(id) {
    event.preventDefault();
    
    const NAME = document.getElementById('name').value;
    const PRICE = document.getElementById('price').value;
    const DESCRIPTION = document.getElementById('description').innerHTML;
    const FEATURE = document.getElementById('feature').value;
    const CATELOG = document.getElementById('catelog').value;
    const GENDER = document.getElementById('gender').value;
    const DATE = document.getElementById('instockDate').value;
    const UNITS = document.getElementById('stock').value;
    const IMAGE =  document.getElementById('productImg');

    if(id) {
        for(let i in productData) {
            if(productData[i].id == id) {
                productData[i].img = IMAGE.src || 'Undefined'; 
                productData[i].name = NAME || 'Undefined';
                productData[i].price = PRICE || 'Undefined';
                productData[i].instockDate = DATE;
                productData[i].catalog = getCatelog(CATELOG);
                productData[i].other = getFeature(FEATURE);
                productData[i].gender = getGender(GENDER);
                productData[i].quantity = UNITS || 0;
                productData[i].description = DESCRIPTION;
                productData[i].rating = 5;

                localStorage.setItem('ProductData', JSON.stringify(productData));
                document.getElementById('btn-edit').setAttribute('onclick', 'editProduct()')

                resetForm ();
                renderProduct(productData, currentPage)
            }
        }
    }

    // let product =  new Product();
    // product.img = IMAGE.src || 'Undefined'; 
    // product.name = NAME || 'Undefined';
    // product.price = PRICE || 'Undefined';
    // product.instockDate = DATE;
    // product.catalog = getCatelog(CATELOG);
    // product.other = getFeature(FEATURE);
    // product.gender = getGender(GENDER);
    // product.quantity = UNITS || 0;
    // product.description = DESCRIPTION;
    // product.rating = 5;
    
    // productData.push(product);


    // resetForm ();
    // renderProduct(productData, currentPage)

    // console.log('NAME', NAME);
    // console.log('DESCRIPTION', DESCRIPTION);
    // console.log('FEATURE', FEATURE);
    // console.log('CATELOG', CATELOG);
    // console.log('GENDER', GENDER);
    // console.log('DATE', DATE);
    // console.log('UNITS', UNITS);
    // console.log(IMAGE.src);
}
