
/* ===== assets/js/login/login.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/login/login.js
==================================================*/

const Login = {

    render() {

        document.getElementById("mainContent").innerHTML = `

<div class="login-container">

    <div class="login-left">

        <img
            src="assets/images/logo.png"
            class="login-logo">

        <h1>Sewangan Vidyapeeth</h1>

        <h3>Management System</h3>

        <p>
            Empowering Education Through Technology
        </p>

        <div class="login-version">

            Academic Session : 2026-27

            <br>

            Version 2.0

        </div>

    </div>

    <div class="login-right">

        <div class="login-card">

            <h2>Welcome Back</h2>

            <p>Please login to continue</p>

            <input
                type="text"
                id="loginUsername"
                placeholder="Username">

            <input
                type="password"
                id="loginPassword"
                placeholder="Password">

            <div class="login-options">

                <label>

                    <input
                        type="checkbox"
                        id="rememberMe">

                    Remember Me

                </label>

                <label>

                    <input
                        type="checkbox"
                        onclick="Login.togglePassword()">

                    Show Password

                </label>

            </div>

            <button
                class="login-btn"
                onclick="authenticateUser()">

                LOGIN

            </button>

            <div class="login-links">

                <a href="#"
                   onclick="forgotPassword()">

                    Forgot Password?

                </a>

            </div>

        </div>

    </div>

</div>

`;

    },

    togglePassword() {

        const pwd =
            document.getElementById("loginPassword");

        pwd.type =
            pwd.type === "password"
            ? "text"
            : "password";

    }

};

/* ===== assets/js/login/accessControl.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/login/accessControl.js
==================================================*/

const AccessControl = {

    permissions: {

        "Super Administrator": ["*"],

        "Administrator": ["*"],

        "Principal": [
            "dashboard","students","teachers","attendance",
            "timetable","library","inventory",
            "exams","results","certificates","reports",
            "notifications"
        ],

        "Teacher": [
            "dashboard","attendance","results"
        ],

        "Librarian": [
            "dashboard","library"
        ],

        "Store Keeper": [
            "dashboard","inventory"
        ]
    },

    canAccess(module) {

    const user = currentUser();

    console.log("User =", user);
    console.log("Role =", user ? user.role : null);
    console.log("Module =", module);
    console.log("Permissions =", this.permissions[user?.role]);

    if (!user) return false;

    const role = this.permissions[user.role];

    if (!role) return false;

    if (role.includes("*")) return true;

    return role.includes(module);
},

    applyMenu() {

        document.querySelectorAll(".sidebar button").forEach(btn => {
            btn.style.display = "none";
        });

        const user = currentUser();

        if (!user) return;

        const permissions = this.permissions[user.role];

        if (!permissions) return;

        if (permissions.includes("*")) {

            document.querySelectorAll(".sidebar button").forEach(btn => {
                btn.style.display = "block";
            });

            return;
        }

        permissions.forEach(module => {

            const btn = document.getElementById("menu-" + module);

            if (btn) {
                btn.style.display = "block";
            }

        });

    }

};

/* ===== assets/js/login/authenticate.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/login/authenticate.js
 Version : 3.0.0
==================================================*/

/*==========================================
 Authenticate User
==========================================*/

