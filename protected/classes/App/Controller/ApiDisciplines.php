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
            try {
                $this->response('status', 1);
                $this->response('disciplines',
                    $this->pixie->db->query('select')->table('disciplines')->
                    execute()->as_array());
            } catch (Exception $e) {
                $this->response('status', 0);
                error_log($e->getMessage());
            }
        }
    }

    public function action_my_disciplines()
    {
        $this->response('status', 0);
        $this->response('disciplines', array());
        if (Auth::checkCookie($this->pixie)) {
            $role = Auth::getRole($this->pixie);
            $uID = isset($_COOKIE['id']) ? $_COOKIE['id'] : 0;
            if ($role != null) {
                try {
                    $this->response('status', 1);
                    $this->response('disciplines',
                        $this->pixie->db->query('select')->table('disciplines')
                            ->join('subscriptions', array('subscriptions.discipline_id', 'discipline_id'), 'inner')
                            ->where('subscriptions.user_id', $uID)
                            ->where('subscriptions.status', 1)
                            ->execute()->as_array());
                } catch (Exception $e) {
                    $this->response('status', 0);
                    error_log($e->getMessage());
                }
            }
        }
    }

    public function action_info()
    {
        $id = Request::getInt('id'); //id предмета
        $this->response('status', 0);
        $role = Auth::getRole($this->pixie); //роль пользователя
        if (Auth::checkCookie($this->pixie)) {
            $uID = isset($_COOKIE['id']) ? $_COOKIE['id'] : 0;
            //Получаем название и описание предмета
            try {
                $this->response('discipline',
                    $this->pixie->db->query('select')->table('disciplines')->
                    fields('title', 'description')->
                    where('discipline_id', $id)->
                    execute()->current());
            } catch (Exception $e) {
                $this->response('status', 0);
                error_log($e->getMessage());
            }
            //Ищем совпадение предмета и пользователя в подписках
            try {
                $subscription = $this->pixie->db->query('select')->table('subscriptions')
                    ->where('discipline_id', $id)
                    ->where('user_id', $uID)
                    ->limit(1)
                    ->execute()->current();
            } catch (Exception $e) {
                $this->response('status', 0);
                error_log($e->getMessage());
            }
            //Если прошлый блок выполнился
            if (isset($subscription) && !empty($subscription)) {
                if ($subscription->status == 1) $isSubscribed = true; else $isSubscribed = false; //подписан?
                if ($subscription->is_editor == 1) $isEditor = true; else $isEditor = false; //редактор?
                $this->response('isEditor', $isEditor);
                //получаем список лекций
                try {
                    if ($isSubscribed) {
                        if ($role == 'admin' || $isEditor) { //если админ или редактор — все материалы
                            $this->response('lectures',
                                $this->pixie->db->query('select')->table('lectures')
                                    ->fields('lecture_id', 'date_dead_line', 'discipline_id', 'title', 'description', 'is_visible')
                                    ->where('discipline_id', $id)
                                    ->execute()->as_array());
                        } else //если студент, то без скрытых лекций
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
                            if (isset ($_COOKIE['id']) && $role != 'admin') {
                                $this->response('results',
                                    $this->pixie->db->query('select')->table('lecture_results')
                                        ->where('lecture_id', 'IN', $this->pixie->db->expr('(' . $lecturesString . ')'))
                                        ->where('user_id', $_COOKIE['id'])
                                        ->execute()->as_array());
                            }
                        }
                        $this->response('status', 1);
                    }
                } catch
                (Exception $e) {
                    $this->response('status', 0);
                    error_log($e->getMessage());
                }
            } else
                $this->response('status', 403);
        } else $this->response('status', 403);
    }

    public function action_delete_lesson()
    {
        $this->response('status', 403);
        $postId = Request::getInt('id');
        if (Auth::checkCookie($this->pixie)) {
            $role = Auth::getPermissions($this->pixie, $postId);
            if ($role != null) {
                if ($role == 'admin' || $role == 'creator' || $role == 'editor') {
                    try {
                        $this->response('status', 1);
                        $this->pixie->db->query('delete')->table('lectures')->
                        where('lecture_id', $postId)->
                        execute();
                        $this->pixie->db->query('delete')->table('lecture_results')->
                        where('lecture_id', $postId)->
                        execute();
                        $this->pixie->db->query('delete')->table('attachments')->
                        where('lecture_id', $postId)->
                        execute();
                    } catch (Exception $e) {
                        error_log($e->getMessage());
                        $this->response('status', 500);
                    }
                }
            }
        }
    }

}
