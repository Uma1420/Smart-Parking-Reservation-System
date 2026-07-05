from flask import Flask, render_template, request, redirect, url_for
from database import connection, cursor

app = Flask(__name__, template_folder=".", static_url_path="", static_folder=".")

# -------------------- LOGIN --------------------

@app.route("/")
def login():
    return render_template("login.html")


# -------------------- REGISTER --------------------

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

        return redirect(url_for("login"))

    return render_template("register.html")


# -------------------- ADMIN DASHBOARD --------------------

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


# -------------------- ADMIN PARKING --------------------

@app.route("/parking")
def parking():
    return render_template("parking.html")


# -------------------- USER LOGIN --------------------

@app.route("/user-login")
def user_login():
    return render_template("user-login.html")


# -------------------- USER DASHBOARD --------------------

@app.route("/user-dashboard")
def user_dashboard():
    return render_template("user-dashboard.html")


# -------------------- USER RESERVATION --------------------

@app.route("/user-reservation")
def user_reservation():
    return render_template("user-reservation.html")


# -------------------- START APP --------------------

if __name__ == "__main__":
    app.run(debug=True)