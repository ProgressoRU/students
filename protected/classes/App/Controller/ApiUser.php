<?php

namespace App\Controller;

use App\Libraries\Request,
    Exception,
    App\Libraries\Auth;

class ApiUser extends ApiController
{

    public function action_auth()
    {
        $this->response('user', array());
        $login = Request::getString('username');
        $pass = Request::getString('pass');
        $rememberMe = Request::getBool('rememberMe');
        $user = Auth::login(($this->pixie), $login, $pass, $rememberMe);
        if (!empty($user)) {
            $this->response('user', $user);
        } else
            return $this->forbidden(41);
        return $this->ok(40);
    }

    public function action_check_auth()
    {
        $this->isAuthorized(false) ? $this->ok() : $this->unauthorized(-1);
    }

    public function action_restore_session()
    {
        $this->response('user', array());
        if (!$this->isAuthorized()) {
            return true;
        }
        $id = isset($_COOKIE['id']) ? $_COOKIE['id'] : 0;
        $this->response('user', $this->pixie->db->query('select')->table('users')
            ->fields('user_id', 'username', 'surname', 'name', 'patronymic', 'group', 'role')
            ->where('user_id', $id)
            ->execute()->as_array());
        if ($this->response('user') != null) {
            return $this->ok();
        } else
            return $this->unauthorized(-1);
    }

    public function action_logout()
    {
        if (Auth::logout($this->pixie)) {
            return $this->ok();
        } else return $this->badRequest(-1);
    }

    public function action_reg()
    {
        $login = Request::getStringTrim('username');
        $pass = Request::getStringTrim('pass'); //пароль
        $passcode = Request::getStringTrim('passcode'); //код доступа
        $userGroup = Request::getString('group');
        $name = Request::getStringTrim('name');
        $surname = Request::getStringTrim('surname');
        $role = Request::getString('role');

        if (empty($login) || strlen($login) < 4) {
            return $this->badRequest(31);
        }

        if (empty($pass) || strlen($pass) < 6) {
            return $this->badRequest(32);
        }

        if (empty($name) || empty($surname)) {
            return $this->badRequest(39);
        }

        if (!empty($role)) {
            if (!$this->isInRole(array('admin'), false)) {
                return $this->forbidden(42);
            }
        }

        if (empty($role)) {
            if (empty($passcode)) {
                return $this->badRequest(33);
            }
            if (empty($userGroup)) {
                return $this->badRequest(34);
            }
        }

        //passcode check
        if (empty($role)) {
            $group = $this->pixie->db->query('select')->table('groups')
                ->where('passcode', $passcode)
                ->execute()->current();
            if (!isset($group) || empty ($group)) {
                return $this->badRequest(36);
            }
            $groupId = $group->group_id;
            $expirationDate = $group->expire_date;
            if (!empty ($expirationDate)) {
                $expirationDate = new \DateTime($expirationDate);
                $today = time();
                if ($expirationDate->getTimestamp() < $today) {
                    return $this->badRequest(35);
                }
            }
        }

        //доступность имени
        $user = $this->pixie->db->query('select')->table('users')
            ->where('username', $login)
            ->execute()->current();
        if (!empty($user)) {
            return $this->badRequest(37);
        }

        //добавление пользователя
        if (empty($role)) {
            $this->pixie->db->query('insert')->table('users')
                ->data(array('username' => $login, 'role' => 'student', 'group' => $userGroup,
                    'pass_hash' => crypt($pass, '$5$rounds=5000$Geronimo$'), 'name' => $name, 'surname' => $surname))
                ->execute();
            $uId = $this->pixie->db->insert_id();
            $this->pixie->db->query('insert')->table('subscriptions')
                ->data(array('user_id' => $uId, 'group_id' => $groupId, 'is_editor' => '0'))
                ->execute();
            return $this->ok(30);
        } else {
            $this->pixie->db->query('insert')->table('users')
                ->data(array('username' => $login, 'role' => $role, 'name' => $name, 'surname' => $surname,
                    'pass_hash' => crypt($pass, '$5$rounds=5000$Geronimo$')))
                ->execute();
            return $this->ok(30);
        }
    }

    public function action_user_list()
        //TODO: организовать отдельный контроллер для админских штук?
    {
        // Проверка прав доступа (Функция в ApiController)
        if (!$this->isInRole(array('admin'), false)) {
            return true;
        }

        $this->response('userList', $this->pixie->db->query('select')->table('users')
            ->fields('username', 'surname', 'role', 'name', 'user_id')
            ->where('role', 'teacher')
            ->where('OR', array('role', 'admin'))
            ->execute()->as_array());

        return $this->ok();
    }

    public function action_rights()
    {
        // Проверка прав доступа (Функция в ApiController)
        if (!$this->isInRole(array('admin'), false)) {
            return true;
        }

        $uId = Request::getInt('uId');
        $rights = Request::getStringTrim('rights');
        switch ($rights) {
            case 'admin':
                $this->pixie->db->query('update')->table('users')
                    ->data(array('role' => 'admin'))
                    ->where('user_id', $uId)
                    ->execute();
                break;
            case 'student': {
                $currentRights = $this->pixie->db->query('select')->table('users')
                    ->fields('role')
                    ->where('user_id', $uId)
                    ->execute()->current();
                if ($currentRights != 'admin') {
                    $this->pixie->db->query('update')->table('users')
                        ->data(array('role' => 'student'))
                        ->where('user_id', $uId)
                        ->execute();
                } else
                    return $this->forbidden(42);
                break;
            }
        }
        return $this->ok(43);
    }
}

