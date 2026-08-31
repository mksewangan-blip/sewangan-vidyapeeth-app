
/* ===== assets/js/exams/exams.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/exams/exams.js
==================================================*/

const Exams = {

    /*==========================================
      Examination Dashboard
    ==========================================*/

    render() {

        document.getElementById("mainContent").innerHTML = `

<div class="page">

<div class="page-header">

<h2>📝 Examination Management</h2>

</div>

<div class="card">

<button class="btn"
onclick="newExam()">

➕ Create Exam

</button>

<button class="btn"
onclick="showExamList()">

📋 Exam List

</button>

<button class="btn"
onclick="scheduleExam()">

📅 Exam Schedule

</button>

<button class="btn"
onclick="enterMarks()">

✍ Enter Marks

</button>

<button class="btn"
onclick="examReports()">

📊 Reports

</button>

<button class="btn"
onclick="printExamSchedule()">

🖨 Print

</button>

</div>

<div id="examWorkspace">

<div class="card">

<h3>Examination Dashboard</h3>

<table class="table">

<tr>
<td width="260"><b>Total Exams</b></td>
<td id="totalExams">0</td>
</tr>

<tr>
<td><b>Scheduled Exams</b></td>
<td id="scheduledExams">0</td>
</tr>

<tr>
<td><b>Completed Exams</b></td>
<td id="completedExams">0</td>
</tr>

<tr>
<td><b>Total Subjects</b></td>
<td id="totalSubjects">0</td>
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

        this.updateStatistics();

    },

    /*==========================================
      Dashboard Statistics
    ==========================================*/

    updateStatistics() {

        const exams =
            Database.getAll(CONFIG.STORAGE.EXAMS);

        const schedules =
            Database.getAll(CONFIG.STORAGE.EXAM_SCHEDULES);

        const completed =
            schedules.filter(e => e.status === "Completed");

        const subjects =
            new Set(
                schedules.map(e => e.subject)
            );

        document.getElementById("totalExams").textContent =
            exams.length;

        document.getElementById("scheduledExams").textContent =
            schedules.length;

        document.getElementById("completedExams").textContent =
            completed.length;

        document.getElementById("totalSubjects").textContent =
            subjects.size;

    }

};

/* ===== assets/js/exams/examForm.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/exams/examForm.js
==================================================*/

/*==========================================
  Create New Examination
==========================================*/

function newExam() {

    document.getElementById("examWorkspace").innerHTML = `

<div class="card">

<h2>📝 Create Examination</h2>

<table class="table">

<tr>
<td width="220">Exam ID</td>
<td>
<input
type="text"
id="examId"
readonly
value="EXM-${Date.now()}">
</td>
</tr>

<tr>
<td>Exam Name</td>
<td>
<input
type="text"
id="examName"
placeholder="Annual Examination 2026">
</td>
</tr>

<tr>
<td>Exam Type</td>
<td>

<select id="examType">

<option value="">Select</option>

<option>Unit Test - I</option>
<option>Unit Test - II</option>
<option>Monthly Test</option>
<option>Quarterly Examination</option>
<option>Half Yearly Examination</option>
<option>Annual Examination</option>
<option>Practical Examination</option>
<option>Internal Assessment</option>
<option>Model Test</option>
<option>Other</option>

</select>

</td>
</tr>

<tr>
<td>Academic Session</td>
<td>
<input
type="text"
id="academicSession"
value="${CONFIG.CURRENT_SESSION}">
</td>
</tr>

<tr>
<td>Applicable Class</td>
<td>

<select id="examClass">

<option value="">Select Class</option>

<option>Nursery</option>
<option>LKG</option>
<option>UKG</option>

<option>Class 1</option>
<option>Class 2</option>
<option>Class 3</option>
<option>Class 4</option>
<option>Class 5</option>
<option>Class 6</option>
<option>Class 7</option>
<option>Class 8</option>
<option>Class 9</option>
<option>Class 10</option>
<option>Class 11</option>
<option>Class 12</option>

</select>

</td>
</tr>

<tr>
<td>Start Date</td>
<td>
<input
type="date"
id="startDate"
value="${Utils.currentDate()}">
</td>
</tr>

<tr>
<td>End Date</td>
<td>
<input
type="date"
id="endDate"
value="${Utils.currentDate()}">
</td>
</tr>

<tr>
<td>Maximum Marks</td>
<td>
<input
type="number"
id="maximumMarks"
value="100"
min="1">
</td>
</tr>

<tr>
<td>Passing Marks</td>
<td>
<input
type="number"
id="passingMarks"
value="33"
min="0">
</td>
</tr>

<tr>
<td>Description</td>
<td>

<textarea
id="description"
rows="3"
placeholder="Optional remarks..."></textarea>

</td>
</tr>

<tr>
<td>Status</td>
<td>

<select id="examStatus">

<option>Scheduled</option>
<option>Ongoing</option>
<option>Completed</option>
<option>Cancelled</option>

</select>

</td>
</tr>

</table>

<br>

<button
class="btn"
onclick="saveExam()">

💾 Save Examination

</button>

<button
class="btn"
onclick="Exams.render()">

❌ Cancel

</button>

</div>

`;

}

/* ===== assets/js/exams/saveExam.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/exams/saveExam.js
==================================================*/

/*==========================================
 Save Examination
==========================================*/

function saveExam() {

    const exam = {

        examId:
            document.getElementById("examId").value.trim(),

        examName:
            document.getElementById("examName").value.trim(),

        examType:
            document.getElementById("examType").value,

        academicSession:
            document.getElementById("academicSession").value.trim(),

        examClass:
            document.getElementById("examClass").value,

        startDate:
            document.getElementById("startDate").value,

        endDate:
            document.getElementById("endDate").value,

        maximumMarks:
            Number(document.getElementById("maximumMarks").value),

        passingMarks:
            Number(document.getElementById("passingMarks").value),

        description:
            document.getElementById("description").value.trim(),

        status:
            document.getElementById("examStatus").value,

        createdOn:
            Utils.currentDateTime(),

        updatedOn:
            Utils.currentDateTime()

    };

    /*==========================================
      Validation
    ==========================================*/

    if (!exam.examName) {

        Utils.message("Please enter examination name.");

        return;

    }

    if (!exam.examType) {

        Utils.message("Please select examination type.");

        return;

    }

    if (!exam.examClass) {

        Utils.message("Please select class.");

        return;

    }

    if (!exam.startDate || !exam.endDate) {

        Utils.message("Please select examination dates.");

        return;

    }

    if (new Date(exam.endDate) < new Date(exam.startDate)) {

        Utils.message("End date cannot be before start date.");

        return;

    }

    if (exam.maximumMarks <= 0) {

        Utils.message("Maximum marks must be greater than zero.");

        return;

    }

    if (
        exam.passingMarks < 0 ||
        exam.passingMarks > exam.maximumMarks
    ) {

        Utils.message("Invalid passing marks.");

        return;

    }

    /*==========================================
      Duplicate Check
    ==========================================*/

    const exams = Database.getAll(CONFIG.STORAGE.EXAMS);

    const duplicate = exams.find(e =>

        e.examName.toLowerCase() === exam.examName.toLowerCase() &&

        e.examClass === exam.examClass &&

        e.academicSession === exam.academicSession

    );

    if (duplicate) {

        Utils.message(

            "This examination already exists for the selected class and session."

        );

        return;

    }

    /*==========================================
      Save Examination
    ==========================================*/

    Database.insert(

        CONFIG.STORAGE.EXAMS,

        exam

    );

    Utils.message("Examination created successfully.");

    showExamList();

}

/* ===== assets/js/exams/examList.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/exams/examList.js
==================================================*/

/*==========================================
 Show Examination List
==========================================*/

function showExamList() {

    const exams = Database.getAll(CONFIG.STORAGE.EXAMS);

    let html = `

<div class="card">

<h2>📝 Examination Register</h2>

<input
type="text"
id="examSearch"
class="search-box"
placeholder="Search by Exam Name, Type, Class or Session..."
onkeyup="filterExamList()">

<br><br>

<table class="table">

<thead>

<tr>

<th>#</th>
<th>Exam Name</th>
<th>Type</th>
<th>Class</th>
<th>Session</th>
<th>Start</th>
<th>End</th>
<th>Status</th>
<th>Action</th>

</tr>

</thead>

<tbody id="examTableBody">

`;

    if (exams.length === 0) {

        html += `

<tr>

<td colspan="9">

No examination found.

</td>

</tr>

`;

    }

    exams.forEach((exam, index) => {

        let badge = "🟢";

        switch (exam.status) {

            case "Ongoing":
                badge = "🟡";
                break;

            case "Completed":
                badge = "🔵";
                break;

            case "Cancelled":
                badge = "🔴";
                break;
        }

        html += `

<tr>

<td>${index + 1}</td>

<td>${exam.examName}</td>

<td>${exam.examType}</td>

<td>${exam.examClass}</td>

<td>${exam.academicSession}</td>

<td>${exam.startDate}</td>

<td>${exam.endDate}</td>

<td>${badge} ${exam.status}</td>

<td>

<button
class="btn"
onclick="viewExam(${index})">

👁

</button>

<button
class="btn"
onclick="editExam(${index})">

✏

</button>

<button
class="btn"
onclick="deleteExam(${index})">

🗑

</button>

<button
class="btn"
onclick="scheduleExam('${exam.examId}')">

📅

</button>

<button
class="btn"
onclick="enterMarks('${exam.examId}')">

📝

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
onclick="newExam()">

➕ New Exam

</button>

<button
class="btn"
onclick="printExamList()">

🖨 Print

</button>

<button
class="btn"
onclick="Exams.render()">

⬅ Back

</button>

</div>

`;

    document.getElementById("examWorkspace").innerHTML = html;

}

/*==========================================
 Search Examination
==========================================*/

function filterExamList() {

    const keyword = document
        .getElementById("examSearch")
        .value
        .toLowerCase();

    const rows = document.querySelectorAll(
        "#examTableBody tr"
    );

    rows.forEach(row => {

        row.style.display =

            row.innerText
                .toLowerCase()
                .includes(keyword)

            ? ""

            : "none";

    });

}

/*==========================================
 View Examination
==========================================*/

function viewExam(index) {

    const exam =
        Database.getAll(CONFIG.STORAGE.EXAMS)[index];

    if (!exam) {

        Utils.message("Examination not found.");

        return;

    }

    alert(

`Exam : ${exam.examName}

Type : ${exam.examType}

Class : ${exam.examClass}

Session : ${exam.academicSession}

Start : ${exam.startDate}

End : ${exam.endDate}

Maximum Marks : ${exam.maximumMarks}

Passing Marks : ${exam.passingMarks}

Status : ${exam.status}

Description : ${exam.description || "-"}`

    );

}

/*==========================================
 Edit Examination
==========================================*/

function editExam(index) {

    Utils.message(

        "Edit Examination module will be added next."

    );

}

/*==========================================
 Delete Examination
==========================================*/

function deleteExam(index) {

    const exams =
        Database.getAll(CONFIG.STORAGE.EXAMS);

    if (!exams[index]) {

        Utils.message("Examination not found.");

        return;

    }

    if (!confirm("Delete this examination?")) {

        return;

    }

    exams.splice(index, 1);

    StorageManager.save(

        CONFIG.STORAGE.EXAMS,

        exams

    );

    Utils.message("Examination deleted.");

    showExamList();

}

/* ===== assets/js/exams/schedule.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/exams/schedule.js
==================================================*/

/*==========================================
  Examination Schedule
==========================================*/

function scheduleExam(examId = "") {

    const exams = Database.getAll(CONFIG.STORAGE.EXAMS);

    if (exams.length === 0) {
        Utils.message("Create an examination first.");
        return;
    }

    const teachers = Database.getAll(CONFIG.STORAGE.TEACHERS);

    let examOptions = "";
    let teacherOptions = '<option value="">Select Teacher</option>';

    exams.forEach(exam => {

        examOptions += `
<option value="${exam.examId}" ${exam.examId === examId ? "selected" : ""}>
${exam.examName} (${exam.examClass})
</option>`;

    });

    teachers.forEach(teacher => {

        teacherOptions += `
<option value="${teacher.teacherId}">
${teacher.teacherName}
</option>`;

    });

    document.getElementById("examWorkspace").innerHTML = `

<div class="card">

<h2>📅 Examination Schedule</h2>

<table class="table">

<tr>
<td width="220">Examination</td>
<td>
<select id="scheduleExamId">
${examOptions}
</select>
</td>
</tr>

<tr>
<td>Subject</td>
<td>
<input type="text" id="subject" placeholder="Mathematics">
</td>
</tr>

<tr>
<td>Exam Date</td>
<td>
<input type="date" id="examDate" value="${Utils.currentDate()}">
</td>
</tr>

<tr>
<td>Start Time</td>
<td>
<input type="time" id="startTime">
</td>
</tr>

<tr>
<td>End Time</td>
<td>
<input type="time" id="endTime">
</td>
</tr>

<tr>
<td>Duration (Minutes)</td>
<td>
<input type="number" id="duration" value="180" min="30">
</td>
</tr>

<tr>
<td>Maximum Marks</td>
<td>
<input type="number" id="subjectMarks" value="100" min="1">
</td>
</tr>

<tr>
<td>Invigilator</td>
<td>
<select id="teacherId">
${teacherOptions}
</select>
</td>
</tr>

<tr>
<td>Room Number</td>
<td>
<input type="text" id="roomNo">
</td>
</tr>

<tr>
<td>Remarks</td>
<td>
<textarea id="remarks" rows="3"></textarea>
</td>
</tr>

</table>

<br>

<button class="btn" onclick="saveExamSchedule()">
💾 Save Schedule
</button>

<button class="btn" onclick="showExamSchedule()">
📋 View Schedule
</button>

<button class="btn" onclick="Exams.render()">
⬅ Back
</button>

</div>

`;

}

/*==========================================
 Save Examination Schedule
==========================================*/

function saveExamSchedule() {

    const examId = document.getElementById("scheduleExamId").value;

    if (!examId) {
        Utils.message("Please select an examination.");
        return;
    }

    const exams = Database.getAll(CONFIG.STORAGE.EXAMS);

    const exam = exams.find(e => e.examId === examId);

    const teachers = Database.getAll(CONFIG.STORAGE.TEACHERS);

    const teacher = teachers.find(
        t => t.teacherId === document.getElementById("teacherId").value
    );

    const schedule = {

        scheduleId: "SCH-" + Date.now(),

        examId: exam.examId,

        examName: exam.examName,

        examClass: exam.examClass,

        subject: document.getElementById("subject").value.trim(),

        examDate: document.getElementById("examDate").value,

        startTime: document.getElementById("startTime").value,

        endTime: document.getElementById("endTime").value,

        duration: Number(document.getElementById("duration").value),

        maximumMarks: Number(document.getElementById("subjectMarks").value),

        teacherId: teacher ? teacher.teacherId : "",

        teacherName: teacher ? teacher.teacherName : "",

        roomNo: document.getElementById("roomNo").value.trim(),

        remarks: document.getElementById("remarks").value.trim(),

        status: "Scheduled",

        createdOn: Utils.currentDateTime()

    };

    if (!schedule.subject) {
        Utils.message("Please enter subject.");
        return;
    }

    Database.insert(
        CONFIG.STORAGE.EXAM_SCHEDULES,
        schedule
    );

    Utils.message("Exam schedule saved successfully.");

    showExamSchedule();

}

/*==========================================
 Show Schedule
==========================================*/

function showExamSchedule() {

    const schedules = Database.getAll(CONFIG.STORAGE.EXAM_SCHEDULES);

    let html = `

<div class="card">

<h2>📅 Examination Schedule</h2>

<table class="table">

<tr>
<th>#</th>
<th>Exam</th>
<th>Class</th>
<th>Subject</th>
<th>Date</th>
<th>Time</th>
<th>Room</th>
<th>Teacher</th>
</tr>

`;

    if (schedules.length === 0) {

        html += `
<tr>
<td colspan="8">No schedule available.</td>
</tr>
`;

    } else {

        schedules.forEach((item, index) => {

            html += `
<tr>
<td>${index + 1}</td>
<td>${item.examName}</td>
<td>${item.examClass}</td>
<td>${item.subject}</td>
<td>${item.examDate}</td>
<td>${item.startTime} - ${item.endTime}</td>
<td>${item.roomNo}</td>
<td>${item.teacherName || "-"}</td>
</tr>
`;

        });

    }

    html += `

</table>

<br>

<button class="btn" onclick="scheduleExam()">
➕ Add Subject
</button>

<button class="btn" onclick="Exams.render()">
⬅ Back
</button>

</div>

`;

    document.getElementById("examWorkspace").innerHTML = html;

}

/* ===== assets/js/exams/marksEntry.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/exams/marksEntry.js
==================================================*/

/*==========================================
 Marks Entry Screen
==========================================*/

function enterMarks(examId = "") {

    const schedules = Database.getAll(CONFIG.STORAGE.EXAM_SCHEDULES);

    if (schedules.length === 0) {

        Utils.message("No examination schedule available.");

        return;

    }

    let scheduleOptions = '<option value="">Select Subject</option>';

    schedules.forEach(schedule => {

        if (!examId || schedule.examId === examId) {

            scheduleOptions += `
<option value="${schedule.scheduleId}">
${schedule.examName} | ${schedule.examClass} | ${schedule.subject}
</option>`;

        }

    });

    document.getElementById("examWorkspace").innerHTML = `

<div class="card">

<h2>📝 Marks Entry</h2>

<table class="table">

<tr>

<td width="220">Examination Subject</td>

<td>

<select id="scheduleId"
onchange="loadStudentsForMarks()">

${scheduleOptions}

</select>

</td>

</tr>

</table>

<div id="marksEntryArea"></div>

</div>

`;

}

/*==========================================
 Load Students
==========================================*/

function loadStudentsForMarks() {

    const scheduleId =
        document.getElementById("scheduleId").value;

    if (!scheduleId) return;

    const schedule = Database
        .getAll(CONFIG.STORAGE.EXAM_SCHEDULES)
        .find(s => s.scheduleId === scheduleId);

    if (!schedule) return;

    const students = Database
        .getAll(CONFIG.STORAGE.STUDENTS)
        .filter(student =>
            student.studentClass === schedule.examClass
        );

    let html = `

<br>

<table class="table">

<tr>

<th>Roll No.</th>
<th>Student Name</th>
<th>Maximum</th>
<th>Marks Obtained</th>
<th>Absent</th>

</tr>

`;

    students.forEach((student, index) => {

        html += `

<tr>

<td>${student.rollNo}</td>

<td>${student.studentName}</td>

<td>${schedule.maximumMarks}</td>

<td>

<input
type="number"
min="0"
max="${schedule.maximumMarks}"
id="marks_${index}"
style="width:80px;">

</td>

<td>

<input
type="checkbox"
id="absent_${index}">

</td>

</tr>

`;

    });

    html += `

</table>

<br>

<button
class="btn"
onclick="saveMarks('${scheduleId}')">

💾 Save Marks

</button>

`;

    document.getElementById("marksEntryArea").innerHTML = html;

}

/*==========================================
 Save Marks
==========================================*/

function saveMarks(scheduleId) {

    const schedule = Database
        .getAll(CONFIG.STORAGE.EXAM_SCHEDULES)
        .find(s => s.scheduleId === scheduleId);

    const students = Database
        .getAll(CONFIG.STORAGE.STUDENTS)
        .filter(student =>
            student.studentClass === schedule.examClass
        );

    const allMarks =
        Database.getAll(CONFIG.STORAGE.MARKS || "marks");

    students.forEach((student, index) => {

        const absent =
            document.getElementById(`absent_${index}`).checked;

        let marks = Number(
            document.getElementById(`marks_${index}`).value
        );

        if (absent) {

            marks = 0;

        }

        const existing = allMarks.find(record =>

            record.scheduleId === scheduleId &&

            record.studentId === student.studentId

        );

        if (existing) {

            existing.marks = marks;
            existing.absent = absent;
            existing.updatedOn = Utils.currentDateTime();

        } else {

            allMarks.push({

                markId: "MRK-" + Date.now() + "-" + index,

                examId: schedule.examId,

                scheduleId: schedule.scheduleId,

                examName: schedule.examName,

                subject: schedule.subject,

                studentId: student.studentId,

                rollNo: student.rollNo,

                studentName: student.studentName,

                studentClass: student.studentClass,

                maximumMarks: schedule.maximumMarks,

                marks: marks,

                absent: absent,

                result:
                    marks >= 33 && !absent
                        ? "Pass"
                        : "Fail",

                createdOn: Utils.currentDateTime()

            });

        }

    });

    StorageManager.save(

        CONFIG.STORAGE.MARKS || "marks",

        allMarks

    );

    Utils.message("Marks saved successfully.");

}

/* ===== assets/js/exams/reports.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/exams/reports.js
==================================================*/

/*==========================================
 Examination Reports Dashboard
==========================================*/

function examReports() {

    const exams = Database.getAll(CONFIG.STORAGE.EXAMS);

    const schedules = Database.getAll(
        CONFIG.STORAGE.EXAM_SCHEDULES
    );

    const marks = Database.getAll(
        CONFIG.STORAGE.MARKS || "marks"
    );

    const totalStudents =
        new Set(marks.map(m => m.studentId)).size;

    const passStudents =
        marks.filter(m => m.result === "Pass").length;

    const failStudents =
        marks.filter(m => m.result === "Fail").length;

    const averageMarks =
        marks.length
            ? (
                marks.reduce((t, m) => t + Number(m.marks || 0), 0)
                / marks.length
              ).toFixed(2)
            : 0;

    document.getElementById("examWorkspace").innerHTML = `

<div class="card">

<h2>📊 Examination Reports</h2>

<table class="table">

<tr>
<td width="280"><b>Total Examinations</b></td>
<td>${exams.length}</td>
</tr>

<tr>
<td><b>Total Scheduled Papers</b></td>
<td>${schedules.length}</td>
</tr>

<tr>
<td><b>Total Students Evaluated</b></td>
<td>${totalStudents}</td>
</tr>

<tr>
<td><b>Pass Entries</b></td>
<td>${passStudents}</td>
</tr>

<tr>
<td><b>Fail Entries</b></td>
<td>${failStudents}</td>
</tr>

<tr>
<td><b>Average Marks</b></td>
<td>${averageMarks}</td>
</tr>

</table>

<br>

<button class="btn"
onclick="subjectWiseReport()">

📚 Subject Report

</button>

<button class="btn"
onclick="topperReport()">

🏆 Top Performers

</button>

<button class="btn"
onclick="classResultSummary()">

🏫 Class Summary

</button>

<button class="btn"
onclick="exportExamReportCSV()">

📤 Export CSV

</button>

<button class="btn"
onclick="Exams.render()">

⬅ Back

</button>

</div>

`;

}

/*==========================================
 Subject-wise Report
==========================================*/

function subjectWiseReport() {

    const marks = Database.getAll(
        CONFIG.STORAGE.MARKS || "marks"
    );

    const report = {};

    marks.forEach(record => {

        if (!report[record.subject]) {

            report[record.subject] = {
                total: 0,
                count: 0,
                pass: 0,
                fail: 0
            };

        }

        report[record.subject].total += Number(record.marks || 0);
        report[record.subject].count++;

        if (record.result === "Pass") {

            report[record.subject].pass++;

        } else {

            report[record.subject].fail++;

        }

    });

    let html = `

<div class="card">

<h2>📚 Subject-wise Analysis</h2>

<table class="table">

<tr>

<th>Subject</th>
<th>Students</th>
<th>Average</th>
<th>Pass</th>
<th>Fail</th>

</tr>

`;

    Object.keys(report).forEach(subject => {

        const data = report[subject];

        html += `

<tr>

<td>${subject}</td>

<td>${data.count}</td>

<td>${(data.total / data.count).toFixed(2)}</td>

<td>${data.pass}</td>

<td>${data.fail}</td>

</tr>

`;

    });

    html += `

</table>

<br>

<button class="btn"
onclick="examReports()">

⬅ Back

</button>

</div>

`;

    document.getElementById("examWorkspace").innerHTML = html;

}

/*==========================================
 Top Performers
==========================================*/

function topperReport() {

    const marks = Database.getAll(
        CONFIG.STORAGE.MARKS || "marks"
    );

    const students = {};

    marks.forEach(record => {

        if (!students[record.studentId]) {

            students[record.studentId] = {

                studentName: record.studentName,

                studentClass: record.studentClass,

                total: 0

            };

        }

        students[record.studentId].total +=
            Number(record.marks || 0);

    });

    const topperList =
        Object.values(students)
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);

    let html = `

<div class="card">

<h2>🏆 Top 10 Performers</h2>

<table class="table">

<tr>

<th>Rank</th>
<th>Student</th>
<th>Class</th>
<th>Total Marks</th>

</tr>

`;

    topperList.forEach((student, index) => {

        html += `

<tr>

<td>${index + 1}</td>

<td>${student.studentName}</td>

<td>${student.studentClass}</td>

<td>${student.total}</td>

</tr>

`;

    });

    html += `

</table>

<br>

<button class="btn"
onclick="examReports()">

⬅ Back

</button>

</div>

`;

    document.getElementById("examWorkspace").innerHTML = html;

}

/*==========================================
 Class Result Summary
==========================================*/

function classResultSummary() {

    const marks = Database.getAll(
        CONFIG.STORAGE.MARKS || "marks"
    );

    const classes = {};

    marks.forEach(record => {

        if (!classes[record.studentClass]) {

            classes[record.studentClass] = {

                total: 0,
                pass: 0,
                fail: 0

            };

        }

        classes[record.studentClass].total++;

        if (record.result === "Pass") {

            classes[record.studentClass].pass++;

        } else {

            classes[record.studentClass].fail++;

        }

    });

    let html = `

<div class="card">

<h2>🏫 Class Result Summary</h2>

<table class="table">

<tr>

<th>Class</th>
<th>Total Entries</th>
<th>Pass</th>
<th>Fail</th>

</tr>

`;

    Object.keys(classes).forEach(cls => {

        html += `

<tr>

<td>${cls}</td>

<td>${classes[cls].total}</td>

<td>${classes[cls].pass}</td>

<td>${classes[cls].fail}</td>

</tr>

`;

    });

    html += `

</table>

<br>

<button class="btn"
onclick="examReports()">

⬅ Back

</button>

</div>

`;

    document.getElementById("examWorkspace").innerHTML = html;

}

/*==========================================
 Export Report CSV
==========================================*/

function exportExamReportCSV() {

    const marks = Database.getAll(
        CONFIG.STORAGE.MARKS || "marks"
    );

    if (marks.length === 0) {

        Utils.message("No examination records found.");

        return;

    }

    let csv =
"Exam,Subject,Student ID,Student Name,Class,Marks,Maximum,Result\n";

    marks.forEach(record => {

        csv += [

            record.examName,
            record.subject,
            record.studentId,
            record.studentName,
            record.studentClass,
            record.marks,
            record.maximumMarks,
            record.result

        ].join(",") + "\n";

    });

    const blob = new Blob(
        [csv],
        { type: "text/csv" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "exam_reports.csv";

    link.click();

    URL.revokeObjectURL(url);

}

/* ===== assets/js/exams/print.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/exams/print.js
==================================================*/

/*==========================================
 Common Print Window
==========================================*/

function openPrintWindow(title, body) {

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

margin:20px;

font-size:13px;

}

h2,h3{

text-align:center;

margin:4px;

}

table{

width:100%;

border-collapse:collapse;

margin-top:15px;

}

th,td{

border:1px solid #000;

padding:6px;

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

<h3>${title}</h3>

${body}

<div class="footer">

Printed On : ${Utils.currentDateTime()}

</div>

</body>

</html>

`);

    win.document.close();

    win.focus();

    win.print();

}

