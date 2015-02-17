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
        try
        {
            $response['classes'] = $this->pixie->db->query('select')->table('tblclasses')->execute()->as_array();
            $response['status'] = 1;
            $response['message'] = 'Class list';
        }
        catch (exception $e)
        {
            $response['message'] = 'Houston, we have a problem.\nIt\'s might help:\n'.$e->getMessage();
        }
        $this->view->response = $response;
    }

    public function action_getLectures()
    {
        $this->view->subview = 'json';
        $id = $this->request->param('id');
        $response = array(
            'status' => 0,
            'message' => 'No lectures in this class',
            'lectures' => array()
        );
        try
        {
            $response['lectures'] = $this->pixie->db->query('select')->table('tblarticles')
                ->where('intclass', $id)
                ->where('isVisible', 1)
            ->execute()->as_array();
            $response['status'] = 1;
            $response['message'] = 'Lecture list for class id '.$id;
        }
        catch (exception $e)
        {
            $response['message'] = 'Houston, we have a problem.\nIt\'s might help:\n'.$e->getMessage();
        }

        $this->view->response = $response;
    }

}
