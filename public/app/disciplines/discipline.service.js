(function () {
    'use strict';

    angular
        .module('students')
        .service('DisciplineService', DisciplineService);

    DisciplineService.$inject = ['DataService', '$q', '$timeout'];

    function DisciplineService(DataService, $q, $timeout) {
        var disciplines = null;
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

        function get(clearCache) {
            if (clearCache || disciplines === null) {
                return DataService.send('api/disciplines/my').success(function(data){
                    return disciplines = data.disciplines;
                })
            } else {
                return $q.when({ data: {disciplines: disciplines} });
            }
        }
    }
})();