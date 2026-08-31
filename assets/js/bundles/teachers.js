
/* ===== assets/js/teachers/teachers.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/teachers/teachers.js
==================================================*/

const Teachers = {

    /*==========================================
      Teacher Home
    ==========================================*/
    render() {

        let html = `

<div class="page">

<div class="page-header">

<h2>👨‍🏫 Teachers Management</h2>

</div>

<div class="card">

<button class="btn"
onclick="Teachers.newTeacher()">

➕ New Teacher

</button>

<button class="btn"
onclick="Teachers.teacherList()">

📋 Teacher List

</button>

<button class="btn"
onclick="Teachers.searchTeacher()">

🔍 Search

</button>

<button class="btn"
onclick="Teachers.printTeachers()">

🖨 Print

</button>

</div>

<div id="teacherWorkspace">

<div class="card">

<h3>Welcome</h3>

<p>

Manage teacher records, attendance,
documents and profiles from here.

</p>

</div>

</div>

</div>

`;

        document.getElementById("mainContent").innerHTML = html;

    },

    /*==========================================
      New Teacher
    ==========================================*/
    newTeacher() {

        if (typeof teacherForm === "function") {

            teacherForm();

        } else {

            document.getElementById("teacherWorkspace").innerHTML =

            "<div class='card'><h3>Teacher Form Not Available</h3></div>";

        }

    },

    /*==========================================
      Teacher List
    ==========================================*/
    teacherList() {

        if (typeof showTeacherList === "function") {

            showTeacherList();

        } else {

            document.getElementById("teacherWorkspace").innerHTML =

            "<div class='card'><h3>No Teacher Records</h3></div>";

        }

    },

    /*==========================================
      Search Teacher
    ==========================================*/
    searchTeacher() {

    const keyword = prompt("Enter Teacher Name or Mobile:");

    if (!keyword) return;

    const teachers = Database.getAll(
        CONFIG.STORAGE.TEACHERS || "teachers"
    );

    const result = teachers.filter(t =>
        (t.teacherName || "").toLowerCase().includes(keyword.toLowerCase()) ||
        (t.mobile || "").includes(keyword)
    );

    let html = "<div class='card'><h3>Search Result</h3>";

    if (result.length === 0) {

        html += "<p>No teacher found.</p>";

    } else {

        html += `
<table class="table">
<tr>
    <th>Name</th>
    <th>Mobile</th>
    <th>Subject</th>
</tr>
`;

        result.forEach(t => {

            html += `<tr>
                <td>${t.name || "-"}</td>
                <td>${t.mobile || "-"}</td>
                <td>${t.subject || "-"}</td>
            </tr>`;

        });

        html += "</table>";

    }

    html += "</div>";

    document.getElementById("teacherWorkspace").innerHTML = html;

},

    /*==========================================
      Print
    ==========================================*/
    printTeachers() {

        window.print();

    }

};

/* ===== assets/js/teachers/form.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/teachers/form.js
 Version : 3.1.0
==================================================*/

