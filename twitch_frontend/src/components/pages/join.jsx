import React, { useRef, useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom"; 
import io from "socket.io-client"; // Import the socket.io client
import TWITCHBG2 from './TWITCHBG2.jpg';

const Join = () => {
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const roomId = useRef('');
  const [error, setError] = useState(""); // State for error message
  const socketRef = useRef(); // Create a ref for the socket instance

  const handleInputChange = (e, index) => {
    const value = e.target.value;

    // Move focus to the next or previous input based on input value
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    if (!value && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    console.log(`Input ${index} changed to:`, value);

    // Update roomId based on the values of the inputs
    roomId.current = Array.from(inputRefs.current)
      .map((input) => input.value)
      .join('');
  };

  const handleKeyDown = (e, index) => {
    // Allow only alphanumeric input and Backspace
    if (!/[0-9a-zA-Z]/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault();
    }
  };

  const validate = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/join", { // Corrected URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          roomId: roomId.current, 
          userName: localStorage.getItem("user_name"), // Assuming you are storing the username in localStorage
        }),
      });

      // Check if the response is okay (status in the range 200-299)
      if (response.ok) {
        const data = await response.json(); // Parse the JSON response
        console.log("Join created successfully:", data);

        // Establish WebSocket connection to the server
        socketRef.current = io("http://localhost:4000"); // Connect to your server
        socketRef.current.emit("joinRoom", roomId.current); // Emit an event to join the room

        navigate(`/room/${roomId.current}`); // Adjust as needed based on your URL structure
      } else {
        const errorMessage = await response.text(); // Get the error message
        console.error("Failed to join room:", errorMessage);
        setError("Room ID does not match. Please re-enter."); // Set error message
      }
    } catch (error) {
      console.error("Error joining room:", error);
      setError("An error occurred while joining the room."); // Set error message for network errors
    }
  };

  // Clean up the socket connection when the component unmounts
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${TWITCHBG2})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: '#0D120D' }}>
        <div className="flex space-x-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              maxLength={1}
              className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-transparent text-white"
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              style={{ color: '#FFFFFF' }}
            />
          ))}
        </div>
        <button className="bg-violet-900 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-all mt-4" onClick={validate}>
          Join Stream
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>} {/* Display error message */}
      </div>
    </div>
  );
};

export default Join;
