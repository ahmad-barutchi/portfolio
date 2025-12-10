import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {

  apiKey: "AIzaSyAVQ8Z068ugQ7ciQ-BCSRH72vP5aDstAMY",

  authDomain: "abarutchi.firebaseapp.com",

  projectId: "abarutchi",

  storageBucket: "abarutchi.firebasestorage.app",

  messagingSenderId: "123827535454",

  appId: "1:123827535454:web:b68ebaf276568f4d673ecf",

  measurementId: "G-B1VMYMELGH"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);