-- Create test academy with your credentials
-- Run this SQL script in your MySQL database

-- Password: 786ninja
-- Hashed with bcrypt (10 rounds): $2b$10$6N8.CY5YBz9xN6H6fPJ7XO9/kV7aHnJbxZ0PZ7F4qK8jQz7n8FqYu

INSERT INTO Academies (
    name,
    email,
    password,
    phone,
    address,
    description,
    website,
    email_verified,
    is_active,
    created_at,
    updated_at
) VALUES (
    'Test Academy',
    'dilwaq22@gmail.com',
    '$2b$10$6N8.CY5YBz9xN6H6fPJ7XO9/kV7aHnJbxZ0PZ7F4qK8jQz7n8FqYu',
    '+1234567890',
    '123 Test Street',
    'Test Academy for development',
    'https://testacademy.com',
    TRUE,
    TRUE,
    NOW(),
    NOW()
);

-- Verify the academy was created
SELECT 
    academy_id,
    name,
    email,
    email_verified,
    is_active,
    created_at
FROM Academies
WHERE email = 'dilwaq22@gmail.com';

