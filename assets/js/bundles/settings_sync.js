
/* ===== assets/js/settings/settings.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/settings/settings.js
==================================================*/

const Settings = {

    render() {

        document.getElementById("mainContent").innerHTML = `

<div class="page">

    <div class="page-header">

        <h2>⚙️ System Settings</h2>

    </div>

    <div class="card">

        <button class="btn" onclick="schoolSettings()">
            🏫 School Profile
        </button>

        <button class="btn" onclick="sessionSettings()">
            📅 Academic Session
        </button>

        <button class="btn" onclick="userRoleSettings()">
            👥 Users & Roles
        </button>

        <button class="btn" onclick="backupSettings()">
            💾 Backup & Restore
        </button>

        <button class="btn" onclick="systemPreferences()">
            ⚙️ Preferences
        </button>

        <button class="btn" onclick="securitySettings()">
            🔒 Security
        </button>

    </div>

    <div id="settingsWorkspace">

        <div class="card">

            <h3>System Information</h3>

            <table class="table">

                <tr>
                    <td width="250"><b>Application</b></td>
                    <td>SVMS Professional</td>
                </tr>

                <tr>
                    <td><b>Version</b></td>
                    <td>1.0.0</td>
                </tr>

                <tr>
                    <td><b>Academic Session</b></td>
                    <td>${CONFIG.CURRENT_SESSION}</td>
                </tr>

                <tr>
                    <td><b>School Name</b></td>
                    <td>${CONFIG.SCHOOL_NAME}</td>
                </tr>

                <tr>
                    <td><b>Database</b></td>
                    <td>Browser Local Storage</td>
                </tr>

            </table>

        </div>

    </div>

</div>

`;

    }

};

/* ===== assets/js/settings/schoolSettings.js ===== */
﻿
/*==================================================
 SVMS Professional
 File : assets/js/settings/schoolSettings.js
==================================================*/

/*==========================================
 School Profile Settings
==========================================*/

function schoolSettings() {

    document.getElementById("settingsWorkspace").innerHTML = `

<div class="card">

<h2>🏫 School Profile</h2>

<table class="table">

<tr>
<td width="220">School Name</td>
<td>
<input
type="text"
id="schoolName"
value="${CONFIG.SCHOOL_NAME || ""}">
</td>
</tr>

<tr>
<td>School Code</td>
<td>
<input
type="text"
id="schoolCode"
value="${CONFIG.SCHOOL_CODE || ""}">
</td>
</tr>

<tr>
<td>Affiliation No.</td>
<td>
<input
type="text"
id="schoolAffiliation"
value="${CONFIG.SCHOOL_AFFILIATION || ""}">
</td>
</tr>

<tr>
<td>Academic Session</td>
<td>
<input
type="text"
id="schoolSession"
value="${CONFIG.CURRENT_SESSION || ""}">
</td>
</tr>

<tr>
<td>Principal</td>
<td>
<input
type="text"
id="principalName"
value="${CONFIG.PRINCIPAL_NAME || ""}">
</td>
</tr>

<tr>
<td>Address</td>
<td>
<textarea
id="schoolAddress"
rows="3">${CONFIG.SCHOOL_ADDRESS || ""}</textarea>
</td>
</tr>

<tr>
<td>City</td>
<td>
<input
type="text"
id="schoolCity"
value="${CONFIG.SCHOOL_CITY || ""}">
</td>
</tr>

<tr>
<td>State</td>
<td>
<input
type="text"
id="schoolState"
value="${CONFIG.SCHOOL_STATE || ""}">
</td>
</tr>

<tr>
<td>Pincode</td>
<td>
<input
type="text"
id="schoolPincode"
value="${CONFIG.SCHOOL_PINCODE || ""}">
</td>
</tr>

<tr>
<td>Phone</td>
<td>
<input
type="text"
id="schoolPhone"
value="${CONFIG.SCHOOL_PHONE || ""}">
</td>
</tr>

<tr>
<td>Email</td>
<td>
<input
type="email"
id="schoolEmail"
value="${CONFIG.SCHOOL_EMAIL || ""}">
</td>
</tr>

<tr>
<td>Website</td>
<td>
<input
type="url"
id="schoolWebsite"
value="${CONFIG.SCHOOL_WEBSITE || ""}">
</td>
</tr>

<tr>
<td>Logo</td>
<td>
<input
type="file"
id="schoolLogo"
accept="image/*">
</td>
</tr>

</table>

<br>

<button
class="btn"
onclick="saveSchoolSettings()">

💾 Save Settings

</button>

<button
class="btn"
onclick="Settings.render()">

⬅ Back

</button>

</div>

`;

}

