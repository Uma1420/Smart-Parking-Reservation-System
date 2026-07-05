// ======================================
// LOGIN
// ======================================

function login() {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const error = document.getElementById("error");

    error.innerHTML = "";

    if (username === "" || password === "") {

        error.innerHTML = "⚠ Please enter Username & Password";
        return;

    }

    if (username !== "admin" || password !== "1234") {

        error.innerHTML = "❌ Invalid Username or Password";
        return;

    }

    localStorage.setItem("isLoggedIn", "true");

    if (!localStorage.getItem("parkingSlots")) {

        let slots = [];

        for (let i = 1; i <= 20; i++) {
            
            slots.push({

               id: i,
               occupied: false,
               vehicleNumber: "",
               ownerName: "",
               phoneNumber: "",
               vehicleType: "",
               entryTime: "",
               entryTimestamp: 0,
               exitTime: ""

            });
        }

        localStorage.setItem("parkingSlots", JSON.stringify(slots));

    }

    if (!localStorage.getItem("totalRevenue")) {

        localStorage.setItem("totalRevenue", "0");

    }

    window.location.href = "dashboard.html";

}

// ======================================
// SHOW / HIDE PASSWORD
// ======================================

function togglePassword(){

    let password=document.getElementById("password");

    if(password.type==="password"){

        password.type="text";

    }else{

        password.type="password";

    }

}

// ======================================
// LOGOUT
// ======================================

function logout() {

    if (confirm("Do you want to logout?")) {

        localStorage.removeItem("isLoggedIn");

        window.location.href = "login.html";

    }

}

// ======================================
// DATE & TIME
// ======================================

function updateDateTime() {

    let now = new Date();

    let options = {

        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"

    };

    let clock = document.getElementById("currentDateTime");

    if (clock) {

        clock.innerHTML = now.toLocaleString("en-IN", options);

    }

}

setInterval(updateDateTime,1000);

// ======================================
// DASHBOARD
// ======================================

function loadDashboard(){

    if(localStorage.getItem("isLoggedIn")!=="true"){

       window.location.href="login.html";
        return;

    }

    updateDateTime();

    let slots=JSON.parse(localStorage.getItem("parkingSlots")) || [];

    let occupied=slots.filter(slot=>slot.occupied).length;

    let available=20-occupied;

    let revenue=Number(localStorage.getItem("totalRevenue")) || 0;

    document.getElementById("totalSlots").innerHTML=20;
    document.getElementById("availableSlots").innerHTML=available;
    document.getElementById("occupiedSlots").innerHTML=occupied;
    document.getElementById("totalRevenue").innerHTML="₹"+revenue;

}

// ======================================
// LOAD PARKING
// ======================================

function loadParking(){

    if(localStorage.getItem("isLoggedIn")!=="true"){

        window.location.href="login.html";
        return;

    }

    updateDateTime();

    displaySlots();

    loadPendingReservations();

}

/// ======================================
// DISPLAY PARKING SLOTS
// ======================================

function displaySlots() {

    let slots = JSON.parse(localStorage.getItem("parkingSlots")) || [];

    let container = document.getElementById("parkingSlots");

    if (!container) return;

    container.innerHTML = "";

    slots.forEach(slot => {

        let card = document.createElement("div");

        card.className = slot.occupied ? "slot occupied" : "slot" ;

        if (slot.occupied) {

            let icon = "🚗";
            
            if (slot.vehicleType === "Bike") icon = "🏍";
            if (slot.vehicleType === "Van") icon = "🚐";
            if (slot.vehicleType === "Truck") icon = "🚚";

            card.innerHTML = `

                <h3>🅿️ Slot ${slot.id}</h3>

                <h2>${icon}</h2>

                <p><b>${slot.vehicleNumber}</b></p>

               <p>${slot.ownerName}</p>

              <small>📱 ${slot.phoneNumber || "-"}</small>

              <small style="display:block;margin-top:5px;">
              🕒 ${slot.entryTime}
              </small>

                ${window.location.pathname.includes("user-parking.html") ? "" : `
                <button onclick="removeVehicle(${slot.id})" style="margin-top:8px;">
               🚗 Exit
                </button>
                `}
            `;

        }

        else {

            card.innerHTML = `

                <h3>🅿️ Slot ${slot.id}</h3>

                <h2>🟢</h2>

                <p><b>Available</b></p>

            `;

        }

        container.appendChild(card);

    });

}

