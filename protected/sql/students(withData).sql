/*
Navicat MySQL Data Transfer

Source Server         : MySql
Source Server Version : 50523
Source Host           : localhost:3306
Source Database       : students

Target Server Type    : MYSQL
Target Server Version : 50523
File Encoding         : 65001

Date: 2015-05-06 23:25:37
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
-- Records of attachments
-- ----------------------------
INSERT INTO `attachments` VALUES ('2', '7', 'https://drive.google.com/open?id=0B7LYstS04THBOFpxeTJiRUNuYVk', 'pptx', 'Рисунки и списки', 'Проверить примеры на компьютере', '2015-03-16 16:56:20');
INSERT INTO `attachments` VALUES ('3', '7', 'https://drive.google.com/open?id=0B7LYstS04THBUEhmSU5OenVIbjQ', 'pptx', 'Еще рисунки и списки', 'Проверить примеры на компьютере', '2015-03-16 16:57:24');
INSERT INTO `attachments` VALUES ('11', '8', 'asdasd', null, 'New1', 'asdads', '2015-05-05 18:52:14');
INSERT INTO `attachments` VALUES ('12', '8', 'Test', null, 'asdsaddsa', 'test+test', '2015-05-05 18:53:24');
INSERT INTO `attachments` VALUES ('15', '8', 'test', null, 'test', 'test', '2015-05-06 19:03:18');

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
-- Records of disciplines
-- ----------------------------
INSERT INTO `disciplines` VALUES ('1', 'Очень интересный предмет', 'Очень интересное описание', '1');
INSERT INTO `disciplines` VALUES ('2', 'Еще интересный предмет', '333', '1');
INSERT INTO `disciplines` VALUES ('3', 'Больше предметов', null, '1');
INSERT INTO `disciplines` VALUES ('4', 'Архитектура ЭВМ', 'Предмет, который запомнится надолго', '1');
INSERT INTO `disciplines` VALUES ('5', 'Базы Данных', null, '1');
INSERT INTO `disciplines` VALUES ('6', 'фывфывыфв', null, '1');
INSERT INTO `disciplines` VALUES ('7', 'ывыфввы', null, '1');
INSERT INTO `disciplines` VALUES ('8', 'Информационные технологии', null, '1');
INSERT INTO `disciplines` VALUES ('9', 'Диплом', 'Diploma', '1');
INSERT INTO `disciplines` VALUES ('10', 'вфыывф', null, '1');

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
-- Records of groups
-- ----------------------------
INSERT INTO `groups` VALUES ('1', 'abcdefg', null, '2', 'Test Group 1');
INSERT INTO `groups` VALUES ('2', 'qwerty', '2015-05-06 20:33:43', '2', 'Test Group 2');
INSERT INTO `groups` VALUES ('3', 'ytrewq', '2015-05-07 20:48:42', '2', 'Test group3');

-- ----------------------------
-- Table structure for group_access
-- ----------------------------
DROP TABLE IF EXISTS `group_access`;
CREATE TABLE `group_access` (
  `group_id` int(11) unsigned NOT NULL,
  `discipline_id` int(11) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of group_access
-- ----------------------------
INSERT INTO `group_access` VALUES ('1', '8');
INSERT INTO `group_access` VALUES ('1', '9');
INSERT INTO `group_access` VALUES ('2', '3');
INSERT INTO `group_access` VALUES ('3', '4');
INSERT INTO `group_access` VALUES ('3', '8');
INSERT INTO `group_access` VALUES ('4', '1');

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
-- Records of group_progress
-- ----------------------------
INSERT INTO `group_progress` VALUES ('1', '7', '2015-05-08 16:42:35', '1');
INSERT INTO `group_progress` VALUES ('1', '8', '2015-05-06 16:53:04', '1');
INSERT INTO `group_progress` VALUES ('1', '9', '2015-05-06 16:53:12', '1');
INSERT INTO `group_progress` VALUES ('1', '10', '2015-05-06 16:53:18', '1');
INSERT INTO `group_progress` VALUES ('1', '11', '2015-05-06 16:53:38', '1');
INSERT INTO `group_progress` VALUES ('1', '12', '2015-05-06 16:53:47', '1');
INSERT INTO `group_progress` VALUES ('1', '13', '2015-05-06 16:53:54', '1');
INSERT INTO `group_progress` VALUES ('1', '14', '2015-05-06 16:54:00', '1');

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
-- Records of lectures
-- ----------------------------
INSERT INTO `lectures` VALUES ('1', 'Лекция 1', 'test', '2015-02-17 22:34:10', '2015-03-02 20:18:50', '1');
INSERT INTO `lectures` VALUES ('2', 'Лекция 2', 'Продолжение темы, поднятой в 1 лекции', '2015-02-17 22:44:46', '2015-02-18 22:44:51', '1');
INSERT INTO `lectures` VALUES ('3', 'Невидимая 3 лекция', 'Продолжает первые 2 лекции, но пока еще не видна', '2015-02-17 22:45:36', '2015-02-17 22:45:48', '1');
INSERT INTO `lectures` VALUES ('4', 'Введение', 'Введение является очень важной составной частью дипломной работы. Введение должно раскрыть: почему ваша работа так необходима, почему проведенное вами исследование имеет право на существование. Помимо этого, введение предоставляет схему проведения этого самого исследования. В Вашем случае, конечно, исследования как такового и нет. Ваша задача – это написание Web-сервера. Но для того. чтобы сервер написать, вам же надо исследовать предприятие, для которого будете разрабатывать, теоретическую часть тоже надо изучить, так что, и вам не избежать этого обоснования.', '2015-03-01 21:19:13', '2015-03-02 20:20:57', '9');
INSERT INTO `lectures` VALUES ('5', 'Первая глава диплома', '...', '2015-03-06 20:43:14', '2015-04-14 20:43:17', '9');
INSERT INTO `lectures` VALUES ('7', 'HTML: Рисунки и списки', '<p>Вы научитесь добавлять в <b>HTML-документ</b> изображения и различные списки saddsa<br/></p>', '2015-03-03 18:17:12', '2015-05-05 04:08:30', '8');
INSERT INTO `lectures` VALUES ('8', 'HTML: Гиперссылки!', 'Вы научитесь создавать гиперссылки.', '2015-03-03 18:21:33', '2015-05-06 18:02:18', '8');
INSERT INTO `lectures` VALUES ('9', 'HTML: Таблицы', 'Таблицы вещь крайне важная в html. С их помощью очень удобно создавать и размечать страницы (разумеется, в таком случае границы таблицы невидимы). С помощью таблиц можно добиться точного расположения того или иного фрагмента страницы, будь то текст, графика или гиперссылка. Например, используя таблицу, можно легко добиться отображения текста в нескольких колонках, подобно газетной публикации.\r\n', '2015-03-03 18:22:47', '2015-05-05 17:14:18', '8');
INSERT INTO `lectures` VALUES ('10', 'HTML: Карты', 'Вы, может быть, знаете, что можно сделать так, чтобы при нажатии на разные области (части) одной и той же картинки, вы попадали на разные страницы, это называется - навигационная карта\r\n', '2015-03-03 18:23:36', '2015-03-03 18:28:19', '8');
INSERT INTO `lectures` VALUES ('11', 'CSS: Основы', 'Познакомьтесь с таблицами каскадных стилей (CSS) — языком, созданным для описания внешнего вида HTML-документов', '2015-03-03 18:27:54', '2015-05-05 04:05:14', '8');
INSERT INTO `lectures` VALUES ('12', 'CSS: Псевдоэлементы и псвевдоклассы', 'CSS применяется к элементам HTML. Но есть несколько элементов, которых не существует в HTML, но они присутствуют на странице (первая буква слова и первая строка абзаца). Такие элементы и называют псевдоэлементами. Им можно задавать стиль, также как и элементам HTML.\r\n', '2015-03-03 18:31:26', '2015-03-03 18:31:44', '8');
INSERT INTO `lectures` VALUES ('13', 'HTML: Якори', 'Иногда возникает такая ситуация: нам нужно сделать ссылку не на другой документ, а внутри того же документа - закладку, в народе называемую якорем. Такая навигация внутри одного и того же документа весьма удобна. Создаваться она может двумя способами', '2015-03-03 18:33:45', '2015-03-03 18:33:47', '8');
INSERT INTO `lectures` VALUES ('14', 'HTML: Блоки', 'Раньше использовались различные способы разметки сайта: таблицы, фреймы и т.д. Но все это устарело. Теперь используются такие элементы, как блоки. Все содержимое html страницы размещается в блоки, которые в свою очередь тоже могут размещаться в блоки) Главное – это блоки красиво разместить на странице. С грамотными отступами и положением на странице. В этом вам поможет CSS, который мы изучили ранее.', '2015-03-03 18:34:39', '2015-05-05 17:21:29', '8');
INSERT INTO `lectures` VALUES ('15', 'HTML: Формы', ' Форма предназначена для обмена данными между пользователем и сервером. Область применения форм не ограничена отправкой данных на сервер, с помощью клиентских скриптов можно получить доступ к любому элементу формы, изменять его и применять по своему усмотрению.\r\n\r\nДокумент может содержать любое количество форм, но одновременно на сервер может быть отправлена только одна форма. По этой причине данные форм должны быть независимы друг от друга.', '2015-03-03 18:36:04', '2015-05-05 17:17:35', '8');

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
-- Records of news
-- ----------------------------
INSERT INTO `news` VALUES ('5', 'фвыфыв', 'фываыфвфв', '0', '2015-02-15 17:49:11');
INSERT INTO `news` VALUES ('6', 'Дополнительная новость', 'ыфвфыв', '1', '2015-02-15 17:49:10');
INSERT INTO `news` VALUES ('10', 'jsdaasdsda', 'asdsad', '2', '2015-03-17 16:29:42');
INSERT INTO `news` VALUES ('27', 'asdasdasd', '<p>saddsddd</p>', '0', '2015-04-11 21:30:48');
INSERT INTO `news` VALUES ('31', 'Вот это новость!', '<h3>Ура!</h3><p><b>Привет, эта новость написана из <i>админки!</i></b></p> <attachment url=\"http://google.com\" title=\"Test\" description=\"test></attachment>', '0', '2015-04-11 23:36:30');
INSERT INTO `news` VALUES ('32', 'Test33', '<p>Test 1</p> ', '0', '2015-04-12 07:07:08');
INSERT INTO `news` VALUES ('33', 'asdasdda', '<p>sdawesd <br/></p>  <p>&lt;</p>', '0', '2015-04-12 20:54:52');

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
-- Records of subscriptions
-- ----------------------------
INSERT INTO `subscriptions` VALUES ('2', '1', '1');
INSERT INTO `subscriptions` VALUES ('2', '2', '0');
INSERT INTO `subscriptions` VALUES ('4', '3', '0');
INSERT INTO `subscriptions` VALUES ('5', '1', '0');
INSERT INTO `subscriptions` VALUES ('6', '3', '0');

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

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'admin', '$5$rounds=5000$Geronimo$Dyvv0aCEuXppf.fJ05cnaonNcpRNHrbf5VP2pgS3P16', null, 'Админ', null, '', '127.0.0.1', 'admin', '', '4ИС');
INSERT INTO `users` VALUES ('2', 'user', '$5$rounds=5000$Geronimo$Dyvv0aCEuXppf.fJ05cnaonNcpRNHrbf5VP2pgS3P16', null, 'Виктор', null, '44e87d32161fa51dd3856108cd0f5f35', '127.0.0.1', 'student', 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:37.0) Gecko/20100101 Firefox/37.0', '3ИС');
INSERT INTO `users` VALUES ('6', 'user2', '$5$rounds=5000$Geronimo$Dyvv0aCEuXppf.fJ05cnaonNcpRNHrbf5VP2pgS3P16', null, null, null, '', '127.0.0.1', 'student', '', '4ИС');
