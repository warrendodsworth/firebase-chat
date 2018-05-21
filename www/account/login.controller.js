(function () {
  'use strict';

  angular
    .module('app')
    .controller('account.login', loginController);

  loginController.$inject = ['$scope', '$location', '$firebaseAuth', '_account'];

  function loginController($scope, $location, $firebaseAuth, _account) {
    var vm = $scope;
    var auth = firebase.auth();
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email,user_likes');

    vm.facebookLogin = function () {
      $firebaseAuth().$signInWithRedirect(provider);
    };

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        var userRef = db.ref('users/' + user.uid);
        userRef.once('value', function (userSnap) {
          if (!userSnap.exists()) {
            user.providerData.forEach(function (profile) {
              if (profile.providerId == 'facebook.com') {
                // firebase.auth().currentUser.updateProfile({
                userRef.set({
                  displayName: profile.displayName,
                  email: profile.email,
                  photoURL: profile.photoURL
                });
              }
            });
          }
        });

        var presenceRef = db.ref('presence/' + user.uid);
        amOnline.on('value', function (snap) {
          if (snap.val()) {
            presenceRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
            presenceRef.set(true);
          }
        });

        console.log('login: user logged in');
        $location.path('/');
      }

      $scope.$apply();
    });
  }
})();