// ======================================
// PARK VEHICLE / RESERVE SLOT
// ======================================

function parkVehicle() {

    let vehicleNumber = document.getElementById("vehicleNumber").value.trim().toUpperCase();
    let ownerName = document.getElementById("ownerName").value.trim();
    let phoneNumber = document.getElementById("phoneNumber").value.trim();
    let vehicleType = document.getElementById("vehicleType").value;
    let slotNumber = document.getElementById("slotNumber").value;

    let vehicleError = document.getElementById("vehicleError");
    let ownerError = document.getElementById("ownerError");
    let phoneError = document.getElementById("phoneError");
    let typeError = document.getElementById("typeError");
    let slotError = document.getElementById("slotError");
    let success = document.getElementById("successMessage");

    vehicleError.innerHTML = "";
    ownerError.innerHTML = "";
    phoneError.innerHTML = "";
    typeError.innerHTML = "";
    slotError.innerHTML = "";
    success.innerHTML = "";

    let valid = true;

    // Vehicle Validation

    let vehiclePattern = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;

    if(vehicleNumber===""){

        vehicleError.innerHTML="Vehicle Number is required";

        valid=false;

    }
    else if(!vehiclePattern.test(vehicleNumber)){

        vehicleError.innerHTML="Example : TN72AB1234";

        valid=false;

    }

    // Owner Validation

    let ownerPattern=/^[A-Za-z ]+$/;

    if(ownerName===""){

        ownerError.innerHTML="Customer Name is required";

        valid=false;

    }
    else if(!ownerPattern.test(ownerName)){

        ownerError.innerHTML="Only letters allowed";

        valid=false;

    }

    // Phone Validation

    let phonePattern=/^[6-9][0-9]{9}$/;

    if(phoneNumber===""){

        phoneError.innerHTML="Mobile Number is required";

        valid=false;

    }
    else if(!phonePattern.test(phoneNumber)){

        phoneError.innerHTML="Enter valid Mobile Number";

        valid=false;

    }

    // Vehicle Type

    if(vehicleType===""){

        typeError.innerHTML="Select Vehicle Type";

        valid=false;

    }

    // Slot Validation

    if(slotNumber===""){

        slotError.innerHTML="Select Parking Slot";

        valid=false;

    }

    if(!valid) return;

    let slots=JSON.parse(localStorage.getItem("parkingSlots")) || [];

    // Duplicate Vehicle

    let duplicate=slots.find(slot=>

        slot.occupied &&
        slot.vehicleNumber===vehicleNumber

    );

    if(duplicate){

        vehicleError.innerHTML="Vehicle already parked";

        return;

    }

    // Selected Slot

    let freeSlot=slots.find(slot=>

        slot.id==slotNumber &&
        !slot.occupied

    );

    if(!freeSlot){

        slotError.innerHTML="Selected Slot is not available";

        return;

    }

    // Save Data

    freeSlot.occupied=true;
    freeSlot.vehicleNumber=vehicleNumber;
    freeSlot.ownerName=ownerName;
    freeSlot.phoneNumber=phoneNumber;
    freeSlot.vehicleType=vehicleType;
    freeSlot.entryTime=new Date().toLocaleString();
    freeSlot.entryTimestamp=Date.now();
    freeSlot.exitTime="";

    localStorage.setItem("parkingSlots",JSON.stringify(slots));

    // Clear Form

    document.getElementById("vehicleNumber").value="";
    document.getElementById("ownerName").value="";
    document.getElementById("phoneNumber").value="";
    document.getElementById("vehicleType").value="";
    document.getElementById("slotNumber").value="";

    displaySlots();

    success.style.color="green";

    success.innerHTML="✅ Parking Slot Reserved Successfully";

    setTimeout(function(){

        success.innerHTML="";

    },2500);

}

// ======================================
// REMOVE VEHICLE
// ======================================

