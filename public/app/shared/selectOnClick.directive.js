(function () {
    'use strict';

    angular
        .module('students')
        .directive('selectOnClick', selectOnClick);

    function selectOnClick() {
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
    }
})();