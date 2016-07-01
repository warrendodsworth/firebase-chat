(function () {
  'use strict';

  angular
    .module('app')
    .factory('QueryService', Service);

  Service.$inject = ['$firebaseArray'];

  function Service($firebaseArray) {
    var service = {};

    var chatsRef = firebase.database().ref('chats/');
    var membersRef = firebase.database().ref('members/');
    var usersRef = firebase.database().ref('users/');




    //https://firebase.googleblog.com/2013/10/queries-part-1-common-sql-queries.html#byid
    //https://gist.github.com/katowulf/6598238    
    service.extend = function (base) {
      var parts = Array.prototype.slice.call(arguments, 1);
      parts.forEach(function (p) {
        if (p && typeof (p) === 'object') {
          for (var k in p) {
            if (p.hasOwnProperty(k)) {
              base[k] = p[k];
            }
          }
        }
      });
      return base;
    };

    return service;
  }

})();

