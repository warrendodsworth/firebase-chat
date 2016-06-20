angular.module('app')

  // a factory to create a re-usable Profile object
  // we pass in a username and get back their synchronized data as an object
  .factory('Profile', ['$firebaseObject', '$firebaseAuth',
    function ($firebaseObject, $firebaseAuth) {
      return function (username) {
        var user = $firebaseAuth().$getAuth();

        // create a reference to the database where we will store our data
        var randomRoomId = Math.round(Math.random() * 100000000);
        var profileRef = firebase.database().ref('users/' + user.uid);

        // return it as a synchronized object
        return $firebaseObject(profileRef);
      };
    }
  ])

  .controller('account.Manage', ['$scope', '$routeParams', 'Profile', 'currentAuth',
    function ($scope, $routeParams, Profile, currentAuth) {
      // create a three-way binding to our Profile as $scope.profile
      Profile('warren').$bindTo($scope, 'profile');
    }
  ]);  