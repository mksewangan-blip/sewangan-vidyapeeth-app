
/* ===== assets/js/students/students.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/students/students.js
==================================================*/

const Students = {

    storageKey: CONFIG.STORAGE.STUDENTS || "students",

    render() {

        const students = Database.getAll(this.storageKey);

        document.getElementById("mainContent").innerHTML = `

<div class="page">

<div class="page-header">

<div>

<h2>👨‍🎓 Student Management</h2>

<p>
Manage student admissions and records
</p>

</div>

<div>

<button class="btn btn-primary"
onclick="newStudent()">

➕ New Admission

</button>

</div>

</div>

<div class="dashboard-grid">

<div class="dashboard-card">

<h3>Total Students</h3>

<h1>${students.length}</h1>

</div>

<div class="dashboard-card">

<h3>Boys</h3>

<h1>${students.filter(
s=>s.gender==="Male").length}</h1>

</div>

<div class="dashboard-card">

<h3>Girls</h3>

<h1>${students.filter(
s=>s.gender==="Female").length}</h1>

</div>

<div class="dashboard-card">

<h3>Active</h3>

<h1>${students.filter(
s=>s.status==="Active").length}</h1>

</div>

</div>

<div class="card">

<div class="toolbar">

<input
type="text"
id="studentSearch"
class="search-box"
placeholder="Search Admission No, Name, Roll No, Mobile..."
onkeyup="studentRegister()">

<button class="btn"
onclick="newStudent()">

New

</button>

<button class="btn"
onclick="studentRegister()">

Refresh

</button>

<button class="btn"
onclick="studentReports()">

Reports

</button>

<button class="btn"
onclick="importStudents()">

Import

</button>

<button class="btn"
onclick="exportStudents()">

Export

</button>

<button class="btn"
onclick="printStudentRegister()">

Print

</button>

</div>

<div id="studentWorkspace">

</div>

</div>

</div>

`;

        studentRegister();

    },

    generateAdmissionNo() {

    const total = Database.count(CONFIG.STORAGE.ADMISSIONS);

    return CONFIG.ADMISSION_PREFIX +
        "/" +
        CONFIG.SESSION_CODE +
        "/" +
        String(total + 1).padStart(CONFIG.ADMISSION_DIGITS, "0");

},

    generateStudentId(){

        return "STD-" +
        Date.now();

    }

};

/* ===== assets/js/students/newStudent.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/students/newStudent.js
 Version : 3.0.1
==================================================*/

/*==========================================
 New Student Admission Form
==========================================*/

function newStudent() {

    document.getElementById("studentWorkspace").innerHTML = `

<div class="card">

<h3>👨‍🎓 New Student Admission</h3>

<p style="color:#d32f2f;font-weight:bold;margin-bottom:15px;">
<span style="color:red">*</span> Mandatory Fields
</p>

<form id="studentForm">

<div class="form-grid">

<div class="form-group">
<label>Admission No.</label>
<input
type="text"
id="admissionNo"
value="${Students.generateAdmissionNo()}"
readonly>
</div>

<div class="form-group">
<label>Admission Date <span style="color:red">*</span></label>
<input
type="date"
id="admissionDate"
value="${Utils.currentDate()}"
required>
</div>

<div class="form-group">
<label>Student Name <span style="color:red">*</span></label>
<input
type="text"
id="studentName"
placeholder="Enter student name"
required>
</div>

<div class="form-group">
<label>Father's Name <span style="color:red">*</span></label>
<input
type="text"
id="fatherName"
placeholder="Father's name"
required>
</div>

<div class="form-group">
<label>Mother's Name</label>
<input
type="text"
id="motherName">
</div>

<div class="form-group">
<label>Gender <span style="color:red">*</span></label>

<select
id="gender"
required>

<option value="">Select</option>
<option>Male</option>
<option>Female</option>
<option>Other</option>

</select>

</div>

<div class="form-group">
<label>Date of Birth <span style="color:red">*</span></label>
<input
type="date"
id="dob"
required>
</div>

<div class="form-group">
<label>Class <span style="color:red">*</span></label>

<select
id="studentClass"
required>

<option value="">Select Class</option>
<option>5</option>
<option>6</option>
<option>7</option>
<option>8</option>

${Utils.classOptions ? Utils.classOptions() : ""}

</select>

</div>

<div class="form-group">
<label>Section</label>

<select id="studentSection">

<option>A</option>
<option>B</option>
<option>C</option>
<option>D</option>

</select>

</div>

<div class="form-group">
<label>Roll No.</label>

<input
type="text"
id="rollNo">

</div>

<div class="form-group">
<label>Mobile</label>

<input
type="tel"
id="mobile">

</div>

<div class="form-group">
<label>Email</label>

<input
type="email"
id="email">

</div>

<div class="form-group">
<label>Aadhaar No. <span style="color:red">*</span></label>

<input
type="text"
id="aadhaar"
maxlength="12"
placeholder="12 Digit Aadhaar Number"
required>

</div>

<div class="form-group">
<label>APAAR ID</label>

<input
type="text"
id="apaarId">

</div>

<div class="form-group">
<label>Blood Group</label>

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

</div>

<div class="form-group">

<label>Category</label>

<select id="category">

<option>General</option>
<option>OBC</option>
<option>SC</option>
<option>ST</option>
<option>EWS</option>

</select>

</div>

<div class="form-group">

<label>Religion</label>

<input
type="text"
id="religion">

</div>

<div class="form-group">

<label>Student Photo <span style="color:red">*</span></label>

<input
type="file"
id="studentPhoto"
accept="image/*"
required>

</div>

<div class="form-group">

<label>Aadhaar Card <span style="color:red">*</span></label>

<input
type="file"
id="aadhaarCard"
accept=".pdf,.jpg,.jpeg,.png"
required>

</div>

<div class="form-group">

<label>Transfer Certificate (Optional)</label>

<input
type="file"
id="transferCertificate"
accept=".pdf,.jpg,.jpeg,.png">

</div>

<div class="form-group full-width">

<label>Address</label>

<textarea
id="address"
rows="3"></textarea>

</div>

</div>

<div style="margin-top:20px;">

<button
type="button"
class="btn btn-primary"
onclick="saveStudent()">

💾 Save Admission

</button>

<button
type="reset"
class="btn">

🔄 Reset

</button>

<button
type="button"
class="btn"
onclick="Students.render()">

⬅ Cancel

</button>

</div>

</form>

</div>

`;

}

window.newStudent = newStudent;

/* ===== assets/js/students/saveStudent.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/students/saveStudent.js
 Version : 3.0.1
==================================================*/

/*==========================================
 Save Student Admission
==========================================*/

