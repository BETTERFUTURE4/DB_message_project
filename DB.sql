-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        10.6.4-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- db 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `db` /*!40100 DEFAULT CHARACTER SET utf8mb3 */;
USE `db`;

-- 테이블 db.chat 구조 내보내기
CREATE TABLE IF NOT EXISTS `chat` (
  `CHAT_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `SENDER` varchar(50) NOT NULL,
  `RECEIVER` varchar(50) NOT NULL,
  `CREATED_AT` datetime NOT NULL,
  `MSG_TYPE` tinyint(3) unsigned NOT NULL,
  `TEXT` varchar(50) NOT NULL,
  `READ_OR_NOT` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `CHAT_STATE` tinyint(4) NOT NULL,
  `VALID_TIME` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`CHAT_ID`),
  KEY `FK_chat_user` (`SENDER`),
  CONSTRAINT `FK_chat_user` FOREIGN KEY (`SENDER`) REFERENCES `user` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 db.friends 구조 내보내기
CREATE TABLE IF NOT EXISTS `friends` (
  `F_ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `MY_ID` varchar(50) NOT NULL,
  `FRIEND_ID` varchar(50) NOT NULL,
  `F_STATE` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`F_ID`),
  KEY `FK_friends_user` (`MY_ID`),
  CONSTRAINT `FK_friends_user` FOREIGN KEY (`MY_ID`) REFERENCES `user` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 db.location 구조 내보내기
CREATE TABLE IF NOT EXISTS `location` (
  `LOCATION_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `USER_ID` varchar(50) NOT NULL,
  `LOCATION_STATE` tinyint(4) NOT NULL,
  `LOCATION` varchar(50) NOT NULL,
  PRIMARY KEY (`LOCATION_ID`),
  KEY `FK_location_user` (`USER_ID`),
  CONSTRAINT `FK_location_user` FOREIGN KEY (`USER_ID`) REFERENCES `user` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 db.user 구조 내보내기
CREATE TABLE IF NOT EXISTS `user` (
  `ID` varchar(50) NOT NULL,
  `PW` varchar(50) NOT NULL,
  `NAME` varchar(50) NOT NULL,
  `TYPE` varchar(50) NOT NULL,
  `LOGIN_STATE` tinyint(3) unsigned NOT NULL,
  `STATUS_MESSAGE` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- 내보낼 데이터가 선택되어 있지 않습니다.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