function removeVehicle(id) {

    let slots = JSON.parse(localStorage.getItem("parkingSlots")) || [];

    let slot = slots.find(s => s.id === id);

    if (!slot) return;

    let exitTime = new Date().toLocaleString();
    let exitTimestamp = Date.now();

    let hours = Math.max(
        1,
        Math.ceil((exitTimestamp - slot.entryTimestamp) / (1000 * 60 * 60))
    );

    let fee = hours * 50;

    let totalRevenue = Number(localStorage.getItem("totalRevenue")) || 0;

    totalRevenue += fee;

    localStorage.setItem("totalRevenue", totalRevenue);

    let receipt = `
<html>

<head>

<title>Smart Parking Reservation System</title>

<style>

body{

font-family:Arial,sans-serif;

padding:20px;

}

h2{

text-align:center;

color:#1565C0;

}

table{

width:100%;

border-collapse:collapse;

margin-top:20px;

}

td{

border:1px solid #000;

padding:10px;

}

h3{

text-align:center;

color:green;

}

</style>

</head>

<body>

<h2>🚗 Smart Parking Reservation System</h2>

<h3>Parking Receipt</h3>

<table>

<tr>
<td>Vehicle Number</td>
<td>${slot.vehicleNumber}</td>
</tr>

<tr>
<td>Customer Name</td>
<td>${slot.ownerName}</td>
</tr>

<tr>
<td>Mobile Number</td>
<td>${slot.phoneNumber || "-"}</td>
</tr>

<tr>
<td>Vehicle Type</td>
<td>${slot.vehicleType}</td>
</tr>

<tr>
<td>Slot Number</td>
<td>${slot.id}</td>
</tr>

<tr>
<td>Entry Time</td>
<td>${slot.entryTime}</td>
</tr>

<tr>
<td>Exit Time</td>
<td>${exitTime}</td>
</tr>

<tr>
<td>Total Hours</td>
<td>${hours}</td>
</tr>

<tr>
<td><b>Parking Fee</b></td>
<td><b>₹${fee}</b></td>
</tr>

</table>

<br>

<h3>Thank You! Visit Again 🚗</h3>

</body>

</html>

`;

    let printWindow = window.open("", "", "width=700,height=700");

    printWindow.document.write(receipt);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();

    // Reset Slot

    slot.occupied = false;
    slot.vehicleNumber = "";
    slot.ownerName = "";
    slot.phoneNumber = "";
    slot.vehicleType = "";
    slot.entryTime = "";
    slot.entryTimestamp = 0;
    slot.exitTime = "";

    localStorage.setItem("parkingSlots", JSON.stringify(slots));

    displaySlots();

    let result = document.getElementById("searchResult");

    if (result) {

        result.style.display = "none";
        result.innerHTML = "";

    }

}

// ======================================
// SEARCH VEHICLE
// ======================================

function searchVehicle() {

    let vehicle = document
        .getElementById("searchVehicle")
        .value
        .trim()
        .toUpperCase();

    let searchError = document.getElementById("searchError");
    let result = document.getElementById("searchResult");

    searchError.innerHTML = "";
    result.style.display = "none";

    if (vehicle === "") {

        searchError.innerHTML = "Enter Vehicle Number";

        return;

    }

    let slots = JSON.parse(localStorage.getItem("parkingSlots")) || [];

    let found = slots.find(slot =>

        slot.occupied &&
        slot.vehicleNumber === vehicle

    );

    result.style.display = "block";

    if (found) {

        let icon = "🚗";

        if (found.vehicleType === "Bike") icon = "🏍";
        if (found.vehicleType === "Car") icon = "🚗";
        if (found.vehicleType === "Van") icon = "🚐";
        if (found.vehicleType === "Truck") icon = "🚚";

        result.innerHTML = `

            <h3 style="color:green;">✅ Vehicle Found</h3>

            <p><b>🅿️ Slot :</b> ${found.id}</p>

            <p><b>${icon} Vehicle :</b> ${found.vehicleNumber}</p>

            <p><b>👤 Customer :</b> ${found.ownerName}</p>

            <p><b>📱 Mobile :</b> ${found.phoneNumber || "-"}</p>

            <p><b>🚘 Type :</b> ${found.vehicleType}</p>

            <p><b>🕒 Entry Time :</b> ${found.entryTime}</p>

        `;

    }

    else {

        result.innerHTML = `

            <h3 style="color:red;">

                ❌ Vehicle Not Found

            </h3>

        `;

    }

}

// ======================================
// RESET PARKING
// ======================================

