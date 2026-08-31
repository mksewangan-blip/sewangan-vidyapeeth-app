
/* ===== assets/js/config.js ===== */
﻿/*==================================================
 SVMS Professional
 File : config.js
 Version : 2.1.0
==================================================*/

const CONFIG = {

    /*----------------------------------------------
      SOFTWARE
    ----------------------------------------------*/

    APP_NAME: "SVMS",

    FULL_NAME: "Sewangan Vidyapeeth Management System",

    VERSION: "2.1.0",

    DEVELOPER: "Sewangan Vidyapeeth",

    /*----------------------------------------------
      SCHOOL
    ----------------------------------------------*/

    SCHOOL_NAME: "Sewangan Vidyapeeth",

    TRUST_NAME: "Sewangan Charitable Trust",

    SESSION: "2026-27",

    SESSION_TEXT: "Academic Session : 2026-27",

    SESSION_CODE: "2627",

    /*----------------------------------------------
      ID PREFIXES
    ----------------------------------------------*/

    STUDENT_PREFIX: "SV",

    TEACHER_PREFIX: "SV/TR",

    REG_PREFIX: "SV/REG",

    ADMISSION_PREFIX: "ADM",

    SVCET_PREFIX: "SVCET",

    /*----------------------------------------------
      STARTING NUMBERS
    ----------------------------------------------*/

    FIRST_STUDENT_NUMBER: 1,

    FIRST_TEACHER_NUMBER: 1,

    FIRST_REGISTRATION_NUMBER: 1,

    FIRST_ADMISSION_NUMBER: 1,

    FIRST_SVCET_NUMBER: 1,

    /*----------------------------------------------
      NUMBER LENGTH
    ----------------------------------------------*/

    STUDENT_DIGITS: 4,

    TEACHER_DIGITS: 4,

    ADMISSION_DIGITS: 4,

    REGISTRATION_DIGITS: 5,

    SVCET_DIGITS: 5,

    /*----------------------------------------------
      STORAGE KEYS
    ----------------------------------------------*/

    STORAGE: {

        STUDENTS: "svms_students",

        TEACHERS: "svms_teachers",

        ATTENDANCE: "svms_attendance",

        HOLIDAYS: "holidays",

        WELFARE: "svms_welfare",

        LIBRARY: "svms_library",

        INVENTORY: "svms_inventory",


        TIMETABLE: "svms_timetable",

        EXAMS: "svms_exams",
        
        EXAM_SCHEDULES: "svms_exam_schedules",

        RESULTS: "svms_results",

        CERTIFICATES: "svms_certificates",

        REPORTS: "svms_reports",

        NOTIFICATIONS: "svms_notifications",

        SETTINGS: "svms_settings",

        USERS: "svms_users",

        SVCET: "svms_svcet",

        ADMISSIONS: "svms_admissions",
        GUARDIANS: "svms_guardians",
        PTM: "svms_ptm"

    },

    /*----------------------------------------------
      DEFAULT LISTS
    ----------------------------------------------*/

    GENDERS: [
        "Male",
        "Female",
        "Other"
    ],

    BLOOD_GROUPS: [
        "A+","A-",
        "B+","B-",
        "AB+","AB-",
        "O+","O-"
    ],

    STATUS: [
        "Active",
        "Inactive",
        "Transferred",
        "Passed",
        "Dropped"
    ],

    TEACHER_TYPES: [
        "Paid",
        "Honorary"
    ],

    SALARY_TYPES: [
        "Monthly",
        "Daily",
        "Per Lecture",
        "Honorary"
    ]

};

Object.freeze(CONFIG);

/* ===== assets/js/storage.js ===== */
﻿/*==================================================
 SVMS Professional
 File : storage.js
 Version : 2.0.0
==================================================*/

