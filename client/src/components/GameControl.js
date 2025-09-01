import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GameControl = () => {
  const [game, setGame] = useState(null);
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [lastCalled, setLastCalled] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchGameData();
  }, []);

  const fetchGameData = async () => {
    try {
      const response = await axios.get('/api/game');
      setGame(response.data);
      setCalledNumbers(response.data.calledNumbers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching game data:', error);
      setLoading(false);
    }
  };

  const startNewGame = async () => {
    try {
      const response = await axios.post('/api/game/start');
      setGame(response.data);
      setCalledNumbers([]);
      setLastCalled(null);
      setMessage('New game started successfully!');
    } catch (error) {
      setMessage('Error starting game: ' + error.response?.data?.message || error.message);
    }
  };

  const restartGame = async () => {
    const confirmed = window.confirm('Are you sure you want to restart the game? This will clear all called numbers and start a fresh game.');
    if (confirmed) {
      try {
        const response = await axios.post('/api/game/restart');
        setGame(response.data);
        setCalledNumbers([]);
        setLastCalled(null);
        setMessage('Game restarted successfully!');
      } catch (error) {
        setMessage('Error restarting game: ' + error.response?.data?.message || error.message);
      }
    }
  };

  const callNumber = async () => {
    try {
      const response = await axios.post('/api/game/call-number');
      setCalledNumbers(response.data.calledNumbers);
      setLastCalled(response.data.calledNumber);
      setMessage(`Number ${response.data.calledNumber} called!`);
    } catch (error) {
      setMessage('Error calling number: ' + error.response?.data?.message || error.message);
    }
  };

  const renderNumberGrid = () => {
    const numbers = [];
    for (let i = 1; i <= 90; i++) {
      const isCalled = calledNumbers.includes(i);
      const isLastCalled = lastCalled === i;
      
      numbers.push(
        <div
          key={i}
          className={`number-cell ${isCalled ? 'called' : ''}`}
          style={{
            backgroundColor: isLastCalled ? '#ffc107' : (isCalled ? '#28a745' : '#f8f9fa'),
            color: isCalled ? 'white' : '#333',
            transform: isLastCalled ? 'scale(1.2)' : 'scale(1)',
            borderColor: isLastCalled ? '#ffc107' : (isCalled ? '#28a745' : '#e9ecef')
          }}
        >
          {i}
        </div>
      );
    }
    return numbers;
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
      <h1 className="text-center mb-3">🎲 Game Control</h1>
      
      <div className="grid grid-2">
        <div className="card">
          <h2>Game Status</h2>
          <div className="mb-3">
            <p><strong>Status:</strong> {game?.isActive ? '🟢 Active' : '🔴 Inactive'}</p>
            <p><strong>Called Numbers:</strong> {calledNumbers.length}/90</p>
            {lastCalled && (
              <p><strong>Last Called:</strong> <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffc107' }}>{lastCalled}</span></p>
            )}
          </div>
          
          <div className="flex flex-center" style={{ gap: '1rem' }}>
            {!game?.isActive ? (
              <button onClick={startNewGame} className="btn btn-success btn-large">
                🎮 Start New Game
              </button>
            ) : (
              <>
                <button onClick={callNumber} className="btn btn-primary btn-large">
                  🎲 Call Number
                </button>
                <button onClick={restartGame} className="btn btn-danger btn-large">
                  🔄 Restart Game
                </button>
              </>
            )}
          </div>
          
          {message && (
            <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'} mt-2`}>
              {message}
            </div>
          )}
        </div>

        <div className="card">
          <h2>Called Numbers</h2>
          {calledNumbers.length === 0 ? (
            <p>No numbers called yet.</p>
          ) : (
            <div>
              <p><strong>Total Called:</strong> {calledNumbers.length}</p>
              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e9ecef', padding: '10px', borderRadius: '8px' }}>
                {calledNumbers.sort((a, b) => a - b).map((num, index) => (
                  <span
                    key={num}
                    style={{
                      display: 'inline-block',
                      margin: '2px',
                      padding: '5px 10px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      borderRadius: '15px',
                      fontSize: '0.9rem'
                    }}
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2>Number Grid (1-90)</h2>
        <p className="mb-2">Click on numbers to see their status. Green = Called, Yellow = Last Called</p>
        <div className="number-grid">
          {renderNumberGrid()}
        </div>
      </div>

      <div className="card">
        <h2>Game Instructions</h2>
        <div className="grid grid-2">
          <div>
            <h3>🎯 How to Play</h3>
            <ul>
              <li>Start a new game when ready</li>
              <li>Click "Call Number" to randomly select a number</li>
              <li>Track called numbers on the grid</li>
              <li>Players mark their physical tickets</li>
              <li>Verify claims when players declare wins</li>
            </ul>
          </div>
          <div>
            <h3>🏆 Winning Patterns</h3>
            <ul>
              <li><strong>Early 5:</strong> First 5 numbers marked</li>
              <li><strong>Line:</strong> Complete horizontal line</li>
              <li><strong>Full House:</strong> All numbers on ticket marked</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameControl;
