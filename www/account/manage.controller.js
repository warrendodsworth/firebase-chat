(function () {
  'use-strict';

  angular
    .module('app')

    .factory('_profile', ['$firebaseObject', '$firebaseAuth',
      function ($firebaseObject, $firebaseAuth) {
        // a factory to create a re-usable Profile object
        return function (uid) {
          var profileRef = firebase.database().ref('users/' + uid);
          return $firebaseObject(profileRef);
        };
      }
    ])

    .controller('account.manage', ['$scope', '$routeParams', '_profile', 'auth',
      function ($scope, $routeParams, Profile, auth) {
        var user = firebase.auth().currentUser;
        // create a three-way binding to our Profile as $scope.profile
        _profile(user.uid).$bindTo($scope, 'profile');
      }
    ]);
})();

