
/* ===== assets/js/welfare/welfare.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/welfare/welfare.js
==================================================*/

const Welfare = {

    /*==========================================
      Welfare Home
    ==========================================*/

    render() {

        document.getElementById("mainContent").innerHTML = `

<div class="page">

<div class="page-header">

<h2>🎁 Student Welfare Management</h2>

</div>

<div class="card">

<button class="btn"
onclick="newWelfareIssue()">

➕ Issue Welfare Item

</button>

<button class="btn"
onclick="showWelfareList()">

📋 Distribution History

</button>

<button class="btn"
onclick="Welfare.search()">

🔍 Search

</button>

<button class="btn"
onclick="welfareReports()">

📊 Reports

</button>

<button class="btn"
onclick="printWelfareList()">

🖨 Print

</button>

</div>

<div id="welfareWorkspace">

<div class="card">

<h3>Welfare Dashboard</h3>

<table class="table">

<tr>

<td width="250"><b>Total Students</b></td>

<td>${Database.count(CONFIG.STORAGE.STUDENTS)}</td>

</tr>

<tr>

<td><b>Total Welfare Records</b></td>

<td>${Database.count(CONFIG.STORAGE.WELFARE)}</td>

</tr>

<tr>

<td><b>Academic Session</b></td>

<td>${CONFIG.SESSION}</td>

</tr>

<tr>

<td><b>Today's Date</b></td>

<td>${Utils.currentDate()}</td>

</tr>

</table>

</div>

</div>

</div>

`;

    },

/*==========================================
  Search Welfare
==========================================*/
search() {

    const keyword = prompt("Enter Student ID, Name or Item:");

    if (!keyword) return;

    const records = Database.getAll(CONFIG.STORAGE.WELFARE);

    const result = records.filter(r =>
        (r.studentId || "").toLowerCase().includes(keyword.toLowerCase()) ||
        (r.studentName || "").toLowerCase().includes(keyword.toLowerCase()) ||
        (r.itemName || "").toLowerCase().includes(keyword.toLowerCase())
    );

    alert("Found " + result.length + " record(s).");

}

};

/* ===== assets/js/welfare/form.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/welfare/form.js
==================================================*/

/*==========================================
 New Welfare Issue Form
==========================================*/

function newWelfareIssue() {

    const students =
        Database.getAll(CONFIG.STORAGE.STUDENTS);

    let options =
        '<option value="">Select Student</option>';

    students.forEach(student => {

        options += `

<option value="${student.studentId}">

${student.studentId} - ${student.studentName}

</option>

`;

    });

    document.getElementById("welfareWorkspace").innerHTML = `

<div class="card">

<h2>🎁 Issue Welfare Item</h2>

<table class="table">

<tr>

<td width="220">

Issue ID

</td>

<td>

<input
type="text"
id="issueId"
readonly
value="WF-${Date.now()}">

</td>

</tr>

<tr>

<td>

Issue Date

</td>

<td>

<input
type="date"
id="issueDate"
value="${Utils.currentDate()}">

</td>

</tr>

<tr>

<td>

Student

</td>

<td>

<select
id="studentId"
onchange="loadStudentForWelfare()">

${options}

</select>

</td>

</tr>

<tr>

<td>

Student Name

</td>

<td>

<input
type="text"
id="studentName"
readonly>

</td>

</tr>

<tr>

<td>

Class

</td>

<td>

<input
type="text"
id="studentClass"
readonly>

</td>

</tr>

<tr>

<td>

Category

</td>

<td>

<select id="itemCategory">

<option>Books</option>

<option>Notebook</option>

<option>School Bag</option>

<option>Uniform</option>

<option>Shoes</option>

<option>Stationery</option>

<option>Scholarship</option>

<option>Food Kit</option>

<option>Medical Support</option>

<option>Sports Item</option>

<option>Other</option>

</select>

</td>

</tr>

<tr>

<td>

Item Name

</td>

<td>

<input
type="text"
id="itemName">

</td>

</tr>

<tr>

<td>

Quantity

</td>

<td>

<input
type="number"
id="quantity"
value="1"
min="1">

</td>

</tr>

<tr>

<td>

Unit

</td>

<td>

<input
type="text"
id="unit"
value="Piece">

</td>

</tr>

<tr>

<td>

Purpose

</td>

<td>

<input
type="text"
id="purpose">

</td>

</tr>

<tr>

<td>

Issued By

</td>

<td>

<input
type="text"
id="issuedBy">

</td>

</tr>

<tr>

<td>

Remarks

</td>

<td>

<textarea
id="remarks"
rows="3"></textarea>

</td>

</tr>

</table>

<br>

<button
class="btn"
onclick="saveWelfareIssue()">

💾 Save

</button>

<button
class="btn"
onclick="Welfare.render()">

❌ Cancel

</button>

</div>

`;

}

