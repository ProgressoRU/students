<?php

namespace App\Controller;

class ApiController extends \App\Page
{

    private $_response;

    public function before() {
        parent::before();

        $this->view->subview = 'json';
    }

    public function response($param, $value) {
        $this->_response[$param] = $value;
    }

    public function claim($param){
        return $this->_response[$param];
    }

    public function after() {
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