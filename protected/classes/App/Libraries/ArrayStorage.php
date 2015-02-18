<?php

namespace App\Libraries;

use Exception,
    DateTime,
    DateTimeZone;

abstract class ArrayStorage {
    private static $array = array();

    public static function setStorage(&$array) {
        if (!is_array($array)) {
            throw new Exception('Storage $array is not array');
        }
        static::$array = &$array;
    }

    protected static function &source() {
        return static::$array;
    }

    public static function getStorage() {
        return static::source();
    }

    public static function isEmpty() {
        $array = static::source();
        return empty($array);
    }

    public static function isExists($param) {
        $source = static::source();
        return array_key_exists($param, $source);
    }

    public static function getInt($param, $default = 0) {
        return intval(static::get($param, $default, true));
    }

    public static function getFloat($param, $default = 0.0) {
        $result = str_replace(',', '.', static::get($param, $default, true));
        return floatval($result);
    }

    public static function getString($param, $default = '') {
        return strval(static::get($param, $default, true));
    }

    public static function getStringTrim($param, $default = '') {
        return trim(static::getString($param, $default));
    }

    public static function getDate($param, $default = '0000-00-00') {
        $value = static::getStringTrim($param, $default);
        return preg_replace('/(\d{1,2})\.(\d{1,2})\.(\d{2,4})/', '${3}-${2}-${1}', $value);
    }

    public static function getArray($param, $default = array()) {
        $result = static::get($param, $default);
        if (is_array($result)) {
            return $result;
        }
        return array();
    }

    public static function getBool($param, $default = false) {
        $value = strval(static::get($param, $default, true));
        return filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }

    public static function get($param, $default = null, $isNotArray = false) {
        $source = static::source();
        if (isset($source[$param])) {
            if ($isNotArray && is_array($source[$param])) {
                return $default;
            }
            return $source[$param];
        }
        return $default;
    }

    public static function getDateTime($param, $default = null) {
        $value = static::getDate($param, '');
        switch ($value) {
            case '':
            case 'null':
            case '0000-00-00':
            case '0000-00-00T':
            case '0000-00-00T00:00:00':
            case '0000-00-00 00:00:00':
            case '00.00.0000':
                return $default;
                break;
        }

        $dateTimeParam = new DateTime($value);
        $currentTimeZone = new DateTimeZone(date_default_timezone_get());
        $dateTimeParam->setTimezone($currentTimeZone);
        return $dateTimeParam;
    }
}
