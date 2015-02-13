<?php

namespace App\Controller;

class ApiCourses extends \App\Page {

    public function action_index() {
        $this->view->subview = 'json';
        $response = array(
            'status' => 0,
            'message' => 'Course list is empty!',
            'courses' => array()
        );

        $response['status'] = 1;
        $response['message'] = 'Course list';
        $response['courses'] = $this->pixie->db->query('select')->table('tblcourses')->execute()->as_array();

        $this->view->response = $response;
    }

}
