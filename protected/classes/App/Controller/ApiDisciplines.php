<?php

namespace App\Controller;

use App\Libraries\Request,
    App\Libraries\Auth as Auth,
    Exception;

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
        $id = Request::getInt('id'); //id предмета
        $this->response('status', 0);
        $role = Auth::getRole($this->pixie); //роль пользователя
        if (Auth::checkCookie($this->pixie)) {
            $uID = isset($_COOKIE['id']) ? $_COOKIE['id'] : 0;
            //Получаем название и описание предмета
            try {
                $this->response('discipline',
                    $this->pixie->db->query('select')->table('disciplines')->
                    fields('title', 'description', 'creator_id')->
                    where('discipline_id', $id)->
                    execute()->current());
            } catch (Exception $e) {
                $this->response('status', 0);
                error_log($e->getMessage());
            }
            //Ищем совпадение предмета и пользователя в подписках
            if($role != 'admin')
                $permission = Auth::getPermissions($this->pixie, $id);
            else $permission = 'creator';
            $this->response('perm', $permission);
            //Если прошлый блок выполнился
            if (isset($permission) && $permission != null) {
                if ($permission == 'creator' || $permission == 'editor' || $role == 'admin') $isEditor = true; else $isEditor = false; //редактор?
                $this->response('isEditor', $isEditor);
                if ($permission == 'subscriber' || $permission == 'editor' || $permission == 'creator' || $role == 'admin')
                    $isSubscribed = true; else $isSubscribed = false;
                //получаем список лекций
                try {
                    if ($isSubscribed) {
                        if ($role == 'admin' || $isEditor) { //если админ или редактор — все материалы
                            $this->response('lectures',
                                $this->pixie->db->query('select')->table('lectures')
                                    ->fields('lecture_id', 'discipline_id', 'title', 'description')
                                    ->where('discipline_id', $id)
                                    ->execute()->as_array());
                        } else //если студент, то с учетом групповых прав
                            $groupId = Auth::getGroupId($this->pixie, $id);
                        if (isset($groupId) && $groupId != null) {
                            $this->response('lectures',
                                $this->pixie->db->query('select')->table('lectures')
                                    ->fields('lecture_id', 'discipline_id', 'title', 'description', 'group_progress.date_deadline')
                                    ->join('group_progress', array('group_progress.lecture_id', 'lectures.lecture_id'), 'inner')
                                    ->where('lectures.discipline_id', $id)
                                    ->where('group_progress.is_visible', 1)
                                    ->execute()->as_array());
                        }

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
        if ($this->isAuthorized()) {
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

        if (Auth::checkCookie($this->pixie)) {
            $perm = Auth::getPermissions($this->pixie, $disciplineId);
            $role = Auth::getRole($this->pixie);
            if ($role != null) {
                if ($role == 'admin' || $perm == 'creator' || $perm == 'editor') {
                    try {
                        $this->response('status', 1);
                        $this->pixie->db->query('delete')->table('lectures')->
                        where('lecture_id', $postId)->
                        execute();
                        $this->pixie->db->query('delete')->table('attachments')->
                        where('lecture_id', $postId)->
                        execute();
                        $this->pixie->db->query('delete')->table('group_progress')->
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
