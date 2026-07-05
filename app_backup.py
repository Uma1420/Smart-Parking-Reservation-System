from flask import Flask, render_template, request, redirect, url_for, flash
from database import connection, cursor

app = Flask(__name__, template_folder=".", static_folder=".", static_url_path="")
app.secret_key = "smartparking123"

# -------------------- HOME --------------------

@app.route("/")
def home():
    return redirect(url_for("admin_login"))


# -------------------- ADMIN LOGIN --------------------

@app.route("/login", methods=["GET", "POST"])
def admin_login():

    if request.method == "POST":

        username = request.form["username"]
        password = request.form["password"]

        # Default Admin
        if username == "admin" and password == "1234":
            return redirect(url_for("dashboard"))

        flash("Invalid Admin Username or Password")
        return redirect(url_for("admin_login"))

    return render_template("login.html")


# -------------------- USER REGISTER --------------------

@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        name = request.form["name"]
        email = request.form["email"]
        phone = request.form["phone"]
        vehicle = request.form["vehicle"]
        password = request.form["password"]

        sql = """
        INSERT INTO users
        (name,email,phone,vehicle_number,password,role)
        VALUES (%s,%s,%s,%s,%s,%s)
        """

        values = (
            name,
            email,
            phone,
            vehicle,
            password,
            "user"
        )

        cursor.execute(sql, values)
        connection.commit()

        flash("Registration Successful")
        return redirect(url_for("user_login"))

    return render_template("register.html")


# -------------------- USER LOGIN --------------------

@app.route("/user-login", methods=["GET", "POST"])
def user_login():

    if request.method == "POST":

        email = request.form["email"]
        password = request.form["password"]

        sql = """
        SELECT *
        FROM users
        WHERE email=%s
        AND password=%s
        """

        cursor.execute(sql, (email, password))
        user = cursor.fetchone()

        if user:
            return redirect(url_for("user_dashboard"))

        flash("Invalid Email or Password")
        return redirect(url_for("user_login"))

    return render_template("user-login.html")


# -------------------- ADMIN DASHBOARD --------------------

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


# -------------------- ADMIN PARKING --------------------

@app.route("/parking")
def parking():
    return render_template("parking.html")


# -------------------- USER DASHBOARD --------------------

@app.route("/user-dashboard")
def user_dashboard():
    return render_template("user-dashboard.html")


# -------------------- USER PARKING --------------------

@app.route("/user-parking")
def user_parking():
    return render_template("user-parking.html")


# -------------------- USER RESERVATION --------------------

@app.route("/user-reservation")
def user_reservation():
    return render_template("user-reservation.html")


# -------------------- LOGOUT --------------------

@app.route("/logout")
def logout():
    return redirect(url_for("home"))


# -------------------- START APP --------------------

if __name__ == "__main__":
    app.run(debug=True)