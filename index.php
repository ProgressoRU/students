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

# Место для проверки авторизации
//** //

if (!headers_sent()) {
    header("Location: public/views/index.html");
 } 


?>