<?php

namespace App\Controller;

use App\Libraries\Request,
    Exception,
    App\Libraries\Auth;

class ApiUser extends \App\Page
{

    public function action_auth()
    {
        $this->view->subview = 'json';
        $response = array(
            'status' => 403,
            'user' => array()
        );
        if (Auth::checkCookie($this->pixie)) {
            $id = $_COOKIE['id'];
            try {
                $response['user'] = $this->pixie->db->query('select')->table('tblusers')
                    ->fields('uID', 'username', 'txtSurname', 'txtName', 'txtPatronymic', 'GroupID', 'txtRole')
                    ->where('uID', $id)
                    ->execute()->as_array();
            } catch (Exception $e) {
                error_log($e->getMessage());
                $this->pixie->view->response = $response; //is this right?
            }
            if ($response['user'] != null) {
                $response['status'] = 200; //200: OK
            }
        } else {
            $login = Request::getString('username');
            $pass = Request::getString('pass');
            $response = Auth::login(($this->pixie),$login,$pass);
        }
        $this->view->response = $response;
    }

    public function action_logout(){
        $this->view->subview = 'json';
        if (Auth::logout($this->pixie)) {
            $response = true;
        }
        else $response = false;

        $this->view->response = $response;
    }

}

