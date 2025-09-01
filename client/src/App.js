import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import TicketUpload from './components/TicketUpload';
import ClaimVerification from './components/ClaimVerification';
import GameControl from './components/GameControl';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<TicketUpload />} />
            <Route path="/verify" element={<ClaimVerification />} />
            <Route path="/game" element={<GameControl />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
