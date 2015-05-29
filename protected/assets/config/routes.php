<?php

return array(
    'user_auth' => array(
        '/api/user/auth',
        array(
            'controller' => 'apiUser',
            'action' => 'auth'
        ),
    ),
    'user_checkAuth' => array(
        '/api/user/checkAuth',
        array(
            'controller' => 'apiUser',
            'action' => 'check_auth'
        ),
    ),
    'user_restore' => array(
        '/api/user/restore',
        array(
            'controller' => 'apiUser',
            'action' => 'restore_session'
        ),
    ),
    'user_logout' => array(
        '/api/user/logout',
        array(
            'controller' => 'apiUser',
            'action' => 'logout'
        ),
    ),
    'user_reg' => array(
        '/api/user/reg',
        array(
            'controller' => 'apiUser',
            'action' => 'reg'
        ),
    ),
    'user_list' => array(
        '/api/user/userList',
        array(
            'controller' => 'apiUser',
            'action' => 'user_list'
        )
    ),
    'user_rights' => array(
        '/api/user/rights',
        array(
            'controller' => 'apiUser',
            'action' => 'rights'
        )
    ),
	'classes_all' => array(
		'/api/disciplines/all',
		array(
			'controller' => 'apiDisciplines',
			'action' => 'index'
		),
	),
    'classes_my' => array(
        '/api/disciplines/my',
        array(
            'controller' => 'apiDisciplines',
            'action' => 'my_disciplines'
        ),
    ),
	'classes_lectures' => array(
        '/api/disciplines/info',
		array(
			'controller' => 'apiDisciplines',
			'action' => 'info'
		),
	),
    'delete_lesson' => array(
        '/api/disciplines/delete_lesson',
        array(
            'controller' => 'apiDisciplines',
            'action' => 'delete_lesson'
        ),
    ),
    'edit_lesson' => array(
        '/api/disciplines/edit_lesson',
        array(
            'controller' => 'apiDisciplines',
            'action' => 'edit_lesson'
        ),
    ),
	'news' => array(
		'/api/news/all',
		array(
			'controller' => 'apiNews',
			'action' => 'index'
		)
	),
    'news_edit' => array(
        '/api/news/edit',
        array(
            'controller' => 'apiNews',
            'action' => 'edit'
        )
    ),
    'news_delete' => array(
        '/api/news/delete',
        array(
            'controller' => 'apiNews',
            'action' => 'delete'
        )
    ),
    'subscribe' => array(
        '/api/groups/subscribe',
        array(
            'controller' => 'apiGroups',
            'action' => 'subscribe'
        )
    ),
    'group_list' => array(
        '/api/groups/list',
        array(
            'controller' => 'apiGroups',
            'action' => 'list'
        )
    ),
    'group_details' => array(
        '/api/groups/details',
        array(
            'controller' => 'apiGroups',
            'action' => 'details'
        )
    ),
    'group_subscribers' => array(
        '/api/groups/subscribers',
        array(
            'controller' => 'apiGroups',
            'action' => 'subscribers'
        )
    ),
    'group_access' => array(
        '/api/groups/access',
        array(
            'controller' => 'apiGroups',
            'action' => 'group_access'
        )
    ),
    'group_access_save' => array(
        '/api/groups/access_save',
        array(
            'controller' => 'apiGroups',
            'action' => 'access_save'
        )
    ),
    'group_delete' => array(
        '/api/groups/delete',
        array(
            'controller' => 'apiGroups',
            'action' => 'delete'
        )
    ),
    'group_new' => array(
        '/api/groups/new',
        array(
            'controller' => 'apiGroups',
            'action' => 'new'
        )
    ),
	'default' => array(
		'(/<controller>(/<action>(/<id>)))', 
		array(
			'controller' => 'home',
			'action' => 'index'
		),
	)
);
