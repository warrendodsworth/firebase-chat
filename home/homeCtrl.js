(function () {
  'use-strict';
  
  angular.module('app')
    .controller('homeCtrl', ['$scope', '$firebaseArray', homeCtrl]);

  function homeCtrl($scope, $firebaseArray) {
    var vm = $scope;

    var ref = new Firebase('https://dazzling-fire-5094.firebaseio.com');
    var chatsRef = ref.child('chats');
    vm.chats = $firebaseArray(chatsRef);
    
  }
  
})();