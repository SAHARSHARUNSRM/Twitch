import { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [showIcon, setShowIcon] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userData, setUserData] = useState({});
  const [broadcastId, setBroadcastId] = useState("");
  const [streamKey, setStreamKey] = useState("");
  const [showStreamButton, setShowStreamButton] = useState(false);
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.twitch.tv/helix/users", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Client-Id': '5yo6ymvaacda7679fed23c153eomoe'
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data.data[0]);
          setBroadcastId(data.data[0].id);
          localStorage.setItem("user_name", data.data[0].display_name);
          localStorage.setItem("broadcastId", data.data[0].id);
        } else {
          console.error('Error fetching user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchStreamKey = async () => {
      if (!broadcastId) return;

      try {
        const response = await fetch(`https://api.twitch.tv/helix/streams/key?broadcaster_id=${broadcastId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Client-Id': '5yo6ymvaacda7679fed23c153eomoe'
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStreamKey(data.data[0].stream_key);
          localStorage.setItem('streamKey', data.data[0].stream_key);
        } else {
          console.error('Error fetching stream key:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchStreamKey();
  }, [broadcastId, token]);

  const generateRoomId = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length: 6 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
  };

  const createMeeting = () => {
    const newRoomId = generateRoomId();
    setRoomId(newRoomId);
    setShowStreamButton(true);

    // Delay navigation to allow the stream button to be visible
    setTimeout(() => {
      navigate(`/room/${newRoomId}`);
    }, 2000); // 2 seconds delay
  };

  return (
    <div className="home-page">
      <div className="icon-container">
        <FaPlusCircle 
          className="icon" 
          onClick={() => setShowIcon(prev => !prev)} 
        />
      </div>

      {showIcon && (
        <div className="button-container">
          <button 
            className="action-button" 
            onClick={createMeeting}
          >
            Create Meeting
          </button>
          <button 
            className="action-button" 
            onClick={() => navigate("/join")}
          >
            Join Room
          </button>
        </div>
      )}

      {showStreamButton && (
        <div className="stream-container">
          <div className="room-code">Meeting Room Code: {roomId}</div>
          <button 
            className="stream-button"
            style={{ backgroundColor: '#28a745', color: '#ffffff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }} // Green button with margin-top
          >
            Start Streaming
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
