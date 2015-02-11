<?php
require_once 'config.php';
    $login = htmlspecialchars($_POST["login"]);
    $pass = htmlspecialchars($_POST["password"]);
//Поиск пользователя
    try
    {
$stmCheckUser = $DBH->prepare("SELECT passHash, uID FROM tblusers WHERE username=?");
$stmCheckUser->execute(array($login));
$stmCheckUser->execute();
    }
    catch(PDOException $e) {  
    echo $e->getMessage();  
} 
if ($stmCheckUser->rowCount()==0) die("Такого пользователя не существует.");  
//Проверка пароля
$Result = $stmCheckUser->fetch(PDO::FETCH_ASSOC); //returns an array indexed by column name as returned in result set 
    //print_r($Result['passHash']);
    //echo "<br>".md5(md5($pass)); //debug
    if ($Result['passHash'] === md5(md5($pass)))
    {
        // Создание сессии
        $hash = md5(uniqid(rand(),true)); //генерируем и хэшируем код
       try
        {
            $stmUpSession = $DBH->prepare("UPDATE tblUsers SET sessionHash=?, lastIp=? WHERE username=?"); 
            $stmUpSession->execute(array($login, $hash, $_SERVER['REMOTE_ADDR']));
            $stmUpSession->execute(); //записываем хэш в БД
           //Устанавливем куки (на час)
            setcookie("id", $Result['uID'], time()+3600); 
            setcookie("hash", $hash, time()+3600);
            //header("Location: что-то.php"); exit(); //переадресация
        }
        catch(PDOException $e) {  
            echo $e->getMessage();  
        } 
        
    }
    else
    {
        die ("Неверный пароль");
    }
?>