/*==========================================
 Load Student Details
==========================================*/

function loadStudentForWelfare() {

    const id =
        document.getElementById("studentId").value;

    const students =
        Database.getAll(CONFIG.STORAGE.STUDENTS);

    const student =
        students.find(s => s.studentId === id);

    if (!student) {

        document.getElementById("studentName").value = "";

        document.getElementById("studentClass").value = "";

        return;

    }

    document.getElementById("studentName").value =
        student.studentName;

    document.getElementById("studentClass").value =
        student.studentClass;

}

/* ===== assets/js/welfare/save.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/welfare/save.js
==================================================*/

/*==========================================
 Save Welfare Issue
==========================================*/

function saveWelfareIssue() {

    const issue = {

        issueId:
            document.getElementById("issueId").value.trim(),

        issueDate:
            document.getElementById("issueDate").value,

        studentId:
            document.getElementById("studentId").value,

        studentName:
            document.getElementById("studentName").value.trim(),

        studentClass:
            document.getElementById("studentClass").value.trim(),

        itemCategory:
            document.getElementById("itemCategory").value,

        itemName:
            document.getElementById("itemName").value.trim(),

        quantity:
            Number(document.getElementById("quantity").value),

        unit:
            document.getElementById("unit").value.trim(),

        purpose:
            document.getElementById("purpose").value.trim(),

        issuedBy:
            document.getElementById("issuedBy").value.trim(),

        remarks:
            document.getElementById("remarks").value.trim(),

        createdOn:
            Utils.currentDateTime(),

        updatedOn:
            Utils.currentDateTime()

    };

    /*==========================================
      Validation
    ==========================================*/

    if (!issue.studentId) {

        Utils.message("Please select a student.");

        return;

    }

    if (!issue.itemName) {

        Utils.message("Please enter item name.");

        return;

    }

    if (issue.quantity <= 0 || isNaN(issue.quantity)) {

        Utils.message("Quantity must be greater than zero.");

        return;

    }

    /*==========================================
      Save Record
    ==========================================*/

    Database.insert(

        CONFIG.STORAGE.WELFARE,

        issue

    );

    Utils.message("Welfare item issued successfully.");

    showWelfareList();

}

/* ===== assets/js/welfare/list.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/welfare/list.js
==================================================*/

/*==========================================
 Welfare Distribution List
==========================================*/

function showWelfareList() {

    const records =
        Database.getAll(CONFIG.STORAGE.WELFARE);

    let html = `

<div class="card">

<h2>🎁 Welfare Distribution Register</h2>

<input
type="text"
id="welfareSearch"
class="search-box"
placeholder="Search by Student ID, Name, Class, Item..."
onkeyup="filterWelfareList()">

<br><br>

<table class="table">

<thead>

<tr>

<th>#</th>

<th>Date</th>

<th>Student ID</th>

<th>Name</th>

<th>Class</th>

<th>Category</th>

<th>Item</th>

<th>Qty</th>

<th>Issued By</th>

<th>Action</th>

</tr>

</thead>

<tbody id="welfareTableBody">

`;

    if (records.length === 0) {

        html += `

<tr>

<td colspan="10">

No welfare records found.

</td>

</tr>

`;

    }

    records.forEach((record, index) => {

        html += `

<tr>

<td>${index + 1}</td>

<td>${record.issueDate}</td>

<td>${record.studentId}</td>

<td>${record.studentName}</td>

<td>${record.studentClass}</td>

<td>${record.itemCategory}</td>

<td>${record.itemName}</td>

<td>${record.quantity} ${record.unit}</td>

<td>${record.issuedBy}</td>

<td>

<button
class="btn"
onclick="viewWelfare(${index})">

👁

</button>

<button
class="btn"
onclick="editWelfare(${index})">

✏

</button>

<button
class="btn"
onclick="deleteWelfare(${index})">

🗑

</button>

</td>

</tr>

`;

    });

    html += `

</tbody>

</table>

<br>

<button
class="btn"
onclick="newWelfareIssue()">

➕ Issue New Item

</button>

<button
class="btn"
onclick="printWelfareList()">

🖨 Print

</button>

<button
class="btn"
onclick="Welfare.render()">

⬅ Back

</button>

</div>

`;

    document.getElementById("welfareWorkspace").innerHTML = html;

}

