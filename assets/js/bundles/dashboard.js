
/* ===== assets/js/dashboard/dashboard.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/dashboard/dashboard.js
==================================================*/

const Dashboard = {

    render() {

        const students = Database.getAll(
            CONFIG.STORAGE.STUDENTS || "students"
        );

        const teachers = Database.getAll(
            CONFIG.STORAGE.TEACHERS || "teachers"
        );

        const attendance = Database.getAll(
            CONFIG.STORAGE.ATTENDANCE || "attendance"
        );

        const library = Database.getAll(
            CONFIG.STORAGE.LIBRARY || "library"
        );

        const inventory = Database.getAll(
            CONFIG.STORAGE.INVENTORY || "inventory"
        );

        const certificates = Database.getAll(
            CONFIG.STORAGE.CERTIFICATES || "certificates"
        );

        const notifications = Database.getAll(
            CONFIG.STORAGE.NOTIFICATIONS || "notifications"
        );

        document.getElementById("mainContent").innerHTML = `

<div class="page">

<div class="page-header">

<div style="display:flex;justify-content:space-between;align-items:center;">

<h2>📊 Dashboard</h2>

<button
class="btn"
onclick="logoutUser()">

🚪 Logout

</button>

</div>

</div>

<div class="dashboard-grid">

<div class="dashboard-card">
<h3>👨‍🎓 Students</h3>
<h1>${students.length}</h1>
</div>

<div class="dashboard-card">
<h3>👨‍🏫 Teachers</h3>
<h1>${teachers.length}</h1>
</div>

<div class="dashboard-card">
<h3>📝 Attendance</h3>
<h1>${attendance.length}</h1>
</div>

<div class="dashboard-card">
<h3>📚 Library Books</h3>
<h1>${library.length}</h1>
</div>

<div class="dashboard-card">
<h3>📦 Inventory Items</h3>
<h1>${inventory.length}</h1>
</div>

<div class="dashboard-card">
<h3>📜 Certificates</h3>
<h1>${certificates.length}</h1>
</div>

<div class="dashboard-card">
<h3>🔔 Notifications</h3>
<h1>${notifications.length}</h1>
</div>

</div>

<div class="card">

<h3>Quick Actions</h3>

<button class="btn" onclick="Router.open('students')">Students</button>

<button class="btn" onclick="Router.open('teachers')">Teachers</button>

<button class="btn" onclick="Router.open('attendance')">Attendance</button>

<button class="btn" onclick="Router.open('library')">Library</button>

<button class="btn" onclick="Router.open('inventory')">Inventory</button>

<button class="btn" onclick="Router.open('certificates')">Certificates</button>

<button class="btn" onclick="Router.open('notifications')">Notifications</button>

<button class="btn" onclick="Router.open('settings')">Settings</button>

<button class="btn" onclick="Router.open('reports')">Reports</button>

<button class="btn" onclick="Router.open('users')">Users</button>

</div>

</div>

`;

    }

};

/* ===== assets/js/dashboard/analytics.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/dashboard/analytics.js
==================================================*/

/*==========================================
 Dashboard Analytics
==========================================*/

