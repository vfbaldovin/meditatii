use meditatii;

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

-- Modify the 'county' column to be nullable
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


UPDATE listing
SET county = CASE
                 WHEN county = 'Alba' THEN 'Alba'
                 WHEN county = 'Arad' THEN 'Arad'
                 WHEN county = 'Arges' THEN 'Argeș'
                 WHEN county = 'Bacau' THEN 'Bacău'
                 WHEN county = 'Bihor' THEN 'Bihor'
                 WHEN county = 'Bistrita-Nasaud' THEN 'Bistrița-Năsăud'
                 WHEN county = 'Botosani' THEN 'Botoșani'
                 WHEN county = 'Braila' THEN 'Brăila'
                 WHEN county = 'Brasov' THEN 'Brașov'
                 WHEN county = 'Bucuresti' THEN 'București'
                 WHEN county = 'Buzau' THEN 'Buzău'
                 WHEN county = 'Calarasi' THEN 'Călărași'
                 WHEN county = 'Caras-Severin' THEN 'Caraș-Severin'
                 WHEN county = 'Cluj' THEN 'Cluj'
                 WHEN county = 'Constanta' THEN 'Constanța'
                 WHEN county = 'Covasna' THEN 'Covasna'
                 WHEN county = 'Dambovita' THEN 'Dâmbovița'
                 WHEN county = 'Dolj' THEN 'Dolj'
                 WHEN county = 'Galati' THEN 'Galați'
                 WHEN county = 'Giurgiu' THEN 'Giurgiu'
                 WHEN county = 'Gorj' THEN 'Gorj'
                 WHEN county = 'Harghita' THEN 'Harghita'
                 WHEN county = 'Hunedoara' THEN 'Hunedoara'
                 WHEN county = 'Ialomita' THEN 'Ialomița'
                 WHEN county = 'Iasi' THEN 'Iași'
                 WHEN county = 'Ilfov' THEN 'Ilfov'
                 WHEN county = 'Maramures' THEN 'Maramureș'
                 WHEN county = 'Mehedinti' THEN 'Mehedinți'
                 WHEN county = 'Mures' THEN 'Mureș'
                 WHEN county = 'Neamt' THEN 'Neamț'
                 WHEN county = 'Olt' THEN 'Olt'
                 WHEN county = 'Prahova' THEN 'Prahova'
                 WHEN county = 'Salaj' THEN 'Sălaj'
                 WHEN county = 'Satu Mare' THEN 'Satu Mare'
                 WHEN county = 'Sibiu' THEN 'Sibiu'
                 WHEN county = 'Suceava' THEN 'Suceava'
                 WHEN county = 'Teleorman' THEN 'Teleorman'
                 WHEN county = 'Timis' THEN 'Timiș'
                 WHEN county = 'Tulcea' THEN 'Tulcea'
                 WHEN county = 'Valcea' THEN 'Vâlcea'
                 WHEN county = 'Vaslui' THEN 'Vaslui'
                 WHEN county = 'Vrancea' THEN 'Vrancea'
    END;


ALTER TABLE user ADD COLUMN county VARCHAR(50) DEFAULT NULL;


UPDATE user u
    LEFT JOIN (
    SELECT user_id, county
    FROM listing
    WHERE county IS NOT NULL
    GROUP BY user_id
    ) l ON u.id = l.user_id
    SET u.county = COALESCE(l.county, 'București');
