<?php
namespace App\Libraries;

use Exception;

abstract class Auth extends \PHPixie\Controller {

    public function checkCookie()
    {
        $isOk = true;
        $user = array();
        //Проверяем наличие куки
        if (isset($_COOKIE['id'])) $id = $_COOKIE['id'];
            else
            {
                $isOk = false;
                return $isOk;
            }
        if (isset($_COOKIE['hash'])) $hash = $_COOKIE['hash'];
            else
            {
                $isOk = false;
                return $isOk;
            }
        try
        {
            //находим пользователя, соответствующего кукам
            $user = $this->pixie->db->query('select')->table('tblusers')
                ->where('uID',$id)
                ->where('sessionHash',$hash)
                ->execute()->current();
        }
        catch (Exception $e) {
            echo('SQL Error\nIt\'s might help:\n'.$e->getMessage());
            $isOk = false;
        }
        //echo($user['uID']);
        //проверяем совпадают ли последний IP и браузер с текущими
        if (($user->lastIp != $_SERVER['REMOTE_ADDR']) || ($user->useragent != $_SERVER['HTTP_USER_AGENT']))
            $isOk = false;

        //если что-то не совпало, то на всякий случай трем сессию пользователя
        if (!$isOk) {
            try
            {
                $this->pixie->db->query('update')->table('tblusers')
                    ->data(array(
                        'sessionHash' => '',
                        'lastIp' => '127.0.0.1',
                        'useragent' => ''
                    ))
                    ->where('uID',$id)
                    ->execute();
            }
            catch (Exception $e)
            {
                echo($e->getMessage());
            }
        }
        return $isOk;
    }

    public function checkPermissions()
    {
        //перед вызовом этой функции куки должны бьть проверены.
        //Можно ли в этом убедиться?
        $id = $_COOKIE['id'];
        $user = array();
        $permissions = array();
        try
        {
            //выясняем роль и курс
           $user = $this->pixie->db->query('select')->table('tblusers')
                ->fields('uID','GroupID','txtRole')
                ->where('uID',$id)
                ->join('tblgroups
                ',array('tblgroups.GroupID','tblusers.GroupID'),'inner')
                ->execute()->as_array();
            $permissions = array( //скорее всего не работает
                'role' => $user->txtRole,
                'course' => $user->tblcourseID
            );
        }
        catch (Exception $e)
        {
            echo ($e->getMessage());
        }

        return $permissions;
    }

    public function login($login, $pass)
    {
        //Перенести сюда авторизацию?
    }
}

?>