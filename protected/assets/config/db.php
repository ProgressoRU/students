<?php

return array(
	'default' => array(
		'user' => 'root',
		'password' => 'hi',
		'driver' => 'PDO',

		//'Connection' is required if you use the PDO driver
		'connection' => 'mysql:host=localhost;dbname=students',

		// 'db' and 'host' are required if you use Mysql driver
		'db'  => 'students',
		'host' => 'localhost',
	)
);
