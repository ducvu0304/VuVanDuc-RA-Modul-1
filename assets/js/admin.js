const userData = JSON.parse(localStorage.getItem("UserData")) || [];
const CHECK = JSON.parse(localStorage.getItem("check")) ||  JSON.parse(sessionStorage.getItem("check"))|| "";


// Login Status 
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

function renderUserList() {
    let tr = ''
    let stt = 1

    for(let i in userData) {
        tr +=
        `<tr>
            <td>${stt++}</td>
            <td>${userData[i].id}</td>
            <td>${userData[i].firstName} ${userData[i].lastName}</td>
            <td>${userData[i].email}</td>
            <td>${userData[i].createDate}</td>
            <td> 
                <div class="d-flex justify-content-center">
                    <span class="tm-product-delete-link mx-2" onclick="removeAccount(${userData[i].id})">
                        <i class="far fa-trash-alt tm-product-delete-icon"></i>
                    </span>
                    <span class="tm-product-delete-link mx-2 text-primary" onclick="editAccount(${userData[i].id})">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </span>
                </div>  
            </td>
            <td class="text-center">${userData[i].author}</td>
        </tr>`
    }

    document.getElementById("account-boddy").innerHTML = tr;
}
renderUserList();

function removeAccount(id) {

    for(let i in userData) {
        if(userData[i].id == id) {
            userData.splice(i,1)
            localStorage.setItem("UserData", JSON.stringify(userData));
            renderUserList()
        }
    }
}

function editAccount(id) {
    localStorage.setItem("accountID", JSON.stringify(id));
    location.href = './account.html'
}