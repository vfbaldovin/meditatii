ALTER TABLE user
    ADD COLUMN experience VARCHAR(50);

UPDATE user u
    LEFT JOIN listing l ON u.id = l.user_id
    SET u.experience = COALESCE(l.experience, '5');
