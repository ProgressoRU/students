(function () {
    'use strict';

    angular
        .module('students')
        .service('GroupService', GroupService);

    GroupService.$inject = ['$q', 'DataService'];

    function GroupService($q, DataService) {
        var groups = null;
        var service = {
            append: append,
            destroy: destroy,
            get: get,
            getDetails: getDetails
        };

        return service;
        ////////////////

        function append() {
            return groups;
        }

        function destroy() {
            groups = [];
        }

        function get(clearCache) {
            if (clearCache || groups === null) {
                return DataService.send('api/groups/list').success(function(data){
                    return groups = data.groups;
                })
            } else {
                return $q(function(resolve/*, reject*/) {
                    resolve(groups);
                })
            }
        }

        function getDetails(groupId){
            return DataService.send('api/groups/details', {groupId: groupId}).success(function(data){
                return data.group;
            })
        }
    }
})();