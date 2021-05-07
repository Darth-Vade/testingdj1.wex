'use strict';
app.controller('HomeCtrl', ['$scope', '$sce', '$state', '$timeout', 'webServices', 'utility', '$rootScope', 'isMobile', function($scope, $sce, $state, $timeout, webServices, utility, $rootScope, isMobile) {
            $rootScope.getRjs = function() {
                webServices.get('rj/50/1').then(function(getData) {
                    if (getData.status == 200) {
                        $rootScope.loading = false;
                        $rootScope.rjprofiles = getData.data;
                        $rootScope.setSliderConfig();
                    }
                });
            };
            
}]);