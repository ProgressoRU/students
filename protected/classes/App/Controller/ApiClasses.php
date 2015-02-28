<?php

namespace App\Controller;

use App\Libraries\Request,
    Exception;

class ApiClasses extends ApiController
{

    public function action_index()
    {
        $this->response('status', 0);
        $this->response('classes', array());
        try {
            $this->response('status', 1);
            $this->response('classes', $this->pixie->db->query('select')->table('tblclasses')->execute()->as_array());
        } catch (Exception $e) {
            $this->response('status', 0);
            error_log($e->getMessage());
        }
    }

    public function action_info()
    {
        $id = Request::getInt('id');
        $this->response('status', 0);
        $this->response('lectures', array());
        try {
            $this->response('lectures',
                $this->pixie->db->query('select')->table('tblArticles')
                    ->where('intClass', $id)
                    ->where('isVisible', 1)
                    ->execute()->as_array());
            $this->response('status', 1);
        } catch (Exception $e) {
            $this->response('status', 0);
            error_log($e->getMessage());
        }
    }

}
