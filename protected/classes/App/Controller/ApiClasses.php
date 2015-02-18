<?php

namespace App\Controller;

use App\Libraries\Request;
use Exception;

class ApiClasses extends \App\Page {

    public function action_index() {
        $this->view->subview = 'json';
        $response = array(
            'status' => 0,
            'message' => 'Class list is empty!',
            'classes' => array()
        );
        try
        {
            $response['classes'] = $this->pixie->db->query('select')->table('tblclasses')->execute()->as_array();
            $response['status'] = 1;
            $response['message'] = 'Class list';
        }
        catch (Exception $e)
        {
            $response['message'] = 'Houston, we have a problem.\nIt\'s might help:\n'.$e->getMessage();
        }
        $this->view->response = $response;
    }

    public function action_info()
    {
        $this->view->subview = 'json';
        $id = Request::getInt('id');

        $response = array(
            'status' => 0,
            'message' => 'No lectures in this class',
            'lectures' => array()
        );

        try
        {
            $response['lectures'] = $this->pixie->db->query('select')->table('tblArticles')
                ->where('intClass', $id)
                ->where('isVisible', 1)
            ->execute()->as_array();
            $response['status'] = 1;
            $response['message'] = 'Lecture list for class id '.$id;
        }
        catch (Exception $e)
        {
            $response['message'] = 'Houston, we have a problem.\nIt\'s might help:\n'.$e->getMessage();
        }

        $this->view->response = $response;
    }

}
