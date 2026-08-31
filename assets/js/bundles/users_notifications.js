
/* ===== assets/js/users/users.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/users/users.js
 Version : 2.0.0
==================================================*/

const Users = {

    render() {

        const users = Database.getAll(
            CONFIG.STORAGE.USERS || "users"
        );

        document.getElementById("mainContent").innerHTML = `

<div class="page">

<div class="page-header">

<h2>👤 User Management</h2>

</div>

<div class="dashboard-grid">

<div class="dashboard-card">
<h3>Total Users</h3>
<h1>${users.length}</h1>
</div>

</div>

<div class="card">

<h3>Quick Actions</h3>

<button class="btn"
onclick="NewUser.render()">

➕ New User

</button>

<button class="btn"
onclick="UserRegister.render()">

📋 User Register

</button>

<button class="btn"
onclick="Roles.render()">

🛡 Roles

</button>

<button class="btn"
onclick="Permissions.render()">

🔐 Permissions

</button>

<button class="btn"
onclick="ResetPassword.render()">

🔑 Reset Password

</button>

<button class="btn"
onclick="ActivityLog.render()">

📜 Activity Log

</button>

<button class="btn"
onclick="UserPrint.print()">

🖨 Print

</button>

</div>

<div id="usersContent"></div>

</div>

`;

    }

};

/* ===== assets/js/users/newUser.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/users/newUser.js
 Version : 2.0.0
==================================================*/

const NewUser = {

    render() {

        document.getElementById("usersContent").innerHTML = `

<div class="card">

<h2>➕ New User</h2>

<div class="form-grid">

<div class="form-group">
<label>Full Name</label>
<input type="text" id="userName">
</div>

<div class="form-group">
<label>Username</label>
<input type="text" id="userUsername">
</div>

<div class="form-group">
<label>Password</label>
<input type="password" id="userPassword">
</div>

<div class="form-group">
<label>Confirm Password</label>
<input type="password" id="userConfirmPassword">
</div>

<div class="form-group">
<label>Role</label>
<select id="userRole">

<option value="">Select Role</option>
<option>Administrator</option>
<option>Principal</option>
<option>Teacher</option>
<option>Accountant</option>
<option>Librarian</option>
<option>Reception</option>
<option>Office Staff</option>

</select>
</div>

<div class="form-group">
<label>Mobile</label>
<input type="text" id="userMobile">
</div>

<div class="form-group">
<label>Email</label>
<input type="email" id="userEmail">
</div>

<div class="form-group">
<label>Status</label>
<select id="userStatus">

<option value="Active">Active</option>
<option value="Inactive">Inactive</option>

</select>
</div>

</div>

<br>

<button
class="btn"
onclick="SaveUser.save()">

💾 Save User

</button>

<button
class="btn"
onclick="Users.render()">

❌ Cancel

</button>

</div>

`;

    }

};

/* ===== assets/js/users/saveUser.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/users/saveUser.js
 Version : 2.0.0
==================================================*/

const SaveUser = {

    save() {

        const storageKey =
            CONFIG.STORAGE.USERS || "users";

        let users = Database.getAll(storageKey);

        const name =
            document.getElementById("userName").value.trim();

        const username =
            document.getElementById("userUsername").value.trim();

        const password =
            document.getElementById("userPassword").value;

        const confirmPassword =
            document.getElementById("userConfirmPassword").value;

        const role =
            document.getElementById("userRole").value;

        const mobile =
            document.getElementById("userMobile").value.trim();

        const email =
            document.getElementById("userEmail").value.trim();

        const status =
            document.getElementById("userStatus").value;

        /* Validation */

        if (
            name === "" ||
            username === "" ||
            password === "" ||
            role === ""
        ) {

            alert("Please fill all required fields.");

            return;

        }

        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;

        }

        const exists = users.some(user =>
            user.username.toLowerCase() ===
            username.toLowerCase()
        );

        if (exists) {

            alert("Username already exists.");

            return;

        }

        const session =
            CONFIG.CURRENT_SESSION || "2627";

        const userId =
            "SV/USR/" +
            session +
            "/" +
            String(users.length + 1).padStart(4, "0");

        const user = {

            id: userId,

            name,

            username,

            password,

            role,

            mobile,

            email,

            status,

            createdAt: new Date().toISOString()

        };

        users.push(user);

        Database.saveAll(storageKey, users);

        if (typeof addAuditLog === "function") {

            addAuditLog(
                "Users",
                "Create User",
                username
            );

        }

        alert("User created successfully.");

        if (typeof UserRegister !== "undefined") {

            UserRegister.render();

        } else {

            Users.render();

        }

    }

};

/* ===== assets/js/users/userRegister.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/users/userRegister.js
 Version : 2.0.0
==================================================*/

const UserRegister = {

    render() {

        const storageKey =
            CONFIG.STORAGE.USERS || "users";

        const users =
            Database.getAll(storageKey);

        let html = `

<div class="card">

<h2>👤 User Register</h2>

<input
type="text"
id="userSearch"
class="input"
placeholder="Search User..."
onkeyup="UserRegister.search()">

<br><br>

<table class="table">

<thead>

<tr>

<th>User ID</th>
<th>Name</th>
<th>Username</th>
<th>Role</th>
<th>Status</th>
<th>Action</th>

</tr>

</thead>

<tbody id="userTableBody">

`;

        if (users.length === 0) {

            html += `

<tr>

<td colspan="6" style="text-align:center">

No users found.

</td>

</tr>

`;

        } else {

            users.forEach((user, index) => {

                html += `

<tr>

<td>${user.userId || user.id}</td>

<td>${user.name}</td>

<td>${user.username}</td>

<td>${user.role}</td>

<td>${user.status}</td>

<td>

<button class="btn"
onclick="ViewUser.show(${index})">

View

</button>

<button class="btn"
onclick="EditUser.edit(${index})">

Edit

</button>

<button class="btn btn-danger"
onclick="DeleteUser.remove(${index})">

Delete

</button>

</td>

</tr>

`;

            });

        }

        html += `

</tbody>

</table>

</div>

`;

        document.getElementById(
            "usersContent"
        ).innerHTML = html;

    },

    search() {

        const keyword =
            document.getElementById("userSearch")
            .value
            .toLowerCase();

        const rows =
            document.querySelectorAll(
                "#userTableBody tr"
            );

        rows.forEach(row => {

            row.style.display =
                row.innerText.toLowerCase().includes(keyword)
                ? ""
                : "none";

        });

    }

};

/* ===== assets/js/users/viewUser.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/users/viewUser.js
 Version : 2.0.0
==================================================*/

