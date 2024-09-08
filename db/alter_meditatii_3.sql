use meditatii;

UPDATE listing
SET experience = '1-4'
WHERE experience IN ('mai putin de un an', 'un an', 'doi ani', 'trei ani', 'patru ani');

UPDATE listing
SET experience = '5+'
WHERE experience IN ('cinci ani', 'sase ani', 'sapte ani', 'opt ani', 'noua ani');

UPDATE listing
SET experience = '10+'
WHERE experience IN ('zece ani', 'cincisprezece ani', 'cincisprezece an');

UPDATE listing
SET experience = '20+'
WHERE experience IN ('douazeci de ani', 'douazeci si cinci de ani');

UPDATE listing
SET experience = '30+'
WHERE experience = 'mai mult de douazeci si cinci de ani';




ALTER TABLE user DROP COLUMN reset_token;
ALTER TABLE user DROP COLUMN expiry_date;

CREATE TABLE verification_token (
                       id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
                       token VARCHAR(255) NOT NULL,
                       user_id int(11) NOT NULL,
                       expiry_date datetime NOT NULL,
                       CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES user (id)
);


CREATE TABLE refresh_token (
                               id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
                               token VARCHAR(255),
                               created_date datetime NOT NULL
);

--
CREATE TABLE user_profile_image (
                                    user_id INT PRIMARY KEY,
                                    image LONGBLOB
);

INSERT INTO user_profile_image (user_id, image)
SELECT id, image FROM user
WHERE image IS NOT NULL;

ALTER TABLE user_profile_image
    ADD FOREIGN KEY (user_id) REFERENCES user(id);

ALTER TABLE user DROP COLUMN image;

ALTER TABLE listing
    ADD COLUMN refresh_date DATETIME DEFAULT CURRENT_TIMESTAMP;
