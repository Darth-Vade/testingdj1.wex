(function() {
    'use strict';

    angular.module('ui.load')
        .service('webServices', webServices);

    function webServices($q, $http, $sessionStorage, $rootScope, authServices) {

        //var APIURL = app.apiurls[localStorage.selectedcity];
        var APIURL = app.apiurl;
        var obj = {};

        return {
            get: function(q) {
                var deferred = $q.defer();
                var URL = APIURL + q;

                $http({
                    method: 'GET',
                    url: URL,
                    cache: false,
                }).then(function(response) {
                    deferred.resolve(response);
                }, function(response) {
                    //authServices.logout();
                    deferred.resolve(response);
                });
                return deferred.promise;
            }
        }
    }

})();