var firebase = require("firebase");
require('firebase/auth');
require('firebase/database');

var config = {
        apiKey: "AIzaSyD0Xq4-JgMvbTLX6m1zX10A3DtcbtNG-1Q",
        authDomain: "learn-8009f.firebaseapp.com",
        databaseURL: "https://learn-8009f.firebaseio.com/",
        storageBucket: 'gs://learn-8009f.appspot.com',
        serviceAccount: "server/learn-0a26cbc00315.json",
      };

firebase.initializeApp(config);