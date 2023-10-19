--DROP TABLE IF EXISTS `comments`
CREATE TABLE `comments` (
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `userId` INT UNSIGNED NOT NULL, 
    `text` TEXT(400) NOT NULL,
    `imdb_code` CHAR(9) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT NOW(),
    FOREIGN KEY (userId) REFERENCES users(userId)
);