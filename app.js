(function () {
  'use-strict';

  var app = angular.module('app', ['firebase']);

  app.controller('HomeCtrl', ['$scope', '$firebaseArray', HomeCtrl]);

  function HomeCtrl($scope, $firebaseArray) {
    var vm = $scope;

    var ref = new Firebase('https://dazzling-fire-5094.firebaseio.com');
    var msgsRef = ref.child('messages');
    vm.messages = $firebaseArray(msgsRef);

    vm.createMsg = function (model) {
      vm.messages.$add({ name: model.name, text: model.text });

      vm.form.$setPristine();
      vm.model.text = null;
    };

    msgsRef.limitToLast(10).on('child_added', function (snapshot) {
      var message = snapshot.val();
    });


    //hide textbox
    vm.setName = function (model) {
      console.log('Blurred');
      vm.nameSet = true;
    };
  }
})();