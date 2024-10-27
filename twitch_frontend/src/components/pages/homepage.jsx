import { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [showIcon, setShowIcon] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userData, setUserData] = useState({});
  const [broadcastId, setBroadcastId] = useState("");
  const [streamkey,setstreamKey]=useState("");
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
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data.data[0]);
          console.log(userData);
          setBroadcastId(data.data[0].id);
          localStorage.setItem("user_name",userData.display_name)
          localStorage.setItem("broadcastId",broadcastId)// if we want we set it i local storage 
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
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Stream Key:', data.data[0].stream_key);
          localStorage.setItem('Stream Key:', data.data[0].stream_key);
          setstreamKey(data.data[0].stream_key)// if we want we can set it in local storage da 
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

  const openMeetingRoom =  async () => {
    const newRoomId = generateRoomId();
    setRoomId(newRoomId);
    
    navigate(`/room/${newRoomId}`);
  };

  return (
    <div className="home-page">
      <div className="icon-container">
        <FaPlusCircle className="icon" onClick={() => setShowIcon(prev => !prev)} />
      </div>

      {showIcon && (
        <div className="button-container">
          <button className="action-button" onClick={openMeetingRoom}>
            Create Meeting
          </button>
          <button className="action-button" onClick={() => navigate("/join")}>
            Join Room
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
