<?php

return array(
	'api/classes/all' => array(
		'/api/classes/all',
		array(
			'controller' => 'apiClasses',
			'action' => 'index'
		)
	),
	'api/news/all' => array(
		'/api/news/all',
		array(
			'controller' => 'apiNews',
			'action' => 'index'
		)
	),
	'api/courses/all' => array(
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
