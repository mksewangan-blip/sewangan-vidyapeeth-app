
/* ===== assets/js/certificates/certificates.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/certificates/certificates.js
==================================================*/

const Certificates = {

    render() {

        document.getElementById("mainContent").innerHTML = `

<div class="page">

<div class="page-header">

<h2>📜 Certificate Management</h2>

</div>

<div class="card">

<button class="btn"
onclick="newCertificate()">

➕ New Certificate

</button>

<button class="btn"
onclick="certificateRegister()">

📋 Certificate Register

</button>

<button class="btn"
onclick="transferCertificate()">

🎓 Transfer Certificate

</button>

<button class="btn"
onclick="characterCertificate()">

⭐ Character Certificate

</button>

<button class="btn"
onclick="bonafideCertificate()">

🏫 Bonafide Certificate

</button>

<button class="btn"
onclick="studyCertificate()">

📖 Study Certificate

</button>

<button class="btn"
onclick="feeCertificate()">

💰 Fee Certificate

</button>

<button class="btn"
onclick="certificateReports()">

📊 Reports

</button>

<button class="btn"
onclick="printCertificateRegister()">

🖨 Print

</button>

</div>

<div id="certificateWorkspace">

<div class="card">

<h3>Certificate Dashboard</h3>

<table class="table">

<tr>
<td width="250"><b>Total Certificates</b></td>
<td id="certificateTotal">0</td>
</tr>

<tr>
<td><b>Transfer Certificates</b></td>
<td id="tcTotal">0</td>
</tr>

<tr>
<td><b>Character Certificates</b></td>
<td id="characterTotal">0</td>
</tr>

<tr>
<td><b>Bonafide Certificates</b></td>
<td id="bonafideTotal">0</td>
</tr>

<tr>
<td><b>Study Certificates</b></td>
<td id="studyTotal">0</td>
</tr>

<tr>
<td><b>Fee Certificates</b></td>
<td id="feeTotal">0</td>
</tr>

</table>

</div>

</div>

</div>

`;

        this.updateDashboard();

    },

    updateDashboard() {

        const certificates = Database.getAll(
            CONFIG.STORAGE.CERTIFICATES || "certificates"
        );

        const count = type =>
            certificates.filter(
                c => c.certificateType === type
            ).length;

        document.getElementById("certificateTotal").textContent =
            certificates.length;

        document.getElementById("tcTotal").textContent =
            count("Transfer");

        document.getElementById("characterTotal").textContent =
            count("Character");

        document.getElementById("bonafideTotal").textContent =
            count("Bonafide");

        document.getElementById("studyTotal").textContent =
            count("Study");

        document.getElementById("feeTotal").textContent =
            count("Fee");

    }

};

/* ===== assets/js/certificates/newCertificate.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/certificates/newCertificate.js
==================================================*/

/*==========================================
 New Certificate Form
==========================================*/

function newCertificate() {

    const students = Database.getAll(
        CONFIG.STORAGE.STUDENTS || "students"
    );

    let studentOptions =
        '<option value="">Select Student</option>';

    students.forEach(student => {

        studentOptions += `

<option value="${student.studentId}">

${student.studentName}
(${student.rollNo})

</option>

`;

    });

    document.getElementById(
        "certificateWorkspace"
    ).innerHTML = `

<div class="card">

<h2>📜 Issue New Certificate</h2>

<table class="table">

<tr>

<td width="220">Certificate Type *</td>

<td>

<select id="certificateType">

<option value="">Select</option>

<option value="Transfer">

Transfer Certificate

</option>

<option value="Character">

Character Certificate

</option>

<option value="Bonafide">

Bonafide Certificate

</option>

<option value="Study">

Study Certificate

</option>

<option value="Fee">

Fee Certificate

</option>

</select>

</td>

</tr>

<tr>

<td>Student *</td>

<td>

<select id="certificateStudent">

${studentOptions}

</select>

</td>

</tr>

<tr>

<td>Issue Date *</td>

<td>

<input
type="date"
id="issueDate"
value="${Utils.currentDate()}">

</td>

</tr>

<tr>

<td>Certificate No.</td>

<td>

<input
type="text"
id="certificateNumber"
value="CERT-${Date.now()}"
readonly>

</td>

</tr>

<tr>

<td>Purpose</td>

<td>

<input
type="text"
id="certificatePurpose"
placeholder="Purpose of certificate">

</td>

</tr>

<tr>

<td>Remarks</td>

<td>

<textarea
id="certificateRemarks"
rows="4"></textarea>

</td>

</tr>

</table>

<br>

<button
class="btn"
onclick="saveCertificate()">

💾 Save Certificate

</button>

<button
class="btn"
onclick="Certificates.render()">

⬅ Back

</button>

</div>

`;

}

/*==========================================
 Quick Certificate Shortcuts
==========================================*/

function transferCertificate() {

    newCertificate();

    document.getElementById(
        "certificateType"
    ).value = "Transfer";

}

function characterCertificate() {

    newCertificate();

    document.getElementById(
        "certificateType"
    ).value = "Character";

}

function bonafideCertificate() {

    newCertificate();

    document.getElementById(
        "certificateType"
    ).value = "Bonafide";

}

function studyCertificate() {

    newCertificate();

    document.getElementById(
        "certificateType"
    ).value = "Study";

}

function feeCertificate() {

    newCertificate();

    document.getElementById(
        "certificateType"
    ).value = "Fee";

}

/* ===== assets/js/certificates/saveCertificate.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/certificates/saveCertificate.js
==================================================*/

/*==========================================
 Save Certificate
==========================================*/

