
/* ===== assets/js/inventory/inventory.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/inventory/inventory.js
 Version : 2.0.0
==================================================*/

const Inventory = {

    render() {

        const items = Database.getAll(
            CONFIG.STORAGE.INVENTORY || "inventory"
        );

        document.getElementById("mainContent").innerHTML = `

<div class="page">

<div class="page-header">

<h2>📦 Inventory Management</h2>

</div>

<div class="dashboard-grid">

<div class="dashboard-card">
<h3>Total Items</h3>
<h1>${items.length}</h1>
</div>

</div>

<div class="card">

<h3>Quick Actions</h3>

<button class="btn" onclick="Inventory.newItem()">
➕ New Item
</button>

<button class="btn" onclick="Inventory.itemRegister()">
📋 Item Register
</button>

<button class="btn" onclick="Inventory.issueItem()">
📤 Issue Item
</button>

<button class="btn" onclick="Inventory.returnItem()">
📥 Return Item
</button>

<button class="btn" onclick="Inventory.reports()">
📊 Reports
</button>

<button class="btn" onclick="Inventory.print()">
🖨 Print
</button>

</div>

<div id="inventoryContent"></div>

</div>

`;

    },

    newItem() {

        if (typeof NewItem !== "undefined") {

            NewItem.render();

        }

    },

    itemRegister() {

        if (typeof ItemRegister !== "undefined") {

            ItemRegister.render();

        }

    },

    issueItem() {

        if (typeof IssueItem !== "undefined") {

            IssueItem.render();

        }

    },

    returnItem() {

        if (typeof ReturnItem !== "undefined") {

            ReturnItem.render();

        }

    },

    reports() {

        if (typeof InventoryReports !== "undefined") {

            InventoryReports.render();

        }

    },

    print() {

        if (typeof InventoryPrint !== "undefined") {

            InventoryPrint.render();

        }

    }

};

/* ===== assets/js/inventory/newItem.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/inventory/newItem.js
 Version : 2.0.0
==================================================*/

const NewItem = {

    render() {

        document.getElementById("inventoryContent").innerHTML = `

<div class="card">

<h3>➕ Add New Inventory Item</h3>

<div class="form-grid">

<div class="form-group">
<label>Item Name</label>
<input type="text" id="invItemName">
</div>

<div class="form-group">
<label>Category</label>
<input type="text" id="invCategory">
</div>

<div class="form-group">
<label>Quantity</label>
<input type="number" id="invQuantity" value="1">
</div>

<div class="form-group">
<label>Unit</label>
<input type="text" id="invUnit" placeholder="Piece, Box, Kg">
</div>

<div class="form-group">
<label>Purchase Date</label>
<input type="date" id="invPurchaseDate">
</div>

<div class="form-group">
<label>Purchase Price</label>
<input type="number" id="invPurchasePrice">
</div>

<div class="form-group">
<label>Supplier</label>
<input type="text" id="invSupplier">
</div>

<div class="form-group">
<label>Location</label>
<input type="text" id="invLocation">
</div>

<div class="form-group">
<label>Description</label>
<textarea id="invDescription"></textarea>
</div>

</div>

<br>

<button class="btn" onclick="SaveItem.save()">
💾 Save Item
</button>

<button class="btn" onclick="Inventory.render()">
❌ Cancel
</button>

</div>

`;

        const today = new Date().toISOString().split("T")[0];

        document.getElementById("invPurchaseDate").value = today;

    }

};

/* ===== assets/js/inventory/saveItem.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/inventory/saveItem.js
 Version : 2.0.0
==================================================*/

const SaveItem = {

    save() {

        const item = {

            id: "INV" + Date.now(),

            itemName: document.getElementById("invItemName").value.trim(),

            category: document.getElementById("invCategory").value.trim(),

            quantity: Number(
                document.getElementById("invQuantity").value
            ),

            unit: document.getElementById("invUnit").value.trim(),

            purchaseDate: document.getElementById("invPurchaseDate").value,

            purchasePrice: Number(
                document.getElementById("invPurchasePrice").value
            ),

            supplier: document.getElementById("invSupplier").value.trim(),

            location: document.getElementById("invLocation").value.trim(),

            description: document.getElementById("invDescription").value.trim(),

            createdAt: new Date().toISOString()

        };

        if (item.itemName === "") {

            alert("Please enter Item Name.");

            return;

        }

        const storageKey =
            CONFIG.STORAGE.INVENTORY || "inventory";

        let data = Database.getAll(storageKey);

        data.push(item);

        Database.saveAll(storageKey, data);

        if (typeof addAuditLog === "function") {

            addAuditLog(
                "Inventory",
                "Add Item",
                item.itemName
            );

        }

        alert("Inventory item saved successfully.");

        if (typeof ItemRegister !== "undefined") {

            ItemRegister.render();

        } else {

            Inventory.render();

        }

    }

};

