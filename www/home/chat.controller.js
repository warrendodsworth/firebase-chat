(function () {
  'use-strict';

  angular
    .module('app')
    .controller('home.Chat', ChatController);

  ChatController.$inject = ['$scope', '$firebaseArray', '$firebaseObject', '$routeParams', 'AccountService', 'currentAuth'];

  function ChatController($scope, $firebaseArray, $firebaseObject, $routeParams, AccountService, currentAuth) {
    var vm = $scope;
    var db = firebase.database();
    var chatId = $routeParams.id;

    vm.auth = AccountService.auth;
    vm.model = {};
    vm.model.from = vm.auth.name;

    var chatRef = db.ref('chats/' + chatId);
    //vm.chat = $firebaseObject(chatRef);

    var msgsRef = db.ref('messages/' + chatId);
    vm.messages = $firebaseArray(msgsRef);

    vm.sendMessage = function (model) {

      vm.messages.$add({ from: model.from, text: model.text, timestamp: firebase.database.ServerValue.TIMESTAMP });

      chatRef.set({ title: '', lastMessage: model.text, timestamp: firebase.database.ServerValue.TIMESTAMP });

      vm.form.$setPristine();
      vm.model.text = null;
    };

    msgsRef.limitToLast(10).on('child_added', function (snapshot) {
      var message = snapshot.val();
    });

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


    //Load info about other user
    var userId = chatId.split('-')[0];
    // db.ref('users/' + userId).on('value', function (snapshot) {
    //   vm.$apply(function  (){
    //     vm.with = snapshot.val();
    //   })
    // });

    //Presence

    var presenceRef = db.ref('presence/' + userId);
    vm.presenceVal = $firebaseObject(presenceRef);
    vm.$watch('presenceVal.$value', function (val) {
      if (val)
        vm.presence = val === true ? 'online' : moment.utc(val).local().fromNow();
      else
        vm.presence = 'not seen';
    })

    presenceRef.on('value', function (snapshot) {
      var val = snapshot.val();
      if (val) {
      }
    });
  }
})();


//https://www.firebase.com/docs/web/libraries/angular/guide/intro-to-angularfire.html#section-angularfire-intro
