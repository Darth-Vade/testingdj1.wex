'use strict';

/**
 * Config for the router
 */
angular.module('app')
  .run(
    [          '$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;        
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider', '$locationProvider', 'isMobileProvider', 
      function ($stateProvider,   $urlRouterProvider, $locationProvider, isMobile) {
          var layout = "tpl/blocks/app.html";
          $urlRouterProvider.otherwise('/home');
          $locationProvider.html5Mode(true);
          
          $stateProvider
              .state('app', {
                  abstract: true,
                  url: '/',
                  templateUrl: layout
              })

              .state('app.home', {
                  url: 'home',
                  templateUrl: 'tpl/home.html',
                  resolve: load(['js/controllers/home.js'])
              })


          function load(srcs, callback) {
            return {
                deps: ['$ocLazyLoad', '$q',
                  function( $ocLazyLoad, $q ){
                    var deferred = $q.defer();
                    var promise  = false;
                    srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
                    if(!promise){
                      promise = deferred.promise;
                    }
                    return $ocLazyLoad.load(srcs);
                    deferred.resolve();
                    return callback ? promise.then(function(){ return callback(); }) : promise;
                }]
            }
          }
      }
    ]
  );
