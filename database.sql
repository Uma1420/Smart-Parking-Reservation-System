CREATE DATABASE smart_parking;

USE smart_parking;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    vehicle_number VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Parking Slots
CREATE TABLE parking_slots (
    slot_id INT AUTO_INCREMENT PRIMARY KEY,
    slot_number VARCHAR(20) NOT NULL,
    status ENUM('Available','Reserved','Occupied') DEFAULT 'Available'
);

-- Reservations
CREATE TABLE reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    slot_id INT,
    booking_date DATE,
    booking_time TIME,
    status ENUM('Reserved','Completed','Cancelled') DEFAULT 'Reserved',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (slot_id) REFERENCES parking_slots(slot_id)
);