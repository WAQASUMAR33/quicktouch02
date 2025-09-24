-- Migration: Create Events Table
-- Created: 2024-01-01
-- Description: Creates the Events table for academy calendar and events

CREATE TABLE IF NOT EXISTS Events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    type ENUM('training','match','trial','showcase') NOT NULL,
    event_date DATETIME NOT NULL,
    location VARCHAR(150),
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX idx_event_date (event_date),
    INDEX idx_type (type),
    INDEX idx_created_by (created_by)
);

