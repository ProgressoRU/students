<?php

namespace App\Controller;

use Exception;

class ApiNews extends ApiController
{

    public function action_index()
    {
        $this->response('status', 400);
        $this->response('news', array());

        try {
            $this->response('status', 200);
            $this->response('news', $this->pixie->db->query('select')->table('tblNews')->execute()->as_array());
        } catch (Exception $e) {
            error_log($e->getMessage());
            $this->response('status', 400);
        }

        //$this->notFound();
    }

}