const express = require("express");
const { createRoom, deleteRoom, joinRoom } = require('../model/roommodel'); 

const router = express.Router();

// Route to create a room
router.post('/createroom', async (req, res) => {
    const { roomId, userName } = req.body;

    if (!roomId || !userName) {
        return res.status(400).json({ message: "Room ID and User Name are required." });
    }

    try {
        const success = await createRoom(roomId, userName);
        if (success) {
            return res.status(201).json({ message: "Room successfully created." });
        } else {
            return res.status(500).json({ message: "Failed to create room." });
        }
    } catch (error) {
        console.error('Error creating room:', error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

// Route to join a room
router.post('/join', async (req, res) => {
    const { roomId, userName } = req.body;

    if (!roomId || !userName) {
        return res.status(400).json({ message: "Room ID and User Name are required." });
    }

    try {
        const success = await joinRoom(roomId, userName);
        if (success) {
            return res.status(200).json({ message: "Successfully joined the room." });
        } else {
            return res.status(404).json({ message: "Room does not exist." });
        }
    } catch (error) {
        console.error('Error joining room:', error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

// Route to delete a room
router.post('/deleteroom', async (req, res) => {
    const { roomId, userName } = req.body;

    if (!roomId || !userName) {
        return res.status(400).json({ message: "Room ID and User Name are required." });
    }

    try {
        const success = await deleteRoom(roomId, userName);
        if (success) {
            return res.status(200).json({ message: "Room successfully deleted." });
        } else {
            return res.status(403).json({ message: "Unauthorized to delete the room." });
        }
    } catch (error) {
        console.error('Error deleting room:', error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

module.exports = router;