function authenticateUser() {

    const username =
        document.getElementById("loginUsername")
        .value
        .trim();

    const password =
        document.getElementById("loginPassword")
        .value
        .trim();

console.log("Username:", username);
console.log("Password:", password);

let users = Database.getAll(CONFIG.STORAGE.USERS);

// Always use latest cloud data
if (typeof FirebaseSync !== "undefined") {

    FirebaseSync.download(CONFIG.STORAGE.USERS);

    users = Database.getAll(CONFIG.STORAGE.USERS);

}

console.log("Users:", users);

    const remember =
        document.getElementById("rememberMe")
        ? document.getElementById("rememberMe").checked
        : false;

    if (!username) {

        Utils.message("Enter username.");

        return;

    }

    if (!password) {

        Utils.message("Enter password.");

        return;

    }

    const index =
        users.findIndex(u =>

            u.username === username &&
            u.password === password &&
            u.status === "Active"

        );

console.log("Index:", index);

    if (index === -1) {

        Utils.message("Invalid username or password.");

        return;

    }

    const user = users[index];

    user.lastLogin =
        Utils.currentDateTime();

    user.updatedOn =
        Utils.currentDateTime();

   Database.update(
    CONFIG.STORAGE.USERS,
    index,
    user
);

// Upload updated login information
if (typeof FirebaseSync !== "undefined") {

    FirebaseSync.upload(
        CONFIG.STORAGE.USERS,
        Database.getAll(CONFIG.STORAGE.USERS)
    );

}

    sessionStorage.setItem(

        "svmsLoggedIn",

        "true"

    );

    sessionStorage.setItem(

        "svmsCurrentUser",

        JSON.stringify(user)

    );

console.log(sessionStorage.getItem("svmsLoggedIn"));
console.log(sessionStorage.getItem("svmsCurrentUser"));

    if (remember) {

        Session.remember(user);

    }

    else {

        Session.forget();

    }

    Session.saveHistory(user);

    Session.start();

    if (typeof Menu !== "undefined") {

        Menu.apply();

    }

    if (typeof addAuditLog === "function") {

        addAuditLog(

            "Authentication",

            "Login",

            user.username

        );

    }

    Utils.message(

        "Welcome " + user.name

    );

    Layout.show();

AccessControl.applyMenu();

Dashboard.render();

}

/*==========================================
 Check Login
==========================================*/

function isLoggedIn() {

    return sessionStorage.getItem(

        "svmsLoggedIn"

    ) === "true";

}

/*==========================================
 Current User
==========================================*/

function currentUser() {

    const data =
        sessionStorage.getItem(

            "svmsCurrentUser"

        );

    return data

        ? JSON.parse(data)

        : null;

}

/* ===== assets/js/login/logout.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/login/logout.js
==================================================*/

/*==========================================
  Logout User
==========================================*/

function logoutUser() {

    if (!confirm("Do you want to logout?")) {

        return;

    }

    const user = currentUser();

    if (

        user &&

        typeof addAuditLog === "function"

    ) {

        addAuditLog(

            "Login",

            "Logout",

            user.username

        );

    }

    sessionStorage.removeItem("svmsLoggedIn");
sessionStorage.removeItem("svmsCurrentUser");

if (typeof FirebaseSync !== "undefined") {

    FirebaseSync.upload(
        "svmsCurrentUser",
        null
    );

}

    Layout.hide();

Login.render();

}

/*==========================================
  Session Expired
==========================================*/

function sessionExpired() {

    sessionStorage.clear();

if (typeof FirebaseSync !== "undefined") {

    FirebaseSync.upload(
        "svmsCurrentUser",
        null
    );

}

    Utils.message(

        "Session expired. Please login again."

    );

    Login.render();

}

/*==========================================
  Require Login
==========================================*/

function requireLogin() {

    if (!isLoggedIn()) {

        Login.render();

        return false;

    }

    return true;

}

/* ===== assets/js/login/users.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/login/users.js
==================================================*/

/*==========================================
  Initialize Default Users
==========================================*/