function teacherForm() {

document.getElementById("teacherWorkspace").innerHTML = `

<div class="card">

<h3>👨‍🏫 New Teacher Registration</h3>

<table class="form-table">

<tr>

<td width="220">Teacher ID</td>

<td>

<input
type="text"
id="teacherId"
readonly>

</td>

</tr>

<tr>

<td>Employee ID</td>

<td>

<input
type="text"
id="employeeId">

</td>

</tr>

<tr>

<td>Joining Date <span style="color:red;">*</span></td>

<td>

<input
type="date"
id="joiningDate"
required>

</td>

</tr>

<tr>

<td>Teacher Name <span style="color:red;">*</span></td>

<td>

<input
type="text"
id="teacherName"
placeholder="Enter Teacher Name"
required>

</td>

</tr>

<tr>

<td>Gender <span style="color:red;">*</span></td>

<td>

<select
id="gender"
required>

<option value="">Select</option>

<option>Male</option>

<option>Female</option>

<option>Other</option>

</select>

</td>

</tr>

<tr>

<td>Date of Birth <span style="color:red;">*</span></td>

<td>

<input
type="date"
id="dob"
required>

</td>

</tr>

<tr>

<td>Qualification <span style="color:red;">*</span></td>

<td>

<input
type="text"
id="qualification"
placeholder="Highest Qualification"
required>

</td>

</tr>

<tr>

<td>Designation <span style="color:red;">*</span></td>

<td>

<input
type="text"
id="designation"
placeholder="Designation"
required>

</td>

</tr>

<tr>

<td>Teacher Type <span style="color:red;">*</span></td>

<td>

<select
id="teacherType"
required>

<option value="">Select</option>

<option>Paid</option>

<option>Honorary</option>

</select>

</td>

</tr>

<tr>

<td>Subject</td>

<td>

<input
type="text"
id="subject">

</td>

</tr>

<tr>

<td>Experience (Years)</td>

<td>

<input
type="number"
id="experience"
min="0">

</td>

</tr>

<tr>

<td>Mobile <span style="color:red;">*</span></td>

<td>

<input
type="text"
id="mobile"
maxlength="10"
required>

</td>

</tr>

<tr>

<td>Email</td>

<td>

<input
type="email"
id="email">

</td>

</tr>

<tr>

<td>Aadhaar No. <span style="color:red;">*</span></td>

<td>

<input
type="text"
id="aadhaar"
maxlength="12"
placeholder="12 Digit Aadhaar"
required>

</td>

</tr>

<tr>

<td>Blood Group</td>

<td>

<select id="bloodGroup">

<option value="">Select</option>

<option>A+</option>
<option>A-</option>
<option>B+</option>
<option>B-</option>
<option>AB+</option>
<option>AB-</option>
<option>O+</option>
<option>O-</option>

</select>

</td>

</tr>

<tr>

<td>Address</td>

<td>

<textarea
id="address"
rows="3"></textarea>

</td>

</tr>

<tr>

<td>Teacher Photo <span style="color:red;">*</span></td>

<td>

<input
type="file"
id="teacherPhoto"
accept="image/*"
required>

</td>

</tr>

<tr>

<td>Aadhaar Card <span style="color:red;">*</span></td>

<td>

<input
type="file"
id="aadhaarCard"
accept=".jpg,.jpeg,.png,.pdf"
required>

</td>

</tr>

<tr>

<td>PAN Card</td>

<td>

<input
type="file"
id="panCard"
accept=".jpg,.jpeg,.png,.pdf">

</td>

</tr>

<tr>

<td>Educational Documents <span style="color:red;">*</span></td>

<td>

<input
type="file"
id="qualificationCertificate"
accept=".jpg,.jpeg,.png,.pdf"
multiple
required>

<br>

<small>

Upload Graduation / B.Ed / D.El.Ed / M.Ed / CTET etc.

</small>

</td>

</tr>

<tr>

<td>Status</td>

<td>

<select id="status">

<option selected>Active</option>

<option>Inactive</option>

<option>Retired</option>

<option>Resigned</option>

</select>

</td>

</tr>

</table>

<br>

<button
class="btn"
onclick="saveTeacher()">

💾 Save Teacher

</button>

<button
class="btn"
onclick="Teachers.render()">

❌ Cancel

</button>

</div>

`;

document.getElementById("teacherId").value =
Utils.nextTeacherId();

document.getElementById("joiningDate").value =
Utils.currentDate();

}

/* ===== assets/js/teachers/save.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/teachers/save.js
 Version : 3.1.0
==================================================*/

