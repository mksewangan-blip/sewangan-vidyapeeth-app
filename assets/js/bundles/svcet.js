
/* ===== assets/js/svcet/svcet.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/svcet/svcet.js
==================================================*/

const SVCET = {

    render() {

        const records = Database.getAll(CONFIG.STORAGE.SVCET);

        document.getElementById("mainContent").innerHTML = `

<div class="page">

<div class="page-header">

<h2>🎓 SVCET - Sewangan Vidyapeeth Common Entrance Test</h2>

</div>

<div class="card">

<button class="btn" onclick="SVCET.newRegistration()">
➕ New Registration
</button>

<button class="btn" onclick="SVCET.register()">
📋 Registration Register
</button>

<button class="btn" onclick="SVCETReports.render()">
📊 Reports
</button>

</div>

<div class="card">

<h3>Total Registrations : ${records.length}</h3>

<table class="table">

<thead>

<tr>

<th>S.No.</th>

<th>SVCET No.</th>

<th>Candidate Name</th>

<th>Father's Name</th>

<th>Class</th>

<th>School</th>

<th>Mobile</th>

<th>Status</th>

<th>Action</th>

</tr>

</thead>

<tbody>

${records.map((r,index)=>`

<tr>

<td>${index+1}</td>

<td>${r.svcetNo}</td>

<td>${r.name}</td>

<td>${r.fatherName}</td>

<td>${r.className}</td>

<td>${r.school}</td>

<td>${r.mobile || "-"}</td>

<td>${r.status}</td>

<td>

<button onclick="SVCET.view('${r.uuid}')">View</button>

<button onclick="SVCET.edit('${r.uuid}')">Edit</button>

<button onclick="SVCET.delete('${r.uuid}')">Delete</button>

<button onclick="SVCET.select('${r.uuid}')">Select</button>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

</div>

`;

    },

    newRegistration(){

        alert("SVCET Registration Form");

    },

    register() {

    const records = Database.getAll(CONFIG.STORAGE.SVCET);

    let html = `
    <div class="card">
    <h3>SVCET Registration Register</h3>

    <table class="table">
    <tr>
        <th>S.No.</th>
        <th>SVCET No.</th>
        <th>Name</th>
        <th>Father</th>
        <th>Class</th>
        <th>School</th>
        <th>Mobile</th>
        <th>Status</th>
    </tr>
    `;

    if (records.length === 0) {

        html += `
        <tr>
            <td colspan="8">No registrations found.</td>
        </tr>`;

    } else {

        records.forEach((r, i) => {

            html += `
            <tr>
                <td>${i + 1}</td>
                <td>${r.svcetNo}</td>
                <td>${r.name}</td>
                <td>${r.fatherName}</td>
                <td>${r.className}</td>
                <td>${r.school}</td>
                <td>${r.mobile}</td>
                <td>${r.status}</td>
            </tr>`;
        });

    }

    html += "</table></div>";

    document.getElementById("mainContent").innerHTML = html;

},

view(uuid) {
    alert("View Candidate : " + uuid);
},

edit(uuid) {
    alert("Edit Candidate : " + uuid);
},

delete(uuid) {

    if (!Utils.confirm("Delete this registration?")) return;

    let data = Database.getAll(CONFIG.STORAGE.SVCET);

    data = data.filter(r => r.uuid !== uuid);

    StorageManager.replace(CONFIG.STORAGE.SVCET, data);

    this.render();

},

select(uuid) {
    alert("Convert to Admission");
}

};

/* ===== assets/js/svcet/newRegistration.js ===== */
﻿/*==================================================
 SVMS Professional
 File : newRegistration.js
==================================================*/

SVCET.newRegistration = function () {

document.getElementById("mainContent").innerHTML = `

<div class="page">

<div class="page-header">

<h2>🎓 New SVCET Registration</h2>

</div>

<div class="card">

<form onsubmit="SVCET.save(event)">

<label>SVCET Registration No.</label>
<input
type="text"
id="svcetNo"
value="${IDGenerator.svcetNo()}"
readonly>

<label>Student / Candidate Name <span style="color:red">*</span></label>
<input
type="text"
id="name"
required>

<label>Father's Name <span style="color:red">*</span></label>
<input
type="text"
id="fatherName"
required>

<label>Address <span style="color:red">*</span></label>
<textarea
id="address"
rows="3"
required></textarea>

<label>Class Applying For <span style="color:red">*</span></label>
<select id="className" required>

<option value="">Select Class</option>

<option>Nursery</option>
<option>LKG</option>
<option>UKG</option>

<option>1</option>
<option>2</option>
<option>3</option>
<option>4</option>
<option>5</option>
<option>6</option>
<option>7</option>
<option>8</option>
<option>9</option>
<option>10</option>
<option>11 (Arts)</option>
<option>11 (Science)</option>
<option>11 (Commerce)</option>
<option>12 (Arts)</option>
<option>12 (Science)</option>
<option>12 (Commerce)</option>

</select>

<label>Previous School <span style="color:red">*</span></label>
<input
type="text"
id="school"
required>

<label>Mobile Number (Optional)</label>
<input
type="tel"
id="mobile"
maxlength="10"
placeholder="Optional">

<br><br>

<button class="btn">
💾 Save Registration
</button>

<button
type="button"
class="btn"
onclick="SVCET.render()">

Cancel

</button>

</form>

</div>

</div>

`;

};

/* ===== assets/js/svcet/saveRegistration.js ===== */
﻿/*==================================================
 SVMS Professional
==================================================*/

SVCET.save = function(e){

e.preventDefault();

const record = {

    uuid: Utils.uuid(),

    svcetNo: document.getElementById("svcetNo").value,

    name: document.getElementById("name").value,

    fatherName: document.getElementById("fatherName").value,

    address: document.getElementById("address").value,

    className: document.getElementById("className").value,

    school: document.getElementById("school").value,

    mobile: document.getElementById("mobile").value.trim(),

    status: "Registered",

    date: new Date().toLocaleDateString()

};

Database.insert(CONFIG.STORAGE.SVCET,record);

Utils.message("Registration Saved Successfully.");

SVCET.render();

};