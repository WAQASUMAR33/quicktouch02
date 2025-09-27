-- Migration: Update Training Plans Table
-- Created: 2024-01-01
-- Description: Updates the TrainingPlans table with new fields for enhanced training program management

-- Add new columns to TrainingPlans table
ALTER TABLE TrainingPlans 
ADD COLUMN academy_id INT NOT NULL AFTER coach_id,
ADD COLUMN title_type ENUM('Match', 'TrainingProgram', 'Drill') NOT NULL AFTER title,
ADD COLUMN venue VARCHAR(255) AFTER title_type,
ADD COLUMN program_date DATETIME AFTER venue,
ADD COLUMN program_time VARCHAR(20) AFTER program_date,
ADD COLUMN details TEXT AFTER program_time,
ADD COLUMN status ENUM('upcoming', 'Complete') DEFAULT 'upcoming' AFTER details;

-- Add foreign key constraint for academy_id
ALTER TABLE TrainingPlans 
ADD CONSTRAINT fk_training_plans_academy 
FOREIGN KEY (academy_id) REFERENCES Academies(academy_id) ON DELETE CASCADE;

-- Add indexes for better performance
ALTER TABLE TrainingPlans 
ADD INDEX idx_academy_id (academy_id),
ADD INDEX idx_title_type (title_type),
ADD INDEX idx_program_date (program_date),
ADD INDEX idx_status (status);

-- Update existing records (set a default academy_id - you may need to adjust this)
-- This is a temporary solution - in production, you should manually assign academy_ids
UPDATE TrainingPlans 
SET academy_id = 1, title_type = 'TrainingProgram', status = 'Complete' 
WHERE academy_id IS NULL OR academy_id = 0;
