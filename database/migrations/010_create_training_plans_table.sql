-- Migration: Create Training Plans Table
-- Created: 2024-01-01
-- Description: Creates the TrainingPlans table for coach training programs

CREATE TABLE IF NOT EXISTS TrainingPlans (
    plan_id INT PRIMARY KEY AUTO_INCREMENT,
    coach_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    video_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (coach_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX idx_coach_id (coach_id),
    INDEX idx_created_at (created_at)
);

