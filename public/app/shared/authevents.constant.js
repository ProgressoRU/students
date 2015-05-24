(function () {
    'use strict';

    angular
        .module('students')
        .constant('AUTH_EVENTS', {
            //возможные события авторищации
            200: 'OK',
            401: 'Unauthorized',
            403: 'Forbidden'
        });
})();