/* ===== assets/js/inventory/itemRegister.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/inventory/itemRegister.js
 Version : 2.0.0
==================================================*/

const ItemRegister = {

    render() {

        const storageKey =
            CONFIG.STORAGE.INVENTORY || "inventory";

        const items = Database.getAll(storageKey);

        let html = `

<div class="card">

<h3>📋 Inventory Register</h3>

<input
type="text"
id="inventorySearch"
class="input"
placeholder="Search Item..."
onkeyup="ItemRegister.search()">

<br><br>

<table class="table">

<thead>

<tr>

<th>ID</th>
<th>Item</th>
<th>Category</th>
<th>Qty</th>
<th>Location</th>
<th>Action</th>

</tr>

</thead>

<tbody id="inventoryTableBody">

`;

        if (items.length === 0) {

            html += `

<tr>

<td colspan="6" style="text-align:center;">

No inventory items found.

</td>

</tr>

`;

        } else {

            items.forEach((item, index) => {

                html += `

<tr>

<td>${item.id}</td>

<td>${item.itemName}</td>

<td>${item.category}</td>

<td>${item.quantity} ${item.unit}</td>

<td>${item.location}</td>

<td>

<button class="btn"
onclick="ViewItem.show(${index})">

View

</button>

<button class="btn"
onclick="EditItem.edit(${index})">

Edit

</button>

<button class="btn btn-danger"
onclick="DeleteItem.remove(${index})">

Delete

</button>

</td>

</tr>

`;

            });

        }

        html += `

</tbody>

</table>

</div>

`;

        document.getElementById(
            "inventoryContent"
        ).innerHTML = html;

    },

    search() {

        const keyword = document
            .getElementById("inventorySearch")
            .value
            .toLowerCase();

        const rows = document.querySelectorAll(
            "#inventoryTableBody tr"
        );

        rows.forEach(row => {

            row.style.display =
                row.innerText.toLowerCase().includes(keyword)
                ? ""
                : "none";

        });

    }

};

/* ===== assets/js/inventory/viewItem.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/inventory/viewItem.js
 Version : 2.0.0
==================================================*/

const ViewItem = {

    show(index) {

        const storageKey =
            CONFIG.STORAGE.INVENTORY || "inventory";

        const items = Database.getAll(storageKey);

        const item = items[index];

        if (!item) {

            alert("Item not found.");

            return;

        }

        document.getElementById("inventoryContent").innerHTML = `

<div class="card">

<h2>📦 Inventory Item Details</h2>

<table class="table">

<tr>
<th width="200">Item ID</th>
<td>${item.id}</td>
</tr>

<tr>
<th>Item Name</th>
<td>${item.itemName}</td>
</tr>

<tr>
<th>Category</th>
<td>${item.category}</td>
</tr>

<tr>
<th>Quantity</th>
<td>${item.quantity} ${item.unit}</td>
</tr>

<tr>
<th>Purchase Date</th>
<td>${item.purchaseDate}</td>
</tr>

<tr>
<th>Purchase Price</th>
<td>₹ ${item.purchasePrice}</td>
</tr>

<tr>
<th>Supplier</th>
<td>${item.supplier}</td>
</tr>

<tr>
<th>Location</th>
<td>${item.location}</td>
</tr>

<tr>
<th>Description</th>
<td>${item.description}</td>
</tr>

<tr>
<th>Created On</th>
<td>${item.createdAt || "-"}</td>
</tr>

</table>

<br>

<button class="btn"
onclick="EditItem.edit(${index})">

✏ Edit

</button>

<button class="btn btn-danger"
onclick="DeleteItem.remove(${index})">

🗑 Delete

</button>

<button class="btn"
onclick="window.print()">

🖨 Print

</button>

<button class="btn"
onclick="ItemRegister.render()">

⬅ Back

</button>

</div>

`;

    }

};

/* ===== assets/js/inventory/editItem.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/inventory/editItem.js
 Version : 2.0.0
==================================================*/

