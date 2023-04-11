import React, { useState } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { Home, Register, LastPage, MyAccount, Product, Category, Cart, VerifyUser, RecoverPassword } from "./pages"
import { useAuthentication } from "./context/authentication";

export const App = () => {
  const { isFetchingUser, isLogged } = useAuthentication();

  // if (!isLogged && isFetchingUser) return <LoadingScreen />;

  return isLogged ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

const AuthenticatedApp = () => {
  const { isLogged } = useAuthentication();

  if (!isLogged) return <Redirect to="/?login" />;

  return (
    <Switch>
      <Route exact path="/"><Home /></Route>
      <Route exact path="/nuevo-usuario"><Redirect to="/" /></Route>
      <Route exact path="/verificar-usuario"><Redirect to="/" /></Route>
      <Route exact path="/recuperar-contrasena"><Redirect to="/" /></Route>
      <Route exact path="/producto/:slug"><Product /></Route>
      <Route exact path="/categoria/:id"><Category /></Route>
      <Route exact path="/cesta"><Cart /></Route>
      <Route exact path="/finalizar-compra"><LastPage /></Route>
      <Route exact path="/mi-cuenta"><MyAccount /></Route>
      <Route path="">Error 404 - Page not found!</Route>
    </Switch>
  );
};

const UnauthenticatedApp = () => {
  return (
    <Switch>
      <Route exact path="/"><Home /></Route>
      <Route exact path="/nuevo-usuario"><Register /></Route>
      <Route exact path="/verificar-usuario"><VerifyUser /></Route>
      <Route exact path="/recuperar-contrasena"><RecoverPassword /></Route>
      <Route exact path="/producto/:slug"><Product /></Route>
      <Route exact path="/categoria/:id"><Category /></Route>
      <Route exact path="/cesta"><Cart /></Route>
      <Route path="">Error 404 - Page not found!</Route>
    </Switch>
  );
};