async function saveStudent() {

    try {

        const storage = Students.storageKey;
        const students = Database.getAll(storage);

        const admissionNo = document.getElementById("admissionNo").value.trim();
        const admissionDate = document.getElementById("admissionDate").value;
        const studentName = document.getElementById("studentName").value.trim();
        const fatherName = document.getElementById("fatherName").value.trim();
        const motherName = document.getElementById("motherName").value.trim();
        const gender = document.getElementById("gender").value;
        const dob = document.getElementById("dob").value;
        const studentClass = document.getElementById("studentClass").value;
        const section = document.getElementById("studentSection").value;
        const rollNo = document.getElementById("rollNo").value.trim();
        const mobile = document.getElementById("mobile").value.trim();
        const email = document.getElementById("email").value.trim();
        const aadhaar = document.getElementById("aadhaar").value.trim();
        const apaarId = document.getElementById("apaarId").value.trim();
        const bloodGroup = document.getElementById("bloodGroup").value;
        const category = document.getElementById("category").value;
        const religion = document.getElementById("religion").value.trim();
        const address = document.getElementById("address").value.trim();

        if (!admissionDate) {
            Utils.message("Admission Date is required.");
            return;
        }

        if (!studentName) {
            Utils.message("Student Name is required.");
            return;
        }

        if (!fatherName) {
            Utils.message("Father's Name is required.");
            return;
        }

        if (!gender) {
            Utils.message("Please select Gender.");
            return;
        }

        if (!dob) {
            Utils.message("Date of Birth is required.");
            return;
        }

        if (!studentClass) {
            Utils.message("Please select Class.");
            return;
        }

        if (!aadhaar) {
            Utils.message("Aadhaar Number is mandatory.");
            return;
        }

        if (aadhaar.length !== 12 || isNaN(aadhaar)) {
            Utils.message("Enter a valid 12 digit Aadhaar Number.");
            return;
        }

        const duplicate = students.find(
            s => s.admissionNo === admissionNo
        );

        if (duplicate) {
            Utils.message("Admission Number already exists.");
            return;
        }

        /*==============================
        Student Photo
        ==============================*/

        let photo = "";

        const photoInput =
            document.getElementById("studentPhoto");

        if (
            !photoInput ||
            photoInput.files.length === 0
        ) {

            Utils.message("Student Photo is mandatory.");

            return;

        }

        photo = await Utils.fileToBase64(
            photoInput.files[0]
        );

        /*==============================
        Aadhaar Card
        ==============================*/

        let aadhaarCard = "";

        const aadhaarInput =
            document.getElementById("aadhaarCard");

        if (
            !aadhaarInput ||
            aadhaarInput.files.length === 0
        ) {

            Utils.message("Aadhaar Card upload is mandatory.");

            return;

        }

        aadhaarCard =
            await Utils.fileToBase64(
                aadhaarInput.files[0]
            );

        /*==============================
        Transfer Certificate
        ==============================*/

        let transferCertificate = "";

        const tcInput =
            document.getElementById("transferCertificate");

        if (
            tcInput &&
            tcInput.files.length > 0
        ) {

            transferCertificate =
                await Utils.fileToBase64(
                    tcInput.files[0]
                );

        }

        const student = {

            studentId:
                Students.generateStudentId(),

            admissionNo,
            admissionDate,

            studentName,

            fatherName,

            motherName,

            gender,

            dob,

            class: studentClass,

            faceId: "",

            section,

            rollNo,

            mobile,

            email,

            aadhaar,

            apaarId,

            bloodGroup,

            category,

            religion,

            address,

            photo,

            aadhaarCard,

            transferCertificate,

            status: "Active",

            createdOn:
                Utils.currentDateTime(),

            updatedOn:
                Utils.currentDateTime()

        };

        students.push(student);

        StorageManager.save(
            storage,
            students
        );

        Database.insert(
            CONFIG.STORAGE.ADMISSIONS,
            {
                admissionNo,
                studentId: student.studentId,
                studentName,
                admissionDate,
                class: studentClass
            }
        );

        if (typeof addAuditLog === "function") {

            addAuditLog(
                "Students",
                "Create",
                "Student admitted: " +
                student.studentName
            );

        }

        Utils.message(
            "✅ Student admitted successfully."
        );

        Students.render();

    } catch (error) {

        console.error(error);

        Utils.message(
            "Unable to save student."
        );

    }

}

/* ===== assets/js/students/studentRegister.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/students/studentRegister.js
==================================================*/

/*==========================================
 Student Register
==========================================*/

function studentRegister() {

    const students = Database.getAll(
        Students.storageKey
    );

    const keyword = (
        document.getElementById("studentSearch")?.value || ""
    ).toLowerCase().trim();

    let filtered = students;

    if (keyword) {

        filtered = students.filter(student => {

            return (

                String(student.studentName || "")
                .toLowerCase()
                .includes(keyword)

                ||

                String(student.admissionNo || "")
                .toLowerCase()
                .includes(keyword)

                ||

                String(student.rollNo || "")
                .toLowerCase()
                .includes(keyword)

                ||

                String(student.mobile || "")
                .toLowerCase()
                .includes(keyword)

                ||

                String(student.class || "")
                .toLowerCase()
                .includes(keyword)

            );

        });

    }

    let html = `

<table class="table table-striped">

<thead>

<tr>

<th width="60">Photo</th>

<th>Admission No</th>

<th>Name</th>

<th>Class</th>

<th>Roll No</th>

<th>Father</th>

<th>Mobile</th>

<th>Status</th>

<th width="260">Action</th>

</tr>

</thead>

<tbody>

`;

    if (filtered.length === 0) {

        html += `

<tr>

<td colspan="9" style="text-align:center">

No student found.

</td>

</tr>

`;

    }

    filtered.forEach(student => {

        html += `

<tr>

<td>

<img

src="${student.photo || "assets/images/student.png"}"

style="width:45px;height:45px;border-radius:50%;object-fit:cover;">

</td>

<td>

${student.admissionNo}

</td>

<td>

<b>${NameHelper.display(
    student.studentName,
    students,
    "studentName"
)}</b>

</td>

<td>

${student.class}

${student.section || ""}

</td>

<td>

${student.rollNo}

</td>

<td>

${student.fatherName}

</td>

<td>

${student.mobile}

</td>

<td>

<span class="badge badge-success">

${student.status}

</span>

</td>

<td>

<button

class="btn btn-sm"

onclick="studentProfile('${student.studentId}')">

👁

</button>

<button

class="btn btn-sm btn-warning"

onclick="editStudent('${student.studentId}')">

✏

</button>

<button

class="btn btn-sm btn-danger"

onclick="deleteStudent('${student.studentId}')">

🗑

</button>

<button

class="btn btn-sm"

onclick="printStudent('${student.studentId}')">

🖨

</button>

</td>

</tr>

`;

    });

    html += `

</tbody>

</table>

<div style="margin-top:15px;">

<b>

Total Students :

${filtered.length}

</b>

</div>

`;

    document.getElementById(
        "studentWorkspace"
    ).innerHTML = html;

}

/* ===== assets/js/students/editStudent.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/students/editStudent.js
==================================================*/

/*==========================================
 Edit Student
==========================================*/

