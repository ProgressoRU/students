<?php

namespace App\Controller;

use App\Libraries\Auth as Auth,
    Exception;

class ApiNews extends \App\Page
{

    public function action_index()
    {
        $this->view->subview = 'json';
        $response = array(
            'status' => 403, //forbidden
            'news' => array()
        );

        try {
            $response['news'] = $this->pixie->db->query('select')->table('tblNews')->execute()->as_array();
            $response['status'] = 200;
        } catch (Exception $e) {
            $response['status'] = 403; //forbidden
        }

        $auth = Auth::checkCookie($this->pixie); //TODO: Non-static method should not be called statically
        if (!$auth)
            $response['status'] = 403;

        $this->view->response = $response;
    }

}