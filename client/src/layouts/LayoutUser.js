import React from "react";
import { Route, Switch } from "react-router-dom";
import MenuTop from "../components/User/MenuTop";

export default function LayoutUser(props) {
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
