const cors = require('cors');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const roomRoutes = require('./routes/route'); // Import your room routes
const { RtcTokenBuilder, RtcRole } = require('agora-access-token'); // Import Agora SDK

const app = express();
app.use(express.json());
app.use(cors());

// Use routes for handling room-related REST APIs
app.use('/api', roomRoutes);

// Route for generating Agora token
app.get('/generate-token', (req, res) => {
    const { channel, uid } = req.query; // Get channel name and user ID from query parameters

    const APP_ID = "5d4e204a0e88498aaa9a56b80608771e"; // Your Agora App ID
    const APP_CERTIFICATE = "d70cd79cc83046bf8cdd503bada592ab"; // Replace with your actual App Certificate

    const role = RtcRole.PUBLISHER; // Set user role
    const expirationTimeInSeconds = 3600; // Token expiration time in seconds
    const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds; // Expiration timestamp

    const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channel, uid, role, privilegeExpiredTs);
    res.json({ token }); // Return the token as JSON
});

// Create an HTTP server and bind WebSocket to it
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Adjusted to match your frontend port
    methods: ['GET', 'POST']
  }
});

// Handle WebSocket connections and room events
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a room
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
    socket.to(room).emit('message', `User ${socket.id} has joined the room.`);
  });

  // Handle incoming messages
  socket.on('message', ({ room, message }) => {
    console.log(`Message from ${socket.id} in room ${room}: ${message}`);
    io.to(room).emit('message', message); // Broadcast message to the room
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server on the specified port
const PORT = process.env.PORT || 3001; // Ensure the backend runs on 3001
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
