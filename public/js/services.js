var stServices = angular.module('stServices',[]);

stServices.service('serviceData', ['$http', '$q',function ($http, $q) {
return{
   get: function(url, param)
    {
        return $http.post(url, param)
            .then(function(response) {
                    console.log(response);
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
                if (data.status == 200) {
                    Session.create(data.user[0].uID, data.user[0].username, data.user[0].txtSurname, data.user[0].txtName,
                        data.user[0].txtPatronymic, data.user[0].GroupID, data.user[0].txtRole);
                    console.log(Session);
                    return data;
                }
                else return data;
            })
    };

    authService.isAuthenticated = function () {
        return !!Session.userId;
    };

    authService.logout = function()
    {
      return serviceData
          .get('api/user/logout')
          .then(function(data){
              console.log(data);
              if(data == true) {
                  Session.destroy();
                  console.log(Session);
              }
          });
    };

    return authService;
}]);

stServices.service('Session', [function() {
    this.create = function (userId, userName, surname, name, patronymic, group, userRole) {
        this.userId = userId;
        this.userName = userName;
        this.surname = surname;
        this.name = name;
        this.patronymic = patronymic;
        this.group = group;
        this.userRole = userRole;
    };
    this.destroy = function () {
        this.userId = null;
        this.userName = null;
        this.surname = null;
        this.name = name;
        this.patronymic = null;
        this.group = null;
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
