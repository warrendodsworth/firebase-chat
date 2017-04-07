(function () {
  'use strict';

  angular
    .module('app')
    .filter('fromNow', fromNow);

  function fromNow() {
    return function (input, option1) {
      var fromNow = moment.utc(input).local().fromNow();
      return fromNow == 'Invalid date' ? option1 || '' : fromNow;
    };
  }
})();