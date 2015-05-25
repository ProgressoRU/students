<?php

namespace App\Controller;

use App\Libraries\Request,
    App\Libraries\Auth as Auth;

class ApiDisciplines extends ApiController
{

    public function action_index()
    {
        if ($this->getUserId()) {
            $this->response('disciplines',
                $this->pixie->db->query('select')->table('disciplines')->execute()->as_array()
            );
        } else {
            $this->response('disciplines', array());
        }
    }

    public function action_my_disciplines()
    {
        if (!$this->getUserId()) {
            $this->response('disciplines', array());
            return;
        }

        switch ($this->getRole()) {
            case 'admin':
                $this->response('disciplines',
                    $this->pixie->db->query('select')->table('disciplines')->execute()->as_array()
                );
                break;
            case 'student':
                $this->response('disciplines',
                    $this->pixie->db->query('select')->table('disciplines')
                        ->where('discipline_id', 'IN', $this->pixie->db->query('select')->table('subscriptions')
                            ->fields('group_access.discipline_id')
                            ->join('group_access', array('group_access.group_id', 'subscriptions.group_id'), 'inner')
                            ->where('user_id', $this->getUserId()))
                        ->execute()->as_array()
                );
                break;
            case 'teacher':
                //todo: надо еще обдумать
                break;
        }
    }

    public function action_info()
    {
        if (!$this->isAuthorized()) {
            return true;
        }

        $id = Request::getInt('id'); //id предмета
        $role = $this->getRole(); //роль пользователя

        //Получаем название и описание предмета
        $this->response('discipline',
            $this->pixie->db
                ->query('select')
                ->table('disciplines')
                ->fields('title', 'description', 'creator_id')
                ->where('discipline_id', $id)
                ->execute()
                ->current());

        //Ищем совпадение предмета и пользователя в подписках
        $this->response('perm', $permission = ($role == 'admin' ? 'creator' : Auth::getPermissions($this->pixie, $id)));

        if (empty($permission)) {
            return $this->forbidden();
        }

        $this->response('isEditor', $isEditor = ($permission == 'creator' || $permission == 'editor' || $role == 'admin'));
        $this->response('isSubscribed', $isSubscribed = ($permission == 'subscriber' || $permission == 'editor' || $permission == 'creator' || $role == 'admin'));

        if (!$isSubscribed) {
            return true;
        }

        //Получаем список лекций
        if ($isEditor) {
            $this->response('lectures',
                $this->pixie->db
                    ->query('select')
                    ->table('lectures')
                    ->fields('lecture_id', 'discipline_id', 'title', 'description')
                    ->where('discipline_id', $id)
                    ->execute()
                    ->as_array()
            );
        } else {
            //Если студент, то с учетом групповых прав
            $groupId = Auth::getGroupId($this->pixie, $id);

            if (!empty($groupId)) {
                $this->response('lectures',
                    $this->pixie->db
                        ->query('select')
                        ->table('lectures')
                        ->fields('lecture_id', 'discipline_id', 'title', 'description', 'group_progress.date_deadline')
                        ->join('group_progress', array('group_progress.lecture_id', 'lectures.lecture_id'), 'inner')
                        ->where('lectures.discipline_id', $id)
                        ->where('group_progress.is_visible', 1)
                        ->execute()
                        ->as_array()
                );
            }
        }

        //получаем связанные вложения
        if ($this->isExistsParam('lectures')) {
            $lecturesList = array();

            //для того, чтобы выбрать вложения только для передаваемых лекций заберем их из уже
            //сформированной части респонса
            $lectures = $this->response('lectures');
            if (is_array($lectures)) {
                foreach ($lectures as $lecture) {
                    if (property_exists($lecture, 'lecture_id')) {
                        $lecturesList[] = $lecture->lecture_id;
                    }
                }
            }

            $lecturesString = implode(",", $lecturesList); //превращаем массив в строку, разделяемую ','
            if (!empty($lecturesString)) {
                $this->response('attachments',
                    $this->pixie->db
                        ->query('select')
                        ->table('attachments')
                        //условие: where lecture_id IN <номера лекций>
                        ->where('lecture_id', 'IN', $this->pixie->db->expr('(' . $lecturesString . ')'))
                        ->execute()->as_array());
            }
        }

        return $this->ok();
    }