/*==========================================
 Filter Welfare Records
==========================================*/

function filterWelfareList() {

    const keyword = document
        .getElementById("welfareSearch")
        .value
        .toLowerCase();

    const rows = document.querySelectorAll(
        "#welfareTableBody tr"
    );

    rows.forEach(row => {

        row.style.display =
            row.innerText.toLowerCase().includes(keyword)
                ? ""
                : "none";

    });

}

/* ===== assets/js/welfare/view.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/welfare/view.js
==================================================*/

/*==========================================
 View Welfare Record
==========================================*/

function viewWelfare(index) {

    const records =
        Database.getAll(CONFIG.STORAGE.WELFARE);

    const record = records[index];

    if (!record) {

        Utils.message("Welfare record not found.");

        return;

    }

    document.getElementById("welfareWorkspace").innerHTML = `

<div class="card">

<h2>🎁 Welfare Distribution Details</h2>

<table class="table">

<tr>
<td width="220"><b>Issue ID</b></td>
<td>${record.issueId}</td>
</tr>

<tr>
<td><b>Issue Date</b></td>
<td>${record.issueDate}</td>
</tr>

<tr>
<td><b>Student ID</b></td>
<td>${record.studentId}</td>
</tr>

<tr>
<td><b>Student Name</b></td>
<td>${record.studentName}</td>
</tr>

<tr>
<td><b>Class</b></td>
<td>${record.studentClass}</td>
</tr>

<tr>
<td><b>Category</b></td>
<td>${record.itemCategory}</td>
</tr>

<tr>
<td><b>Item Name</b></td>
<td>${record.itemName}</td>
</tr>

<tr>
<td><b>Quantity</b></td>
<td>${record.quantity} ${record.unit}</td>
</tr>

<tr>
<td><b>Purpose</b></td>
<td>${record.purpose}</td>
</tr>

<tr>
<td><b>Issued By</b></td>
<td>${record.issuedBy}</td>
</tr>

<tr>
<td><b>Remarks</b></td>
<td>${record.remarks}</td>
</tr>

<tr>
<td><b>Created On</b></td>
<td>${record.createdOn}</td>
</tr>

<tr>
<td><b>Updated On</b></td>
<td>${record.updatedOn}</td>
</tr>

</table>

<br>

<button
class="btn"
onclick="editWelfare(${index})">

✏ Edit

</button>

<button
class="btn"
onclick="printWelfareRecord(${index})">

🖨 Print

</button>

<button
class="btn"
onclick="showWelfareList()">

⬅ Back

</button>

</div>

`;

}

/* ===== assets/js/welfare/edit.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/welfare/edit.js
==================================================*/

/*==========================================
 Edit Welfare Record
==========================================*/

