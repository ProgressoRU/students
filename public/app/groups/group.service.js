(function () {
    'use strict';

    angular
        .module('students')
        .service('GroupService', GroupService);

    GroupService.$inject = ['$q', 'DataService'];

    function GroupService($q, DataService) {
        var service =
        {
            groups: null,
            details: null,
            access: null,
            subscribers: null,
            ////////
            destroy: destroy,
            get: get,
            getDetails: getDetails,
            getGroupAccess: getGroupAccess,
            getSubscribers: getSubscribers,
            saveAccessData: saveAccessData
        };

        return service;
        ////////////////

        function destroy() {
            service.groups = null;
            service.details = null;
            service.access = null;
            service.subscribers = null;
        }

        function get(clearCache) {
            if (clearCache || service.groups === null) {
                return DataService.send('api/groups/list').success(function (data) {
                    return service.groups = data.groups;
                })
            } else {
                return $q.when({data: {groups: service.groups}});
            }
        }

        function getDetails(groupId) {
            return DataService.send('api/groups/details', {groupId: groupId}).success(function (data) {
                return service.details = data.group;
            })
        }

        function getGroupAccess(groupId){
            return DataService.send('api/groups/access', {groupId: groupId}).success(function (data) {
                return service.access = data.access;
            })
        }

        function getSubscribers(groupId) {
            return DataService.send('api/groups/subscribers', {groupId: groupId}).success(function (data) {
                return service.subscribers = data.subscribers;
            })
        }

        function saveAccessData(accessData, groupId){
            return DataService.send('api/groups/access_save', {groupId: groupId, accessData: accessData});
        }
    }
})();