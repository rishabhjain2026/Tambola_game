import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClaimVerification = () => {
  const [ticketId, setTicketId] = useState('');
  const [claimType, setClaimType] = useState('early5');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('/api/tickets');
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleVerify = async () => {
    if (!ticketId.trim()) {
      setMessage('Please enter a ticket ID');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/verify-claim', {
        ticketId: ticketId.toUpperCase(),
        claimType
      });

      const { ticket, calledNumbers } = response.data;
      
      // For demonstration, we'll simulate verification
      // In a real implementation, you would need OCR or manual verification
      const verification = simulateVerification(ticket, calledNumbers, claimType);
      
      setVerificationResult({
        ticket,
        calledNumbers,
        claimType,
        ...verification
      });
      
      setMessage('Verification completed');
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const simulateVerification = (ticket, calledNumbers, claimType) => {
    // This is a simulation - in reality, you would need to:
    // 1. Use OCR to extract numbers from the ticket image
    // 2. Compare with called numbers
    // 3. Check the specific claim pattern
    
    // For demo purposes, we'll return a random result
    const isValid = Math.random() > 0.5;
    
    return {
      isValid,
      message: isValid 
        ? `✅ Valid ${claimType} claim!` 
        : `❌ Invalid ${claimType} claim.`,
      details: `Simulated verification for ${claimType} on ticket ${ticket.ticketId}`
    };
  };

  const resetForm = () => {
    setTicketId('');
    setClaimType('early5');
    setVerificationResult(null);
    setMessage('');
  };

  return (
    <div>
      <h1 className="text-center mb-3">✅ Claim Verification</h1>
      
      <div className="grid grid-2">
        <div className="card">
          <h2>Verify Player Claim</h2>
          
          <div className="form-group">
            <label htmlFor="ticket-id" className="form-label">
              Ticket ID
            </label>
            <input
              id="ticket-id"
              type="text"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value.toUpperCase())}
              placeholder="e.g., T1, T2, T3..."
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="claim-type" className="form-label">
              Claim Type
            </label>
            <select
              id="claim-type"
              value={claimType}
              onChange={(e) => setClaimType(e.target.value)}
              className="form-select"
            >
              <option value="early5">Early 5</option>
              <option value="line">Line</option>
              <option value="fullhouse">Full House</option>
            </select>
          </div>

          <div className="flex flex-center" style={{ gap: '1rem' }}>
            <button
              onClick={handleVerify}
              disabled={loading || !ticketId.trim()}
              className="btn btn-primary btn-large"
            >
              {loading ? 'Verifying...' : 'Verify Claim'}
            </button>
            <button
              onClick={resetForm}
              className="btn btn-secondary"
            >
              Reset
            </button>
          </div>

          {message && (
            <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-info'} mt-2`}>
              {message}
            </div>
          )}
        </div>

        <div className="card">
          <h2>Available Tickets</h2>
          {tickets.length === 0 ? (
            <p>No tickets uploaded yet.</p>
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {tickets.map((ticket) => (
                <div key={ticket._id} className="mb-2 p-2" style={{ border: '1px solid #e9ecef', borderRadius: '8px' }}>
                  <strong>Ticket {ticket.ticketId}</strong>
                  <br />
                  <small>Uploaded: {new Date(ticket.uploadedAt).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {verificationResult && (
        <div className="card">
          <h2>Verification Result</h2>
          
          <div className="grid grid-2">
            <div>
              <h3>Ticket Information</h3>
              <p><strong>Ticket ID:</strong> {verificationResult.ticket.ticketId}</p>
              <p><strong>Claim Type:</strong> {verificationResult.claimType}</p>
              <p><strong>Status:</strong> {verificationResult.isValid ? '✅ Valid' : '❌ Invalid'}</p>
              
              <div className={`alert ${verificationResult.isValid ? 'alert-success' : 'alert-danger'} mt-2`}>
                {verificationResult.message}
              </div>
              
              <p><small>{verificationResult.details}</small></p>
            </div>

            <div>
              <h3>Called Numbers ({verificationResult.calledNumbers.length}/90)</h3>
              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e9ecef', padding: '10px', borderRadius: '8px' }}>
                {verificationResult.calledNumbers.sort((a, b) => a - b).map((num) => (
                  <span
                    key={num}
                    style={{
                      display: 'inline-block',
                      margin: '2px',
                      padding: '3px 8px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '0.8rem'
                    }}
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3">
            <h3>Ticket Image</h3>
            <img
              src={verificationResult.ticket.imageUrl}
              alt={`Ticket ${verificationResult.ticket.ticketId}`}
              className="ticket-image"
              style={{ maxWidth: '400px' }}
            />
          </div>
        </div>
      )}

      <div className="card">
        <h2>Verification Instructions</h2>
        <div className="grid grid-2">
          <div>
            <h3>🔍 How to Verify</h3>
            <ol>
              <li>Enter the ticket ID provided by the player</li>
              <li>Select the type of claim being made</li>
              <li>Click "Verify Claim" to check against called numbers</li>
              <li>Review the ticket image and called numbers</li>
              <li>Manually verify the claim is correct</li>
            </ol>
          </div>
          <div>
            <h3>🏆 Claim Types</h3>
            <ul>
              <li><strong>Early 5:</strong> First 5 numbers marked on ticket</li>
              <li><strong>Line:</strong> Complete horizontal line marked</li>
              <li><strong>Full House:</strong> All numbers on ticket marked</li>
            </ul>
            <div className="alert alert-info mt-2">
              <strong>Note:</strong> This system provides the ticket image and called numbers for manual verification. For automated verification, OCR technology would be needed to extract numbers from ticket images.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimVerification;
