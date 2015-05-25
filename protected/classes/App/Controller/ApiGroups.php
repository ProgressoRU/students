<?php

namespace App\Controller;

use Exception,
    App\Libraries\Request,
    App\Libraries\Auth as Auth;

class ApiGroups extends ApiController
{

    public function action_list()
    {
        $this->response('status', 403);
        $cookieCheck = Auth::checkCookie($this->pixie);
        if ($cookieCheck) $role = Auth::getRole($this->pixie);
        if ($cookieCheck && !empty($role) && ($role == 'admin' || $role == 'teacher')) {
            $uId = isset($_COOKIE['id']) ? $_COOKIE['id'] : 0;
            try {
                $this->response('status', 1);
                $this->response('groups', $this->pixie->db->query('select')->table('groups')
                    ->fields('group_id', 'title')
                    ->where('teacher_id', $uId)
                    ->execute()->as_array());
            } catch (Exception $e) {
                $this->response('status', 403);
                error_log($e->getMessage());
            }
        }
    }

    public function action_new()
    {
        // Проверка прав доступа (Функция в ApiController)
        if (!$this->isInRole(array('admin', 'teacher'))) {
            return;
        }

        $uId = isset($_COOKIE['id']) ? $_COOKIE['id'] : 0;
        $title = Request::getString('title');
        $passcode = Request::getString('passcode');
        $expirationFlag = Request::getBool('expirationFlag');

        if (!$expirationFlag) {
            $expiration = date('Y-m-d', strtotime(Request::getDate('expiration')));
        } else {
            $expiration = null;
        }

        if (empty($title) || empty($passcode)) {
            $this->badRequest(21);
            return;
        }

        try {
            // проверка повторного кода
            {
                $passCheck = $this->pixie->db->query('select')->table('groups')
                    ->where('passcode', $passcode)
                    ->execute()->current();
                if (!empty($passCheck)) {
                    $this->badRequest(22);
                    return;
                }
            }

            // Создание группы
            $this->pixie->db->query('insert')->table('groups')
                ->data(array('passcode' => $passcode, 'expire_date' => $expiration, 'teacher_id' => $uId, 'title' => $title))
                ->execute();

            // сообщаем что ошибок нет и номер новой группы
            $this->ok(23);
            $this->response('group_id', intval($this->pixie->db->insert_id()));

        } catch (Exception $e) {
            $this->badRequest(500);
            error_log($e->getMessage());
        }
    }

    public function action_subscribe()
    {
        $this->response('status', 403);
        $passcode = Request::getString('passcode');
        if (empty($passcode)) {
            $this->response('status', 21);
        } else {
            $valid = true; //метка валидностии пассфразы
            //проверка существования пассфразы
            $group = $this->pixie->db->query('select')->table('groups')
                ->where('passcode', $passcode)
                ->execute()->current();
            if (!isset($group) || empty ($group)) {
                $valid = false;
                $this->response('status', 22);
            } else {
                //проверяем срок действия пассфразы
                $groupId = $group->group_id;
                $expirationDate = $group->expire_date;
                if (!empty ($expirationDate)) {
                    $expirationDate = new \DateTime($expirationDate);
                    $today = time();
                    if ($expirationDate->getTimestamp() < $today) {
                        $valid = false;
                        $this->response('status', 23);
                    }
                }
                //проверяем не вступал ли пользователь в группу ранее
                if ($valid && Auth::checkCookie($this->pixie)) {
                    $uId = isset($_COOKIE['id']) ? $_COOKIE['id'] : 0;
                    try {
                        $reentryCheck = $this->pixie->db->query('select')->table('subscriptions')
                            ->where('user_id', $uId)
                            ->where('group_id', $groupId)
                            ->execute()->current();
                    } catch (Exception $e) {
                        error_log($e->getMessage());
                        $this->response('status', 24);
                    }
                    //проверяем не совпадают ли предметы в группе с предметами пользователя
                    if (empty($reentryCheck)) {
                        try {
                            //Все предметы пользователя
                            $subquery = $this->pixie->db->query('select')->table('subscriptions')
                                ->join('group_access', array('group_access.group_id', 'subscriptions.group_id'), 'inner')
                                ->fields('group_access.discipline_id')
                                ->where('user_id', $uId);
                            //выборка на совпадения
                            if (!empty($subquery))
                                $coincidence = $this->pixie->db->query('select')->table($subquery)
                                    ->where('discipline_id', 'IN', $this->pixie->db->query('select')->table('group_access')
                                        ->fields('discipline_id')
                                        ->where('group_id', $groupId))
                                    ->execute()->as_array();
                        } catch (Exception $e) {
                            error_log($e->getMessage());
                            $this->response('status', 24);
                        }
                        /*
                         * Ниже расположена полная версия запроса на SQL для справки
                         * SELECT * FROM
	                     * (SELECT discipline_id FROM subscriptions AS sub
	                     * INNER JOIN group_access AS ga1 ON sub.group_id = ga1.group_id
	                     * WHERE user_id = <$uId>) AS subquery
                         * WHERE discipline_id IN (SELECT discipline_id FROM group_access
	                     * WHERE group_id = <$groupId>)
                         */
                        if (!empty($coincidence))
                            $this->response('status', 25);
                        else {
                            //подписываем пользователя на группу
                            try {
                                $this->pixie->db->query('insert')->table('subscriptions')
                                    ->data(array('user_id' => $uId, 'group_id' => $groupId, 'is_editor' => '0'))
                                    ->execute();
                                $this->response('status', 200);
                            } catch (Exception $e) {
                                error_log($e->getMessage());
                                $this->response('status', 24);
                            }
                        }

                    } else $this->response('status', 26);
                }
            }
        }
    }

}