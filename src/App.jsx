import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './HomePage';
import MainPage from './MainPage';
import './style.css';

export default function App() {
  return(
    // A router is used to route to the different pages of the website. When we create a login page, they wont
    // be able to naviate to the main page without logging in
    <Router>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home Page</Link>
          </li>
          <li>
            <Link to="/main">Get started</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </div>
  </Router>
  );
}