function initializeUsers() {

    const users = Database.getAll(

        CONFIG.STORAGE.USERS

    );

    if (users.length > 0) {

    // Upload existing users to Firebase if needed
    if (typeof FirebaseSync !== "undefined") {

        FirebaseSync.upload(
            CONFIG.STORAGE.USERS,
            users
        );

    }

    return;

}

    const defaultUsers = [

        {

            userId: "USR-0001",

            name: "Administrator",

            username: "admin",

            password: "admin123",

            role: "Super Administrator",

            status: "Active",

            lastLogin: "",

            createdOn:
                Utils.currentDateTime()

        },

        {

            userId: "USR-0002",

            name: "Principal",

            username: "principal",

            password: "principal123",

            role: "Principal",

            status: "Active",

            lastLogin: "",

            createdOn:
                Utils.currentDateTime()

        },

        {

            userId: "USR-0003",

            name: "Teacher",

            username: "teacher",

            password: "teacher123",

            role: "Teacher",

            status: "Active",

            lastLogin: "",

            createdOn:
                Utils.currentDateTime()

        }

    ];

    StorageManager.save(

        CONFIG.STORAGE.USERS,

        defaultUsers

    );

if (typeof FirebaseSync !== "undefined") {

    FirebaseSync.upload(
        CONFIG.STORAGE.USERS,
        defaultUsers
    );

}

    console.log(

        "Default users created."

    );

}

/*==========================================
  Get All Users
==========================================*/

function getUsers() {

    return Database.getAll(

        CONFIG.STORAGE.USERS

    );

}

/*==========================================
  Get User By Username
==========================================*/

function getUser(username) {

    return Database.find(

        CONFIG.STORAGE.USERS,

        "username",

        username

    );

}

/* ===== assets/js/login/forgotPassword.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/login/forgotPassword.js
==================================================*/

/*==========================================
  Forgot Password
==========================================*/

function forgotPassword() {

    const username = prompt(

        "Enter your username."

    );

    if (!username) {

        return;

    }

    const user = Database.find(

        CONFIG.STORAGE.USERS,

        "username",

        username.trim()

    );

    if (!user) {

        Utils.message(

            "User not found."

        );

        return;

    }

    alert(

`User Details

Name      : ${user.name}
Username  : ${user.username}
Role      : ${user.role}

Please contact the System Administrator
to reset your password.`

    );

}

/*==========================================
  Reset Password
==========================================*/

function resetUserPassword(

    username,

    newPassword

) {

    const users = Database.getAll(

        CONFIG.STORAGE.USERS

    );

    const index = users.findIndex(

        u => u.username === username

    );

    if (index === -1) {

        return false;

    }

    users[index].password = newPassword;

    users[index].updatedOn =

        Utils.currentDateTime();

    Database.update(

        CONFIG.STORAGE.USERS,

        index,

        users[index]

    );

    return true;

}

/* ===== assets/js/login/changePassword.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/login/changePassword.js
==================================================*/

/*==========================================
 Change Password Screen
==========================================*/

function changePassword() {

    const user = currentUser();

    if (!user) {

        Utils.message("Please login first.");

        return;

    }

    document.getElementById("mainContent").innerHTML = `

<div class="card">

<h2>🔒 Change Password</h2>

<table class="form-table">

<tr>

<td width="220">Username</td>

<td>

<input
type="text"
value="${user.username}"
readonly>

</td>

</tr>

<tr>

<td>Current Password</td>

<td>

<input
type="password"
id="oldPassword">

</td>

</tr>

<tr>

<td>New Password</td>

<td>

<input
type="password"
id="newPassword">

</td>

</tr>

<tr>

<td>Confirm Password</td>

<td>

<input
type="password"
id="confirmPassword">

</td>

</tr>

</table>

<br>

<button
class="btn"
onclick="savePasswordChange()">

💾 Update Password

</button>

<button
class="btn"
onclick="Dashboard.render()">

⬅ Back

</button>

</div>

`;

}

/*==========================================
 Save Password
==========================================*/

