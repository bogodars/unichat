import firebase from 'firebase/app'
import 'firebase/auth'

export const auth = firebase.initializeApp({
  apiKey: "AIzaSyBgO9_qoVtTFzUKODvLVVJ1lNR4w3SK_wg",
  authDomain: "unichat-5f29d.firebaseapp.com",
  projectId: "unichat-5f29d",
  storageBucket: "unichat-5f29d.appspot.com",
  messagingSenderId: "946726220246",
  appId: "1:946726220246:web:9db5ca2747d484131db477"
}).auth();

