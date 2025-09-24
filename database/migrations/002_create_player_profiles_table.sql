-- Migration: Create Player Profiles Table
-- Created: 2024-01-01
-- Description: Creates the PlayerProfiles table with player-specific information

CREATE TABLE IF NOT EXISTS PlayerProfiles (
    player_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    age INT,
    height_cm INT,
    weight_kg INT,
    position VARCHAR(50),
    preferred_foot ENUM('Left','Right','Both'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_position (position),
    INDEX idx_age (age)
);

