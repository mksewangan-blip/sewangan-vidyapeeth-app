
/* ===== assets/js/attendance/attendance.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/attendance/attendance.js
 Version : 3.0.1
==================================================*/

const Attendance = {

    render() {

        const main =
            document.getElementById("mainContent");

        if (!main) return;

        main.innerHTML = `

<div class="page">

    <div class="page-header">
        <h2>📝 Attendance Management</h2>
        <p>Manage student and teacher attendance.</p>
    </div>

    <div class="card">

        <div class="grid">

            <button class="btn"
                onclick="studentAttendancePage()">
                👨‍🎓 Student Attendance
            </button>

            <button class="btn"
                onclick="teacherAttendancePage()">
                👨‍🏫 Teacher Attendance
            </button>

            <button class="btn"
                onclick="Holiday.render()">
                📅 Holidays
            </button>

            <button class="btn"
                onclick="workingDaysPage()">
                📆 Working Days
            </button>

            <button class="btn"
                onclick="attendanceSummaryPage()">
                📊 Attendance Summary
            </button>

            <button class="btn"
    onclick="FaceAttendanceReports.render()">
    📈 Attendance Reports
</button>

        </div>

    </div>

    <br>

    <div id="attendanceWorkspace"></div>

</div>

`;

    },

    refresh() {

        this.render();

    }

};

/* ===== assets/js/attendance/student.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/attendance/student.js
==================================================*/

/*==========================================
 Student Attendance
==========================================*/

