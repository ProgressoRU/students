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

    public static function getRole(\App\Pixie $pixie)
    {
        $role = null;
        if (isset($_COOKIE['id']))
            $id = $_COOKIE['id'];
        else
            return $role;
        try {
            $query = $pixie->db->query('select')->table('users')
                ->fields('role')
                ->where('user_id', $id)
                ->execute()->current();
        } catch (Exception $e) {
            error_log($e->getMessage());
        }
        if (isset($query))
            $role = $query->role;
        else $role = null;
        return $role;
    }

    public static function login(\App\Pixie $pixie, $login, $pass, $rememberMe = false)
    {
        $reply = array(
            'status' => 403, //403: Forbidden
            'user' => array()
        );
        $passHash = crypt($pass, '$5$rounds=5000$Geronimo$');
        //пытаемся получить информацию о пользователе
        try {
            $reply['user'] = $pixie->db->query('select')->table('users')
                ->fields('user_id', 'username', 'surname', 'name', 'patronymic', 'role', 'group')
                ->where('username', $login)
                ->where('pass_hash', $passHash)
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
            if (!$rememberMe) {
                //Устанавливем куки (на час)
                setcookie("id", $reply['user'][0]->user_id, time() + 3600, '/');
                setcookie("hash", $hash, time() + 3600, '/');
            } else {
                //куки на месяц
                setcookie("id", $reply['user'][0]->user_id, time() + 2592000, '/');
                setcookie("hash", $hash, time() + 2592000, '/');
            }
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

    public static function getPermissions(\App\Pixie $pixie, $disciplineId)
    {
        $permission = null;
        if (isset($_COOKIE['id']))
            $uID = $_COOKIE['id'];
        else
            return $permission;
        try {
            $discipline = $pixie->db->query('select')->table('disciplines')
                ->where('discipline_id', $disciplineId)
                ->execute()->current();
        } catch (Exception $e) {
            error_log($e->getMessage());
        }
        if (isset($discipline) && !empty($discipline)) {
            if ($discipline->creator_id == $uID) {
                $permission = 'creator';
                return $permission;
            } else {
                //получаем права пользователя
                try {
                    $subscription = $pixie->db->query('select')->table('subscriptions')
                        ->where('user_id', $uID)
                        ->where('group_id', 'IN', $pixie->db->query('select')->table('group_access')
                            ->fields('group_id')
                            ->where('discipline_id', $disciplineId))
                        ->execute()->current();
                } catch (Exception $e) {
                    error_log($e->getMessage());
                }
                if (isset($subscription) && !empty($subscription)) {
                    //error_log(print_r($subscription));
                    if ($subscription->is_editor == 1) {
                        $permission = 'editor';
                        return $permission;
                    } else {
                        $permission = 'subscriber';
                        return $permission;
                    }
                } else $permission = null;
            }
        }
        return $permission;
    }

    public static function getGroupId(\App\Pixie $pixie, $disciplineId)
    {
        $groupId = null;
        if (isset($_COOKIE['id']))
            $uID = $_COOKIE['id'];
        else
            return $groupId;

        $group = $pixie->db->query('select')->table('subscriptions')
            ->where('user_id', $uID)
            ->where('group_id', 'IN', $pixie->db->query('select')->table('group_access')
                ->fields('group_id')
                ->where('discipline_id', $disciplineId))
            ->execute()->current();

        if (isset($group) && !empty($group))
            $groupId = $group->group_id;

        return $groupId;
    }
}