function editStudent(studentId) {

    const students = Database.getAll(
        Students.storageKey
    );

    const student = students.find(
        s => s.studentId === studentId
    );

    if (!student) {

        Utils.message("Student not found.");

        return;

    }

    document.getElementById("studentWorkspace").innerHTML = `

<div class="card">

<h3>✏ Edit Student</h3>

<form id="editStudentForm">

<input
type="hidden"
id="editStudentId"
value="${student.studentId}">

<div class="form-grid">

<div class="form-group">
<label>Admission No.</label>
<input
type="text"
id="editAdmissionNo"
value="${student.admissionNo}"
readonly>
</div>

<div class="form-group">
<label>Admission Date</label>
<input
type="date"
id="editAdmissionDate"
value="${student.admissionDate}">
</div>

<div class="form-group">
<label>Student Name *</label>
<input
type="text"
id="editStudentName"
value="${student.studentName}">
</div>

<div class="form-group">
<label>Father's Name *</label>
<input
type="text"
id="editFatherName"
value="${student.fatherName}">
</div>

<div class="form-group">
<label>Mother's Name</label>
<input
type="text"
id="editMotherName"
value="${student.motherName || ""}">
</div>

<div class="form-group">
<label>Gender</label>

<select id="editGender">

<option value="Male"
${student.gender==="Male"?"selected":""}>

Male

</option>

<option value="Female"
${student.gender==="Female"?"selected":""}>

Female

</option>

<option value="Other"
${student.gender==="Other"?"selected":""}>

Other

</option>

</select>

</div>

<div class="form-group">
<label>Date of Birth</label>
<input
type="date"
id="editDob"
value="${student.dob}">
</div>

<div class="form-group">
<label>Class</label>
<input
type="text"
id="editClass"
value="${student.class}">
</div>

<div class="form-group">
<label>Section</label>
<input
type="text"
id="editSection"
value="${student.section}">
</div>

<div class="form-group">
<label>Roll No.</label>
<input
type="text"
id="editRollNo"
value="${student.rollNo}">
</div>

<div class="form-group">
<label>Mobile</label>
<input
type="text"
id="editMobile"
value="${student.mobile}">
</div>

<div class="form-group">
<label>Email</label>
<input
type="email"
id="editEmail"
value="${student.email || ""}">
</div>

<div class="form-group">
<label>Aadhaar</label>
<input
type="text"
id="editAadhaar"
value="${student.aadhaar || ""}">
</div>

<div class="form-group">
<label>APAAR ID</label>
<input
type="text"
id="editApaarId"
value="${student.apaarId || ""}">
</div>

<div class="form-group">
<label>Blood Group</label>
<input
type="text"
id="editBloodGroup"
value="${student.bloodGroup || ""}">
</div>

<div class="form-group">
<label>Category</label>
<input
type="text"
id="editCategory"
value="${student.category || ""}">
</div>

<div class="form-group">
<label>Religion</label>
<input
type="text"
id="editReligion"
value="${student.religion || ""}">
</div>

<div class="form-group full-width">

<label>Address</label>

<textarea
id="editAddress"
rows="3">${student.address || ""}</textarea>

</div>

<div class="form-group">

<label>Photo</label>

<input
type="file"
id="editStudentPhoto"
accept="image/*">

</div>

</div>

<br>

<button
type="button"
class="btn btn-primary"
onclick="updateStudent()">

💾 Update Student

</button>

<button
type="button"
class="btn"
onclick="Students.render()">

❌ Cancel

</button>

</form>

</div>

`;

}

/*==========================================
 Update Student
==========================================*/

async function updateStudent() {

    const students = Database.getAll(
        Students.storageKey
    );

    const studentId =
        document.getElementById(
            "editStudentId"
        ).value;

    const index = students.findIndex(
        s => s.studentId === studentId
    );

    if (index === -1) {

        Utils.message("Student not found.");

        return;

    }

    let photo = students[index].photo;

    const photoInput =
        document.getElementById(
            "editStudentPhoto"
        );

    if (
        photoInput.files &&
        photoInput.files.length > 0
    ) {

        photo = await Utils.fileToBase64(
            photoInput.files[0]
        );

    }

    students[index] = {

        ...students[index],

        admissionDate:
            document.getElementById("editAdmissionDate").value,

        studentName:
            document.getElementById("editStudentName").value.trim(),

        fatherName:
            document.getElementById("editFatherName").value.trim(),

        motherName:
            document.getElementById("editMotherName").value.trim(),

        gender:
            document.getElementById("editGender").value,

        dob:
            document.getElementById("editDob").value,

        class:
            document.getElementById("editClass").value,

        section:
            document.getElementById("editSection").value,

        rollNo:
            document.getElementById("editRollNo").value,

        mobile:
            document.getElementById("editMobile").value,

        email:
            document.getElementById("editEmail").value,

        aadhaar:
            document.getElementById("editAadhaar").value,

        apaarId:
            document.getElementById("editApaarId").value,

        bloodGroup:
            document.getElementById("editBloodGroup").value,

        category:
            document.getElementById("editCategory").value,

        religion:
            document.getElementById("editReligion").value,

        address:
            document.getElementById("editAddress").value,

        photo,

        updatedOn:
            Utils.currentDateTime()

    };

    StorageManager.save(
        Students.storageKey,
        students
    );

    if (typeof addAuditLog === "function") {

        addAuditLog(
            "Students",
            "Update",
            students[index].studentName
        );

    }

    Utils.message(
        "Student updated successfully."
    );

    Students.render();

}

/* ===== assets/js/students/deleteStudent.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/students/deleteStudent.js
==================================================*/

/*==========================================
 Delete Student
==========================================*/

function deleteStudent(studentId) {

    const students = Database.getAll(
        Students.storageKey
    );

    const index = students.findIndex(
        s => s.studentId === studentId
    );

    if (index === -1) {

        Utils.message("Student not found.");

        return;

    }

    const student = students[index];

    /*==========================================
      Check Attendance Dependency
    ==========================================*/

    if (CONFIG.STORAGE.ATTENDANCE) {

        const attendance = Database.getAll(
            CONFIG.STORAGE.ATTENDANCE
        );

        const exists = attendance.some(record =>

            record.studentId === studentId

        );

        if (exists) {

            Utils.message(

                "Attendance records exist. Student cannot be permanently deleted."

            );

            return;

        }

    }

    /*==========================================
      Check Certificate Dependency
    ==========================================*/

    if (CONFIG.STORAGE.CERTIFICATES) {

        const certificates = Database.getAll(
            CONFIG.STORAGE.CERTIFICATES
        );

        const exists = certificates.some(record =>

            record.studentId === studentId

        );

        if (exists) {

            Utils.message(

                "Certificates already issued. Student cannot be permanently deleted."

            );

            return;

        }

    }

    if (

        !confirm(

            `Delete student "${student.studentName}" ?`

        )

    ) {

        return;

    }

    students.splice(index, 1);

    StorageManager.save(

        Students.storageKey,

        students

    );

    if (typeof addAuditLog === "function") {

        addAuditLog(

            "Students",

            "Delete",

            student.studentName

        );

    }

    Utils.message(

        "Student deleted successfully."

    );

    studentRegister();

}

/*==========================================
 Soft Delete
==========================================*/

function deactivateStudent(studentId) {

    const students = Database.getAll(
        Students.storageKey
    );

    const student = students.find(

        s => s.studentId === studentId

    );

    if (!student) {

        Utils.message("Student not found.");

        return;

    }

    student.status = "Inactive";

    student.updatedOn = Utils.currentDateTime();

    StorageManager.save(

        Students.storageKey,

        students

    );

    if (typeof addAuditLog === "function") {

        addAuditLog(

            "Students",

            "Deactivate",

            student.studentName

        );

    }

    Utils.message(

        "Student marked as inactive."

    );

    studentRegister();

}

/*==========================================
 Restore Student
==========================================*/

function restoreStudent(studentId) {

    const students = Database.getAll(
        Students.storageKey
    );

    const student = students.find(

        s => s.studentId === studentId

    );

    if (!student) {

        Utils.message("Student not found.");

        return;

    }

    student.status = "Active";

    student.updatedOn = Utils.currentDateTime();

    StorageManager.save(

        Students.storageKey,

        students

    );

    if (typeof addAuditLog === "function") {

        addAuditLog(

            "Students",

            "Restore",

            student.studentName

        );

    }

    Utils.message(

        "Student restored successfully."

    );

    studentRegister();

}

