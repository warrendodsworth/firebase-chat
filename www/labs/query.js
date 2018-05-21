
//Query lab

var myUid = 'facebook:10154384221665145';

//Get chatId where I am a member
firebase.database().ref('members').orderByChild(myUid).once('value').then(function (snapshot) {
  chatId = Object.keys(members)[0];

});

//Get users which are not me
firebase.database().ref('users').orderByKey().startAt(myUid).once('value').then(function (users) {
  console.log(users.val());
});

firebase.database().ref('users').orderByChild(myUid).once('value').then(function (users) {
  console.log(users.val());
});
