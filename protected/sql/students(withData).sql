/*
Navicat MySQL Data Transfer

Source Server         : MySql
Source Server Version : 50523
Source Host           : localhost:3306
Source Database       : students

Target Server Type    : MYSQL
Target Server Version : 50523
File Encoding         : 65001

Date: 2015-03-18 18:07:48
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
-- Records of attachments
-- ----------------------------
INSERT INTO `attachments` VALUES ('1', '6', 'https://drive.google.com/open?id=0B7LYstS04THBVkU2d2VIU19nWFU', 'pptx', 'Тэги для форматирования текста', 'Выполнить задания на последнем слайде', '2015-03-16 22:10:12');
INSERT INTO `attachments` VALUES ('2', '7', 'https://drive.google.com/open?id=0B7LYstS04THBOFpxeTJiRUNuYVk', 'pptx', 'Рисунки и списки', 'Проверить примеры на компьютере', '2015-03-16 16:56:20');
INSERT INTO `attachments` VALUES ('3', '7', 'https://drive.google.com/open?id=0B7LYstS04THBUEhmSU5OenVIbjQ', 'pptx', 'Еще рисунки и списки', 'Проверить примеры на компьютере', '2015-03-16 16:57:24');

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
-- Records of courses
-- ----------------------------
INSERT INTO `courses` VALUES ('1', 'ИС', '2');
INSERT INTO `courses` VALUES ('2', 'ИС', '3');
INSERT INTO `courses` VALUES ('3', 'ИС', '4');
INSERT INTO `courses` VALUES ('4', 'Admins', '0');

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
-- Records of disciplines
-- ----------------------------
INSERT INTO `disciplines` VALUES ('1', 'Очень интересный предмет', 'Очень интересное описание', '1');
INSERT INTO `disciplines` VALUES ('2', 'Еще интересный предмет', '333', '2');
INSERT INTO `disciplines` VALUES ('3', 'Больше предметов', null, '1');
INSERT INTO `disciplines` VALUES ('4', 'Архитектура ЭВМ', 'Предмет, который запомнится надолго', '1');
INSERT INTO `disciplines` VALUES ('5', 'Базы Данных', null, '1');
INSERT INTO `disciplines` VALUES ('6', 'фывфывыфв', null, '2');
INSERT INTO `disciplines` VALUES ('7', 'ывыфввы', null, '2');
INSERT INTO `disciplines` VALUES ('8', 'Информационные технологии', null, '3');
INSERT INTO `disciplines` VALUES ('9', 'Диплом', null, '3');
INSERT INTO `disciplines` VALUES ('10', 'вфыывф', null, '3');

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
-- Records of groups
-- ----------------------------
INSERT INTO `groups` VALUES ('2', '3');
INSERT INTO `groups` VALUES ('1', '4');

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
-- Records of lectures
-- ----------------------------
INSERT INTO `lectures` VALUES ('1', 'Лекция 1', 'test', '1', '2015-02-17 22:34:10', '2015-03-02 20:18:50', '2015-02-20 22:34:17', '1');
INSERT INTO `lectures` VALUES ('2', 'Лекция 2', 'Продолжение темы, поднятой в 1 лекции', '1', '2015-02-17 22:44:46', '2015-02-18 22:44:51', '2015-02-21 22:44:54', '1');
INSERT INTO `lectures` VALUES ('3', 'Невидимая 3 лекция', 'Продолжает первые 2 лекции, но пока еще не видна', '0', '2015-02-17 22:45:36', '2015-02-17 22:45:48', '2015-04-29 22:45:41', '1');
INSERT INTO `lectures` VALUES ('4', 'Введение', 'Введение является очень важной составной частью дипломной работы. Введение должно раскрыть: почему ваша работа так необходима, почему проведенное вами исследование имеет право на существование. Помимо этого, введение предоставляет схему проведения этого самого исследования. В Вашем случае, конечно, исследования как такового и нет. Ваша задача – это написание Web-сервера. Но для того. чтобы сервер написать, вам же надо исследовать предприятие, для которого будете разрабатывать, теоретическую часть тоже надо изучить, так что, и вам не избежать этого обоснования.', '1', '2015-03-01 21:19:13', '2015-03-02 20:20:57', '2015-03-29 21:19:18', '9');
INSERT INTO `lectures` VALUES ('5', 'Первая глава диплома', '...', '1', '2015-03-06 20:43:14', '2015-04-14 20:43:17', '2015-03-18 20:43:21', '9');
INSERT INTO `lectures` VALUES ('6', 'HTML: Форматирование текста', 'Вы научитесь с помощью HTML создавать параграфы, заголовки, а  также менять начертание текста и его шрифт', '1', '2015-02-11 18:14:58', '2015-03-03 18:15:26', '2015-02-01 18:15:11', '8');
INSERT INTO `lectures` VALUES ('7', 'HTML: Рисунки и списки', 'Вы научитесь добавлять в HTML-документ изображения и различные списки ', '1', '2015-03-03 18:17:12', '2015-03-03 18:17:15', '2015-02-09 18:17:17', '8');
INSERT INTO `lectures` VALUES ('8', 'HTML: Гиперссылки', 'Вы научитесь создавать гиперссылки.', '1', '2015-03-03 18:21:33', '2015-03-03 18:21:36', '2015-02-16 18:21:38', '8');
INSERT INTO `lectures` VALUES ('9', 'HTML: Таблицы', 'Таблицы вещь крайне важная в html. С их помощью очень удобно создавать и размечать страницы (разумеется, в таком случае границы таблицы невидимы). С помощью таблиц можно добиться точного расположения того или иного фрагмента страницы, будь то текст, графика или гиперссылка. Например, используя таблицу, можно легко добиться отображения текста в нескольких колонках, подобно газетной публикации.\r\n', '1', '2015-03-03 18:22:47', '2015-03-03 18:23:47', '2015-02-23 18:22:52', '8');
INSERT INTO `lectures` VALUES ('10', 'HTML: Карты', 'Вы, может быть, знаете, что можно сделать так, чтобы при нажатии на разные области (части) одной и той же картинки, вы попадали на разные страницы, это называется - навигационная карта\r\n', '1', '2015-03-03 18:23:36', '2015-03-03 18:28:19', '2015-03-02 18:23:47', '8');
INSERT INTO `lectures` VALUES ('11', 'CSS: Основы', 'Познакомьтесь с таблицами каскадных стилей (CSS) — языком, созданным для описания внешнего вида HTML-документов', '1', '2015-03-03 18:27:54', '2015-03-03 18:31:41', '2015-03-09 18:28:20', '8');
INSERT INTO `lectures` VALUES ('12', 'CSS: Псевдоэлементы и псвевдоклассы', 'CSS применяется к элементам HTML. Но есть несколько элементов, которых не существует в HTML, но они присутствуют на странице (первая буква слова и первая строка абзаца). Такие элементы и называют псевдоэлементами. Им можно задавать стиль, также как и элементам HTML.\r\n', '1', '2015-03-03 18:31:26', '2015-03-03 18:31:44', '2015-03-16 18:31:32', '8');
INSERT INTO `lectures` VALUES ('13', 'HTML: Якори', 'Иногда возникает такая ситуация: нам нужно сделать ссылку не на другой документ, а внутри того же документа - закладку, в народе называемую якорем. Такая навигация внутри одного и того же документа весьма удобна. Создаваться она может двумя способами', '1', '2015-03-03 18:33:45', '2015-03-03 18:33:47', '2015-03-23 18:33:51', '8');
INSERT INTO `lectures` VALUES ('14', 'HTML: Блоки', 'Раньше использовались различные способы разметки сайта: таблицы, фреймы и т.д. Но все это устарело. Теперь используются такие элементы, как блоки. Все содержимое html страницы размещается в блоки, которые в свою очередь тоже могут размещаться в блоки) Главное – это блоки красиво разместить на странице. С грамотными отступами и положением на странице. В этом вам поможет CSS, который мы изучили ранее.', '1', '2015-03-03 18:34:39', '2015-03-03 18:34:46', '2015-03-30 18:34:50', '8');
INSERT INTO `lectures` VALUES ('15', 'HTML: Формы', ' Форма предназначена для обмена данными между пользователем и сервером. Область применения форм не ограничена отправкой данных на сервер, с помощью клиентских скриптов можно получить доступ к любому элементу формы, изменять его и применять по своему усмотрению.\r\n\r\nДокумент может содержать любое количество форм, но одновременно на сервер может быть отправлена только одна форма. По этой причине данные форм должны быть независимы друг от друга.', '1', '2015-03-03 18:36:04', '2015-03-03 18:36:07', '2015-03-03 18:36:09', '8');

-- ----------------------------
-- Table structure for lecture_results
-- ----------------------------
DROP TABLE IF EXISTS `lecture_results`;
CREATE TABLE `lecture_results` (
  `result_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `lecture_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `result` tinyint(1) unsigned NOT NULL,
  PRIMARY KEY (`result_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of lecture_results
-- ----------------------------
INSERT INTO `lecture_results` VALUES ('4', '4', '1', '0');
INSERT INTO `lecture_results` VALUES ('5', '5', '1', '0');
INSERT INTO `lecture_results` VALUES ('6', '6', '1', '1');
INSERT INTO `lecture_results` VALUES ('7', '7', '1', '4');
INSERT INTO `lecture_results` VALUES ('8', '8', '1', '3');
INSERT INTO `lecture_results` VALUES ('9', '9', '1', '5');
INSERT INTO `lecture_results` VALUES ('10', '10', '1', '2');
INSERT INTO `lecture_results` VALUES ('11', '11', '1', '0');
INSERT INTO `lecture_results` VALUES ('12', '12', '1', '0');
INSERT INTO `lecture_results` VALUES ('13', '13', '1', '0');
INSERT INTO `lecture_results` VALUES ('14', '14', '1', '0');
INSERT INTO `lecture_results` VALUES ('15', '15', '1', '0');

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
-- Records of news
-- ----------------------------
INSERT INTO `news` VALUES ('1', 'Обычная новость', 'Текст новости', '0', '2015-02-15 02:23:14');
INSERT INTO `news` VALUES ('2', 'Важная новость', '2', '1', '2015-02-15 01:51:02');
INSERT INTO `news` VALUES ('3', 'Крайне важная новость с крайне длиинным заголовком', '3', '2', '2015-02-15 01:51:23');
INSERT INTO `news` VALUES ('4', 'Еще новость', 'фвлфывлфыволыфво', '0', '2015-02-15 17:49:12');
INSERT INTO `news` VALUES ('5', 'фвыфыв', 'фываыфвфв', '0', '2015-02-15 17:49:11');
INSERT INTO `news` VALUES ('6', 'Дополнительная новость', 'ыфвфыв', '1', '2015-02-15 17:49:10');
INSERT INTO `news` VALUES ('7', 'Последняя нечетная новость', 'фывывфвыф', '2', '2015-03-17 16:29:42');
INSERT INTO `news` VALUES ('8', 'Новость для провери', 'щщзщзцлкуцщокшуцощшцуоашщоцшмоашыовалытвфадтыфва', '1', '2015-03-17 16:29:42');
INSERT INTO `news` VALUES ('9', 'фывошфыв', 'фывыфв', '0', '2015-03-17 16:29:42');
INSERT INTO `news` VALUES ('10', 'jsdaasdsda', 'asdsad', '1', '2015-03-17 16:29:42');
INSERT INTO `news` VALUES ('11', 'wwwwwwww', 'wwwwwwww', '0', '2015-03-17 16:29:42');
INSERT INTO `news` VALUES ('12', 'sdskadjkjsad', 'wwdadkladkjsadkjsakdljsalkdjsknjvnsdkjlfheuiyhuhsid', '3', '2015-03-17 16:29:42');
INSERT INTO `news` VALUES ('13', 'Test ', 'sfjskdj', '1', '2015-03-17 16:29:42');
INSERT INTO `news` VALUES ('14', 'Test 2 ', 'test', '2', '2015-03-17 16:29:42');
INSERT INTO `news` VALUES ('15', 'Last news everyone!', 'Pager is totally working now!', '2', '2015-03-17 16:29:42');
INSERT INTO `news` VALUES ('16', 'Long text', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce pretium metus sit amet molestie accumsan. Ut molestie fringilla tortor in posuere. Suspendisse blandit quam vel nisi auctor pulvinar. Donec vel arcu mollis, gravida elit ut, laoreet velit. Quisque venenatis tempus velit a elementum. Phasellus vestibulum fringilla ligula, a ultrices ligula facilisis nec. Etiam volutpat vehicula erat.', '1', '2015-02-16 01:53:55');

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

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'login', '35f504164d5a963d6a820e71614a4009', 'sad', 'Виктор', null, '2', '8087ff3c734484ed19765c92fe906f46', '127.0.0.1', 'student', 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:36.0) Gecko/20100101 Firefox/36.0');
