(function () {
  'use-strict';

  angular
    .module('app')
    .controller('home.Chat', ChatController);

  ChatController.$inject = ['$scope', '$firebaseArray', '$firebaseObject', '$routeParams', 'AccountService', 'currentAuth'];

  function ChatController($scope, $firebaseArray, $firebaseObject, $routeParams, AccountService, currentAuth) {
    var vm = $scope;
    var chatId = $routeParams.id;
    var db = firebase.database();
    var myUid = firebase.auth().currentUser.uid;
    var chatRef = db.ref('chats/' + chatId);
    var membersRef = db.ref('members/' + chatId);
    var messagesRef = db.ref('messages/' + chatId);
    var userId, totalMembers;

    vm.auth = AccountService.auth;
    vm.model = {};
    vm.model.from = vm.auth.name;

    //get other users id for presence
    membersRef.once('value', function (chat) {
      chat.forEach(function (member) {
        if (member.key != myUid) {
          userId = member.key;

          //User    
          var userRef = db.ref('users/' + userId);
          vm.user = $firebaseObject(userRef);

          //Presence
          var presenceRef = db.ref('presence/' + userId);
          vm.presenceVal = $firebaseObject(presenceRef);
          vm.$watch('presenceVal.$value', function (val) {
            if (val)
              vm.presence = val === true ? 'online' : moment.utc(val).local().fromNow();
            else
              vm.presence = 'not seen';
          });
        }
      });
      totalMembers = chat.numChildren();
    });

    vm.chat = $firebaseObject(chatRef);
    vm.messages = $firebaseArray(messagesRef);

    vm.sendMessage = function (model) {
      vm.messages.$add({ from: model.from, text: model.text, timestamp: firebase.database.ServerValue.TIMESTAMP });

      chatRef.update({ lastMessage: model.text, timestamp: firebase.database.ServerValue.TIMESTAMP });
      vm.form.$setPristine();
      vm.model.text = null;
    };


    // if the messages are empty, add something for fun!
    vm.messages.$loaded(function () {
      if (vm.messages.length === 0) {
        vm.messages.$add({
          from: "Firebase",
          text: "Hey there, start anytime you like!",
          timestamp: firebase.database.ServerValue.TIMESTAMP
        });
      }
    });

  }
})();



// var updates = {};
// updates['/chats/' + chatId + '/lastMessage/' + model.text];
// updates['/chats/' + chatId + '/timestamp/' + firebase.database.ServerValue.TIMESTAMP];
// db.ref().update(updates);

// msgsRef.limitToLast(10).on('child_added', function (snapshot) {
//   var message = snapshot.val();
// });


//https://www.firebase.com/docs/web/libraries/angular/guide/intro-to-angularfire.html#section-angularfire-intro
