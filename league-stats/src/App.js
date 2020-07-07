import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useParams } from 'react-router-dom';
import './App.css';
import AccountPage from './components/Account';
import Navigation from './components/Navigation';
import HomePage from './components/Home';

function App() {
  return (
    <div>
    <Navigation />
    <Router>
    <Switch>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route path="/na/:accountID">
        <AccountPage />
      </Route>
    </Switch>
  </Router>
  </div>
  );
}

export default App;
