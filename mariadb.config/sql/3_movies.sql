
CREATE TABLE `movies` (
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `info_hash` VARCHAR(40) NOT NULL,
    `imdb_code` CHAR(20)  NOT NULL, 
    `name` CHAR(100) NOT NULL,
    `size` BIGINT UNSIGNED NOT NULL,
    `path` CHAR(200) NOT NULL, 
    `path_folfer` CHAR(100) NOT NULL, 
    `type` ENUM('movie', 'vtt') NOT NULL,
    `lastView` DATETIME(0) NOT NULL DEFAULT NOW(),
    `status` ENUM('downloading', 'downloaded') NOT NULL
);