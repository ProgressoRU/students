var stDirectives = angular.module('stDirectives', []);

//шапка
stDirectives.directive('stHeader', function () {
    return {
        templateUrl: 'public/app/layout/header.html'
    };
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

stDirectives.directive('selectOnClick', function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            var focusedElement;
            element.on('click', function () {
                if (focusedElement != this) {
                    this.select();
                    focusedElement = this;
                }
            });
            element.on('blur', function () {
                focusedElement = null;
            });
        }
    };
})