function studentAttendancePage() {

    const students =
        Database.getAll(CONFIG.STORAGE.STUDENTS);

    let html = `

<div class="card">

<h2>👨‍🎓 Student Attendance</h2>

<p>

Date :

<input
type="date"
id="attendanceDate"
value="${Utils.currentDate()}">

</p>

<button
class="btn present"
onclick="markAllAttendance('Present')">

✅ Mark All Present

</button>

<button
class="btn absent"
onclick="markAllAttendance('Absent')">

❌ Mark All Absent

</button>

<button
class="btn leave"
onclick="markAllAttendance('Leave')">

🟡 Mark All Leave

</button>

<button
class="btn halfday"
onclick="markAllAttendance('Half Day')">

🟠 Mark All Half Day

</button>

<br><br>

<div class="card" id="attendanceSummary">

<b>Total :</b> <span id="totalCount">0</span>

&nbsp;&nbsp;

🟢 <span id="presentCount">0</span>

&nbsp;&nbsp;

🔴 <span id="absentCount">0</span>

&nbsp;&nbsp;

🟡 <span id="leaveCount">0</span>

&nbsp;&nbsp;

🟠 <span id="halfDayCount">0</span>

</div>

<br>

<table class="table">

<thead>

<tr>

<th>#</th>

<th>Student ID</th>

<th>Name</th>

<th>Class</th>

<th>Status</th>

</tr>

</thead>

<tbody>

`;

    if (students.length === 0) {

        html += `

<tr>

<td colspan="5">

No students found.

</td>

</tr>

`;

    }

    students.forEach((student, index) => {

        html += `

<tr>

<td>${index + 1}</td>

<td>${student.studentId}</td>

<td>${NameHelper.display(
    student.studentName,
    students,
    "studentName"
)}</td>

<td>${student.studentClass}</td>

<td>

<input type="hidden" id="attendance_${index}" value="Present">

<button
class="attendance-btn present selected"
onclick="setAttendance(${index},this,'Present')">
Present
</button>

<button
class="attendance-btn absent"
onclick="setAttendance(${index},this,'Absent')">
Absent
</button>

<button
class="attendance-btn leave"
onclick="setAttendance(${index},this,'Leave')">
Leave
</button>

<button
class="attendance-btn halfday"
onclick="setAttendance(${index},this,'Half Day')">
Half Day
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
onclick="saveStudentAttendance()">

💾 Save Attendance

</button>

<button
class="btn"
onclick="Attendance.render()">

⬅ Back

</button>

</div>

`;
document.getElementById("attendanceWorkspace").innerHTML = html;

updateAttendanceSummary();

}

function setAttendance(index, btn, status){

    document.getElementById("attendance_"+index).value = status;

    btn.parentElement
        .querySelectorAll(".attendance-btn")
        .forEach(b=>b.classList.remove("selected"));

    btn.classList.add("selected");

updateAttendanceSummary();

}

/*==========================================
 Save Student Attendance
==========================================*/

function saveStudentAttendance() {

    const date =
        document.getElementById(
            "attendanceDate"
        ).value;

if (Holiday.isHoliday(date)) {

    Utils.message(
        "Attendance cannot be marked on Sunday or Holiday."
    );

    return;

}

    const students =
        Database.getAll(CONFIG.STORAGE.STUDENTS);

    let attendance =
        Database.getAll(CONFIG.STORAGE.ATTENDANCE);

    students.forEach((student, index) => {

        const status =
            document.getElementById(
                "attendance_" + index
            ).value;

        /* Duplicate Check */

        const existing = attendance.find(record =>

            record.type === "Student" &&

            record.studentId === student.studentId &&

            record.date === date

        );

        if (existing) {

            existing.status = status;

            existing.updatedOn =
                Utils.currentDateTime();

        } else {

            attendance.push({

                attendanceId:
                    Utils.uuid(),

                type: "Student",

                date: date,

                studentId:
                    student.studentId,

                studentName:
                    student.studentName,

                studentClass:
                    student.studentClass,

                status: status,

                createdOn:
                    Utils.currentDateTime()

            });

        }

    });

    StorageManager.save(

        CONFIG.STORAGE.ATTENDANCE,

        attendance

    );

    Utils.message(

        "Student attendance saved successfully."

    );

    Attendance.render();

}

function markAllAttendance(status){

    const students = Database.getAll(CONFIG.STORAGE.STUDENTS);

    students.forEach((student,index)=>{

        document.getElementById("attendance_"+index).value = status;

        const cell = document.getElementById("attendance_"+index).parentElement;

        cell.querySelectorAll(".attendance-btn")
            .forEach(btn=>{

                btn.classList.remove("selected");

                if(btn.innerText.trim() === status){
                    btn.classList.add("selected");
                }

            });

    });

    updateAttendanceSummary();

}

function updateAttendanceSummary(){

    const total =
        Database.getAll(CONFIG.STORAGE.STUDENTS).length;

    let present = 0;
    let absent = 0;
    let leave = 0;
    let halfDay = 0;

    for(let i=0;i<total;i++){

        const input = document.getElementById("attendance_"+i);

if(!input) continue;

const value = input.value;

        if(value==="Present") present++;
        else if(value==="Absent") absent++;
        else if(value==="Leave") leave++;
        else if(value==="Half Day") halfDay++;

    }

    document.getElementById("totalCount").innerText = total;
    document.getElementById("presentCount").innerText = present;
    document.getElementById("absentCount").innerText = absent;
    document.getElementById("leaveCount").innerText = leave;
    document.getElementById("halfDayCount").innerText = halfDay;

}

const StudentAttendance = {

    render() {
        studentAttendancePage();
    }

};

/* ===== assets/js/attendance/teacher.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/attendance/teacher.js
==================================================*/

/*==========================================
 Teacher Attendance
==========================================*/

function teacherAttendancePage() {

    const teachers =
        Database.getAll(CONFIG.STORAGE.TEACHERS);

    let html = `

<div class="card">

<h2>👨‍🏫 Teacher Attendance</h2>

<p>

Date :

<input
type="date"
id="teacherAttendanceDate"
value="${Utils.currentDate()}">

</p>

<button
class="btn present"
onclick="markAllTeacherAttendance('Present')">

✅ Mark All Present

</button>

<button
class="btn absent"
onclick="markAllTeacherAttendance('Absent')">

❌ Mark All Absent

</button>

<button
class="btn leave"
onclick="markAllTeacherAttendance('Leave')">

🟡 Mark All Leave

</button>

<button
class="btn halfday"
onclick="markAllTeacherAttendance('Half Day')">

🟠 Mark All Half Day

</button>

<br><br>

<div class="card" id="teacherAttendanceSummary">

<b>Total :</b> <span id="teacherTotalCount">0</span>

&nbsp;&nbsp;

🟢 <span id="teacherPresentCount">0</span>

&nbsp;&nbsp;

🔴 <span id="teacherAbsentCount">0</span>

&nbsp;&nbsp;

🟡 <span id="teacherLeaveCount">0</span>

&nbsp;&nbsp;

🟠 <span id="teacherHalfDayCount">0</span>

</div>

<br>

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

    if (teachers.length === 0) {

        html += `

<tr>

<td colspan="5">

No teachers found.

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

<td>

<input type="hidden" id="teacherAttendance_${index}" value="Present">

<button class="attendance-btn present selected"
onclick="setTeacherAttendance(${index},this,'Present')">
Present
</button>

<button class="attendance-btn absent"
onclick="setTeacherAttendance(${index},this,'Absent')">
Absent
</button>

<button class="attendance-btn leave"
onclick="setTeacherAttendance(${index},this,'Leave')">
Leave
</button>

<button class="attendance-btn halfday"
onclick="setTeacherAttendance(${index},this,'Half Day')">
Half Day
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
onclick="saveTeacherAttendance()">

💾 Save Attendance

</button>

<button
class="btn"
onclick="Attendance.render()">

⬅ Back

</button>

</div>

`;

    document.getElementById("attendanceWorkspace").innerHTML = html;

updateTeacherAttendanceSummary();

}

function setTeacherAttendance(index, btn, status){

    document.getElementById("teacherAttendance_"+index).value = status;

    btn.parentElement
        .querySelectorAll(".attendance-btn")
        .forEach(b => b.classList.remove("selected"));

    btn.classList.add("selected");

updateTeacherAttendanceSummary();

}

/*==========================================
 Save Teacher Attendance
==========================================*/

function saveTeacherAttendance() {

    const date =
        document.getElementById("teacherAttendanceDate").value;

if (Holiday.isHoliday(date)) {

    Utils.message(
        "Attendance cannot be marked on Sunday or Holiday."
    );

    return;

}

    const teachers =
        Database.getAll(CONFIG.STORAGE.TEACHERS);

    let attendance =
        Database.getAll(CONFIG.STORAGE.ATTENDANCE);

    teachers.forEach((teacher, index) => {

        const status =
            document.getElementById(
                "teacherAttendance_" + index
            ).value;

        /* Duplicate Check */

        const existing = attendance.find(record =>

            record.type === "Teacher" &&

            record.teacherId === teacher.teacherId &&

            record.date === date

        );

        if (existing) {

            existing.status = status;

            existing.updatedOn =
                Utils.currentDateTime();

        } else {

            attendance.push({

                attendanceId:
                    Utils.uuid(),

                type: "Teacher",

                date: date,

                teacherId:
                    teacher.teacherId,

                teacherName:
                    teacher.teacherName,

                designation:
                    teacher.designation,

                status: status,

                createdOn:
                    Utils.currentDateTime(),

                updatedOn:
                    Utils.currentDateTime()

            });

        }

    });

    StorageManager.save(

        CONFIG.STORAGE.ATTENDANCE,

        attendance

    );

    Utils.message("Teacher attendance saved successfully.");

    Attendance.render();

}

function markAllTeacherAttendance(status){

    const teachers = Database.getAll(CONFIG.STORAGE.TEACHERS);

    teachers.forEach((teacher,index)=>{

        document.getElementById("teacherAttendance_"+index).value = status;

        const cell = document.getElementById("teacherAttendance_"+index).parentElement;

        cell.querySelectorAll(".attendance-btn")
            .forEach(btn=>{

                btn.classList.remove("selected");

                if(btn.innerText.trim() === status){
                    btn.classList.add("selected");
                }

            });

    });

    updateTeacherAttendanceSummary();

}

function updateTeacherAttendanceSummary() {

    const total =
        Database.getAll(CONFIG.STORAGE.TEACHERS).length;

    let present = 0;
    let absent = 0;
    let leave = 0;
    let halfDay = 0;

    for (let i = 0; i < total; i++) {

        const input = document.getElementById("teacherAttendance_" + i);

if(!input) continue;

const value = input.value;

        if (value === "Present") present++;
        else if (value === "Absent") absent++;
        else if (value === "Leave") leave++;
        else if (value === "Half Day") halfDay++;

    }

    document.getElementById("teacherTotalCount").innerText = total;
    document.getElementById("teacherPresentCount").innerText = present;
    document.getElementById("teacherAbsentCount").innerText = absent;
    document.getElementById("teacherLeaveCount").innerText = leave;
    document.getElementById("teacherHalfDayCount").innerText = halfDay;

}

/*==========================================
 Compatibility Object
==========================================*/

const TeacherAttendance = {

    render() {
        teacherAttendancePage();
    }

};

/* ===== assets/js/attendance/holiday.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/attendance/holiday.js
==================================================*/

const Holiday = {

    render() {

        const holidays = Database.getAll(
            CONFIG.STORAGE.HOLIDAYS || "holidays"
        );

        let html = `

<div class="card">

<h2>📅 Holiday Management</h2>

<p>

<input
type="date"
id="holidayDate">

<input
type="text"
id="holidayName"
placeholder="Holiday Name">

<button
class="btn"
onclick="Holiday.add()">

➕ Add Holiday

</button>

</p>

<table class="table">

<tr>

<th>Date</th>

<th>Holiday</th>

<th>Action</th>

</tr>

`;

        if (holidays.length === 0) {

            html += `

<tr>

<td colspan="3">

No holidays added.

</td>

</tr>

`;

        }

        holidays.forEach((holiday, index) => {

            html += `

<tr>

<td>${holiday.date}</td>

<td>${holiday.name}</td>

<td>

<button
class="btn btn-danger"
onclick="Holiday.remove(${index})">

Delete

</button>

</td>

</tr>

`;

        });

        html += `

</table>

<br>

<button
class="btn"
onclick="Attendance.render()">

⬅ Back

</button>

</div>

`;

        document.getElementById(
            "attendanceWorkspace"
        ).innerHTML = html;

    },

    add() {

        const date =
            document.getElementById("holidayDate").value;

        const name =
            document.getElementById("holidayName").value.trim();

        if (!date || !name) {

            Utils.message(
                "Enter holiday date and name."
            );

            return;

        }

        let holidays = Database.getAll(
            CONFIG.STORAGE.HOLIDAYS || "holidays"
        );

        if (holidays.some(h => h.date === date)) {

            Utils.message(
                "Holiday already exists for this date."
            );

            return;

        }

        holidays.push({

            date: date,
            name: name

        });

        StorageManager.save(
            CONFIG.STORAGE.HOLIDAYS || "holidays",
            holidays
        );

        Utils.message(
            "Holiday added successfully."
        );

        Holiday.render();

    },

    remove(index) {

        let holidays = Database.getAll(
            CONFIG.STORAGE.HOLIDAYS || "holidays"
        );

        holidays.splice(index, 1);

        StorageManager.save(
            CONFIG.STORAGE.HOLIDAYS || "holidays",
            holidays
        );

        Utils.message(
            "Holiday deleted successfully."
        );

        Holiday.render();

    },

    isHoliday(date) {

        // Sunday
        if (new Date(date).getDay() === 0) {

            return true;

        }

        const holidays = Database.getAll(
            CONFIG.STORAGE.HOLIDAYS || "holidays"
        );

        return holidays.some(
            holiday => holiday.date === date
        );

    }

};

/* ===== assets/js/attendance/workingDays.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/attendance/workingDays.js
==================================================*/

const WorkingDays = {

    /*==========================================
      Total Working Days
    ==========================================*/

    total(year, month) {

        let workingDays = 0;

        const daysInMonth =
            new Date(year, month, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {

            const date =
                year + "-" +
                String(month).padStart(2, "0") + "-" +
                String(day).padStart(2, "0");

            if (!Holiday.isHoliday(date)) {

                workingDays++;

            }

        }

        return workingDays;

    },

    /*==========================================
      Check Working Day
    ==========================================*/

    isWorkingDay(date) {

        return !Holiday.isHoliday(date);

    }

};

function workingDaysPage() {

    const today = new Date();

    const year = today.getFullYear();

    const month = today.getMonth() + 1;

    document.getElementById("attendanceWorkspace").innerHTML = `

<div class="card">

<h2>📆 Working Days</h2>

<h3>${year}-${String(month).padStart(2,"0")}</h3>

<p>

Total Working Days :
<b>${WorkingDays.total(year,month)}</b>

</p>

</div>

`;

}

/* ===== assets/js/attendance/summary.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/attendance/summary.js
==================================================*/

const AttendanceSummary = {

    student(studentId, year, month) {

        const attendance =
            Database.getAll(CONFIG.STORAGE.ATTENDANCE);

        const records = attendance.filter(a =>

            a.type === "Student" &&
            a.studentId === studentId &&
            a.date.startsWith(
                year + "-" +
                String(month).padStart(2, "0")
            )

        );

        let present = 0;
        let absent = 0;
        let leave = 0;
        let halfDay = 0;

        records.forEach(r => {

            if (r.status === "Present") present++;
            else if (r.status === "Absent") absent++;
            else if (r.status === "Leave") leave++;
            else if (r.status === "Half Day") halfDay++;

        });

        const workingDays =
            WorkingDays.total(year, month);

        const effectivePresent =
            present + (halfDay * 0.5);

        const percentage =
            workingDays === 0
            ? "0.00"
            : ((effectivePresent / workingDays) * 100).toFixed(2);

        return {

            workingDays,
            present,
            absent,
            leave,
            halfDay,
            percentage

        };

    },

    teacher(teacherId, year, month) {

        const attendance =
            Database.getAll(CONFIG.STORAGE.ATTENDANCE);

        const records = attendance.filter(a =>

            a.type === "Teacher" &&
            a.teacherId === teacherId &&
            a.date.startsWith(
                year + "-" +
                String(month).padStart(2, "0")
            )

        );

        let present = 0;
        let absent = 0;
        let leave = 0;
        let halfDay = 0;

        records.forEach(r => {

            if (r.status === "Present") present++;
            else if (r.status === "Absent") absent++;
            else if (r.status === "Leave") leave++;
            else if (r.status === "Half Day") halfDay++;

        });

        const workingDays =
            WorkingDays.total(year, month);

        const effectivePresent =
            present + (halfDay * 0.5);

        const percentage =
            workingDays === 0
            ? "0.00"
            : ((effectivePresent / workingDays) * 100).toFixed(2);

        return {

            workingDays,
            present,
            absent,
            leave,
            halfDay,
            percentage

        };

    }

};

function attendanceSummaryPage() {

    document.getElementById("attendanceWorkspace").innerHTML = `

<div class="card">

<h2>📊 Attendance Summary</h2>

<p>

Select a student or teacher from the register to view detailed attendance summary.

</p>

</div>

`;

}

/* ===== assets/js/attendance/faceRegistration.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/attendance/faceRegistration.js
 Version : 3.0.0
==================================================*/

const FaceRegistration={

samples:[],
currentType:"",
currentId:"",
stream:null,

async student(studentId){

this.currentType="Student";
this.currentId=studentId;
this.samples=[];

await this.render();

},

async teacher(teacherId){

this.currentType="Teacher";
this.currentId=teacherId;
this.samples=[];

await this.render();

},

async render(){

await FaceModels.load();

const cameras=
await CameraManager.getCameras();

let options="";

cameras.forEach((camera,index)=>{

options+=`

<option value="${camera.deviceId}">

${camera.label||"Camera "+(index+1)}

</option>

`;

});

document.getElementById("mainContent").innerHTML=`

<div class="card">

<h2>

📷 Face Registration

</h2>

<table class="table">

<tr>

<td width="180">

Type

</td>

<td>

${this.currentType}

</td>

</tr>

<tr>

<td>

Samples

</td>

<td>

<span id="sampleCount">

0

</span>

/5

</td>

</tr>

<tr>

<td>

Camera

</td>

<td>

<select
id="registerCamera">

${options}

</select>

</td>

</tr>

</table>

<br>

<button
class="btn"
onclick="FaceRegistration.startCamera()">

🎥 Start Camera

</button>

<button
class="btn"
onclick="FaceRegistration.captureSample()">

📸 Capture Sample

</button>

<button
class="btn"
onclick="FaceRegistration.saveFace()">

💾 Save Face

</button>

<button
class="btn"
onclick="Attendance.render()">

⬅ Back

</button>

<br><br>

<div
style="position:relative;width:640px;">

<video

id="registerVideo"

autoplay

playsinline

muted

style="width:640px;border:2px solid #ccc;border-radius:10px;">

</video>

<canvas

id="registerCanvas"

style="position:absolute;left:0;top:0;">

</canvas>

</div>

`;

},

async startCamera(){

    const cameraId =
        document.getElementById(
            "registerCamera"
        ).value;

    this.stream =
        await CameraManager.start(cameraId);

    const video =
        document.getElementById(
            "registerVideo"
        );

    video.srcObject = this.stream;

    video.onloadedmetadata = ()=>{

        video.play();

        const canvas =
            document.getElementById(
                "registerCanvas"
            );

        canvas.width =
            video.videoWidth;

        canvas.height =
            video.videoHeight;

        this.livePreview();

    };

},

stopCamera(){

    CameraManager.stop();

},

async livePreview(){

    const video =
        document.getElementById(
            "registerVideo"
        );

    const canvas =
        document.getElementById(
            "registerCanvas"
        );

    const ctx =
        canvas.getContext("2d");

    while(video.srcObject){

        const detections =
            await faceapi
            .detectAllFaces(
                video,
                new faceapi.TinyFaceDetectorOptions()
            )
            .withFaceLandmarks();

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        if(detections.length===1){

            const box =
                detections[0].detection.box;

            ctx.strokeStyle="#00cc00";
            ctx.lineWidth=3;

            ctx.strokeRect(
                box.x,
                box.y,
                box.width,
                box.height
            );

            ctx.fillStyle="#00cc00";
            ctx.font="18px Arial";

            ctx.fillText(
                "Face Ready",
                box.x,
                box.y-10
            );

        }else if(detections.length>1){

            detections.forEach(face=>{

                const box =
                    face.detection.box;

                ctx.strokeStyle="red";
                ctx.lineWidth=3;

                ctx.strokeRect(
                    box.x,
                    box.y,
                    box.width,
                    box.height
                );

            });

            ctx.fillStyle="red";
            ctx.font="18px Arial";

            ctx.fillText(
                "Only One Face Allowed",
                20,
                30
            );

        }

        await new Promise(resolve=>
            setTimeout(resolve,120)
        );

    }

},

async captureSample(){

    if(this.samples.length>=5){

        Utils.message(
            "Maximum 5 samples already captured."
        );

        return;

    }

    const video =
        document.getElementById(
            "registerVideo"
        );

    const detection =
        await faceapi
        .detectSingleFace(
            video,
            new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks(true)
        .withFaceDescriptor();

    if(!detection){

        Utils.message(
            "No face detected."
        );

        return;

    }

    this.samples.push({

        descriptor:
            Array.from(
                detection.descriptor
            ),

        quality:
            detection.detection.score

    });

    document.getElementById(
        "sampleCount"
    ).innerHTML =
        this.samples.length;

    Utils.message(

        "Sample " +

        this.samples.length +

        " captured successfully."

    );

    if(this.samples.length===5){

        Utils.message(

            "All 5 samples captured.\nNow click SAVE FACE."

        );

    }

},

averageDescriptor(){

    if(this.samples.length===0)
        return null;

    const length =
        this.samples[0]
        .descriptor.length;

    const avg =
        new Array(length).fill(0);

    this.samples.forEach(sample=>{

        sample.descriptor.forEach(

            (value,index)=>{

                avg[index]+=value;

            }

        );

    });

    for(let i=0;i<avg.length;i++){

        avg[i]/=this.samples.length;

    }

    return avg;

},

async saveFace(){

    if(this.samples.length<5){

        Utils.message(
            "Capture at least 5 samples."
        );

        return;

    }

    const descriptor =
        this.averageDescriptor();

    const video =
        document.getElementById(
            "registerVideo"
        );

    const canvas =
        document.createElement("canvas");

    canvas.width =
        video.videoWidth;

    canvas.height =
        video.videoHeight;

    canvas.getContext("2d")
        .drawImage(
            video,
            0,
            0
        );

    const photo =
        canvas.toDataURL(
            "image/jpeg"
        );

    if(this.currentType==="Student"){

        let students =
            Database.getAll(
                CONFIG.STORAGE.STUDENTS
            );

        const index =
            students.findIndex(s=>
                s.studentId===
                this.currentId
            );

        if(index===-1){

            Utils.message(
                "Student not found."
            );

            return;

        }

        students[index].faceDescriptor =
            descriptor;

        students[index].faceId =
            photo;

        students[index].faceRegistered =
            true;

        students[index].faceRegisteredOn =
            Utils.currentDate();

        Database.saveAll(
            CONFIG.STORAGE.STUDENTS,
            students
        );

    }else{

        let teachers =
            Database.getAll(
                CONFIG.STORAGE.TEACHERS
            );

        const index =
            teachers.findIndex(t=>
                t.teacherId===
                this.currentId
            );

        if(index===-1){

            Utils.message(
                "Teacher not found."
            );

            return;

        }

        teachers[index].faceDescriptor =
            descriptor;

        teachers[index].faceId =
            photo;

        teachers[index].faceRegistered =
            true;

        teachers[index].faceRegisteredOn =
            Utils.currentDate();

        Database.saveAll(
            CONFIG.STORAGE.TEACHERS,
            teachers
        );

    }

    this.stopCamera();

    Utils.message(
        "✅ Face Registered Successfully"
    );

    if(this.currentType==="Student"){

        Students.render();

    }else{

        Teachers.render();

    }

}

};

window.FaceRegistration =
    FaceRegistration;

/* ===== assets/js/attendance/faceAttendance.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/attendance/faceAttendance.js
 Version : 3.0.0
==================================================*/

const FaceAttendance = {

    stream: null,
    matcher: null,
    detecting: false,
    currentType: "Student",
    confidence: 0.50,

    async student(){

        this.currentType="Student";

        await this.render();

    },

    async teacher(){

        this.currentType="Teacher";

        await this.render();

    },

    async render(){

        await FaceModels.load();

        const cameras =
            await CameraManager.getCameras();

        let cameraOptions="";

        cameras.forEach((camera,index)=>{

            cameraOptions+=`

<option value="${camera.deviceId}">

${camera.label || "Camera "+(index+1)}

</option>

`;

        });

        document.getElementById(
            "attendanceWorkspace"
        ).innerHTML=`

<div class="card">

<h2>

📷 Face Attendance

</h2>

<table class="table">

<tr>

<td width="180">

Attendance Type

</td>

<td>

<b id="faceType">

${this.currentType}

</b>

</td>

</tr>

<tr>

<td>

Camera

</td>

<td>

<select
id="faceCameraSelect"
class="input">

${cameraOptions}

</select>

</td>

</tr>

<tr>

<td>

Recognition

</td>

<td>

<span
id="recognitionStatus">

Waiting...

</span>

</td>

</tr>

<tr>

<td>

Confidence

</td>

<td>

<span
id="recognitionConfidence">

0 %

</span>

</td>

</tr>

</table>

<br>

<button
class="btn"
onclick="FaceAttendance.startCamera()">

🎥 Start Camera

</button>

<button
class="btn"
onclick="FaceAttendance.stopCamera()">

⛔ Stop Camera

</button>

<button
class="btn"
onclick="Attendance.render()">

⬅ Back

</button>

<br><br>

<div
style="position:relative;width:640px;">

<video

id="faceVideo"

autoplay

playsinline

muted

style="width:640px;border-radius:10px;border:2px solid #ccc;">

</video>

<canvas

id="faceCanvas"

style="position:absolute;left:0;top:0;">

</canvas>

</div>

</div>

`;

    },

    async startCamera(){

        const id =
            document.getElementById(
                "faceCameraSelect"
            ).value;

        this.stream =
            await CameraManager.start(id);

        const video =
            document.getElementById(
                "faceVideo"
            );

        video.srcObject=this.stream;

        video.onloadedmetadata=()=>{

            video.play();

            const canvas =
                document.getElementById(
                    "faceCanvas"
                );

            canvas.width=video.videoWidth;

            canvas.height=video.videoHeight;

            this.startRecognition();

        };

    },

    stopCamera(){

        this.detecting=false;

        CameraManager.stop();

    },

async startRecognition(){

        if(this.detecting) return;

        this.detecting = true;

        const video =
            document.getElementById("faceVideo");

        const canvas =
            document.getElementById("faceCanvas");

        const ctx =
            canvas.getContext("2d");

        while(this.detecting){

            const detections =
                await faceapi
                .detectAllFaces(
                    video,
                    new faceapi.TinyFaceDetectorOptions()
                )
                .withFaceLandmarks(true)
                .withFaceDescriptors();

            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            if(detections.length===0){

                document.getElementById(
                    "recognitionStatus"
                ).innerHTML="No Face";

                document.getElementById(
                    "recognitionConfidence"
                ).innerHTML="0 %";

                await this.sleep(200);

                continue;

            }

            if(detections.length>1){

                document.getElementById(
                    "recognitionStatus"
                ).innerHTML="Multiple Faces";

                document.getElementById(
                    "recognitionConfidence"
                ).innerHTML="0 %";

                detections.forEach(d=>{

                    const box=d.detection.box;

                    ctx.strokeStyle="red";
                    ctx.lineWidth=3;

                    ctx.strokeRect(
                        box.x,
                        box.y,
                        box.width,
                        box.height
                    );

                });

                await this.sleep(300);

                continue;

            }

            const detection =
                detections[0];

            const box =
                detection.detection.box;

            ctx.strokeStyle="#00ff00";
            ctx.lineWidth=3;

            ctx.strokeRect(
                box.x,
                box.y,
                box.width,
                box.height
            );

            ctx.font="18px Arial";
            ctx.fillStyle="#00ff00";

            ctx.fillText(
                "Scanning...",
                box.x,
                box.y-8
            );

            await this.matchFace(
                detection.descriptor,
                detection,
                ctx
            );

            await this.sleep(300);

        }

    },

    sleep(ms){

        return new Promise(resolve=>{

            setTimeout(resolve,ms);

        });

    },

async matchFace(descriptor,detection,ctx){

        let person=null;
        let distance=1;

        if(this.currentType==="Student"){

            const students=
                Database.getAll(CONFIG.STORAGE.STUDENTS);

            students.forEach(student=>{

                if(!student.faceDescriptor) return;

                const d=
                    faceapi.euclideanDistance(
                        descriptor,
                        new Float32Array(
                            student.faceDescriptor
                        )
                    );

                if(d<distance){

                    distance=d;
                    person=student;

                }

            });

        }else{

            const teachers=
                Database.getAll(CONFIG.STORAGE.TEACHERS);

            teachers.forEach(teacher=>{

                if(!teacher.faceDescriptor) return;

                const d=
                    faceapi.euclideanDistance(
                        descriptor,
                        new Float32Array(
                            teacher.faceDescriptor
                        )
                    );

                if(d<distance){

                    distance=d;
                    person=teacher;

                }

            });

        }

        const confidence=
            Math.max(
                0,
                Math.min(
                    100,
                    Math.round((1-distance)*100)
                )
            );

        document.getElementById(
            "recognitionConfidence"
        ).innerHTML=
            confidence+" %";

        if(distance>this.confidence){

            document.getElementById(
                "recognitionStatus"
            ).innerHTML=
                "Unknown Face";

            return;

        }

        const box=detection.detection.box;

        ctx.fillStyle="#00aa00";

        ctx.fillText(

            this.currentType==="Student"
                ? person.studentName
                : person.teacherName,

            box.x,

            box.y+box.height+22

        );

        document.getElementById(
            "recognitionStatus"
        ).innerHTML=

            this.currentType==="Student"
            ? person.studentName
            : person.teacherName;

        await this.markAttendance(

            person,

            confidence,

            descriptor

        );

    },

async markAttendance(person,confidence){

        const today=Utils.currentDate();

        let attendance=
            Database.getAll(CONFIG.STORAGE.ATTENDANCE);

        let exists;

        if(this.currentType==="Student"){

            exists=attendance.find(a=>

                a.type==="Student" &&
                a.studentId===person.studentId &&
                a.date===today

            );

        }else{

            exists=attendance.find(a=>

                a.type==="Teacher" &&
                a.teacherId===person.teacherId &&
                a.date===today

            );

        }

        if(exists){

            Utils.message("Attendance already marked.");

            this.stopCamera();

            return;

        }

        const video=
            document.getElementById("faceVideo");

        const canvas=
            document.createElement("canvas");

        canvas.width=video.videoWidth;

        canvas.height=video.videoHeight;

        canvas.getContext("2d").drawImage(

            video,

            0,

            0

        );

        const photo=
            canvas.toDataURL("image/jpeg");

        attendance.push({

            date:today,

            time:new Date().toLocaleTimeString(),

            type:this.currentType,

            studentId:
                person.studentId || "",

            teacherId:
                person.teacherId || "",

            studentName:
                person.studentName || "",

            teacherName:
                person.teacherName || "",

            class:
                person.studentClass || "",

            designation:
                person.designation || "",

            status:"Present",

            mode:"Face AI",

            confidence:confidence,

            photo:photo

        });

        Database.saveAll(

            CONFIG.STORAGE.ATTENDANCE,

            attendance

        );

        Utils.message(

            "✅ Attendance Marked Successfully"

        );

        this.stopCamera();

        Attendance.render();

    }

};

window.FaceAttendance=FaceAttendance;

/* ===== assets/js/attendance/reports.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/attendance/reports.js
 Version : 3.0.0
==================================================*/

const FaceAttendanceReports={

render(){

const attendance=
Database.getAll(
CONFIG.STORAGE.ATTENDANCE
);

let html="";

attendance.forEach((record,index)=>{

html+=`

<tr>

<td>${index+1}</td>

<td>${record.date}</td>

<td>${record.time}</td>

<td>${record.type}</td>

<td>

${record.studentName||record.teacherName}

</td>

<td>

${record.studentId||record.teacherId}

</td>

<td>${record.status}</td>

<td>${record.mode}</td>

<td>

${record.confidence||0} %

</td>

<td>

<button
class="btn"
onclick="FaceAttendanceReports.viewPhoto(${index})">

📷

</button>

</td>

</tr>

`;

});

let workspace =
document.getElementById("attendanceWorkspace");

if (!workspace) {

    Attendance.render();

    workspace =
    document.getElementById("attendanceWorkspace");

}

workspace.innerHTML = `

<div class="card">

<h2>

📊 Face Attendance Report

</h2>

<div style="margin-bottom:15px;">

<input
type="date"
id="fromDate"
class="input">

<input
type="date"
id="toDate"
class="input">

<button
class="btn"
onclick="FaceAttendanceReports.filter()">

🔍 Filter

</button>

<button
class="btn"
onclick="FaceAttendanceReports.print()">

🖨 Print

</button>

<button
class="btn"
onclick="FaceAttendanceReports.exportCSV()">

📥 Export CSV

</button>

<button
class="btn"
onclick="Attendance.render()">

⬅ Back

</button>

</div>

<table class="table">

<thead>

<tr>

<th>#</th>

<th>Date</th>

<th>Time</th>

<th>Type</th>

<th>Name</th>

<th>ID</th>

<th>Status</th>

<th>Mode</th>

<th>Confidence</th>

<th>Photo</th>

</tr>

</thead>

<tbody>

${html}

</tbody>

</table>

</div>

`;

},

viewPhoto(index){

const attendance=
Database.getAll(
CONFIG.STORAGE.ATTENDANCE
);

const record=
attendance[index];

if(!record.photo){

Utils.message(
"No Photo Available."
);

return;

}

const w=
window.open("","_blank");

w.document.write(`

<html>

<head>

<title>

Attendance Photo

</title>

</head>

<body
style="text-align:center;">

<h2>

${record.studentName||record.teacherName}

</h2>

<img
src="${record.photo}"
style="max-width:90%;">

<p>

${record.date}

&nbsp;

${record.time}

</p>

</body>

</html>

`);

},

filter(){

const from=
document.getElementById(
"fromDate"
).value;

const to=
document.getElementById(
"toDate"
).value;

let attendance=
Database.getAll(
CONFIG.STORAGE.ATTENDANCE
);

attendance=
attendance.filter(r=>{

if(from && r.date<from)
return false;

if(to && r.date>to)
return false;

return true;

});

console.log(
attendance
);

this.render();

},

print(){

window.print();

},

exportCSV(){

const attendance=
Database.getAll(
CONFIG.STORAGE.ATTENDANCE
);

let csv=

"Date,Time,Type,Name,ID,Status,Mode,Confidence\n";

attendance.forEach(r=>{

csv+=

`${r.date},${r.time},${r.type},${r.studentName||r.teacherName},${r.studentId||r.teacherId},${r.status},${r.mode},${r.confidence}\n`;

});

const blob=
new Blob(
[csv],
{type:"text/csv"}
);

const url=
URL.createObjectURL(blob);

const a=
document.createElement("a");

a.href=url;

a.download=
"FaceAttendance.csv";

a.click();

URL.revokeObjectURL(url);

}

};

window.FaceAttendanceReports=
FaceAttendanceReports;

/* ===== assets/js/attendance/cameraManager.js ===== */
﻿const CameraManager = {

    async getCameras() {
        const devices = await navigator.mediaDevices.enumerateDevices();

        return devices.filter(device => device.kind === "videoinput");
    },

    async start(cameraId = null) {

        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }

        const constraints = {
            video: cameraId
                ? { deviceId: { exact: cameraId } }
                : true
        };

        this.stream = await navigator.mediaDevices.getUserMedia(constraints);

        return this.stream;
    },

    stop() {

        if (this.stream) {

            this.stream.getTracks().forEach(track => track.stop());

            this.stream = null;

        }

    }

};

/* ===== assets/js/attendance/faceModels.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/attendance/faceModels.js
==================================================*/

const FaceModels = {

    loaded: false,

    async load() {

        if (this.loaded) return;

        const MODEL_PATH = "assets/face-api/models";

        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_PATH);

        await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_PATH);


        this.loaded = true;

        console.log("Face AI Models Loaded");

    }

};

/* ===== assets/js/attendance/faceRecognition.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/attendance/faceRecognition.js
 Version : 3.0.0
==================================================*/

const FaceRecognition={

matcher:null,

threshold:0.48,

studentDescriptors:[],

teacherDescriptors:[],

async load(){

await FaceModels.load();

this.studentDescriptors=[];

this.teacherDescriptors=[];

const students=
Database.getAll(
CONFIG.STORAGE.STUDENTS
);

students.forEach(student=>{

if(!student.faceDescriptor)return;

this.studentDescriptors.push({

label:student.studentId,

name:student.studentName,

className:student.studentClass,

descriptor:new Float32Array(
student.faceDescriptor
)

});

});

const teachers=
Database.getAll(
CONFIG.STORAGE.TEACHERS
);

teachers.forEach(teacher=>{

if(!teacher.faceDescriptor)return;

this.teacherDescriptors.push({

label:teacher.teacherId,

name:teacher.teacherName,

designation:teacher.designation,

descriptor:new Float32Array(
teacher.faceDescriptor
)

});

});

},

distance(a,b){

return faceapi.euclideanDistance(a,b);

},

confidence(distance){

let value=
Math.round(
(1-distance)*100
);

if(value<0)value=0;

if(value>100)value=100;

return value;

},

findStudent(descriptor){

let best=null;

let min=999;

this.studentDescriptors.forEach(student=>{

const d=
this.distance(
descriptor,
student.descriptor
);

if(d<min){

min=d;

best=student;

}

});

if(best==null)return null;

return{

student:best,

distance:min,

confidence:
this.confidence(min)

};

},

findTeacher(descriptor){

let best=null;

let min=999;

this.teacherDescriptors.forEach(teacher=>{

const d=
this.distance(
descriptor,
teacher.descriptor
);

if(d<min){

min=d;

best=teacher;

}

});

if(best==null)return null;

return{

teacher:best,

distance:min,

confidence:
this.confidence(min)

};

},

liveness(landmarks){

    if(!landmarks) return false;

    const leftEye =
        landmarks.getLeftEye();

    const rightEye =
        landmarks.getRightEye();

    const nose =
        landmarks.getNose();

    if(
        !leftEye ||
        !rightEye ||
        !nose
    ){
        return false;
    }

    const eyeDistance =

        Math.abs(

            leftEye[1].y -

            leftEye[5].y

        ) +

        Math.abs(

            rightEye[1].y -

            rightEye[5].y

        );

    const noseMove =

        Math.abs(

            nose[3].x -

            nose[0].x

        );

    if(

        eyeDistance > 4 &&

        noseMove > 2

    ){

        return true;

    }

    return false;

},

async recognize(video,type){

    const detection =

        await faceapi

        .detectSingleFace(

            video,

            new faceapi.TinyFaceDetectorOptions()

        )

        .withFaceLandmarks(true)

        .withFaceDescriptor();

    if(!detection){

        return{

            success:false,

            message:"No Face"

        };

    }

    if(

        !this.liveness(

            detection.landmarks

        )

    ){

        return{

            success:false,

            message:"Liveness Failed"

        };

    }

    let result;

    if(type==="Student"){

        result =

            this.findStudent(

                detection.descriptor

            );

    }else{

        result =

            this.findTeacher(

                detection.descriptor

            );

    }

    if(!result){

        return{

            success:false,

            message:"Unknown Face"

        };

    }

    if(result.distance > this.threshold){

        return{

            success:false,

            message:"Face Not Matched"

        };

    }

    return{

        success:true,

        detection,

        result

    };

},

setThreshold(value){

    this.threshold = value;

},

reset(){

    this.studentDescriptors = [];

    this.teacherDescriptors = [];

    this.matcher = null;

}

};

window.FaceRecognition =
    FaceRecognition;