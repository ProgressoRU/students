var stServices = angular.module('stServices',[]);

stServices.service('serviceData', ['$http', '$q',function ($http, $q) {
return{
   get: function(url, param)
    {
        return $http.post(url, param)
            .then(function(response) {
	               if (typeof response.data === 'object') {
	                   return response.data;
	               } else {
	               // invalid response
	               return $q.reject(response.data);
	                }
	                }, function(response) {
	                    // something went wrong
	                    return $q.reject(response.data);
	            	});
    }
}

}]);

stServices.factory('AuthService', ['serviceData', '$location','Session', function (serviceData, $location, Session) {

    var authService = {};

    authService.login = function(credentials) {
        return serviceData
            .get('api/user/auth', credentials)
            .then(function(data) {
                if (data.status == 1) {
                    Session.create(data.user[0].sessionHash, data.user[0].uID, data.user[0].txtRole);
                    return data;
                }
                else return data;
            })
    };

    authService.isAuthenticated = function () {
        return !!Session.userId;
    };
    authService.isAuthorized = function (authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        return (authService.isAuthenticated() &&
        authorizedRoles.indexOf(Session.userRole) !== -1);
    };
    return authService;
}]);

stServices.service('Session', [function() {
    //TODO: Внести корректные данные!
    this.create = function (sessionId, userId, userRole) {
        this.id = sessionId;
        this.userId = userId;
        this.userRole = userRole;
    };
    this.destroy = function () {
        this.id = null;
        this.userId = null;
        this.userRole = null;
    };
    return this;
}]);

stServices.constant('AUTH_EVENTS', {
    200: 'OK',
    401: 'Unauthorized',
    403: 'Forbidden',
    e200: 'test'
});
