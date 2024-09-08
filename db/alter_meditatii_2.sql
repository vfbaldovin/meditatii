use meditatii;
CREATE TABLE subject_category (
                                  id INT AUTO_INCREMENT PRIMARY KEY,
                                  name VARCHAR(255) NOT NULL
);

CREATE TABLE subject (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         name VARCHAR(255) NOT NULL,
                         subject_category_id INT,
                         FOREIGN KEY (subject_category_id) REFERENCES subject_category(id)
);

INSERT INTO subject_category (name) VALUES ('Științe reale');
INSERT INTO subject_category (name) VALUES ('Științe umane');
INSERT INTO subject_category (name) VALUES ('Științe naturale');
INSERT INTO subject_category (name) VALUES ('Limbă și literatură');
INSERT INTO subject_category (name) VALUES ('Limbi străine');
INSERT INTO subject_category (name) VALUES ('Artă');
INSERT INTO subject_category (name) VALUES ('Muzică');
INSERT INTO subject_category (name) VALUES ('Sport și Educație Fizică');
INSERT INTO subject_category (name) VALUES ('Alte materii');


INSERT INTO subject (name, subject_category_id) VALUES ('Anatomie', 1);
INSERT INTO subject (name, subject_category_id) VALUES ('Chimie', 1);
INSERT INTO subject (name, subject_category_id) VALUES ('Contabilitate', 1);
INSERT INTO subject (name, subject_category_id) VALUES ('Economie', 1);
INSERT INTO subject (name, subject_category_id) VALUES ('Fizică', 1);
INSERT INTO subject (name, subject_category_id) VALUES ('Informatică', 1);
INSERT INTO subject (name, subject_category_id) VALUES ('Logică', 1);
INSERT INTO subject (name, subject_category_id) VALUES ('Matematică', 1);
INSERT INTO subject (name, subject_category_id) VALUES ('Programare', 1);

INSERT INTO subject (name, subject_category_id) VALUES ('Cultură civică', 2);
INSERT INTO subject (name, subject_category_id) VALUES ('Filosofie', 2);
INSERT INTO subject (name, subject_category_id) VALUES ('Istorie', 2);
INSERT INTO subject (name, subject_category_id) VALUES ('Psihologie', 2);
INSERT INTO subject (name, subject_category_id) VALUES ('Sociologie', 2);
INSERT INTO subject (name, subject_category_id) VALUES ('Drept', 2);
INSERT INTO subject (name, subject_category_id) VALUES ('Medicină', 2);

INSERT INTO subject (name, subject_category_id) VALUES ('Astronomie', 3);
INSERT INTO subject (name, subject_category_id) VALUES ('Biologie', 3);
INSERT INTO subject (name, subject_category_id) VALUES ('Geografie', 3);
INSERT INTO subject (name, subject_category_id) VALUES ('Geologie', 3);
INSERT INTO subject (name, subject_category_id) VALUES ('Ecologie', 3);

INSERT INTO subject (name, subject_category_id) VALUES ('Limbă latină', 4);
INSERT INTO subject (name, subject_category_id) VALUES ('Limbă și literatură maghiară', 4);
INSERT INTO subject (name, subject_category_id) VALUES ('Limbă și literatură română', 4);
INSERT INTO subject (name, subject_category_id) VALUES ('Literatură universală', 4);

