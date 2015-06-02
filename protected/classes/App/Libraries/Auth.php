<?php
namespace App\Libraries;

use Exception;

abstract class Auth
{

    public static function checkCookie(\App\Pixie $pixie)
    {
        //Проверяем наличие куки
        if (!isset($_COOKIE['id']) || !isset($_COOKIE['hash']))
            return false;

        $id = $_COOKIE['id'];
        $hash = $_COOKIE['hash'];

        //находим пользователя, соответствующего кукам
        $user = $pixie->db->query('select')->table('users')
            ->where('user_id', $id)
            ->where('session_hash', $hash)
            ->execute()->current();
        //проверяем совпадают ли последний IP и браузер с текущими
        if (
            (empty($user)) || (!property_exists($user, 'last_ip') || $user->last_ip != $_SERVER['REMOTE_ADDR'])
            || (!property_exists($user, 'useragent') || $user->useragent != $_SERVER['HTTP_USER_AGENT'])
        ) {
            //если что-то не совпало, то трем сессию пользователя
            $pixie->db->query('update')->table('users')
                ->data(array(
                    'session_hash' => '',
                    'last_ip' => '127.0.0.1',
                    'useragent' => ''
                ))
                ->where('user_id', $id)
                ->execute();
            return false;
        }
        return true;
    }

    public static function getRole(\App\Pixie $pixie)
    {
        $role = null;
        if (isset($_COOKIE['id']))
            $id = $_COOKIE['id'];
        else
            return $role;
        $query = $pixie->db->query('select')->table('users')
            ->fields('role')
            ->where('user_id', $id)
            ->execute()->current();
        if (isset($query))
            $role = $query->role;
        else $role = null;
        return $role;
    }

    public static function login(\App\Pixie $pixie, $login, $pass, $rememberMe = false)
    {
        $reply = array();
        $passHash = crypt($pass, '$5$rounds=5000$Geronimo$');
        //пытаемся получить информацию о пользователе
        $reply = $pixie->db->query('select')->table('users')
            ->fields('user_id', 'username', 'surname', 'name', 'patronymic', 'role', 'group')
            ->where('username', $login)
            ->where('pass_hash', $passHash)
            ->execute()->as_array();
        //если пользователь найден, то создаем хэш сессии
        if (!empty($reply)) {
            $hash = md5(uniqid(rand(), true));
            //заносим в БД сессию, IP и useragent
            $pixie->db->query('update')->table('users')
                ->data(array(
                    'session_hash' => $hash,
                    'last_ip' => $_SERVER['REMOTE_ADDR'],
                    'useragent' => $_SERVER['HTTP_USER_AGENT']))
                ->where('user_id', $reply[0]->user_id)
                ->execute();
            if (!$rememberMe) {
                //Устанавливем куки (на час)
                setcookie("id", $reply[0]->user_id, time() + 3600, '/');
                setcookie("hash", $hash, time() + 3600, '/');
            } else {
                //куки на месяц
                setcookie("id", $reply[0]->user_id, time() + 2592000, '/');
                setcookie("hash", $hash, time() + 2592000, '/');
            }
        }
        return $reply;
    }

    public static function logout(\App\Pixie $pixie)
    {
        //TODO: добавить проверки
        if (isset($_COOKIE['id'])) $id = $_COOKIE['id'];
        else return false;
        $pixie->db->query('update')->table('users')
            ->data(array(
                'session_hash' => '',
                'last_ip' => '127.0.0.1',
                'useragent' => ''
            ))
            ->where('user_id', $id)
            ->execute();

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