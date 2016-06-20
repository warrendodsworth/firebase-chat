(function () {
  'use strict';

  angular
    .module('app')
    .factory('AccountService', AccountService);

  AccountService.$inject = ['$location', '$rootScope', '$firebaseAuth'];

  function AccountService($location, $rootScope, $firebaseAuth) {
    var service = {};
    service.auth = {};

    //Init auth watcher    
    $firebaseAuth().$onAuthStateChanged(function (user) {
      if (user) {
        user.providerData.forEach(function (profile) {
          if (profile.providerId == 'facebook.com') {
            service.auth.name = profile.displayName;
            service.auth.email = profile.email;
            service.auth.photoURL = profile.photoURL;
          }
        });

        var currentRef = firebase.database().ref('users/' + user.uid);
        currentRef.once('value', function (snapshot) {
          var isNewUser = !snapshot.exists();
          if (isNewUser) {
            currentRef.set({
              name: service.auth.name,
              email: service.auth.email,
            });
          }
        });

        console.log('svc: user logged in');
        console.log(user);
        $location.path('/');
      } else {
        console.log('svc: not logged in');
        $location.path('/login');
      }
    });

    //Logout    
    service.logout = function () {
      $firebaseAuth().$signOut()
      service.auth = {};
      return service.auth;
    };

    return service;
  }

})();














// auth.getRedirectResult().then(function (result) {
//   if (result.credential) {
//     var token = result.credential.accessToken; //Facebook Access token
//   }
// }).catch(function (error) {
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   var email = error.email;
//   var credential = error.credential;    // The firebase.auth.AuthCredential type that was used.
// });


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