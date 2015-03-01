<?php
namespace App\Libraries;

use Exception;

abstract class Auth
{

    public static function checkCookie(\App\Pixie $pixie)
    {
        //TODO: XSRF Protection!
        $isOk = true;
        //Проверяем наличие куки
        if (isset($_COOKIE['id'])) $id = $_COOKIE['id'];
        else {
            $isOk = false;
            return $isOk;
        }
        if (isset($_COOKIE['hash'])) $hash = $_COOKIE['hash'];
        else {
            $isOk = false;
            return $isOk;
        }
        try {
            //находим пользователя, соответствующего кукам
            $user = $pixie->db->query('select')->table('tblusers')
                ->where('uID', $id)
                ->where('sessionHash', $hash)
                ->execute()->current();

            //проверяем совпадают ли последний IP и браузер с текущими
            if (
                (!property_exists($user, 'lastIp') || $user->lastIp != $_SERVER['REMOTE_ADDR'])
                || (!property_exists($user, 'useragent') || $user->useragent != $_SERVER['HTTP_USER_AGENT'])
            ) {
                $isOk = false;
            }

        } catch (Exception $e) {
            error_log($e->getMessage());
            $isOk = false;
        }

        //если что-то не совпало, то на всякий случай трем сессию пользователя
        if (!$isOk) {
            try {
                $pixie->db->query('update')->table('tblusers')
                    ->data(array(
                        'sessionHash' => '',
                        'lastIp' => '127.0.0.1',
                        'useragent' => ''
                    ))
                    ->where('uID', $id)
                    ->execute();
            } catch (Exception $e) {
                error_log($e->getMessage());
            }
        }
        return $isOk;
    }

    public static function login(\App\Pixie $pixie, $login, $pass)
    {
        $reply = array(
            'status' => 403, //403: Forbidden
            'user' => array()
        );
        $passHash = md5(md5($pass)); //TODO: заменить на SHA
        try {
            $reply['user'] = $pixie->db->query('select')->table('tblusers')
                ->fields('uID', 'username', 'txtSurname', 'txtName', 'txtPatronymic', 'GroupID', 'txtRole','tblgroups.courseID')
                ->where('username', $login)
                ->where('passHash', $passHash)
                ->join('tblgroups', array('tblgroups.GroupID', 'tblusers.GroupID'), 'inner')
                ->execute()->as_array();
        } catch (Exception $e) {
            error_log('SQL Error\nIt\'s might help:\n' . $e->getMessage());
            return $reply;
        }
        //echo ;
        if ($reply['user'] != null) {
            $reply['status'] = 200; //200: OK
            $hash = md5(uniqid(rand(), true));
            try {
                $pixie->db->query('update')->table('tblusers')
                    ->data(array(
                        'sessionHash' => $hash,
                        'lastIp' => $_SERVER['REMOTE_ADDR'],
                        'useragent' => $_SERVER['HTTP_USER_AGENT']))
                    ->where('uid', $reply['user'][0]->uID)
                    ->execute();
            } catch (Exception $e) {
                error_log('User is found, but session update caused an error\nIt\'s might help:\n' . $e->getMessage());
            }
            //Устанавливем куки (на час)
            setcookie("id", $reply['user'][0]->uID, time() + 3600, '/');
            setcookie("hash", $hash, time() + 3600, '/');
        } else $reply['status'] = 403; //403: Forbidden

        return $reply;
    }

    public static function logout(\App\Pixie $pixie)
    {
        //TODO: добавить проверки
        if (isset($_COOKIE['id'])) $id = $_COOKIE['id'];
        else return false;
        try {
            $pixie->db->query('update')->table('tblusers')
                ->data(array(
                    'sessionHash' => '',
                    'lastIp' => '127.0.0.1',
                    'useragent' => ''
                ))
                ->where('uID', $id)
                ->execute();
        } catch (Exception $e) {
            error_log($e->getMessage());
        }

        setcookie("id", "", 0, '/');
        setcookie("hash", "", 0, '/');

        return true;
    }
}
