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
    user
  } = useFirebase();

  const [userState, setUserState] = useState()
  const [loadingAuth, setLoadingAuth] = useState(true)

  useEffect(() => {
    if(user){
      getLoggedUser()
    } else {
      setLoadingAuth(false)
    }
  }, [user])

  const getLoggedUser = async () => {
    setLoadingAuth(true)
    try{
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
    } catch(err) {
      console.log(err)
    }
    setLoadingAuth(false)
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

  const doLogout = async () => {
    await logoutUserFromFirebase();
    setUserState()
  }

  return (
    <AuthenticationContext.Provider
      value={{
        user: userState,
        getLoggedUser,
        loadingAuth,
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
