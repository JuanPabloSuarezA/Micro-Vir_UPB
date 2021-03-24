import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import routes from "./config/routes";
import 'bootstrap/dist/css/bootstrap.min.css'


function App() {
    return (
        <React.Fragment>
            <Router>
                <Switch>
                    {
                        routes.map((route, index) => (
                            <RouteSubRoutes key={index}{...route}/>
                        ))
                    }
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
            render={props => <route.component routes={route.routes}{...props}/>}
        />
    )
}

export default App;