/*==========================================
 Print Examination Register
==========================================*/

function printExamList() {

    const exams =
        Database.getAll(CONFIG.STORAGE.EXAMS);

    let table = `

<table>

<tr>

<th>#</th>
<th>Exam</th>
<th>Type</th>
<th>Class</th>
<th>Session</th>
<th>Start</th>
<th>End</th>
<th>Status</th>

</tr>

`;

    exams.forEach((exam,index)=>{

        table += `

<tr>

<td>${index+1}</td>
<td>${exam.examName}</td>
<td>${exam.examType}</td>
<td>${exam.examClass}</td>
<td>${exam.academicSession}</td>
<td>${exam.startDate}</td>
<td>${exam.endDate}</td>
<td>${exam.status}</td>

</tr>

`;

    });

    table += "</table>";

    openPrintWindow("Examination Register",table);

}

/*==========================================
 Print Examination Schedule
==========================================*/

function printExamSchedule() {

    const schedules =
        Database.getAll(CONFIG.STORAGE.EXAM_SCHEDULES);

    let table = `

<table>

<tr>

<th>#</th>
<th>Exam</th>
<th>Subject</th>
<th>Date</th>
<th>Time</th>
<th>Room</th>
<th>Teacher</th>

</tr>

`;

    schedules.forEach((item,index)=>{

        table += `

<tr>

<td>${index+1}</td>
<td>${item.examName}</td>
<td>${item.subject}</td>
<td>${item.examDate}</td>
<td>${item.startTime} - ${item.endTime}</td>
<td>${item.roomNo}</td>
<td>${item.teacherName}</td>

</tr>

`;

    });

    table += "</table>";

    openPrintWindow("Examination Schedule",table);

}