function savePasswordChange() {

    const user = currentUser();

    const users =
        Database.getAll(CONFIG.STORAGE.USERS);

    const oldPassword =
        document.getElementById("oldPassword").value;

    const newPassword =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if (oldPassword !== user.password) {

        Utils.message("Current password is incorrect.");

        return;

    }

    if (newPassword.length < 6) {

        Utils.message(
            "Password must contain at least 6 characters."
        );

        return;

    }

    if (newPassword !== confirmPassword) {

        Utils.message("Passwords do not match.");

        return;

    }

    const index = users.findIndex(

        u => u.userId === user.userId

    );

    users[index].password = newPassword;

    users[index].updatedOn =
        Utils.currentDateTime();

    Database.update(

        CONFIG.STORAGE.USERS,

        index,

        users[index]

    );

    sessionStorage.setItem(

        "svmsCurrentUser",

        JSON.stringify(users[index])

    );

    Utils.message("Password updated successfully.");

    Dashboard.render();

}

/* ===== assets/js/login/profile.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/login/profile.js
==================================================*/

/*==========================================
 User Profile
==========================================*/

function userProfile() {

    const user = currentUser();

    if (!user) {

        Utils.message("Please login first.");

        return;

    }

    document.getElementById("mainContent").innerHTML = `

<div class="card">

<h2>👤 My Profile</h2>

<table class="form-table">

<tr>

<td width="220">User ID</td>

<td>

<input
type="text"
id="profileUserId"
value="${user.userId}"
readonly>

</td>

</tr>

<tr>

<td>Name</td>

<td>

<input
type="text"
id="profileName"
value="${user.name || ""}">

</td>

</tr>

<tr>

<td>Username</td>

<td>

<input
type="text"
id="profileUsername"
value="${user.username}"
readonly>

</td>

</tr>

<tr>

<td>Role</td>

<td>

<input
type="text"
id="profileRole"
value="${user.role}"
readonly>

</td>

</tr>

<tr>

<td>Status</td>

<td>

<input
type="text"
id="profileStatus"
value="${user.status}"
readonly>

</td>

</tr>

<tr>

<td>Last Login</td>

<td>

<input
type="text"
value="${user.lastLogin || "-"}"
readonly>

</td>

</tr>

<tr>

<td>Created On</td>

<td>

<input
type="text"
value="${user.createdOn || "-"}"
readonly>

</td>

</tr>

</table>

<br>

<button
class="btn"
onclick="saveUserProfile()">

💾 Save

</button>

<button
class="btn"
onclick="changePassword()">

🔒 Change Password

</button>

<button
class="btn"
onclick="Dashboard.render()">

⬅ Back

</button>

</div>

`;

}

/*==========================================
 Save User Profile
==========================================*/

function saveUserProfile() {

    const users =
        Database.getAll(CONFIG.STORAGE.USERS);

    const current =
        currentUser();

    const index =
        users.findIndex(

            u => u.userId === current.userId

        );

    if (index === -1) {

        Utils.message("User not found.");

        return;

    }

    const name =
        document.getElementById("profileName")
        .value
        .trim();

    if (!name) {

        Utils.message("Name is required.");

        return;

    }

    users[index].name = name;

    users[index].updatedOn =
        Utils.currentDateTime();

    Database.update(

        CONFIG.STORAGE.USERS,

        index,

        users[index]

    );

    sessionStorage.setItem(

        "svmsCurrentUser",

        JSON.stringify(users[index])

    );

    Utils.message(

        "Profile updated successfully."

    );

}

/* ===== assets/js/login/userManagement.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/login/userManagement.js
==================================================*/

/*==========================================
 User Management
==========================================*/

