<?php

return array(
	'classes' => array(
		'/api/classes/all',
		array(
			'controller' => 'apiClasses',
			'action' => 'index'
		),
	),
	'classlectures' => array(
        '/api/classes/<id>',
		array(
			'controller' => 'apiClasses',
			'action' => 'getLectures'
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
