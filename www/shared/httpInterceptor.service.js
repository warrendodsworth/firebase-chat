(function () {
  'use strict';

  angular
    .module('app')
    .factory('HttpInterceptorService', HttpInterceptorService);

  HttpInterceptorService.$inject = ['$q', '$location', '$rootScope', 'AccountService'];

  function HttpInterceptorService($q, $location, $rootScope, AccountService) {

    var service = {};

    service.request = function (config) {
      config.headers = config.headers || {};

      var identity = AccountService.identity;
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