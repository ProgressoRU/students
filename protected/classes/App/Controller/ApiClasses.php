<?php

namespace App\Controller;

use App\Libraries\Request,
    App\Libraries\Auth as Auth,
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
        $id = Request::getInt('id'); //id предмета
        $this->response('status', 0);
        //Получаем ID курса, для которого преподается предмет
        try {
            $courseId = $this->pixie->db->query('select')->table('tblclasses')
                ->fields('CourseID')
                ->where('ClassID', $id)
                ->limit(1)
                ->execute()->current();
        } catch (Exception $e) {
            $this->response('status', 0);
            error_log($e->getMessage());
        }
        //Если прошлый блок выполнился
        if (isset($courseId)) {
            //проверяем совпадает ли курс пользователя с курсом предмета
            if (Auth::checkPermissions($this->pixie, $courseId->CourseID)) {
                $this->response('lectures', array());
                //получаем список лекций
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
            } else
                $this->response('status', 403);
        } else {
            $this->response('status', 403);
        }
    }

}
