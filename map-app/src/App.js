import logo from './logo.svg';
// import './App.scss';
import CreateTrip from "./components/CreateTrip";
import React from "react";
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
                    <CreateTrip/>
                </Route>
                <Route exact path="/trip/:id">
                    <ViewTrip />
                </Route>
            </BrowserRouter>
        </div>
    );
}

export default App;