/*==========================================
 Print Marks Register
==========================================*/

function printMarksRegister() {

    const marks =
        Database.getAll(CONFIG.STORAGE.MARKS || "marks");

    let table = `

<table>

<tr>

<th>#</th>
<th>Student</th>
<th>Class</th>
<th>Subject</th>
<th>Marks</th>
<th>Maximum</th>
<th>Result</th>

</tr>

`;

    marks.forEach((record,index)=>{

        table += `

<tr>

<td>${index+1}</td>
<td>${record.studentName}</td>
<td>${record.studentClass}</td>
<td>${record.subject}</td>
<td>${record.marks}</td>
<td>${record.maximumMarks}</td>
<td>${record.result}</td>

</tr>

`;

    });

    table += "</table>";

    openPrintWindow("Marks Register",table);

}

/*==========================================
 Print Subject Mark Sheet
==========================================*/

function printSubjectMarkSheet(subject) {

    const marks = Database
        .getAll(CONFIG.STORAGE.MARKS || "marks")
        .filter(m => m.subject === subject);

    let table = `

<table>

<tr>

<th>#</th>
<th>Student</th>
<th>Class</th>
<th>Marks</th>
<th>Maximum</th>
<th>Result</th>

</tr>

`;

    marks.forEach((record,index)=>{

        table += `

<tr>

<td>${index+1}</td>
<td>${record.studentName}</td>
<td>${record.studentClass}</td>
<td>${record.marks}</td>
<td>${record.maximumMarks}</td>
<td>${record.result}</td>

</tr>

`;

    });

    table += "</table>";

    openPrintWindow(

        `${subject} Mark Sheet`,

        table

    );

}