    public function action_delete_lesson()
    {
        if (!$this->isAuthorized()) {
            return true;
        }

        $postId = Request::getInt('id');
        if (empty($postId)) {
            return $this->badRequest();
        }

        //по номеру лекции получаем номер предмета
        $lectureToDiscipline = $this->pixie->db
            ->query('select')
            ->table('lectures')
            ->fields('discipline_id')
            ->where('lecture_id', $postId)
            ->execute()->current();

        if (empty($lectureToDiscipline)) {
            return true;
        }

        $disciplineId = $lectureToDiscipline->discipline_id;

        $perm = Auth::getPermissions($this->pixie, $disciplineId);

        $isCanDelete = $this->getRole() == 'admin' || $perm == 'creator' || $perm == 'editor';

        if (!$isCanDelete) {
            return $this->forbidden();
        }

        $this->pixie->db
            ->query('delete')
            ->table('lectures')
            ->where('lecture_id', $postId)
            ->execute();

        $this->pixie->db
            ->query('delete')
            ->table('attachments')
            ->where('lecture_id', $postId)
            ->execute();

        $this->pixie->db
            ->query('delete')
            ->table('group_progress')
            ->where('lecture_id', $postId)
            ->execute();

        return $this->ok();
    }

    public function action_edit_lesson()
    {
        $id = Request::getInt('id');
        $title = Request::getString('title');
        $description = Request::getString('description');
        $attachments = Request::getArray('attachments');
        $disciplineId = Request::getInt('disciplineId');

        if (empty($title) || empty($description)) {
            return $this->badRequest(26);
        }

        if (!$this->isAuthorized()) {
            return true;
        }

        $perm = Auth::getPermissions($this->pixie, $disciplineId);

        $isCanEdit = $this->getRole() == 'admin' || $perm == 'creator' || $perm == 'editor';

        if ($isCanEdit) {
            return $this->forbidden();
        }

        if (empty($id)) {
            $this->pixie->db->query('insert')
                ->table('lectures')
                ->data(array(
                    'title' => $title,
                    'description' => $description,
                    'discipline_id' => $disciplineId,
                    'date_created' => date('Y-m-d G:i:s')
                ))
                ->execute();
            $id = intval($this->pixie->db->insert_id());
        } else {
            $this->pixie->db->query('update')
                ->table('lectures')
                ->data(array('title' => $title, 'description' => $description))
                ->where('lecture_id', $id)
                ->execute();
        }

        if (empty($attachments)) {
            return $this->ok();
        }

        $newAttaches = array();
        $editedAttaches = array();
        $deletedAttaches = array();

        foreach ($attachments as $attach) {
            if ($attach['new'] && $attach['deleted']) continue;
            elseif ($attach['deleted']) $deletedAttaches[] = $attach;
            elseif ($attach['new']) $newAttaches[] = $attach;
            elseif ($attach['edited']) $editedAttaches[] = $attach;
        }

        if (!empty($deletedAttaches)) {
            foreach ($deletedAttaches as $delete) {
                $this->pixie->db->query('delete')
                    ->table('attachments')
                    ->where('attach_id', $delete['attach_id'])
                    ->execute();
            }
        }

        if (!empty ($newAttaches)) {
            foreach ($newAttaches as $new) {
                $this->pixie->db->query('insert')
                    ->table('attachments')
                    ->data(array(
                        'lecture_id' => $id,
                        'url' => $new['url'],
                        'title' => $new['title'],
                        'description' => $new['description'],
                        'date_created' => date('Y-m-d G:i:s')
                    ))
                    ->execute();
            }
        }

        if (!empty ($editedAttaches)) {
            foreach ($editedAttaches as $edit) {
                $this->pixie->db->query('update')->table('attachments')
                    ->data(array(
                        'url' => $edit['url'],
                        'title' => $edit['title'],
                        'description' => $edit['description']
                    ))
                    ->where('attach_id', $edit['attach_id'])
                    ->execute();
            }
        }

        return $this->ok();
    }
}
