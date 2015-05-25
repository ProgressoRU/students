(function () {
    'use strict';
    angular
        .module('students')
        .service('DataService', DataService);

    DataService.$inject = ['$http', '$q', 'alertService'];

    function DataService($http, $q, alertService) {

        var service = {
            get: get, // deprecated
            send: send
        };

        return service;

        function get(url, param) {
            return $http.post(url, param)
                .then(function (response) {
                    //console.log(response);
                    if (typeof response.data === 'object') {
                        return response.data;
                    } else {
                        // invalid response
                        return $q.reject(response.data);
                    }
                }, function (response) {
                    // something went wrong
                    return $q.reject(response.data);
                });
        }

        function send(url, param) {
            return $http.post(url, param)
                .error(function(data, status/*, headers, config*/) {
                    if (data.status) {
                        alertService.push(data.status);
                    } else {
                        alertService.push(status);
                    }
                })
                .success(function(data/*, status, headers, config*/) {
                    if (data.status && data.status != '200' && data.status != 200) {
                        alertService.push(data.status);
                    }
                });
        }
    }
})();