(function () {
  'use-strict';

  angular
    .module('app')
    .controller('home.Home', HomeController);

  HomeController.$inject = ['$scope', '$location', '$firebaseArray', 'currentAuth'];

  function HomeController($scope, $location, $firebaseArray, currentAuth) {
    var vm = $scope;
    var db = firebase.database();

    //list users chats    
    var chatsRef = db.ref('chats/');
    vm.chats = $firebaseArray(chatsRef);

    //list users
    var usersRef = db.ref('users/');
    vm.users = $firebaseArray(usersRef);

    //create chat - add user to chat & chat to user 
    vm.chatWith = function ($uid) {
      var chatId = $uid + '-otherUid';
      
      db.ref('users/' + $uid + '/chats/').push({ chatId: true });

      //add user entry to chats/{chat-id}/users
      $location.path('/chat/' + chatId);
    };
  }
})(); 