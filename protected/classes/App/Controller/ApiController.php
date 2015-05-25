<?php

namespace App\Controller;

use App\Libraries\Auth;

class ApiController extends \App\Page
{

    private $_response = array(),
            $_timer = null,
            $_userId = null,
            $_userRole = null;

    public function before()
    {
        $this->response->add_header('Content-type: application/json; charset=UTF-8');

        $this->_timer = microtime(true);
        parent::before();

        $this->view->subview = 'json';
    }

    /**
     * @param null $param
     * @param null $value
     * @return bool|null|array|int
     */
    public function response($param = null, $value = null)
    {
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
                error_log('ApiController incorrect calling' . $param . 'is not string or numeric');
            }
        }

        return true;
    }

    public function isExistsParam($param)
    {
        return isset($this->_response[$param]);
    }

    public function after()
    {
        $this->_response['_time_execute'] = round(microtime(true) - $this->_timer, 3);
        $this->view->response = $this->_response;
        parent::after();
    }

    public function ok($status = 200)
    {
        $this->response('status', $status);
        header('HTTP/1.1 200 OK');
        return true;
    }

    public function badRequest($status = 400)
    {
        $this->response('status', $status);
        header('HTTP/1.1 400 Bad Request');
        return true;
    }

    public function unauthorized($status = 401)
    {
        $this->response('status', $status);
        header('HTTP/1.1 401 Unauthorized');
        return true;
    }

    public function forbidden($status = 403)
    {
        $this->response('status', $status);
        header('HTTP/1.1 403 Forbidden');
        return true;
    }

    public function notFound($status = 404)
    {
        $this->response('status', $status);
        header('HTTP/1.1 404 Not found');
        return true;
    }

    public function isAuthorized($sendErrorAndHttpStatus = true)
    {
        if (!$this->getUserId()) {
            if ($sendErrorAndHttpStatus) {
                $this->unauthorized();
            }
            return false;
        }

        return true;
    }

    public function isInRole($arrayRoles, $sendErrorAndHttpStatus = true)
    {
        if (!$this->isAuthorized($sendErrorAndHttpStatus)) {
            return false;
        }

        if (!in_array($this->getRole(), $arrayRoles)) {
            if ($sendErrorAndHttpStatus) {
                $this->forbidden();
            }
            return false;
        }

        return true;
    }

    public function getUserId() {
        if (is_null($this->_userId)) {
            $cookieCheck = Auth::checkCookie($this->pixie);
            if (!$cookieCheck) {
                $this->_userId = 0;
            } else {
                $this->_userId = intval($_COOKIE['id']);
            }
        }

        return $this->_userId;
    }

    public function getRole() {
        if (is_null($this->_userRole)) {
            if (!$this->isAuthorized(false)) {
                $this->_userRole = '';
            } else {
                $this->_userRole = Auth::getRole($this->pixie);
                if (is_null($this->_userRole)) {
                    $this->_userRole = '';
                }
            }
        }

        return $this->_userRole;
    }
}