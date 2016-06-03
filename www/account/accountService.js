(function () {
  'use strict';

  angular
    .module('app')
    .factory('accountService', Service);

  Service.$inject = ['$location', '$rootScope'];

  function Service($location, $rootScope) {
    var ref = new Firebase('https://dazzling-fire-5094.firebaseio.com');
    var service = {};

    $rootScope.identity = { auth: false };

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

        $location.path('/');

        console.log('svc: onauth fired');
        console.log(authData);
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
//   provider: 'facebook', token:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6IndhcnJlbi5kb2Rzd29ydGhAZ21haWwuY29tIiwicHJvdmlkZXJfaWQiOiIxMDE1NDM4NDIyMTY2NTE0NSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaWF0IjoxNDY0OTE3NjM4LCJ2IjowLCJkIjp7InVpZCI6ImZhY2Vib29rOjEwMTU0Mzg0MjIxNjY1MTQ1IiwicHJvdmlkZXIiOiJmYWNlYm9vayJ9fQ.prqWBtoigt_jzq08b_pcygo2hKnolXmlIXE8EQgPzLo",
//   uid:"facebook:10154384221665145"
// }