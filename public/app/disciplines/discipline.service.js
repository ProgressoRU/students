(function () {
    'use strict';

    angular
        .module('students')
        .service('DisciplineService', DisciplineService);

    DisciplineService.$inject = ['DataService', '$q'];

    function DisciplineService(DataService, $q) {
        var service = {
            append: append,
            destroy: destroy,
            get: get,
            disciplines: null
        };

        return service;
        ////////////////

        function append() {
            return service.disciplines;
        }

        function destroy() {
            service.disciplines = null;
        }

        function get(clearCache) {
            if (clearCache || service.disciplines === null) {
                return DataService.send('api/disciplines/my').success(function(data){
                    return service.disciplines = data.disciplines;
                })
            } else {
                return $q.when({ data: {disciplines: service.disciplines} });
            }
        }
    }
})();