const StorageManager = {

    /*==============================
      Save
    ==============================*/
   save(key, data) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );

        // Upload to Firebase
       if (typeof FirebaseSync !== "undefined") {

    setTimeout(() => {

        FirebaseSync.upload(key, data);

    }, 300);

}

        return true;

    } catch (e) {

        console.error("Storage Save Error", e);

        return false;

    }

},

    /*==============================
      Load
    ==============================*/
    load(key) {

        try {

            const data = localStorage.getItem(key);

            if (!data) {

                return [];

            }

            return JSON.parse(data);

        } catch (e) {

            console.error("Storage Load Error", e);

            return [];

        }

    },

    /*==============================
      Remove
    ==============================*/
   remove(key) {

    localStorage.removeItem(key);

    if (typeof FirebaseSync !== "undefined") {

        db.ref(key).remove();

    }

},

    /*==============================
      Exists
    ==============================*/
    exists(key) {

        return localStorage.getItem(key) !== null;

    },

    /*==============================
      Clear All
    ==============================*/
   clearAll() {

    if (!confirm("Clear all SVMS data?")) return;

    Object.values(CONFIG.STORAGE).forEach(key => {

        localStorage.removeItem(key);

        if (typeof FirebaseSync !== "undefined") {

            db.ref(key).remove();

        }

    });

    alert("All data deleted.");

    location.reload();

},

    /*==============================
      Count Records
    ==============================*/
    count(key) {

        const data = this.load(key);

        return data.length;

    },

    /*==============================
      Insert Record
    ==============================*/
    insert(key, record) {

        let data = this.load(key);

        data.push(record);

        this.save(key, data);

    },

    /*==============================
      Update Record
    ==============================*/
    update(key, index, record) {

        let data = this.load(key);

        if (index >= 0 && index < data.length) {

            data[index] = record;

            this.save(key, data);

        }

    },

    /*==============================
      Delete Record
    ==============================*/
    delete(key, index) {

        let data = this.load(key);

        if (index >= 0 && index < data.length) {

            data.splice(index, 1);

            this.save(key, data);

        }

    },

    /*==============================
      Export
    ==============================*/
    export(key) {

        return JSON.stringify(

            this.load(key),

            null,

            2

        );

    },

    /*==============================
      Import
    ==============================*/
    import(key, json) {

    try {

        const data = JSON.parse(json);

        this.save(key, data);

        if (typeof FirebaseSync !== "undefined") {

            FirebaseSync.upload(key, data);

        }

        return true;

    } catch (e) {

        console.error(e);

        return false;

    }

},

/*==============================
  Get Next Number
==============================*/
nextNumber(key) {

    return this.count(key) + 1;

},

/*==============================
  Replace All Records
==============================*/
replace(key, records) {

    if (!Array.isArray(records)) {

        console.error("replace() expects an array.");

        return false;

    }

    return this.save(key, records);

},

/*==============================
  Append Multiple Records
==============================*/
insertMany(key, records) {

    if (!Array.isArray(records)) return false;

    let data = this.load(key);

    data.push(...records);

    return this.save(key, data);

}

};

/* ===== assets/js/database.js ===== */
﻿/*==================================================
 SVMS Professional
 File : database.js
 Version : 2.0.0
==================================================*/

