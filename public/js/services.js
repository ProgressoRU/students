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

}])
