(function () {
    'use strict';

    angular
        .module('students')
        .service('DisciplineService', DisciplineService);

    DisciplineService.$inject = ['DataService'];

    function DisciplineService(DataService) {
        var disciplines = [];
        var service = {
            append: append,
            destroy: destroy,
            get: get
        };

        return service;
        ////////////////

        function append() {
            return disciplines;
        }

        function destroy() {
            disciplines = [];
        }

        function get() {
            return DataService.send('api/disciplines/my').success(function(data){
                return disciplines = data.disciplines;
            })
        }
    }
})();