async function saveTeacher() {

    /*------------------------------------------
      Collect Documents
    ------------------------------------------*/

    let photo = "";
    let aadhaarCard = "";
    let panCard = "";
    let qualificationCertificate = [];

    const photoInput =
        document.getElementById("teacherPhoto");

    if (photoInput.files.length > 0) {

        photo = await Utils.fileToBase64(
            photoInput.files[0]
        );

    }

    const aadhaarInput =
        document.getElementById("aadhaarCard");

    if (aadhaarInput.files.length > 0) {

        aadhaarCard = await Utils.fileToBase64(
            aadhaarInput.files[0]
        );

    }

    const panInput =
        document.getElementById("panCard");

    if (panInput.files.length > 0) {

        panCard = await Utils.fileToBase64(
            panInput.files[0]
        );

    }

    const qualificationInput =
        document.getElementById(
            "qualificationCertificate"
        );

    if (
        qualificationInput &&
        qualificationInput.files.length > 0
    ) {

        for (
            let i = 0;
            i < qualificationInput.files.length;
            i++
        ) {

            qualificationCertificate.push(

                await Utils.fileToBase64(

                    qualificationInput.files[i]

                )

            );

        }

    }

    /*------------------------------------------
      Teacher Object
    ------------------------------------------*/

    const teacher = {

        teacherId:
            document.getElementById("teacherId").value.trim(),

        employeeId:
            document.getElementById("employeeId").value.trim(),

        joiningDate:
            document.getElementById("joiningDate").value,

        teacherName:
            document.getElementById("teacherName").value.trim(),

        faceId: "",

        gender:
            document.getElementById("gender").value,

        dob:
            document.getElementById("dob").value,

        qualification:
            document.getElementById("qualification").value.trim(),

        designation:
            document.getElementById("designation").value.trim(),

        teacherType:
            document.getElementById("teacherType").value,

        subject:
            document.getElementById("subject").value.trim(),

        experience:
            document.getElementById("experience").value,

        mobile:
            document.getElementById("mobile").value.trim(),

        email:
            document.getElementById("email").value.trim(),

        aadhaar:
            document.getElementById("aadhaar").value.trim(),

        bloodGroup:
            document.getElementById("bloodGroup").value,

        address:
            document.getElementById("address").value.trim(),

        photo,

        aadhaarCard,

        panCard,

        qualificationCertificate,

        status:
            document.getElementById("status").value,

        createdOn:
            Utils.currentDateTime(),

        updatedOn:
            Utils.currentDateTime()

    };

    /*------------------------------------------
      Mandatory Validation
    ------------------------------------------*/

    if (!teacher.joiningDate) {

        Utils.message("Joining Date is required.");

        return;

    }

    if (Utils.isEmpty(teacher.teacherName)) {

        Utils.message("Teacher Name is required.");

        return;

    }

    if (!teacher.gender) {

        Utils.message("Please select Gender.");

        return;

    }

    if (!teacher.dob) {

        Utils.message("Date of Birth is required.");

        return;

    }

    if (Utils.isEmpty(teacher.qualification)) {

        Utils.message("Qualification is required.");

        return;

    }

    if (Utils.isEmpty(teacher.designation)) {

        Utils.message("Designation is required.");

        return;

    }

    if (!teacher.teacherType) {

        Utils.message("Please select Teacher Type.");

        return;

    }

    if (Utils.isEmpty(teacher.mobile)) {

        Utils.message("Mobile Number is required.");

        return;

    }

    if (!Utils.validMobile(teacher.mobile)) {

        Utils.message("Invalid Mobile Number.");

        return;

    }

    if (
        teacher.email &&
        !Utils.validEmail(teacher.email)
    ) {

        Utils.message("Invalid Email Address.");

        return;

    }

    if (!teacher.aadhaar) {

        Utils.message("Aadhaar Number is required.");

        return;

    }

    if (!Utils.validAadhaar(teacher.aadhaar)) {

        Utils.message("Invalid Aadhaar Number.");

        return;

    }

    if (!photo) {

        Utils.message("Teacher Photo is mandatory.");

        return;

    }

    if (!aadhaarCard) {

        Utils.message("Aadhaar Card is mandatory.");

        return;

    }

    if (
        qualificationCertificate.length === 0
    ) {

        Utils.message("Educational Documents are mandatory.");

        return;

    }

    /*------------------------------------------
      Duplicate Teacher Check
    ------------------------------------------*/

    const existing = Database.find(

        CONFIG.STORAGE.TEACHERS,

        "teacherId",

        teacher.teacherId

    );

    if (existing) {

        Utils.message("Teacher ID already exists.");

        return;

    }

    /*------------------------------------------
      Save
    ------------------------------------------*/

    Database.insert(

        CONFIG.STORAGE.TEACHERS,

        teacher

    );

    Utils.message(

        "Teacher saved successfully."

    );

    Teachers.teacherList();

}

/* ===== assets/js/teachers/list.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/teachers/list.js
==================================================*/

