(function () {
  'use-strict';
  
  angular.module('app')
    .controller('homeCtrl', ['$scope', '$firebaseArray', homeCtrl]);

  function homeCtrl($scope, $firebaseArray) {
    var vm = $scope;
    var ref = firebase.database();
    
    var chatsRef = ref('chats/');
    vm.chats = $firebaseArray(chatsRef);
    
  }
  
})(); 