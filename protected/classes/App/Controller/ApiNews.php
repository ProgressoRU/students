<?php

namespace App\Controller;

class ApiNews extends \App\Page {

    public function action_index() {
        $this->view->subview = 'json';
        $response = array(
            'status' => 0,
            'message' => 'News list is empty!',
            'news' => array()
        );

        $response['status'] = 1;
        $response['message'] = 'News list';
        $response['news'] = $this->pixie->db->query('select')->table('tblNews')->execute()->as_array();

        $this->view->response = $response;
    }

}