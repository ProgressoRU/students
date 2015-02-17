/*
Navicat MySQL Data Transfer

Source Server         : MySql
Source Server Version : 50523
Source Host           : localhost:3306
Source Database       : students

Target Server Type    : MYSQL
Target Server Version : 50523
File Encoding         : 65001

Date: 2015-02-18 00:12:51
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for tblarticles
-- ----------------------------
DROP TABLE IF EXISTS `tblarticles`;
CREATE TABLE `tblarticles` (
  `artID` int(11) NOT NULL,
  `txtTitle` varchar(255) NOT NULL,
  `txtShortDesc` varchar(255) DEFAULT NULL,
  `txtDetails` longtext,
  `isVisible` tinyint(255) DEFAULT NULL,
  `dateCreated` timestamp NULL DEFAULT NULL,
  `dateUpdated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `dateDeadLine` timestamp NULL DEFAULT NULL COMMENT 'Срок сдачи',
  `intClass` int(255) DEFAULT NULL,
  PRIMARY KEY (`artID`),
  KEY `intClass` (`intClass`),
  CONSTRAINT `tblarticles_ibfk_1` FOREIGN KEY (`intClass`) REFERENCES `tblclasses` (`ClassID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tblarticles
-- ----------------------------
INSERT INTO `tblarticles` VALUES ('1', 'Лекция 1', 'Интересная же лекция', 'Очень детальное описание', '1', '2015-02-17 22:34:10', '2015-02-17 22:44:17', '2015-02-20 22:34:17', '1');
INSERT INTO `tblarticles` VALUES ('2', 'Лекция 2', 'Продолжение темы, поднятой в 1 лекции', 'Описание', '1', '2015-02-17 22:44:46', '2015-02-18 22:44:51', '2015-02-21 22:44:54', '1');
INSERT INTO `tblarticles` VALUES ('3', 'Невидимая 3 лекция', 'Продолжает первые 2 лекции, но пока еще не видна', 'Описаньеце', '0', '2015-02-17 22:45:36', '2015-02-17 22:45:48', '2015-04-29 22:45:41', '1');

-- ----------------------------
-- Table structure for tblattachments
-- ----------------------------
DROP TABLE IF EXISTS `tblattachments`;
CREATE TABLE `tblattachments` (
  `attachID` int(11) NOT NULL,
  `artID` int(11) NOT NULL,
  `txtURL` varchar(255) DEFAULT NULL,
  `txtType` varchar(5) DEFAULT NULL,
  `txtTitle` varchar(100) NOT NULL,
  `txtDesc` varchar(255) DEFAULT NULL,
  `isVisible` binary(1) NOT NULL,
  `dateCreated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`attachID`),
  KEY `artID` (`artID`),
  CONSTRAINT `tblattachments_ibfk_1` FOREIGN KEY (`artID`) REFERENCES `tblarticles` (`artID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tblattachments
-- ----------------------------

-- ----------------------------
-- Table structure for tblclasses
-- ----------------------------
DROP TABLE IF EXISTS `tblclasses`;
CREATE TABLE `tblclasses` (
  `ClassID` int(11) NOT NULL,
  `txtTitle` varchar(64) NOT NULL,
  `txtShortDesc` varchar(144) DEFAULT NULL,
  `CourseID` int(11) DEFAULT NULL,
  PRIMARY KEY (`ClassID`),
  KEY `GroupID` (`CourseID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tblclasses
-- ----------------------------
INSERT INTO `tblclasses` VALUES ('1', 'Очень интересный предмет', 'Очень интересное описание', '1');
INSERT INTO `tblclasses` VALUES ('2', 'Еще интересный предмет', '333', '2');
INSERT INTO `tblclasses` VALUES ('3', 'Больше предметов', null, '1');
INSERT INTO `tblclasses` VALUES ('4', 'Архитектура ЭВМ', 'Предмет, который запомнится надолго', '1');
INSERT INTO `tblclasses` VALUES ('5', 'Базы Данных', null, '1');
INSERT INTO `tblclasses` VALUES ('6', 'фывфывыфв', null, '2');
INSERT INTO `tblclasses` VALUES ('7', 'ывыфввы', null, '2');
INSERT INTO `tblclasses` VALUES ('8', 'Информационные технологии', null, '3');
INSERT INTO `tblclasses` VALUES ('9', 'Диплом', null, '3');
INSERT INTO `tblclasses` VALUES ('10', 'вфыывф', null, '3');

-- ----------------------------
-- Table structure for tblcourses
-- ----------------------------
DROP TABLE IF EXISTS `tblcourses`;
CREATE TABLE `tblcourses` (
  `CourseID` int(11) NOT NULL,
  `txtSpeciality` varchar(24) NOT NULL,
  `intCourseNum` int(11) unsigned NOT NULL,
  PRIMARY KEY (`CourseID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Records of tblcourses
-- ----------------------------
INSERT INTO `tblcourses` VALUES ('1', 'ИС', '2');
INSERT INTO `tblcourses` VALUES ('2', 'ИС', '3');
INSERT INTO `tblcourses` VALUES ('3', 'ИС', '4');

-- ----------------------------
-- Table structure for tblgroups
-- ----------------------------
DROP TABLE IF EXISTS `tblgroups`;
CREATE TABLE `tblgroups` (
  `GroupID` int(11) NOT NULL,
  `CourseID` int(11) NOT NULL,
  PRIMARY KEY (`GroupID`),
  KEY `CourseID` (`CourseID`),
  CONSTRAINT `tblgroups_ibfk_1` FOREIGN KEY (`CourseID`) REFERENCES `tblcourses` (`CourseID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tblgroups
-- ----------------------------

-- ----------------------------
-- Table structure for tblnews
-- ----------------------------
DROP TABLE IF EXISTS `tblnews`;
CREATE TABLE `tblnews` (
  `newsID` int(11) NOT NULL AUTO_INCREMENT,
  `txtTitle` varchar(100) DEFAULT NULL,
  `txtNews` longtext,
  `intImpotrance` tinyint(4) DEFAULT NULL,
  `dateCreated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`newsID`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tblnews
-- ----------------------------
INSERT INTO `tblnews` VALUES ('1', 'Обычная новость', 'Текст новости', '0', '2015-02-15 02:23:14');
INSERT INTO `tblnews` VALUES ('2', 'Важная новость', '2', '1', '2015-02-15 01:51:02');
INSERT INTO `tblnews` VALUES ('3', 'Крайне важная новость с крайне длиинным заголовком', '3', '2', '2015-02-15 01:51:23');
INSERT INTO `tblnews` VALUES ('4', 'Еще новость', 'фвлфывлфыволыфво', '0', '2015-02-15 17:49:12');
INSERT INTO `tblnews` VALUES ('5', 'фвыфыв', 'фываыфвфв', '0', '2015-02-15 17:49:11');
INSERT INTO `tblnews` VALUES ('6', 'Дополнительная новость', 'ыфвфыв', '1', '2015-02-15 17:49:10');
INSERT INTO `tblnews` VALUES ('7', 'Последняя нечетная новость', 'фывывфвыф', '2', null);
INSERT INTO `tblnews` VALUES ('8', 'Новость для провери', 'щщзщзцлкуцщокшуцощшцуоашщоцшмоашыовалытвфадтыфва', '1', null);
INSERT INTO `tblnews` VALUES ('9', 'фывошфыв', 'фывыфв', '0', null);
INSERT INTO `tblnews` VALUES ('10', 'jsdaasdsda', 'asdsad', '1', null);
INSERT INTO `tblnews` VALUES ('11', 'wwwwwwww', 'wwwwwwww', '0', null);
INSERT INTO `tblnews` VALUES ('12', 'sdskadjkjsad', 'wwdadkladkjsadkjsakdljsalkdjsknjvnsdkjlfheuiyhuhsid', '3', null);
INSERT INTO `tblnews` VALUES ('13', 'Test ', 'sfjskdj', '1', null);
INSERT INTO `tblnews` VALUES ('14', 'Test 2 ', 'test', '2', null);
INSERT INTO `tblnews` VALUES ('15', 'Last news everyone!', 'Pager is totally working now!', '2', null);
INSERT INTO `tblnews` VALUES ('16', 'Long text', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce pretium metus sit amet molestie accumsan. Ut molestie fringilla tortor in posuere. Suspendisse blandit quam vel nisi auctor pulvinar. Donec vel arcu mollis, gravida elit ut, laoreet velit. Quisque venenatis tempus velit a elementum. Phasellus vestibulum fringilla ligula, a ultrices ligula facilisis nec. Etiam volutpat vehicula erat.', '1', '2015-02-16 01:53:55');

-- ----------------------------
-- Table structure for tblusers
-- ----------------------------
DROP TABLE IF EXISTS `tblusers`;
CREATE TABLE `tblusers` (
  `uID` int(11) NOT NULL,
  `username` varchar(18) DEFAULT NULL,
  `passHash` char(32) DEFAULT NULL,
  `txtSurname` varchar(64) NOT NULL,
  `txtName` varchar(64) DEFAULT NULL,
  `txtPatronymic` varchar(64) DEFAULT NULL COMMENT 'Отчество',
  `GroupID` int(11) DEFAULT NULL,
  `sessionHash` char(32) DEFAULT NULL,
  `lastIp` varchar(16) DEFAULT NULL,
  PRIMARY KEY (`uID`),
  KEY `GroupID` (`GroupID`),
  CONSTRAINT `tblusers_ibfk_1` FOREIGN KEY (`GroupID`) REFERENCES `tblgroups` (`GroupID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tblusers
-- ----------------------------
INSERT INTO `tblusers` VALUES ('1', 'login', '35f504164d5a963d6a820e71614a4009', 'sad', null, null, null, '8e27f7e2164d641902d0261acf702b95', '127.0.0.1');