const ViewUser = {

    show(index) {

        const storageKey =
            CONFIG.STORAGE.USERS || "users";

        const users = Database.getAll(storageKey);

        const user = users[index];

        if (!user) {

            alert("User not found.");

            return;

        }

        document.getElementById("usersContent").innerHTML = `

<div class="card">

<h2>👤 User Profile</h2>

<table class="table">

<tr>
<th width="220">User ID</th>
<td>${user.userId || user.id}</td>
</tr>

<tr>
<th>Full Name</th>
<td>${user.name}</td>
</tr>

<tr>
<th>Username</th>
<td>${user.username}</td>
</tr>

<tr>
<th>Role</th>
<td>${user.role}</td>
</tr>

<tr>
<th>Mobile</th>
<td>${user.mobile || "-"}</td>
</tr>

<tr>
<th>Email</th>
<td>${user.email || "-"}</td>
</tr>

<tr>
<th>Status</th>
<td>${user.status}</td>
</tr>

<tr>
<th>Created On</th>
<td>${user.createdAt || "-"}</td>
</tr>

</table>

<br>

<button class="btn"
onclick="EditUser.edit(${index})">

✏ Edit

</button>

<button class="btn btn-danger"
onclick="DeleteUser.remove(${index})">

🗑 Delete

</button>

<button class="btn"
onclick="ResetPassword.show(${index})">

🔑 Reset Password

</button>

<button class="btn"
onclick="UserPrint.print(${index})">

🖨 Print

</button>

<button class="btn"
onclick="UserRegister.render()">

⬅ Back

</button>

</div>

`;

    }

};

/* ===== assets/js/users/editUser.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/users/editUser.js
 Version : 2.0.0
==================================================*/

const EditUser = {

    edit(index) {

        const storageKey =
            CONFIG.STORAGE.USERS || "users";

        const users = Database.getAll(storageKey);

        const user = users[index];

        if (!user) {

            alert("User not found.");

            return;

        }

        document.getElementById("usersContent").innerHTML = `

<div class="card">

<h2>✏ Edit User</h2>

<div class="form-grid">

<div class="form-group">
<label>Full Name</label>
<input type="text" id="editUserName" value="${user.name}">
</div>

<div class="form-group">
<label>Username</label>
<input type="text" id="editUsername" value="${user.username}">
</div>

<div class="form-group">
<label>Role</label>
<select id="editRole">

<option ${user.role==="Administrator"?"selected":""}>Administrator</option>

<option ${user.role==="Principal"?"selected":""}>Principal</option>

<option ${user.role==="Teacher"?"selected":""}>Teacher</option>

<option ${user.role==="Accountant"?"selected":""}>Accountant</option>

<option ${user.role==="Librarian"?"selected":""}>Librarian</option>

<option ${user.role==="Reception"?"selected":""}>Reception</option>

<option ${user.role==="Office Staff"?"selected":""}>Office Staff</option>

</select>

</div>

<div class="form-group">
<label>Mobile</label>
<input type="text" id="editMobile" value="${user.mobile || ""}">
</div>

<div class="form-group">
<label>Email</label>
<input type="email" id="editEmail" value="${user.email || ""}">
</div>

<div class="form-group">
<label>Status</label>

<select id="editStatus">

<option value="Active"
${user.status==="Active"?"selected":""}>

Active

</option>

<option value="Inactive"
${user.status==="Inactive"?"selected":""}>

Inactive

</option>

</select>

</div>

</div>

<br>

<button class="btn"
onclick="EditUser.update(${index})">

💾 Update

</button>

<button class="btn"
onclick="UserRegister.render()">

❌ Cancel

</button>

</div>

`;

    },

    update(index) {

        const storageKey =
            CONFIG.STORAGE.USERS || "users";

        let users =
            Database.getAll(storageKey);

        const username =
            document.getElementById("editUsername")
            .value
            .trim();

        const duplicate = users.some((u, i) =>
            i !== index &&
            u.username.toLowerCase() ===
            username.toLowerCase()
        );

        if (duplicate) {

            alert("Username already exists.");

            return;

        }

        users[index].name =
            document.getElementById("editUserName")
            .value
            .trim();

        users[index].username = username;

        users[index].role =
            document.getElementById("editRole")
            .value;

        users[index].mobile =
            document.getElementById("editMobile")
            .value
            .trim();

        users[index].email =
            document.getElementById("editEmail")
            .value
            .trim();

        users[index].status =
            document.getElementById("editStatus")
            .value;

        users[index].updatedAt =
            new Date().toISOString();

        Database.saveAll(storageKey, users);

        if (typeof addAuditLog === "function") {

            addAuditLog(
                "Users",
                "Edit User",
                users[index].username
            );

        }

        alert("User updated successfully.");

        UserRegister.render();

    }

};

/* ===== assets/js/users/deleteUser.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/users/deleteUser.js
 Version : 2.0.0
==================================================*/

const DeleteUser = {

    remove(index) {

        const storageKey =
            CONFIG.STORAGE.USERS || "users";

        let users = Database.getAll(storageKey);

        const user = users[index];

        if (!user) {

            alert("User not found.");

            return;

        }

        /* Protect Administrator */
if (user.username.toLowerCase() === "admin") {

    alert("Default Administrator account cannot be deleted.");
    return;

}

        const confirmDelete = confirm(

            "Delete user?\n\n" +

            "Name : " + user.name + "\n" +

            "Username : " + user.username

        );

        if (!confirmDelete) {

            return;

        }

        users.splice(index, 1);

        Database.saveAll(storageKey, users);

        if (typeof addAuditLog === "function") {

            addAuditLog(

                "Users",

                "Delete User",

                user.username

            );

        }

        alert("User deleted successfully.");

        UserRegister.render();

    }

};

/* ===== assets/js/users/roles.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/users/roles.js
 Version : 2.0.0
==================================================*/