/*==========================================
 Print Class Result Sheet
==========================================*/

function printClassResultSheet(studentClass) {

    const marks = Database
        .getAll(CONFIG.STORAGE.MARKS || "marks")
        .filter(m => m.studentClass === studentClass);

    let table = `

<table>

<tr>

<th>#</th>
<th>Student</th>
<th>Subject</th>
<th>Marks</th>
<th>Maximum</th>
<th>Result</th>

</tr>

`;

    marks.forEach((record,index)=>{

        table += `

<tr>

<td>${index+1}</td>
<td>${record.studentName}</td>
<td>${record.subject}</td>
<td>${record.marks}</td>
<td>${record.maximumMarks}</td>
<td>${record.result}</td>

</tr>

`;

    });

    table += "</table>";

    openPrintWindow(

        `${studentClass} Result Sheet`,

        table

    );

}

/* ===== assets/js/results/results.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/results/results.js
==================================================*/

const Results = {

    render() {

        document.getElementById("mainContent").innerHTML = `

<div class="page">

<div class="page-header">

<h2>🏆 Result Management</h2>

</div>

<div class="card">

<button class="btn"
onclick="generateResult()">

📄 Generate Result

</button>

<button class="btn"
onclick="studentResult()">

👨‍🎓 Student Result

</button>

<button class="btn"
onclick="classResult()">

🏫 Class Result

</button>

<button class="btn"
onclick="meritList()">

🥇 Merit List

</button>

<button class="btn"
onclick="resultReports()">

📊 Reports

</button>

<button class="btn"
onclick="printReportCard()">

🖨 Report Card

</button>

</div>

<div id="resultWorkspace">

<div class="card">

<h3>Result Dashboard</h3>

<table class="table">

<tr>
<td width="250"><b>Total Results</b></td>
<td id="totalResults">0</td>
</tr>

<tr>
<td><b>Total Students</b></td>
<td id="totalStudents">0</td>
</tr>

<tr>
<td><b>Passed Students</b></td>
<td id="passedStudents">0</td>
</tr>

<tr>
<td><b>Failed Students</b></td>
<td id="failedStudents">0</td>
</tr>

<tr>
<td><b>Academic Session</b></td>
<td>${CONFIG.CURRENT_SESSION}</td>
</tr>

</table>

</div>

</div>

</div>

`;

        this.updateDashboard();

    },

    updateDashboard() {

        const results = Database.getAll(
            CONFIG.STORAGE.RESULTS || "results"
        );

        document.getElementById("totalResults").textContent =
            results.length;

        document.getElementById("totalStudents").textContent =
            new Set(results.map(r => r.studentId)).size;

        document.getElementById("passedStudents").textContent =
            results.filter(r => r.result === "Pass").length;

        document.getElementById("failedStudents").textContent =
            results.filter(r => r.result === "Fail").length;

    }

};