function showTeacherList() {

    const teachers = Database.getAll(CONFIG.STORAGE.TEACHERS);

    let html = `

<div class="card">

<h3>

Teacher List
(${teachers.length})

</h3>

<input
type="text"
id="teacherSearchBox"
placeholder="Search Teacher..."
onkeyup="filterTeacherList()"
class="search-box">

<br><br>

<table class="table">

<thead>

<tr>

<th>#</th>

<th>Teacher ID</th>

<th>Name</th>

<th>Designation</th>

<th>Subject</th>

<th>Mobile</th>

<th>Status</th>

<th width="220">

Action

</th>

</tr>

</thead>

<tbody id="teacherTableBody">

`;

    if (teachers.length === 0) {

        html += `

<tr>

<td colspan="8">

No Teacher Found

</td>

</tr>

`;

    }

    teachers.forEach((teacher, index) => {

        html += `

<tr>

<td>${index + 1}</td>

<td>${teacher.teacherId}</td>

<td>${NameHelper.display(
    teacher.teacherName,
    teachers,
    "teacherName"
)}</td>

<td>${teacher.designation}</td>

<td>${teacher.subject}</td>

<td>${teacher.mobile}</td>

<td>${teacher.status}</td>

<td>

<button
class="btn"
onclick="viewTeacher(${index})">

👁

</button>

<button
class="btn"
onclick="editTeacher(${index})">

✏

</button>

<button
class="btn"
onclick="deleteTeacher(${index})">

🗑

</button>

</td>

</tr>

`;

    });

    html += `

</tbody>

</table>

</div>

`;

    document.getElementById("teacherWorkspace").innerHTML = html;

}

/*==========================================
 Search Teacher List
==========================================*/

function filterTeacherList() {

    const keyword = document
        .getElementById("teacherSearchBox")
        .value
        .toLowerCase();

    const rows = document.querySelectorAll(
        "#teacherTableBody tr"
    );

    rows.forEach(row => {

        row.style.display =
            row.innerText.toLowerCase().includes(keyword)
            ? ""
            : "none";

    });

}

/* ===== assets/js/teachers/view.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/teachers/view.js
==================================================*/

function viewTeacher(index) {

    const teachers = Database.getAll(CONFIG.STORAGE.TEACHERS);

    const teacher = teachers[index];

    if (!teacher) {

        Utils.message("Teacher record not found.");

        return;

    }

    document.getElementById("teacherWorkspace").innerHTML = `

<div class="card">

<h2>👨‍🏫 Teacher Profile</h2>

<table class="table">

<tr><td width="220"><b>Teacher ID</b></td><td>${teacher.teacherId}</td></tr>

<tr><td><b>Employee ID</b></td><td>${teacher.employeeId}</td></tr>

<tr><td><b>Name</b></td><td>${NameHelper.display(
    teacher.teacherName,
    teachers,
    "teacherName"
)}</td></tr>

<tr><td><b>Joining Date</b></td><td>${teacher.joiningDate}</td></tr>

<tr><td><b>Gender</b></td><td>${teacher.gender}</td></tr>

<tr><td><b>Date of Birth</b></td><td>${teacher.dob}</td></tr>

<tr><td><b>Qualification</b></td><td>${teacher.qualification}</td></tr>

<tr><td><b>Designation</b></td><td>${teacher.designation}</td></tr>

<tr><td><b>Subject</b></td><td>${teacher.subject}</td></tr>

<tr><td><b>Experience</b></td><td>${teacher.experience} Years</td></tr>

<tr><td><b>Mobile</b></td><td>${teacher.mobile}</td></tr>

<tr><td><b>Email</b></td><td>${teacher.email}</td></tr>

<tr><td><b>Aadhaar</b></td><td>${teacher.aadhaar}</td></tr>

<tr><td><b>Address</b></td><td>${teacher.address}</td></tr>

<tr><td><b>Status</b></td><td>${teacher.status}</td></tr>

<tr><td><b>Created On</b></td><td>${teacher.createdOn}</td></tr>

<tr><td><b>Updated On</b></td><td>${teacher.updatedOn}</td></tr>

</table>

<br>

<!--
<button
class="btn"
onclick="FaceRegistration.teacher('${teacher.teacherId}')">

📷 Register Face

</button>
-->

<button class="btn"
onclick="editTeacher(${index})">

✏ Edit

</button>

<button class="btn"
onclick="showTeacherList()">

⬅ Back

</button>

</div>

`;

}

/* ===== assets/js/teachers/edit.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/teachers/edit.js
==================================================*/