const Roles = {

    render() {

        const roles = [

            {
                name: "Administrator",
                description: "Full access to all modules"
            },

            {
                name: "Principal",
                description: "Academic & administrative control"
            },

            {
                name: "Teacher",
                description: "Students, Attendance, Notices, Results"
            },

            {
                name: "Accountant",
                description: "Fees, Donations & Accounts"
            },

            {
                name: "Librarian",
                description: "Library Management"
            },

            {
                name: "Reception",
                description: "Admissions & Enquiries"
            },

            {
                name: "Office Staff",
                description: "General Office Work"
            }

        ];

        let html = `

<div class="card">

<h2>🛡 User Roles</h2>

<table class="table">

<thead>

<tr>

<th>#</th>
<th>Role</th>
<th>Description</th>

</tr>

</thead>

<tbody>

`;

        roles.forEach((role, index) => {

            html += `

<tr>

<td>${index + 1}</td>

<td>${role.name}</td>

<td>${role.description}</td>

</tr>

`;

        });

        html += `

</tbody>

</table>

<br>

<button class="btn"
onclick="Roles.newRole()">

➕ Add Custom Role

</button>

<button class="btn"
onclick="Users.render()">

⬅ Back

</button>

</div>

<div id="roleContent"></div>

`;

        document.getElementById("usersContent").innerHTML = html;

    },

    newRole() {

        document.getElementById("roleContent").innerHTML = `

<div class="card">

<h3>Create Custom Role</h3>

<div class="form-group">

<label>Role Name</label>

<input
type="text"
id="customRoleName"
placeholder="Enter Role Name">

</div>

<div class="form-group">

<label>Description</label>

<textarea
id="customRoleDescription"
placeholder="Role Description"></textarea>

</div>

<button
class="btn"
onclick="Roles.saveRole()">

💾 Save Role

</button>

</div>

`;

    },

    saveRole() {

        const storageKey =
            CONFIG.STORAGE.ROLES || "roles";

        let roles =
            Database.getAll(storageKey);

        const roleName =
            document.getElementById("customRoleName")
            .value
            .trim();

        const description =
            document.getElementById("customRoleDescription")
            .value
            .trim();

        if (roleName === "") {

            alert("Please enter Role Name.");

            return;

        }

        roles.push({

            id: "ROLE" + Date.now(),

            role: roleName,

            description: description,

            createdAt: new Date().toISOString()

        });

        Database.saveAll(storageKey, roles);

        if (typeof addAuditLog === "function") {

            addAuditLog(
                "Users",
                "Create Role",
                roleName
            );

        }

        alert("Role created successfully.");

        Roles.render();

    }

};

/* ===== assets/js/users/permissions.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/users/permissions.js
 Version : 2.0.0
==================================================*/

const Permissions = {

    modules: [

        "Dashboard",
        "Students",
        "Teachers",
        "Attendance",
        "Welfare",
        "Library",
        "Inventory",
        "Exams",
        "Results",
        "Certificates",
        "Reports",
        "Notifications",
        "Settings",
        "Users"

    ],

    actions: [

        "View",
        "Add",
        "Edit",
        "Delete",
        "Print",
        "Export"

    ],

    render() {

        const roles = [

            "Administrator",
            "Principal",
            "Teacher",
            "Accountant",
            "Librarian",
            "Reception",
            "Office Staff"

        ];

        let html = `

<div class="card">

<h2>🔐 Role Permissions</h2>

<div class="form-group">

<label>Select Role</label>

<select id="permissionRole">

`;

        roles.forEach(role => {

            html += `<option>${role}</option>`;

        });

        html += `

</select>

</div>

<table class="table">

<tr>

<th>Module</th>

<th>View</th>
<th>Add</th>
<th>Edit</th>
<th>Delete</th>
<th>Print</th>
<th>Export</th>

</tr>

`;

        this.modules.forEach((module, row) => {

            html += `<tr>`;

            html += `<td>${module}</td>`;

            this.actions.forEach((action, col) => {

                html += `

<td>

<input
type="checkbox"
id="p_${row}_${col}"
checked>

</td>

`;

            });

            html += `</tr>`;

        });

        html += `

</table>

<br>

<button
class="btn"
onclick="Permissions.save()">

💾 Save Permissions

</button>

<button
class="btn"
onclick="Users.render()">

⬅ Back

</button>

</div>

`;

        document.getElementById("usersContent").innerHTML = html;

    },

    save() {

        const storageKey =
            CONFIG.STORAGE.PERMISSIONS || "permissions";

        let data =
            Database.getAll(storageKey);

        const role =
            document.getElementById("permissionRole").value;

        const permissions = [];

        this.modules.forEach((module, row) => {

            let permission = {

                module: module

            };

            this.actions.forEach((action, col) => {

                permission[action.toLowerCase()] =
                    document.getElementById(
                        `p_${row}_${col}`
                    ).checked;

            });

            permissions.push(permission);

        });

        data = data.filter(
            item => item.role !== role
        );

        data.push({

            role: role,

            permissions: permissions,

            updatedAt: new Date().toISOString()

        });

        Database.saveAll(
            storageKey,
            data
        );

        if (typeof addAuditLog === "function") {

            addAuditLog(
                "Users",
                "Update Permissions",
                role
            );

        }

        alert("Permissions saved successfully.");

    }

};

/* ===== assets/js/users/resetPassword.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/users/resetPassword.js
 Version : 2.0.0
==================================================*/

const ResetPassword = {

    show(index) {

        const users = Database.getAll(
            CONFIG.STORAGE.USERS || "users"
        );

        const user = users[index];

        if (!user) {

            alert("User not found.");

            return;

        }

        document.getElementById("usersContent").innerHTML = `

<div class="card">

<h2>🔑 Reset Password</h2>

<table class="table">

<tr>
<th width="200">User ID</th>
<td>${user.id}</td>
</tr>

<tr>
<th>Name</th>
<td>${user.name}</td>
</tr>

<tr>
<th>Username</th>
<td>${user.username}</td>
</tr>

<tr>
<th>Role</th>
<td>${user.role}</td>
</tr>

</table>

<br>

<div class="form-group">

<label>New Password</label>

<input
type="password"
id="newPassword">

</div>

<div class="form-group">

<label>Confirm Password</label>

<input
type="password"
id="confirmPassword">

</div>

<br>

<button
class="btn"
onclick="ResetPassword.save(${index})">

💾 Reset Password

</button>

<button
class="btn"
onclick="ViewUser.show(${index})">

⬅ Back

</button>

</div>

`;

    },

    render() {

        UserRegister.render();

    },

    save(index) {

        const storageKey =
            CONFIG.STORAGE.USERS || "users";

        let users =
            Database.getAll(storageKey);

        const password =
            document.getElementById("newPassword")
            .value;

        const confirm =
            document.getElementById("confirmPassword")
            .value;

        if (password.length < 6) {

            alert(
                "Password must be at least 6 characters."
            );

            return;

        }

        if (password !== confirm) {

            alert(
                "Passwords do not match."
            );

            return;

        }

        users[index].password = password;

        users[index].passwordChangedOn =
            new Date().toISOString();

        Database.saveAll(
            storageKey,
            users
        );

        if (typeof addAuditLog === "function") {

            addAuditLog(
                "Users",
                "Reset Password",
                users[index].username
            );

        }

        alert(
            "Password reset successfully."
        );

        ViewUser.show(index);

    }

};

/* ===== assets/js/users/activityLog.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/users/activityLog.js
 Version : 2.0.0
==================================================*/