const EditItem = {

    edit(index) {

        const storageKey =
            CONFIG.STORAGE.INVENTORY || "inventory";

        const items = Database.getAll(storageKey);

        const item = items[index];

        if (!item) {

            alert("Item not found.");

            return;

        }

        document.getElementById("inventoryContent").innerHTML = `

<div class="card">

<h2>✏ Edit Inventory Item</h2>

<div class="form-grid">

<div class="form-group">
<label>Item Name</label>
<input type="text" id="editItemName" value="${item.itemName}">
</div>

<div class="form-group">
<label>Category</label>
<input type="text" id="editCategory" value="${item.category}">
</div>

<div class="form-group">
<label>Quantity</label>
<input type="number" id="editQuantity" value="${item.quantity}">
</div>

<div class="form-group">
<label>Unit</label>
<input type="text" id="editUnit" value="${item.unit}">
</div>

<div class="form-group">
<label>Purchase Date</label>
<input type="date" id="editPurchaseDate" value="${item.purchaseDate}">
</div>

<div class="form-group">
<label>Purchase Price</label>
<input type="number" id="editPurchasePrice" value="${item.purchasePrice}">
</div>

<div class="form-group">
<label>Supplier</label>
<input type="text" id="editSupplier" value="${item.supplier}">
</div>

<div class="form-group">
<label>Location</label>
<input type="text" id="editLocation" value="${item.location}">
</div>

<div class="form-group">
<label>Description</label>
<textarea id="editDescription">${item.description || ""}</textarea>
</div>

</div>

<br>

<button class="btn"
onclick="EditItem.update(${index})">

💾 Update

</button>

<button class="btn"
onclick="ItemRegister.render()">

❌ Cancel

</button>

</div>

`;

    },

    update(index) {

        const storageKey =
            CONFIG.STORAGE.INVENTORY || "inventory";

        let items = Database.getAll(storageKey);

        items[index].itemName =
            document.getElementById("editItemName").value.trim();

        items[index].category =
            document.getElementById("editCategory").value.trim();

        items[index].quantity =
            Number(document.getElementById("editQuantity").value);

        items[index].unit =
            document.getElementById("editUnit").value.trim();

        items[index].purchaseDate =
            document.getElementById("editPurchaseDate").value;

        items[index].purchasePrice =
            Number(document.getElementById("editPurchasePrice").value);

        items[index].supplier =
            document.getElementById("editSupplier").value.trim();

        items[index].location =
            document.getElementById("editLocation").value.trim();

        items[index].description =
            document.getElementById("editDescription").value.trim();

        Database.saveAll(storageKey, items);

        if (typeof addAuditLog === "function") {

            addAuditLog(
                "Inventory",
                "Edit Item",
                items[index].itemName
            );

        }

        alert("Inventory item updated successfully.");

        ItemRegister.render();

    }

};

/* ===== assets/js/inventory/deleteItem.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/inventory/deleteItem.js
 Version : 2.0.0
==================================================*/

const DeleteItem = {

    remove(index) {

        const storageKey =
            CONFIG.STORAGE.INVENTORY || "inventory";

        let items = Database.getAll(storageKey);

        if (!items[index]) {

            alert("Item not found.");

            return;

        }

        const itemName = items[index].itemName;

        if (!confirm(
            "Are you sure you want to delete \"" +
            itemName +
            "\" ?"
        )) {

            return;

        }

        items.splice(index, 1);

        Database.saveAll(storageKey, items);

        if (typeof addAuditLog === "function") {

            addAuditLog(
                "Inventory",
                "Delete Item",
                itemName
            );

        }

        alert("Inventory item deleted successfully.");

        ItemRegister.render();

    }

};

/* ===== assets/js/inventory/issueItem.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/inventory/issueItem.js
 Version : 2.0.0
==================================================*/

