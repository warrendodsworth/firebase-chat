(function () {
  'use-strict';

  angular
    .module('app')
    .controller('home.Home', HomeController);

  HomeController.$inject = ['$scope', '$location', '$firebaseArray', 'currentAuth'];

  function HomeController($scope, $location, $firebaseArray, currentAuth) {
    var vm = $scope;
    var db = firebase.database();
    var auth = firebase.auth();

    //list users chats (have to query my chats)
    var chatsRef = db.ref('chats/');
    vm.chats = $firebaseArray(chatsRef); //Get chats where you are a member

    //list users
    var usersRef = db.ref('users/');
    vm.users = $firebaseArray(usersRef);

    

    vm.chatWith = function ($uid, name) {
      //add to chats, members
      var newChatId = Math.round(Math.random() * 100000000);
      var newChat = true;

      //existing - facebook:10154384221665145
      //query members for the other users uid incase a chat exists
      firebase.database().ref('members').orderByChild($uid).once('value').then(function (snapshot) {
        var members = snapshot.val();
        // chatId = Object.keys(members)[0];

        //in progress        
        angular.forEach(members, function (chatMembers, chatId) {
          angular.forEach(chatMembers, function (memberVal, memberId) {
            if (memberId == $uid) {
              newChatId = chatId;
              newChat = false;
              console.log('I already have an open chat with you');
            }
          });
        });

        //new chat
        if (newChat) {
          var myUid = firebase.auth().currentUser.uid;
          db.ref('members/' + newChatId + '/' + $uid).set(true);
          db.ref('members/' + newChatId + '/' + myUid).set(true);
        }

        db.ref('chats/' + newChatId).set({ title: name, timestamp: firebase.database.ServerValue.TIMESTAMP });

        $location.path('/chat/' + newChatId);
      });
    };

    vm.resumeChat = function (chatId) {
      var updates = {};
      updates['/chats/' + chatId + '/timestamp'] = firebase.database.ServerValue.TIMESTAMP;
      firebase.database().ref().update(updates);

      $location.path('/chat/' + chatId);      
    }
  }
})();


//Testing
//  firebase.database().ref('members').orderByChild('facebook:10154384221665145').once('value').then(function (snapshot) {
//         var members = snapshot.val();
//         chatId = Object.keys(members)[0];
// angular.forEach(members, function (chatMembers, chatId) {
//   angular.forEach(chatMembers, function (memberVal, memberId) {
//     if (memberId == 'facebook:10154384221665145') {
//       chatId = chatId; console.log('I already have an open chat with you');
//     }
//   });
// });
//});

// members = {
//   14360367: {
//     'facebook:10154384221665145': true,
//     'facebook:10154384221665146': true
//   },
//   98269248: {
//     'facebook:10154384221665146': true
//   }
// };