const Database = {

    /*==========================================
      Initialize Database
    ==========================================*/
    initialize() {

    this.create(CONFIG.STORAGE.STUDENTS);

    this.create(CONFIG.STORAGE.TEACHERS);

    this.create(CONFIG.STORAGE.ATTENDANCE);

    this.create(CONFIG.STORAGE.WELFARE);

    this.create(CONFIG.STORAGE.LIBRARY);

    this.create(CONFIG.STORAGE.INVENTORY);


    this.create(CONFIG.STORAGE.TIMETABLE);

    this.create(CONFIG.STORAGE.EXAMS);

    this.create(CONFIG.STORAGE.EXAM_SCHEDULES);

    this.create(CONFIG.STORAGE.RESULTS);

    this.create(CONFIG.STORAGE.CERTIFICATES);

    this.create(CONFIG.STORAGE.REPORTS);

    this.create(CONFIG.STORAGE.NOTIFICATIONS);

    this.create(CONFIG.STORAGE.SETTINGS);

    this.create(CONFIG.STORAGE.USERS);

    this.create(CONFIG.STORAGE.SVCET);

    this.create(CONFIG.STORAGE.ADMISSIONS);

    console.log("SVMS Database Initialized");

},

    /*==========================================
      Create Empty Database
    ==========================================*/
    create(key) {

        if (!StorageManager.exists(key)) {

            StorageManager.save(key, []);

        }

    },

    /*==========================================
      Get All Records
    ==========================================*/
    getAll(key) {

        return StorageManager.load(key);

    },

    /*==========================================
      Get Record Count
    ==========================================*/
    count(key) {

        return StorageManager.count(key);

    },

    /*==========================================
      Insert Record
    ==========================================*/
    insert(key, record) {

        StorageManager.insert(key, record);

    },

    /*==========================================
      Update Record
    ==========================================*/
    update(key, index, record) {

        StorageManager.update(key, index, record);

    },

    /*==========================================
      Delete Record
    ==========================================*/
    delete(key, index) {

        StorageManager.delete(key, index);

    },

    /*==========================================
      Find Record
    ==========================================*/
    find(key, field, value) {

        const records = StorageManager.load(key);

        return records.find(item => item[field] === value);

    },

    /*==========================================
      Filter Records
    ==========================================*/
    filter(key, callback) {

        return StorageManager.load(key).filter(callback);

    },

    /*==========================================
      Search Records
    ==========================================*/
    search(key, keyword) {

        keyword = keyword.toString().toLowerCase();

        return StorageManager.load(key).filter(record => {

            return Object.values(record).some(value =>

                String(value)

                .toLowerCase()

                .includes(keyword)

            );

        });

    },

/*==========================================
      Save All Records
    ==========================================*/
    saveAll(key, data) {

        StorageManager.save(key, data);

    },

    /*==========================================
      Backup
    ==========================================*/
    backup() {

        const backup = {};

        Object.values(CONFIG.STORAGE).forEach(key => {

            backup[key] = StorageManager.load(key);

        });

        return backup;

    },

    /*==========================================
      Restore
    ==========================================*/
    restore(data) {

        Object.keys(data).forEach(key => {

            StorageManager.save(key, data[key]);

        });

    }

};

/*==========================================
 Initialize Automatically
==========================================*/

(async () => {

    if (typeof FirebaseSync !== "undefined") {

        for (const key of Object.values(CONFIG.STORAGE)) {

            const cloudData = await FirebaseSync.download(key);

            if (!cloudData || cloudData.length === 0) {

                Database.create(key);

            }

        }

    } else {

        Database.initialize();

    }

    console.log("☁ SVMS Cloud Ready");

})();

/* ===== assets/js/utils.js ===== */
﻿/*==================================================
 SVMS Professional
 File : utils.js
 Version : 2.0.0
==================================================*/

const Utils = {

    /*========a========================
      Current Time
    ==========================================*/
    currentTime() {

        return new Date().toLocaleTimeString();

    },

/*==========================================
  Current Date
==========================================*/
currentDate() {

    return new Date().toISOString().split("T")[0];

},

    /*==========================================
      Academic Session Code
      2026-27 -> 2627
    ==========================================*/
    sessionCode() {

        return CONFIG.SESSION
            .replace("-", "")
            .replace("20", "");

    },

    /*==========================================
      Zero Padding
    ==========================================*/
    pad(number, length = 4) {

        return String(number).padStart(length, "0");

    },

    /*==========================================
      Student ID
      SV/2627/0001
    ==========================================*/
    nextStudentId() {

    const students = Database.getAll(CONFIG.STORAGE.STUDENTS);

    const total = students.filter(s => s.studentId).length;

    return CONFIG.STUDENT_PREFIX +
        "/" +
        CONFIG.SESSION_CODE +
        "/" +
        String(total + 1).padStart(CONFIG.STUDENT_DIGITS, "0");

},

    /*==========================================
      Teacher ID
      SV/TR/2627/0001
    ==========================================*/
    nextTeacherId() {

    const total = Database.count(CONFIG.STORAGE.TEACHERS);

    return CONFIG.TEACHER_PREFIX +
        "/" +
        CONFIG.SESSION_CODE +
        "/" +
        String(total + 1).padStart(CONFIG.TEACHER_DIGITS, "0");

},

    /*==========================================
      Registration No.
      SV/REG/2627/00001
    ==========================================*/
    nextRegistrationNo() {

    const total = Database.count(CONFIG.STORAGE.ADMISSIONS);

    return CONFIG.REG_PREFIX +
        "/" +
        CONFIG.SESSION_CODE +
        "/" +
        String(total + 1).padStart(CONFIG.REGISTRATION_DIGITS, "0");

},

    /*==========================================
      Generate UUID
    ==========================================*/
    uuid() {

        return crypto.randomUUID();

    },

    /*==========================================
      Age from DOB
    ==========================================*/
    calculateAge(dob) {

        if (!dob) return "";

        const birth = new Date(dob);

        const today = new Date();

        let age = today.getFullYear() - birth.getFullYear();

        const month = today.getMonth() - birth.getMonth();

        if (
            month < 0 ||
            (month === 0 &&
                today.getDate() < birth.getDate())
        ) {

            age--;

        }

        return age;

    },

    /*==========================================
      Mobile Validation
    ==========================================*/
    validMobile(number) {

        return /^[6-9]\d{9}$/.test(number);

    },

    /*==========================================
      Email Validation
    ==========================================*/
    validEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    },

    /*==========================================
      Aadhaar Validation
    ==========================================*/
    validAadhaar(number) {

        return /^\d{12}$/.test(number);

    },

    /*==========================================
      Empty Check
    ==========================================*/
    isEmpty(value) {

        return value === undefined ||
               value === null ||
               String(value).trim() === "";

    },

    /*==========================================
      HTML Escape
    ==========================================*/
    escape(text) {

        const div = document.createElement("div");

        div.textContent = text;

        return div.innerHTML;

    },

    /*==========================================
      Toast
    ==========================================*/
    message(text) {

        alert(text);

    },

    /*==========================================
      Confirm
    ==========================================*/
    confirm(text) {

        return window.confirm(text);

    }

};

