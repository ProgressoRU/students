var stControllers = angular.module('stControllers', []);

stControllers.controller('HeaderCtrl', ['$scope', function ($scope) {

}]);

stControllers.controller('DisciplineEditCtrl', ['$scope', function ($scope) {

}]);

stControllers.controller('GroupCtrl', ['$scope', function ($scope) {

}]);

stControllers.controller('UserAccessCtrl', ['$scope', 'DataService', 'alertService', function ($scope, DataService, alertService) {
    $scope.roles = [
        {name: 'Студент', data: 'student'},
        {name: 'Учитель', data: 'teacher'},
        {name: 'Админ', data: 'admin'}];
    $scope.emptyRegData = function () {
        $scope.regData =
        {
            username: '',
            pass: '',
            name: '',
            surname: '',
            role: ''
        };
    }
    $scope.emptyRegData();

    $scope.getTeachersAndAdmins = function () {
        DataService.get('api/user/userList').then(function (data) {
            //если ответ не пришел
            if (!data.status) alertService.add("danger", 'Ошибка. Сервер не прислал ответ. Обратитесь к администратору.');
            //если пришел ответ с запретом
            else if (data.status == 403) alertService.add("danger", "403: Доступ запрещен или произошла ошибка");
            //Если доступ разрешен
            else if (data.status == 200) {
                $scope.userList = data.userList;
            }
        })
    };

    $scope.getTeachersAndAdmins();

    $scope.regData.role = $scope.roles[0];

    $scope.regUser = function (regData) {
        if (regData.username.length <= 3 || regData.username.length >= 16)
            alertService.add("danger", 'Имя пользователя должно содержать более 3, но менее 16 символов');
        else if (regData.pass.length <= 6)
            alertService.add("danger", 'Пароль должен содержать более 6 символов');
        else {
            DataService.get('api/user/reg', {
                username: regData.username,
                pass: regData.pass,
                surname: regData.surname,
                name: regData.name,
                role: regData.role.data
            }).then(function (data) {
                if (!data.status) alertService.add("danger", 'Ошибка. Сервер не прислал ответ. Обратитесь к администратору.');
                //обработка ошибок
                else if (data.status == 21) alertService.add("danger", "Имя пользователя должно содержать более 3, но менее 16 символов");
                else if (data.status == 22) alertService.add("danger", "Пароль должен содержать более 6 символов.");
                else if (data.status == 23) alertService.add("danger", "Не указано кодовое слово");
                else if (data.status == 24) alertService.add("danger", "Не указана группа");
                else if (data.status == 25) alertService.add("danger", "Срок действия кодового слова истек. Обратитесь к учителю");
                else if (data.status == 26) alertService.add("danger", "Кодовое слово не подходит.");
                else if (data.status == 27) alertService.add("danger", "Имя уже занято");
                else if (data.status == 28) alertService.add("danger", "Возникла ошибка. Обратитесь к администратору.");
                else if (data.status == 29) alertService.add("danger", "Укажите имя и фамилию");
                else if (data.status == 30) alertService.add("danger", "Недостаточно прав");
                else if (data.status == 31) alertService.add("danger", "Куки недостоверны");
                else if (data.status == 200) {
                    alertService.add("success", "<span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span> Пользователь добавлен");
                    $scope.emptyRegData();
                    $scope.regData.role = $scope.roles[0];
                    $scope.getTeachersAndAdmins();
                }

            })
        }
    };

    $scope.promote = function (uId) {
        DataService.get('api/user/rights', {
            uId: uId,
            rights: 'admin'
        }).then(function (data) {
            if (!data.status) alertService.add("danger", 'Ошибка. Сервер не прислал ответ. Обратитесь к администратору.');
            //обработка ошибок
            else if (data.status == 403) alertService.add("danger", "403: Доступ запрещен или произошла ошибка");
            else if (data.status == 20) alertService.add("danger", "Невозможно выполнить эту администрацию с администратором");
            else if (data.status == 21) alertService.add("danger", "Попытка установить неизвестный уровень прав");
            else if (data.status == 22) alertService.add("danger", "Недостаточно прав");
            //Если доступ разрешен
            else if (data.status == 200) {
                alertService.add("success", "Пользователь повышен");
                $scope.getTeachersAndAdmins();
            }
        })
    };

    $scope.demote = function (uId) {
        DataService.get('api/user/rights', {
            uId: uId,
            rights: 'student'
        }).then(function (data) {
            if (!data.status) alertService.add("danger", 'Ошибка. Сервер не прислал ответ. Обратитесь к администратору.');
            //обработка ошибок
            else if (data.status == 403) alertService.add("danger", "403: Доступ запрещен или произошла ошибка");
            else if (data.status == 20) alertService.add("danger", "Невозможно выполнить эту администрацию с администратором");
            else if (data.status == 21) alertService.add("danger", "Попытка установить неизвестный уровень прав");
            else if (data.status == 22) alertService.add("danger", "Недостаточно прав");
            //Если доступ разрешен
            else if (data.status == 200) {
                alertService.add("success", "Пользователь понижен");
                $scope.getTeachersAndAdmins();
            }
        })
    };
}]);