/* ===== assets/js/results/generate.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/results/generate.js
==================================================*/

/*==========================================
 Generate Result
==========================================*/

function generateResult() {

    const marks = Database.getAll(
        CONFIG.STORAGE.MARKS || "marks"
    );

    if (marks.length === 0) {

        Utils.message("No marks available.");

        return;

    }

    const resultData = {};

    marks.forEach(mark => {

        if (!resultData[mark.studentId]) {

            resultData[mark.studentId] = {

                resultId: "RES-" + mark.studentId,

                studentId: mark.studentId,

                rollNo: mark.rollNo,

                studentName: mark.studentName,

                studentClass: mark.studentClass,

                examId: mark.examId,

                examName: mark.examName,

                totalMarks: 0,

                obtainedMarks: 0,

                subjects: 0,

                passedSubjects: 0,

                failedSubjects: 0,

                subjectDetails: []

            };

        }

        const result = resultData[mark.studentId];

        result.subjects++;

        result.totalMarks += Number(mark.maximumMarks);

        result.obtainedMarks += Number(mark.marks);

        result.subjectDetails.push({

            subject: mark.subject,

            obtained: Number(mark.marks),

            maximum: Number(mark.maximumMarks),

            result: mark.result

        });

        if (mark.result === "Pass") {

            result.passedSubjects++;

        } else {

            result.failedSubjects++;

        }

    });

    const results = [];

    Object.values(resultData).forEach(result => {

        result.percentage = Number(

            (

                result.obtainedMarks /

                result.totalMarks *

                100

            ).toFixed(2)

        );

        /* Grade */

        if (result.percentage >= 90)
            result.grade = "A+";
        else if (result.percentage >= 80)
            result.grade = "A";
        else if (result.percentage >= 70)
            result.grade = "B+";
        else if (result.percentage >= 60)
            result.grade = "B";
        else if (result.percentage >= 50)
            result.grade = "C";
        else if (result.percentage >= 40)
            result.grade = "D";
        else
            result.grade = "E";

        /* Division */

        if (result.percentage >= 60)
            result.division = "First";

        else if (result.percentage >= 45)
            result.division = "Second";

        else if (result.percentage >= 33)
            result.division = "Third";

        else
            result.division = "-";

        /* Final Result */

        result.result =
            result.failedSubjects === 0
                ? "Pass"
                : "Fail";

        /* Promotion */

        result.promotion =
            result.result === "Pass"
                ? "Promoted"
                : "Not Promoted";

        result.generatedOn =
            Utils.currentDateTime();

        results.push(result);

    });

    /*==========================================
      Ranking (Class-wise)
    ==========================================*/

    const grouped = {};

    results.forEach(result => {

        if (!grouped[result.studentClass]) {

            grouped[result.studentClass] = [];

        }

        grouped[result.studentClass].push(result);

    });

    Object.values(grouped).forEach(classResults => {

        classResults.sort(

            (a, b) =>

                b.percentage - a.percentage

        );

        classResults.forEach((student, index) => {

            student.rank = index + 1;

        });

    });

    /*==========================================
      Save Results
    ==========================================*/

    StorageManager.save(

        CONFIG.STORAGE.RESULTS || "results",

        results

    );

    Utils.message(

        results.length +

        " results generated successfully."

    );

    Results.updateDashboard();

}