function editWelfare(index) {

    const records =
        Database.getAll(CONFIG.STORAGE.WELFARE);

    const record = records[index];

    if (!record) {

        Utils.message("Welfare record not found.");

        return;

    }

    newWelfareIssue();

    document.getElementById("issueId").value =
        record.issueId;

    document.getElementById("issueDate").value =
        record.issueDate;

    document.getElementById("studentId").value =
        record.studentId;

    loadStudentForWelfare();

    document.getElementById("itemCategory").value =
        record.itemCategory;

    document.getElementById("itemName").value =
        record.itemName;

    document.getElementById("quantity").value =
        record.quantity;

    document.getElementById("unit").value =
        record.unit;

    document.getElementById("purpose").value =
        record.purpose;

    document.getElementById("issuedBy").value =
        record.issuedBy;

    document.getElementById("remarks").value =
        record.remarks;

    /*------------------------------------------
      Replace Save Button
    ------------------------------------------*/

    const buttons =
        document.querySelector("#welfareWorkspace .card");

    buttons.innerHTML += `

<br>

<button
class="btn"
onclick="updateWelfare(${index})">

✅ Update Record

</button>

`;

}

/*==========================================
 Update Welfare Record
==========================================*/

function updateWelfare(index) {

    const records =
        Database.getAll(CONFIG.STORAGE.WELFARE);

    const oldRecord = records[index];

    records[index] = {

        issueId:
            oldRecord.issueId,

        issueDate:
            document.getElementById("issueDate").value,

        studentId:
            document.getElementById("studentId").value,

        studentName:
            document.getElementById("studentName").value,

        studentClass:
            document.getElementById("studentClass").value,

        itemCategory:
            document.getElementById("itemCategory").value,

        itemName:
            document.getElementById("itemName").value.trim(),

        quantity:
            Number(document.getElementById("quantity").value),

        unit:
            document.getElementById("unit").value.trim(),

        purpose:
            document.getElementById("purpose").value.trim(),

        issuedBy:
            document.getElementById("issuedBy").value.trim(),

        remarks:
            document.getElementById("remarks").value.trim(),

        createdOn:
            oldRecord.createdOn,

        updatedOn:
            Utils.currentDateTime()

    };

    StorageManager.save(

        CONFIG.STORAGE.WELFARE,

        records

    );

    Utils.message("Welfare record updated successfully.");

    showWelfareList();

}

/* ===== assets/js/welfare/delete.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/welfare/delete.js
==================================================*/

/*==========================================
 Delete Welfare Record
==========================================*/

function deleteWelfare(index) {

    const records =
        Database.getAll(CONFIG.STORAGE.WELFARE);

    if (!records[index]) {

        Utils.message("Welfare record not found.");

        return;

    }

    const record = records[index];

    const confirmDelete = confirm(

        "Are you sure you want to delete this welfare record?\n\n" +

        "Student : " + record.studentName +

        "\nItem : " + record.itemName +

        "\nQuantity : " + record.quantity + " " + record.unit

    );

    if (!confirmDelete) {

        return;

    }

    /*------------------------------------------
      Delete Record
    ------------------------------------------*/

    records.splice(index, 1);

    StorageManager.save(

        CONFIG.STORAGE.WELFARE,

        records

    );

    Utils.message("Welfare record deleted successfully.");

    showWelfareList();

}

/*==========================================
 Delete Student Welfare History
==========================================*/

function deleteStudentWelfare(studentId) {

    const confirmDelete = confirm(

        "Delete all welfare records of this student?"

    );

    if (!confirmDelete) {

        return;

    }

    let records =
        Database.getAll(CONFIG.STORAGE.WELFARE);

    records = records.filter(record =>

        record.studentId !== studentId

    );

    StorageManager.save(

        CONFIG.STORAGE.WELFARE,

        records

    );

    Utils.message("Student welfare history deleted.");

    showWelfareList();

}

/* ===== assets/js/welfare/print.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/welfare/print.js
==================================================*/

/*==========================================
 Print Welfare Register
==========================================*/

