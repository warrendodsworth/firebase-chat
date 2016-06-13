(function () {
  'use-strict';

  angular
    .module('app')
    .controller('home.Home', HomeController);

  HomeController.$inject = ['$scope', '$location', '$firebaseArray'];

  function HomeController($scope, $location, $firebaseArray) {
    var vm = $scope;
    var db = firebase.database();

    //list users chats    
    var chatsRef = db.ref('chats/');
    vm.chats = $firebaseArray(chatsRef);

    //List users
    var usersRef = db.ref('users/');
    vm.users = $firebaseArray(usersRef);

    //create chat - add user to chat & chat to user 
    vm.chatWith = function ($uid) {
      var chatId = $uid + '-otherUid';
      db.ref('users/' + $uid + '/chats/').push({ chatId: true });

      $location.path('/chat/' + chatId);
    };
  }


})(); 