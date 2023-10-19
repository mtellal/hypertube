
CREATE TABLE `subtitles`(
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `imdb_code` CHAR(20)  NOT NULL, 
    `langage` CHAR(100) NOT NULL, 
    `path` CHAR(200) NOT NULL
);