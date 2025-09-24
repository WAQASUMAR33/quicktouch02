-- Migration: Create Highlight Videos Table
-- Created: 2024-01-01
-- Description: Creates the HighlightVideos table for storing player highlight videos

CREATE TABLE IF NOT EXISTS HighlightVideos (
    video_id INT PRIMARY KEY AUTO_INCREMENT,
    player_id INT NOT NULL,
    video_url VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (player_id) REFERENCES PlayerProfiles(player_id) ON DELETE CASCADE,
    INDEX idx_player_id (player_id),
    INDEX idx_uploaded_at (uploaded_at)
);

