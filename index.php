<?php

date_default_timezone_set('Europe/Moscow');
mb_internal_encoding('UTF-8');

$root = __DIR__ . '/protected';
$loader = require $root.'/vendor/autoload.php';
$loader->add('', $root.'/classes/');

$pixie = new \App\Pixie;
$pixie->bootstrap($root)->handle_http_request();