/* ===== assets/js/students/studentProfile.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/students/studentProfile.js
==================================================*/

/*==========================================
 Student Profile
==========================================*/

function studentProfile(studentId) {

    const students = Database.getAll(
        Students.storageKey
    );

    const student = students.find(
        s => s.studentId === studentId
    );

    if (!student) {

        Utils.message("Student not found.");

        return;

    }

    document.getElementById("studentWorkspace").innerHTML = `

<div class="card">

<div style="display:flex;gap:20px;flex-wrap:wrap;align-items:flex-start;">

<div style="width:180px;text-align:center;">

<img

src="${student.photo || "assets/images/student.png"}"

style="
width:160px;
height:180px;
border-radius:8px;
object-fit:cover;
border:1px solid #ddd;">

<br><br>

<h3>${NameHelper.display(student.studentName, students, "studentName")}</h3>

<span class="badge badge-success">

${student.status}

</span>

</div>

<div style="flex:1;min-width:300px;">

<h3>Personal Information</h3>

<table class="table">

<tr>
<td width="220"><b>Admission No.</b></td>
<td>${student.admissionNo}</td>
</tr>

<tr>
<td><b>Student ID</b></td>
<td>${student.studentId}</td>
</tr>

<tr>
<td><b>Class</b></td>
<td>${student.class} ${student.section}</td>
</tr>

<tr>
<td><b>Roll No.</b></td>
<td>${student.rollNo}</td>
</tr>

<tr>
<td><b>Gender</b></td>
<td>${student.gender}</td>
</tr>

<tr>
<td><b>Date of Birth</b></td>
<td>${student.dob}</td>
</tr>

<tr>
<td><b>Blood Group</b></td>
<td>${student.bloodGroup || "-"}</td>
</tr>

<tr>
<td><b>Category</b></td>
<td>${student.category || "-"}</td>
</tr>

<tr>
<td><b>Religion</b></td>
<td>${student.religion || "-"}</td>
</tr>

<tr>
<td><b>Mobile</b></td>
<td>${student.mobile || "-"}</td>
</tr>

<tr>
<td><b>Email</b></td>
<td>${student.email || "-"}</td>
</tr>

<tr>
<td><b>Aadhaar</b></td>
<td>${student.aadhaar || "-"}</td>
</tr>

<tr>
<td><b>APAAR ID</b></td>
<td>${student.apaarId || "-"}</td>
</tr>

<tr>
<td><b>Admission Date</b></td>
<td>${student.admissionDate}</td>
</tr>

</table>

</div>

</div>

<br>

<div class="card">

<h3>Guardian Information</h3>

<table class="table">

<tr>

<td width="220"><b>Father's Name</b></td>

<td>${student.fatherName}</td>

</tr>

<tr>

<td><b>Mother's Name</b></td>

<td>${student.motherName || "-"}</td>

</tr>

<tr>

<td><b>Address</b></td>

<td>${student.address || "-"}</td>

</tr>

</table>

</div>

<br>

<div class="card">

<h3>System Information</h3>

<table class="table">

<tr>

<td width="220"><b>Status</b></td>

<td>${student.status}</td>

</tr>

<tr>

<td><b>Created On</b></td>

<td>${student.createdOn || "-"}</td>

</tr>

<tr>

<td><b>Last Updated</b></td>

<td>${student.updatedOn || "-"}</td>

</tr>

</table>

</div>

<br>

<div style="display:flex;gap:10px;flex-wrap:wrap;">

<!--
<button
class="btn"
onclick="FaceRegistration.student('${student.studentId}')">

📷 Register Face

</button>
-->

<button
class="btn btn-warning"
onclick="editStudent('${student.studentId}')">

✏ Edit

</button>

<button
class="btn"
onclick="printStudent('${student.studentId}')">

🖨 Print

</button>

<button
class="btn"
onclick="generateIdCard('${student.studentId}')">

🪪 ID Card

</button>

<button
class="btn"
onclick="generateBonafide('${student.studentId}')">

📄 Bonafide

</button>

<button
class="btn"
onclick="generateTransferCertificate('${student.studentId}')">

🎓 Transfer Certificate

</button>

<button
class="btn"
onclick="Students.render()">

⬅ Back

</button>

</div>

</div>

`;

}

/* ===== assets/js/students/promoteStudents.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/students/promoteStudents.js
==================================================*/

/*==========================================
 Promote Students Screen
==========================================*/

function promoteStudents() {

    const students = Database.getAll(
        Students.storageKey
    );

    document.getElementById("studentWorkspace").innerHTML = `

<div class="card">

<h3>🎓 Student Promotion</h3>

<div class="form-grid">

<div class="form-group">

<label>Current Class</label>

<select id="promotionFromClass">

${Utils.classOptions()}

</select>

</div>

<div class="form-group">

<label>Current Section</label>

<select id="promotionFromSection">

<option value="">All</option>
<option>A</option>
<option>B</option>
<option>C</option>
<option>D</option>

</select>

</div>

<div class="form-group">

<label>Promote To Class</label>

<select id="promotionToClass">

${Utils.classOptions()}

</select>

</div>

<div class="form-group">

<label>New Section</label>

<select id="promotionToSection">

<option>A</option>
<option>B</option>
<option>C</option>
<option>D</option>

</select>

</div>

</div>

<br>

<button
class="btn btn-primary"
onclick="loadPromotionStudents()">

Load Students

</button>

<button
class="btn"
onclick="Students.render()">

Back

</button>

<div id="promotionStudentList"></div>

</div>

`;

}

/*==========================================
 Load Students
==========================================*/

function loadPromotionStudents() {

    const fromClass =
        document.getElementById(
            "promotionFromClass"
        ).value;

    const fromSection =
        document.getElementById(
            "promotionFromSection"
        ).value;

    const students = Database.getAll(
        Students.storageKey
    );

    const list = students.filter(student => {

        return student.class === fromClass &&

            (
                fromSection === "" ||

                student.section === fromSection
            ) &&

            student.status === "Active";

    });

    let html = `

<br>

<table class="table">

<tr>

<th>

<input
type="checkbox"
onclick="togglePromotionSelection(this)">

</th>

<th>Admission No</th>

<th>Name</th>

<th>Class</th>

<th>Section</th>

</tr>

`;

    if (list.length === 0) {

        html += `

<tr>

<td colspan="5">

No students found.

</td>

</tr>

`;

    }

    list.forEach(student => {

        html += `

<tr>

<td>

<input

type="checkbox"

class="promotionStudent"

value="${student.studentId}">

</td>

<td>

${student.admissionNo}

</td>

<td>

${student.studentName}

</td>

<td>

${student.class}

</td>

<td>

${student.section}

</td>

</tr>

`;

    });

    html += `

</table>

<br>

<button
class="btn btn-success"
onclick="confirmPromotion()">

Promote Selected Students

</button>

`;

    document.getElementById(
        "promotionStudentList"
    ).innerHTML = html;

}

/*==========================================
 Select All
==========================================*/

function togglePromotionSelection(box){

    document.querySelectorAll(
        ".promotionStudent"
    ).forEach(item=>{

        item.checked = box.checked;

    });

}

/*==========================================
 Confirm Promotion
==========================================*/

