var stDirectives = angular.module('stDirectives', []);

//шапка
stDirectives.directive('stHeader', function () {
    return {
        templateUrl: 'public/views/header.html'
    };
});

//модальное окно авторизации
stDirectives.directive('loginDialog', function (AUTH_EVENTS) {
    return {
        restrict: 'A',
        templateUrl: 'public/views/login.html',
        controller: 'LoginModalCtrl',
        link: function (scope) {
            //показать модальное окно
            var showDialog = function () {
                scope.visible = true;
                $('#loginModal').modal({
                    backdrop: 'static',
                    keyboard: false,
                    show: true
                });
            };
            //скрыть модальное окно
            var hideDialog = function () {
                scope.visible = false;
                $('#loginModal').modal('hide');
            };
            scope.visible = false;
            //Действия при получении оповещений
            scope.$on(AUTH_EVENTS['403'], showDialog);
            scope.$on(AUTH_EVENTS['200'], hideDialog);
        }
    };
});

//редактор новостей
stDirectives.directive('newsEditor', function () {
    return {
        templateUrl: 'public/views/newsEditor.html'
    }
});

//confirmation
stDirectives.directive('ngReallyClick', ['$modal',
    function ($modal) {
        var ModalInstanceCtrl = function ($scope, $modalInstance) {
            $scope.ok = function () {
                $modalInstance.close();
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };
        return {
            restrict: 'A',
            scope: {
                ngReallyClick: "&"
            },
            link: function (scope, element, attrs) {
                element.bind('click', function () {
                    var message = attrs.ngReallyMessage || "Вы уверены?";

                    var modalHtml = '<div class="modal-body">' + message + '</div>';
                    modalHtml += '<div class="modal-footer"><button class="btn btn-primary" data-ng-click="ok()">OK</button><button class="btn btn-warning" data-ng-click="cancel()">Отмена</button></div>';

                    var modalInstance = $modal.open({
                        template: modalHtml,
                        controller: ModalInstanceCtrl
                    });

                    modalInstance.result.then(function () {
                        scope.ngReallyClick();
                    }, function () {
                        //Modal dismissed
                    });

                });
            }
        }
    }
]);