const ActivityLog = {

    render() {

        const storageKey =
            CONFIG.STORAGE.AUDIT_LOG || "auditLog";

        const logs =
            Database.getAll(storageKey);

        let html = `

<div class="card">

<h2>📜 User Activity Log</h2>

<input
type="text"
id="activitySearch"
class="input"
placeholder="Search Activity..."
onkeyup="ActivityLog.search()">

<br><br>

<table class="table">

<thead>

<tr>

<th>Date & Time</th>
<th>Module</th>
<th>Action</th>
<th>Details</th>

</tr>

</thead>

<tbody id="activityTableBody">

`;

        if (logs.length === 0) {

            html += `

<tr>

<td colspan="4" style="text-align:center">

No activity found.

</td>

</tr>

`;

        } else {

            logs.slice().reverse().forEach(log => {

                html += `

<tr>

<td>${log.date || log.createdAt || "-"}</td>

<td>${log.module || "-"}</td>

<td>${log.action || "-"}</td>

<td>${log.details || log.description || "-"}</td>

</tr>

`;

            });

        }

        html += `

</tbody>

</table>

<br>

<button
class="btn"
onclick="ActivityLog.clear()">

🗑 Clear Log

</button>

<button
class="btn"
onclick="Users.render()">

⬅ Back

</button>

</div>

`;

        document.getElementById("usersContent").innerHTML = html;

    },

    search() {

        const keyword =
            document
            .getElementById("activitySearch")
            .value
            .toLowerCase();

        const rows =
            document.querySelectorAll(
                "#activityTableBody tr"
            );

        rows.forEach(row => {

            row.style.display =
                row.innerText
                    .toLowerCase()
                    .includes(keyword)
                    ? ""
                    : "none";

        });

    },

    clear() {

        if (!confirm(
            "Clear all activity logs?"
        )) {

            return;

        }

        Database.saveAll(
            CONFIG.STORAGE.AUDIT_LOG || "auditLog",
            []
        );

        if (typeof addAuditLog === "function") {

            addAuditLog(
                "Users",
                "Clear Activity Log",
                "All activity logs deleted"
            );

        }

        alert("Activity log cleared successfully.");

        this.render();

    }

};

/* ===== assets/js/users/print.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/users/print.js
 Version : 2.0.0
==================================================*/

const UserPrint = {

    print(index = null) {

        const users = Database.getAll(
            CONFIG.STORAGE.USERS || "users"
        );

        let printUsers = [];

        if (index === null) {

            printUsers = users;

        } else {

            if (!users[index]) {

                alert("User not found.");

                return;

            }

            printUsers.push(users[index]);

        }

        let html = `

<!DOCTYPE html>

<html>

<head>

<title>User Report</title>

<style>

body{
font-family:Arial,sans-serif;
margin:20px;
color:#000;
}

h1,h2,h3{
text-align:center;
margin:4px;
}

table{
width:100%;
border-collapse:collapse;
margin-top:20px;
}

table,th,td{
border:1px solid #000;
}

th,td{
padding:8px;
font-size:14px;
text-align:left;
}

.footer{
margin-top:40px;
display:flex;
justify-content:space-between;
}

</style>

</head>

<body>

<h1>Sewangan Vidyapeeth</h1>

<h2>User Management Report</h2>

<h3>Date : ${new Date().toLocaleDateString()}</h3>

<table>

<tr>

<th>S.No.</th>
<th>User ID</th>
<th>Name</th>
<th>Username</th>
<th>Role</th>
<th>Mobile</th>
<th>Status</th>

</tr>

`;

        printUsers.forEach((user, index) => {

            html += `

<tr>

<td>${index + 1}</td>

<td>${user.id}</td>

<td>${user.name}</td>

<td>${user.username}</td>

<td>${user.role}</td>

<td>${user.mobile || "-"}</td>

<td>${user.status}</td>

</tr>

`;

        });

        html += `

</table>

<div class="footer">

<div>

Prepared By

<br><br><br>

_____________________

</div>

<div>

Authorized Signatory

<br><br><br>

_____________________

</div>

</div>

</body>

</html>

`;

        const win = window.open("", "_blank");

        win.document.open();

        win.document.write(html);

        win.document.close();

        win.focus();

        win.print();

    }

};

/* ===== assets/js/notifications/notifications.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/notifications/notifications.js
==================================================*/

const Notifications = {

    render() {

        document.getElementById("mainContent").innerHTML = `

<div class="page">

    <div class="page-header">
        <h2>🔔 Notification Management</h2>
    </div>

    <div class="card">

        <button class="btn"
        onclick="newNotification()">

            ➕ New Notification

        </button>

        <button class="btn"
        onclick="notificationRegister()">

            📋 Notification Register

        </button>

        <button class="btn"
        onclick="announcementBoard()">

            📢 Notice Board

        </button>

        <button class="btn"
        onclick="smsCenter()">

            📱 SMS Center

        </button>

        <button class="btn"
        onclick="emailCenter()">

            📧 Email Center

        </button>

        <button class="btn"
        onclick="notificationHistory()">

            🕘 History

        </button>

        <button class="btn"
        onclick="notificationReports()">

            📊 Reports

        </button>

        <button class="btn"
        onclick="printNotificationRegister()">

            🖨 Print

        </button>

    </div>

    <div id="notificationWorkspace">

        <div class="card">

            <h3>Notification Dashboard</h3>

            <table class="table">

                <tr>
                    <td width="250"><b>Total Notifications</b></td>
                    <td id="notificationTotal">0</td>
                </tr>

                <tr>
                    <td><b>Announcements</b></td>
                    <td id="announcementTotal">0</td>
                </tr>

                <tr>
                    <td><b>SMS Notifications</b></td>
                    <td id="smsTotal">0</td>
                </tr>

                <tr>
                    <td><b>Email Notifications</b></td>
                    <td id="emailTotal">0</td>
                </tr>

                <tr>
                    <td><b>Unread Notifications</b></td>
                    <td id="unreadTotal">0</td>
                </tr>

            </table>

        </div>

    </div>

</div>

`;

        this.updateDashboard();

    },

    updateDashboard() {

        const notifications = Database.getAll(
            CONFIG.STORAGE.NOTIFICATIONS || "notifications"
        );

        const count = type =>
            notifications.filter(
                n => n.type === type
            ).length;

        document.getElementById("notificationTotal").textContent =
            notifications.length;

        document.getElementById("announcementTotal").textContent =
            count("Announcement");

        document.getElementById("smsTotal").textContent =
            count("SMS");

        document.getElementById("emailTotal").textContent =
            count("Email");

        document.getElementById("unreadTotal").textContent =
            notifications.filter(
                n => n.status === "Unread"
            ).length;

    }

};

/* ===== assets/js/notifications/newNotification.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/notifications/newNotification.js
==================================================*/

/*==========================================
 New Notification
==========================================*/

