(function () {
  'use strict';

  angular
    .module('app')
    .controller('lab', ['$scope', '$firebaseArray', labController]);

  function labController($scope, $firebaseArray) {
    var vm = $scope;
    vm.title = '';
    vm.tweet = {};

    var db = firebase.database();
    var tweets = db.ref('tweets').orderByChild('timestamp').limitToLast(50);

    vm.tweets = $firebaseArray(tweets);

    vm.createTweet = function (tweet) {
      if (tweet.text) {
        tweet.timestamp = firebase.database.ServerValue.TIMESTAMP;
        vm.tweets.$add(tweet);
      }

      vm.tweet = { text: null };
      vm.form.$setPristine();
    };

    vm.updateTweet = function (tweet) {
      vm.tweets.$save(tweet);
    };

    vm.deleteTweet = function (tweet) {
      db.ref('tweets/' + tweet.$id).remove();
    };
  }
})();
