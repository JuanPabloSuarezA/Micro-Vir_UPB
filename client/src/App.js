// import "./App.css";
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
import Register from "./pages/Register";

function App() {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route path={"/register"} exact={true} component={Register} />
          <Route path={"/login"} exact={true} component={Login} />
          {/* comment for development */}
          {localStorage.getItem("authToken") ? (
            routes.map((route, index) => (
              <RouteSubRoutes key={index} {...route} />
            ))
          ) : (
            <Redirect to={"/login"} />
          )}
          {/* {routes.map((route, index) => (
            <RouteSubRoutes key={index} {...route} />
          ))} */}
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
