(function() {
    'use strict';

    angular
        .module('editor')
        .directive('lectureEditor', lectureEditor);

    function lectureEditor() {
        return {
            restrict: 'E',
            templateUrl: 'public/app/editors/lectureEditor.html'
        }
    }
})();