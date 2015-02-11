<?php
require_once 'config.php';
    $login = htmlspecialchars($_POST["login"]);
    $pass = htmlspecialchars($_POST["password"]);
//Поиск пользователя
    try
    {
$checkUser = $DBH->prepare("SELECT passHash, uID FROM tblusers WHERE username=:user");
$checkUser->bindValue(":user", $login);
$checkUser->setFetchMode(PDO::FETCH_ASSOC); //returns an array indexed by column name as returned in result set 
$checkUser->execute();
    }
    catch(PDOException $e) {  
    echo $e->getMessage();  
} 
if ($checkUser->rowCount()==0) die("Такого пользователя не существует.");  
//Проверка пароля
$Result = $checkUser->fetch();
    //print_r($Result['passHash']);
    //echo "<br>".md5(md5($pass)); //debug
    if ($Result['passHash'] === md5(md5($pass)))
    {
        // Создание сессии
        $hash = md5(uniqid(rand(),true)); //генерируем и хэшируем код
       try
        {
            $upSession = $DBH->prepare("UPDATE tblUsers SET sessionHash=:hash, lastIp=:ip WHERE username=:user;"); 
            $upSession->bindValue(":user", $login);
            $upSession->bindValue(":hash", $hash);
            $upSession->bindValue(":ip", $_SERVER['REMOTE_ADDR']);
            $upSession->execute(); //записываем хэш в БД
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