INSERT INTO subject (name, subject_category_id) VALUES ('Limba arabă', 5);
INSERT INTO subject (name, subject_category_id) VALUES ('Limba chineză', 5);
INSERT INTO subject (name, subject_category_id) VALUES ('Limba coreeană', 5);
INSERT INTO subject (name, subject_category_id) VALUES ('Limba ebraică', 5);
INSERT INTO subject (name, subject_category_id) VALUES ('Limba engleză', 5);
INSERT INTO subject (name, subject_category_id) VALUES ('Limba finlandeză', 5);
INSERT INTO subject (name, subject_category_id) VALUES ('Limba franceză', 5);
INSERT INTO subject (name, subject_category_id) VALUES ('Limba germană', 5);
INSERT INTO subject (name, subject_category_id) VALUES ('Limba greacă', 5);
INSERT INTO subject (name, subject_category_id) VALUES ('Limba italiană', 5);
INSERT INTO subject (name, subject_category_id) VALUES ('Limba japoneză', 5);
INSERT INTO subject (name, subject_category_id) VALUES ('Limba maghiară', 5);
INSERT INTO subject (name, subject_category_id) VALUES ('Limba norvegiană', 5);
INSERT INTO subject (name, subject_category_id) VALUES ('Limba olandeză', 5);
INSERT INTO subject (name, subject_category_id) VALUES ('Limba portugheză', 5);
INSERT INTO subject (name, subject_category_id) VALUES ('Limba rusă', 5);
INSERT INTO subject (name, subject_category_id) VALUES ('Limba spaniolă', 5);
INSERT INTO subject (name, subject_category_id) VALUES ('Limba suedeză', 5);
INSERT INTO subject (name, subject_category_id) VALUES ('Limba turcă', 5);
INSERT INTO subject (name, subject_category_id) VALUES ('Limba hindi', 5);

INSERT INTO subject (name, subject_category_id) VALUES ('Arhitectură', 6);
INSERT INTO subject (name, subject_category_id) VALUES ('Desen', 6);
INSERT INTO subject (name, subject_category_id) VALUES ('Educație artistică', 6);
INSERT INTO subject (name, subject_category_id) VALUES ('Educație plastică', 6);
INSERT INTO subject (name, subject_category_id) VALUES ('Fotografie', 6);
INSERT INTO subject (name, subject_category_id) VALUES ('Istoria artelor', 6);
INSERT INTO subject (name, subject_category_id) VALUES ('Pictură', 6);
INSERT INTO subject (name, subject_category_id) VALUES ('Sculptură', 6);
INSERT INTO subject (name, subject_category_id) VALUES ('Teatru și film', 6);

INSERT INTO subject (name, subject_category_id) VALUES ('Canto', 7);
INSERT INTO subject (name, subject_category_id) VALUES ('Chitară', 7);
INSERT INTO subject (name, subject_category_id) VALUES ('Istoria muzicii', 7);
INSERT INTO subject (name, subject_category_id) VALUES ('Pian', 7);
INSERT INTO subject (name, subject_category_id) VALUES ('Teoria muzicii', 7);
INSERT INTO subject (name, subject_category_id) VALUES ('Trompetă', 7);
INSERT INTO subject (name, subject_category_id) VALUES ('Tobe', 7);
INSERT INTO subject (name, subject_category_id) VALUES ('Vioară', 7);
INSERT INTO subject (name, subject_category_id) VALUES ('Alte instrumente', 7);

INSERT INTO subject (name, subject_category_id) VALUES ('Fitness', 8);
INSERT INTO subject (name, subject_category_id) VALUES ('Tenis', 8);
INSERT INTO subject (name, subject_category_id) VALUES ('Dans', 8);
INSERT INTO subject (name, subject_category_id) VALUES ('Fotbal', 8);
INSERT INTO subject (name, subject_category_id) VALUES ('Baschet', 8);
INSERT INTO subject (name, subject_category_id) VALUES ('Volei', 8);
INSERT INTO subject (name, subject_category_id) VALUES ('Înot', 8);
INSERT INTO subject (name, subject_category_id) VALUES ('Yoga', 8);


INSERT INTO subject (name, subject_category_id) VALUES ('Alte materii', 9);


ALTER TABLE listing
    ADD COLUMN subject_id INT;

ALTER TABLE listing
    ADD FOREIGN KEY (subject_id) REFERENCES subject(id);



UPDATE listing a set a.subject = 'Tobe' where a.subject = 'Toba';

UPDATE listing a
    JOIN subject s ON a.subject = REPLACE(
    REPLACE(
    REPLACE(
    REPLACE(
    REPLACE(
    REPLACE(
    REPLACE(
    REPLACE(
    s.name,
    'ă', 'a'),
    'â', 'a'),
    'î', 'i'),
    'ț', 't'),
    'ș', 's'),
    'Ă', 'A'),
    'Â', 'A'),
    'Î', 'I')
    SET a.subject_id = s.id;

update subject set name ='Limba și literatura maghiară' where name ='Limbă și literatură maghiară';
update subject set name ='Limba și literatura română' where name ='Limbă și literatură română';