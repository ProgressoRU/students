/*
Navicat MySQL Data Transfer

Source Server         : MySql
Source Server Version : 50523
Source Host           : localhost:3306
Source Database       : students

Target Server Type    : MYSQL
Target Server Version : 50523
File Encoding         : 65001

Date: 2015-02-18 00:12:58
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
