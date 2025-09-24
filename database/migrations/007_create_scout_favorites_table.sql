-- Migration: Create Scout Favorites Table
-- Created: 2024-01-01
-- Description: Creates the ScoutFavorites table for scout player bookmarks

CREATE TABLE IF NOT EXISTS ScoutFavorites (
    favorite_id INT PRIMARY KEY AUTO_INCREMENT,
    scout_id INT NOT NULL,
    player_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (scout_id) REFERENCES Scouts(scout_id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES PlayerProfiles(player_id) ON DELETE CASCADE,
    UNIQUE KEY unique_scout_player (scout_id, player_id),
    INDEX idx_scout_id (scout_id),
    INDEX idx_player_id (player_id),
    INDEX idx_added_at (added_at)
);