function userManagement() {

    const users =
        Database.getAll(CONFIG.STORAGE.USERS);

    let html = `

<div class="card">

<h2>👥 User Management</h2>

<button
class="btn"
onclick="newUser()">

➕ New User

</button>

<button
class="btn"
onclick="Dashboard.render()">

⬅ Back

</button>

<br><br>

<table class="table">

<tr>

<th>#</th>
<th>User ID</th>
<th>Name</th>
<th>Username</th>
<th>Role</th>
<th>Status</th>
<th>Last Login</th>
<th width="220">Action</th>

</tr>

`;

    if (users.length === 0) {

        html += `

<tr>

<td colspan="8">

No users available.

</td>

</tr>

`;

    }

    users.forEach((user,index)=>{

        html += `

<tr>

<td>${index+1}</td>

<td>${user.userId}</td>

<td>${user.name}</td>

<td>${user.username}</td>

<td>${user.role}</td>

<td>${user.status}</td>

<td>${user.lastLogin || "-"}</td>

<td>

<button
class="btn"
onclick="editUser(${index})">

✏

</button>

<button
class="btn"
onclick="toggleUserStatus(${index})">

${user.status==="Active"?"⛔":"✅"}

</button>

<button
class="btn"
onclick="deleteUser(${index})">

🗑

</button>

</td>

</tr>

`;

    });

    html += `

</table>

</div>

`;

    document.getElementById("mainContent").innerHTML = html;

}

/*==========================================
 New User
==========================================*/

function newUser(){

    document.getElementById("mainContent").innerHTML = `

<div class="card">

<h2>➕ New User</h2>

<table class="form-table">

<tr>

<td width="220">Name</td>

<td>

<input
type="text"
id="newUserName">

</td>

</tr>

<tr>

<td>Username</td>

<td>

<input
type="text"
id="newUsername">

</td>

</tr>

<tr>

<td>Password</td>

<td>

<input
type="password"
id="newPassword">

</td>

</tr>

<tr>

<td>Role</td>

<td>

<select id="newRole">

<option>Super Administrator</option>

<option>Principal</option>

<option>Office Admin</option>

<option>Teacher</option>

<option>Librarian</option>

<option>Store Manager</option>

</select>

</td>

</tr>

<tr>

<td>Status</td>

<td>

<select id="newStatus">

<option>Active</option>

<option>Inactive</option>

</select>

</td>

</tr>

</table>

<br>

<button
class="btn"
onclick="saveNewUser()">

💾 Save User

</button>

<button
class="btn"
onclick="userManagement()">

⬅ Cancel

</button>

</div>

`;

}

/*==========================================
 Save User
==========================================*/

function saveNewUser(){

    const users =
        Database.getAll(CONFIG.STORAGE.USERS);

    const username =
        document.getElementById("newUsername").value.trim();

    if(users.find(u=>u.username===username)){

        Utils.message("Username already exists.");

        return;

    }

    users.push({

        userId:
            "USR-"+Date.now(),

        name:
            document.getElementById("newUserName").value.trim(),

        username,

        password:
            document.getElementById("newPassword").value,

        role:
            document.getElementById("newRole").value,

        status:
            document.getElementById("newStatus").value,

        lastLogin:"",

        createdOn:
            Utils.currentDateTime()

    });

    StorageManager.save(

        CONFIG.STORAGE.USERS,

        users

    );

    Utils.message("User created successfully.");

    userManagement();

}

/*==========================================
 Edit User
==========================================*/

function editUser(index){

    Utils.message(
        "Edit User module will be added next."
    );

}

/*==========================================
 Activate / Deactivate
==========================================*/

function toggleUserStatus(index){

    const users =
        Database.getAll(CONFIG.STORAGE.USERS);

    users[index].status =

        users[index].status==="Active"
        ? "Inactive"
        : "Active";

    Database.update(

        CONFIG.STORAGE.USERS,

        index,

        users[index]

    );

    userManagement();

}

/*==========================================
 Delete User
==========================================*/

function deleteUser(index){

    if(!confirm("Delete this user?")){

        return;

    }

    Database.delete(

        CONFIG.STORAGE.USERS,

        index

    );

    Utils.message("User deleted.");

    userManagement();

}

/* ===== assets/js/login/roles.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/login/roles.js
==================================================*/

/*==========================================
  SVMS Role Permissions
==========================================*/

