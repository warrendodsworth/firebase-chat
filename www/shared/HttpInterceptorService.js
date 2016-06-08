(function () {
  'use strict';

  angular
    .module('app')
    .factory('httpInterceptorService', httpInterceptorService);

  httpInterceptorService.$inject = ['$q', '$location', '$rootScope', 'accountService'];

  function httpInterceptorService($q, $location, $rootScope, accountService) {

    var service = {};

    service.request = function (config) {
      config.headers = config.headers || {};

      var identity = accountService.identity;
      if (identity) {
        config.headers.Authorization = 'Bearer ' + identity.token;
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