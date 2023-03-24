import React from "react";
import { BrowserRouter } from "react-router-dom";
import { FirebaseProvider } from "./context/firebase";
import { AuthenticationProvider } from "./context/authentication";
import { DataProvider } from './context/dataProvider'

export const RootProvider = ({ children }) => {
  return (
    <BrowserRouter>
      <FirebaseProvider>
        <AuthenticationProvider>
          <DataProvider>
            {children}
          </DataProvider>
        </AuthenticationProvider>
      </FirebaseProvider>
    </BrowserRouter>
  );
};
