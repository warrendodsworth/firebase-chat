(function () {
  'use strict';

  angular
    .module('app')
    .factory('_chat', chatService);

  function chatService() {
    var svc = {};

    //https://firebase.googleblog.com/2013/10/queries-part-1-common-sql-queries.html#byid
    //https://gist.github.com/katowulf/6598238
    svc.extend = function (base) {
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

    // var chatsRef = firebase.database().ref('chats/');
    // var membersRef = firebase.database().ref('members/');
    // var usersRef = firebase.database().ref('users/');

    // //Get chatId where child memberId == param
    // firebase.database().ref('members').orderByChild('facebook:10154384221665145').once('value').then(function (snapshot) {
    //   var members = snapshot.val();
    //   chatId = Object.keys(members)[0];
    //   angular.forEach(members, function (chatMembers, chatId) {
    //     angular.forEach(chatMembers, function (memberVal, memberId) {
    //       if (memberId == 'facebook:10154384221665145') {
    //         chatId = chatId; console.log('I already have an open chat with you');
    //       }
    //     });
    //   });
    // });

    // //Get users which are not me
    // firebase.database().ref('users/').orderByKey().equalTo('facebook:10154384221665145').once('value').then(function (snapshot) {
    //   var users = snapshot.val();
    //   console.log(users);
    // });


    return svc;
  }
})();