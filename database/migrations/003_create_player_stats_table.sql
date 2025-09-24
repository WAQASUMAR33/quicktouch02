-- Migration: Create Player Stats Table
-- Created: 2024-01-01
-- Description: Creates the PlayerStats table for tracking player performance

CREATE TABLE IF NOT EXISTS PlayerStats (
    stat_id INT PRIMARY KEY AUTO_INCREMENT,
    player_id INT NOT NULL,
    season VARCHAR(20),
    matches_played INT DEFAULT 0,
    goals INT DEFAULT 0,
    assists INT DEFAULT 0,
    minutes_played INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (player_id) REFERENCES PlayerProfiles(player_id) ON DELETE CASCADE,
    INDEX idx_player_id (player_id),
    INDEX idx_season (season),
    UNIQUE KEY unique_player_season (player_id, season)
);

