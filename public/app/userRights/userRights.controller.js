(function () {
    'use strict';

    angular
        .module('students')
        .controller('UserRightsController', UserRightsController);

    UserRightsController.$inject = ['DataService', 'alertService'];

    function UserRightsController(DataService, alertService) {
        /*jshint validthis: true */
        var vm = this;
        vm.roles = [
            {name: 'Студент', data: 'student'},
            {name: 'Учитель', data: 'teacher'},
            {name: 'Админ', data: 'admin'}];
        vm.regData = {};

        vm.demote = demote;
        vm.emptyRegData = emptyRegData;
        vm.getTeachersAndAdmins = getTeachersAndAdmins;
        vm.promote = promote;
        vm.regUser = regUser;

        activate();
        //////////////////////////
        function activate() {
            emptyRegData();
            getTeachersAndAdmins();
        }

        function emptyRegData() {
            vm.regData =
            {
                username: '',
                pass: '',
                name: '',
                surname: '',
                role: vm.roles[0]
            };
        }

        function getTeachersAndAdmins() {
            DataService.send('api/user/userList').success(function (data) {
                vm.userList = data.userList;
            })
        }

        function regUser(regData) {
            if (regData.username.length <= 3 || regData.username.length >= 16)
                alertService.push(31);
            else if (regData.pass.length <= 6)
                alertService.push(32);
            else {
                DataService.send('api/user/reg', {
                    username: regData.username,
                    pass: regData.pass,
                    surname: regData.surname,
                    name: regData.name,
                    role: regData.role.data
                }).success(function () {
                    activate()
                })
            }
        }

        function promote(uId) {
            DataService.send('api/user/rights', {
                uId: uId,
                rights: 'admin'
            }).success(function () {
                getTeachersAndAdmins();
            })
        }

        function demote(uId) {
            DataService.send('api/user/rights', {
                uId: uId,
                rights: 'student'
            }).success(function () {
                getTeachersAndAdmins();
            })
        }
    }
})();