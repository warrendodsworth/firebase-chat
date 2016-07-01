
//Query lab

//Get chatId where I am a member
firebase.database().ref('members').orderByChild('facebook:10154384221665145').once('value').then(function (snapshot) {
  chatId = Object.keys(members)[0];

});

//Get users which are not me
firebase.database().ref('users').orderByKey().startAt('facebook:10154384221665145').once('value').then(function (users) {
  console.log(users.val());
});

firebase.database().ref('users').orderByChild('facebook:10154384221665145').once('value').then(function (users) {
  console.log(users.val());
});