const DashboardAnalytics = {

    render() {

        const students = Database.getAll(
            CONFIG.STORAGE.STUDENTS || "students"
        );

        const teachers = Database.getAll(
            CONFIG.STORAGE.TEACHERS || "teachers"
        );

        const attendance = Database.getAll(
            CONFIG.STORAGE.ATTENDANCE || "attendance"
        );

        const fees = Database.getAll(
            CONFIG.STORAGE.FEES || "fees"
        );

        const library = Database.getAll(
            CONFIG.STORAGE.LIBRARY || "library"
        );

        const inventory = Database.getAll(
            CONFIG.STORAGE.INVENTORY || "inventory"
        );

        const notifications = Database.getAll(
            CONFIG.STORAGE.NOTIFICATIONS || "notifications"
        );

        const certificates = Database.getAll(
            CONFIG.STORAGE.CERTIFICATES || "certificates"
        );

        const feeCollected = fees
            .filter(f => f.status === "Paid")
            .reduce((sum, f) => sum + Number(f.amount || 0), 0);

        const feePending = fees
            .filter(f => f.status !== "Paid")
            .reduce((sum, f) => sum + Number(f.amount || 0), 0);

        document.getElementById("mainContent").innerHTML = `

<div class="page">

<div class="page-header">

<h2>📈 Dashboard Analytics</h2>

</div>

<div class="dashboard-grid">

<div class="dashboard-card">
<h3>Total Students</h3>
<h1>${students.length}</h1>
</div>

<div class="dashboard-card">
<h3>Total Teachers</h3>
<h1>${teachers.length}</h1>
</div>

<div class="dashboard-card">
<h3>Attendance Records</h3>
<h1>${attendance.length}</h1>
</div>

<div class="dashboard-card">
<h3>Library Books</h3>
<h1>${library.length}</h1>
</div>

<div class="dashboard-card">
<h3>Inventory Items</h3>
<h1>${inventory.length}</h1>
</div>

<div class="dashboard-card">
<h3>Certificates</h3>
<h1>${certificates.length}</h1>
</div>

<div class="dashboard-card">
<h3>Notifications</h3>
<h1>${notifications.length}</h1>
</div>

<div class="dashboard-card">
<h3>Fee Collected</h3>
<h1>₹${feeCollected.toLocaleString()}</h1>
</div>

<div class="dashboard-card">
<h3>Fee Pending</h3>
<h1>₹${feePending.toLocaleString()}</h1>
</div>

</div>

<div class="card">

<h3>Quick Statistics</h3>

<table class="table">

<tr>
<td width="250">Students</td>
<td>${students.length}</td>
</tr>

<tr>
<td>Teachers</td>
<td>${teachers.length}</td>
</tr>

<tr>
<td>Attendance Entries</td>
<td>${attendance.length}</td>
</tr>

<tr>
<td>Library Records</td>
<td>${library.length}</td>
</tr>

<tr>
<td>Inventory Records</td>
<td>${inventory.length}</td>
</tr>

<tr>
<td>Certificates Issued</td>
<td>${certificates.length}</td>
</tr>

<tr>
<td>Notifications</td>
<td>${notifications.length}</td>
</tr>

<tr>
<td>Total Fee Collected</td>
<td>₹${feeCollected.toLocaleString()}</td>
</tr>

<tr>
<td>Total Fee Pending</td>
<td>₹${feePending.toLocaleString()}</td>
</tr>

</table>

<br>

<button
class="btn"
onclick="Dashboard.render()">

🏠 Dashboard

</button>

<button
class="btn"
onclick="window.print()">

🖨 Print Report

</button>

</div>

</div>

`;

    }

};

/* ===== assets/js/dashboard/globalSearch.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/dashboard/globalSearch.js
==================================================*/

const GlobalSearch = {

    modules: [

        {
            name: "Students",
            storage: CONFIG.STORAGE.STUDENTS || "students",
            fields: ["studentId","studentName","rollNo","mobile"]
        },

        {
            name: "Teachers",
            storage: CONFIG.STORAGE.TEACHERS || "teachers",
            fields: ["teacherId","teacherName","mobile"]
        },

        {
            name: "Certificates",
            storage: CONFIG.STORAGE.CERTIFICATES || "certificates",
            fields: ["certificateNumber","studentName","rollNo"]
        },

        {
            name: "Notifications",
            storage: CONFIG.STORAGE.NOTIFICATIONS || "notifications",
            fields: ["subject","audience","message"]
        },

        {
            name: "Library",
            storage: CONFIG.STORAGE.LIBRARY || "library",
            fields: ["bookName","bookCode","author"]
        },

        {
            name: "Inventory",
            storage: CONFIG.STORAGE.INVENTORY || "inventory",
            fields: ["itemName","itemCode"]
        }

    ],

    search(keyword) {

        keyword = keyword.trim().toLowerCase();

        if (!keyword) {

            Utils.message("Enter search keyword.");

            return;

        }

        let results = [];

        this.modules.forEach(module => {

            const records = Database.getAll(module.storage);

            records.forEach(record => {

                const found = module.fields.some(field =>

                    String(record[field] || "")
                        .toLowerCase()
                        .includes(keyword)

                );

                if (found) {

                    results.push({

                        module: module.name,

                        data: record

                    });

                }

            });

        });

        this.showResults(results);

    },

    showResults(results) {

        let html = `

<div class="card">

<h2>🔍 Global Search Results</h2>

<p>

Total Results:
<b>${results.length}</b>

</p>

<table class="table">

<tr>

<th>Module</th>

<th>Details</th>

</tr>

`;

        if (results.length === 0) {

            html += `

<tr>

<td colspan="2">

No matching records found.

</td>

</tr>

`;

        }

        results.forEach(result => {

            html += `

<tr>

<td>${result.module}</td>

<td>

<pre style="white-space:pre-wrap">

${JSON.stringify(result.data, null, 2)}

</pre>

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

};