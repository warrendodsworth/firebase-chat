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

    //Query lab
    
    //Get chatId where I am a member
    firebase.database().ref('members').orderByChild('facebook:10154384221665145').once('value').then(function (snapshot) {
      chatId = Object.keys(members)[0];
     
    });

    //Get users which are not me
    firebase.database().ref('users/').orderByKey().equalTo('facebook:10154384221665145').once('value').then(function (snapshot) {
      var users = snapshot.val();
      console.log(users);
    });




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

