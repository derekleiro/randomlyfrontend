import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

const devConfig = {
  apiKey: "AIzaSyCkXI9xk9GcwQ9IlVC5_NUitcH4n5tiukM",
  authDomain: "gezako-8a7aa.firebaseapp.com",
  // databaseURL: "YOUR_DATABASE_URL",
  projectId: "gezako-8a7aa",
  storageBucket: "gezako-8a7aa.appspot.com"
};

const prodConfig = {
  apiKey: "AIzaSyCkXI9xk9GcwQ9IlVC5_NUitcH4n5tiukM",
  authDomain: "localhost",
  // databaseURL: "YOUR_DATABASE_URL",
  projectId: "gezako-8a7aa",
  storageBucket: "gezako-8a7aa.appspot.com"
};

const config =
    process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

firebase.initializeApp(config);

export default firebase;
