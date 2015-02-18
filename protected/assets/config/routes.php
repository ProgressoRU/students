<?php

return array(
	'classes_all' => array(
		'/api/classes/all',
		array(
			'controller' => 'apiClasses',
			'action' => 'index'
		),
	),
	'classes_lectures' => array(
        '/api/classes/info',
		array(
			'controller' => 'apiClasses',
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
