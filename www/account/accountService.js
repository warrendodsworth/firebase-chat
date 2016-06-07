(function () {
  'use strict';

  angular
    .module('app')
    .factory('accountService', Service);

  Service.$inject = ['$location', '$rootScope'];

  function Service($location, $rootScope) {
    var ref = new Firebase('https://dazzling-fire-5094.firebaseio.com');
    var service = {};

    service.identity = $rootScope.identity = { auth: false };

    service.logout = function () {
      ref.unauth();
      $rootScope.identity = { auth: false };
      console.log('svc: logout fired');
    };

    ref.onAuth(function (authData) {

      if (authData) {
        // save the user's profile into the database so we can list users,
        // use them in Security and Firebase Rules, and show profiles
        var currentRef = ref.child('users').child(authData.uid);
        currentRef.once('value', function (snapshot) {
          var isNewUser = snapshot.exists();
          if (isNewUser) {
            ref.child("users").child(authData.uid).set({
              provider: authData.provider,
              name: getName(authData)
            });
          }
        });

        //User authData to set identity
        $rootScope.identity = {
          auth: true,
          name: getName(authData),
          provider: authData.provider
        };

        console.log('svc: onauth fired');
        console.log(authData);

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

    return service;
  }
})();

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