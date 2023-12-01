-- Add new columns to meditatii.user table
ALTER TABLE meditatii.user
    ADD COLUMN password char(68) COLLATE utf8_romanian_ci,
ADD COLUMN enabled tinyint(1),
ADD COLUMN reset_token char(36) COLLATE utf8_romanian_ci,
ADD COLUMN expiry_date date COLLATE utf8_romanian_ci;

-- Update meditatii.user table with data from security.users
UPDATE meditatii.user u
    JOIN security.users s ON u.Email = s.username
    SET u.password = s.password,
        u.enabled = s.enabled;


--alter names in english
ALTER TABLE meditatii.anunt
    CHANGE `id_user` `user_id` int NOT NULL,
    CHANGE `materie` `subject` varchar(50) NOT NULL,
    CHANGE `titlu` `title` varchar(70) NOT NULL,
    CHANGE `descriere` `description` varchar(5000) NOT NULL,
    CHANGE `durata_sedinta` `session_duration` varchar(40) NOT NULL,
    CHANGE `data_anunt` `created_date` datetime DEFAULT NULL,
    CHANGE `pret` `price` int NOT NULL,
    CHANGE `judet` `county` varchar(30) NOT NULL,
    CHANGE `oras` `city` varchar(30) NOT NULL,
    CHANGE `zona` `area` varchar(300) DEFAULT NULL,
    CHANGE `experienta` `experience` varchar(40) NOT NULL,
    CHANGE `online` `is_online` tinyint(1) DEFAULT NULL,
    CHANGE `domiciliu_elev` `student_home` tinyint(1) DEFAULT NULL,
    CHANGE `DomiciliuMeditator` `tutor_home` tinyint(1) DEFAULT NULL,
    CHANGE `vizualizariAnunt` `announcement_views` int DEFAULT NULL,
    CHANGE `promovat` `promoted` tinyint(1) DEFAULT NULL,
    CHANGE `data_promovare` `promotion_date` datetime DEFAULT NULL,
    CHANGE `data_expirare_promovare` `promotion_expiry_date` datetime DEFAULT NULL;



ALTER TABLE `meditatii`.`user`
    CHANGE `ID_user` `id` int NOT NULL AUTO_INCREMENT,
    CHANGE `Nume_user` `last_name` varchar(40) DEFAULT NULL,
    CHANGE `Prenume_user` `first_name` varchar(40) DEFAULT NULL,
    CHANGE `Numar_telefon` `phone` varchar(15) DEFAULT NULL,
    CHANGE `Email` `email` varchar(60) NOT NULL,
    CHANGE `dataNasterii` `date_of_birth` date DEFAULT NULL,
    CHANGE `Data_inscriere` `registration_date` date DEFAULT NULL,
    CHANGE `gender` `gender` varchar(10) DEFAULT NULL,
    CHANGE `ocupatie` `occupation` varchar(80) DEFAULT NULL,
    CHANGE `studii` `education` varchar(510) DEFAULT NULL,
    CHANGE `img` `image` longblob DEFAULT NULL,
    CHANGE `cuponAplicat` `coupon_applied` tinyint(1) DEFAULT NULL,
    CHANGE `password` `password` char(68) DEFAULT NULL,
    CHANGE `enabled` `enabled` tinyint(1) DEFAULT NULL,
    CHANGE `reset_token` `reset_token` char(36) DEFAULT NULL,
    CHANGE `expiry_date` `expiry_date` date DEFAULT NULL;

use meditatii;
RENAME TABLE `anunt` TO `announcement`;



