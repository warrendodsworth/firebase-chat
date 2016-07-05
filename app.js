/// <reference path="typings/index.d.ts" /> 
// Node server

var firebase = require('firebase');
var config = {
  apiKey: 'AIzaSyC9xO8omc7TxZZ0n4SOQW3bpE-uRryaVD4',
  authDomain: 'dazzling-fire-5094.firebaseapp.com',
  databaseURL: 'https://dazzling-fire-5094.firebaseio.com/',
  storageBucket: 'gs://dazzling-fire-5094.appspot.com'
};
firebase.initializeApp(config);

var db = firebase.database();
var ref = db.ref("users");
ref.once("value", function(users) {
  console.log(users.numChildren());
});