function newNotification() {

    document.getElementById("notificationWorkspace").innerHTML = `

<div class="card">

<h2>➕ Create New Notification</h2>

<table class="table">

<tr>
<td width="220">Notification Type *</td>
<td>

<select id="notificationType">

<option value="">Select Type</option>

<option value="Announcement">
Announcement
</option>

<option value="SMS">
SMS
</option>

<option value="Email">
Email
</option>

</select>

</td>
</tr>

<tr>
<td>Audience *</td>
<td>

<select id="notificationAudience">

<option value="All Students">All Students</option>

<option value="All Teachers">All Teachers</option>

<option value="All Staff">All Staff</option>

<option value="Parents">Parents</option>

<option value="Specific Class">Specific Class</option>

<option value="Custom Group">Custom Group</option>

</select>

</td>
</tr>

<tr>
<td>Class (Optional)</td>
<td>

<input
type="text"
id="notificationClass"
placeholder="Example: Class 8-A">

</td>
</tr>

<tr>
<td>Subject *</td>
<td>

<input
type="text"
id="notificationSubject"
placeholder="Notification Subject">

</td>
</tr>

<tr>
<td>Message *</td>
<td>

<textarea
id="notificationMessage"
rows="6"
placeholder="Write notification message..."></textarea>

</td>
</tr>

<tr>
<td>Priority</td>
<td>

<select id="notificationPriority">

<option value="Normal">Normal</option>

<option value="High">High</option>

<option value="Urgent">Urgent</option>

</select>

</td>
</tr>

<tr>
<td>Schedule Date</td>
<td>

<input
type="date"
id="notificationDate"
value="${Utils.currentDate()}">

</td>
</tr>

<tr>
<td>Schedule Time</td>
<td>

<input
type="time"
id="notificationTime">

</td>
</tr>

<tr>
<td>Attachment</td>
<td>

<input
type="file"
id="notificationAttachment">

</td>
</tr>

</table>

<br>

<button
class="btn"
onclick="saveNotification()">

💾 Save Notification

</button>

<button
class="btn"
onclick="Notifications.render()">

⬅ Back

</button>

</div>

`;

}

/*==========================================
 Quick Navigation
==========================================*/

function announcementBoard() {

    newNotification();

    document.getElementById(
        "notificationType"
    ).value = "Announcement";

}

function smsCenter() {

    newNotification();

    document.getElementById(
        "notificationType"
    ).value = "SMS";

}

function emailCenter() {

    newNotification();

    document.getElementById(
        "notificationType"
    ).value = "Email";

}

/* ===== assets/js/notifications/saveNotification.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/notifications/saveNotification.js
==================================================*/

/*==========================================
 Save Notification
==========================================*/

function saveNotification() {

    const type =
        document.getElementById("notificationType").value;

    const audience =
        document.getElementById("notificationAudience").value;

    const targetClass =
        document.getElementById("notificationClass").value.trim();

    const subject =
        document.getElementById("notificationSubject").value.trim();

    const message =
        document.getElementById("notificationMessage").value.trim();

    const priority =
        document.getElementById("notificationPriority").value;

    const scheduleDate =
        document.getElementById("notificationDate").value;

    const scheduleTime =
        document.getElementById("notificationTime").value;

    const attachmentInput =
        document.getElementById("notificationAttachment");

    /*==========================================
      Validation
    ==========================================*/

    if (!type) {

        Utils.message("Please select notification type.");

        return;

    }

    if (!audience) {

        Utils.message("Please select audience.");

        return;

    }

    if (!subject) {

        Utils.message("Please enter subject.");

        return;

    }

    if (!message) {

        Utils.message("Please enter notification message.");

        return;

    }

    if (!scheduleDate) {

        Utils.message("Please select schedule date.");

        return;

    }

    /*==========================================
      Attachment
    ==========================================*/

    let attachment = "";

    if (
        attachmentInput &&
        attachmentInput.files &&
        attachmentInput.files.length > 0
    ) {

        attachment = attachmentInput.files[0].name;

    }

    /*==========================================
      Notification Object
    ==========================================*/

    const notification = {

        notificationId:
            "NOT-" + Date.now(),

        type,

        audience,

        targetClass,

        subject,

        message,

        priority,

        scheduleDate,

        scheduleTime,

        attachment,

        status: "Unread",

        deliveryStatus: "Scheduled",

        createdOn:
            Utils.currentDateTime(),

        updatedOn:
            Utils.currentDateTime(),

        createdBy:
            Utils.getCurrentUser
                ? Utils.getCurrentUser()
                : "Administrator"

    };

    /*==========================================
      Save
    ==========================================*/

    Database.insert(

        CONFIG.STORAGE.NOTIFICATIONS || "notifications",

        notification

    );

    Notifications.updateDashboard();

    Utils.message(
        "Notification saved successfully."
    );

    notificationRegister();

}

/* ===== assets/js/notifications/notificationRegister.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/notifications/notificationRegister.js
==================================================*/

/*==========================================
 Notification Register
==========================================*/

function notificationRegister() {

    const notifications = Database.getAll(
        CONFIG.STORAGE.NOTIFICATIONS || "notifications"
    );

    let html = `

<div class="card">

<h2>🔔 Notification Register</h2>

<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:15px;">

<input
type="text"
id="notificationSearch"
class="search-box"
placeholder="Search Subject, Audience or Message..."
onkeyup="filterNotificationRegister()">

<select
id="notificationTypeFilter"
onchange="filterNotificationRegister()">

<option value="">All Types</option>
<option value="Announcement">Announcement</option>
<option value="SMS">SMS</option>
<option value="Email">Email</option>

</select>

<select
id="notificationStatusFilter"
onchange="filterNotificationRegister()">

<option value="">All Status</option>
<option value="Unread">Unread</option>
<option value="Read">Read</option>

</select>

</div>

<table class="table">

<thead>

<tr>

<th>Subject</th>
<th>Type</th>
<th>Audience</th>
<th>Priority</th>
<th>Schedule</th>
<th>Status</th>
<th>Delivery</th>
<th>Actions</th>

</tr>

</thead>

<tbody id="notificationTableBody">

`;

    if (notifications.length === 0) {

        html += `

<tr>

<td colspan="8" style="text-align:center">

No notifications available.

</td>

</tr>

`;

    } else {

        notifications
            .sort((a, b) =>
                new Date(b.createdOn) -
                new Date(a.createdOn)
            )
            .forEach(item => {

                html += `

<tr>

<td>${item.subject}</td>

<td>${item.type}</td>

<td>${item.audience}</td>

<td>${item.priority}</td>

<td>

${item.scheduleDate}

${item.scheduleTime || ""}

</td>

<td>

<span class="badge ${item.status==="Read"?"badge-success":"badge-warning"}">

${item.status}

</span>

</td>

<td>

${item.deliveryStatus}

</td>

<td>

<button
class="btn btn-sm"
onclick="editNotification('${item.notificationId}')">

✏

</button>

<button
class="btn btn-sm btn-danger"
onclick="deleteNotification('${item.notificationId}')">

🗑

</button>

<button
class="btn btn-sm"
onclick="markNotificationRead('${item.notificationId}')">

✓

</button>

<button
class="btn btn-sm"
onclick="printNotification('${item.notificationId}')">

🖨

</button>

</td>

</tr>

`;

            });

    }

    html += `

</tbody>

</table>

<br>

<button
class="btn"
onclick="newNotification()">

➕ New Notification

</button>

<button
class="btn"
onclick="printNotificationRegister()">

🖨 Print Register

</button>

<button
class="btn"
onclick="Notifications.render()">

⬅ Back

</button>

</div>

`;

    document.getElementById(
        "notificationWorkspace"
    ).innerHTML = html;

}

