<?php

namespace App\Controller;

use App\Libraries\Request,
    App\Libraries\Auth as Auth,
    Exception;

class ApiDisciplines extends ApiController
{

    public function action_index()
    {
        $this->response('status', 0);
        $this->response('disciplines', array());
        try {
            $this->response('status', 1);
            $this->response('disciplines', $this->pixie->db->query('select')->table('disciplines')->execute()->as_array());
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
            $courseId = $this->pixie->db->query('select')->table('disciplines')
                ->fields('course_id')
                ->where('discipline_id', $id)
                ->limit(1)
                ->execute()->current();
        } catch (Exception $e) {
            $this->response('status', 0);
            error_log($e->getMessage());
        }
        //Если прошлый блок выполнился
        if (isset($courseId)) {
            //проверяем совпадает ли курс пользователя с курсом предмета
            if (Auth::checkPermissions($this->pixie, $courseId->course_id)) {
                $this->response('lectures', array());
                //получаем список лекций
                try {
                    $this->response('lectures',
                        $this->pixie->db->query('select')->table('lectures')
                            ->fields('lecture_id', 'date_dead_line', 'discipline_id', 'title', 'description')
                            ->where('discipline_id', $id)
                            ->where('is_visible', 1)
                            ->execute()->as_array());
                    //получаем связанные вложения
                    if ($this->response('lectures')) {
                        $this->response('attachments',
                            $this->pixie->db->query('select')->table('attachments')
                                ->where('lecture_id', 'IN',
                                    $this->pixie->db->query('select')->table('lectures')
                                        ->fields('lecture_id')
                                        ->where('discipline_id',$id))
                                ->execute()->as_array());
                    }
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
