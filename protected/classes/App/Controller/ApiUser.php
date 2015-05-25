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
        if ($this->isAuthorized(false)) {
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
                $this->ok(200);
            }
        } else {
            $login = Request::getString('username');
            $pass = Request::getString('pass');
            $rememberMe = Request::getBool('rememberMe');
            $user = Auth::login(($this->pixie), $login, $pass, $rememberMe);
            if (!empty($user))
            {
                $this->ok(200);
                $this->response('user', $user);
            }
            else
                $this->forbidden(403);
        }
    }

    public function action_logout()
    {
        if (Auth::logout($this->pixie)) {
            $this->ok();
        } else $this->badRequest();
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
        $checks = true;
        if (empty($login) || strlen($login) < 4) {
            $this->badRequest(31);
            $checks = false;
        }
        if (empty($pass) || strlen($pass) < 6) {
            $this->badRequest(32);
            $checks = false;
        }
        if (empty($name) || empty($surname)) {
            $this->badRequest(39);
            $checks = false;
        }
        if (!empty($role)) {
            if (!Auth::checkCookie($this->pixie)) {
                $this->badRequest(41);
                $checks = false;
            }
            if (Auth::getRole($this->pixie) != 'admin') {
                $this->badRequest(40);
                $checks = false;
            }
        } else {
            if (empty($passcode)) {
                $this->badRequest(33);
                $checks = false;
            }
            if (empty($userGroup)) {
                $this->badRequest(34);
                $checks = false;
            }
        }
        if ($checks) {
            //passcode check
            $valid = true; //метка валидностии пассфразы
            if (empty($role)) {
                $group = $this->pixie->db->query('select')->table('groups')
                    ->where('passcode', $passcode)
                    ->execute()->current();
                if (!isset($group) || empty ($group)) {
                    $valid = false;
                    $this->badRequest(36);
                } else {
                    $groupId = $group->group_id;
                    $expirationDate = $group->expire_date;
                    if (!empty ($expirationDate)) {
                        $expirationDate = new \DateTime($expirationDate);
                        $today = time();
                        if ($expirationDate->getTimestamp() < $today) {
                            $valid = false;
                            $this->badRequest(35);
                        }
                    }
                }
            }
            if ($valid) {
                $nameOccupied = false; //метка доступности имени
                $user = $this->pixie->db->query('select')->table('users')
                    ->where('username', $login)
                    ->execute()->current();
                if (!empty($user)) {
                    $nameOccupied = true;
                    $this->badRequest(37);
                }
                if (!$nameOccupied) {
                    try {
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
                            $this->ok(30);
                        } else {
                            $this->pixie->db->query('insert')->table('users')
                                ->data(array('username' => $login, 'role' => $role, 'name' => $name, 'surname' => $surname,
                                    'pass_hash' => crypt($pass, '$5$rounds=5000$Geronimo$')))
                                ->execute();
                            $this->ok(30);
                        }
                    } catch (Exception $e) {
                        $this->badRequest(38);
                        error_log($e->getMessage());
                    }
                }
            }
        }
    }

    public function action_user_list()
        //TODO: организовать отдельный контроллер для админских штук?
    {
        $this->response('status', 403);
        if (Auth::checkCookie($this->pixie))
            if (Auth::getRole($this->pixie) == 'admin') {
                try {
                    $this->response('status', 200);
                    $this->response('userList', $this->pixie->db->query('select')->table('users')
                        ->fields('username', 'surname', 'role', 'name', 'user_id')
                        ->where('role', 'teacher')
                        ->where('OR', array('role', 'admin'))
                        ->execute()->as_array());
                } catch (Exception $e) {
                    $this->response('status', 403);
                    error_log($e->getMessage());
                }
            } else
                $this->response('status', 403);
    }

    public function action_rights()
    {
        $this->response('status',403);
        $uId = Request::getInt('uId');
        $rights = Request::getStringTrim('rights');
        if (Auth::checkCookie($this->pixie))
            if (Auth::getRole($this->pixie) == 'admin') {
                if($rights == 'admin')
                {
                    try{
                        $this->response('status',200);
                        $this->pixie->db->query('update')->table('users')
                            ->data(array('role' => 'admin'))
                            ->where('user_id', $uId)
                            ->execute();
                    }
                    catch(Exception $e)
                    {
                        $this->response('status',403);
                        error_log($e->getMessage());
                    }
                }
                elseif($rights == 'student')
                {
                    $currentRights = $this->pixie->db->query('select')->table('users')
                        ->fields('role')
                        ->where('user_id', $uId)
                        ->execute()->current();
                    if ($currentRights != 'admin')
                    {
                        try{
                            $this->response('status',200);
                            $this->pixie->db->query('update')->table('users')
                                ->data(array('role' => 'student'))
                                ->where('user_id', $uId)
                                ->execute();
                        }
                        catch(Exception $e)
                        {
                            $this->response('status',403);
                            error_log($e->getMessage());
                        }
                    }
                    else
                        $this->response('status',20);
                }
                else $this->response('status',21);
            }
        else $this->response('status',22);
    }
}

