ALTER TABLE user
    ADD COLUMN experience VARCHAR(50);

UPDATE user u
    LEFT JOIN listing l ON u.id = l.user_id
    SET u.experience = COALESCE(l.experience, '5');

-- Modify the 'title' column to be nullable
ALTER TABLE meditatii.listing
    MODIFY title VARCHAR(70) NULL;

-- Modify the 'session_duration' column to be nullable
ALTER TABLE meditatii.listing
    MODIFY session_duration VARCHAR(40) NULL;

-- Modify the 'county' column to be nullable
ALTER TABLE meditatii.listing
    MODIFY county VARCHAR(30) NULL;

-- Modify the 'city' column to be nullable
ALTER TABLE meditatii.listing
    MODIFY city VARCHAR(30) NULL;

-- Modify the 'experience' column to be nullable
ALTER TABLE meditatii.listing
    MODIFY experience VARCHAR(40) NULL;

-- Alter the 'subject' column to allow NULL values
ALTER TABLE meditatii.listing
    MODIFY subject VARCHAR(50) NULL;



ALTER TABLE user ADD COLUMN city VARCHAR(30);
UPDATE user u
    JOIN listing l ON u.id = l.user_id
    SET u.city = l.city
WHERE l.city IS NOT NULL;


ALTER TABLE listing DROP COLUMN city;
