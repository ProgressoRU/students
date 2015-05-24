(function () {
    'use strict';

    angular
        .module('students')
        .factory('SessionService', SessionService);

    SessionService.$inject = [];

    function SessionService() {
        var service = {
            create: create,
            destroy: destroy
        };
        return service;
        ////////////////
        function create(userId, userName, surname, name, patronymic, group, userRole) {
            this.userId = userId;
            this.userName = userName;
            this.surname = surname;
            this.name = name;
            this.patronymic = patronymic;
            this.group = group;
            this.userRole = userRole;
        }

        function destroy() {
            this.userId = null;
            this.userName = null;
            this.surname = null;
            this.name = name;
            this.patronymic = null;
            this.group = null;
            this.userRole = null;
        }
    }
})();