/*==========================================
 Save School Settings
==========================================*/

function saveSchoolSettings() {

    const settings = {

        schoolName:
            document.getElementById("schoolName").value.trim(),

        schoolCode:
            document.getElementById("schoolCode").value.trim(),

        affiliation:
            document.getElementById("schoolAffiliation").value.trim(),

        session:
            document.getElementById("schoolSession").value.trim(),

        principal:
            document.getElementById("principalName").value.trim(),

        address:
            document.getElementById("schoolAddress").value.trim(),

        city:
            document.getElementById("schoolCity").value.trim(),

        state:
            document.getElementById("schoolState").value.trim(),

        pincode:
            document.getElementById("schoolPincode").value.trim(),

        phone:
            document.getElementById("schoolPhone").value.trim(),

        email:
            document.getElementById("schoolEmail").value.trim(),

        website:
            document.getElementById("schoolWebsite").value.trim(),

        updatedOn:
            Utils.currentDateTime()

    };

    StorageManager.save(
        "schoolSettings",
        settings
    );

    Utils.message(
        "School settings saved successfully."
    );

}

/* ===== assets/js/settings/userRoles.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/settings/userRoles.js
==================================================*/

/*==========================================
 User & Role Management
==========================================*/

function userRoleSettings() {

    const users = Database.getAll(
        CONFIG.STORAGE.USERS || "users"
    );

    let html = `

<div class="card">

<h2>👥 User & Role Management</h2>

<div style="margin-bottom:15px;">

<button
class="btn"
onclick="newUser()">

➕ New User

</button>

<button
class="btn"
onclick="printUsers()">

🖨 Print

</button>

</div>

<table class="table">

<thead>

<tr>

<th>Username</th>
<th>Name</th>
<th>Role</th>
<th>Status</th>
<th>Actions</th>

</tr>

</thead>

<tbody>

`;

    if (users.length === 0) {

        html += `

<tr>

<td colspan="5" style="text-align:center">

No users found.

</td>

</tr>

`;

    } else {

        users.forEach(user => {

            html += `

<tr>

<td>${user.username}</td>

<td>${user.fullName}</td>

<td>${user.role}</td>

<td>${user.status}</td>

<td>

<button
class="btn btn-sm"
onclick="editUser('${user.userId}')">

✏

</button>

<button
class="btn btn-sm btn-danger"
onclick="deleteUser('${user.userId}')">

🗑

</button>

<button
class="btn btn-sm"
onclick="resetPassword('${user.userId}')">

🔑

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
        "settingsWorkspace"
    ).innerHTML = html;

}

/*==========================================
 New User
==========================================*/

function newUser() {

    document.getElementById(
        "settingsWorkspace"
    ).innerHTML = `

<div class="card">

<h2>➕ Create User</h2>

<table class="table">

<tr>
<td width="220">Full Name</td>
<td><input type="text" id="userFullName"></td>
</tr>

<tr>
<td>Username</td>
<td><input type="text" id="userUsername"></td>
</tr>

<tr>
<td>Password</td>
<td><input type="password" id="userPassword"></td>
</tr>

<tr>
<td>Role</td>
<td>

<select id="userRole">

<option>Administrator</option>
<option>Principal</option>
<option>Teacher</option>
<option>Accountant</option>
<option>Librarian</option>
<option>Receptionist</option>

</select>

</td>
</tr>

</table>

<br>

<button
class="btn"
onclick="saveUser()">

💾 Save User

</button>

<button
class="btn"
onclick="userRoleSettings()">

⬅ Back

</button>

</div>

`;

}

/*==========================================
 Save User
==========================================*/

function saveUser() {

    const user = {

        userId:
            "USR-" + Date.now(),

        fullName:
            document.getElementById(
                "userFullName"
            ).value.trim(),

        username:
            document.getElementById(
                "userUsername"
            ).value.trim(),

        password:
            document.getElementById(
                "userPassword"
            ).value,

        role:
            document.getElementById(
                "userRole"
            ).value,

        status:
            "Active",

        createdOn:
            Utils.currentDateTime()

    };

    Database.insert(

        CONFIG.STORAGE.USERS || "users",

        user

    );

    Utils.message("User created successfully.");

    userRoleSettings();

}

/*==========================================
 Placeholder Functions
==========================================*/

function editUser(index) {
    EditUser.edit(index);
}

function deleteUser(index) {
    DeleteUser.remove(index);
}

function resetPassword(index) {
    ResetPassword.show(index);
}

function printUsers() {

    window.print();

}

/* ===== assets/js/settings/sessionSettings.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/settings/sessionSettings.js
==================================================*/

/*==========================================
 Academic Session Settings
==========================================*/

function sessionSettings() {

    const sessions = Database.getAll(
        CONFIG.STORAGE.SESSIONS || "sessions"
    );

    let html = `

<div class="card">

<h2>📅 Academic Session Management</h2>

<div style="margin-bottom:15px;">

<button
class="btn"
onclick="newAcademicSession()">

➕ New Session

</button>

<button
class="btn"
onclick="Settings.render()">

⬅ Back

</button>

</div>

<table class="table">

<thead>

<tr>

<th>Session</th>
<th>Start Date</th>
<th>End Date</th>
<th>Current</th>
<th>Status</th>
<th>Actions</th>

</tr>

</thead>

<tbody>

`;

    if (sessions.length === 0) {

        html += `

<tr>

<td colspan="6" style="text-align:center;">

No academic sessions found.

</td>

</tr>

`;

    } else {

        sessions.forEach(session => {

            html += `

<tr>

<td>${session.name}</td>

<td>${session.startDate}</td>

<td>${session.endDate}</td>

<td>${session.current ? "✅" : ""}</td>

<td>${session.status}</td>

<td>

<button
class="btn btn-sm"
onclick="setCurrentSession('${session.sessionId}')">

⭐ Set Current

</button>

<button
class="btn btn-sm"
onclick="editAcademicSession('${session.sessionId}')">

✏ Edit

</button>

<button
class="btn btn-sm btn-danger"
onclick="deleteAcademicSession('${session.sessionId}')">

🗑 Delete

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
        "settingsWorkspace"
    ).innerHTML = html;

}

/*==========================================
 New Academic Session
==========================================*/

function newAcademicSession() {

    document.getElementById(
        "settingsWorkspace"
    ).innerHTML = `

<div class="card">

<h2>➕ New Academic Session</h2>

<table class="table">

<tr>
<td width="220">Session Name</td>
<td>
<input
type="text"
id="sessionName"
placeholder="2026-2027">
</td>
</tr>

<tr>
<td>Start Date</td>
<td>
<input
type="date"
id="sessionStart">
</td>
</tr>

<tr>
<td>End Date</td>
<td>
<input
type="date"
id="sessionEnd">
</td>
</tr>

<tr>
<td>Status</td>
<td>

<select id="sessionStatus">

<option value="Active">Active</option>

<option value="Closed">Closed</option>

</select>

</td>
</tr>

</table>

<br>

<button
class="btn"
onclick="saveAcademicSession()">

💾 Save Session

</button>

<button
class="btn"
onclick="sessionSettings()">

⬅ Cancel

</button>

</div>

`;

}

/*==========================================
 Save Academic Session
==========================================*/

function saveAcademicSession() {

    const session = {

        sessionId:
            "SES-" + Date.now(),

        name:
            document.getElementById("sessionName").value.trim(),

        startDate:
            document.getElementById("sessionStart").value,

        endDate:
            document.getElementById("sessionEnd").value,

        status:
            document.getElementById("sessionStatus").value,

        current: false,

        createdOn:
            Utils.currentDateTime()

    };

    Database.insert(
        CONFIG.STORAGE.SESSIONS || "sessions",
        session
    );

    Utils.message("Academic session created successfully.");

    sessionSettings();

}

/*==========================================
 Set Current Session
==========================================*/

function setCurrentSession(sessionId) {

    const sessions = Database.getAll(
        CONFIG.STORAGE.SESSIONS || "sessions"
    );

    sessions.forEach(session => {

        session.current =
            session.sessionId === sessionId;

    });

    StorageManager.save(
        CONFIG.STORAGE.SESSIONS || "sessions",
        sessions
    );

    Utils.message("Current session updated.");

    sessionSettings();

}

/*==========================================
 Placeholder Functions
==========================================*/

function editAcademicSession(sessionId) {

    Utils.message(
        "Edit Academic Session: " + sessionId
    );

}

function deleteAcademicSession(sessionId) {

    Utils.message(
        "Delete Academic Session: " + sessionId
    );

}

/* ===== assets/js/settings/backupRestore.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/settings/backupRestore.js
==================================================*/

/*==========================================
 Backup & Restore
==========================================*/

function backupSettings() {

    document.getElementById("settingsWorkspace").innerHTML = `

<div class="card">

<h2>💾 Backup & Restore</h2>

<p>
Create backups of the entire SVMS database or restore
from a previously exported backup file.
</p>

<div style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap;">

<button
class="btn"
onclick="exportDatabaseBackup()">

📤 Export Backup

</button>

<button
class="btn"
onclick="document.getElementById('restoreBackupFile').click()">

📥 Restore Backup

</button>

<button
class="btn btn-danger"
onclick="resetDatabase()">

🗑 Reset Database

</button>

<button
class="btn"
onclick="Settings.render()">

⬅ Back

</button>

</div>

<input
type="file"
id="restoreBackupFile"
accept=".json"
style="display:none"
onchange="restoreDatabase(event)">

<br><br>

<div class="card">

<h3>Backup Information</h3>

<table class="table">

<tr>
<td width="220"><b>Backup Format</b></td>
<td>JSON</td>
</tr>

<tr>
<td><b>Includes</b></td>
<td>All Local Storage Records</td>
</tr>

<tr>
<td><b>Restore Mode</b></td>
<td>Overwrite Existing Database</td>
</tr>

</table>

</div>

</div>

`;

}

/*==========================================
 Export Backup
==========================================*/

function exportDatabaseBackup() {

    const backup = {};

    Object.keys(localStorage).forEach(key => {

        try {

            backup[key] = JSON.parse(localStorage.getItem(key));

        } catch (e) {

            backup[key] = localStorage.getItem(key);

        }

    });

    backup.exportedOn = Utils.currentDateTime();
    backup.application = "SVMS Professional";
    backup.version = "1.0.0";

    const blob = new Blob(

        [JSON.stringify(backup, null, 2)],

        { type: "application/json" }

    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    const date = Utils.currentDate().replace(/-/g, "");

    link.href = url;
    link.download = `SVMS_Backup_${date}.json`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    Utils.message("Backup exported successfully.");

}

/*==========================================
 Restore Backup
==========================================*/

function restoreDatabase(event) {

    const file = event.target.files[0];

    if (!file) return;

    if (!confirm(
        "Restore backup?\n\nExisting data will be replaced."
    )) {

        event.target.value = "";
        return;

    }

    const reader = new FileReader();

    reader.onload = function(e) {

        try {

            const data = JSON.parse(e.target.result);

            localStorage.clear();

            Object.keys(data).forEach(key => {

                if (
                    key !== "application" &&
                    key !== "version" &&
                    key !== "exportedOn"
                ) {

                    localStorage.setItem(
                        key,
                        JSON.stringify(data[key])
                    );

                }

            });

            Utils.message(
                "Database restored successfully.\nPlease reload the application."
            );

        } catch (error) {

            Utils.message("Invalid backup file.");

        }

    };

    reader.readAsText(file);

}

/*==========================================
 Reset Database
==========================================*/

function resetDatabase() {

    if (!confirm(
        "WARNING!\n\nThis will permanently delete all data.\n\nContinue?"
    )) {

        return;

    }

    if (!confirm(
        "Final confirmation.\nThis action cannot be undone."
    )) {

        return;

    }

    localStorage.clear();

    Utils.message(
        "Database reset completed.\nReload the application."
    );

}

/* ===== assets/js/settings/preferences.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/settings/preferences.js
==================================================*/

/*==========================================
 System Preferences
==========================================*/

function systemPreferences() {

    const preferences = Database.getAll(
        CONFIG.STORAGE.PREFERENCES || "preferences"
    )[0] || {};

    document.getElementById("settingsWorkspace").innerHTML = `

<div class="card">

<h2>⚙️ System Preferences</h2>

<table class="table">

<tr>
<td width="250">Application Theme</td>
<td>

<select id="prefTheme">

<option value="light"
${preferences.theme==="light"?"selected":""}>

Light

</option>

<option value="dark"
${preferences.theme==="dark"?"selected":""}>

Dark

</option>

<option value="system"
${preferences.theme==="system"?"selected":""}>

System Default

</option>

</select>

</td>
</tr>

<tr>
<td>Date Format</td>
<td>

<select id="prefDateFormat">

<option value="DD-MM-YYYY"
${preferences.dateFormat==="DD-MM-YYYY"?"selected":""}>

DD-MM-YYYY

</option>

<option value="MM-DD-YYYY"
${preferences.dateFormat==="MM-DD-YYYY"?"selected":""}>

MM-DD-YYYY

</option>

<option value="YYYY-MM-DD"
${preferences.dateFormat==="YYYY-MM-DD"?"selected":""}>

YYYY-MM-DD

</option>

</select>

</td>
</tr>

<tr>
<td>Time Format</td>
<td>

<select id="prefTimeFormat">

<option value="12"
${preferences.timeFormat==="12"?"selected":""}>

12 Hour

</option>

<option value="24"
${preferences.timeFormat==="24"?"selected":""}>

24 Hour

</option>

</select>

</td>
</tr>

<tr>
<td>Currency Symbol</td>
<td>

<input
type="text"
id="prefCurrency"
value="${preferences.currency || "₹"}">

</td>
</tr>

<tr>
<td>Default Language</td>
<td>

<select id="prefLanguage">

<option value="English"
${preferences.language==="English"?"selected":""}>

English

</option>

<option value="Hindi"
${preferences.language==="Hindi"?"selected":""}>

Hindi

</option>

</select>

</td>
</tr>

<tr>
<td>Rows Per Page</td>
<td>

<input
type="number"
id="prefRows"
value="${preferences.rowsPerPage || 20}"
min="5"
max="500">

</td>
</tr>

<tr>
<td>Enable Notifications</td>
<td>

<input
type="checkbox"
id="prefNotifications"

${preferences.notifications!==false?"checked":""}

>

</td>
</tr>

<tr>
<td>Auto Save Forms</td>
<td>

<input
type="checkbox"
id="prefAutoSave"

${preferences.autoSave===true?"checked":""}

>

</td>
</tr>

<tr>
<td>Auto Logout (Minutes)</td>
<td>

<input
type="number"
id="prefAutoLogout"
value="${preferences.autoLogout || 30}"
min="5">

</td>
</tr>

</table>

<br>

<button
class="btn"
onclick="savePreferences()">

💾 Save Preferences

</button>

<button
class="btn"
onclick="Settings.render()">

⬅ Back

</button>

</div>

`;

}

/*==========================================
 Save Preferences
==========================================*/

function savePreferences() {

    const preferences = {

        theme:
            document.getElementById("prefTheme").value,

        dateFormat:
            document.getElementById("prefDateFormat").value,

        timeFormat:
            document.getElementById("prefTimeFormat").value,

        currency:
            document.getElementById("prefCurrency").value.trim(),

        language:
            document.getElementById("prefLanguage").value,

        rowsPerPage:
            Number(document.getElementById("prefRows").value),

        notifications:
            document.getElementById("prefNotifications").checked,

        autoSave:
            document.getElementById("prefAutoSave").checked,

        autoLogout:
            Number(document.getElementById("prefAutoLogout").value),

        updatedOn:
            Utils.currentDateTime()

    };

    StorageManager.save(

        CONFIG.STORAGE.PREFERENCES || "preferences",

        [preferences]

    );

    Utils.message(
        "Preferences saved successfully."
    );

}

/* ===== assets/js/settings/security.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/settings/security.js
==================================================*/

/*==========================================
 Security Settings
==========================================*/

function securitySettings() {

    const security = Database.getAll(
        CONFIG.STORAGE.SECURITY || "security"
    )[0] || {};

    document.getElementById("settingsWorkspace").innerHTML = `

<div class="card">

<h2>🔒 Security Settings</h2>

<table class="table">

<tr>
<td width="260">Minimum Password Length</td>
<td>

<input
type="number"
id="securityPasswordLength"
min="6"
max="32"
value="${security.passwordLength || 8}">

</td>
</tr>

<tr>
<td>Require Uppercase Letters</td>
<td>

<input
type="checkbox"
id="securityUppercase"

${security.uppercase !== false ? "checked" : ""}>

</td>
</tr>

<tr>
<td>Require Numbers</td>
<td>

<input
type="checkbox"
id="securityNumbers"

${security.numbers !== false ? "checked" : ""}>

</td>
</tr>

<tr>
<td>Require Special Characters</td>
<td>

<input
type="checkbox"
id="securitySpecial"

${security.special === true ? "checked" : ""}>

</td>
</tr>

<tr>
<td>Maximum Login Attempts</td>
<td>

<input
type="number"
id="securityAttempts"
min="3"
max="20"
value="${security.maxAttempts || 5}">

</td>
</tr>

<tr>
<td>Account Lock Time (Minutes)</td>
<td>

<input
type="number"
id="securityLockTime"
min="1"
value="${security.lockTime || 15}">

</td>
</tr>

<tr>
<td>Session Timeout (Minutes)</td>
<td>

<input
type="number"
id="securitySessionTimeout"
min="5"
value="${security.sessionTimeout || 30}">

</td>
</tr>

<tr>
<td>Two-Factor Authentication</td>
<td>

<input
type="checkbox"
id="security2FA"

${security.twoFactor === true ? "checked" : ""}>

</td>
</tr>

<tr>
<td>Enable Audit Logging</td>
<td>

<input
type="checkbox"
id="securityAudit"

${security.audit !== false ? "checked" : ""}>

</td>
</tr>

<tr>
<td>Allow Multiple Login</td>
<td>

<input
type="checkbox"
id="securityMultipleLogin"

${security.multipleLogin === true ? "checked" : ""}>

</td>
</tr>

</table>

<br>

<button
class="btn"
onclick="saveSecuritySettings()">

💾 Save Security Settings

</button>

<button
class="btn"
onclick="Settings.render()">

⬅ Back

</button>

</div>

`;

}

/*==========================================
 Save Security Settings
==========================================*/

function saveSecuritySettings() {

    const settings = {

        passwordLength:
            Number(document.getElementById("securityPasswordLength").value),

        uppercase:
            document.getElementById("securityUppercase").checked,

        numbers:
            document.getElementById("securityNumbers").checked,

        special:
            document.getElementById("securitySpecial").checked,

        maxAttempts:
            Number(document.getElementById("securityAttempts").value),

        lockTime:
            Number(document.getElementById("securityLockTime").value),

        sessionTimeout:
            Number(document.getElementById("securitySessionTimeout").value),

        twoFactor:
            document.getElementById("security2FA").checked,

        audit:
            document.getElementById("securityAudit").checked,

        multipleLogin:
            document.getElementById("securityMultipleLogin").checked,

        updatedOn:
            Utils.currentDateTime()

    };

    StorageManager.save(
        CONFIG.STORAGE.SECURITY || "security",
        [settings]
    );

    Utils.message(
        "Security settings saved successfully."
    );

}

/* ===== assets/js/settings/auditLog.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/settings/auditLog.js
==================================================*/

/*==========================================
 Audit Log
==========================================*/

function auditLog() {

    const logs = Database.getAll(
        CONFIG.STORAGE.AUDIT_LOG || "auditLog"
    );

    let html = `

<div class="card">

<h2>📋 Audit Log</h2>

<div style="margin-bottom:15px;display:flex;gap:10px;flex-wrap:wrap;">

<input
type="text"
id="auditSearch"
class="search-box"
placeholder="Search user, module or action..."
onkeyup="filterAuditLog()">

<button
class="btn"
onclick="exportAuditLog()">

📤 Export CSV

</button>

<button
class="btn"
onclick="clearAuditLog()">

🗑 Clear Log

</button>

<button
class="btn"
onclick="Settings.render()">

⬅ Back

</button>

</div>

<table class="table">

<thead>

<tr>

<th>Date & Time</th>
<th>User</th>
<th>Module</th>
<th>Action</th>
<th>Description</th>

</tr>

</thead>

<tbody id="auditLogTable">

`;

    if (logs.length === 0) {

        html += `

<tr>

<td colspan="5" style="text-align:center;">

No audit records available.

</td>

</tr>

`;

    } else {

        logs
            .sort((a, b) =>
                new Date(b.dateTime) -
                new Date(a.dateTime)
            )
            .forEach(log => {

                html += `

<tr>

<td>${log.dateTime}</td>

<td>${log.user}</td>

<td>${log.module}</td>

<td>${log.action}</td>

<td>${log.description}</td>

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
        "settingsWorkspace"
    ).innerHTML = html;

}

/*==========================================
 Add Audit Log Entry
==========================================*/

function addAuditLog(module, action, description) {

    const logs = Database.getAll(
        CONFIG.STORAGE.AUDIT_LOG || "auditLog"
    );

    logs.push({

        logId: "LOG-" + Date.now(),

        dateTime: Utils.currentDateTime(),

        user: Utils.getCurrentUser
            ? Utils.getCurrentUser()
            : "System",

        module,

        action,

        description

    });

    StorageManager.save(
        CONFIG.STORAGE.AUDIT_LOG || "auditLog",
        logs
    );

}

/*==========================================
 Search Audit Log
==========================================*/

function filterAuditLog() {

    const keyword = document
        .getElementById("auditSearch")
        .value
        .toLowerCase();

    document.querySelectorAll(
        "#auditLogTable tr"
    ).forEach(row => {

        row.style.display =
            row.innerText.toLowerCase().includes(keyword)
                ? ""
                : "none";

    });

}

/*==========================================
 Export Audit Log
==========================================*/

function exportAuditLog() {

    const logs = Database.getAll(
        CONFIG.STORAGE.AUDIT_LOG || "auditLog"
    );

    if (logs.length === 0) {

        Utils.message("No audit records available.");

        return;

    }

    let csv =
"Date & Time,User,Module,Action,Description\n";

    logs.forEach(log => {

        csv += [

            `"${log.dateTime}"`,
            `"${log.user}"`,
            `"${log.module}"`,
            `"${log.action}"`,
            `"${log.description}"`

        ].join(",") + "\n";

    });

    const blob = new Blob(
        [csv],
        { type: "text/csv" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "audit_log.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    Utils.message("Audit log exported successfully.");

}

/*==========================================
 Clear Audit Log
==========================================*/

function clearAuditLog() {

    if (!confirm(
        "Clear all audit log records?"
    )) {

        return;

    }

    StorageManager.save(
        CONFIG.STORAGE.AUDIT_LOG || "auditLog",
        []
    );

    Utils.message("Audit log cleared.");

    auditLog();

}

/* ===== assets/js/firebase.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/firebase.js
 Version : 3.1.0
==================================================*/

const firebaseConfig = {
    apiKey: "AIzaSyCe_AsTTlZoidxwmIAoRHLdMKnNzR6xadI",
    authDomain: "svms-pro.firebaseapp.com",
    databaseURL: "https://svms-pro-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "svms-pro",
    storageBucket: "svms-pro.firebasestorage.app",
    messagingSenderId: "52161751830",
    appId: "1:52161751830:web:948f490c225ca8ace23e37"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

console.log("Firebase Connected Successfully");

/* ===== assets/js/firebaseSync.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/firebaseSync.js
 Version : 3.1.0
==================================================*/

const FirebaseSync = {

    enabled: true,

    async upload(key, data) {

    if (!this.enabled) return false;

    this.setStatus("🟡 Syncing...");

    try {

        await db.ref(key).set(data);

        console.log("☁ Firebase Upload :", key);

        this.setStatus("🟢 Cloud Connected");

        return true;

    } catch (error) {

        console.error("Firebase Upload Error :", error);

        this.setStatus("🔴 Offline");

        return false;

    }

},

    async download(key) {

        if (!this.enabled) return [];

        try {

            const snapshot = await db.ref(key).once("value");

            const data = snapshot.val();

            if (data) {

                localStorage.setItem(
                    key,
                    JSON.stringify(data)
                );

            }

            console.log("☁ Firebase Download :", key);

            return data || [];

        }

        catch (error) {

            console.error("Firebase Download Error :", error);

            return [];

        }

    },

async listen(key) {

    if (!this.enabled) return;

    db.ref(key).on("value", (snapshot) => {

    const data = snapshot.val() || [];

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

    console.log("🔄 Live Sync :", key);

    window.dispatchEvent(
        new CustomEvent("svms-data-changed", {
            detail: { key }
        })
    );

});

},

startRealtime() {

    Object.values(CONFIG.STORAGE).forEach(key => {

        this.listen(key);

    });

    console.log("✅ Real-time Sync Started");

},

    async sync(key) {

        const data = StorageManager.load(key);

        return await this.upload(key, data);

    },

    async syncAll() {

        if (!this.enabled) return;

        for (const key of Object.values(CONFIG.STORAGE)) {

            await this.sync(key);

        }

        console.log("☁ All data synchronized.");

    }

};

FirebaseSync.setStatus = function(text){

    const el = document.getElementById("cloudStatus");

    if(el){

        el.innerHTML = text;

    }

};

window.FirebaseSync = FirebaseSync;

FirebaseSync.setStatus = function(status) {

    const element = document.getElementById("cloudStatus");

    if (!element) return;

    element.innerHTML = status;

    if (status.includes("Connected")) {

        element.style.background = "#28a745";   // Green

    }

    else if (status.includes("Syncing")) {

        element.style.background = "#ffc107";   // Yellow

        element.style.color = "#000";

    }

    else {

        element.style.background = "#dc3545";   // Red

        element.style.color = "#fff";

    }

};