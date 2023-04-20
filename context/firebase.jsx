import { createContext, useContext, useState } from "react";
import * as firebase from "firebase/app";
import { getFirestore, collection } from 'firebase/firestore'
import { 
  getAuth, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  // databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const FirebaseContext = createContext(undefined);

function FirebaseProvider({ children }) {

  const firestore = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  // AUTHENTICATION
  const [user, setUser] = useState(null);
  const [isFetchingUser, setIsFetchingUser] = useState(true);

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
    setIsFetchingUser(false);
  });

  const createUserOnFirebase = (email, password) =>
    new Promise(async (resolve, reject) => {
      try {
        const firebaseUser = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        if (!firebaseUser.user) {
          reject();
          return;
        }

        await usersCollection.doc(firebaseUser.user.uid).set({
          email: firebaseUser.user.email,
        });

        resolve();
      } catch (e) {
        reject(e);
      }
    });

  const doUserLoginOnFirebase = (email, password) =>
    new Promise(async (resolve, reject) => {
      try {
        await signInWithEmailAndPassword(auth, email, password);

        resolve();
      } catch (e) {
        reject(e);
      }
    });

  const logoutUserFromFirebase = async () => await auth.signOut();

  // FIRESTORE
  const usersCollection = collection(firestore, "users");

  return (
    <FirebaseContext.Provider
      value={{
        createUserOnFirebase,
        doUserLoginOnFirebase,
        logoutUserFromFirebase,
        user,
        firestore,
        firebase: firebaseApp,
        isFetchingUser,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

function useFirebase() {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }

  return context;
}

export { FirebaseProvider, useFirebase };