const IssueItem = {

    render() {

        const items = Database.getAll(
            CONFIG.STORAGE.INVENTORY || "inventory"
        );

        let options = "";

        items.forEach((item, index) => {

            options += `
<option value="${index}">
${item.itemName} (${item.quantity} ${item.unit})
</option>`;

        });

        document.getElementById("inventoryContent").innerHTML = `

<div class="card">

<h2>📤 Issue Inventory Item</h2>

<div class="form-grid">

<div class="form-group">
<label>Select Item</label>

<select id="issueItemIndex">

${options}

</select>

</div>

<div class="form-group">
<label>Issue To</label>

<input
type="text"
id="issueTo"
placeholder="Student / Teacher / Department">

</div>

<div class="form-group">
<label>Quantity</label>

<input
type="number"
id="issueQty"
value="1"
min="1">

</div>

<div class="form-group">
<label>Issue Date</label>

<input
type="date"
id="issueDate">

</div>

<div class="form-group">
<label>Remarks</label>

<textarea
id="issueRemarks"></textarea>

</div>

</div>

<br>

<button
class="btn"
onclick="IssueItem.save()">

📤 Issue Item

</button>

<button
class="btn"
onclick="Inventory.render()">

⬅ Back

</button>

</div>

`;

        document.getElementById("issueDate").value =
            new Date().toISOString().split("T")[0];

    },

    save() {

        const inventoryKey =
            CONFIG.STORAGE.INVENTORY || "inventory";

        const issueKey =
            CONFIG.STORAGE.INVENTORY_ISSUES || "inventoryIssues";

        let inventory =
            Database.getAll(inventoryKey);

        let issues =
            Database.getAll(issueKey);

        const index =
            Number(document.getElementById("issueItemIndex").value);

        const qty =
            Number(document.getElementById("issueQty").value);

        if (inventory[index].quantity < qty) {

            alert("Insufficient stock.");

            return;

        }

        inventory[index].quantity -= qty;

        issues.push({

            issueId: "ISS" + Date.now(),

            itemId: inventory[index].id,

            itemName: inventory[index].itemName,

            issueTo:
                document.getElementById("issueTo").value.trim(),

            quantity: qty,

            issueDate:
                document.getElementById("issueDate").value,

            remarks:
                document.getElementById("issueRemarks").value.trim(),

            status: "Issued"

        });

        Database.saveAll(inventoryKey, inventory);

        Database.saveAll(issueKey, issues);

        if (typeof addAuditLog === "function") {

            addAuditLog(
                "Inventory",
                "Issue Item",
                inventory[index].itemName
            );

        }

        alert("Item issued successfully.");

        Inventory.render();

    }

};

/* ===== assets/js/inventory/returnItem.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/inventory/returnItem.js
 Version : 2.0.0
==================================================*/

const ReturnItem = {

    render() {

        const issueKey =
            CONFIG.STORAGE.INVENTORY_ISSUES || "inventoryIssues";

        const issues =
            Database.getAll(issueKey);

        let html = `

<div class="card">

<h2>📥 Return Inventory Item</h2>

<table class="table">

<thead>

<tr>

<th>Issue ID</th>
<th>Item</th>
<th>Issued To</th>
<th>Qty</th>
<th>Issue Date</th>
<th>Status</th>
<th>Action</th>

</tr>

</thead>

<tbody>

`;

        if (issues.length === 0) {

            html += `

<tr>

<td colspan="7" style="text-align:center">

No issued items found.

</td>

</tr>

`;

        } else {

            issues.forEach((issue, index) => {

                html += `

<tr>

<td>${issue.issueId}</td>

<td>${issue.itemName}</td>

<td>${issue.issueTo}</td>

<td>${issue.quantity}</td>

<td>${issue.issueDate}</td>

<td>${issue.status}</td>

<td>

${issue.status === "Issued"

? `<button class="btn"
onclick="ReturnItem.receive(${index})">
Return
</button>`

: "Returned"}

</td>

</tr>

`;

            });

        }

        html += `

</tbody>

</table>

<button
class="btn"
onclick="Inventory.render()">

⬅ Back

</button>

</div>

`;

        document.getElementById(
            "inventoryContent"
        ).innerHTML = html;

    },

    receive(index) {

        const inventoryKey =
            CONFIG.STORAGE.INVENTORY || "inventory";

        const issueKey =
            CONFIG.STORAGE.INVENTORY_ISSUES || "inventoryIssues";

        let inventory =
            Database.getAll(inventoryKey);

        let issues =
            Database.getAll(issueKey);

        const issue = issues[index];

        if (!issue || issue.status === "Returned") {

            return;

        }

        const item = inventory.find(i => i.id === issue.itemId);

        if (item) {

            item.quantity += Number(issue.quantity);

        }

        issue.status = "Returned";

        issue.returnDate =
            new Date().toISOString().split("T")[0];

        Database.saveAll(inventoryKey, inventory);

        Database.saveAll(issueKey, issues);

        if (typeof addAuditLog === "function") {

            addAuditLog(
                "Inventory",
                "Return Item",
                issue.itemName
            );

        }

        alert("Item returned successfully.");

        ReturnItem.render();

    }

};

/* ===== assets/js/inventory/reports.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/inventory/reports.js
 Version : 2.0.0
==================================================*/