function printWelfareList() {

    const records =
        Database.getAll(CONFIG.STORAGE.WELFARE);

    let html = `

<html>

<head>

<title>Welfare Distribution Register</title>

<style>

body{

font-family:Arial,sans-serif;

margin:20px;

}

h2,h3{

text-align:center;

margin:5px;

}

table{

width:100%;

border-collapse:collapse;

margin-top:20px;

}

th,td{

border:1px solid #000;

padding:8px;

font-size:13px;

text-align:left;

}

th{

background:#eeeeee;

}

.footer{

margin-top:20px;

text-align:right;

font-size:12px;

}

</style>

</head>

<body>

<h2>${CONFIG.SCHOOL_NAME}</h2>

<h3>Student Welfare Distribution Register</h3>

<table>

<tr>

<th>S.No.</th>

<th>Date</th>

<th>Student</th>

<th>Class</th>

<th>Category</th>

<th>Item</th>

<th>Qty</th>

<th>Issued By</th>

</tr>

`;

    records.forEach((record, index) => {

        html += `

<tr>

<td>${index + 1}</td>

<td>${record.issueDate}</td>

<td>${record.studentName}</td>

<td>${record.studentClass}</td>

<td>${record.itemCategory}</td>

<td>${record.itemName}</td>

<td>${record.quantity} ${record.unit}</td>

<td>${record.issuedBy}</td>

</tr>

`;

    });

    html += `

</table>

<div class="footer">

Printed On :
${Utils.currentDateTime()}

</div>

</body>

</html>

`;

    const win = window.open("", "_blank");

    win.document.write(html);

    win.document.close();

    win.focus();

    win.print();

}

/*==========================================
 Print Single Welfare Record
==========================================*/

function printWelfareRecord(index) {

    const records =
        Database.getAll(CONFIG.STORAGE.WELFARE);

    const record = records[index];

    if (!record) {

        Utils.message("Record not found.");

        return;

    }

    const win = window.open("", "_blank");

    win.document.write(`

<html>

<head>

<title>Welfare Record</title>

<style>

body{

font-family:Arial;

margin:30px;

}

table{

width:100%;

border-collapse:collapse;

}

td{

border:1px solid #000;

padding:8px;

}

h2,h3{

text-align:center;

}

</style>

</head>

<body>

<h2>${CONFIG.SCHOOL_NAME}</h2>

<h3>Welfare Distribution Record</h3>

<table>

<tr><td width="220">Issue ID</td><td>${record.issueId}</td></tr>

<tr><td>Issue Date</td><td>${record.issueDate}</td></tr>

<tr><td>Student ID</td><td>${record.studentId}</td></tr>

<tr><td>Student Name</td><td>${record.studentName}</td></tr>

<tr><td>Class</td><td>${record.studentClass}</td></tr>

<tr><td>Category</td><td>${record.itemCategory}</td></tr>

<tr><td>Item Name</td><td>${record.itemName}</td></tr>

<tr><td>Quantity</td><td>${record.quantity} ${record.unit}</td></tr>

<tr><td>Purpose</td><td>${record.purpose}</td></tr>

<tr><td>Issued By</td><td>${record.issuedBy}</td></tr>

<tr><td>Remarks</td><td>${record.remarks}</td></tr>

</table>

</body>

</html>

`);

    win.document.close();

    win.focus();

    win.print();

}

/*==========================================
 Print Student Welfare History
==========================================*/

function printStudentWelfare(studentId) {

    const records = Database
        .getAll(CONFIG.STORAGE.WELFARE)
        .filter(record => record.studentId === studentId);

    if (records.length === 0) {

        Utils.message("No welfare history found.");

        return;

    }

    let html = `

<html>

<head>

<title>Student Welfare History</title>

<style>

body{

font-family:Arial;

margin:20px;

}

table{

width:100%;

border-collapse:collapse;

}

th,td{

border:1px solid #000;

padding:8px;

}

th{

background:#eeeeee;

}

h2,h3{

text-align:center;

}

</style>

</head>

<body>

<h2>${CONFIG.SCHOOL_NAME}</h2>

<h3>Student Welfare History</h3>

<table>

<tr>

<th>Date</th>

<th>Category</th>

<th>Item</th>

<th>Quantity</th>

<th>Issued By</th>

</tr>

`;

    records.forEach(record => {

        html += `

<tr>

<td>${record.issueDate}</td>

<td>${record.itemCategory}</td>

<td>${record.itemName}</td>

<td>${record.quantity} ${record.unit}</td>

<td>${record.issuedBy}</td>

</tr>

`;

    });

    html += `

</table>

</body>

</html>

`;

    const win = window.open("", "_blank");

    win.document.write(html);

    win.document.close();

    win.focus();

    win.print();

}

