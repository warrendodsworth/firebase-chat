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

    //list users chats - may need tabs
    var chatsRef = db.ref('chats/');
    vm.chats = $firebaseArray(chatsRef);

    //list users
    var usersRef = db.ref('users/');
    vm.users = $firebaseArray(usersRef);

    //create chat
    vm.chatWith = function ($uid, name) {
      //add to chats, members
      var myUid = firebase.auth().currentUser.uid;
      var chatId = $uid + '-' + myUid;

      db.ref('chats/' + chatId).set({ title: name, lastMessage: '', timestamp: firebase.database.ServerValue.TIMESTAMP });

      db.ref('members/' + chatId + '/' + $uid).set(true);
      db.ref('members/' + chatId + '/' + myUid).set(true);

      $location.path('/chat/' + chatId);
    };
  }
})(); 