(function () {
  'use strict';

  angular
    .module('app')
    .factory('AccountService', AccountService);

  AccountService.$inject = ['$location', '$rootScope'];

  function AccountService($location, $rootScope) {

    var auth = firebase.auth();
    var ref = firebase.database();
    var service = {};

    service.identity = $rootScope.identity = { auth: false };

    auth.onAuthStateChanged(function (user) {

      if (user) {
        console.log('svc: onauth fired');
        console.log(user);

        var currentRef = ref('users/' + user.uid);
        currentRef.once('value', function (snapshot) {
          var isNewUser = snapshot.exists();
          if (isNewUser) {
            ref('users/' + user.uid).set({
              name: getName(user),
              provider: user.provider
            });
          }
        });

        //User authData to set identity
        $rootScope.identity = {
          auth: true,
          name: getName(user),
          provider: user.provider
        };

      } else {
        console.log('svc: not logged in');
      }
    });

    //Helper
    function getName(authData) {
      switch (authData.provider) {
        case 'password':
          return authData.password.email.replace(/@.*/, '');
        case 'twitter':
          return authData.twitter.displayName;
        case 'facebook':
          return authData.facebook.displayName;
      }
    }


    service.logout = function () {
      ref.unauth();
      $rootScope.identity = { auth: false };
      console.log('svc: logout fired');
    };

    return service;
  }

})();

// save the user's profile into the database so we can list users,
// use them in Security and Firebase Rules, and show profiles
//example res
// var authData = {
//   auth: {
//     provider: "facebook",
//     token: {
//       aud: 'dazzling-fire-5094',
//       email: 'a@b.com',
//       email_verified: false,
//       exp: 1465004038,
//       auth_time:1464917638
//     },
//     uid:"facebook:10154384221665145"
//   },
//   expires: 1465004038,
//   provider: 'facebook', token:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9",
//   uid:"facebook:10154384221665145"
// }