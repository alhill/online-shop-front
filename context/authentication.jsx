import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useFirebase } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../utils";


const AuthenticationContext = createContext(undefined);

const AuthenticationProvider = ({ children }) => {
  const {
    createUserOnFirebase,
    doUserLoginOnFirebase,
    logoutUserFromFirebase,
    user,
    isFetchingUser,
  } = useFirebase();

  const [userState, setUserState] = useState()

  useEffect(() => {
    // console.log(user)
    if(user){
      getLoggedUser()
    }
  }, [user])

  useEffect(() => {
    // console.log({ userState })
  }, [userState])

  const getLoggedUser = async () => {
    if(user){
      const snapshot = await getDoc(doc(firestore, "users", user.uid))
      const fbUser = snapshot.exists() ? snapshot.data() : null
      setUserState({
        email: user.email,
        uid: user.uid,
        ...fbUser
      })
    } else {
      return null
    }
  }

  const doLogin = (email, password) =>
    new Promise(async (resolve, reject) => {
      try {
        await doUserLoginOnFirebase(email, password);
        resolve();
      } catch (e) {
        reject(e);
      }
    });

  const doRegister = (email, password) =>
    new Promise(async (resolve, reject) => {
      try {
        await createUserOnFirebase(email, password);

        resolve();
      } catch (e) {
        reject(e);
      }
    });

  const doLogout = async () => await logoutUserFromFirebase();

  return (
    <AuthenticationContext.Provider
      value={{
        user: userState,
        getLoggedUser,
        isFetchingUser,
        doLogin,
        doRegister,
        doLogout,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

const useAuthentication = () => {
  const context = useContext(AuthenticationContext);

  if (context === undefined) {
    throw new Error(
      "useAuthentication must be used within a AuthenticationProvider"
    );
  }

  return context;
};

export { AuthenticationProvider, useAuthentication };