const RolePermissions = {

    "Super Administrator": [

        "dashboard",
        "students",
        "teachers",
        "attendance",
        "welfare",
        "library",
        "inventory",
        "timetable",
        "exams",
        "results",
        "certificates",
        "reports",
        "notifications",
        "settings",
        "users",
        "svcet",
        "admissions"

    ],

    "Principal": [

        "dashboard",
        "students",
        "teachers",
        "attendance",
        "timetable",
        "exams",
        "results",
        "reports",
        "certificates"

    ],

    "Office Admin": [

        "dashboard",
        "students",
        "teachers",
        "attendance",
        "certificates",
        "reports",
        "admissions"

    ],

    "Teacher": [

        "dashboard",
        "attendance",
        "timetable",
        "results",
        "exams"

    ],

    "Librarian": [

        "dashboard",
        "library"

    ],

    "Store Manager": [

        "dashboard",
        "inventory"

    ]

};

/*==========================================
  Check Permission
==========================================*/

function hasPermission(module) {

    const user = currentUser();

    if (!user) {

        return false;

    }

    const permissions =

        RolePermissions[user.role] || [];

    return permissions.includes(module);

}

/*==========================================
  Open Module With Permission
==========================================*/

function openSecureModule(module) {

    if (!requireLogin()) {

        return;

    }

    if (!hasPermission(module)) {

        Utils.message(

            "Access Denied.\n\nYou do not have permission to open this module."

        );

        return;

    }

    Router.open(module);

}

/*==========================================
  Get Current Role
==========================================*/

function currentRole() {

    const user = currentUser();

    return user ? user.role : "";

}

/*==========================================
  Check Super Administrator
==========================================*/

function isSuperAdministrator() {

    return currentRole() ===

        "Super Administrator";

}

/*==========================================
  Check Principal
==========================================*/

function isPrincipal() {

    return currentRole() ===

        "Principal";

}

/*==========================================
  Check Teacher
==========================================*/

function isTeacher() {

    return currentRole() ===

        "Teacher";

}

/*==========================================
  Check Office Admin
==========================================*/

function isOfficeAdmin() {

    return currentRole() ===

        "Office Admin";

}

/*==========================================
  Check Librarian
==========================================*/

function isLibrarian() {

    return currentRole() ===

        "Librarian";

}

/*==========================================
  Check Store Manager
==========================================*/

function isStoreManager() {

    return currentRole() ===

        "Store Manager";

}

/* ===== assets/js/login/session.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/login/session.js
==================================================*/

