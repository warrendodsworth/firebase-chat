(function () {
  'use-strict';

  angular
    .module('app')
    .controller('home', homeController);

  homeController.$inject = ['$scope', '$location', '$firebaseArray', '_chat', 'auth'];

  function homeController($scope, $location, $firebaseArray, _chat, auth) {
    var vm = $scope;
    var db = firebase.database();

    var myUid = auth.uid;
    var membersRef = db.ref('members/');
    var usersRef = db.ref('users/');
    vm.users = $firebaseArray(usersRef);

    var chatsRef = db.ref('chats/');
    var myChatsRef = db.ref('users/' + myUid + '/chats');

    //get mychats
    chatsRef.once('value', function (chats) {
      myChatsRef.once('value', function (myChats) {
        myChats.forEach(function (c) {

        });

        //get all chats which have keys in myChats
        chats.forEach(function (c) {

        });
      });
    });

    //get chat ids with this member
    db.ref('members')
      .startAt(myUid)
      .endAt(myUid)
      .once('value', function (snap) {
        snap.forEach(function (s) {
          console.log(s.key);
        })
      });



    vm.chats = $firebaseArray(chatsRef);

    vm.chatWith = function ($uid, name) {
      var chatId = null, newChat = true;

      membersRef.orderByChild($uid)
        .once('value').then(function (members) {

          members.forEach(function (chat) {
            var hasMe = chat.hasChild(myUid);
            var hasYou = chat.hasChild($uid);
            if (hasMe && hasYou && chat.numChildren() == 2) {
              newChat = false;
              chatId = chat.key;

              db.ref('chats/' + chatId).update({ title: name, timestamp: firebase.database.ServerValue.TIMESTAMP });
            }
          });

          if (newChat) {
            chatId = Math.round(Math.random() * 100000000);
            db.ref('members/' + chatId + '/' + $uid).set(true);
            db.ref('members/' + chatId + '/' + myUid).set(true);
            db.ref('users/' + myUid + '/chats/' + chatId).set(true);
            db.ref('chats/' + chatId).set({ title: name, timestamp: firebase.database.ServerValue.TIMESTAMP });
          }

          if (chatId) $location.path('/chat/' + chatId);
        });
    };

    vm.resumeChat = function (chatId) {
      db.ref('chats/' + chatId).update({ timestamp: firebase.database.ServerValue.TIMESTAMP });
      $location.path('/chat/' + chatId);
    };
  }
})();


// chatId = Object.keys(members)[0];
// members = {
//   14360367: {
//     'facebook:10154384221665145': true,
//     'facebook:10154384221665146': true
//   }
//   98269248: {
//     'facebook:10154384221665146': true
//   }
// };

//  membersRef.once('value', function (members) {
//    members.forEach(function (chat) {
//         chat.hasChild(myUid);
//    });
//  });

//chatsRef.once('value', function (chats) {
//   membersRef.once('value', function (members) {
//     vm.chats = _chat.extend({}, members.val(), chats.val());
//   });
// });
