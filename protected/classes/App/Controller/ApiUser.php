<?php

namespace App\Controller;

use App\Libraries\Request,
    //App\Libraries\Auth,
    Exception;

class ApiUser extends \App\Page {

    public function action_auth() {
        $this->view->subview = 'json';
        $response = array(
            'status' => 403, //403: Forbidden
            'user' => array()
        );
        $login = Request::getString('username');
        $pass = Request::getString('pass');
        $passHash = md5(md5($pass));
        try
        {
            $response['user'] = $this->pixie->db->query('select')->table('tblusers')
                ->fields('uID','username','txtSurname','txtName','txtPatronymic','GroupID','txtRole')
                ->where('username', $login)
                ->where('passHash',$passHash)
            ->execute()->as_array();
        }
        catch (Exception $e)
        {
            echo('SQL Error\nIt\'s might help:\n'.$e->getMessage());
            $this->view->response = $response; //is this right?
        }
        //echo ;
        if ($response['user'] != null)
        {
            $response['status'] = 200; //200: OK
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
                echo('User is found, but session update caused an error\nIt\'s might help:\n'.$e->getMessage());
            }
                //Устанавливем куки (на час)
                setcookie("id", $response['user'][0]->uID, time()+3600,'/' );
                setcookie("hash", $hash, time()+3600, '/');
        }
        else $response['status'] = 403; //403: Forbidden


        $this->view->response = $response;
    }

}