function editTeacher(index) {

    const teachers = Database.getAll(CONFIG.STORAGE.TEACHERS);

    const teacher = teachers[index];

    if (!teacher) {

        Utils.message("Teacher record not found.");

        return;

    }

    teacherForm();

    document.getElementById("teacherId").value = teacher.teacherId;
    document.getElementById("employeeId").value = teacher.employeeId;
    document.getElementById("joiningDate").value = teacher.joiningDate;
    document.getElementById("teacherName").value = teacher.teacherName;
    document.getElementById("gender").value = teacher.gender;
    document.getElementById("dob").value = teacher.dob;
    document.getElementById("qualification").value = teacher.qualification;
    document.getElementById("designation").value = teacher.designation;
    document.getElementById("subject").value = teacher.subject;
    document.getElementById("experience").value = teacher.experience;
    document.getElementById("mobile").value = teacher.mobile;
    document.getElementById("email").value = teacher.email;
    document.getElementById("aadhaar").value = teacher.aadhaar;
    document.getElementById("address").value = teacher.address;
    document.getElementById("photoUrl").value = teacher.photoUrl;
    document.getElementById("aadhaarUrl").value = teacher.aadhaarUrl;
    document.getElementById("qualificationUrl").value = teacher.qualificationUrl;
    document.getElementById("status").value = teacher.status;

    /*------------------------------------------
      Replace Save Button
    ------------------------------------------*/

    const buttons = document.querySelector("#teacherWorkspace .card");

    buttons.innerHTML += `

    <br>

    <button class="btn"
    onclick="updateTeacher(${index})">

    ✅ Update Teacher

    </button>

    `;

}

/*==========================================
 Update Teacher
==========================================*/

function updateTeacher(index) {

    const teachers = Database.getAll(CONFIG.STORAGE.TEACHERS);

    teachers[index] = {

        teacherId: document.getElementById("teacherId").value.trim(),
        employeeId: document.getElementById("employeeId").value.trim(),
        joiningDate: document.getElementById("joiningDate").value,
        teacherName: document.getElementById("teacherName").value.trim(),
        gender: document.getElementById("gender").value,
        dob: document.getElementById("dob").value,
        qualification: document.getElementById("qualification").value.trim(),
        designation: document.getElementById("designation").value.trim(),
        subject: document.getElementById("subject").value.trim(),
        experience: document.getElementById("experience").value,
        mobile: document.getElementById("mobile").value.trim(),
        email: document.getElementById("email").value.trim(),
        aadhaar: document.getElementById("aadhaar").value.trim(),
        address: document.getElementById("address").value.trim(),
        photoUrl: document.getElementById("photoUrl").value.trim(),
        aadhaarUrl: document.getElementById("aadhaarUrl").value.trim(),
        qualificationUrl: document.getElementById("qualificationUrl").value.trim(),
        status: document.getElementById("status").value,
        createdOn: teachers[index].createdOn,
        updatedOn: Utils.currentDateTime()

    };

    StorageManager.save(

        CONFIG.STORAGE.TEACHERS,

        teachers

    );

    Utils.message("Teacher updated successfully.");

    showTeacherList();

}

/* ===== assets/js/teachers/delete.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/teachers/delete.js
==================================================*/

function deleteTeacher(index) {

    const teachers = Database.getAll(CONFIG.STORAGE.TEACHERS);

    if (!teachers[index]) {

        Utils.message("Teacher record not found.");

        return;

    }

    const teacher = teachers[index];

    const confirmDelete = Utils.confirm(

        "Delete teacher '" +

        teacher.teacherName +

        "' ?"

    );

    if (!confirmDelete) {

        return;

    }

    /*------------------------------------------
      Remove Record
    ------------------------------------------*/

    teachers.splice(index, 1);

    StorageManager.save(

        CONFIG.STORAGE.TEACHERS,

        teachers

    );

    Utils.message("Teacher deleted successfully.");

    showTeacherList();

}

/* ===== assets/js/teachers/attendance.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/teachers/attendance.js
==================================================*/