function confirmPromotion(){

    const toClass =
        document.getElementById(
            "promotionToClass"
        ).value;

    const toSection =
        document.getElementById(
            "promotionToSection"
        ).value;

    const selected = Array.from(

        document.querySelectorAll(
            ".promotionStudent:checked"
        )

    ).map(item=>item.value);

    if(selected.length===0){

        Utils.message(
            "Please select at least one student."
        );

        return;

    }

    if(!confirm(

        `Promote ${selected.length} students to Class ${toClass}?`

    )){

        return;

    }

    const students = Database.getAll(
        Students.storageKey
    );

    let promoted = 0;

    students.forEach(student=>{

        if(selected.includes(student.studentId)){

            student.previousClass =
                student.class;

            student.previousSection =
                student.section;

            student.class = toClass;

            student.section = toSection;

            student.updatedOn =
                Utils.currentDateTime();

            promoted++;

        }

    });

    StorageManager.save(

        Students.storageKey,

        students

    );

    if(typeof addAuditLog==="function"){

        addAuditLog(

            "Students",

            "Promotion",

            promoted + " students promoted."

        );

    }

    Utils.message(

        promoted + " students promoted successfully."

    );

    Students.render();

}

/* ===== assets/js/students/transferCertificate.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/students/transferCertificate.js
==================================================*/

/*==========================================
 Generate Transfer Certificate
==========================================*/

function generateTransferCertificate(studentId){

    const students = Database.getAll(
        Students.storageKey
    );

    const student = students.find(
        s => s.studentId === studentId
    );

    if(!student){

        Utils.message("Student not found.");

        return;

    }

    const tcNo = generateTCNumber();

    document.getElementById("studentWorkspace").innerHTML = `

<div class="card">

<h2 style="text-align:center">

TRANSFER CERTIFICATE

</h2>

<hr>

<div class="form-grid">

<div class="form-group">

<label>TC Number</label>

<input
type="text"
id="tcNumber"
value="${tcNo}"
readonly>

</div>

<div class="form-group">

<label>Date</label>

<input
type="date"
id="tcDate"
value="${Utils.currentDate()}">

</div>

<div class="form-group">

<label>Student Name</label>

<input
type="text"
value="${student.studentName}"
readonly>

</div>

<div class="form-group">

<label>Admission No.</label>

<input
type="text"
value="${student.admissionNo}"
readonly>

</div>

<div class="form-group">

<label>Father's Name</label>

<input
type="text"
value="${student.fatherName}"
readonly>

</div>

<div class="form-group">

<label>Class</label>

<input
type="text"
value="${student.class} ${student.section}"
readonly>

</div>

<div class="form-group">

<label>Date of Birth</label>

<input
type="text"
value="${student.dob}"
readonly>

</div>

<div class="form-group">

<label>Conduct</label>

<select id="tcConduct">

<option>Excellent</option>
<option>Very Good</option>
<option>Good</option>
<option>Satisfactory</option>

</select>

</div>

<div class="form-group full-width">

<label>Reason for Leaving</label>

<textarea
id="tcReason"
rows="3"
placeholder="Reason for leaving school"></textarea>

</div>

<div class="form-group full-width">

<label>Remarks</label>

<textarea
id="tcRemarks"
rows="3"></textarea>

</div>

</div>

<br>

<button
class="btn btn-primary"
onclick="saveTransferCertificate('${student.studentId}')">

💾 Save TC

</button>

<button
class="btn"
onclick="printTransferCertificate('${student.studentId}')">

🖨 Print

</button>

<button
class="btn"
onclick="studentProfile('${student.studentId}')">

⬅ Back

</button>

</div>

`;

}

/*==========================================
 Generate TC Number
==========================================*/

function generateTCNumber(){

    return "TC-" +

    new Date().getFullYear() +

    "-" +

    String(Date.now()).slice(-5);

}

/*==========================================
 Save Transfer Certificate
==========================================*/

function saveTransferCertificate(studentId){

    const certificates = Database.getAll(

        CONFIG.STORAGE.CERTIFICATES ||

        "certificates"

    );

    certificates.push({

        certificateId:

            "TC"+Date.now(),

        type:"Transfer Certificate",

        studentId,

        tcNumber:

            document.getElementById(
                "tcNumber"
            ).value,

        issueDate:

            document.getElementById(
                "tcDate"
            ).value,

        conduct:

            document.getElementById(
                "tcConduct"
            ).value,

        reason:

            document.getElementById(
                "tcReason"
            ).value,

        remarks:

            document.getElementById(
                "tcRemarks"
            ).value,

        createdOn:

            Utils.currentDateTime()

    });

    StorageManager.save(

        CONFIG.STORAGE.CERTIFICATES ||

        "certificates",

        certificates

    );

    if(typeof addAuditLog==="function"){

        addAuditLog(

            "Certificates",

            "Transfer Certificate",

            studentId

        );

    }

    Utils.message(

        "Transfer Certificate saved successfully."

    );

}

/* ===== assets/js/students/bonafideCertificate.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/students/bonafideCertificate.js
==================================================*/

/*==========================================
 Generate Bonafide Certificate
==========================================*/

function generateBonafide(studentId){

    const students = Database.getAll(
        Students.storageKey
    );

    const student = students.find(
        s => s.studentId === studentId
    );

    if(!student){

        Utils.message("Student not found.");

        return;

    }

    const certificateNo = generateBonafideNumber();

    document.getElementById("studentWorkspace").innerHTML = `

<div class="card">

<h2 style="text-align:center">

BONAFIDE CERTIFICATE

</h2>

<hr>

<div class="form-grid">

<div class="form-group">

<label>Certificate No.</label>

<input
type="text"
id="bonafideNo"
value="${certificateNo}"
readonly>

</div>

<div class="form-group">

<label>Issue Date</label>

<input
type="date"
id="bonafideDate"
value="${Utils.currentDate()}">

</div>

<div class="form-group">

<label>Student Name</label>

<input
type="text"
value="${student.studentName}"
readonly>

</div>

<div class="form-group">

<label>Admission No.</label>

<input
type="text"
value="${student.admissionNo}"
readonly>

</div>

<div class="form-group">

<label>Father's Name</label>

<input
type="text"
value="${student.fatherName}"
readonly>

</div>

<div class="form-group">

<label>Class</label>

<input
type="text"
value="${student.class} ${student.section}"
readonly>

</div>

<div class="form-group">

<label>Date of Birth</label>

<input
type="text"
value="${student.dob}"
readonly>

</div>

<div class="form-group">

<label>Academic Session</label>

<input
type="text"
id="academicSession"
value="${CONFIG.CURRENT_SESSION || ""}">

</div>

<div class="form-group full-width">

<label>Purpose</label>

<textarea
id="bonafidePurpose"
rows="3"
placeholder="Purpose of certificate"></textarea>

</div>

<div class="form-group full-width">

<label>Remarks</label>

<textarea
id="bonafideRemarks"
rows="3"></textarea>

</div>

</div>

<br>

<button
class="btn btn-primary"
onclick="saveBonafideCertificate('${student.studentId}')">

💾 Save

</button>

<button
class="btn"
onclick="printBonafideCertificate('${student.studentId}')">

🖨 Print

</button>

<button
class="btn"
onclick="studentProfile('${student.studentId}')">

⬅ Back

</button>

</div>

`;

}

/*==========================================
 Generate Certificate Number
==========================================*/

function generateBonafideNumber(){

    return "BC-" +
    new Date().getFullYear() +
    "-" +
    String(Date.now()).slice(-5);

}

/*==========================================
 Save Bonafide Certificate
==========================================*/

