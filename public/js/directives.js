var stDirectives = angular.module('stDirectives', []);

stDirectives.directive('stHeader', function () {
    return {
        templateUrl: 'public/views/header.html'
    };
});
