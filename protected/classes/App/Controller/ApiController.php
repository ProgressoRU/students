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

    public function response($param, $value = null) {
        if (is_array($param)) {
            if (is_null($value)) {
                foreach ($param as $subParam => $value) {
                    $this->_response[$subParam] = $value;
                }
            } else {
                // incorrect
                error_log('ApiController incorrect calling $param is array and value !== null');
            }
        } else if (is_string($param) || is_numeric($param)) {
            $this->_response[$param] = $value;
        } else {
            // incorrect
            error_log('ApiController incorrect calling $param is not array, string or numeric');
        }
        return true;
    }

    public function isExistsParam($param) {
        return isset($this->_response[$param]);
    }

    public function claim($param, $default = null) {
        if ($this->isExistsParam($param)) {
            return $this->_response[$param];
        }
        return $default;
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