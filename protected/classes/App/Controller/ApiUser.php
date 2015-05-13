<?php

namespace App\Controller;

use App\Libraries\Request,
    Exception,
    App\Libraries\Auth;

class ApiUser extends ApiController
{

    public function action_auth()
    {
        $this->response('status', 403);
        $this->response('user', array());
        if (Auth::checkCookie($this->pixie)) {
            $id = isset($_COOKIE['id']) ? $_COOKIE['id'] : 0;
            try {
                $this->response('user', $this->pixie->db->query('select')->table('users')
                    ->fields('user_id', 'username', 'surname', 'name', 'patronymic', 'group', 'role')
                    ->where('user_id', $id)
                    ->execute()->as_array());
            } catch (Exception $e) {
                error_log($e->getMessage());
            }
            if ($this->response('user') != null) {
                $this->response('status', 200); //200: OK
            }
        } else {
            $login = Request::getString('username');
            $pass = Request::getString('pass');
            $rememberMe = Request::getBool('rememberMe');
            $this->response(null, Auth::login(($this->pixie), $login, $pass, $rememberMe));
        }
    }

    public function action_logout()
    {
        if (Auth::logout($this->pixie)) {
            $this->response('status', true);
        } else $this->response('status', false);
    }

    public function action_reg()
    {
        $login = Request::getStringTrim('username');
        $pass = Request::getStringTrim('pass'); //пароль
        $passcode = Request::getStringTrim('passcode'); //код доступа
        $userGroup = Request::getString('group');
        $name = Request::getStringTrim('name');
        $surname = Request::getStringTrim('surname');
        $checks = true;
        if (empty($login) || strlen($login) < 4) {
            $this->response('status', 21);
            $checks = false;
        }
        if (empty($pass) || strlen($pass) < 6) {
            $this->response('status', 22);
            $checks = false;
        }
        if (empty($passcode)) {
            $this->response('status', 23);
            $checks = false;
        }
        if (empty($userGroup)) {
            $this->response('status', 24);
            $checks = false;
        }
        if (empty($name) || empty($surname)) {
            $this->response('status', 29);
            $checks = false;
        }
        if ($checks) {
            //passcode check
            $valid = true; //метка валидностии пассфразы
            $group = $this->pixie->db->query('select')->table('groups')
                ->where('passcode', $passcode)
                ->execute()->current();
            if (!isset($group) || empty ($group)) {
                $valid = false;
                $this->response('status', 26);
            } else {
                $groupId = $group->group_id;
                $expirationDate = $group->expire_date;
                if (!empty ($expirationDate)) {
                    $expirationDate = new \DateTime($expirationDate);
                    $today = time();
                    if ($expirationDate->getTimestamp() < $today) {
                        $valid = false;
                        $this->response('status', 25);
                    }
                }
                if ($valid) {
                    $nameOccupied = false; //метка доступности имени
                    $user = $this->pixie->db->query('select')->table('users')
                        ->where('username', $login)
                        ->execute()->current();
                    if (!empty($user)) {
                        $nameOccupied = true;
                        $this->response('status', 27);
                    }
                    if (!$nameOccupied) {
                        try {
                            //добавление пользователя
                            $this->pixie->db->query('insert')->table('users')
                                ->data(array('username' => $login, 'role' => 'student', 'group' => $userGroup,
                                    'pass_hash' => crypt($pass, '$5$rounds=5000$Geronimo$'), 'name' => $name, 'surname' => $surname))
                                ->execute();
                            $uId = $this->pixie->db->insert_id();
                            $this->pixie->db->query('insert')->table('subscriptions')
                                ->data(array('user_id' => $uId, 'group_id' => $groupId, 'is_editor' => '0'))
                                ->execute();
                            $this->response('status', 200);
                        } catch (Exception $e) {
                            $this->response('status', 28);
                            error_log($e->getMessage());
                        }
                    }
                }
            }
        }
    }

}

