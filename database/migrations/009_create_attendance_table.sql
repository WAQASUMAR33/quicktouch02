-- Migration: Create Attendance Table
-- Created: 2024-01-01
-- Description: Creates the Attendance table for tracking event attendance

CREATE TABLE IF NOT EXISTS Attendance (
    attendance_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    player_id INT NOT NULL,
    present BOOLEAN DEFAULT FALSE,
    performance_rating DECIMAL(3,2) CHECK (performance_rating >= 0 AND performance_rating <= 5),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (event_id) REFERENCES Events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES PlayerProfiles(player_id) ON DELETE CASCADE,
    UNIQUE KEY unique_event_player (event_id, player_id),
    INDEX idx_event_id (event_id),
    INDEX idx_player_id (player_id),
    INDEX idx_present (present)
);

