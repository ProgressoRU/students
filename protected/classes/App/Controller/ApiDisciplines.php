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
        if (Auth::checkCookie($this->pixie)) {
            $role = Auth::getRole($this->pixie);
            $course = Auth::getCourse($this->pixie);
            $uID = isset($_COOKIE['id']) ? $_COOKIE['id'] : 0;
            if ($role != null) {
                if ($role == 'student') {
                    if ($course != null) {
                        try {
                            $this->response('status', 1);
                            $this->response('disciplines',
                                $this->pixie->db->query('select')->table('disciplines')->
                                where('course_id', $course)->
                                execute()->as_array());
                        } catch (Exception $e) {
                            $this->response('status', 0);
                            error_log($e->getMessage());
                        }
                    }
                } elseif ($role = 'admin') {
                    try {
                        $this->response('status', 1);
                        $this->response('disciplines',
                            $this->pixie->db->query('select')->table('disciplines')->
                            where('teacher_id', $uID)->
                            execute()->as_array());
                    } catch (Exception $e) {
                        $this->response('status', 0);
                        error_log($e->getMessage());
                    }
                }
            }
        }
    }

    public function action_info()
    {
        $id = Request::getInt('id'); //id предмета
        $this->response('status', 0);
        $role = Auth::getRole($this->pixie);
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
            if (Auth::checkPermissions($this->pixie, $courseId->course_id) || $role== 'admin') {
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
                        //для того, чтобы выбрать вложения только для передаваемых лекций заберем их из уже
                        //сформированной части респонса
                        $lecturesList = array();
                        foreach ($this->response('lectures') as $lecture)
                            $lecturesList[] = $lecture->lecture_id;
                        $lecturesString = implode(",", $lecturesList); //превращаем массив в строку, разделяемую ','
                        $this->response('attachments',
                            $this->pixie->db->query('select')->table('attachments')
                                //условие: where lecture_id IN <номера лекций>
                                ->where('lecture_id', 'IN', $this->pixie->db->expr('(' . $lecturesString . ')'))
                                ->execute()->as_array());
                        //и результаты для текущего студента
                        if (isset ($_COOKIE['id']) && $role!='admin') {
                            $this->response('results',
                                $this->pixie->db->query('select')->table('lecture_results')
                                    ->where('lecture_id', 'IN', $this->pixie->db->expr('(' . $lecturesString . ')'))
                                    ->where('user_id', $_COOKIE['id'])
                                    ->execute()->as_array());
                        }
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
