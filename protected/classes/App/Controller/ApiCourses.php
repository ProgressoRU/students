<?php

namespace App\Controller;

use Exception;

class ApiCourses extends ApiController
{

    public function action_index()
    {
        $this->response('status', 0);
        $this->response('courses', array());
        try {
            $this->response('status', 0);
            $this->response('courses', $this->pixie->db->query('select')->table('tblcourses')->execute()->as_array());
        } catch (Exception $e) {
            $this->response('status', 0);
            error_log($e->getMessage());
        }
    }

}
