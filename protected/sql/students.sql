/*
Navicat MySQL Data Transfer

Source Server         : MySql
Source Server Version : 50523
Source Host           : localhost:3306
Source Database       : students

Target Server Type    : MYSQL
Target Server Version : 50523
File Encoding         : 65001

Date: 2015-03-18 01:17:28
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for attachments
-- ----------------------------
DROP TABLE IF EXISTS `attachments`;
CREATE TABLE `attachments` (
  `attach_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `lecture_id` int(11) unsigned NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `type` varchar(5) DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`attach_id`),
  KEY `artID` (`lecture_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for courses
-- ----------------------------
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `course_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `speciality` varchar(24) NOT NULL,
  `course_num` int(11) unsigned NOT NULL,
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- ----------------------------
-- Table structure for disciplines
-- ----------------------------
DROP TABLE IF EXISTS `disciplines`;
CREATE TABLE `disciplines` (
  `discipline_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(64) NOT NULL,
  `description` varchar(144) DEFAULT NULL,
  `course_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`discipline_id`),
  KEY `GroupID` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for groups
-- ----------------------------
DROP TABLE IF EXISTS `groups`;
CREATE TABLE `groups` (
  `group_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `course_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`group_id`),
  KEY `CourseID` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for lectures
-- ----------------------------
DROP TABLE IF EXISTS `lectures`;
CREATE TABLE `lectures` (
  `lecture_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(80) NOT NULL,
  `description` longtext NOT NULL,
  `is_visible` tinyint(1) unsigned NOT NULL,
  `date_created` timestamp NULL DEFAULT NULL,
  `date_updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `date_dead_line` timestamp NULL DEFAULT NULL COMMENT 'Срок сдачи',
  `discipline_id` int(4) unsigned DEFAULT NULL,
  PRIMARY KEY (`lecture_id`),
  KEY `intClass` (`discipline_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for news
-- ----------------------------
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news` (
  `news_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(80) NOT NULL,
  `news` longtext NOT NULL,
  `importance` tinyint(4) unsigned NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`news_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(16) NOT NULL,
  `pass_hash` varchar(32) DEFAULT NULL,
  `surname` varchar(42) NOT NULL,
  `name` varchar(42) NOT NULL,
  `patronymic` varchar(42) DEFAULT NULL COMMENT 'Отчество',
  `group_id` int(11) NOT NULL,
  `session_hash` varchar(32) DEFAULT NULL,
  `last_ip` varchar(16) DEFAULT NULL,
  `role` varchar(8) NOT NULL,
  `useragent` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `GroupID` (`group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
