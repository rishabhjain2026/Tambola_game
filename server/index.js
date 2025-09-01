const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tambola-dashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Models
const Ticket = require('./models/Ticket');
const Game = require('./models/Game');

// Routes

// Get all tickets
app.get('/api/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ ticketId: 1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload ticket image
app.post('/api/tickets/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // Generate unique ticket ID
    const ticketCount = await Ticket.countDocuments();
    const ticketId = `T${ticketCount + 1}`;

    const ticket = new Ticket({
      ticketId: ticketId,
      imageUrl: `/uploads/${req.file.filename}`,
      uploadedAt: new Date()
    });

    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current game
app.get('/api/game', async (req, res) => {
  try {
    let game = await Game.findOne().sort({ createdAt: -1 });
    if (!game) {
      game = new Game({
        calledNumbers: [],
        isActive: false
      });
      await game.save();
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start new game
app.post('/api/game/start', async (req, res) => {
  try {
    // End any currently active game
    await Game.updateMany({ isActive: true }, { isActive: false });
    
    const game = new Game({
      calledNumbers: [],
      isActive: true
    });
    await game.save();
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Restart game (same as start but with explicit confirmation)
app.post('/api/game/restart', async (req, res) => {
  try {
    // End any currently active game
    await Game.updateMany({ isActive: true }, { isActive: false });
    
    const game = new Game({
      calledNumbers: [],
      isActive: true
    });
    await game.save();
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Call random number
app.post('/api/game/call-number', async (req, res) => {
  try {
    let game = await Game.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!game) {
      return res.status(400).json({ message: 'No active game found' });
    }

    const availableNumbers = [];
    for (let i = 1; i <= 90; i++) {
      if (!game.calledNumbers.includes(i)) {
        availableNumbers.push(i);
      }
    }

    if (availableNumbers.length === 0) {
      return res.status(400).json({ message: 'All numbers have been called' });
    }

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const calledNumber = availableNumbers[randomIndex];

    game.calledNumbers.push(calledNumber);
    await game.save();

    res.json({ calledNumber, calledNumbers: game.calledNumbers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify claim
app.post('/api/verify-claim', async (req, res) => {
  try {
    const { ticketId, claimType } = req.body;

    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const game = await Game.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!game) {
      return res.status(400).json({ message: 'No active game found' });
    }

    // For now, return the ticket info and called numbers
    // The actual verification logic will be implemented in the frontend
    res.json({
      ticket,
      calledNumbers: game.calledNumbers,
      claimType
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
