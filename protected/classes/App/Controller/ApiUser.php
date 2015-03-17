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
            $id = $_COOKIE['id'];
            try {
                $this->response('user', $this->pixie->db->query('select')->table('users')
                    ->fields('user_id', 'username', 'surname', 'name', 'patronymic', 'group_id', 'role','groups.course_id')
                    ->where('user_id', $id)
                    ->join('groups', array('groups.group_id', 'users.group_id'), 'inner')
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
            $this->response(null, Auth::login(($this->pixie), $login, $pass));
        }
    }

    public function action_logout()
    {
        if (Auth::logout($this->pixie)) {
            $this->response('status', true);
        } else $this->response('status', false);
    }

}