/* ===== assets/js/welfare/reports.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/welfare/reports.js
==================================================*/

/*==========================================
 Student-wise Welfare Report
==========================================*/

function welfareReports() {

    const records = Database.getAll(CONFIG.STORAGE.WELFARE);

    let totalItems = 0;

    records.forEach(record => {

        totalItems += Number(record.quantity) || 0;

    });

    const categoryMap = {};

    records.forEach(record => {

        if (!categoryMap[record.itemCategory]) {

            categoryMap[record.itemCategory] = 0;

        }

        categoryMap[record.itemCategory] += Number(record.quantity) || 0;

    });

    let categoryRows = "";

    Object.keys(categoryMap).forEach(category => {

        categoryRows += `

<tr>

<td>${category}</td>

<td>${categoryMap[category]}</td>

</tr>

`;

    });

    document.getElementById("welfareWorkspace").innerHTML = `

<div class="card">

<h2>📊 Welfare Reports</h2>

<table class="table">

<tr>

<td width="260"><b>Total Welfare Records</b></td>

<td>${records.length}</td>

</tr>

<tr>

<td><b>Total Items Distributed</b></td>

<td>${totalItems}</td>

</tr>

<tr>

<td><b>Total Students Benefited</b></td>

<td>${new Set(records.map(r=>r.studentId)).size}</td>

</tr>

</table>

<br>

<h3>Category-wise Distribution</h3>

<table class="table">

<tr>

<th>Category</th>

<th>Total Quantity</th>

</tr>

${categoryRows || "<tr><td colspan='2'>No Records Found</td></tr>"}

</table>

<br>

<button
class="btn"
onclick="studentWiseWelfareReport()">

👨‍🎓 Student Wise

</button>

<button
class="btn"
onclick="exportWelfareCSV()">

📤 Export CSV

</button>

<button
class="btn"
onclick="printWelfareList()">

🖨 Print

</button>

<button
class="btn"
onclick="Welfare.render()">

⬅ Back

</button>

</div>

`;

}

/*==========================================
 Student-wise Report
==========================================*/

function studentWiseWelfareReport() {

    const studentId = prompt("Enter Student ID");

    if (!studentId) return;

    const records = Database.getAll(CONFIG.STORAGE.WELFARE)

    .filter(r => r.studentId === studentId);

    if (records.length === 0) {

        Utils.message("No welfare record found.");

        return;

    }

    let html = `

<div class="card">

<h2>🎁 Student Welfare History</h2>

<table class="table">

<tr>

<th>Date</th>

<th>Category</th>

<th>Item</th>

<th>Quantity</th>

<th>Issued By</th>

</tr>

`;

    records.forEach(record => {

        html += `

<tr>

<td>${record.issueDate}</td>

<td>${record.itemCategory}</td>

<td>${record.itemName}</td>

<td>${record.quantity} ${record.unit}</td>

<td>${record.issuedBy}</td>

</tr>

`;

    });

    html += `

</table>

<br>

<button
class="btn"
onclick="welfareReports()">

⬅ Back

</button>

</div>

`;

    document.getElementById("welfareWorkspace").innerHTML = html;

}

/*==========================================
 Export CSV
==========================================*/

function exportWelfareCSV() {

    const records = Database.getAll(CONFIG.STORAGE.WELFARE);

    if (records.length === 0) {

        Utils.message("No records available.");

        return;

    }

    let csv =

"Date,Student ID,Student Name,Class,Category,Item,Quantity,Unit,Issued By\n";

    records.forEach(record => {

        csv += [

            record.issueDate,

            record.studentId,

            record.studentName,

            record.studentClass,

            record.itemCategory,

            record.itemName,

            record.quantity,

            record.unit,

            record.issuedBy

        ].join(",") + "\n";

    });

    const blob = new Blob(

        [csv],

        {type:"text/csv"}

    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "welfare_report.csv";

    a.click();

    URL.revokeObjectURL(url);

}