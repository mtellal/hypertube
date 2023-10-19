--DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `userId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` CHAR(50) NOT NULL DEFAULT "",
  `email` CHAR(100) NOT NULL DEFAULT "",
  `photoPath` CHAR(100) NOT NULL DEFAULT "",
  `password` CHAR(100) NOT NULL DEFAULT "",
  `firstName` CHAR(50) NOT NULL DEFAULT "",
  `lastName` CHAR(50) NOT NULL DEFAULT "",
  `omniAuth` BIT DEFAULT 0,
  `lastConnection` DATETIME(0) NOT NULL DEFAULT NOW(),
  PRIMARY KEY(userId)
);