function resetParking() {

    if (!confirm("Do you want to reset all parking slots?")) {

        return;

    }

    let slots = [];

    for (let i = 1; i <= 20; i++) {

        slots.push({

            id: i,
            occupied: false,
            vehicleNumber: "",
            ownerName: "",
            phoneNumber: "",
            vehicleType: "",
            entryTime: "",
            entryTimestamp: 0,
            exitTime: ""

        });

    }

    localStorage.setItem("parkingSlots", JSON.stringify(slots));
    localStorage.setItem("totalRevenue", "0");

    // Clear Search

    let result = document.getElementById("searchResult");

    if (result) {

        result.style.display = "none";
        result.innerHTML = "";

    }

    // Clear Search Box

    document.getElementById("searchVehicle").value = "";

    // Clear Reservation Form

    document.getElementById("vehicleNumber").value = "";
    document.getElementById("ownerName").value = "";

    let phone = document.getElementById("phoneNumber");

    if (phone) {

        phone.value = "";

    }

    document.getElementById("vehicleType").value = "";

    let slot = document.getElementById("slotNumber");

    if (slot) {

        slot.value = "";

    }

    // Clear Error Messages

    let ids = [

        "vehicleError",
        "ownerError",
        "phoneError",
        "typeError",
        "slotError",
        "successMessage",
        "searchError"

    ];

    ids.forEach(id => {

        let element = document.getElementById(id);

        if (element) {

            element.innerHTML = "";

        }

    });

    displaySlots();

    alert("✅ Smart Parking Reservation System Reset Successfully");

}

// ======================================
// DARK MODE
// ======================================

function toggleDarkMode() {

    document.body.classList.toggle("dark-mode");

    localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark-mode")
    );

}

// ======================================
// PAGE LOAD
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    if (localStorage.getItem("darkMode") === "true") {

        document.body.classList.add("dark-mode");

    }

    if (document.getElementById("currentDateTime")) {

        updateDateTime();

    }

});

// ======================================
// AUTO UPDATE DASHBOARD
// ======================================

setInterval(function () {

    if (document.getElementById("occupiedSlots")) {

        let slots = JSON.parse(localStorage.getItem("parkingSlots")) || [];

        let occupied = slots.filter(slot => slot.occupied).length;

        let available = 20 - occupied;

        document.getElementById("occupiedSlots").innerHTML = occupied;
        document.getElementById("availableSlots").innerHTML = available;
        document.getElementById("totalSlots").innerHTML = 20;
        let revenue = Number(localStorage.getItem("totalRevenue")) || 0;

        let revenueCard = document.getElementById("totalRevenue");

        if (revenueCard) {

        revenueCard.innerHTML = "₹" + revenue;

       }

    }

}, 1000);

// ======================================
// ENTER KEY SUPPORT
// ======================================

document.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        if (document.getElementById("username")) {

            login();

        }

    }

});

// ======================================
// LIVE INPUT VALIDATIONS
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    // Vehicle Number Validation
    const vehicleInput = document.getElementById("vehicleNumber");

    if (vehicleInput) {

        vehicleInput.addEventListener("input", function () {

            this.value = this.value.toUpperCase();
            this.value = this.value.replace(/[^A-Z0-9]/g, "");

            const error = document.getElementById("vehicleError");

            if (!error) return;

            const value = this.value;

            if (value === "") {

                error.innerHTML = "";
                return;

            }

            const regex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;

            if (regex.test(value)) {

                error.style.color = "green";
                error.innerHTML = "✓ Valid Vehicle Number";

            } else {

                error.style.color = "red";
                error.innerHTML = "Example: TN12AB1234";

            }

        });

    }

    // Owner Name Validation
    const ownerInput = document.getElementById("ownerName");

    if (ownerInput) {

        ownerInput.addEventListener("input", function () {

            this.value = this.value.replace(/[^A-Za-z ]/g, "");

            const error = document.getElementById("ownerError");

            if (!error) return;

            if (this.value.length === 0) {

                error.innerHTML = "";

            } else if (this.value.length < 3) {

                error.style.color = "red";
                error.innerHTML = "Minimum 3 letters";

            } else {

                error.style.color = "green";
                error.innerHTML = "✓ Valid Name";

            }

        });

    }

});

// ======================================
// PROJECT READY
// ======================================

console.log("🚗 Parking Slot Management System Loaded Successfully");

// ======================================
// USER REGISTRATION
// ======================================

