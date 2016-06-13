(function () {
  'use-strict';
  //https://www.firebase.com/docs/web/libraries/angular/guide/intro-to-angularfire.html#section-angularfire-intro
  angular
    .module('app')
    .controller('chatCtrl', ['$scope', '$firebaseArray', chatCtrl]);

  function chatCtrl($scope, $firebaseArray) {
    var vm = $scope;
    vm.model = {};

    var msgsRef = firebase.database().ref('messages/');
    vm.messages = $firebaseArray(msgsRef);

    vm.createMsg = function (model) {
      var timestamp = Math.floor(Date.now() / 1000);
      vm.messages.$add({ name: model.name, text: model.text, timestamp: timestamp });

      vm.form.$setPristine();
      vm.model.text = null;
    };

    msgsRef.limitToLast(10).on('child_added', function (snapshot) {
      var message = snapshot.val();
    });

  }
})();