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
            $user = $pixie->db->query('select')->table('users')
                ->where('user_id', $id)
                ->where('session_hash', $hash)
                ->execute()->current();

            //проверяем совпадают ли последний IP и браузер с текущими
            if (
                (!property_exists($user, 'last_ip') || $user->last_ip != $_SERVER['REMOTE_ADDR'])
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
                $pixie->db->query('update')->table('users')
                    ->data(array(
                        'session_hash' => '',
                        'last_ip' => '127.0.0.1',
                        'useragent' => ''
                    ))
                    ->where('user_id', $id)
                    ->execute();
            } catch (Exception $e) {
                error_log($e->getMessage());
            }
        }
        return $isOk;
    }

    public static function checkPermissions(\App\Pixie $pixie, $course = null, $role = null)
    {
//перед вызовом этой функции куки должны бьть проверены.
//Можно ли в этом убедиться?
        $accessGranted = false;
        if (isset($_COOKIE['id']))
            $id = $_COOKIE['id'];
        else
            return $accessGranted;
        try {
            //выясняем роль и курс
            $permissions = $pixie->db->query('select')->table('users')
                ->fields('user_id', 'group_id', 'role', 'groups.course_id')
                ->where('user_id', $id)
                ->join('groups', array('groups.group_id', 'users.group_id'), 'inner')
                ->execute()->current();
        } catch (Exception $e) {
            error_log($e->getMessage());
        }
        if ($course != null) {
            if ($permissions->course_id != $course) {
                $accessGranted = false;
                return $accessGranted;
            } else $accessGranted = true;
        }
        if ($role != null) {
            if ($permissions->role != $role) {
                $accessGranted = false;
                return $accessGranted;
            } else $accessGranted = true;
        }

        return $accessGranted;
    }

    public static function login(\App\Pixie $pixie, $login, $pass)
    {
        $reply = array(
            'status' => 403, //403: Forbidden
            'user' => array()
        );
        $passHash = md5(md5($pass)); //TODO: заменить на SHA
        //пытаемся получить информацию о пользователе
        try {
            $reply['user'] = $pixie->db->query('select')->table('users')
                ->fields('user_id', 'username', 'surname', 'name', 'patronymic', 'group_id', 'role', 'groups.course_id')
                ->where('username', $login)
                ->where('pass_hash', $passHash)
                ->join('groups', array('groups.group_id', 'users.group_id'), 'inner')
                ->execute()->as_array();
        } catch (Exception $e) {
            error_log('SQL Error\nIt\'s might help:\n' . $e->getMessage());
            return $reply;
        }
        //если пользователь найден, то создаем хэш сессии
        if ($reply['user'] != null) {
            $reply['status'] = 200; //200: OK
            $hash = md5(uniqid(rand(), true));
            //заносим в БД сессию, IP и useragent
            try {
                $pixie->db->query('update')->table('users')
                    ->data(array(
                        'session_hash' => $hash,
                        'last_ip' => $_SERVER['REMOTE_ADDR'],
                        'useragent' => $_SERVER['HTTP_USER_AGENT']))
                    ->where('user_id', $reply['user'][0]->user_id)
                    ->execute();
            } catch (Exception $e) {
                error_log('User is found, but session update caused an error\nIt\'s might help:\n' . $e->getMessage());
            }
            //Устанавливем куки (на час)
            setcookie("id", $reply['user'][0]->user_id, time() + 3600, '/');
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
            $pixie->db->query('update')->table('users')
                ->data(array(
                    'session_hash' => '',
                    'last_ip' => '127.0.0.1',
                    'useragent' => ''
                ))
                ->where('user_id', $id)
                ->execute();
        } catch (Exception $e) {
            error_log($e->getMessage());
        }

        setcookie("id", "", 0, '/');
        setcookie("hash", "", 0, '/');

        return true;
    }
}