Utils.fileToBase64 = function(file){

    return new Promise((resolve,reject)=>{

        const reader = new FileReader();

        reader.onload = e => resolve(e.target.result);

        reader.onerror = reject;

        reader.readAsDataURL(file);

    });

};

/*==========================================
      Admission Number
    ==========================================*/
Utils.nextAdmissionNo = function () {

    const total = Database.count(CONFIG.STORAGE.ADMISSIONS);

    return CONFIG.ADMISSION_PREFIX +
        "/" +
        CONFIG.SESSION_CODE +
        "/" +
        String(total + 1).padStart(CONFIG.ADMISSION_DIGITS, "0");

};

/*==========================================
      SVCET Registration Number
    ==========================================*/
Utils.nextSVCETNo = function () {

    const total = Database.count(CONFIG.STORAGE.SVCET);

    return CONFIG.SVCET_PREFIX +
        "/" +
        CONFIG.SESSION_CODE +
        "/" +
        String(total + 1).padStart(CONFIG.SVCET_DIGITS, "0");

};

/*==========================================
  Class Options
==========================================*/
Utils.classOptions = function () {

    const classes = [
        "Nursery",
        "LKG",
        "UKG",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12"
    ];

    return classes.map(c =>
        `<option value="${c}">${c}</option>`
    ).join("");

};

/*==========================================
  Current Date & Time
==========================================*/
Utils.currentDateTime = function () {

    return new Date().toLocaleString();

};

/*==========================================
  Current User
==========================================*/
Utils.getCurrentUser = function () {

    return localStorage.getItem("svms_current_user") || "Administrator";

};

/* ===== assets/js/core/idGenerator.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/core/idGenerator.js
==================================================*/

const IDGenerator = {

    pad(number, digits) {
        return String(number).padStart(digits, "0");
    },

    studentId() {
        const total = Database.getAll(CONFIG.STORAGE.STUDENTS)
            .filter(s => s.studentId).length + 1;

        return `SV/${CONFIG.SESSION_CODE}/${this.pad(total,4)}`;
    },

    teacherId() {
        const total = Database.count(CONFIG.STORAGE.TEACHERS) + 1;

        return `SV/TR/${CONFIG.SESSION_CODE}/${this.pad(total,4)}`;
    },

    registrationNo() {
        const total = Database.count(CONFIG.STORAGE.ADMISSIONS) + 1;

        return `SV/REG/${CONFIG.SESSION_CODE}/${this.pad(total,5)}`;
    },

    admissionNo() {
        const total = Database.count(CONFIG.STORAGE.ADMISSIONS) + 1;

        return `ADM/${CONFIG.SESSION_CODE}/${this.pad(total,4)}`;
    },

    svcetNo() {
        const total = Database.count(CONFIG.STORAGE.SVCET) + 1;

        return `SVCET/${CONFIG.SESSION_CODE}/${this.pad(total,5)}`;
    }

};