function saveCertificate() {

    const certificateType =
        document.getElementById("certificateType").value;

    const studentId =
        document.getElementById("certificateStudent").value;

    const issueDate =
        document.getElementById("issueDate").value;

    const certificateNumber =
        document.getElementById("certificateNumber").value;

    const purpose =
        document.getElementById("certificatePurpose").value.trim();

    const remarks =
        document.getElementById("certificateRemarks").value.trim();

    /*------------------------------------------
      Validation
    ------------------------------------------*/

    if (!certificateType) {

        Utils.message("Please select certificate type.");

        return;

    }

    if (!studentId) {

        Utils.message("Please select a student.");

        return;

    }

    if (!issueDate) {

        Utils.message("Please select issue date.");

        return;

    }

    /*------------------------------------------
      Student Details
    ------------------------------------------*/

    const students = Database.getAll(
        CONFIG.STORAGE.STUDENTS || "students"
    );

    const student = students.find(
        s => s.studentId === studentId
    );

    if (!student) {

        Utils.message("Student record not found.");

        return;

    }

    /*------------------------------------------
      Prevent Duplicate Certificate Number
    ------------------------------------------*/

    const certificates = Database.getAll(
        CONFIG.STORAGE.CERTIFICATES || "certificates"
    );

    if (certificates.some(
        c => c.certificateNumber === certificateNumber
    )) {

        Utils.message("Certificate number already exists.");

        return;

    }

    /*------------------------------------------
      Certificate Record
    ------------------------------------------*/

    const certificate = {

        certificateId:
            "CERT-" + Date.now(),

        certificateNumber,

        certificateType,

        studentId: student.studentId,

        rollNo: student.rollNo,

        admissionNo: student.admissionNo || "",

        studentName: student.studentName,

        fatherName: student.fatherName || "",

        motherName: student.motherName || "",

        studentClass:
            student.studentClass || "",

        section:
            student.section || "",

        session:
            CONFIG.CURRENT_SESSION,

        issueDate,

        purpose,

        remarks,

        status: "Issued",

        issuedBy:
            Utils.getCurrentUser
                ? Utils.getCurrentUser()
                : "Administrator",

        createdOn:
            Utils.currentDateTime(),

        updatedOn:
            Utils.currentDateTime()

    };

    /*------------------------------------------
      Save
    ------------------------------------------*/

    Database.insert(

        CONFIG.STORAGE.CERTIFICATES || "certificates",

        certificate

    );

    Utils.message("Certificate issued successfully.");

    Certificates.updateDashboard();

    certificateRegister();

}

/* ===== assets/js/certificates/certificateRegister.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/certificates/certificateRegister.js
==================================================*/

/*==========================================
 Certificate Register
==========================================*/

