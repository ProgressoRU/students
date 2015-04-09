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
	'classes_all' => array(
		'/api/disciplines/all',
		array(
			'controller' => 'apiDisciplines',
			'action' => 'index'
		),
	),
	'classes_lectures' => array(
        '/api/disciplines/info',
		array(
			'controller' => 'apiDisciplines',
			'action' => 'info'
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
