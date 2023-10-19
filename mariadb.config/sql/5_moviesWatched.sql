CREATE TABLE `moviesWatched`(
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT, 
    `userId` INT UNSIGNED NOT NULL, 
    `movieHash` VARCHAR(40) NOT NULL DEFAULT "", 
    `imdb_code` CHAR(20)  NOT NULL DEFAULT "", 
    FOREIGN KEY (userId) REFERENCES users(userId)
);