function saveBonafideCertificate(studentId){

    const certificates = Database.getAll(

        CONFIG.STORAGE.CERTIFICATES ||

        "certificates"

    );

    certificates.push({

        certificateId:
            "BC" + Date.now(),

        type:
            "Bonafide Certificate",

        studentId,

        certificateNumber:
            document.getElementById(
                "bonafideNo"
            ).value,

        issueDate:
            document.getElementById(
                "bonafideDate"
            ).value,

        session:
            document.getElementById(
                "academicSession"
            ).value,

        purpose:
            document.getElementById(
                "bonafidePurpose"
            ).value,

        remarks:
            document.getElementById(
                "bonafideRemarks"
            ).value,

        createdOn:
            Utils.currentDateTime()

    });

    StorageManager.save(

        CONFIG.STORAGE.CERTIFICATES ||

        "certificates",

        certificates

    );

    if(typeof addAuditLog==="function"){

        addAuditLog(

            "Certificates",

            "Bonafide Certificate",

            studentId

        );

    }

    Utils.message(

        "Bonafide Certificate saved successfully."

    );

}

/* ===== assets/js/students/idCard.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/students/idCard.js
==================================================*/

/*==========================================
 Generate Student ID Card
==========================================*/

function generateIdCard(studentId){

    const students = Database.getAll(
        Students.storageKey
    );

    const student = students.find(
        s => s.studentId === studentId
    );

    if(!student){

        Utils.message("Student not found.");

        return;

    }

    const school = CONFIG.SCHOOL || {};

    document.getElementById("studentWorkspace").innerHTML = `

<div class="card">

<div id="studentIdCard"
style="
width:340px;
margin:auto;
border:2px solid #0d6efd;
border-radius:12px;
overflow:hidden;
background:#fff;
">

<div
style="
background:#0d6efd;
color:#fff;
padding:15px;
text-align:center;
">

<h2 style="margin:0;">
${school.name || "School Name"}
</h2>

<p style="margin:4px 0;">
STUDENT IDENTITY CARD
</p>

</div>

<div
style="
padding:15px;
text-align:center;
">

<img

src="${student.photo || "assets/images/student.png"}"

style="
width:120px;
height:140px;
object-fit:cover;
border-radius:8px;
border:1px solid #ccc;
">

<h3 style="margin-top:10px;">
${student.studentName}
</h3>

<table
style="
width:100%;
font-size:14px;
">

<tr>

<td><b>ID</b></td>

<td>${student.studentId}</td>

</tr>

<tr>

<td><b>Admission</b></td>

<td>${student.admissionNo}</td>

</tr>

<tr>

<td><b>Class</b></td>

<td>${student.class} ${student.section}</td>

</tr>

<tr>

<td><b>Roll No.</b></td>

<td>${student.rollNo}</td>

</tr>

<tr>

<td><b>DOB</b></td>

<td>${student.dob}</td>

</tr>

<tr>

<td><b>Blood</b></td>

<td>${student.bloodGroup || "-"}</td>

</tr>

<tr>

<td><b>Mobile</b></td>

<td>${student.mobile || "-"}</td>

</tr>

</table>

<hr>

<p style="font-size:13px;">

<b>Father</b><br>

${student.fatherName}

</p>

<p style="font-size:13px;">

${student.address || ""}

</p>

<div id="studentQrCode"
style="margin-top:10px;"></div>

<p
style="
font-size:11px;
margin-top:10px;
">

If found, please return to school.

</p>

</div>

</div>

<br>

<div style="text-align:center;">

<button
class="btn btn-primary"
onclick="printStudentIdCard()">

🖨 Print ID Card

</button>

<button
class="btn"
onclick="studentProfile('${student.studentId}')">

⬅ Back

</button>

</div>

</div>

`;

    if(typeof QRCode !== "undefined"){

        new QRCode(

            document.getElementById(
                "studentQrCode"
            ),

            {

                text: JSON.stringify({

                    id:student.studentId,
                    admission:student.admissionNo,
                    name:student.studentName,
                    class:student.class,
                    section:student.section

                }),

                width:80,
                height:80

            }

        );

    }

}

/*==========================================
 Print ID Card
==========================================*/

function printStudentIdCard(){

    const card = document.getElementById(
        "studentIdCard"
    );

    if(!card){

        Utils.message("ID Card not found.");

        return;

    }

    const win = window.open(
        "",
        "_blank",
        "width=500,height=700"
    );

    win.document.write(`

<html>

<head>

<title>ID Card</title>

<style>

body{

font-family:Arial;

padding:20px;

text-align:center;

}

</style>

</head>

<body>

${card.outerHTML}

<script>

window.onload=function(){

window.print();

window.close();

}

<\/script>

</body>

</html>

`);

    win.document.close();

}

/* ===== assets/js/students/studentAttendance.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/students/studentAttendance.js
==================================================*/

/*==========================================
 Student Attendance Summary
==========================================*/

