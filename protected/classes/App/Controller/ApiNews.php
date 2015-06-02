<?php

namespace App\Controller;

use Exception,
    App\Libraries\Request,
    App\Libraries\Auth as Auth;

class ApiNews extends ApiController
{

    public function action_index()
    {
        $this->response('news', array());
        $this->response('news', $this->pixie->db->query('select')->table('news')->execute()->as_array());
        return $this->ok();
    }

    public function action_edit()
    {
        $newsId = Request::getInt('id');
        $newsTitle = Request::getString('title');
        $newsText = Request::getString('news');
        $newsLabel = Request::getInt('label');
        if ($newsLabel == null || ($newsLabel != 0 && $newsLabel != 1 && $newsLabel != 2))
            $newsLabel = 0;

        if ($newsTitle == null || $newsText == null)
            return $this->badRequest(11);

        if (!$this->isInRole(array('admin'))) {
            return $this->forbidden();
        }

        if ($newsId != 0) {
            $this->pixie->db->query('update')->table('news')->
            data(array('title' => $newsTitle, 'news' => $newsText, 'importance' => $newsLabel))->
            where('news_id', $newsId)->
            execute();
            return $this->ok(10);
        } elseif ($newsId == 0) {
            $this->pixie->db->query('insert')->table('news')->
            data(array('title' => $newsTitle, 'news' => $newsText, 'importance' => $newsLabel, 'date_created' => date('Y-m-d G:i:s')))->
            execute();
            return $this->ok(10);
        } else
            return $this->badRequest();
    }

    public function action_delete()
    {
        $newsId = Request::getInt('id');
        if (!$this->isInRole(array('admin'))) {
            return $this->forbidden();
        }

        $this->pixie->db->query('delete')->table('news')->
        where('news_id', $newsId)->
        execute();

        return $this->ok(13);

    }

}