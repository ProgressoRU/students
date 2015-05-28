(function () {
    'use strict';

    angular
        .module('students')
        .service('GroupService', GroupService);

    GroupService.$inject = ['DataService'];

    function GroupService(DataService) {
        var groups = [];
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

        function get() {
            return DataService.send('api/groups/list').success(function(data){
                return groups = data.groups;
            })
        }

        function getDetails(groupId){
            return DataService.send('api/groups/details', {groupId: groupId}).success(function(data){
                return data.group;
            })
        }
    }
})();