/*==========================================
 Search & Filter
==========================================*/

function filterNotificationRegister() {

    const keyword = document
        .getElementById("notificationSearch")
        .value
        .toLowerCase();

    const type = document
        .getElementById("notificationTypeFilter")
        .value
        .toLowerCase();

    const status = document
        .getElementById("notificationStatusFilter")
        .value
        .toLowerCase();

    const rows = document.querySelectorAll(
        "#notificationTableBody tr"
    );

    rows.forEach(row => {

        const text = row.innerText.toLowerCase();

        const matchKeyword =
            text.includes(keyword);

        const matchType =
            type === "" || text.includes(type);

        const matchStatus =
            status === "" || text.includes(status);

        row.style.display =
            (matchKeyword &&
             matchType &&
             matchStatus)
                ? ""
                : "none";

    });

}

/* ===== assets/js/notifications/editNotification.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/notifications/editNotification.js
==================================================*/

/*==========================================
 Edit Notification
==========================================*/

function editNotification(notificationId) {

    const notifications = Database.getAll(
        CONFIG.STORAGE.NOTIFICATIONS || "notifications"
    );

    const notification = notifications.find(
        n => n.notificationId === notificationId
    );

    if (!notification) {

        Utils.message("Notification not found.");

        return;

    }

    document.getElementById("notificationWorkspace").innerHTML = `

<div class="card">

<h2>✏ Edit Notification</h2>

<table class="table">

<tr>
<td width="220">Notification ID</td>
<td>

<input
type="text"
id="editNotificationId"
value="${notification.notificationId}"
readonly>

</td>
</tr>

<tr>
<td>Type</td>
<td>

<select id="editNotificationType">

<option value="Announcement" ${notification.type==="Announcement"?"selected":""}>Announcement</option>

<option value="SMS" ${notification.type==="SMS"?"selected":""}>SMS</option>

<option value="Email" ${notification.type==="Email"?"selected":""}>Email</option>

</select>

</td>
</tr>

<tr>
<td>Audience</td>
<td>

<input
type="text"
id="editAudience"
value="${notification.audience}">

</td>
</tr>

<tr>
<td>Target Class</td>
<td>

<input
type="text"
id="editTargetClass"
value="${notification.targetClass || ""}">

</td>
</tr>

<tr>
<td>Subject</td>
<td>

<input
type="text"
id="editSubject"
value="${notification.subject}">

</td>
</tr>

<tr>
<td>Message</td>
<td>

<textarea
id="editMessage"
rows="6">${notification.message}</textarea>

</td>
</tr>

<tr>
<td>Priority</td>
<td>

<select id="editPriority">

<option value="Normal" ${notification.priority==="Normal"?"selected":""}>Normal</option>

<option value="High" ${notification.priority==="High"?"selected":""}>High</option>

<option value="Urgent" ${notification.priority==="Urgent"?"selected":""}>Urgent</option>

</select>

</td>
</tr>

<tr>
<td>Schedule Date</td>
<td>

<input
type="date"
id="editScheduleDate"
value="${notification.scheduleDate}">

</td>
</tr>

<tr>
<td>Schedule Time</td>
<td>

<input
type="time"
id="editScheduleTime"
value="${notification.scheduleTime || ""}">

</td>
</tr>

<tr>
<td>Read Status</td>
<td>

<select id="editStatus">

<option value="Unread" ${notification.status==="Unread"?"selected":""}>Unread</option>

<option value="Read" ${notification.status==="Read"?"selected":""}>Read</option>

</select>

</td>
</tr>

<tr>
<td>Delivery Status</td>
<td>

<select id="editDeliveryStatus">

<option value="Scheduled" ${notification.deliveryStatus==="Scheduled"?"selected":""}>Scheduled</option>

<option value="Sent" ${notification.deliveryStatus==="Sent"?"selected":""}>Sent</option>

<option value="Delivered" ${notification.deliveryStatus==="Delivered"?"selected":""}>Delivered</option>

<option value="Failed" ${notification.deliveryStatus==="Failed"?"selected":""}>Failed</option>

</select>

</td>
</tr>

</table>

<br>

<button
class="btn"
onclick="updateNotification('${notification.notificationId}')">

💾 Update Notification

</button>

<button
class="btn"
onclick="notificationRegister()">

⬅ Cancel

</button>

</div>

`;

}

/*==========================================
 Update Notification
==========================================*/

function updateNotification(notificationId) {

    const notifications = Database.getAll(
        CONFIG.STORAGE.NOTIFICATIONS || "notifications"
    );

    const notification = notifications.find(
        n => n.notificationId === notificationId
    );

    if (!notification) {

        Utils.message("Notification not found.");

        return;

    }

    notification.type =
        document.getElementById("editNotificationType").value;

    notification.audience =
        document.getElementById("editAudience").value.trim();

    notification.targetClass =
        document.getElementById("editTargetClass").value.trim();

    notification.subject =
        document.getElementById("editSubject").value.trim();

    notification.message =
        document.getElementById("editMessage").value.trim();

    notification.priority =
        document.getElementById("editPriority").value;

    notification.scheduleDate =
        document.getElementById("editScheduleDate").value;

    notification.scheduleTime =
        document.getElementById("editScheduleTime").value;

    notification.status =
        document.getElementById("editStatus").value;

    notification.deliveryStatus =
        document.getElementById("editDeliveryStatus").value;

    notification.updatedOn =
        Utils.currentDateTime();

    StorageManager.save(
        CONFIG.STORAGE.NOTIFICATIONS || "notifications",
        notifications
    );

    Notifications.updateDashboard();

    Utils.message("Notification updated successfully.");

    notificationRegister();

}

/*==========================================
 Mark Notification Read
==========================================*/

