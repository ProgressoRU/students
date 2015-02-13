<?php

namespace App\Controller;

class ApiClasses extends \App\Page {

    public function action_index() {
        $this->view->subview = 'json';
        $response = array(
            'status' => 0,
            'message' => 'Class list is empty!',
            'classes' => array()
        );

        $response['classes'] = $this->pixie->db->query('select')->table('tblclasses')->execute()->as_array();
        $response['status'] = 1;
        $response['message'] = 'Class list';

        $this->view->response = $response;
    }

}
