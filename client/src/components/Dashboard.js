import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTickets: 0,
    calledNumbers: 0,
    gameActive: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ticketsRes, gameRes] = await Promise.all([
        axios.get('/api/tickets'),
        axios.get('/api/game')
      ]);

      setStats({
        totalTickets: ticketsRes.data.length,
        calledNumbers: gameRes.data.calledNumbers.length,
        gameActive: gameRes.data.isActive
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const restartGame = async () => {
    const confirmed = window.confirm('Are you sure you want to restart the game? This will clear all called numbers and start a fresh game.');
    if (confirmed) {
      try {
        await axios.post('/api/game/restart');
        fetchDashboardData(); // Refresh dashboard data
        alert('Game restarted successfully!');
      } catch (error) {
        alert('Error restarting game: ' + error.response?.data?.message || error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center mb-3">🎯 Tambola Host Dashboard</h1>
      
      <div className="grid grid-3">
        <div className="card text-center">
          <h3>📊 Total Tickets</h3>
          <p className="mb-2" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
            {stats.totalTickets}
          </p>
          <Link to="/upload" className="btn btn-primary">
            Upload More Tickets
          </Link>
        </div>

        <div className="card text-center">
          <h3>🎲 Called Numbers</h3>
          <p className="mb-2" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
            {stats.calledNumbers}/90
          </p>
          <Link to="/game" className="btn btn-primary">
            Manage Game
          </Link>
        </div>

        <div className="card text-center">
          <h3>🎮 Game Status</h3>
          <p className="mb-2" style={{ fontSize: '2rem', fontWeight: 'bold', color: stats.gameActive ? '#28a745' : '#dc3545' }}>
            {stats.gameActive ? '🟢 Active' : '🔴 Inactive'}
          </p>
          <div className="flex flex-center" style={{ gap: '0.5rem', flexDirection: 'column' }}>
            <Link to="/game" className="btn btn-primary">
              {stats.gameActive ? 'Continue Game' : 'Start Game'}
            </Link>
            {stats.gameActive && (
              <button onClick={restartGame} className="btn btn-danger" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                🔄 Restart Game
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Quick Actions</h2>
        <div className="grid grid-2">
          <div>
            <h3>📸 Ticket Management</h3>
            <p>Upload photos of physical tickets and assign unique IDs</p>
            <Link to="/upload" className="btn btn-primary">
              Upload Tickets
            </Link>
          </div>
          <div>
            <h3>🎲 Game Control</h3>
            <p>Start games, call random numbers, and track called numbers</p>
            <Link to="/game" className="btn btn-primary">
              Game Control
            </Link>
          </div>
          <div>
            <h3>✅ Claim Verification</h3>
            <p>Verify player claims (Early 5, Line, Full House) against called numbers</p>
            <Link to="/verify" className="btn btn-primary">
              Verify Claims
            </Link>
          </div>
          <div>
            <h3>📋 Instructions</h3>
            <p>How to use the Tambola Host Dashboard effectively</p>
            <div className="alert alert-info">
              <strong>Quick Guide:</strong><br/>
              1. Upload ticket photos first<br/>
              2. Start a new game<br/>
              3. Call numbers randomly<br/>
              4. Verify player claims
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
