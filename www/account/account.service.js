(function () {
  'use strict';

  angular
    .module('app')
    .factory('AccountService', AccountService);

  AccountService.$inject = ['$location', '$rootScope'];

  function AccountService($location, $rootScope) {

    var auth = firebase.auth();
    var db = firebase.database();
    var service = {};

    service.identity = { auth: false };

    auth.onAuthStateChanged(function (user) {
      if (user) {
        service.identity.auth = true;
       

        console.log(user);

        user.providerData.forEach(function (profile) {
          if (profile.providerId == 'facebook.com') {
            service.identity.name = profile.displayName;
            service.identity.email = profile.email;
            service.identity.photoURL = profile.photoURL;
          }
          console.log("  Provider-specific UID: " + profile.uid);
        });

        var currentRef = db.ref('users/' + user.uid);
        currentRef.once('value', function (snapshot) {
          var isNewUser = !snapshot.exists();
          if (isNewUser) {
            db.ref('users/' + user.uid).set({
              name: service.identity.name,
              email: service.identity.email,
            });
          }
        });

        console.log('svc: user logged in');
        $rootScope.$apply(function () {
          $location.path('/');
        });
      } else {
        console.log('svc: not logged in');
        $rootScope.$apply(function () {
          $location.path('/login');
        });
      }
    });

    service.logout = function () {
      auth.signOut().then(function () {
        console.log('svc: logout fired');
      });
      service.identity = { auth: false };
      return service.identity;
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


// var currentRef = db.ref('users/' + user.uid);
// currentRef.once('value', function (snapshot) {
//   var isNewUser = snapshot.exists();
//   if (isNewUser) {
//     db.ref('users/' + user.uid).set({
//       name: getName(user),
//       provider: user.provider
//     });
//   }
// });


// function getName(user) {
//   switch (user.provider) {
//     case 'password':
//       return user.password.email.replace(/@.*/, '');
//     case 'twitter':
//       return user.twitter.displayName;
//     case 'facebook':
//       return user.facebook.displayName;
//   }
// }


// auth.onAuthStateChanged(function (user) {
//   if (user)
//     $location.path('/');
//   else
//     $location.path('/login');
// });