function studentAttendance(studentId){

    const students = Database.getAll(
        Students.storageKey
    );

    const student = students.find(
        s => s.studentId === studentId
    );

    if(!student){

        Utils.message("Student not found.");

        return;

    }

    const attendance = Database.getAll(

        CONFIG.STORAGE.ATTENDANCE ||

        "attendance"

    );

    const records = attendance.filter(

        item => item.studentId === studentId

    );

    const present = records.filter(

        item => item.status === "Present"

    ).length;

    const absent = records.filter(

        item => item.status === "Absent"

    ).length;

    const leave = records.filter(

        item => item.status === "Leave"

    ).length;

    const total = records.length;

    const percentage = total === 0

        ? 0

        : ((present / total) * 100).toFixed(2);

    let html = `

<div class="card">

<h2>

📅 Student Attendance

</h2>

<hr>

<div class="dashboard-grid">

<div class="dashboard-card">

<h3>Total Days</h3>

<h1>${total}</h1>

</div>

<div class="dashboard-card">

<h3>Present</h3>

<h1>${present}</h1>

</div>

<div class="dashboard-card">

<h3>Absent</h3>

<h1>${absent}</h1>

</div>

<div class="dashboard-card">

<h3>Leave</h3>

<h1>${leave}</h1>

</div>

<div class="dashboard-card">

<h3>Attendance %</h3>

<h1>${percentage}%</h1>

</div>

</div>

<br>

<h3>

Attendance Register

</h3>

<table class="table">

<thead>

<tr>

<th>Date</th>

<th>Status</th>

<th>Remarks</th>

</tr>

</thead>

<tbody>

`;

    if(records.length===0){

        html += `

<tr>

<td colspan="3">

No attendance records found.

</td>

</tr>

`;

    }

    records
    .sort((a,b)=>

        new Date(b.date)-new Date(a.date)

    )
    .forEach(record=>{

        let badge="secondary";

        if(record.status==="Present"){

            badge="success";

        }

        if(record.status==="Absent"){

            badge="danger";

        }

        if(record.status==="Leave"){

            badge="warning";

        }

        html += `

<tr>

<td>

${record.date}

</td>

<td>

<span class="badge badge-${badge}">

${record.status}

</span>

</td>

<td>

${record.remarks || "-"}

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

onclick="studentProfile('${student.studentId}')">

⬅ Back

</button>

</div>

`;

    document.getElementById(

        "studentWorkspace"

    ).innerHTML = html;

}

/* ===== assets/js/students/studentDocuments.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/students/studentDocuments.js
==================================================*/

const STUDENT_DOCUMENT_KEY = "student_documents";

/*==========================================
 Student Documents
==========================================*/

function studentDocuments(studentId){

    const students = Database.getAll(
        Students.storageKey
    );

    const student = students.find(
        s=>s.studentId===studentId
    );

    if(!student){

        Utils.message("Student not found.");

        return;

    }

    document.getElementById("studentWorkspace").innerHTML=`

<div class="card">

<h2>📁 Student Documents</h2>

<hr>

<h3>

${student.studentName}

</h3>

<p>

Admission No :
<b>${student.admissionNo}</b>

</p>

<div class="form-grid">

<div class="form-group">

<label>Document Type</label>

<select id="documentType">

<option>Student Photo</option>

<option>Aadhaar Card</option>

<option>Birth Certificate</option>

<option>Transfer Certificate</option>

<option>Previous Marksheet</option>

<option>Caste Certificate</option>

<option>Income Certificate</option>

<option>Residence Certificate</option>

<option>Passport</option>

<option>Medical Certificate</option>

<option>Other</option>

</select>

</div>

<div class="form-group">

<label>Select File</label>

<input
type="file"
id="studentDocumentFile"
accept=".pdf,.jpg,.jpeg,.png">

</div>

</div>

<br>

<button
class="btn btn-primary"
onclick="uploadStudentDocument('${student.studentId}')">

⬆ Upload Document

</button>

<button
class="btn"
onclick="studentProfile('${student.studentId}')">

⬅ Back

</button>

<hr>

<div id="studentDocumentList">

</div>

</div>

`;

    loadStudentDocuments(studentId);

}

/*==========================================
 Load Documents
==========================================*/

function loadStudentDocuments(studentId){

    const docs=Database.getAll(
        STUDENT_DOCUMENT_KEY
    );

    const list=docs.filter(

        d=>d.studentId===studentId

    );

    let html=`

<table class="table">

<tr>

<th>Type</th>

<th>File Name</th>

<th>Date</th>

<th>Action</th>

</tr>

`;

    if(list.length===0){

        html+=`

<tr>

<td colspan="4">

No documents uploaded.

</td>

</tr>

`;

    }

    list.forEach(doc=>{

        html+=`

<tr>

<td>${doc.type}</td>

<td>${doc.fileName}</td>

<td>${doc.uploadDate}</td>

<td>

<button
class="btn btn-sm"
onclick="viewStudentDocument('${doc.documentId}')">

👁

</button>

<button
class="btn btn-sm btn-danger"
onclick="deleteStudentDocument('${doc.documentId}','${studentId}')">

🗑

</button>

</td>

</tr>

`;

    });

    html+="</table>";

    document.getElementById(
        "studentDocumentList"
    ).innerHTML=html;

}

/*==========================================
 Upload Document
==========================================*/

async function uploadStudentDocument(studentId){

    const file=document.getElementById(
        "studentDocumentFile"
    ).files[0];

    if(!file){

        Utils.message("Select a document.");

        return;

    }

    const docs=Database.getAll(
        STUDENT_DOCUMENT_KEY
    );

    const base64=await Utils.fileToBase64(file);

    docs.push({

        documentId:
        "DOC"+Date.now(),

        studentId,

        type:
        document.getElementById(
            "documentType"
        ).value,

        fileName:file.name,

        fileData:base64,

        uploadDate:
        Utils.currentDate(),

        createdOn:
        Utils.currentDateTime()

    });

    StorageManager.save(

        STUDENT_DOCUMENT_KEY,

        docs

    );

    if(typeof addAuditLog==="function"){

        addAuditLog(

            "Students",

            "Upload Document",

            studentId

        );

    }

    Utils.message(
        "Document uploaded successfully."
    );

    loadStudentDocuments(studentId);

}

/*==========================================
 View Document
==========================================*/

function viewStudentDocument(documentId){

    const docs=Database.getAll(
        STUDENT_DOCUMENT_KEY
    );

    const doc=docs.find(
        d=>d.documentId===documentId
    );

    if(!doc){

        return;

    }

    window.open(doc.fileData);

}

/*==========================================
 Delete Document
==========================================*/

function deleteStudentDocument(documentId,studentId){

    if(!confirm("Delete this document?")){

        return;

    }

    let docs=Database.getAll(
        STUDENT_DOCUMENT_KEY
    );

    docs=docs.filter(
        d=>d.documentId!==documentId
    );

    StorageManager.save(
        STUDENT_DOCUMENT_KEY,
        docs
    );

    if(typeof addAuditLog==="function"){

        addAuditLog(

            "Students",

            "Delete Document",

            documentId

        );

    }

    Utils.message(
        "Document deleted."
    );

    loadStudentDocuments(studentId);

}

/* ===== assets/js/students/reports.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/students/reports.js
==================================================*/

/*==========================================
 Student Reports
==========================================*/

function studentReports() {

    const students = Database.getAll(
        Students.storageKey
    );

    document.getElementById("studentWorkspace").innerHTML = `

<div class="card">

<h2>📊 Student Reports</h2>

<div class="form-grid">

<div class="form-group">

<label>Class</label>

<select id="reportClass">

<option value="">All Classes</option>

${Utils.classOptions()}

</select>

</div>

<div class="form-group">

<label>Section</label>

<select id="reportSection">

<option value="">All Sections</option>
<option>A</option>
<option>B</option>
<option>C</option>
<option>D</option>

</select>

</div>

<div class="form-group">

<label>Gender</label>

<select id="reportGender">

<option value="">All</option>
<option>Male</option>
<option>Female</option>
<option>Other</option>

</select>

</div>

<div class="form-group">

<label>Status</label>

<select id="reportStatus">

<option value="">All</option>
<option>Active</option>
<option>Inactive</option>

</select>

</div>

</div>

<br>

<button
class="btn btn-primary"
onclick="generateStudentReport()">

Generate Report

</button>

<button
class="btn"
onclick="printStudentReport()">

🖨 Print

</button>

<button
class="btn"
onclick="exportStudentCSV()">

📄 Export CSV

</button>

<button
class="btn"
onclick="Students.render()">

⬅ Back

</button>

<hr>

<div id="studentReportResult">

<h3>Total Students : ${students.length}</h3>

</div>

</div>

`;

}

/*==========================================
 Generate Report
==========================================*/

function generateStudentReport() {

    const classFilter =
        document.getElementById("reportClass").value;

    const sectionFilter =
        document.getElementById("reportSection").value;

    const genderFilter =
        document.getElementById("reportGender").value;

    const statusFilter =
        document.getElementById("reportStatus").value;

    let students = Database.getAll(
        Students.storageKey
    );

    students = students.filter(student => {

        return (

            (!classFilter || student.class === classFilter) &&

            (!sectionFilter || student.section === sectionFilter) &&

            (!genderFilter || student.gender === genderFilter) &&

            (!statusFilter || student.status === statusFilter)

        );

    });

    let html = `

<h3>

Filtered Students : ${students.length}

</h3>

<table class="table">

<thead>

<tr>

<th>Admission</th>

<th>Name</th>

<th>Class</th>

<th>Section</th>

<th>Gender</th>

<th>Mobile</th>

<th>Status</th>

</tr>

</thead>

<tbody>

`;

    if (students.length === 0) {

        html += `

<tr>

<td colspan="7">

No records found.

</td>

</tr>

`;

    }

    students.forEach(student => {

        html += `

<tr>

<td>${student.admissionNo}</td>

<td>${student.studentName}</td>

<td>${student.class}</td>

<td>${student.section}</td>

<td>${student.gender}</td>

<td>${student.mobile || "-"}</td>

<td>${student.status}</td>

</tr>

`;

    });

    html += `

</tbody>

</table>

`;

    document.getElementById(
        "studentReportResult"
    ).innerHTML = html;

}

/*==========================================
 Print Report
==========================================*/

function printStudentReport(){

    const report = document.getElementById(
        "studentReportResult"
    ).innerHTML;

    const win = window.open(
        "",
        "_blank"
    );

    win.document.write(`

<html>

<head>

<title>Student Report</title>

<style>

body{

font-family:Arial;

padding:20px;

}

table{

width:100%;

border-collapse:collapse;

}

table,th,td{

border:1px solid #000;

padding:8px;

}

</style>

</head>

<body>

<h2>Student Report</h2>

${report}

<script>

window.onload=function(){

window.print();

window.close();

}

<\/script>

</body>

</html>

`);

    win.document.close();

}

/*==========================================
 Export CSV
==========================================*/

function exportStudentCSV(){

    const students = Database.getAll(
        Students.storageKey
    );

    let csv =
"Admission No,Student Name,Class,Section,Gender,Mobile,Status\n";

    students.forEach(student=>{

        csv +=

`${student.admissionNo},
${student.studentName},
${student.class},
${student.section},
${student.gender},
${student.mobile},
${student.status}\n`;

    });

    const blob = new Blob(
        [csv],
        {type:"text/csv"}
    );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "Student_Report.csv";

    a.click();

    URL.revokeObjectURL(url);

}

/* ===== assets/js/students/importExport.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/students/importExport.js
==================================================*/

/*==========================================
 Export Students (JSON Backup)
==========================================*/

function exportStudents() {

    const students = Database.getAll(
        Students.storageKey
    );

    const blob = new Blob(
        [JSON.stringify(students, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "students_backup.json";
    a.click();

    URL.revokeObjectURL(url);

    Utils.message("Students exported successfully.");

}

/*==========================================
 Import Students
==========================================*/

function importStudents() {

    const input = document.createElement("input");

    input.type = "file";

    input.accept = ".json";

    input.onchange = function (e) {

        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (event) {

            try {

                const imported =
                    JSON.parse(event.target.result);

                if (!Array.isArray(imported)) {

                    Utils.message("Invalid backup file.");

                    return;

                }

                mergeStudents(imported);

            } catch (err) {

                console.error(err);

                Utils.message("Unable to import file.");

            }

        };

        reader.readAsText(file);

    };

    input.click();

}

/*==========================================
 Merge Students
==========================================*/

function mergeStudents(importedStudents) {

    let students = Database.getAll(
        Students.storageKey
    );

    let added = 0;

    let skipped = 0;

    importedStudents.forEach(student => {

        const exists = students.some(s =>

            s.studentId === student.studentId ||

            s.admissionNo === student.admissionNo

        );

        if (exists) {

            skipped++;

            return;

        }

        students.push(student);

        added++;

    });

    StorageManager.save(

        Students.storageKey,

        students

    );

    if (typeof addAuditLog === "function") {

        addAuditLog(

            "Students",

            "Import",

            `${added} Added, ${skipped} Skipped`

        );

    }

    Utils.message(

        `${added} students imported.\n${skipped} duplicate records skipped.`

    );

    studentRegister();

}

/*==========================================
 Download CSV Template
==========================================*/

function downloadStudentTemplate() {

    const csv =

`AdmissionNo,StudentName,FatherName,MotherName,Gender,DOB,Class,Section,RollNo,Mobile,Email,Aadhaar,APAAR,BloodGroup,Category,Religion,Address`;

    const blob = new Blob(

        [csv],

        { type: "text/csv" }

    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "Student_Template.csv";

    a.click();

    URL.revokeObjectURL(url);

}

/*==========================================
 Backup Student Database
==========================================*/

function backupStudents() {

    exportStudents();

}

/*==========================================
 Restore Student Database
==========================================*/

function restoreStudents() {

    if (!confirm(

        "Restore student backup? Existing students will be merged."

    )) {

        return;

    }

    importStudents();

}

/* ===== assets/js/students/print.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/students/print.js
==================================================*/

/*==========================================
 Common Print Function
==========================================*/

function printContent(title, content) {

    const win = window.open("", "_blank");

    win.document.write(`
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
        }

        table{
            width:100%;
            border-collapse:collapse;
            margin-top:10px;
        }

        table,th,td{
            border:1px solid #000;
        }

        th,td{
            padding:8px;
            font-size:14px;
        }

        img{
            max-width:150px;
        }

        </style>

    </head>

    <body>

    ${content}

    <script>

    window.onload=function(){

        window.print();

        window.close();

    }

    <\/script>

    </body>

    </html>
    `);

    win.document.close();

}

/*==========================================
 Print Student Register
==========================================*/

function printStudentRegister(){

    const table=document.querySelector(
        "#studentWorkspace table"
    );

    if(!table){

        Utils.message("Nothing to print.");

        return;

    }

    printContent(

        "Student Register",

        `<h2>Student Register</h2>${table.outerHTML}`

    );

}

/*==========================================
 Print Student Profile
==========================================*/

function printStudent(studentId){

    const students=Database.getAll(
        Students.storageKey
    );

    const student=students.find(
        s=>s.studentId===studentId
    );

    if(!student){

        Utils.message("Student not found.");

        return;

    }

    const html=`

<h2>Student Profile</h2>

<table>

<tr>

<td width="180"><b>Admission No</b></td>

<td>${student.admissionNo}</td>

</tr>

<tr>

<td><b>Name</b></td>

<td>${NameHelper.display(student.studentName, students, "studentName")}</td>

</tr>

<tr>

<td><b>Father</b></td>

<td>${student.fatherName}</td>

</tr>

<tr>

<td><b>Mother</b></td>

<td>${student.motherName||"-"}</td>

</tr>

<tr>

<td><b>Class</b></td>

<td>${student.class} ${student.section}</td>

</tr>

<tr>

<td><b>Roll No.</b></td>

<td>${student.rollNo}</td>

</tr>

<tr>

<td><b>DOB</b></td>

<td>${student.dob}</td>

</tr>

<tr>

<td><b>Mobile</b></td>

<td>${student.mobile}</td>

</tr>

<tr>

<td><b>Address</b></td>

<td>${student.address||"-"}</td>

</tr>

</table>

`;

    printContent(

        "Student Profile",

        html

    );

}

/*==========================================
 Print Bonafide Certificate
==========================================*/

function printBonafideCertificate(){

    const card=document.querySelector(".card");

    if(card){

        printContent(

            "Bonafide Certificate",

            card.innerHTML

        );

    }

}

/*==========================================
 Print Transfer Certificate
==========================================*/

function printTransferCertificate(){

    const card=document.querySelector(".card");

    if(card){

        printContent(

            "Transfer Certificate",

            card.innerHTML

        );

    }

}

/*==========================================
 Print Student Report
==========================================*/

function printStudentReport(){

    const report=document.getElementById(
        "studentReportResult"
    );

    if(!report){

        Utils.message("No report found.");

        return;

    }

    printContent(

        "Student Report",

        report.innerHTML

    );

}

/*==========================================
 Export Current Register to PDF
==========================================*/

function exportRegisterPDF(){

    window.print();

}