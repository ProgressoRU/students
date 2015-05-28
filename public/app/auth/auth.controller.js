(function () {
    'use strict';

    angular
        .module('students')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['$scope', 'AuthService', '$route', 'alertService', 'DataService'];

    function AuthController($scope, AuthService, $route, alertService, DataService) {
        /*jshint validthis: true */
        var vm = this;

        vm.reg = false;
        vm.auth = true;
        vm.credentials = {
            username: '',
            pass: '',
            rememberMe: false
        };
        vm.regData =
        {
            username: '',
            pass: '',
            passcode: '',
            group: '',
            name: '',
            surname: ''
        };

        vm.login = login;
        vm.regUser = regUser;
        vm.toAuth = toAuth;
        vm.toReg = toReg;

        //////////////////////////////
        function login(credentials) {
            //отправляем сервису Авторизации необходимые данные
            AuthService.login(credentials)
                .success(function () {
                    $route.reload();
                    $scope.wrap.getDisciplines();
                    $scope.wrap.getGroups(true);
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
                    passcode: regData.passcode,
                    group: regData.group,
                    surname: regData.surname,
                    name: regData.name
                }).success(function (data) {
                    vm.toAuth();
                })
            }
        }

        function toReg() {
            vm.auth = false;
            vm.reg = true;
            vm.regData = null;
        }

        function toAuth() {
            vm.auth = true;
            vm.reg = false;
            vm.credentials = null;
        }
    }
})();