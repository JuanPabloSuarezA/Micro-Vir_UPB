import React, { useState } from "react";

import { Redirect, Route, Switch } from "react-router-dom";

import MenuTop from "../components/Admin/MenuTop/MenuTop";

export default function LayoutAdmin(props) {
  //   const { Header, Content, Footer } = Layout;
  const { routes } = props;

  return (
    <div>
      <div>
        <MenuTop />
        <LoadRoutes routes={routes} />
      </div>
    </div>
  );
}

function LoadRoutes({ routes }) {
  return (
    <Switch>
      {routes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          exact={route.exact}
          component={route.component}
        />
      ))}
    </Switch>
  );
}
