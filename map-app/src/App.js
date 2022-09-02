import React from "react";
import { browserHistory } from 'react-router';
import {BrowserRouter, Route, Redirect, Link} from 'react-router-dom'
import Trips from "./components/Trips";
import ViewTrip from "./components/ViewTrip";


function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Route exact path="/">
                    <Trips/>
                </Route>
                <Route exact path="/create">
                    <ViewTrip />
                </Route>
                <Route exact path="/trip/:id">
                    <ViewTrip />
                </Route>
            </BrowserRouter>
        </div>
    );
}

export default App;
