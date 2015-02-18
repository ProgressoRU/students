<?php

namespace App\Libraries;

abstract class Request extends \App\Libraries\ArrayStorage {

    private static $_cache = null;

    protected static function &source() {
        if (static::$_cache === null) {
            $parse = false;

            // если передается файл с помощью чанков, то забивается память?
            $data = file_get_contents('php://input');

            if (!empty($data)) {
                if (!empty($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false) {
                    $parse = json_decode($data, true);
                } else {
                    $parse = array();
                    parse_str($data, $parse);
                }
            }

            if ($parse !== false && is_array($parse)) {
                static::$_cache = array_merge($_REQUEST, $parse);
            } else {
                static::$_cache =& $_REQUEST;
            }
        }
        return static::$_cache;
    }

}
