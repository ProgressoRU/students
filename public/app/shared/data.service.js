(function () {
    'use strict';
    angular
        .module('students')
        .service('DataService', DataService);

    DataService.$inject = ['$http', '$q'];

    function DataService($http, $q) {

        var service = {
            get: get
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
    }
})();