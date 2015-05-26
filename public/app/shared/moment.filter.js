(function () {
    'use strict';

    angular
        .module('students')
        .filter('moment', function () {
            // USAGE:
            // {{ someDate | moment: [any moment function] : [param1] : [param2] : [param n]

            // EXAMPLES:
            // {{ someDate | moment: 'format': 'MMM DD, YYYY' }}
            // {{ someDate | moment: 'fromNow' }}
            return function (input, momentFn /*, param1, param2, etc... */) {
                var args = Array.prototype.slice.call(arguments, 2),
                    momentObj = moment(input);
                return momentObj[momentFn].apply(momentObj, args);
            };
        });
})();