
/* ===== assets/js/timetable/timetable.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/timetable/timetable.js
==================================================*/

const Timetable = {

    /*==========================================
      Timetable Dashboard
    ==========================================*/

    render() {

        document.getElementById("mainContent").innerHTML = `

<div class="page">

<div class="page-header">

<h2>🗓 Timetable Management</h2>

</div>

<div class="card">

<button class="btn"
onclick="newSchedule()">

➕ New Schedule

</button>

<button class="btn"
onclick="showClassTimetable()">

🏫 Class Timetable

</button>

<button class="btn"
onclick="showTeacherTimetable()">

👨‍🏫 Teacher Timetable

</button>

<button class="btn"
onclick="subjectAllocation()">

📚 Subject Allocation

</button>

<button class="btn"
onclick="timetableReports()">

📊 Reports

</button>

<button class="btn"
onclick="printTimetable()">

🖨 Print

</button>

</div>

<div id="timetableWorkspace">

<div class="card">

<h3>Timetable Dashboard</h3>

<table class="table">

<tr>

<td width="250"><b>Total Classes</b></td>

<td>${Database.getAll(CONFIG.STORAGE.STUDENTS)
.map(s => s.class)
.filter((v,i,a)=>a.indexOf(v)===i).length}</td>

</tr>

<tr>

<td><b>Total Teachers</b></td>

<td>${Database.count(CONFIG.STORAGE.TEACHERS)}</td>

</tr>

<tr>

<td><b>Total Schedules</b></td>

<td>${Database.count(CONFIG.STORAGE.TIMETABLE)}</td>

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

    }

};

/* ===== assets/js/timetable/newSchedule.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/timetable/newSchedule.js
==================================================*/

/*==========================================
 New Timetable Schedule
==========================================*/

function newSchedule() {

    const teachers =
        Database.getAll(CONFIG.STORAGE.TEACHERS);

    let teacherOptions =
        '<option value="">Select Teacher</option>';

    teachers.forEach(teacher => {

        teacherOptions += `

<option value="${teacher.teacherId}">

${teacher.teacherName}

</option>`;

    });

    document.getElementById("timetableWorkspace").innerHTML = `

<div class="card">

<h2>🗓 New Timetable Schedule</h2>

<table class="table">

<tr>

<td width="220">Class</td>

<td>

<select id="className">

${Utils.classOptions()}

</select>

</td>

</tr>

<tr>

<td>Section</td>

<td>

<select id="section">

<option>A</option>
<option>B</option>
<option>C</option>
<option>D</option>

</select>

</td>

</tr>

<tr>

<td>Day</td>

<td>

<select id="day">

<option>Monday</option>
<option>Tuesday</option>
<option>Wednesday</option>
<option>Thursday</option>
<option>Friday</option>
<option>Saturday</option>

</select>

</td>

</tr>

<tr>

<td>Period</td>

<td>

<select id="period">

<option>1</option>
<option>2</option>
<option>3</option>

</select>

</td>

</tr>

<tr>

<td>Subject</td>

<td>

<input
type="text"
id="subject"
placeholder="Subject Name">

</td>

</tr>

<tr>

<td>Teacher</td>

<td>

<select id="teacherId">

${teacherOptions}

</select>

</td>

</tr>

<tr>

<td>Room No.</td>

<td>

<input
type="text"
id="roomNo"
placeholder="Room Number">

</td>

</tr>

<tr>

<td>Start Time</td>

<td>

<input
type="time"
id="startTime">

</td>

</tr>

<tr>

<td>End Time</td>

<td>

<input
type="time"
id="endTime">

</td>

</tr>

</table>

<br>

<button
class="btn"
onclick="saveSchedule()">

💾 Save Schedule

</button>

<button
class="btn"
onclick="showClassTimetable()">

📋 View Timetable

</button>

<button
class="btn"
onclick="Timetable.render()">

⬅ Back

</button>

</div>

`;

}

/* ===== assets/js/timetable/saveSchedule.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/timetable/saveSchedule.js
==================================================*/

/*==========================================
 Save Timetable Schedule
==========================================*/

function saveSchedule() {

    const className =
        document.getElementById("className").value;

    const section =
        document.getElementById("section").value;

    const day =
        document.getElementById("day").value;

    const period =
        document.getElementById("period").value;

    const subject =
        document.getElementById("subject").value.trim();

    const teacherId =
        document.getElementById("teacherId").value;

    const roomNo =
        document.getElementById("roomNo").value.trim();

    const startTime =
        document.getElementById("startTime").value;

    const endTime =
        document.getElementById("endTime").value;

    if (!className) {

        Utils.message("Please select class.");

        return;

    }

    if (!subject) {

        Utils.message("Please enter subject.");

        return;

    }

    if (!teacherId) {

        Utils.message("Please select teacher.");

        return;

    }

    const teachers =
        Database.getAll(CONFIG.STORAGE.TEACHERS);

    const teacher =
        teachers.find(t => t.teacherId === teacherId);

    const schedules =
        Database.getAll(CONFIG.STORAGE.TIMETABLE);

    /*------------------------------------------
      Duplicate Class Period Check
    ------------------------------------------*/

    const classConflict = schedules.find(item =>

        item.className === className &&
        item.section === section &&
        item.day === day &&
        item.period === period

    );

    if (classConflict) {

        Utils.message(
            "Schedule already exists for this class and period."
        );

        return;

    }

    /*------------------------------------------
      Teacher Conflict Check
    ------------------------------------------*/

    const teacherConflict = schedules.find(item =>

        item.teacherId === teacherId &&
        item.day === day &&
        item.period === period

    );

    if (teacherConflict) {

        Utils.message(
            "Teacher is already assigned during this period."
        );

        return;

    }

    const schedule = {

        scheduleId:
            "TT-" + Date.now(),

        className,

        section,

        day,

        period,

        subject,

        teacherId,

        teacherName:
            teacher ? teacher.teacherName : "",

        roomNo,

        startTime,

        endTime,

        createdOn:
            Utils.currentDateTime()

    };

    Database.insert(

        CONFIG.STORAGE.TIMETABLE,

        schedule

    );

    Utils.message(
        "Timetable saved successfully."
    );

    showClassTimetable();

}

/* ===== assets/js/timetable/teacherTimetable.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/timetable/teacherTimetable.js
==================================================*/

/*==========================================
 Teacher Timetable
==========================================*/

function showTeacherTimetable() {

    const teachers =
        Database.getAll(CONFIG.STORAGE.TEACHERS);

    let teacherOptions =
        '<option value="">Select Teacher</option>';

    teachers.forEach(teacher => {

        teacherOptions += `

<option value="${teacher.teacherId}">

${teacher.teacherName}

</option>`;

    });

    document.getElementById("timetableWorkspace").innerHTML = `

<div class="card">

<h2>👨‍🏫 Teacher Timetable</h2>

<table class="table">

<tr>

<td width="220">Teacher</td>

<td>

<select
id="teacherSelect"
onchange="loadTeacherTimetable()">

${teacherOptions}

</select>

</td>

</tr>

</table>

<br>

<div id="teacherTimetableResult">

<p>Select a teacher to view timetable.</p>

</div>

<br>

<button
class="btn"
onclick="Timetable.render()">

⬅ Back

</button>

</div>

`;

}

/*==========================================
 Load Teacher Timetable
==========================================*/

function loadTeacherTimetable() {

    const teacherId =
        document.getElementById("teacherSelect").value;

    if (!teacherId) {

        document.getElementById(
            "teacherTimetableResult"
        ).innerHTML =
            "<p>Select a teacher.</p>";

        return;

    }

    const schedules = Database.filter(

        CONFIG.STORAGE.TIMETABLE,

        item => item.teacherId === teacherId

    );

    let html = `

<table class="table">

<tr>

<th>Day</th>

<th>Period</th>

<th>Class</th>

<th>Section</th>

<th>Subject</th>

<th>Time</th>

<th>Room</th>

</tr>

`;

    if (schedules.length === 0) {

        html += `

<tr>

<td colspan="7">

No timetable available.

</td>

</tr>

`;

    }

    schedules.sort((a, b) => {

        if (a.day === b.day) {

            return Number(a.period) -
                   Number(b.period);

        }

        return a.day.localeCompare(b.day);

    });

    schedules.forEach(item => {

        html += `

<tr>

<td>${item.day}</td>

<td>${item.period}</td>

<td>${item.className}</td>

<td>${item.section}</td>

<td>${item.subject}</td>

<td>${item.startTime} - ${item.endTime}</td>

<td>${item.roomNo}</td>

</tr>

`;

    });

    html += `

</table>

`;

    document.getElementById(
        "teacherTimetableResult"
    ).innerHTML = html;

}

/* ===== assets/js/timetable/classTimetable.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/timetable/classTimetable.js
==================================================*/

/*==========================================
 Class Timetable
==========================================*/

function showClassTimetable() {

    document.getElementById("timetableWorkspace").innerHTML = `

<div class="card">

<h2>🏫 Class Timetable</h2>

<table class="table">

<tr>

<td width="220">Class</td>

<td>

<select
id="classFilter"
onchange="loadClassTimetable()">

<option value="">Select Class</option>

${Utils.classOptions()}

</select>

</td>

</tr>

<tr>

<td>Section</td>

<td>

<select
id="sectionFilter"
onchange="loadClassTimetable()">

<option>A</option>
<option>B</option>
<option>C</option>
<option>D</option>

</select>

</td>

</tr>

</table>

<br>

<div id="classTimetableResult">

<p>Select class and section.</p>

</div>

<br>

<button
class="btn"
onclick="newSchedule()">

➕ New Schedule

</button>

<button
class="btn"
onclick="Timetable.render()">

⬅ Back

</button>

</div>

`;

}

/*==========================================
 Load Class Timetable
==========================================*/

function loadClassTimetable() {

    const className =
        document.getElementById("classFilter").value;

    const section =
        document.getElementById("sectionFilter").value;

    if (!className) {

        document.getElementById(
            "classTimetableResult"
        ).innerHTML =
            "<p>Select a class.</p>";

        return;

    }

    const schedules = Database.filter(

        CONFIG.STORAGE.TIMETABLE,

        item =>

            item.className === className &&
            item.section === section

    );

    schedules.sort((a, b) => {

        if (a.day === b.day) {

            return Number(a.period) -
                   Number(b.period);

        }

        return a.day.localeCompare(b.day);

    });

    let html = `

<table class="table">

<tr>

<th>Day</th>

<th>Period</th>

<th>Subject</th>

<th>Teacher</th>

<th>Time</th>

<th>Room</th>

</tr>

`;

    if (schedules.length === 0) {

        html += `

<tr>

<td colspan="6">

No timetable found.

</td>

</tr>

`;

    }

    schedules.forEach(item => {

        html += `

<tr>

<td>${item.day}</td>

<td>${item.period}</td>

<td>${item.subject}</td>

<td>${item.teacherName}</td>

<td>${item.startTime} - ${item.endTime}</td>

<td>${item.roomNo}</td>

</tr>

`;

    });

    html += `

</table>

`;

    document.getElementById(
        "classTimetableResult"
    ).innerHTML = html;

}

/* ===== assets/js/timetable/subjectAllocation.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/timetable/subjectAllocation.js
==================================================*/

/*==========================================
 Subject Allocation
==========================================*/

function subjectAllocation() {

    const teachers =
        Database.getAll(CONFIG.STORAGE.TEACHERS);

    const schedules =
        Database.getAll(CONFIG.STORAGE.TIMETABLE);

    let html = `

<div class="card">

<h2>📚 Subject Allocation</h2>

<table class="table">

<tr>

<th>#</th>

<th>Teacher</th>

<th>Subject</th>

<th>Class</th>

<th>Section</th>

<th>Periods / Week</th>

</tr>

`;

    if (schedules.length === 0) {

        html += `

<tr>

<td colspan="6">

No subject allocation available.

</td>

</tr>

`;

    } else {

        const allocation = {};

        schedules.forEach(item => {

            const key =
                item.teacherId +
                "|" +
                item.subject +
                "|" +
                item.className +
                "|" +
                item.section;

            if (!allocation[key]) {

                allocation[key] = {

                    teacherName: item.teacherName,

                    subject: item.subject,

                    className: item.className,

                    section: item.section,

                    periods: 0

                };

            }

            allocation[key].periods++;

        });

        Object.values(allocation).forEach((item, index) => {

            html += `

<tr>

<td>${index + 1}</td>

<td>${item.teacherName}</td>

<td>${item.subject}</td>

<td>${item.className}</td>

<td>${item.section}</td>

<td>${item.periods}</td>

</tr>

`;

        });

    }

    html += `

</table>

<br>

<button
class="btn"
onclick="newSchedule()">

➕ New Allocation

</button>

<button
class="btn"
onclick="Timetable.render()">

⬅ Back

</button>

</div>

`;

    document.getElementById("timetableWorkspace").innerHTML = html;

}

/* ===== assets/js/timetable/reports.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/timetable/reports.js
==================================================*/

/*==========================================
 Timetable Reports
==========================================*/

function timetableReports() {

    const schedules =
        Database.getAll(CONFIG.STORAGE.TIMETABLE);

    const teachers =
        Database.getAll(CONFIG.STORAGE.TEACHERS);

    const classes = new Set();
    const subjects = new Set();

    schedules.forEach(item => {

        classes.add(item.className);

        subjects.add(item.subject);

    });

    let html = `

<div class="card">

<h2>📊 Timetable Reports</h2>

<table class="table">

<tr>

<td width="280"><b>Total Schedule Entries</b></td>

<td>${schedules.length}</td>

</tr>

<tr>

<td><b>Total Teachers</b></td>

<td>${teachers.length}</td>

</tr>

<tr>

<td><b>Total Classes</b></td>

<td>${classes.size}</td>

</tr>

<tr>

<td><b>Total Subjects</b></td>

<td>${subjects.size}</td>

</tr>

<tr>

<td><b>Academic Session</b></td>

<td>${CONFIG.SESSION}</td>

</tr>

<tr>

<td><b>Generated On</b></td>

<td>${Utils.currentDateTime()}</td>

</tr>

</table>

<br>

<h3>📚 Periods Per Teacher</h3>

<table class="table">

<tr>

<th>#</th>

<th>Teacher</th>

<th>Subject</th>

<th>Total Periods</th>

</tr>

`;

    const teacherSummary = {};

    schedules.forEach(item => {

        const key =
            item.teacherName + "|" + item.subject;

        if (!teacherSummary[key]) {

            teacherSummary[key] = {

                teacherName: item.teacherName,

                subject: item.subject,

                periods: 0

            };

        }

        teacherSummary[key].periods++;

    });

    const list = Object.values(teacherSummary);

    if (list.length === 0) {

        html += `

<tr>

<td colspan="4">

No timetable records found.

</td>

</tr>

`;

    } else {

        list.forEach((item, index) => {

            html += `

<tr>

<td>${index + 1}</td>

<td>${item.teacherName}</td>

<td>${item.subject}</td>

<td>${item.periods}</td>

</tr>

`;

        });

    }

    html += `

</table>

<br>

<button
class="btn"
onclick="printTimetable()">

🖨 Print Report

</button>

<button
class="btn"
onclick="Timetable.render()">

⬅ Back

</button>

</div>

`;

    document.getElementById(
        "timetableWorkspace"
    ).innerHTML = html;

}

/* ===== assets/js/timetable/print.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/timetable/print.js
==================================================*/

/*==========================================
 Print Timetable
==========================================*/

function printTimetable() {

    const schedules =
        Database.getAll(CONFIG.STORAGE.TIMETABLE);

    let html = `

<html>

<head>

<title>School Timetable</title>

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

text-align:center;

font-size:13px;

}

th{

background:#f2f2f2;

}

.footer{

margin-top:30px;

text-align:right;

font-size:12px;

}

</style>

</head>

<body>

<h2>${CONFIG.SCHOOL_NAME}</h2>

<h3>School Timetable</h3>

<p style="text-align:center;">

Academic Session :
${CONFIG.SESSION}

</p>

<table>

<tr>

<th>#</th>

<th>Day</th>

<th>Period</th>

<th>Class</th>

<th>Section</th>

<th>Subject</th>

<th>Teacher</th>

<th>Room</th>

<th>Time</th>

</tr>

`;

    if (schedules.length === 0) {

        html += `

<tr>

<td colspan="9">

No timetable available.

</td>

</tr>

`;

    } else {

        schedules.sort((a, b) => {

            if (a.day === b.day) {

                return Number(a.period) -
                       Number(b.period);

            }

            return a.day.localeCompare(b.day);

        });

        schedules.forEach((item, index) => {

            html += `

<tr>

<td>${index + 1}</td>

<td>${item.day}</td>

<td>${item.period}</td>

<td>${item.className}</td>

<td>${item.section}</td>

<td>${item.subject}</td>

<td>${item.teacherName}</td>

<td>${item.roomNo}</td>

<td>${item.startTime} - ${item.endTime}</td>

</tr>

`;

        });

    }

    html += `

</table>

<div class="footer">

Generated on :
${Utils.currentDateTime()}

</div>

</body>

</html>

`;

    const printWindow =
        window.open("", "_blank");

    printWindow.document.write(html);

    printWindow.document.close();

    printWindow.focus();

    printWindow.print();

}