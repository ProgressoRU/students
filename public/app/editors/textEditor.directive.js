(function() {
    'use strict';

    angular
        .module('editor')
        .directive('textEditor', textEditor);

   function textEditor() {
        return {
            restrict: 'E',
            templateUrl: 'public/app/editors/textEditor.html',
            scope: {
                title: '@',
                body: '@',
                label: '@'
            }
        }
    }
})();