const userData = JSON.parse(localStorage.getItem("UserData")) || [];
const accountID = JSON.parse(localStorage.getItem("accountID")) || '';
const AUTHOR = document.getElementById('author');
const FIRSTNAME = document.getElementById('firstName');
const LASTNAME = document.getElementById('lastName');
const EMAIL = document.getElementById('email');
const PHONE = document.getElementById('phone');
const PASSWORD = document.getElementById('password');
const CONFIRMPASSWORD = document.getElementById('confirmPassword');
const AVARTAR = document.getElementById('avatar');
const accountMessage = document.querySelector('.account-message');
const emailMessage = document.querySelector('.email-message');
const passwordMessage = document.querySelector('.password-message');
const confPasswordMessage = document.querySelector('.conf-password-message');
const btn = document.querySelector('.btn-create-edit');
console.log(userData);


// Login Status 
// const userData = JSON.parse(localStorage.getItem("UserData")) || [];
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

/* Edit Account */
if (accountID != '') {
    for(let i in userData) {
        if(userData[i].id == accountID) {
            AUTHOR.value = userData[i].author == "Customer" ? 2 : 1; 
            FIRSTNAME.value = userData[i].firstName
            LASTNAME.value = userData[i].lastName 
            EMAIL.value = userData[i].email 
            PHONE.value = userData[i].phone 
            PASSWORD.value = userData[i].password 
            CONFIRMPASSWORD.value = userData[i].password
        }
    }
    btn.innerHTML = "EDIT ACCOUNT"
    btn.setAttribute("onclick", `edit(${accountID})`)
}

function edit(id) {
    event.preventDefault();
    let author = ''
    let account = {}

    for(let i in userData) {
        if(userData[i].id == id) {
            account = {...userData[i]};
        }
    }

    if (AUTHOR.value == 1) {
        author = "Admin";
        accountMessage.style.display = "none"
    }else if (AUTHOR.value == 2) {
        author = "Customer";
        accountMessage.style.display = "none"
    }else {
        accountMessage.style.display = "block";
        return
    }
   
    if(account.email == EMAIL.value || checkEmail(EMAIL.value)) {
        if(PASSWORD.value > 6) {
            if(PASSWORD.value == CONFIRMPASSWORD.value) {
                emailMessage.style.display = "none";
                passwordMessage.style.display = 'none';
                confPasswordMessage.style.display = 'none';

                account.firstName = FIRSTNAME.value;
                account.lastName = LASTNAME.value;
                account.email = EMAIL.value;
                account.password = PASSWORD.value;
                account.phone = PHONE.value;
                account.author = author;
                account.img = AVARTAR.src;

                for(let i in userData) {
                    if(userData[i].id == id)
                    userData.splice(i,1, account);
                }

                localStorage.setItem("UserData", JSON.stringify(userData));
                localStorage.removeItem("accountID");
                resetForm();
                showNackbar('The account is created successfully!');
            }else {
                passwordMessage.style.display = 'none';
                confPasswordMessage.style.display = 'block'
            }
        }else {
            emailMessage.style.display = 'none'
            passwordMessage.style.display = 'block'
        }
    }else {
        emailMessage.style.display = "block"
    }
}
/* End Edit Account */

/* Create Account */
function uuid() {
    let uuid = Math.floor(Math.random()*999999999) + (new Date()).getMilliseconds();
    return uuid;
}

function createDate() {
    const d = new Date();
    const date = `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`;
    return date;
}

class Account {
    constructor(firstName, lastName, email, password, phone, author, img) {
        this.id = uuid();
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.phone = phone
        this.createDate = createDate();
        this.author = author;
        this.img = img;
    }
}


function checkEmail(email) {
    let isEmail = true ;
    const EMAILREGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!EMAILREGEX.test(email)) {
        return !isEmail
    }
    
    for(let i in userData) {
        if(userData[i].email.toUpperCase() == email.toUpperCase()) {
            return !isEmail
        }
    }

    return isEmail;
 }  

 //  Show-Nackbar
function showNackbar(message) {
    let x = document.getElementById("snackbar");
    x.innerHTML = message;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function createAccount(event) {
    event.preventDefault();
    let author = '';

    if (AUTHOR.value == 1) {
        author = "Admin";
        accountMessage.style.display = "none"
    }else if (AUTHOR.value == 2) {
        author = "Customer";
        accountMessage.style.display = "none"
    }else {
        accountMessage.style.display = "block";
        return
    }

    if(checkEmail(EMAIL.value)) {
        if(PASSWORD.value > 6) {
            if(PASSWORD.value == CONFIRMPASSWORD.value) {
                emailMessage.style.display = "none";
                passwordMessage.style.display = 'none';
                confPasswordMessage.style.display = 'none';

                const account = new Account();
                account.firstName = FIRSTNAME.value;
                account.lastName = LASTNAME.value;
                account.fullName = FIRSTNAME.value + '' + LASTNAME.value;
                account.email = EMAIL.value;
                account.password = PASSWORD.value;
                account.phone = PHONE.value;
                account.author = author;
                account.img = AVARTAR.src;

                userData.push(account);

                localStorage.setItem("UserData", JSON.stringify(userData));
              
                resetForm();
                showNackbar('The account is created successfully!');
            }else {
                passwordMessage.style.display = 'none';
                confPasswordMessage.style.display = 'block'
            }
        }else {
            emailMessage.style.display = 'none'
            passwordMessage.style.display = 'block'
        }
    }else {
        emailMessage.style.display = "block"
    }
}

function resetForm () {
    const AUTHORVALUE = document.getElementById('author');
    const FIRSTNAME = document.getElementById('firstName');
    const LASTNAME = document.getElementById('lastName');
    const EMAIL = document.getElementById('email');
    const PHONE = document.getElementById('phone');
    const PASSWORD = document.getElementById('password');
    const CONFIRMPASSWORD = document.getElementById('confirmPassword');
    const AVARTAR = document.getElementById('avatar').src;

    AUTHORVALUE.value = 0;
    FIRSTNAME.value = '';
    LASTNAME.value = '';
    EMAIL.value = '';
    PHONE.value = '';
    PASSWORD.value = '';
    CONFIRMPASSWORD.value = '';
    AVARTAR.src = '../image/upload-img.jpg';
}

function changeImg(element) {
    let img = element.files[0];
    let avatar = document.getElementById('avatar')
 
    let file = new FileReader();

    file.readAsDataURL(img);   
    file.onloadend= ()=>{
        avatar.src = file.result;
    }  
}  

