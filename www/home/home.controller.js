(function () {
  'use-strict';

  angular
    .module('app')
    .controller('home.Home', HomeController);

  HomeController.$inject = ['$scope', '$location', '$firebaseArray', 'chatService', 'currentAuth'];

  function HomeController($scope, $location, $firebaseArray, chatService, currentAuth) {
    var vm = $scope;
    var db = firebase.database();
    var auth = firebase.auth();
    var myUid = auth.currentUser.uid;
    var chatsRef = firebase.database().ref('chats/');
    var membersRef = firebase.database().ref('members/');
    var usersRef = firebase.database().ref('users/');

    //list user's chats
    vm.chats = $firebaseArray(chatsRef);

    //chats join members 
    // chatsRef.once('value', function (chats) {
    //   membersRef.once('value', function (members) {
    //     vm.chats = chatService.extend({}, members.val(), chats.val());
    //   });
    // });

    //  membersRef.once('value', function (members) {
    //      members.forEach(function (chat) {
    //         chat.hasChild(myUid);
    //      });
    //  });

    //list other users
    vm.users = $firebaseArray(usersRef);

    vm.chatWith = function ($uid, name) {
      var chatId = null;
      var newChat = true;

      //existing - query members
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
            db.ref('chats/' + chatId).set({ title: name, timestamp: firebase.database.ServerValue.TIMESTAMP });
          }

          if (chatId) $location.path('/chat/' + chatId);
        });
    };

    vm.resumeChat = function (chatId) {
      db.ref('chats/' + chatId).update({ timestamp: firebase.database.ServerValue.TIMESTAMP });
      $location.path('/chat/' + chatId);
    }
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

// angular.forEach(chatMembers, function (val, memberId) {
//   if (memberId == $uid) {
//     newChatId = chatId;
//     newChat = false;
//     console.log('I already have an open chat with you');
//   }
// });