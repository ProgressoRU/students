(function () {
    'use strict';

    angular
        .module('students')
        .directive('stHeader', stHeader);

    function stHeader() {
        return {
            templateUrl: 'public/app/layout/header.html',
            restrict: 'E'
        }
    }
})();