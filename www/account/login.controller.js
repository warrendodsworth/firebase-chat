(function () {
  'use strict';

  angular
    .module('app')
    .controller('account.Login', LoginController);

  LoginController.$inject = ['$scope', '$location', '$firebaseAuth', 'AccountService'];

  function LoginController($scope, $location, $firebaseAuth, AccountService) {
    var ngAuth = $firebaseAuth();

    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email,user_likes');
    var auth = firebase.auth();
    var db = firebase.database();
    var vm = $scope;

    vm.facebookLogin = function () {
      auth.signInWithRedirect(provider);

      auth.getRedirectResult().then(function (result) {
        console.log('Redirect result');
        if (result.credential) {
          var token = result.credential.accessToken; //Facebook Access token
        }

        // not working as expected        
        var user = result.user;

        AccountService.identity = user;
        AccountService.identity.auth = true;
        console.log(user);

        var currentRef = db.ref('users/' + user.uid);
        currentRef.once('value', function (snapshot) {
          console.log('Snapshot');
          var isNewUser = !snapshot.exists();
          if (isNewUser) {
            db.ref('users/' + user.uid).set({
              name: user.displayName,
              email: user.email,
              provider: user.provider
            });
          }
        });

        $scope.$apply(function () {
          $location.path('/');
        });
      }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;    // The firebase.auth.AuthCredential type that was used.
      });
    };

  }
})();