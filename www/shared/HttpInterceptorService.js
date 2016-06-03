(function () {
  'use strict';

  angular
    .module('app')
    .factory('httpInterceptorService', httpInterceptorService);

  httpInterceptorService.$inject = ['$q', '$location', '$rootScope', 'localStorageService'];

  function httpInterceptorService($q, $location, $rootScope, localStorageService) {

    var service = {};

    service.request = function (config) {

      config.headers = config.headers || {};

      var authData = localStorageService.get('authorizationData');
      if (authData) {
        config.headers.Authorization = 'Bearer ' + authData.twitter.token;
      }

      return config;
    };

    service.responseError = function (rejection) {
      if (rejection.status === 401) {
        $location.path('/login');
      } else {
        $rootScope.$broadcast('responseError', rejection);
      }

      return $q.reject(rejection);
    };

    return service;
  }
})();