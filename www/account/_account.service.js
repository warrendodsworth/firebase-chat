(function () {
  'use strict';

  angular
    .module('app')
    .factory('_account', accountService);

  accountService.$inject = ['$location', '$rootScope', '$firebaseAuth'];

  function accountService($location, $rootScope, $firebaseAuth) {
    var service = {};
    var auth = firebase.auth();
    var db = firebase.database();
    var amOnline = db.ref('.info/connected');
    service.auth = {};

    //Init auth watcher    
    $firebaseAuth().$onAuthStateChanged(function (user) {
      if (user) {

        var userRef = db.ref('users/' + user.uid);
        userRef.once('value', function (userSnap) {
          var isNewUser = !userSnap.exists();
          if (isNewUser) {
            user.providerData.forEach(function (profile) {
              if (profile.providerId == 'facebook.com') {
                userRef.set({
                  name: profile.displayName,
                  email: profile.email,
                  photoURL: profile.photoURL
                });
                service.auth.name = profile.displayName;
                service.auth.email = profile.email;
                service.auth.photoURL = profile.photoURL;
              }
            });
          } else {
            //So that we load the users saved changes when they login, and not overwrite them with provider values
            var profile = userSnap.val();
            service.auth.name = profile.name;
            service.auth.email = profile.email; 
            service.auth.photoURL = profile.photoURL;
          }
        });

        var presenceRef = db.ref('presence/' + user.uid);
        amOnline.on('value', function (snapshot) {
          if (snapshot.val()) {
            presenceRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
            presenceRef.set(true); 
          }
        });

        console.log('svc - logged in');
        $location.path('/');
      } else {
        console.log('svc - not logged in');
        $location.path('/login');
      }
    });

    service.logout = function () {
      $firebaseAuth().$signOut();
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