/* ===== assets/js/results/studentResult.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/results/studentResult.js
==================================================*/

/*==========================================
 Student Result
==========================================*/

function studentResult() {

    const studentId = prompt("Enter Student ID");

    if (!studentId) return;

    const results = Database.getAll(

        CONFIG.STORAGE.RESULTS || "results"

    );

    const result = results.find(

        r => r.studentId === studentId

    );

    if (!result) {

        Utils.message("Result not found.");

        return;

    }

    let html = `

<div class="card">

<h2>🎓 Student Result</h2>

<table class="table">

<tr>

<td width="220"><b>Student ID</b></td>

<td>${result.studentId}</td>

</tr>

<tr>

<td><b>Roll No.</b></td>

<td>${result.rollNo}</td>

</tr>

<tr>

<td><b>Name</b></td>

<td>${result.studentName}</td>

</tr>

<tr>

<td><b>Class</b></td>

<td>${result.studentClass}</td>

</tr>

<tr>

<td><b>Examination</b></td>

<td>${result.examName}</td>

</tr>

<tr>

<td><b>Total Marks</b></td>

<td>${result.totalMarks}</td>

</tr>

<tr>

<td><b>Obtained Marks</b></td>

<td>${result.obtainedMarks}</td>

</tr>

<tr>

<td><b>Percentage</b></td>

<td>${result.percentage}%</td>

</tr>

<tr>

<td><b>Grade</b></td>

<td>${result.grade}</td>

</tr>

<tr>

<td><b>Division</b></td>

<td>${result.division}</td>

</tr>

<tr>

<td><b>Class Rank</b></td>

<td>${result.rank}</td>

</tr>

<tr>

<td><b>Result</b></td>

<td>${result.result}</td>

</tr>

<tr>

<td><b>Promotion</b></td>

<td>${result.promotion}</td>

</tr>

</table>

<br>

<h3>Subject-wise Marks</h3>

<table class="table">

<tr>

<th>Subject</th>

<th>Obtained</th>

<th>Maximum</th>

<th>Result</th>

</tr>

`;

    result.subjectDetails.forEach(subject => {

        html += `

<tr>

<td>${subject.subject}</td>

<td>${subject.obtained}</td>

<td>${subject.maximum}</td>

<td>${subject.result}</td>

</tr>

`;

    });

    html += `

</table>

<br>

<button
class="btn"
onclick="printStudentReport('${result.studentId}')">

🖨 Print Report Card

</button>

<button
class="btn"
onclick="Results.render()">

⬅ Back

</button>

</div>

`;

    document.getElementById("resultWorkspace").innerHTML = html;

}

/* ===== assets/js/results/classResult.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/results/classResult.js
==================================================*/

/*==========================================
 Class Result Register
==========================================*/

function classResult() {

    const className = prompt("Enter Class (Example: Class 10)");

    if (!className) return;

    const results = Database
        .getAll(CONFIG.STORAGE.RESULTS || "results")
        .filter(r => r.studentClass === className);

    if (results.length === 0) {

        Utils.message("No results found for " + className);

        return;

    }

    results.sort((a, b) => a.rank - b.rank);

    let pass = 0;
    let fail = 0;
    let totalPercentage = 0;

    let html = `

<div class="card">

<h2>🏫 ${className} Result Register</h2>

<table class="table">

<tr>

<th>Rank</th>
<th>Roll No.</th>
<th>Student Name</th>
<th>Obtained</th>
<th>Total</th>
<th>%</th>
<th>Grade</th>
<th>Division</th>
<th>Result</th>

</tr>

`;

    results.forEach(student => {

        totalPercentage += Number(student.percentage);

        if (student.result === "Pass")
            pass++;
        else
            fail++;

        html += `

<tr>

<td>${student.rank}</td>

<td>${student.rollNo}</td>

<td>${student.studentName}</td>

<td>${student.obtainedMarks}</td>

<td>${student.totalMarks}</td>

<td>${student.percentage}%</td>

<td>${student.grade}</td>

<td>${student.division}</td>

<td>${student.result}</td>

</tr>

`;

    });

    const average = (

        totalPercentage /

        results.length

    ).toFixed(2);

    html += `

</table>

<br>

<div class="card">

<h3>Class Summary</h3>

<table class="table">

<tr>

<td width="250"><b>Total Students</b></td>

<td>${results.length}</td>

</tr>

<tr>

<td><b>Passed</b></td>

<td>${pass}</td>

</tr>

<tr>

<td><b>Failed</b></td>

<td>${fail}</td>

</tr>

<tr>

<td><b>Average Percentage</b></td>

<td>${average}%</td>

</tr>

<tr>

<td><b>Pass Percentage</b></td>

<td>${((pass/results.length)*100).toFixed(2)}%</td>

</tr>

</table>

</div>

<br>

<button
class="btn"
onclick="printClassResultSheet('${className}')">

🖨 Print Result Sheet

</button>

<button
class="btn"
onclick="Results.render()">

⬅ Back

</button>

</div>

`;

    document.getElementById("resultWorkspace").innerHTML = html;

}

