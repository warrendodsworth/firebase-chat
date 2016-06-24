(function () {
  'use strict';

  angular
    .module('app')
    .filter('fromNow', fromNow);

  function fromNow() {
    return function (input, optional1) {
      return moment.utc(input).local().fromNow();
    }
  }
})();