/* ===== assets/js/router.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/router.js
 Version : 3.0.1
==================================================*/

const Router = {

    open(module) {

        /*==============================
          Login Required
        ==============================*/

        if (
            typeof requireLogin === "function" &&
            !requireLogin()
        ) {
            return;
        }

        /*==============================
          Access Control
        ==============================*/

        if (
            typeof AccessControl !== "undefined" &&
            !AccessControl.canAccess(module)
        ) {

            Utils.message("Access Denied.");

            return;

        }

        /*==============================
          Main Container
        ==============================*/

        const main =
            document.getElementById("mainContent");

        if (!main) {

            console.error("mainContent not found.");

            return;

        }

        /*==============================
          Module Routing
        ==============================*/

        switch (module) {

            case "dashboard":
                return Dashboard.render();

            case "svcet":
                return SVCET.render();

            case "students":
    console.log("Students object =", Students);

    if (typeof Students === "undefined") {
        alert("students.js not loaded");
        return;
    }

    if (typeof Students.render !== "function") {
        alert("Students.render() missing");
        return;
    }

    return Students.render();

            case "teachers":
                return Teachers.render();

            case "attendance":
                return Attendance.render();

            case "timetable":
                return Timetable.render();

            case "welfare":
                return Welfare.render();

            case "library":
                return Library.render();

            case "inventory":
                return Inventory.render();


            case "exams":
                return Exams.render();

            case "results":
                return Results.render();

            case "certificates":
                return Certificates.render();

            case "reports":
                return Reports.render();

            case "notifications":
                return Notifications.render();

            case "settings":
                return Settings.render();

            case "users":
                return Users.render();

            default:

                main.innerHTML = `

<div class="card">

<h2>Module Not Found</h2>

<p>${module}</p>

</div>

`;

        }

    }

};

function openModule(module) {

    Router.open(module);

}

/* ===== assets/js/utils/nameHelper.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/utils/nameHelper.js
==================================================*/

const NameHelper = {

    display(name, list, field) {

        const same = list.filter(item => item[field] === name);

        if (same.length <= 1) {
            return name;
        }

        const index = same.findIndex(item => item[field] === name);

        const roman = [
            "I","II","III","IV","V",
            "VI","VII","VIII","IX","X"
        ];

        return name + " (" + roman[index] + ")";

    }

};

/* ===== assets/js/core/liveRefresh.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/core/liveRefresh.js
 Version : 3.1.1
==================================================*/

const LiveRefresh = {

    refresh(key) {

        // Refresh only if that module is currently open

        if (!document.querySelector(".page")) return;

        switch (key) {

            case CONFIG.STORAGE.STUDENTS:

                if (
                    typeof Students !== "undefined" &&
                    document.querySelector("h2")?.textContent.includes("Students")
                ) {
                    Students.render();
                }

                break;

            case CONFIG.STORAGE.TEACHERS:

                if (
                    typeof Teachers !== "undefined" &&
                    document.querySelector("h2")?.textContent.includes("Teachers")
                ) {
                    Teachers.render();
                }

                break;

            case CONFIG.STORAGE.ATTENDANCE:

                if (
                    typeof Attendance !== "undefined" &&
                    typeof Attendance.refresh === "function"
                ) {
                    Attendance.refresh();
                }

                break;

            case CONFIG.STORAGE.WELFARE:

                if (
                    typeof Welfare !== "undefined" &&
                    document.querySelector("h2")?.textContent.includes("Welfare")
                ) {
                    Welfare.render();
                }

                break;

            case CONFIG.STORAGE.LIBRARY:

                if (
                    typeof Library !== "undefined" &&
                    document.querySelector("h2")?.textContent.includes("Library")
                ) {
                    Library.render();
                }

                break;

            case CONFIG.STORAGE.INVENTORY:

                // Refresh inventory ONLY when Inventory page is already open

                if (
                    typeof Inventory !== "undefined" &&
                    document.querySelector("h2")?.textContent.includes("Inventory")
                ) {
                    Inventory.render();
                }

                break;

        }

    }

};

window.addEventListener("svms-data-changed", function (e) {

    LiveRefresh.refresh(e.detail.key);

});