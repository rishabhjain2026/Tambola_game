# 🎯 Tambola (Housie) Host Dashboard

A comprehensive web application for managing Tambola/Housie games digitally while players use physical tickets. This system provides a host dashboard for game management, number calling, and claim verification.

## 🚀 Features

### 📸 Ticket Management
- Upload photos of physical tickets
- Automatic assignment of unique IDs (T1, T2, T3...)
- View all uploaded tickets with timestamps

### 🎲 Game Control
- Start new games
- Random number calling (1-90)
- Visual number grid showing called numbers
- Real-time game status tracking

### ✅ Claim Verification
- Verify player claims (Early 5, Line, Full House)
- Compare claimed tickets with called numbers
- Display ticket images for manual verification
- Support for multiple claim types

### 📊 Dashboard
- Overview of game statistics
- Quick access to all features
- Real-time status updates

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3** - Styling with modern design

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd tambola-host-dashboard
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Database Setup
Make sure MongoDB is running on your system:
```bash
# Start MongoDB (Ubuntu/Debian)
sudo systemctl start mongod

# Start MongoDB (macOS with Homebrew)
brew services start mongodb-community

# Start MongoDB (Windows)
net start MongoDB
```

### 4. Environment Configuration
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/tambola-dashboard
PORT=5000
NODE_ENV=development
```

### 5. Start the Application

#### Development Mode
```bash
# Start backend server
npm run dev

# In a new terminal, start frontend
npm run client
```

#### Production Mode
```bash
# Build frontend
npm run build

# Start production server
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🎮 How to Use

### 1. Upload Tickets
1. Navigate to "Upload Tickets" section
2. Click "Choose File" and select ticket images
3. Click "Upload Ticket" to assign unique IDs
4. Repeat for all physical tickets

### 2. Start a Game
1. Go to "Game Control" section
2. Click "Start New Game"
3. Use "Call Number" to randomly select numbers
4. Monitor called numbers on the visual grid

### 3. Verify Claims
1. When a player claims a win, go to "Verify Claims"
2. Enter the ticket ID provided by the player
3. Select the claim type (Early 5, Line, Full House)
4. Review the ticket image against called numbers
5. Verify the claim manually

## 📁 Project Structure

```
tambola-host-dashboard/
├── server/
│   ├── index.js              # Main server file
│   ├── models/
│   │   ├── Ticket.js         # Ticket model
│   │   └── Game.js           # Game model
│   └── public/
│       └── uploads/          # Uploaded ticket images
├── client/
│   ├── public/
│   │   └── index.html        # Main HTML file
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js     # Navigation component
│   │   │   ├── Dashboard.js  # Main dashboard
│   │   │   ├── TicketUpload.js # Ticket upload component
│   │   │   ├── GameControl.js # Game management
│   │   │   └── ClaimVerification.js # Claim verification
│   │   ├── App.js            # Main app component
│   │   ├── index.js          # React entry point
│   │   └── App.css           # Main styles
│   └── package.json          # Frontend dependencies
├── package.json              # Backend dependencies
└── README.md                 # This file
```

## 🔧 API Endpoints

### Tickets
- `GET /api/tickets` - Get all tickets
- `POST /api/tickets/upload` - Upload ticket image

### Game
- `GET /api/game` - Get current game status
- `POST /api/game/start` - Start new game
- `POST /api/game/call-number` - Call random number

### Verification
- `POST /api/verify-claim` - Verify player claim

## 🎯 Game Rules

### Tambola/Housie Rules
- Numbers are called from 1-90
- Players mark numbers on their physical tickets
- Three main winning patterns:
  - **Early 5**: First 5 numbers marked
  - **Line**: Complete horizontal line
  - **Full House**: All numbers on ticket marked

### Host Responsibilities
1. Upload all ticket images before the game
2. Call numbers randomly and clearly
3. Verify player claims against called numbers
4. Maintain game integrity

## 🔒 Security Considerations

- File upload validation (images only)
- Input sanitization
- CORS configuration
- Environment variable management

## 🚀 Deployment

### Heroku Deployment
1. Create a Heroku account
2. Install Heroku CLI
3. Create a new Heroku app
4. Set environment variables
5. Deploy using Git

```bash
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_uri
git push heroku main
```

### Local Production
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- OCR integration for automatic number extraction
- Real-time multiplayer features
- Advanced analytics and reporting
- Mobile app companion
- Voice number calling
- Automated claim verification

---

**Happy Gaming! 🎯🎲**
