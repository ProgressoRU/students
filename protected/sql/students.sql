/*
Navicat MySQL Data Transfer

Source Server         : MySql
Source Server Version : 50523
Source Host           : localhost:3306
Source Database       : students

Target Server Type    : MYSQL
Target Server Version : 50523
File Encoding         : 65001

Date: 2015-05-06 23:25:31
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for disciplines
-- ----------------------------
DROP TABLE IF EXISTS `disciplines`;
CREATE TABLE `disciplines` (
  `discipline_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(64) NOT NULL,
  `description` varchar(144) DEFAULT NULL,
  `creator_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`discipline_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for groups
-- ----------------------------
DROP TABLE IF EXISTS `groups`;
CREATE TABLE `groups` (
  `group_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `passcode` char(16) NOT NULL,
  `expire_date` timestamp NULL DEFAULT NULL,
  `teacher_id` int(11) unsigned DEFAULT NULL,
  `title` varchar(16) NOT NULL,
  PRIMARY KEY (`group_id`),
  UNIQUE KEY `passcode` (`passcode`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for group_access
-- ----------------------------
DROP TABLE IF EXISTS `group_access`;
CREATE TABLE `group_access` (
  `group_id` int(11) unsigned NOT NULL,
  `discipline_id` int(11) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for group_progress
-- ----------------------------
DROP TABLE IF EXISTS `group_progress`;
CREATE TABLE `group_progress` (
  `group_id` int(11) unsigned NOT NULL,
  `lecture_id` int(11) unsigned NOT NULL,
  `date_deadline` timestamp NULL DEFAULT NULL,
  `is_visible` tinyint(1) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for lectures
-- ----------------------------
DROP TABLE IF EXISTS `lectures`;
CREATE TABLE `lectures` (
  `lecture_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(80) NOT NULL,
  `description` longtext NOT NULL,
  `date_created` timestamp NULL DEFAULT NULL,
  `date_updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `discipline_id` int(4) unsigned DEFAULT NULL,
  PRIMARY KEY (`lecture_id`),
  KEY `intClass` (`discipline_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for news
-- ----------------------------
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news` (
  `news_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `news` longtext NOT NULL,
  `importance` tinyint(4) unsigned NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`news_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for subscriptions
-- ----------------------------
DROP TABLE IF EXISTS `subscriptions`;
CREATE TABLE `subscriptions` (
  `user_id` int(11) unsigned NOT NULL,
  `group_id` int(11) unsigned NOT NULL,
  `is_editor` tinyint(1) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(16) NOT NULL,
  `pass_hash` varchar(255) DEFAULT NULL,
  `surname` varchar(42) DEFAULT NULL,
  `name` varchar(42) DEFAULT NULL,
  `patronymic` varchar(42) DEFAULT NULL COMMENT 'Отчество',
  `session_hash` varchar(32) DEFAULT NULL,
  `last_ip` varchar(16) DEFAULT NULL,
  `role` varchar(8) NOT NULL,
  `useragent` varchar(255) DEFAULT NULL,
  `group` varchar(12) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
