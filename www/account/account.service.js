(function () {
  'use strict';

  angular
    .module('app')
    .factory('AccountService', AccountService);

  AccountService.$inject = ['$location', '$rootScope', '$firebaseAuth'];

  function AccountService($location, $rootScope, $firebaseAuth) {
    var service = {};
    var auth = firebase.auth();
    var db = firebase.database();
    var amOnline = db.ref('.info/connected');
    service.auth = {};

    //Presence    
    // if (firebase.auth().currentUser) {
    // }

    //Init auth watcher    
    $firebaseAuth().$onAuthStateChanged(function (user) {
      if (user) {


        var currentRef = firebase.database().ref('users/' + user.uid);
        currentRef.once('value', function (snapshot) {
          var isNewUser = !snapshot.exists();
          if (isNewUser) {
            user.providerData.forEach(function (profile) {
              if (profile.providerId == 'facebook.com') {
                currentRef.set({
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
            var profile = snapshot.val();
            service.auth.name = profile.name;
            service.auth.email = profile.email;
            service.auth.photoURL = profile.photoURL;
          }
        });

        console.log('svc: user logged in');

        var userRef = db.ref('presence/' + user.uid);
        amOnline.on('value', function (snapshot) {
          if (snapshot.val()) {
            userRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
            userRef.set(true);
          }
        });

        $location.path('/');
      } else {
        console.log('svc: not logged in');
        $location.path('/login');
      }
    });

    //Logout    
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
// var currentRef = db.ref('users/' + user.uid);
// currentRef.once('value', function (snapshot) {
//   var isNewUser = snapshot.exists();
//   if (isNewUser) {
//     currentRef.set({
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