/* ===== assets/js/results/meritList.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/results/meritList.js
==================================================*/

/*==========================================
 Merit List
==========================================*/

function meritList() {

    const results = Database.getAll(
        CONFIG.STORAGE.RESULTS || "results"
    );

    if (results.length === 0) {

        Utils.message("No results available.");

        return;

    }

    /*------------------------------------------
      Sort by Percentage
    ------------------------------------------*/

    const merit = [...results].sort((a, b) => {

        if (b.percentage !== a.percentage) {

            return b.percentage - a.percentage;

        }

        return b.obtainedMarks - a.obtainedMarks;

    });

    let html = `

<div class="card">

<h2>🏆 School Merit List</h2>

<input
type="text"
id="meritSearch"
class="search-box"
placeholder="Search Student..."
onkeyup="filterMeritList()">

<br><br>

<table class="table">

<thead>

<tr>

<th>Rank</th>

<th>Roll No.</th>

<th>Student Name</th>

<th>Class</th>

<th>Exam</th>

<th>Obtained</th>

<th>Total</th>

<th>%</th>

<th>Grade</th>

<th>Result</th>

</tr>

</thead>

<tbody id="meritTableBody">

`;

    merit.forEach((student, index) => {

        html += `

<tr>

<td>${index + 1}</td>

<td>${student.rollNo}</td>

<td>${student.studentName}</td>

<td>${student.studentClass}</td>

<td>${student.examName}</td>

<td>${student.obtainedMarks}</td>

<td>${student.totalMarks}</td>

<td>${student.percentage}%</td>

<td>${student.grade}</td>

<td>${student.result}</td>

</tr>

`;

    });

    html += `

</tbody>

</table>

<br>

<div class="card">

<h3>🥇 School Topper</h3>

<table class="table">

<tr>

<td width="220"><b>Name</b></td>

<td>${merit[0].studentName}</td>

</tr>

<tr>

<td><b>Class</b></td>

<td>${merit[0].studentClass}</td>

</tr>

<tr>

<td><b>Percentage</b></td>

<td>${merit[0].percentage}%</td>

</tr>

<tr>

<td><b>Grade</b></td>

<td>${merit[0].grade}</td>

</tr>

</table>

</div>

<br>

<button
class="btn"
onclick="printMeritList()">

🖨 Print Merit List

</button>

<button
class="btn"
onclick="Results.render()">

⬅ Back

</button>

</div>

`;

    document.getElementById("resultWorkspace").innerHTML = html;

}

/*==========================================
 Filter Merit List
==========================================*/

function filterMeritList() {

    const keyword = document
        .getElementById("meritSearch")
        .value
        .toLowerCase();

    const rows = document.querySelectorAll(
        "#meritTableBody tr"
    );

    rows.forEach(row => {

        row.style.display =
            row.innerText
                .toLowerCase()
                .includes(keyword)
                ? ""
                : "none";

    });

}

/*==========================================
 Class-wise Topper
==========================================*/

function classWiseTopper(className) {

    const results = Database
        .getAll(CONFIG.STORAGE.RESULTS || "results")
        .filter(r => r.studentClass === className);

    if (results.length === 0) {

        Utils.message("No result found.");

        return;

    }

    results.sort((a, b) => b.percentage - a.percentage);

    return results[0];

}

/*==========================================
 Top 10 Merit List
==========================================*/

function topTenMeritList() {

    return Database
        .getAll(CONFIG.STORAGE.RESULTS || "results")
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 10);

}

/* ===== assets/js/results/reports.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/results/reports.js
==================================================*/

/*==========================================
 Result Reports Dashboard
==========================================*/

function resultReports() {

    const results = Database.getAll(
        CONFIG.STORAGE.RESULTS || "results"
    );

    if (results.length === 0) {

        Utils.message("No results available.");

        return;

    }

    const totalStudents = results.length;

    const passed = results.filter(r => r.result === "Pass").length;

    const failed = results.filter(r => r.result === "Fail").length;

    const average = (
        results.reduce(
            (sum, r) => sum + Number(r.percentage || 0),
            0
        ) / totalStudents
    ).toFixed(2);

    const passPercent = (
        (passed / totalStudents) * 100
    ).toFixed(2);

    const failPercent = (
        (failed / totalStudents) * 100
    ).toFixed(2);

    document.getElementById("resultWorkspace").innerHTML = `

<div class="card">

<h2>📊 Result Reports</h2>

<table class="table">

<tr>
<td width="250"><b>Total Students</b></td>
<td>${totalStudents}</td>
</tr>

<tr>
<td><b>Passed Students</b></td>
<td>${passed}</td>
</tr>

<tr>
<td><b>Failed Students</b></td>
<td>${failed}</td>
</tr>

<tr>
<td><b>Pass Percentage</b></td>
<td>${passPercent}%</td>
</tr>

<tr>
<td><b>Fail Percentage</b></td>
<td>${failPercent}%</td>
</tr>

<tr>
<td><b>Average Percentage</b></td>
<td>${average}%</td>
</tr>

</table>

<br>

<button class="btn"
onclick="classPerformanceReport()">

🏫 Class Performance

</button>

<button class="btn"
onclick="gradeDistributionReport()">

🎓 Grade Distribution

</button>

<button class="btn"
onclick="exportResultCSV()">

📤 Export CSV

</button>

<button class="btn"
onclick="Results.render()">

⬅ Back

</button>

</div>

`;

}

/*==========================================
 Class Performance Report
==========================================*/

function classPerformanceReport() {

    const results = Database.getAll(
        CONFIG.STORAGE.RESULTS || "results"
    );

    const classes = {};

    results.forEach(result => {

        if (!classes[result.studentClass]) {

            classes[result.studentClass] = {

                total: 0,
                pass: 0,
                percentage: 0

            };

        }

        classes[result.studentClass].total++;

        if (result.result === "Pass") {

            classes[result.studentClass].pass++;

        }

        classes[result.studentClass].percentage +=
            Number(result.percentage);

    });

    let html = `

<div class="card">

<h2>🏫 Class Performance Report</h2>

<table class="table">

<tr>

<th>Class</th>

<th>Total</th>

<th>Passed</th>

<th>Pass %</th>

<th>Average %</th>

</tr>

`;

    Object.keys(classes).forEach(cls => {

        const c = classes[cls];

        html += `

<tr>

<td>${cls}</td>

<td>${c.total}</td>

<td>${c.pass}</td>

<td>${((c.pass / c.total) * 100).toFixed(2)}%</td>

<td>${(c.percentage / c.total).toFixed(2)}%</td>

</tr>

`;

    });

    html += `

</table>

<br>

<button class="btn"
onclick="resultReports()">

⬅ Back

</button>

</div>

`;

    document.getElementById("resultWorkspace").innerHTML = html;

}

