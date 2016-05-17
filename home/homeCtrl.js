(function () {
  'use-strict';
  
  angular.module('app')
    .controller('HomeCtrl', ['$scope', '$firebaseArray', HomeCtrl]);

  function HomeCtrl($scope, $firebaseArray) {
    var vm = $scope;

    var ref = new Firebase('https://dazzling-fire-5094.firebaseio.com');
    var chatsRef = ref.child('chats');
    vm.chats = $firebaseArray(chatsRef);

        
    
  }
  
})();