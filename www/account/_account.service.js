(function () {
  'use strict';

  angular
    .module('app')
    .factory('_account', accountService);

  accountService.$inject = ['$location', '$rootScope', '$firebaseAuth'];

  function accountService($location, $rootScope, $firebaseAuth) {
    var svc = {};
    var auth = firebase.auth();
    var db = firebase.database();
    var amOnline = db.ref('.info/connected');
    svc.auth = null;

    $firebaseAuth().$onAuthStateChanged(function (user) {
      if (user) {
        var userRef = db.ref('users/' + user.uid);
        userRef.once('value', function (userSnap) {
          var isNewUser = !userSnap.exists();


          user.providerData.forEach(function (profile) {
            if (profile.providerId == 'facebook.com') {
              svc.auth = isNewUser ? profile : userSnap.val();
              svc.auth.photoURL = profile.photoURL;
              userRef.set(svc.auth);
            }
          });

          $rootScope.$broadcast('login', svc.auth);
        });

        var presenceRef = db.ref('presence/' + user.uid);
        amOnline.on('value', function (snapshot) {
          if (snapshot.val()) {
            presenceRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
            presenceRef.set(true);
          }
        });

        $location.path('/');
      } else {
        $location.path('/login');
      }
    });

    svc.logout = function () {
      $firebaseAuth().$signOut();
      svc.auth = null;
      $rootScope.$broadcast('logout', svc.auth);
      return svc.auth;
    };

    return svc;
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
