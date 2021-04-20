// import "./App.css";
import axios from "axios";
import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import routes from "./config/routes";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/Login";
import { logOutApi } from "./api/auth";

function App() {
  const LoadProfile = () => {
    if (!localStorage.getItem("authToken")) {
      return false;
    }

    const check = true;
    axios
      .get("http://localhost:4000/profile", {
        params: {
          Token: localStorage.getItem("authToken"),
        },
      })
      .then((response) => {
        if (response.data.usuario.access === 0) {
          logOutApi();
          check = false;
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return check;
  };
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route path={"/login"} exact={true} component={Login} />
          {/* comment for development */}
          {LoadProfile() ? (
            routes.map((route, index) => (
              <RouteSubRoutes key={index} {...route} />
            ))
          ) : (
            <Redirect to={"/login"} />
          )}
        </Switch>
      </Router>
    </React.Fragment>
  );
}

function RouteSubRoutes(route) {
  return (
    <Route
      path={route.path}
      exact={route.exact}
      render={(props) => <route.component routes={route.routes} {...props} />}
    />
  );
}

export default App;