function markNotificationRead(notificationId) {

    const notifications = Database.getAll(
        CONFIG.STORAGE.NOTIFICATIONS || "notifications"
    );

    const notification = notifications.find(
        n => n.notificationId === notificationId
    );

    if (!notification) return;

    notification.status = "Read";
    notification.updatedOn = Utils.currentDateTime();

    StorageManager.save(
        CONFIG.STORAGE.NOTIFICATIONS || "notifications",
        notifications
    );

    Notifications.updateDashboard();

    notificationRegister();

}

/* ===== assets/js/notifications/deleteNotification.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/notifications/deleteNotification.js
==================================================*/

/*==========================================
 Delete Notification
==========================================*/

function deleteNotification(notificationId) {

    const notifications = Database.getAll(
        CONFIG.STORAGE.NOTIFICATIONS || "notifications"
    );

    const notification = notifications.find(
        n => n.notificationId === notificationId
    );

    if (!notification) {

        Utils.message("Notification not found.");

        return;

    }

    const confirmed = confirm(

        "Delete this notification?\n\n" +

        "Subject : " + notification.subject + "\n" +

        "Type : " + notification.type + "\n" +

        "Audience : " + notification.audience + "\n\n" +

        "This action cannot be undone."

    );

    if (!confirmed) {

        return;

    }

    const updatedNotifications = notifications.filter(
        n => n.notificationId !== notificationId
    );

    StorageManager.save(

        CONFIG.STORAGE.NOTIFICATIONS || "notifications",

        updatedNotifications

    );

    Notifications.updateDashboard();

    Utils.message("Notification deleted successfully.");

    notificationRegister();

}

/*==========================================
 Delete All Notifications
(Admin Only)
==========================================*/

function deleteAllNotifications() {

    const notifications = Database.getAll(
        CONFIG.STORAGE.NOTIFICATIONS || "notifications"
    );

    if (notifications.length === 0) {

        Utils.message("No notifications available.");

        return;

    }

    const confirmed = confirm(

        "Delete ALL notifications?\n\n" +

        "This action cannot be undone."

    );

    if (!confirmed) {

        return;

    }

    StorageManager.save(

        CONFIG.STORAGE.NOTIFICATIONS || "notifications",

        []

    );

    Notifications.updateDashboard();

    Utils.message("All notifications deleted.");

    notificationRegister();

}

/*==========================================
 Archive Notification
==========================================*/

function archiveNotification(notificationId) {

    const notifications = Database.getAll(
        CONFIG.STORAGE.NOTIFICATIONS || "notifications"
    );

    const notification = notifications.find(
        n => n.notificationId === notificationId
    );

    if (!notification) {

        Utils.message("Notification not found.");

        return;

    }

    notification.archived = true;

    notification.updatedOn = Utils.currentDateTime();

    StorageManager.save(

        CONFIG.STORAGE.NOTIFICATIONS || "notifications",

        notifications

    );

    Notifications.updateDashboard();

    Utils.message("Notification archived.");

    notificationRegister();

}

/*==========================================
 Restore Notification
==========================================*/

function restoreNotification(notificationId) {

    const notifications = Database.getAll(
        CONFIG.STORAGE.NOTIFICATIONS || "notifications"
    );

    const notification = notifications.find(
        n => n.notificationId === notificationId
    );

    if (!notification) {

        Utils.message("Notification not found.");

        return;

    }

    notification.archived = false;

    notification.updatedOn = Utils.currentDateTime();

    StorageManager.save(

        CONFIG.STORAGE.NOTIFICATIONS || "notifications",

        notifications

    );

    Notifications.updateDashboard();

    Utils.message("Notification restored.");

    notificationRegister();

}

/*==========================================
 Mark All As Read
==========================================*/

function markAllNotificationsRead() {

    const notifications = Database.getAll(
        CONFIG.STORAGE.NOTIFICATIONS || "notifications"
    );

    notifications.forEach(notification => {

        notification.status = "Read";

        notification.updatedOn = Utils.currentDateTime();

    });

    StorageManager.save(

        CONFIG.STORAGE.NOTIFICATIONS || "notifications",

        notifications

    );

    Notifications.updateDashboard();

    Utils.message("All notifications marked as read.");

    notificationRegister();

}

/* ===== assets/js/notifications/reports.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/notifications/reports.js
==================================================*/

/*==========================================
 Notification Reports
==========================================*/

function notificationReports() {

    const notifications = Database.getAll(
        CONFIG.STORAGE.NOTIFICATIONS || "notifications"
    );

    const total = notifications.length;

    const unread = notifications.filter(
        n => n.status === "Unread"
    ).length;

    const read = notifications.filter(
        n => n.status === "Read"
    ).length;

    const delivered = notifications.filter(
        n => n.deliveryStatus === "Delivered"
    ).length;

    const failed = notifications.filter(
        n => n.deliveryStatus === "Failed"
    ).length;

    document.getElementById("notificationWorkspace").innerHTML = `

<div class="card">

<h2>📊 Notification Reports</h2>

<table class="table">

<tr>
<td width="250"><b>Total Notifications</b></td>
<td>${total}</td>
</tr>

<tr>
<td><b>Unread</b></td>
<td>${unread}</td>
</tr>

<tr>
<td><b>Read</b></td>
<td>${read}</td>
</tr>

<tr>
<td><b>Delivered</b></td>
<td>${delivered}</td>
</tr>

<tr>
<td><b>Failed</b></td>
<td>${failed}</td>
</tr>

</table>

<br>

<button class="btn"
onclick="notificationTypeReport()">

📑 Type-wise

</button>

<button class="btn"
onclick="notificationPriorityReport()">

⚡ Priority-wise

</button>

<button class="btn"
onclick="notificationDeliveryReport()">

📤 Delivery Status

</button>

<button class="btn"
onclick="notificationDateReport()">

📅 Date-wise

</button>

<button class="btn"
onclick="exportNotificationCSV()">

📥 Export CSV

</button>

<button class="btn"
onclick="Notifications.render()">

⬅ Back

</button>

</div>

`;

}

/*==========================================
 Type-wise Report
==========================================*/

function notificationTypeReport() {

    generateNotificationSummary(
        "Notification Type Report",
        "type"
    );

}

/*==========================================
 Priority-wise Report
==========================================*/

function notificationPriorityReport() {

    generateNotificationSummary(
        "Priority Report",
        "priority"
    );

}

/*==========================================
 Delivery Status Report
==========================================*/

function notificationDeliveryReport() {

    generateNotificationSummary(
        "Delivery Status Report",
        "deliveryStatus"
    );

}

/*==========================================
 Date-wise Report
==========================================*/

function notificationDateReport() {

    generateNotificationSummary(
        "Date-wise Report",
        "scheduleDate"
    );

}

