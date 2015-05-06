<?php

return array(
    'user_auth' => array(
        '/api/user/auth',
        array(
            'controller' => 'apiUser',
            'action' => 'auth'
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
	'courses' => array(
		'/api/courses/all',
		array(
			'controller' => 'apiCourses',
			'action' => 'index'
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
