<?php

namespace App\Controller;

use App\Libraries\Request,
    //App\Libraries\Auth,
    Exception;

class ApiUser extends \App\Page {

    public function action_auth() {
        $this->view->subview = 'json';
        $response = array(
            'status' => 0,
            'message' => 'unsuccessfull',
            'user' => array()
        );
        $login = Request::getString('username');
        $pass = Request::getString('pass');
        $passHash = md5(md5($pass));
        try
        {
            $response['user'] = $this->pixie->db->query('select')->table('tblusers')
                ->where('username', $login)
                ->where('passHash',$passHash)
            ->execute()->as_array();
        }
        catch (Exception $e)
        {
            $response['message'] = 'SQL Error\nIt\'s might help:\n'.$e->getMessage();
            $this->view->response = $response;
        }
        //echo ;
        if ($response['user'] != null)
        {
            $response['status'] = 1;
            $response['message'] = 'Success';
            $hash = md5(uniqid(rand(),true));
            try
            {
                $this->pixie->db->query('update')->table('tblusers')
                    ->data(array(
                        'sessionHash' => $hash,
                        'lastIp'=>$_SERVER['REMOTE_ADDR'],
                        'useragent'=>$_SERVER['HTTP_USER_AGENT']))
                    ->where('uid', $response['user'][0]->uID)
                    ->execute();
            }
            catch (Exception $e)
            {
                $response['message'] = 'User is found, but session update caused an error\nIt\'s might help:\n'.$e->getMessage();
            }
                //Устанавливем куки (на час)
                setcookie("id", $response['user'][0]->uID, time()+3600);
                setcookie("hash", $hash, time()+3600);
        }
        else $response['message'] = 'User not found';


        $this->view->response = $response;
    }

}