/*==========================================
 Generic Summary Generator
==========================================*/

function generateNotificationSummary(title, field) {

    const notifications = Database.getAll(
        CONFIG.STORAGE.NOTIFICATIONS || "notifications"
    );

    const report = {};

    notifications.forEach(item => {

        const key = item[field] || "N/A";

        report[key] = (report[key] || 0) + 1;

    });

    let html = `

<div class="card">

<h2>${title}</h2>

<table class="table">

<tr>

<th>${field}</th>

<th>Total</th>

</tr>

`;

    Object.keys(report).sort().forEach(key => {

        html += `

<tr>

<td>${key}</td>

<td>${report[key]}</td>

</tr>

`;

    });

    html += `

</table>

<br>

<button
class="btn"
onclick="notificationReports()">

⬅ Back

</button>

</div>

`;

    document.getElementById(
        "notificationWorkspace"
    ).innerHTML = html;

}

/*==========================================
 Export CSV
==========================================*/

function exportNotificationCSV() {

    const notifications = Database.getAll(
        CONFIG.STORAGE.NOTIFICATIONS || "notifications"
    );

    if (notifications.length === 0) {

        Utils.message("No notification records available.");

        return;

    }

    let csv =
"ID,Type,Subject,Audience,Priority,Schedule Date,Schedule Time,Status,Delivery Status\n";

    notifications.forEach(item => {

        csv += [

            item.notificationId,
            item.type,
            `"${item.subject}"`,
            item.audience,
            item.priority,
            item.scheduleDate,
            item.scheduleTime || "",
            item.status,
            item.deliveryStatus

        ].join(",") + "\n";

    });

    const blob = new Blob(
        [csv],
        { type: "text/csv" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "notification_report.csv";
    link.click();

    URL.revokeObjectURL(url);

    Utils.message(
        "Notification report exported successfully."
    );

}

/* ===== assets/js/notifications/print.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/notifications/print.js
==================================================*/

/*==========================================
 Print Window
==========================================*/

function notificationPrintWindow(title, content) {

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8">

<title>${title}</title>

<style>

body{
font-family:Arial,sans-serif;
margin:30px;
font-size:14px;
line-height:1.6;
}

.header{
text-align:center;
margin-bottom:20px;
}

.header img{
height:70px;
}

.header h2{
margin:8px 0 4px;
}

.header p{
margin:2px;
font-size:13px;
}

.title{
text-align:center;
font-size:20px;
font-weight:bold;
text-decoration:underline;
margin:20px 0;
}

table{
width:100%;
border-collapse:collapse;
margin-top:15px;
}

th,td{
border:1px solid #000;
padding:6px;
}

th{
background:#f2f2f2;
}

.footer{
margin-top:40px;
display:flex;
justify-content:space-between;
}

.footer div{
width:180px;
text-align:center;
}

</style>

</head>

<body>

<div class="header">

<img src="assets/images/logo.png">

<h2>${CONFIG.SCHOOL_NAME}</h2>

<p>${CONFIG.SCHOOL_ADDRESS || ""}</p>

<p>${CONFIG.SCHOOL_PHONE || ""}</p>

</div>

<div class="title">

${title}

</div>

${content}

<div class="footer">

<div>

_____________________<br>

Prepared By

</div>

<div>

_____________________<br>

Principal

</div>

</div>

</body>

</html>
`);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();

}

/*==========================================
 Print Individual Notification
==========================================*/

function printNotification(notificationId) {

    const notifications = Database.getAll(
        CONFIG.STORAGE.NOTIFICATIONS || "notifications"
    );

    const item = notifications.find(
        n => n.notificationId === notificationId
    );

    if (!item) {

        Utils.message("Notification not found.");

        return;

    }

    const html = `

<p><strong>Subject:</strong> ${item.subject}</p>

<p><strong>Type:</strong> ${item.type}</p>

<p><strong>Audience:</strong> ${item.audience}</p>

<p><strong>Priority:</strong> ${item.priority}</p>

<p><strong>Schedule:</strong>
${item.scheduleDate}
${item.scheduleTime || ""}
</p>

<p><strong>Status:</strong> ${item.status}</p>

<p><strong>Delivery:</strong>
${item.deliveryStatus}
</p>

<hr>

<p>${item.message}</p>

`;

    notificationPrintWindow(
        "Notification",
        html
    );

}

/*==========================================
 Print Notification Register
==========================================*/

function printNotificationRegister() {

    const notifications = Database.getAll(
        CONFIG.STORAGE.NOTIFICATIONS || "notifications"
    );

    let table = `

<table>

<tr>

<th>#</th>
<th>Subject</th>
<th>Type</th>
<th>Audience</th>
<th>Priority</th>
<th>Status</th>

</tr>

`;

    notifications.forEach((item,index)=>{

        table += `

<tr>

<td>${index+1}</td>

<td>${item.subject}</td>

<td>${item.type}</td>

<td>${item.audience}</td>

<td>${item.priority}</td>

<td>${item.status}</td>

</tr>

`;

    });

    table += "</table>";

    notificationPrintWindow(
        "Notification Register",
        table
    );

}

/*==========================================
 Print Notice Board
==========================================*/

function printNoticeBoard() {

    const announcements = Database.getAll(
        CONFIG.STORAGE.NOTIFICATIONS || "notifications"
    ).filter(item => item.type === "Announcement");

    let html = "";

    announcements.forEach(item => {

        html += `

<div style="margin-bottom:25px;">

<h3>${item.subject}</h3>

<p>

<strong>Date:</strong>

${item.scheduleDate}

</p>

<p>

${item.message}

</p>

<hr>

</div>

`;

    });

    notificationPrintWindow(
        "Notice Board",
        html
    );

}

/*==========================================
 Print Summary Report
==========================================*/

function printNotificationSummary() {

    const notifications = Database.getAll(
        CONFIG.STORAGE.NOTIFICATIONS || "notifications"
    );

    const total = notifications.length;
    const unread = notifications.filter(n => n.status === "Unread").length;
    const read = notifications.filter(n => n.status === "Read").length;
    const delivered = notifications.filter(n => n.deliveryStatus === "Delivered").length;
    const failed = notifications.filter(n => n.deliveryStatus === "Failed").length;

    const html = `

<table>

<tr><th>Metric</th><th>Total</th></tr>

<tr><td>Total Notifications</td><td>${total}</td></tr>

<tr><td>Unread</td><td>${unread}</td></tr>

<tr><td>Read</td><td>${read}</td></tr>

<tr><td>Delivered</td><td>${delivered}</td></tr>

<tr><td>Failed</td><td>${failed}</td></tr>

</table>

`;

    notificationPrintWindow(
        "Notification Summary Report",
        html
    );

}