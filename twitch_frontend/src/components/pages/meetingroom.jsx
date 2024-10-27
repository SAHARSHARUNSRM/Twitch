import { useState, useRef, useEffect } from "react";
import { FaVideo, FaDesktop } from "react-icons/fa";
import Chatbox from "../chatbox";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client"; // Import socket.io-client

const MeetingRoom = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [screenActive, setScreenActive] = useState(false);
  const { roomId } = useParams();

  const videoRef = useRef(null);
  const screenRef = useRef(null);
  const socketRef = useRef(null); // Ref for WebSocket connection

  useEffect(() => {
    const createRoomFun = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/createroom", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roomId: roomId,
            userName: localStorage.getItem("user_name"),
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log("Room created successfully:", data);

        // Initialize WebSocket connection
        socketRef.current = io("http://localhost:4000"); // Connect to your WebSocket server

        // Join the room
        socketRef.current.emit("joinRoom", roomId);

        // Listen for messages from the room
        socketRef.current.on("message", (message) => {
          console.log("Message received:", message);
          // You can add code to handle displaying the message in Chatbox
        });

      } catch (error) {
        console.error("Error creating room:", error);
        alert("Failed to create room. Please try again."); // Show an alert
      }
    };

    createRoomFun(); // Call the function

    // Cleanup function to disconnect from the socket
    return () => {
      stopCamera();
      stopScreenShare();
      socketRef.current?.disconnect(); // Clean up on unmount
    };
  }, [roomId]); // Corrected the dependency array

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true; // Mute to avoid echo
      setCameraActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    videoRef.current?.srcObject?.getTracks().forEach((track) => track.stop());
    setCameraActive(false);
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenRef.current.srcObject = stream;
      setScreenActive(true);
    } catch (error) {
      console.error("Error starting screen share:", error);
    }
  };

  const stopScreenShare = () => {
    screenRef.current?.srcObject?.getTracks().forEach((track) => track.stop());
    setScreenActive(false);
  };

  // Example function to send a message
  const sendMessage = (message) => {
    if (socketRef.current) {
      socketRef.current.emit("message", { room: roomId, message });
    }
  };

  return (
    <div className="meeting-room">
      <div className="video-container">
        <h2>Camera Stream</h2>
        <video ref={videoRef} autoPlay playsInline className="video" />
        <button onClick={cameraActive ? stopCamera : startCamera} className="control-button">
          <FaVideo />
          {cameraActive ? " Stop Camera" : " Start Camera"}
        </button>
      </div>

      <div className="screen-container">
        <h2>Screen Share</h2>
        <video ref={screenRef} autoPlay playsInline className="video" />
        <button onClick={screenActive ? stopScreenShare : startScreenShare} className="control-button">
          <FaDesktop />
          {screenActive ? " Stop Sharing" : " Start Screen Share"}
        </button>
      </div>

      <Chatbox sendMessage={sendMessage} /> {/* Pass the sendMessage function to Chatbox */}
    </div>
  );
};

export default MeetingRoom;
