/*
Navicat MySQL Data Transfer

Source Server         : MySql
Source Server Version : 50523
Source Host           : localhost:3306
Source Database       : students

Target Server Type    : MYSQL
Target Server Version : 50523
File Encoding         : 65001

Date: 2015-03-04 02:50:15
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for tblarticles
-- ----------------------------
DROP TABLE IF EXISTS `tblarticles`;
CREATE TABLE `tblarticles` (
  `artID` int(11) NOT NULL,
  `txtTitle` varchar(255) NOT NULL,
  `txtdesc` longtext,
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
INSERT INTO `tblarticles` VALUES ('1', 'Лекция 1', 'test', '1', '2015-02-17 22:34:10', '2015-03-02 20:18:50', '2015-02-20 22:34:17', '1');
INSERT INTO `tblarticles` VALUES ('2', 'Лекция 2', 'Продолжение темы, поднятой в 1 лекции', '1', '2015-02-17 22:44:46', '2015-02-18 22:44:51', '2015-02-21 22:44:54', '1');
INSERT INTO `tblarticles` VALUES ('3', 'Невидимая 3 лекция', 'Продолжает первые 2 лекции, но пока еще не видна', '0', '2015-02-17 22:45:36', '2015-02-17 22:45:48', '2015-04-29 22:45:41', '1');
INSERT INTO `tblarticles` VALUES ('4', 'Введение', 'Введение является очень важной составной частью дипломной работы. Введение должно раскрыть: почему ваша работа так необходима, почему проведенное вами исследование имеет право на существование. Помимо этого, введение предоставляет схему проведения этого самого исследования. В Вашем случае, конечно, исследования как такового и нет. Ваша задача – это написание Web-сервера. Но для того. чтобы сервер написать, вам же надо исследовать предприятие, для которого будете разрабатывать, теоретическую часть тоже надо изучить, так что, и вам не избежать этого обоснования.', '1', '2015-03-01 21:19:13', '2015-03-02 20:20:57', '2015-03-29 21:19:18', '9');
INSERT INTO `tblarticles` VALUES ('5', 'Первая глава диплома', '...', '1', '2015-03-06 20:43:14', '2015-04-14 20:43:17', '2015-03-18 20:43:21', '9');
INSERT INTO `tblarticles` VALUES ('6', 'HTML: Форматирование текста', 'Вы научитесь с помощью HTML создавать параграфы, заголовки, а  также менять начертание текста и его шрифт', '1', '2015-02-11 18:14:58', '2015-03-03 18:15:26', '2015-02-01 18:15:11', '8');
INSERT INTO `tblarticles` VALUES ('7', 'HTML: Рисунки и списки', 'Вы научитесь добавлять в HTML-документ изображения и различные списки ', '1', '2015-03-03 18:17:12', '2015-03-03 18:17:15', '2015-02-09 18:17:17', '8');
INSERT INTO `tblarticles` VALUES ('8', 'HTML: Гиперссылки', 'Вы научитесь создавать гиперссылки.', '1', '2015-03-03 18:21:33', '2015-03-03 18:21:36', '2015-02-16 18:21:38', '8');
INSERT INTO `tblarticles` VALUES ('9', 'HTML: Таблицы', 'Таблицы вещь крайне важная в html. С их помощью очень удобно создавать и размечать страницы (разумеется, в таком случае границы таблицы невидимы). С помощью таблиц можно добиться точного расположения того или иного фрагмента страницы, будь то текст, графика или гиперссылка. Например, используя таблицу, можно легко добиться отображения текста в нескольких колонках, подобно газетной публикации.\r\n', '1', '2015-03-03 18:22:47', '2015-03-03 18:23:47', '2015-02-23 18:22:52', '8');
INSERT INTO `tblarticles` VALUES ('10', 'HTML: Карты', 'Вы, может быть, знаете, что можно сделать так, чтобы при нажатии на разные области (части) одной и той же картинки, вы попадали на разные страницы, это называется - навигационная карта\r\n', '1', '2015-03-03 18:23:36', '2015-03-03 18:28:19', '2015-03-02 18:23:47', '8');
INSERT INTO `tblarticles` VALUES ('11', 'CSS: Основы', 'Познакомьтесь с таблицами каскадных стилей (CSS) — языком, созданным для описания внешнего вида HTML-документов', '1', '2015-03-03 18:27:54', '2015-03-03 18:31:41', '2015-03-09 18:28:20', '8');
INSERT INTO `tblarticles` VALUES ('12', 'CSS: Псевдоэлементы и псвевдоклассы', 'CSS применяется к элементам HTML. Но есть несколько элементов, которых не существует в HTML, но они присутствуют на странице (первая буква слова и первая строка абзаца). Такие элементы и называют псевдоэлементами. Им можно задавать стиль, также как и элементам HTML.\r\n', '1', '2015-03-03 18:31:26', '2015-03-03 18:31:44', '2015-03-16 18:31:32', '8');
INSERT INTO `tblarticles` VALUES ('13', 'HTML: Якори', 'Иногда возникает такая ситуация: нам нужно сделать ссылку не на другой документ, а внутри того же документа - закладку, в народе называемую якорем. Такая навигация внутри одного и того же документа весьма удобна. Создаваться она может двумя способами', '1', '2015-03-03 18:33:45', '2015-03-03 18:33:47', '2015-03-23 18:33:51', '8');
INSERT INTO `tblarticles` VALUES ('14', 'HTML: Блоки', 'Раньше использовались различные способы разметки сайта: таблицы, фреймы и т.д. Но все это устарело. Теперь используются такие элементы, как блоки. Все содержимое html страницы размещается в блоки, которые в свою очередь тоже могут размещаться в блоки) Главное – это блоки красиво разместить на странице. С грамотными отступами и положением на странице. В этом вам поможет CSS, который мы изучили ранее.', '1', '2015-03-03 18:34:39', '2015-03-03 18:34:46', '2015-03-30 18:34:50', '8');
INSERT INTO `tblarticles` VALUES ('15', 'HTML: Формы', ' Форма предназначена для обмена данными между пользователем и сервером. Область применения форм не ограничена отправкой данных на сервер, с помощью клиентских скриптов можно получить доступ к любому элементу формы, изменять его и применять по своему усмотрению.\r\n\r\nДокумент может содержать любое количество форм, но одновременно на сервер может быть отправлена только одна форма. По этой причине данные форм должны быть независимы друг от друга.', '1', '2015-03-03 18:36:04', '2015-03-03 18:36:07', '2015-03-03 18:36:09', '8');

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
INSERT INTO `tblcourses` VALUES ('4', 'Admins', '0');

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
INSERT INTO `tblgroups` VALUES ('2', '3');
INSERT INTO `tblgroups` VALUES ('1', '4');

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
  `txtRole` varchar(8) DEFAULT NULL,
  `useragent` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uID`),
  KEY `GroupID` (`GroupID`),
  CONSTRAINT `tblusers_ibfk_1` FOREIGN KEY (`GroupID`) REFERENCES `tblgroups` (`GroupID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tblusers
-- ----------------------------
INSERT INTO `tblusers` VALUES ('1', 'login', '35f504164d5a963d6a820e71614a4009', 'sad', 'Виктор', null, '2', 'a99c8516db4060c328a5ac7b9fd49e8c', '127.0.0.1', 'student', 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:35.0) Gecko/20100101 Firefox/35.0');
