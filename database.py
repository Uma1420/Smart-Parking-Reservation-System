import mysql.connector

connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="RU_141220",
    database="smart_parking_db"
)

cursor = connection.cursor(dictionary=True)