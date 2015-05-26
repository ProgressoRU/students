(function() {
    'use strict';

    angular.module('editor', ['textAngular'])
    .run(function(taOptions){
            taOptions.toolbar = [
                ['h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
                ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
                ['html', 'insertImage', 'insertLink', 'insertVideo', 'charcount']
            ];
    })
})();