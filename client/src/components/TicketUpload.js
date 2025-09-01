import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TicketUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState('');

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

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setMessage('');
    } else {
      setMessage('Please select a valid image file');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('/api/tickets/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(`Ticket ${response.data.ticketId} uploaded successfully!`);
      setSelectedFile(null);
      document.getElementById('file-input').value = '';
      fetchTickets();
    } catch (error) {
      setMessage('Error uploading ticket: ' + error.response?.data?.message || error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1 className="text-center mb-3">📸 Upload Tickets</h1>
      
      <div className="card">
        <h2>Upload New Ticket</h2>
        <div className="form-group">
          <label htmlFor="file-input" className="form-label">
            Select Ticket Image
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="form-input"
            disabled={uploading}
          />
        </div>
        
        {selectedFile && (
          <div className="mb-2">
            <p><strong>Selected file:</strong> {selectedFile.name}</p>
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px' }}
            />
          </div>
        )}
        
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="btn btn-primary btn-large"
        >
          {uploading ? 'Uploading...' : 'Upload Ticket'}
        </button>
        
        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'} mt-2`}>
            {message}
          </div>
        )}
      </div>

      <div className="card">
        <h2>Uploaded Tickets ({tickets.length})</h2>
        {tickets.length === 0 ? (
          <p>No tickets uploaded yet.</p>
        ) : (
          <div className="grid grid-3">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="card">
                <h3>Ticket {ticket.ticketId}</h3>
                <img
                  src={ticket.imageUrl}
                  alt={`Ticket ${ticket.ticketId}`}
                  className="ticket-image"
                />
                <p className="mt-1">
                  <small>Uploaded: {new Date(ticket.uploadedAt).toLocaleString()}</small>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketUpload;