const Session = {

    timeout: 30 * 60 * 1000, // 30 Minutes

    timer: null,

    initialized: false,

    /*==========================================
      Start Session
    ==========================================*/

   start() {

    if (this.initialized) {

        this.reset();

        return;

    }

    this.initialized = true;

    this.reset();

    document.addEventListener(

        "click",

        () => this.reset()

    );

    document.addEventListener(

        "keypress",

        () => this.reset()

    );

    document.addEventListener(

        "mousemove",

        () => this.reset()

    );

},

    /*==========================================
      Reset Timer
    ==========================================*/

    reset() {

        clearTimeout(this.timer);

        this.timer = setTimeout(

            () => this.expire(),

            this.timeout

        );

    },

    /*==========================================
      Session Expired
    ==========================================*/

    expire() {

        sessionStorage.removeItem(

            "svmsLoggedIn"

        );

        sessionStorage.removeItem(

            "svmsCurrentUser"

        );

        alert(

            "Session expired.\nPlease login again."

        );

        Layout.hide();

Login.render();

    },

    /*==========================================
      Remember Me
    ==========================================*/

    remember(user) {

    localStorage.setItem(
        "svmsRememberUser",
        JSON.stringify(user)
    );

    if (typeof FirebaseSync !== "undefined") {

        FirebaseSync.upload(
            "svmsRememberUser",
            user
        );

    }

},

    /*==========================================
      Remove Remember
    ==========================================*/

    forget() {

    localStorage.removeItem("svmsRememberUser");

    if (typeof FirebaseSync !== "undefined") {

        FirebaseSync.upload(
            "svmsRememberUser",
            null
        );

    }

},

    /*==========================================
      Auto Login
    ==========================================*/

    autoLogin() {

        const data = localStorage.getItem(

            "svmsRememberUser"

        );

        if (!data) {

            return false;

        }

        const user = JSON.parse(data);

        sessionStorage.setItem(

            "svmsLoggedIn",

            "true"

        );

        sessionStorage.setItem(

            "svmsCurrentUser",

            JSON.stringify(user)

        );

        Layout.show();

AccessControl.applyMenu();

Dashboard.render();

this.start();

return true;

    },

    /*==========================================
      Save Login History
    ==========================================*/

    saveHistory(user) {

        const key = "svms_login_history";

        const history =

            JSON.parse(

                localStorage.getItem(key)

            ) || [];

        history.unshift({

            username: user.username,

            role: user.role,

            loginTime:

                Utils.currentDateTime()

        });

        if (history.length > 100) {

            history.pop();

        }

        localStorage.setItem(
    key,
    JSON.stringify(history)
);

if (typeof FirebaseSync !== "undefined") {

    FirebaseSync.upload(
        key,
        history
    );

}

    },

    /*==========================================
      View Login History
    ==========================================*/

    history() {

        const history =

            JSON.parse(

                localStorage.getItem(

                    "svms_login_history"

                )

            ) || [];

        let html = `

<div class="card">

<h2>Login History</h2>

<table class="table">

<tr>

<th>#</th>

<th>Username</th>

<th>Role</th>

<th>Login Time</th>

</tr>

`;

        if (history.length === 0) {

            html += `

<tr>

<td colspan="4">

No login history.

</td>

</tr>

`;

        }

        history.forEach((item,index)=>{

            html += `

<tr>

<td>${index+1}</td>

<td>${item.username}</td>

<td>${item.role}</td>

<td>${item.loginTime}</td>

</tr>

`;

        });

        html += `

</table>

<br>

<button
class="btn"
onclick="Dashboard.render()">

⬅ Back

</button>

</div>

`;

        document.getElementById(

            "mainContent"

        ).innerHTML = html;

    }

};

/* ===== assets/js/login/menu.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/login/menu.js
==================================================*/

const Menu = {

    apply() {

        if (
            typeof isLoggedIn === "function" &&
            !isLoggedIn()
        ) {
            return;
        }

        const user =
            typeof currentUser === "function"
            ? currentUser()
            : null;

        if (!user) return;

        let permissions = [];

        if (
            typeof AccessControl !== "undefined" &&
            AccessControl.permissions &&
            AccessControl.permissions[user.role]
        ) {

            permissions =
                AccessControl.permissions[user.role];

        }

        document
            .querySelectorAll("[data-module]")
            .forEach(item => {

                const module =
                    item.getAttribute("data-module");

                if (
                    permissions.includes("*") ||
                    permissions.includes(module)
                ) {

                    item.style.display = "";

                } else {

                    item.style.display = "none";

                }

            });

    },

    showAll() {

        document
            .querySelectorAll("[data-module]")
            .forEach(item => {

                item.style.display = "";

            });

    }

};

/* ===== assets/js/login/layout.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/login/layout.js
==================================================*/

const Layout = {

    hide() {

        document.getElementById("appHeader").style.display = "none";
        document.getElementById("appSidebar").style.display = "none";
        document.getElementById("appFooter").style.display = "none";

    },

    show() {

        document.getElementById("appHeader").style.display = "";
        document.getElementById("appSidebar").style.display = "";
        document.getElementById("appFooter").style.display = "";

    }

};

/* ===== assets/js/logout.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/logout.js
==================================================*/

function logout() {

    if (!confirm("Do you want to logout?")) {
        return;
    }

    Session.forget();

    Layout.hide();

    Login.render();

}