function registerUser() {

    let name = document.getElementById("regName").value.trim();
    let email = document.getElementById("regEmail").value.trim().toLowerCase();
    let phone = document.getElementById("regPhone").value.trim();
    let vehicle = document.getElementById("regVehicle").value.trim().toUpperCase();
    let password = document.getElementById("regPassword").value.trim();

    document.getElementById("regNameError").innerHTML = "";
    document.getElementById("regEmailError").innerHTML = "";
    document.getElementById("regPhoneError").innerHTML = "";
    document.getElementById("regVehicleError").innerHTML = "";
    document.getElementById("regPasswordError").innerHTML = "";
    document.getElementById("registerMessage").innerHTML = "";

    let valid = true;

    if (name === "") {

        document.getElementById("regNameError").innerHTML = "Enter Full Name";

        valid = false;

    }

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        document.getElementById("regEmailError").innerHTML = "Enter Valid Email";

        valid = false;

    }

    let phonePattern = /^[6-9][0-9]{9}$/;

    if (!phonePattern.test(phone)) {

        document.getElementById("regPhoneError").innerHTML = "Enter Valid Mobile Number";

        valid = false;

    }

    let vehiclePattern = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;

    if (!vehiclePattern.test(vehicle)) {

        document.getElementById("regVehicleError").innerHTML = "Example : TN72AB1234";

        valid = false;

    }

    if (password.length < 6) {

        document.getElementById("regPasswordError").innerHTML = "Minimum 6 Characters";

        valid = false;

    }

    if (!valid) return;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let emailExists = users.find(user => user.email === email);

    if (emailExists) {

        document.getElementById("regEmailError").innerHTML = "Email Already Registered";

        return;

    }

    users.push({

        name: name,
        email: email,
        phone: phone,
        vehicle: vehicle,
        password: password,
        reservationStatus: "Not Reserved",
        reservedSlot: ""

    });

    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById("registerMessage").style.color = "lightgreen";
    document.getElementById("registerMessage").innerHTML = "✅ Registration Successful";

    setTimeout(function () {

        window.location.href = "user-login.html";

    }, 1500);

}

// Auto Uppercase Vehicle Number
let vehicleInput = document.getElementById("vehicleNumber");

if(vehicleInput){

    vehicleInput.addEventListener("input",function(){

        this.value = this.value.toUpperCase();
        this.value = this.value.replace(/[^A-Z0-9]/g, "");

    });

}

// Allow Only Letters in Owner Name
let ownerInput = document.getElementById("ownerName");

if(ownerInput){

    ownerInput.addEventListener("input",function(){

        this.value=this.value.replace(/[^A-Za-z ]/g,"");

    });

}

// ======================================
// USER LOGIN
// ======================================

