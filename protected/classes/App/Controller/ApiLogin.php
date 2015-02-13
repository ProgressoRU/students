<?php

namespace App\Controller;

use PDOException,
    PDO;

class ApiLogin extends \App\Page {

    public function action_index() {
        $this->view->subview = 'json';
        $response = array(
        );

        $db = $this->pixie->db;
        if (!($db instanceof PDO)) {
            return;
        }

        $login = htmlspecialchars($_POST["login"]);
        $pass = htmlspecialchars($_POST["password"]);
        //Поиск пользователя
        try
        {
            $stmCheckUser = $db->prepare("SELECT passHash, uID FROM tblusers WHERE username=?");
            $stmCheckUser->execute(array($login));
        }
        catch(PDOException $e) {
            echo $e->getMessage();
            return;
        }
        if ($stmCheckUser->rowCount()==0) header("Location: ../index.php");
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
                $stmUpSession = $db->prepare("UPDATE tblUsers SET sessionHash=?, lastIp=? WHERE username=?");
                $stmUpSession->execute(array($login, $hash, $_SERVER['REMOTE_ADDR'])); //записываем хэш в БД
                //Устанавливем куки (на час)
                setcookie("id", $Result['uID'], time()+3600);
                setcookie("hash", $hash, time()+3600);
                header("Location: ../index.php"); exit(); //переадресация (temp)
            }
            catch(PDOException $e) {
                echo $e->getMessage();
            }

        }
        else
        {
            header("Location: ../index.php"); exit(); //temp
        }

        $this->view->response = $response;
    }

}