/*==========================================
 Grade Distribution
==========================================*/

function gradeDistributionReport() {

    const results = Database.getAll(
        CONFIG.STORAGE.RESULTS || "results"
    );

    const grades = {};

    results.forEach(result => {

        grades[result.grade] =
            (grades[result.grade] || 0) + 1;

    });

    let html = `

<div class="card">

<h2>🎓 Grade Distribution</h2>

<table class="table">

<tr>

<th>Grade</th>

<th>Students</th>

</tr>

`;

    Object.keys(grades)
        .sort()
        .forEach(grade => {

            html += `

<tr>

<td>${grade}</td>

<td>${grades[grade]}</td>

</tr>

`;

        });

    html += `

</table>

<br>

<button class="btn"
onclick="resultReports()">

⬅ Back

</button>

</div>

`;

    document.getElementById("resultWorkspace").innerHTML = html;

}

/*==========================================
 Export Result CSV
==========================================*/

function exportResultCSV() {

    const results = Database.getAll(
        CONFIG.STORAGE.RESULTS || "results"
    );

    if (results.length === 0) {

        Utils.message("No results available.");

        return;

    }

    let csv =
"Student ID,Roll No,Student Name,Class,Exam,Obtained,Total,Percentage,Grade,Division,Rank,Result,Promotion\n";

    results.forEach(result => {

        csv += [

            result.studentId,
            result.rollNo,
            result.studentName,
            result.studentClass,
            result.examName,
            result.obtainedMarks,
            result.totalMarks,
            result.percentage,
            result.grade,
            result.division,
            result.rank,
            result.result,
            result.promotion

        ].join(",") + "\n";

    });

    const blob = new Blob(
        [csv],
        { type: "text/csv" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "result_reports.csv";

    link.click();

    URL.revokeObjectURL(url);

}

/* ===== assets/js/results/print.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/results/print.js
==================================================*/

/*==========================================
 Common Print Window
==========================================*/

function resultPrintWindow(title, content) {

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

margin:20px;

font-size:13px;

}

.header{

text-align:center;

margin-bottom:20px;

}

.header img{

height:70px;

}

table{

width:100%;

border-collapse:collapse;

margin-top:10px;

}

th,td{

border:1px solid #000;

padding:6px;

}

th{

background:#eeeeee;

}

.signatures{

margin-top:50px;

display:flex;

justify-content:space-between;

}

.footer{

margin-top:20px;

text-align:right;

font-size:12px;

}

</style>

</head>

<body>

<div class="header">

<img src="assets/images/logo.png">

<h2>${CONFIG.SCHOOL_NAME}</h2>

<h3>${title}</h3>

<p>${CONFIG.SCHOOL_ADDRESS || ""}</p>

</div>

${content}

<div class="signatures">

<div>

_____________________<br>

Class Teacher

</div>

<div>

_____________________<br>

Principal

</div>

</div>

<div class="footer">

Printed On :
${Utils.currentDateTime()}

</div>

</body>

</html>
`);

    win.document.close();
    win.focus();
    win.print();

}

/*==========================================
 Student Report Card
==========================================*/

function printStudentReport(studentId) {

    const results = Database.getAll(
        CONFIG.STORAGE.RESULTS || "results"
    );

    const result = results.find(
        r => r.studentId === studentId
    );

    if (!result) {

        Utils.message("Result not found.");

        return;

    }

    let html = `

<table>

<tr>

<td><b>Student</b></td>

<td>${result.studentName}</td>

<td><b>Roll No.</b></td>

<td>${result.rollNo}</td>

</tr>

<tr>

<td><b>Class</b></td>

<td>${result.studentClass}</td>

<td><b>Exam</b></td>

<td>${result.examName}</td>

</tr>

</table>

<br>

<table>

<tr>

<th>Subject</th>

<th>Obtained</th>

<th>Maximum</th>

<th>Result</th>

</tr>

`;

    result.subjectDetails.forEach(subject => {

        html += `

<tr>

<td>${subject.subject}</td>

<td>${subject.obtained}</td>

<td>${subject.maximum}</td>

<td>${subject.result}</td>

</tr>

`;

    });

    html += `

</table>

<br>

<table>

<tr><td><b>Total Marks</b></td><td>${result.totalMarks}</td></tr>

<tr><td><b>Obtained Marks</b></td><td>${result.obtainedMarks}</td></tr>

<tr><td><b>Percentage</b></td><td>${result.percentage}%</td></tr>

<tr><td><b>Grade</b></td><td>${result.grade}</td></tr>

<tr><td><b>Division</b></td><td>${result.division}</td></tr>

<tr><td><b>Rank</b></td><td>${result.rank}</td></tr>

<tr><td><b>Result</b></td><td>${result.result}</td></tr>

<tr><td><b>Promotion</b></td><td>${result.promotion}</td></tr>

</table>

`;

    resultPrintWindow("Student Report Card", html);

}

/*==========================================
 Print Merit List
==========================================*/

function printMeritList() {

    const results = Database.getAll(
        CONFIG.STORAGE.RESULTS || "results"
    );

    const list = [...results].sort(
        (a, b) => b.percentage - a.percentage
    );

    let html = `

<table>

<tr>

<th>Rank</th>

<th>Student</th>

<th>Class</th>

<th>Percentage</th>

<th>Grade</th>

</tr>

`;

    list.forEach((student, index) => {

        html += `

<tr>

<td>${index + 1}</td>

<td>${student.studentName}</td>

<td>${student.studentClass}</td>

<td>${student.percentage}%</td>

<td>${student.grade}</td>

</tr>

`;

    });

    html += "</table>";

    resultPrintWindow("School Merit List", html);

}

/*==========================================
 Print Result Summary
==========================================*/

function printResultSummary() {

    const results = Database.getAll(
        CONFIG.STORAGE.RESULTS || "results"
    );

    const pass = results.filter(
        r => r.result === "Pass"
    ).length;

    const fail = results.filter(
        r => r.result === "Fail"
    ).length;

    const average = results.length
        ? (
            results.reduce(
                (sum, r) => sum + Number(r.percentage),
                0
            ) / results.length
          ).toFixed(2)
        : 0;

    const html = `

<table>

<tr>

<td><b>Total Students</b></td>

<td>${results.length}</td>

</tr>

<tr>

<td><b>Passed</b></td>

<td>${pass}</td>

</tr>

<tr>

<td><b>Failed</b></td>

<td>${fail}</td>

</tr>

<tr>

<td><b>Average Percentage</b></td>

<td>${average}%</td>

</tr>

</table>

`;

    resultPrintWindow("Result Summary", html);

}