function userLogin() {

    let email = document.getElementById("userEmail").value.trim().toLowerCase();
    let password = document.getElementById("userPassword").value.trim();

    document.getElementById("userEmailError").innerHTML = "";
    document.getElementById("userPasswordError").innerHTML = "";
    document.getElementById("userLoginMessage").innerHTML = "";

    if(email===""){

        document.getElementById("userEmailError").innerHTML="Enter Email";

        return;

    }

    if(password===""){

        document.getElementById("userPasswordError").innerHTML="Enter Password";

        return;

    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(u =>

        u.email===email &&
        u.password===password

    );

    if(!user){

        document.getElementById("userLoginMessage").style.color="yellow";

        document.getElementById("userLoginMessage").innerHTML="❌ Invalid Email or Password";

        return;

    }

    localStorage.setItem("loggedUser",JSON.stringify(user));

    window.location.href="user-dashboard.html";

}

// ======================================
// USER DASHBOARD
// ======================================

function loadUserDashboard(){

    let user = JSON.parse(localStorage.getItem("loggedUser"));

    if(!user){

        window.location.href="user-login.html";

        return;

    }

    updateDateTime();

    document.getElementById("welcomeUser").innerHTML =
    "👋 Welcome " + user.name;

    document.getElementById("userVehicle").innerHTML =
    user.vehicle;

    document.getElementById("userPhone").innerHTML =
    user.phone;

    document.getElementById("userEmail").innerHTML =
    user.email;

    document.getElementById("reservationStatus").innerHTML =
    loggedUser.reservationStatus;

}

// ======================================
// USER LOGOUT
// ======================================

function userLogout(){

    localStorage.removeItem("loggedUser");

    window.location.href="user-login.html";

}

// ======================================
// LOAD USER RESERVATION PAGE
// ======================================

function loadReservationPage(){

    let user = JSON.parse(localStorage.getItem("loggedUser"));

    if(!user){

        window.location.href="user-login.html";

        return;

    }

    updateDateTime();

    document.getElementById("userName").value = user.name;

    document.getElementById("userVehicle").value = user.vehicle;

    document.getElementById("userPhone").value = user.phone;

}

// ======================================
// USER RESERVE SLOT
// ======================================

function reserveUserSlot(){

    let user = JSON.parse(localStorage.getItem("loggedUser"));

    let vehicleType = document.getElementById("userVehicleType").value;

    let slotNumber = document.getElementById("userSlot").value;

    let message = document.getElementById("reserveMessage");

    message.innerHTML="";

    if(vehicleType===""){

        message.style.color="red";
        message.innerHTML="Select Vehicle Type";
        return;

    }

    if(slotNumber===""){

        message.style.color="red";
        message.innerHTML="Select Parking Slot";
        return;

    }

    let requests =
        JSON.parse(localStorage.getItem("pendingReservations")) || [];

    let already = requests.find(r=>r.email===user.email);

    if(already){

        message.style.color="red";
        message.innerHTML="You already have a pending request";
        return;

    }

    requests.push({

        name:user.name,
        email:user.email,
        phone:user.phone,
        vehicle:user.vehicle,
        vehicleType:vehicleType,
        slotNumber:slotNumber,
        status:"Pending"

    });

    localStorage.setItem(
        "pendingReservations",
        JSON.stringify(requests)
    );

    let users =
        JSON.parse(localStorage.getItem("users")) || [];

    let current =
        users.find(u=>u.email===user.email);

    current.reservationStatus="Pending";
    current.reservedSlot=slotNumber;

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    localStorage.setItem(
        "loggedUser",
        JSON.stringify(current)
    );

    message.style.color="green";
    message.innerHTML="✅ Reservation Request Sent";

    setTimeout(function(){

        window.location.href="user-dashboard.html";

    },1500);

}

// ======================================
// LOAD PENDING RESERVATIONS
// ======================================

function loadPendingReservations(){

    let container=document.getElementById("pendingReservations");

    if(!container) return;

    let requests=JSON.parse(localStorage.getItem("pendingReservations")) || [];

    if(requests.length===0){

        container.innerHTML="<p>No Pending Requests</p>";
        return;

    }

    container.innerHTML="";

    requests.forEach((r,index)=>{

        container.innerHTML+=`

        <div class="search-result" style="display:block;margin-bottom:15px;">

            <p><b>Name :</b> ${r.name}</p>
            <p><b>Vehicle :</b> ${r.vehicle}</p>
            <p><b>Type :</b> ${r.vehicleType}</p>
            <p><b>Slot :</b> ${r.slotNumber}</p>

            <button onclick="approveReservation(${index})">
            ✅ Approve
            </button>

            <button
            class="reset-btn"
            style="margin-top:8px;"
            onclick="rejectReservation(${index})">

            ❌ Reject

            </button>

        </div>

        `;

    });

}

// ======================================
// APPROVE RESERVATION
// ======================================

function approveReservation(index){

    let requests=JSON.parse(localStorage.getItem("pendingReservations")) || [];

    let request=requests[index];

    let slots=JSON.parse(localStorage.getItem("parkingSlots")) || [];

    let slot=slots.find(s=>s.id==request.slotNumber);

    if(slot.occupied){

        alert("Slot already occupied");
        return;

    }

    slot.occupied=true;
    slot.vehicleNumber=request.vehicle;
    slot.ownerName=request.name;
    slot.vehicleType=request.vehicleType;
    slot.phoneNumber=request.phone;
    slot.entryTime=new Date().toLocaleString();
    slot.entryTimestamp=Date.now();

    localStorage.setItem("parkingSlots",JSON.stringify(slots));

    let users=JSON.parse(localStorage.getItem("users")) || [];

    let user=users.find(u=>u.email===request.email);

    if(user){

        user.reservationStatus="Approved";

    }

    localStorage.setItem("users",JSON.stringify(users));

    requests.splice(index,1);

    localStorage.setItem(
        "pendingReservations",
        JSON.stringify(requests)
    );

    displaySlots();

    loadPendingReservations();

    alert("Reservation Approved");

}

// ======================================
// REJECT RESERVATION
// ======================================

function rejectReservation(index){

    let requests=JSON.parse(localStorage.getItem("pendingReservations")) || [];

    let request=requests[index];

    let users=JSON.parse(localStorage.getItem("users")) || [];

    let user=users.find(u=>u.email===request.email);

    if(user){

        user.reservationStatus="Rejected";

        user.reservedSlot="";

    }

    localStorage.setItem("users",JSON.stringify(users));

    requests.splice(index,1);

    localStorage.setItem(
        "pendingReservations",
        JSON.stringify(requests)
    );

    loadPendingReservations();

    alert("Reservation Rejected");

}