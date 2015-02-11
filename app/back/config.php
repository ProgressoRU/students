<?php
# DB Connection data
$host = 'localhost';
$username = 'root';
$password = 'hi';
$dbName = 'students';

try {  
# MySQL через PDO_MYSQL  
  $DBH = new PDO("mysql:host=$host;dbname=$dbName", $username, $password);  
}  
catch(PDOException $e) {  
    echo $e->getMessage();  
}
/*
//Connect to DB
mysql_connect($host,$username,$password) or die('Не удалось установить соединение с сервером MySQL.<br>Обратитесь к Администратору!');
mysql_select_db($dbName) or die('Не удалось открыть Базу Данных. Обратитесь к администратору!');
*/
?>