function teacherAttendancePage() {

    const teachers = Database.getAll(CONFIG.STORAGE.TEACHERS);

    let html = `

<div class="card">

<h2>👨‍🏫 Teacher Attendance</h2>

<p>

Date :
<input
type="date"
id="attendanceDate"
value="${Utils.currentDate()}">

</p>

<table class="table">

<thead>

<tr>

<th>#</th>

<th>Teacher ID</th>

<th>Name</th>

<th>Designation</th>

<th>Status</th>

</tr>

</thead>

<tbody>

`;

    teachers.forEach((teacher, index) => {

        html += `

<tr>

<td>${index + 1}</td>

<td>${teacher.teacherId}</td>

<td>${teacher.teacherName}</td>

<td>${teacher.designation}</td>

<td>

<select id="attendance_${index}">

<option value="Present">Present</option>

<option value="Absent">Absent</option>

<option value="Leave">Leave</option>

<option value="Half Day">Half Day</option>

</select>

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
onclick="saveTeacherAttendance()">

💾 Save Attendance

</button>

<button
class="btn"
onclick="Teachers.render()">

⬅ Back

</button>

</div>

`;

    document.getElementById("teacherWorkspace").innerHTML = html;

}

/*==========================================
 Save Teacher Attendance
==========================================*/

function saveTeacherAttendance() {

    const attendanceDate =
        document.getElementById("attendanceDate").value;

    const teachers =
        Database.getAll(CONFIG.STORAGE.TEACHERS);

    let attendance =
        Database.getAll(CONFIG.STORAGE.ATTENDANCE);

    teachers.forEach((teacher, index) => {

        attendance.push({

            attendanceId: Utils.uuid(),

            type: "Teacher",

            date: attendanceDate,

            teacherId: teacher.teacherId,

            teacherName: teacher.teacherName,

            designation: teacher.designation,

            status: document.getElementById(
                "attendance_" + index
            ).value,

            createdOn: Utils.currentDateTime()

        });

    });

    StorageManager.save(

        CONFIG.STORAGE.ATTENDANCE,

        attendance

    );

    Utils.message("Teacher attendance saved successfully.");

    Teachers.render();

}

/* ===== assets/js/teachers/print.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/teachers/print.js
==================================================*/

/*==========================================
 Print Teacher List
==========================================*/

function printTeachers() {

    const teachers = Database.getAll(CONFIG.STORAGE.TEACHERS);

    let html = `

<html>

<head>

<title>Teacher List</title>

<style>

body{

font-family:Arial,sans-serif;

margin:20px;

}

h2{

text-align:center;

margin-bottom:20px;

}

table{

width:100%;

border-collapse:collapse;

}

th,td{

border:1px solid #000;

padding:8px;

font-size:14px;

}

th{

background:#eeeeee;

}

.footer{

margin-top:30px;

text-align:right;

font-size:12px;

}

</style>

</head>

<body>

<h2>

${CONFIG.SCHOOL_NAME}

<br>

Teacher List

</h2>

<table>

<tr>

<th>S.No.</th>

<th>Teacher ID</th>

<th>Name</th>

<th>Designation</th>

<th>Subject</th>

<th>Mobile</th>

<th>Status</th>

</tr>

`;

    teachers.forEach((teacher, index) => {

        html += `

<tr>

<td>${index + 1}</td>

<td>${teacher.teacherId}</td>

<td>${NameHelper.display(
    teacher.teacherName,
    teachers,
    "teacherName"
)}</td>

<td>${teacher.designation}</td>

<td>${teacher.subject}</td>

<td>${teacher.mobile}</td>

<td>${teacher.status}</td>

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
 Print Teacher Profile
==========================================*/

function printTeacherProfile(index) {

    const teachers = Database.getAll(CONFIG.STORAGE.TEACHERS);

    const teacher = teachers[index];

    if (!teacher) {

        Utils.message("Teacher record not found.");

        return;

    }

    const win = window.open("", "_blank");

    win.document.write(`

<html>

<head>

<title>Teacher Profile</title>

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

h2{

text-align:center;

}

</style>

</head>

<body>

<h2>${CONFIG.SCHOOL_NAME}</h2>

<h3 align="center">

Teacher Profile

</h3>

<table>

<tr><td width="220">Teacher ID</td><td>${teacher.teacherId}</td></tr>

<tr><td>Name</td><td>${teacher.teacherName}</td></tr>

<tr><td>Designation</td><td>${teacher.designation}</td></tr>

<tr><td>Subject</td><td>${teacher.subject}</td></tr>

<tr><td>Qualification</td><td>${teacher.qualification}</td></tr>

<tr><td>Mobile</td><td>${teacher.mobile}</td></tr>

<tr><td>Email</td><td>${teacher.email}</td></tr>

<tr><td>Status</td><td>${teacher.status}</td></tr>

</table>

</body>

</html>

`);

    win.document.close();

    win.focus();

    win.print();

}