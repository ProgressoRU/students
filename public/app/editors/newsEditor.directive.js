(function() {
    'use strict';

    angular
        .module('editor')
        .directive('newsEditor', newsEditor);

   function newsEditor() {
        return {
            restrict: 'E',
            templateUrl: 'public/app/editors/newsEditor.html'
        }
    }
})();