-- Migration: Create Player Reels Table
-- Created: 2024-01-01
-- Description: Creates the PlayerReels table for storing player video reels

CREATE TABLE IF NOT EXISTS PlayerReels (
    reel_id INT PRIMARY KEY AUTO_INCREMENT,
    player_id INT NOT NULL,
    academy_id INT NOT NULL,
    video_url VARCHAR(255) NOT NULL,
    title VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key constraints
    CONSTRAINT fk_player_reels_player
        FOREIGN KEY (player_id) REFERENCES PlayerProfiles(player_id) ON DELETE CASCADE,
    CONSTRAINT fk_player_reels_academy
        FOREIGN KEY (academy_id) REFERENCES Academies(academy_id) ON DELETE CASCADE,

    -- Indexes for better performance
    INDEX idx_player_reels_player_id (player_id),
    INDEX idx_player_reels_academy_id (academy_id),
    INDEX idx_player_reels_created_at (created_at)
);
