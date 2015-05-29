<?php

namespace App\Controller;

use App\Libraries\Request;

/**
 * Class ApiGroups
 *      API управления группами
 * @package App\Controller
 */
class ApiGroups extends ApiController
{

    public function action_list()
    {
        // Проверка прав доступа (Функция в ApiController)
        if (!$this->isInRole(array('admin', 'teacher'), false)) {
            return;
        }

        $uId = isset($_COOKIE['id']) ? $_COOKIE['id'] : 0;
        $this->response('groups', $this->pixie->db->query('select')->table('groups')
            ->fields('group_id', 'title')
            ->where('teacher_id', $uId)
            ->execute()->as_array());
    }

    public function action_details()
    {
        // Проверка прав доступа (Функция в ApiController)
        if (!$this->isInRole(array('admin', 'teacher'), false)) {
            return;
        }
        $uId = isset($_COOKIE['id']) ? $_COOKIE['id'] : 0;
        $groupId = Request::getInt('groupId');
        $this->response('group', $this->pixie->db->query('select')->table('groups')
            ->where('group_id', $groupId)
            ->where('teacher_id', $uId)
            ->execute()->current());
    }

    public function action_subscribers()
    {
        // Проверка прав доступа (Функция в ApiController)
        if (!$this->isInRole(array('admin', 'teacher'), false)) {
            return true;
        }

        $uId = $this->getUserId();
        $groupId = Request::getInt('groupId');
        $group = $this->pixie->db->query('select')->table('groups')
            ->where('group_id', $groupId)
            ->where('teacher_id', $uId)
            ->execute()->current();

        if (empty($group))
            return $this->forbidden();

        $this->response('subscribers', $this->pixie->db->query('select')->table('subscriptions')
            ->join('users', array('users.user_id', 'subscriptions.user_id'), 'inner')
            ->where('group_id', $groupId)
            ->fields('user_id', 'users.surname', 'users.name', 'users.patronymic', 'users.group', 'is_editor')
            ->execute()->as_array());
        return $this->ok();
    }

    public function action_group_access()
    {
        if (!$this->isInRole(array('admin', 'teacher'), false)) {
            return true;
        }
        //todo: проверка
        $groupId = Request::getInt('groupId');
        $this->response('access', $this->pixie->db->query('select')->table('group_access')
            ->fields('discipline_id')
            ->where('group_id', $groupId)
            ->execute()->as_array());
        return $this->ok();
    }

    public function  action_access_save()
    {
        if (!$this->isInRole(array('admin', 'teacher'), false)) {
            return true;
        }

        $uId = $this->getUserId();
        $groupId = Request::getInt('groupId');
        $group = $this->pixie->db->query('select')->table('groups')
            ->where('group_id', $groupId)
            ->where('teacher_id', $uId)
            ->execute()->current();

        if (empty($group))
            return $this->forbidden();

        $this->pixie->db->query('delete')->table('group_access')
            ->where('group_id', $groupId)
            ->execute();

        $accessData = Request::getArray('accessData');
        //var_dump($accessData);

        foreach($accessData as $entry)
            $this->pixie->db->query('insert')->table('group_access')
                ->data(array('group_id' => $groupId, 'discipline_id' => $entry['discipline_id']))
                ->execute();

        return $this->ok(10);
    }

    public function action_new()
    {
        // Проверка прав доступа (Функция в ApiController)
        if (!$this->isInRole(array('admin', 'teacher'))) {
            return true;
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
            return $this->badRequest(21);
        }

        // проверка повторного кода
        $passCheck = $this->pixie->db->query('select')->table('groups')
            ->where('passcode', $passcode)
            ->execute()->current();
        if (!empty($passCheck)) {
            return $this->badRequest(22);
        }

        // Создание группы
        $this->pixie->db->query('insert')->table('groups')
            ->data(array('passcode' => $passcode, 'expire_date' => $expiration, 'teacher_id' => $uId, 'title' => $title))
            ->execute();

        // сообщаем что ошибок нет и номер новой группы
        $this->response('group_id', intval($this->pixie->db->insert_id()));
        return $this->ok(26);
    }

    public function action_subscribe()
    {
        if (!$this->isAuthorized()) {
            return true;
        }

        $passcode = Request::getString('passcode');
        if (empty($passcode)) {
            return $this->badRequest(24);
        }

        $group = $this->pixie->db->query('select')->table('groups')
            ->where('passcode', $passcode)
            ->execute()->current();

        if (!isset($group) || empty ($group)) {
            return $this->badRequest(20);
        }

        //проверяем срок действия пассфразы
        $groupId = $group->group_id;
        $expirationDate = $group->expire_date;
        if (!empty ($expirationDate)) {
            $expirationDate = new \DateTime($expirationDate);
            $today = time();
            if ($expirationDate->getTimestamp() < $today) {
                return $this->badRequest(25);
            }
        }

        //проверяем не вступал ли пользователь в группу ранее
        $uId = isset($_COOKIE['id']) ? $_COOKIE['id'] : 0;
        $reentryCheck = $this->pixie->db->query('select')->table('subscriptions')
            ->where('user_id', $uId)
            ->where('group_id', $groupId)
            ->execute()->current();

        if (!empty($reentryCheck)) {
            return $this->badRequest(27);
        }

        //проверяем не совпадают ли предметы в группе с предметами пользователя
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
        /*
         * Ниже расположена полная версия запроса на SQL для справки
         * SELECT * FROM
         * (SELECT discipline_id FROM subscriptions AS sub
         * INNER JOIN group_access AS ga1 ON sub.group_id = ga1.group_id
         * WHERE user_id = <$uId>) AS subquery
         * WHERE discipline_id IN (SELECT discipline_id FROM group_access
         * WHERE group_id = <$groupId>)
         */
        if (!empty($coincidence)) {
            return $this->badRequest(28);
        }

        //подписываем пользователя на группу
        $this->pixie->db->query('insert')->table('subscriptions')
            ->data(array('user_id' => $uId, 'group_id' => $groupId, 'is_editor' => '0'))
            ->execute();

        return $this->ok(29);
    }
}