function certificateRegister() {

    const certificates = Database.getAll(
        CONFIG.STORAGE.CERTIFICATES || "certificates"
    );

    let html = `

<div class="card">

<h2>📜 Certificate Register</h2>

<div style="margin-bottom:15px;display:flex;gap:10px;flex-wrap:wrap;">

<input
type="text"
id="certificateSearch"
class="search-box"
placeholder="Search by Student, Roll No., Certificate No..."
onkeyup="filterCertificateRegister()">

<select
id="certificateTypeFilter"
onchange="filterCertificateRegister()">

<option value="">All Types</option>

<option value="Transfer">Transfer</option>

<option value="Character">Character</option>

<option value="Bonafide">Bonafide</option>

<option value="Study">Study</option>

<option value="Fee">Fee</option>

</select>

</div>

<table class="table">

<thead>

<tr>

<th>No.</th>
<th>Type</th>
<th>Student</th>
<th>Roll No.</th>
<th>Class</th>
<th>Issue Date</th>
<th>Status</th>
<th>Actions</th>

</tr>

</thead>

<tbody id="certificateTableBody">

`;

    if (certificates.length === 0) {

        html += `

<tr>

<td colspan="8" style="text-align:center">

No certificate records found.

</td>

</tr>

`;

    } else {

        certificates
            .sort((a, b) =>
                new Date(b.createdOn) - new Date(a.createdOn)
            )
            .forEach(item => {

                html += `

<tr>

<td>${item.certificateNumber}</td>

<td>${item.certificateType}</td>

<td>${item.studentName}</td>

<td>${item.rollNo}</td>

<td>${item.studentClass}</td>

<td>${item.issueDate}</td>

<td>

<span class="badge badge-success">

${item.status}

</span>

</td>

<td>

<button
class="btn btn-sm"
onclick="editCertificate('${item.certificateId}')">

✏

</button>

<button
class="btn btn-sm btn-danger"
onclick="deleteCertificate('${item.certificateId}')">

🗑

</button>

<button
class="btn btn-sm"
onclick="printCertificate('${item.certificateId}')">

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
onclick="newCertificate()">

➕ New Certificate

</button>

<button
class="btn"
onclick="printCertificateRegister()">

🖨 Print Register

</button>

<button
class="btn"
onclick="Certificates.render()">

⬅ Back

</button>

</div>

`;

    document.getElementById(
        "certificateWorkspace"
    ).innerHTML = html;

}

/*==========================================
 Search & Filter
==========================================*/

function filterCertificateRegister() {

    const keyword = document
        .getElementById("certificateSearch")
        .value
        .toLowerCase();

    const type = document
        .getElementById("certificateTypeFilter")
        .value
        .toLowerCase();

    const rows = document.querySelectorAll(
        "#certificateTableBody tr"
    );

    rows.forEach(row => {

        const text = row.innerText.toLowerCase();

        const matchKeyword =
            text.includes(keyword);

        const matchType =
            type === "" || text.includes(type);

        row.style.display =
            (matchKeyword && matchType)
                ? ""
                : "none";

    });

}

/* ===== assets/js/certificates/editCertificate.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/certificates/editCertificate.js
==================================================*/

/*==========================================
 Edit Certificate
==========================================*/

function editCertificate(certificateId) {

    const certificates = Database.getAll(
        CONFIG.STORAGE.CERTIFICATES || "certificates"
    );

    const certificate = certificates.find(
        c => c.certificateId === certificateId
    );

    if (!certificate) {

        Utils.message("Certificate not found.");

        return;

    }

    document.getElementById("certificateWorkspace").innerHTML = `

<div class="card">

<h2>✏ Edit Certificate</h2>

<table class="table">

<tr>
<td width="220">Certificate Number</td>
<td>

<input
type="text"
id="editCertificateNumber"
value="${certificate.certificateNumber}"
readonly>

</td>
</tr>

<tr>
<td>Certificate Type</td>
<td>

<select id="editCertificateType">

<option value="Transfer" ${certificate.certificateType==="Transfer"?"selected":""}>Transfer</option>

<option value="Character" ${certificate.certificateType==="Character"?"selected":""}>Character</option>

<option value="Bonafide" ${certificate.certificateType==="Bonafide"?"selected":""}>Bonafide</option>

<option value="Study" ${certificate.certificateType==="Study"?"selected":""}>Study</option>

<option value="Fee" ${certificate.certificateType==="Fee"?"selected":""}>Fee</option>

</select>

</td>
</tr>

<tr>
<td>Issue Date</td>
<td>

<input
type="date"
id="editIssueDate"
value="${certificate.issueDate}">

</td>
</tr>

<tr>
<td>Purpose</td>
<td>

<input
type="text"
id="editPurpose"
value="${certificate.purpose || ""}">

</td>
</tr>

<tr>
<td>Remarks</td>
<td>

<textarea
id="editRemarks"
rows="4">${certificate.remarks || ""}</textarea>

</td>
</tr>

<tr>
<td>Status</td>
<td>

<select id="editStatus">

<option value="Issued" ${certificate.status==="Issued"?"selected":""}>Issued</option>

<option value="Cancelled" ${certificate.status==="Cancelled"?"selected":""}>Cancelled</option>

</select>

</td>
</tr>

</table>

<br>

<button
class="btn"
onclick="updateCertificate('${certificate.certificateId}')">

💾 Update Certificate

</button>

<button
class="btn"
onclick="certificateRegister()">

⬅ Cancel

</button>

</div>

`;

}

/*==========================================
 Update Certificate
==========================================*/

function updateCertificate(certificateId) {

    const certificates = Database.getAll(
        CONFIG.STORAGE.CERTIFICATES || "certificates"
    );

    const certificate = certificates.find(
        c => c.certificateId === certificateId
    );

    if (!certificate) {

        Utils.message("Certificate not found.");

        return;

    }

    certificate.certificateType =
        document.getElementById("editCertificateType").value;

    certificate.issueDate =
        document.getElementById("editIssueDate").value;

    certificate.purpose =
        document.getElementById("editPurpose").value.trim();

    certificate.remarks =
        document.getElementById("editRemarks").value.trim();

    certificate.status =
        document.getElementById("editStatus").value;

    certificate.updatedOn =
        Utils.currentDateTime();

    StorageManager.save(
        CONFIG.STORAGE.CERTIFICATES || "certificates",
        certificates
    );

    Utils.message("Certificate updated successfully.");

    Certificates.updateDashboard();

    certificateRegister();

}

/* ===== assets/js/certificates/deleteCertificate.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/certificates/deleteCertificate.js
==================================================*/

/*==========================================
 Delete Certificate
==========================================*/

function deleteCertificate(certificateId) {

    const certificates = Database.getAll(
        CONFIG.STORAGE.CERTIFICATES || "certificates"
    );

    const certificate = certificates.find(
        c => c.certificateId === certificateId
    );

    if (!certificate) {

        Utils.message("Certificate not found.");

        return;

    }

    const confirmed = confirm(

        "Delete this certificate?\n\n" +

        "Certificate No.: " + certificate.certificateNumber + "\n" +

        "Student: " + certificate.studentName + "\n" +

        "Type: " + certificate.certificateType + "\n\n" +

        "This action cannot be undone."

    );

    if (!confirmed) {

        return;

    }

    const updatedCertificates = certificates.filter(

        c => c.certificateId !== certificateId

    );

    StorageManager.save(

        CONFIG.STORAGE.CERTIFICATES || "certificates",

        updatedCertificates

    );

    Certificates.updateDashboard();

    Utils.message("Certificate deleted successfully.");

    certificateRegister();

}

/*==========================================
 Delete All Certificates
(Admin Only)
==========================================*/

function deleteAllCertificates() {

    const certificates = Database.getAll(
        CONFIG.STORAGE.CERTIFICATES || "certificates"
    );

    if (certificates.length === 0) {

        Utils.message("No certificates available.");

        return;

    }

    const confirmed = confirm(

        "Delete ALL certificate records?\n\n" +

        "This action cannot be undone."

    );

    if (!confirmed) {

        return;

    }

    StorageManager.save(

        CONFIG.STORAGE.CERTIFICATES || "certificates",

        []

    );

    Certificates.updateDashboard();

    Utils.message("All certificate records deleted.");

    certificateRegister();

}

/*==========================================
 Cancel Certificate
==========================================*/

function cancelCertificate(certificateId) {

    const certificates = Database.getAll(
        CONFIG.STORAGE.CERTIFICATES || "certificates"
    );

    const certificate = certificates.find(
        c => c.certificateId === certificateId
    );

    if (!certificate) {

        Utils.message("Certificate not found.");

        return;

    }

    certificate.status = "Cancelled";
    certificate.updatedOn = Utils.currentDateTime();

    StorageManager.save(

        CONFIG.STORAGE.CERTIFICATES || "certificates",

        certificates

    );

    Certificates.updateDashboard();

    Utils.message("Certificate cancelled successfully.");

    certificateRegister();

}

/*==========================================
Restore Certificate
==========================================*/

function restoreCertificate(certificateId) {

    const certificates = Database.getAll(
        CONFIG.STORAGE.CERTIFICATES || "certificates"
    );

    const certificate = certificates.find(
        c => c.certificateId === certificateId
    );

    if (!certificate) {

        Utils.message("Certificate not found.");

        return;

    }

    certificate.status = "Issued";
    certificate.updatedOn = Utils.currentDateTime();

    StorageManager.save(

        CONFIG.STORAGE.CERTIFICATES || "certificates",

        certificates

    );

    Certificates.updateDashboard();

    Utils.message("Certificate restored successfully.");

    certificateRegister();

}

/* ===== assets/js/certificates/reports.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/certificates/reports.js
==================================================*/

/*==========================================
 Certificate Reports
==========================================*/

function certificateReports() {

    const certificates = Database.getAll(
        CONFIG.STORAGE.CERTIFICATES || "certificates"
    );

    const total = certificates.length;

    const issued = certificates.filter(
        c => c.status === "Issued"
    ).length;

    const cancelled = certificates.filter(
        c => c.status === "Cancelled"
    ).length;

    document.getElementById("certificateWorkspace").innerHTML = `

<div class="card">

<h2>📊 Certificate Reports</h2>

<table class="table">

<tr>
<td width="250"><b>Total Certificates</b></td>
<td>${total}</td>
</tr>

<tr>
<td><b>Issued Certificates</b></td>
<td>${issued}</td>
</tr>

<tr>
<td><b>Cancelled Certificates</b></td>
<td>${cancelled}</td>
</tr>

</table>

<br>

<button class="btn"
onclick="certificateTypeReport()">

📑 Type-wise Report

</button>

<button class="btn"
onclick="certificateClassReport()">

🏫 Class-wise Report

</button>

<button class="btn"
onclick="certificateDateReport()">

📅 Date-wise Report

</button>

<button class="btn"
onclick="exportCertificateCSV()">

📤 Export CSV

</button>

<button class="btn"
onclick="Certificates.render()">

⬅ Back

</button>

</div>

`;

}

/*==========================================
 Type-wise Report
==========================================*/

function certificateTypeReport() {

    const certificates = Database.getAll(
        CONFIG.STORAGE.CERTIFICATES || "certificates"
    );

    const report = {};

    certificates.forEach(item => {

        report[item.certificateType] =
            (report[item.certificateType] || 0) + 1;

    });

    let html = `

<div class="card">

<h2>📑 Certificate Type Report</h2>

<table class="table">

<tr>

<th>Certificate Type</th>

<th>Total</th>

</tr>

`;

    Object.keys(report).sort().forEach(type => {

        html += `

<tr>

<td>${type}</td>

<td>${report[type]}</td>

</tr>

`;

    });

    html += `

</table>

<br>

<button class="btn"
onclick="certificateReports()">

⬅ Back

</button>

</div>

`;

    document.getElementById("certificateWorkspace").innerHTML = html;

}

/*==========================================
 Class-wise Report
==========================================*/

function certificateClassReport() {

    const certificates = Database.getAll(
        CONFIG.STORAGE.CERTIFICATES || "certificates"
    );

    const report = {};

    certificates.forEach(item => {

        report[item.studentClass] =
            (report[item.studentClass] || 0) + 1;

    });

    let html = `

<div class="card">

<h2>🏫 Class-wise Certificate Report</h2>

<table class="table">

<tr>

<th>Class</th>

<th>Total Certificates</th>

</tr>

`;

    Object.keys(report).sort().forEach(cls => {

        html += `

<tr>

<td>${cls}</td>

<td>${report[cls]}</td>

</tr>

`;

    });

    html += `

</table>

<br>

<button class="btn"
onclick="certificateReports()">

⬅ Back

</button>

</div>

`;

    document.getElementById("certificateWorkspace").innerHTML = html;

}

/*==========================================
 Date-wise Report
==========================================*/

function certificateDateReport() {

    const certificates = Database.getAll(
        CONFIG.STORAGE.CERTIFICATES || "certificates"
    );

    const report = {};

    certificates.forEach(item => {

        report[item.issueDate] =
            (report[item.issueDate] || 0) + 1;

    });

    let html = `

<div class="card">

<h2>📅 Date-wise Certificate Report</h2>

<table class="table">

<tr>

<th>Issue Date</th>

<th>Total Certificates</th>

</tr>

`;

    Object.keys(report).sort().forEach(date => {

        html += `

<tr>

<td>${date}</td>

<td>${report[date]}</td>

</tr>

`;

    });

    html += `

</table>

<br>

<button class="btn"
onclick="certificateReports()">

⬅ Back

</button>

</div>

`;

    document.getElementById("certificateWorkspace").innerHTML = html;

}

/*==========================================
 Export CSV
==========================================*/

function exportCertificateCSV() {

    const certificates = Database.getAll(
        CONFIG.STORAGE.CERTIFICATES || "certificates"
    );

    if (certificates.length === 0) {

        Utils.message("No certificate records available.");

        return;

    }

    let csv =
"Certificate No,Type,Student,Roll No,Class,Issue Date,Status,Purpose\n";

    certificates.forEach(item => {

        csv += [

            item.certificateNumber,
            item.certificateType,
            item.studentName,
            item.rollNo,
            item.studentClass,
            item.issueDate,
            item.status,
            `"${item.purpose || ""}"`

        ].join(",") + "\n";

    });

    const blob = new Blob(
        [csv],
        { type: "text/csv" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "certificate_report.csv";
    link.click();

    URL.revokeObjectURL(url);

    Utils.message("Certificate report exported successfully.");

}

/* ===== assets/js/certificates/print.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/certificates/print.js
==================================================*/

/*==========================================
 Certificate Print Window
==========================================*/

function certificatePrintWindow(title, body) {

    const win = window.open("", "_blank");

    win.document.write(`
<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8">

<title>${title}</title>

<style>

body{

font-family:Arial,sans-serif;

margin:40px;

font-size:14px;

line-height:1.6;

}

.header{

text-align:center;

margin-bottom:25px;

}

.header img{

height:80px;

margin-bottom:10px;

}

.header h2{

margin:0;

}

.header p{

margin:4px 0;

}

.title{

text-align:center;

font-size:22px;

font-weight:bold;

text-decoration:underline;

margin:25px 0;

}

.content{

margin-top:20px;

text-align:justify;

}

.footer{

margin-top:70px;

display:flex;

justify-content:space-between;

}

.footer div{

text-align:center;

width:180px;

}

.register-table{

width:100%;

border-collapse:collapse;

margin-top:20px;

}

.register-table th,
.register-table td{

border:1px solid #000;

padding:6px;

}

.register-table th{

background:#eeeeee;

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

${body}

<div class="footer">

<div>

_____________________<br>

Class Teacher

</div>

<div>

_____________________<br>

Principal

</div>

</div>

</body>

</html>
`);

    win.document.close();
    win.focus();
    win.print();

}

/*==========================================
 Print Individual Certificate
==========================================*/

function printCertificate(certificateId) {

    const certificates = Database.getAll(
        CONFIG.STORAGE.CERTIFICATES || "certificates"
    );

    const cert = certificates.find(
        c => c.certificateId === certificateId
    );

    if (!cert) {

        Utils.message("Certificate not found.");

        return;

    }

    let body = `

<div class="content">

<p><strong>Certificate No:</strong> ${cert.certificateNumber}</p>

<p><strong>Date:</strong> ${cert.issueDate}</p>

<p>

This is to certify that <strong>${cert.studentName}</strong>,
Roll No. <strong>${cert.rollNo}</strong>,
Class <strong>${cert.studentClass}</strong>,
has been issued a
<strong>${cert.certificateType} Certificate</strong>.

</p>

`;

    if (cert.purpose) {

        body += `

<p>

Purpose :
<strong>${cert.purpose}</strong>

</p>

`;

    }

    if (cert.remarks) {

        body += `

<p>

Remarks :
${cert.remarks}

</p>

`;

    }

    body += `

<p>

This certificate is issued on the student's request
for official use.

</p>

</div>

`;

    certificatePrintWindow(
        cert.certificateType + " Certificate",
        body
    );

}

/*==========================================
 Print Certificate Register
==========================================*/

function printCertificateRegister() {

    const certificates = Database.getAll(
        CONFIG.STORAGE.CERTIFICATES || "certificates"
    );

    let table = `

<table class="register-table">

<tr>

<th>No.</th>
<th>Type</th>
<th>Student</th>
<th>Roll No.</th>
<th>Class</th>
<th>Date</th>
<th>Status</th>

</tr>

`;

    certificates.forEach((cert, index) => {

        table += `

<tr>

<td>${index + 1}</td>

<td>${cert.certificateType}</td>

<td>${cert.studentName}</td>

<td>${cert.rollNo}</td>

<td>${cert.studentClass}</td>

<td>${cert.issueDate}</td>

<td>${cert.status}</td>

</tr>

`;

    });

    table += "</table>";

    certificatePrintWindow(
        "Certificate Register",
        table
    );

}

/* ===== assets/js/reports/reports.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/reports/reports.js
 Version : 2.0.0
==================================================*/

const Reports = {

    render() {

        document.getElementById("mainContent").innerHTML = `

<div class="page">

<div class="page-header">

<h2>📊 Reports Center</h2>

</div>

<div class="dashboard-grid">

<div class="dashboard-card">
<h3>Students</h3>
<button class="btn"
onclick="StudentReports.render()">
Open
</button>
</div>

<div class="dashboard-card">
<h3>Teachers</h3>
<button class="btn"
onclick="TeacherReports.render()">
Open
</button>
</div>

<div class="dashboard-card">
<h3>Attendance</h3>
<button class="btn"
onclick="AttendanceReports.render()">
Open
</button>
</div>

<div class="dashboard-card">
<h3>Library</h3>
<button class="btn"
onclick="LibraryReports.render()">
Open
</button>
</div>

<div class="dashboard-card">
<h3>Inventory</h3>
<button class="btn"
onclick="ReportInventory.render()">
Open
</button>
</div>

<div class="dashboard-card">
<h3>Welfare</h3>
<button class="btn"
onclick="WelfareReports.render()">
Open
</button>
</div>

</div>

<div class="card">

<h3>General Reports</h3>

<button class="btn"
onclick="ReportExport.render()">

📤 Export Reports

</button>

<button class="btn"
onclick="ReportPrint.render()">

🖨 Print Reports

</button>

</div>

<div id="reportContent"></div>

</div>

`;

    }

};

/* ===== assets/js/reports/studentReports.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/reports/studentReports.js
 Version : 2.0.0
==================================================*/

const StudentReports = {

    render() {

        const students = Database.getAll(
            CONFIG.STORAGE.STUDENTS || "students"
        );

        document.getElementById("reportContent").innerHTML = `

<div class="card">

<h2>👨‍🎓 Student Reports</h2>

<div class="dashboard-grid">

<div class="dashboard-card">
<h3>Total Students</h3>
<h1>${students.length}</h1>
</div>

</div>

<button class="btn"
onclick="StudentReports.register()">

📋 Student Register

</button>

<button class="btn"
onclick="StudentReports.classWise()">

🏫 Class Wise

</button>

<button class="btn"
onclick="StudentReports.genderWise()">

👦 Gender Wise

</button>

<button class="btn"
onclick="StudentReports.categoryWise()">

📂 Category Wise

</button>

<button class="btn"
onclick="StudentReports.admissionReport()">

📝 Admission Report

</button>

<button class="btn"
onclick="StudentReports.tcReport()">

📜 Transfer Certificate

</button>

<button class="btn"
onclick="StudentReports.strengthReport()">

📊 Strength Summary

</button>

<button class="btn"
onclick="ReportExport.students()">

📤 Export

</button>

<button class="btn"
onclick="ReportPrint.students()">

🖨 Print

</button>

<div id="studentReportArea"></div>

</div>

`;

    },

    register() {

        const students = Database.getAll(
            CONFIG.STORAGE.STUDENTS || "students"
        );

        this.showTable(
            "Student Register",
            students
        );

    },

    classWise() {

        const students = Database.getAll(
            CONFIG.STORAGE.STUDENTS || "students"
        );

        const summary = {};

        students.forEach(student => {

            const cls = student.class || "Not Assigned";

            summary[cls] = (summary[cls] || 0) + 1;

        });

        this.showSummary(
            "Class Wise Report",
            summary
        );

    },

    genderWise() {

        const students = Database.getAll(
            CONFIG.STORAGE.STUDENTS || "students"
        );

        const summary = {};

        students.forEach(student => {

            const gender = student.gender || "Unknown";

            summary[gender] = (summary[gender] || 0) + 1;

        });

        this.showSummary(
            "Gender Wise Report",
            summary
        );

    },

    categoryWise() {

        const students = Database.getAll(
            CONFIG.STORAGE.STUDENTS || "students"
        );

        const summary = {};

        students.forEach(student => {

            const category = student.category || "General";

            summary[category] = (summary[category] || 0) + 1;

        });

        this.showSummary(
            "Category Wise Report",
            summary
        );

    },

    admissionReport() {

        this.register();

    },

    tcReport() {

        document.getElementById("studentReportArea").innerHTML =

        "<h3>Transfer Certificate Report Coming Soon</h3>";

    },

    strengthReport() {

        const students = Database.getAll(
            CONFIG.STORAGE.STUDENTS || "students"
        );

        document.getElementById("studentReportArea").innerHTML = `

<div class="card">

<h3>Total Student Strength</h3>

<h1>${students.length}</h1>

</div>

`;

    },

    showSummary(title, summary) {

        let html = `

<h3>${title}</h3>

<table class="table">

<tr>

<th>Category</th>

<th>Total</th>

</tr>

`;

        Object.keys(summary).forEach(key => {

            html += `

<tr>

<td>${key}</td>

<td>${summary[key]}</td>

</tr>

`;

        });

        html += "</table>";

        document.getElementById(
            "studentReportArea"
        ).innerHTML = html;

    },

    showTable(title, students) {

        let html = `

<h3>${title}</h3>

<table class="table">

<tr>

<th>ID</th>
<th>Name</th>
<th>Class</th>
<th>Gender</th>

</tr>

`;

        if (students.length === 0) {

            html += `

<tr>

<td colspan="4">

No records found.

</td>

</tr>

`;

        } else {

            students.forEach(student => {

                html += `

<tr>

<td>${student.studentId || student.id}</td>

<td>${NameHelper.display(
    student.name,
    students,
    "name"
)}</td>

<td>${student.class || "-"}</td>

<td>${student.gender || "-"}</td>

</tr>

`;

            });

        }

        html += "</table>";

        document.getElementById(
            "studentReportArea"
        ).innerHTML = html;

    }

};

/* ===== assets/js/reports/teacherReports.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/reports/teacherReports.js
 Version : 2.0.0
==================================================*/

const TeacherReports = {

    render() {

        const teachers = Database.getAll(
            CONFIG.STORAGE.TEACHERS || "teachers"
        );

        document.getElementById("reportContent").innerHTML = `

<div class="card">

<h2>👨‍🏫 Teacher Reports</h2>

<div class="dashboard-grid">

<div class="dashboard-card">
<h3>Total Teachers</h3>
<h1>${teachers.length}</h1>
</div>

</div>

<button class="btn"
onclick="TeacherReports.register()">

📋 Teacher Register

</button>

<button class="btn"
onclick="TeacherReports.departmentWise()">

🏢 Department Wise

</button>

<button class="btn"
onclick="TeacherReports.designationWise()">

👔 Designation Wise

</button>

<button class="btn"
onclick="TeacherReports.attendanceSummary()">

📝 Attendance Summary

</button>

<button class="btn"
onclick="TeacherReports.joiningReport()">

📅 Joining Report

</button>

<button class="btn"
onclick="ReportExport.teachers()">

📤 Export

</button>

<button class="btn"
onclick="ReportPrint.teachers()">

🖨 Print

</button>

<div id="teacherReportArea"></div>

</div>

`;

    },

    register() {

        const teachers = Database.getAll(
            CONFIG.STORAGE.TEACHERS || "teachers"
        );

        let html = `

<h3>Teacher Register</h3>

<table class="table">

<tr>

<th>ID</th>
<th>Name</th>
<th>Department</th>
<th>Designation</th>

</tr>

`;

        if (teachers.length === 0) {

            html += `
<tr>
<td colspan="4">No teachers found.</td>
</tr>`;

        } else {

            teachers.forEach(teacher => {

                html += `

<tr>

<td>${teacher.teacherId || teacher.id}</td>

<td>${NameHelper.display(
    teacher.name,
    teachers,
    "name"
)}</td>

<td>${teacher.department || "-"}</td>

<td>${teacher.designation || "-"}</td>

</tr>

`;

            });

        }

        html += "</table>";

        document.getElementById("teacherReportArea").innerHTML = html;

    },

    departmentWise() {

        this.summary(
            "department",
            "Department Wise Report"
        );

    },

    designationWise() {

        this.summary(
            "designation",
            "Designation Wise Report"
        );

    },

    attendanceSummary() {

        const attendance = Database.getAll(
            CONFIG.STORAGE.ATTENDANCE || "attendance"
        );

        const present = attendance.filter(
            a => a.status === "Present"
        ).length;

        const absent = attendance.filter(
            a => a.status === "Absent"
        ).length;

        document.getElementById("teacherReportArea").innerHTML = `

<div class="card">

<h3>Attendance Summary</h3>

<p><strong>Present:</strong> ${present}</p>

<p><strong>Absent:</strong> ${absent}</p>

</div>

`;

    },

    joiningReport() {

        const teachers = Database.getAll(
            CONFIG.STORAGE.TEACHERS || "teachers"
        );

        const sorted = [...teachers].sort((a, b) =>
            new Date(a.joiningDate || 0) -
            new Date(b.joiningDate || 0)
        );

        let html = `

<h3>Joining Report</h3>

<table class="table">

<tr>

<th>Name</th>
<th>Joining Date</th>

</tr>

`;

        sorted.forEach(teacher => {

            html += `

<tr>

<td>${NameHelper.display(
    teacher.name,
    teachers,
    "name"
)}</td>

<td>${teacher.joiningDate || "-"}</td>

</tr>

`;

        });

        html += "</table>";

        document.getElementById("teacherReportArea").innerHTML = html;

    },

    summary(field, title) {

        const teachers = Database.getAll(
            CONFIG.STORAGE.TEACHERS || "teachers"
        );

        const summary = {};

        teachers.forEach(teacher => {

            const key = teacher[field] || "Not Assigned";

            summary[key] = (summary[key] || 0) + 1;

        });

        let html = `

<h3>${title}</h3>

<table class="table">

<tr>

<th>${field.charAt(0).toUpperCase() + field.slice(1)}</th>

<th>Total</th>

</tr>

`;

        Object.keys(summary).forEach(key => {

            html += `

<tr>

<td>${key}</td>

<td>${summary[key]}</td>

</tr>

`;

        });

        html += "</table>";

        document.getElementById("teacherReportArea").innerHTML = html;

    }

};

/* ===== assets/js/reports/attendanceReports.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/reports/attendanceReports.js
 Version : 2.0.0
==================================================*/

const AttendanceReports = {

    render() {

        const attendance = Database.getAll(
    CONFIG.STORAGE.ATTENDANCE || "attendance"
);

let container = document.getElementById("reportContent");

if (!container) {

    Attendance.render();

    container = document.getElementById("attendanceWorkspace");

}

container.innerHTML = `

<div class="card">

<h2>📝 Attendance Reports</h2>

<div class="dashboard-grid">

<div class="dashboard-card">

<h3>Total Records</h3>

<h1>${attendance.length}</h1>

</div>

</div>

<button class="btn"
onclick="AttendanceReports.daily()">

📅 Daily Report

</button>

<button class="btn"
onclick="AttendanceReports.monthly()">

🗓 Monthly Report

</button>

<button class="btn"
onclick="AttendanceReports.studentSummary()">

👨‍🎓 Student Summary

</button>

<button class="btn"
onclick="AttendanceReports.teacherSummary()">

👨‍🏫 Teacher Summary

</button>

<button class="btn"
onclick="AttendanceReports.absentReport()">

❌ Absent Report

</button>

<button class="btn"
onclick="ReportExport.attendance()">

📤 Export

</button>

<button class="btn"
onclick="ReportPrint.attendance()">

🖨 Print

</button>

<div id="attendanceReportArea"></div>

</div>

`;

    },

    daily() {

        const today = new Date()
            .toISOString()
            .split("T")[0];

        const records = Database.getAll(
            CONFIG.STORAGE.ATTENDANCE || "attendance"
        ).filter(item => item.date === today);

        this.showTable(
            "Today's Attendance",
            records
        );

    },

    monthly() {

        const month = new Date()
            .toISOString()
            .substring(0,7);

        const records = Database.getAll(
            CONFIG.STORAGE.ATTENDANCE || "attendance"
        ).filter(item =>
            (item.date || "").startsWith(month)
        );

        this.showTable(
            "Monthly Attendance",
            records
        );

    },

    studentSummary() {

        const records = Database.getAll(
            CONFIG.STORAGE.ATTENDANCE || "attendance"
        ).filter(item =>
            item.type === "Student"
        );

        this.showSummary(
            "Student Attendance Summary",
            records
        );

    },

    teacherSummary() {

        const records = Database.getAll(
            CONFIG.STORAGE.ATTENDANCE || "attendance"
        ).filter(item =>
            item.type === "Teacher"
        );

        this.showSummary(
            "Teacher Attendance Summary",
            records
        );

    },

    absentReport() {

        const records = Database.getAll(
            CONFIG.STORAGE.ATTENDANCE || "attendance"
        ).filter(item =>
            item.status === "Absent"
        );

        this.showTable(
            "Absent Report",
            records
        );

    },

    showSummary(title, records) {

        const summary = {};

        records.forEach(item => {

            const status = item.status || "Unknown";

            summary[status] =
                (summary[status] || 0) + 1;

        });

        let html = `

<h3>${title}</h3>

<table class="table">

<tr>

<th>Status</th>

<th>Total</th>

</tr>

`;

        Object.keys(summary).forEach(key => {

            html += `

<tr>

<td>${key}</td>

<td>${summary[key]}</td>

</tr>

`;

        });

        html += "</table>";

        document.getElementById(
            "attendanceReportArea"
        ).innerHTML = html;

    },

    showTable(title, records) {

        let html = `

<h3>${title}</h3>

<table class="table">

<tr>

<th>Date</th>
<th>Name</th>
<th>Type</th>
<th>Status</th>

</tr>

`;

        if(records.length===0){

            html+=`

<tr>

<td colspan="4">

No records found.

</td>

</tr>

`;

        }else{

            records.forEach(item=>{

                html+=`

<tr>

<td>${item.date||"-"}</td>

<td>${item.name||item.studentName||item.teacherName||"-"}</td>

<td>${item.type||"-"}</td>

<td>${item.status||"-"}</td>

</tr>

`;

            });

        }

        html+="</table>";

        document.getElementById(
            "attendanceReportArea"
        ).innerHTML=html;

    }

};

/* ===== assets/js/reports/inventoryReports.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/reports/inventoryReports.js
 Version : 2.0.0
==================================================*/

const ReportInventory = {

    render() {

        const items = Database.getAll(
            CONFIG.STORAGE.INVENTORY || "inventory"
        );

        document.getElementById("reportContent").innerHTML = `

<div class="card">

<h2>📦 Inventory Reports</h2>

<div class="dashboard-grid">

<div class="dashboard-card">

<h3>Total Items</h3>

<h1>${items.length}</h1>

</div>

</div>

<button class="btn"
onclick="ReportInventory.itemRegister()">

📋 Item Register

</button>

<button class="btn"
onclick="ReportInventory.categoryWise()">

📂 Category Wise

</button>

<button class="btn"
onclick="ReportInventory.stockSummary()">

📊 Stock Summary

</button>

<button class="btn"
onclick="ReportInventory.lowStock()">

⚠ Low Stock

</button>

<button class="btn"
onclick="ReportInventory.issuedItems()">

📤 Issued Items

</button>

<button class="btn"
onclick="ReportInventory.returnedItems()">

📥 Returned Items

</button>

<button class="btn"
onclick="ReportExport.inventory()">

📤 Export

</button>

<button class="btn"
onclick="ReportPrint.inventory()">

🖨 Print

</button>

<div id="inventoryReportArea"></div>

</div>

`;

    },

    itemRegister() {

        const items = Database.getAll(
            CONFIG.STORAGE.INVENTORY || "inventory"
        );

        this.showTable(
            "Inventory Register",
            items
        );

    },

    categoryWise() {

        const items = Database.getAll(
            CONFIG.STORAGE.INVENTORY || "inventory"
        );

        const summary = {};

        items.forEach(item => {

            const category =
                item.category || "Others";

            summary[category] =
                (summary[category] || 0) + 1;

        });

        this.showSummary(
            "Category Wise Inventory",
            summary
        );

    },

    stockSummary() {

        const items = Database.getAll(
            CONFIG.STORAGE.INVENTORY || "inventory"
        );

        let total = 0;

        items.forEach(item => {

            total += Number(item.quantity || 0);

        });

        document.getElementById(
            "inventoryReportArea"
        ).innerHTML = `

<div class="card">

<h3>Total Stock Available</h3>

<h1>${total}</h1>

</div>

`;

    },

    lowStock() {

        const items = Database.getAll(
            CONFIG.STORAGE.INVENTORY || "inventory"
        );

        const low = items.filter(item =>
            Number(item.quantity || 0) <= 5
        );

        this.showTable(
            "Low Stock Items",
            low
        );

    },

    issuedItems() {

        const issued = Database.getAll(
            CONFIG.STORAGE.INVENTORY_ISSUES || "inventoryIssues"
        ).filter(item =>
            item.status === "Issued"
        );

        this.showIssueTable(
            "Issued Items",
            issued
        );

    },

    returnedItems() {

        const returned = Database.getAll(
            CONFIG.STORAGE.INVENTORY_ISSUES || "inventoryIssues"
        ).filter(item =>
            item.status === "Returned"
        );

        this.showIssueTable(
            "Returned Items",
            returned
        );

    },

    showSummary(title, summary) {

        let html = `

<h3>${title}</h3>

<table class="table">

<tr>

<th>Category</th>

<th>Total</th>

</tr>

`;

        Object.keys(summary).forEach(key => {

            html += `

<tr>

<td>${key}</td>

<td>${summary[key]}</td>

</tr>

`;

        });

        html += "</table>";

        document.getElementById(
            "inventoryReportArea"
        ).innerHTML = html;

    },

    showTable(title, items) {

        let html = `

<h3>${title}</h3>

<table class="table">

<tr>

<th>Item ID</th>
<th>Item Name</th>
<th>Category</th>
<th>Quantity</th>

</tr>

`;

        if (items.length === 0) {

            html += `

<tr>

<td colspan="4">

No records found.

</td>

</tr>

`;

        } else {

            items.forEach(item => {

                html += `

<tr>

<td>${item.id}</td>

<td>${item.itemName}</td>

<td>${item.category}</td>

<td>${item.quantity}</td>

</tr>

`;

            });

        }

        html += "</table>";

        document.getElementById(
            "inventoryReportArea"
        ).innerHTML = html;

    },

    showIssueTable(title, items) {

        let html = `

<h3>${title}</h3>

<table class="table">

<tr>

<th>Item</th>
<th>Issued To</th>
<th>Quantity</th>
<th>Status</th>

</tr>

`;

        if (items.length === 0) {

            html += `

<tr>

<td colspan="4">

No records found.

</td>

</tr>

`;

        } else {

            items.forEach(item => {

                html += `

<tr>

<td>${item.itemName}</td>

<td>${item.issueTo}</td>

<td>${item.quantity}</td>

<td>${item.status}</td>

</tr>

`;

            });

        }

        html += "</table>";

        document.getElementById(
            "inventoryReportArea"
        ).innerHTML = html;

    }

};

/* ===== assets/js/reports/welfareReports.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/reports/welfareReports.js
 Version : 2.0.0
==================================================*/

const WelfareReports = {

    render() {

        const beneficiaries = Database.getAll(
            CONFIG.STORAGE.WELFARE || "welfare"
        );

        document.getElementById("reportContent").innerHTML = `

<div class="card">

<h2>🎁 Welfare Reports</h2>

<div class="dashboard-grid">

<div class="dashboard-card">

<h3>Total Beneficiaries</h3>

<h1>${beneficiaries.length}</h1>

</div>

</div>

<button class="btn"
onclick="WelfareReports.beneficiaryRegister()">

📋 Beneficiary Register

</button>

<button class="btn"
onclick="WelfareReports.schemeWise()">

📂 Scheme Wise

</button>

<button class="btn"
onclick="WelfareReports.genderWise()">

👥 Gender Wise

</button>

<button class="btn"
onclick="WelfareReports.distributionSummary()">

📊 Distribution Summary

</button>

<button class="btn"
onclick="WelfareReports.donationUtilization()">

💝 Donation Utilization

</button>

<button class="btn"
onclick="ReportExport.welfare()">

📤 Export

</button>

<button class="btn"
onclick="ReportPrint.welfare()">

🖨 Print

</button>

<div id="welfareReportArea"></div>

</div>

`;

    },

    beneficiaryRegister() {

        const data = Database.getAll(
            CONFIG.STORAGE.WELFARE || "welfare"
        );

        this.showTable(
            "Beneficiary Register",
            data
        );

    },

    schemeWise() {

        const data = Database.getAll(
            CONFIG.STORAGE.WELFARE || "welfare"
        );

        const summary = {};

        data.forEach(item => {

            const scheme =
                item.scheme || "General";

            summary[scheme] =
                (summary[scheme] || 0) + 1;

        });

        this.showSummary(
            "Scheme Wise Report",
            summary
        );

    },

    genderWise() {

        const data = Database.getAll(
            CONFIG.STORAGE.WELFARE || "welfare"
        );

        const summary = {};

        data.forEach(item => {

            const gender =
                item.gender || "Unknown";

            summary[gender] =
                (summary[gender] || 0) + 1;

        });

        this.showSummary(
            "Gender Wise Report",
            summary
        );

    },

    distributionSummary() {

        const data = Database.getAll(
            CONFIG.STORAGE.WELFARE || "welfare"
        );

        let total = data.length;

        document.getElementById(
            "welfareReportArea"
        ).innerHTML = `

<div class="card">

<h3>Total Distribution</h3>

<h1>${total}</h1>

</div>

`;

    },

    donationUtilization() {

        const data = Database.getAll(
            CONFIG.STORAGE.WELFARE || "welfare"
        );

        let amount = 0;

        data.forEach(item => {

            amount += Number(
                item.amount || 0
            );

        });

        document.getElementById(
            "welfareReportArea"
        ).innerHTML = `

<div class="card">

<h3>Donation Utilization</h3>

<h1>₹ ${amount}</h1>

</div>

`;

    },

    showSummary(title, summary) {

        let html = `

<h3>${title}</h3>

<table class="table">

<tr>

<th>Category</th>

<th>Total</th>

</tr>

`;

        Object.keys(summary).forEach(key => {

            html += `

<tr>

<td>${key}</td>

<td>${summary[key]}</td>

</tr>

`;

        });

        html += "</table>";

        document.getElementById(
            "welfareReportArea"
        ).innerHTML = html;

    },

    showTable(title, data) {

        let html = `

<h3>${title}</h3>

<table class="table">

<tr>

<th>ID</th>
<th>Name</th>
<th>Scheme</th>
<th>Amount</th>

</tr>

`;

        if (data.length === 0) {

            html += `

<tr>

<td colspan="4">

No records found.

</td>

</tr>

`;

        } else {

            data.forEach(item => {

                html += `

<tr>

<td>${item.id || "-"}</td>

<td>${item.name || "-"}</td>

<td>${item.scheme || "-"}</td>

<td>₹ ${item.amount || 0}</td>

</tr>

`;

            });

        }

        html += "</table>";

        document.getElementById(
            "welfareReportArea"
        ).innerHTML = html;

    }

};

/* ===== assets/js/reports/export.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/reports/reportExport.js
 Version : 2.0.0
==================================================*/

const ReportExport = {

    exportData(storageKey, fileName) {

        const data = Database.getAll(storageKey);

        if (data.length === 0) {

            alert("No records available.");

            return;

        }

        const headers = Object.keys(data[0]);

        let csv = headers.join(",") + "\n";

        data.forEach(row => {

            csv += headers.map(key => {

                let value = row[key] ?? "";

                value = String(value).replace(/"/g, '""');

                return `"${value}"`;

            }).join(",");

            csv += "\n";

        });

        const blob = new Blob(
            [csv],
            {
                type: "text/csv;charset=utf-8;"
            }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = fileName + ".csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

    },

    students() {

        this.exportData(
            CONFIG.STORAGE.STUDENTS || "students",
            "Student_Report"
        );

    },

    teachers() {

        this.exportData(
            CONFIG.STORAGE.TEACHERS || "teachers",
            "Teacher_Report"
        );

    },

    attendance() {

        this.exportData(
            CONFIG.STORAGE.ATTENDANCE || "attendance",
            "Attendance_Report"
        );

    },

    library() {

        this.exportData(
            CONFIG.STORAGE.LIBRARY || "library",
            "Library_Report"
        );

    },

    inventory() {

        this.exportData(
            CONFIG.STORAGE.INVENTORY || "inventory",
            "Inventory_Report"
        );

    },

    welfare() {

        this.exportData(
            CONFIG.STORAGE.WELFARE || "welfare",
            "Welfare_Report"
        );

    },

    users() {

        this.exportData(
            CONFIG.STORAGE.USERS || "users",
            "Users_Report"
        );

    },

    results() {

        this.exportData(
            CONFIG.STORAGE.RESULTS || "results",
            "Results_Report"
        );

    },

    render() {

        alert(
            "Select any module report and click Export."
        );

    }

};

/* ===== assets/js/reports/print.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/reports/reportPrint.js
 Version : 2.0.0
==================================================*/

const ReportPrint = {

    print(title, storageKey) {

        const data = Database.getAll(storageKey);

        if (data.length === 0) {

            alert("No records available.");

            return;

        }

        const headers = Object.keys(data[0]);

        let html = `

<!DOCTYPE html>

<html>

<head>

<title>${title}</title>

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
padding:6px;
font-size:12px;
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

<h2>${title}</h2>

<h3>Generated On : ${new Date().toLocaleString()}</h3>

<table>

<tr>

`;

        headers.forEach(header => {

            html += `<th>${header}</th>`;

        });

        html += "</tr>";

        data.forEach(row => {

            html += "<tr>";

            headers.forEach(header => {

                html += `<td>${row[header] ?? ""}</td>`;

            });

            html += "</tr>";

        });

        html += `

</table>

<div class="footer">

<div>

Prepared By

<br><br><br>

____________________

</div>

<div>

Authorized Signatory

<br><br><br>

____________________

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

    },

    students() {

        this.print(
            "Student Report",
            CONFIG.STORAGE.STUDENTS || "students"
        );

    },

    teachers() {

        this.print(
            "Teacher Report",
            CONFIG.STORAGE.TEACHERS || "teachers"
        );

    },

    attendance() {

        this.print(
            "Attendance Report",
            CONFIG.STORAGE.ATTENDANCE || "attendance"
        );

    },

    library() {

        this.print(
            "Library Report",
            CONFIG.STORAGE.LIBRARY || "library"
        );

    },

    inventory() {

        this.print(
            "Inventory Report",
            CONFIG.STORAGE.INVENTORY || "inventory"
        );

    },

    welfare() {

        this.print(
            "Welfare Report",
            CONFIG.STORAGE.WELFARE || "welfare"
        );

    },

    users() {

        this.print(
            "Users Report",
            CONFIG.STORAGE.USERS || "users"
        );

    },

    results() {

        this.print(
            "Results Report",
            CONFIG.STORAGE.RESULTS || "results"
        );

    },

    render() {

        alert(
            "Open any report module and click Print."
        );

    }

};