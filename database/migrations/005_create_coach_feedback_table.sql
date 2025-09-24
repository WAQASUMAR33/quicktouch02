-- Migration: Create Coach Feedback Table
-- Created: 2024-01-01
-- Description: Creates the CoachFeedback table for storing coach evaluations

CREATE TABLE IF NOT EXISTS CoachFeedback (
    feedback_id INT PRIMARY KEY AUTO_INCREMENT,
    player_id INT NOT NULL,
    coach_id INT NOT NULL,
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    notes TEXT,
    feedback_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (player_id) REFERENCES PlayerProfiles(player_id) ON DELETE CASCADE,
    FOREIGN KEY (coach_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX idx_player_id (player_id),
    INDEX idx_coach_id (coach_id),
    INDEX idx_feedback_date (feedback_date),
    INDEX idx_rating (rating)
);