const InventoryReports = {

    render() {

        const inventory = Database.getAll(
            CONFIG.STORAGE.INVENTORY || "inventory"
        );

        const issues = Database.getAll(
            CONFIG.STORAGE.INVENTORY_ISSUES || "inventoryIssues"
        );

        const totalItems = inventory.length;

        const totalStock = inventory.reduce(
            (sum, item) => sum + Number(item.quantity || 0),
            0
        );

        const lowStock = inventory.filter(
            item => Number(item.quantity || 0) <= 5
        );

        const issuedItems = issues.filter(
            item => item.status === "Issued"
        );

        let html = `

<div class="card">

<h2>📊 Inventory Reports</h2>

<div class="dashboard-grid">

<div class="dashboard-card">
<h3>Total Items</h3>
<h1>${totalItems}</h1>
</div>

<div class="dashboard-card">
<h3>Total Stock</h3>
<h1>${totalStock}</h1>
</div>

<div class="dashboard-card">
<h3>Low Stock</h3>
<h1>${lowStock.length}</h1>
</div>

<div class="dashboard-card">
<h3>Issued Items</h3>
<h1>${issuedItems.length}</h1>
</div>

</div>

<div class="card">

<button class="btn"
onclick="InventoryReports.lowStock()">

Low Stock Report

</button>

<button class="btn"
onclick="InventoryReports.issuedItems()">

Issued Items Report

</button>

<button class="btn"
onclick="InventoryPrint.render()">

Print Report

</button>

</div>

<div id="inventoryReportArea"></div>

</div>

`;

        document.getElementById(
            "inventoryContent"
        ).innerHTML = html;

    },

    lowStock() {

        const inventory = Database.getAll(
            CONFIG.STORAGE.INVENTORY || "inventory"
        );

        const data = inventory.filter(
            item => Number(item.quantity || 0) <= 5
        );

        this.showTable(
            "Low Stock Items",
            data
        );

    },

    issuedItems() {

        const issues = Database.getAll(
            CONFIG.STORAGE.INVENTORY_ISSUES || "inventoryIssues"
        );

        const data = issues.filter(
            item => item.status === "Issued"
        );

        this.showIssuedTable(data);

    },

    showTable(title, data) {

        let html = `<h3>${title}</h3>`;

        html += `

<table class="table">

<tr>

<th>Item</th>
<th>Category</th>
<th>Quantity</th>
<th>Location</th>

</tr>

`;

        if (data.length === 0) {

            html += `
<tr>
<td colspan="4">No records found.</td>
</tr>`;

        } else {

            data.forEach(item => {

                html += `

<tr>

<td>${item.itemName}</td>

<td>${item.category}</td>

<td>${item.quantity}</td>

<td>${item.location}</td>

</tr>

`;

            });

        }

        html += "</table>";

        document.getElementById(
            "inventoryReportArea"
        ).innerHTML = html;

    },

    showIssuedTable(data) {

        let html = `<h3>Issued Items</h3>`;

        html += `

<table class="table">

<tr>

<th>Item</th>
<th>Issued To</th>
<th>Qty</th>
<th>Issue Date</th>

</tr>

`;

        if (data.length === 0) {

            html += `
<tr>
<td colspan="4">No issued items found.</td>
</tr>`;

        } else {

            data.forEach(item => {

                html += `

<tr>

<td>${item.itemName}</td>

<td>${item.issueTo}</td>

<td>${item.quantity}</td>

<td>${item.issueDate}</td>

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

/* ===== assets/js/inventory/print.js ===== */
﻿/*==================================================
 SVMS Professional
 File : assets/js/inventory/print.js
 Version : 2.0.0
==================================================*/

const InventoryPrint = {

    render() {

        const inventory = Database.getAll(
            CONFIG.STORAGE.INVENTORY || "inventory"
        );

        let html = `

<!DOCTYPE html>

<html>

<head>

<title>Inventory Report</title>

<style>

body{
font-family:Arial,sans-serif;
margin:20px;
}

h1,h2,h3{
text-align:center;
margin:5px;
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
padding:8px;
text-align:left;
font-size:14px;
}

.footer{
margin-top:30px;
display:flex;
justify-content:space-between;
}

</style>

</head>

<body>

<h1>Sewangan Vidyapeeth</h1>

<h2>Inventory Register</h2>

<h3>Print Date : ${
new Date().toLocaleDateString()
}</h3>

<table>

<tr>

<th>S.No.</th>
<th>Item ID</th>
<th>Item Name</th>
<th>Category</th>
<th>Quantity</th>
<th>Unit</th>
<th>Location</th>

</tr>

`;

        inventory.forEach((item, index) => {

            html += `

<tr>

<td>${index + 1}</td>

<td>${item.id}</td>

<td>${item.itemName}</td>

<td>${item.category}</td>

<td>${item.quantity}</td>

<td>${item.unit}</td>

<td>${item.location}</td>

</tr>

`;

        });

        html += `

</table>

<div class="footer">

<div>

Prepared By

<br><br>

____________________

</div>

<div>

Authorized Signatory

<br><br>

____________________

</div>

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

};