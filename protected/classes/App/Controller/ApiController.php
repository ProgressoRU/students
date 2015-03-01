<?php

namespace App\Controller;

class ApiController extends \App\Page
{

    private $_response = array(),
            $_timer = null;

    public function before() {
        $this->response->add_header('Content-type: application/json; charset=UTF-8');

        $this->_timer = microtime(true);
        parent::before();

        $this->view->subview = 'json';
    }

    public function response($param = null, $value = null) {
        if (is_null($value)) {
            if ($this->isExistsParam($param)) {
                return $this->_response[$param];
            } else {
                // incorrect
                error_log('ApiController response param ' . $param . ' not found');
                return null;
            }
        } else {
            if (is_null($param) && is_array($value)) {
                foreach ($value as $subParam => $subValue) {
                    $this->_response[$subParam] = $subValue;
                }
            } else if (is_string($param) || is_numeric($param)) {
                $this->_response[$param] = $value;
            } else {
                // incorrect
                error_log('ApiController incorrect calling $param is not string or numeric');
            }
        }

        return true;
    }

    public function isExistsParam($param) {
        return isset($this->_response[$param]);
    }

    public function after() {
        $this->_response['_time_execute'] = round(microtime(true) -$this->_timer, 3);
        $this->view->response = $this->_response;
        parent::after();
    }

    public function badRequest() {
        header('HTTP/1.1 400 Bad Request');
    }

    public function unauthorized() {
        header('HTTP/1.1 401 Unauthorized');
    }

    public function forbidden() {
        header('HTTP/1.1 403 Forbidden');
    }

    public function notFound() {
        header('HTTP/1.1 404 Not found');
    }

}