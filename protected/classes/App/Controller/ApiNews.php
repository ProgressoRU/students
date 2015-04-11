<?php

namespace App\Controller;

use Exception,
    App\Libraries\Request,
    App\Libraries\Auth as Auth;

class ApiNews extends ApiController
{

    public function action_index()
    {
        $this->response('status', 400);
        $this->response('news', array());

        try {
            $this->response('status', 1);
            $this->response('news', $this->pixie->db->query('select')->table('news')->execute()->as_array());
        } catch (Exception $e) {
            error_log($e->getMessage());
            $this->response('status', 400);
        }

        //$this->notFound();
    }

    public function action_edit()
    {
        $this->response('status', 403);
        $newsId = Request::getInt('id');
        $newsTitle = Request::getString('title');
        $newsText = Request::getString('news');
        $newsLabel = Request::getInt('label');
        if ($newsLabel == null || ($newsLabel != 0 && $newsLabel != 1 && $newsLabel != 2))
            $newsLabel = 0;
        if ($newsTitle == null || $newsText == null)
            $this->response('status', 25);
        elseif (Auth::checkCookie($this->pixie)) {
            $role = Auth::getRole($this->pixie);
            if ($role != null) {
                if ($role == 'admin') {
                    try {
                        $this->response('status', 200);
                        $this->pixie->db->query('update')->table('news')->
                        data(array('title' => $newsTitle, 'news' => $newsText, 'importance' => $newsLabel))->
                        where('news_id', $newsId)->
                        execute();
                    } catch (Exception $e) {
                        error_log($e->getMessage());
                        $this->response('status', 403);
                    }
                }
            }
        }
    }

    public function action_delete()
    {
        $this->response('status', 403);
        $newsId = Request::getInt('id');
        if (Auth::checkCookie($this->pixie)) {
            $role = Auth::getRole($this->pixie);
            if ($role != null) {
                if ($role == 'admin') {
                    try {
                        $this->response('status', 1);
                        $this->pixie->db->query('delete')->table('news')->
                        where('news_id', $newsId)->
                        execute();
                    } catch (Exception $e) {
                        error_log($e->getMessage());
                        $this->response('status', 403);
                    }
                }
            }
        }
    }

}