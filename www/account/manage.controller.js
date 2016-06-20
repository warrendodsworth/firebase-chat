angular.module('app')

  // a factory to create a re-usable Profile object
  .factory('Profile', ['$firebaseObject', '$firebaseAuth',
    function ($firebaseObject, $firebaseAuth) {
      return function (uid) {

        var randomRoomId = Math.round(Math.random() * 100000000);
        var profileRef = firebase.database().ref('users/' + uid);

        return $firebaseObject(profileRef);
      };
    }
  ])

  .controller('account.Manage', ['$scope', '$routeParams', 'Profile', 'currentAuth',
    function ($scope, $routeParams, Profile, currentAuth) {
      var user = $firebaseAuth().$getAuth();
      // create a three-way binding to our Profile as $scope.profile
      Profile(user.uid).$bindTo($scope, 'profile');
    }
  ]);  