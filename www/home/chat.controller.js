(function () {
  'use-strict';

  angular
    .module('app')
    .controller('home.Chat', ChatController);

  ChatController.$inject = ['$scope', '$firebaseArray', '$routeParams', 'AccountService', 'currentAuth'];

  function ChatController($scope, $firebaseArray, $routeParams, AccountService, currentAuth) {
    var vm = $scope;
    var db = firebase.database();
    var chatId = $routeParams.id;
    
    vm.auth = AccountService.auth;
    vm.model = {};
    vm.model.name = vm.auth.name;

    console.log('Current Auth');
    console.log(currentAuth);


    var chatRef = db.ref('chats/' + chatId);
    //vm.chat = $firebaseObject(chatRef);

    var msgsRef = db.ref('messages/' + chatId);
    vm.messages = $firebaseArray(msgsRef);

    vm.sendMessage = function (model) {
      var timestamp = new Date().getTime();

      vm.messages.$add({ name: model.name, text: model.text, timestamp: timestamp });

      chatRef.set({ title: '', lastMessage: model.text, timestamp: timestamp });

      vm.form.$setPristine();
      vm.model.text = null;
    };

    msgsRef.limitToLast(10).on('child_added', function (snapshot) {
      var message = snapshot.val();
    });

  }
})();


//https://www.firebase.com/docs/web/libraries/angular/guide/intro-to-angularfire.html#section-angularfire-intro
