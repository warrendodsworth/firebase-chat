angular
  .module('app')


  .factory('Profile', ['$firebaseObject', '$firebaseAuth',
    function ($firebaseObject, $firebaseAuth) {
      // a factory to create a re-usable Profile object
      return function (uid) {
        var profileRef = firebase.database().ref('users/' + uid);
        return $firebaseObject(profileRef);
      };
    }
  ])

  .controller('account.Manage', ['$scope', '$routeParams', 'Profile', 'currentAuth',
    function ($scope, $routeParams, Profile, currentAuth) {
      var user = firebase.auth().currentUser;
      // create a three-way binding to our Profile as $scope.profile
      Profile(user.uid).$bindTo($scope, 'profile');
    }
  ]);


// var randomRoomId = Math.round(Math.random() * 100000000);