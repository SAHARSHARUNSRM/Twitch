import { useState, useRef } from "react";
import { FaPlusCircle, FaVideo, FaDesktop } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [showIcon, setIcon] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [showStreamButton, setShowStreamButton] = useState(false);
  const [inMeetingRoom, setInMeetingRoom] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [screenActive, setScreenActive] = useState(false);

  const videoRef = useRef(null); // Camera stream reference
  const screenRef = useRef(null); // Screen share stream reference
  const navigate = useNavigate();

  const Joinfunc = () => {
    console.log("Joining another room");
    navigate("/join");
  };

  const generateRoomId = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    for (let i = 0; i < 6; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
  };

  const toggleFunction = () => setIcon((prev) => !prev);

  const openMeetingRoom = () => {
    const newRoomId = generateRoomId();
    console.log("Room ID:", newRoomId);
    setRoomId(newRoomId);
    setShowStreamButton(true);
  };

  const startCamera = async () => {
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true, // Capture audio only once
      });
      if (videoRef.current) {
        videoRef.current.srcObject = cameraStream;
        videoRef.current.muted = true; // Prevent echo
      }
      setCameraActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false, // No need for audio during screen sharing
      });
      if (screenRef.current) screenRef.current.srcObject = screenStream;
      setScreenActive(true);
    } catch (error) {
      console.error("Error accessing screen share:", error);
    }
  };

  const stopCamera = () => {
    const tracks = videoRef.current?.srcObject?.getTracks();
    tracks?.forEach((track) => track.stop());
    setCameraActive(false);
  };

  const stopScreenShare = () => {
    const tracks = screenRef.current?.srcObject?.getTracks();
    tracks?.forEach((track) => track.stop());
    setScreenActive(false);
  };

  if (inMeetingRoom) {
    return (
      <div style={{ backgroundColor: "#000", height: "100vh", display: "flex", gap: "10px", padding: "10px" }}>
        {/* Camera Section */}
        <div style={styles.cameraContainer}>
          <h2>Camera Stream</h2>
          <video ref={videoRef} autoPlay playsInline style={styles.video} />
          <button
            style={styles.button}
            onClick={cameraActive ? stopCamera : startCamera}
          >
            <FaVideo style={{ marginRight: "5px" }} />
            {cameraActive ? "Stop Camera" : "Start Camera"}
          </button>
        </div>

        {/* Screen Share Section */}
        <div style={styles.screenShareContainer}>
          <h2>Screen Share</h2>
          <video ref={screenRef} autoPlay playsInline style={styles.video} />
          <button
            style={styles.button}
            onClick={screenActive ? stopScreenShare : startScreenShare}
          >
            <FaDesktop style={{ marginRight: "5px" }} />
            {screenActive ? "Stop Sharing" : "Start Screen Share"}
          </button>
        </div>

        {/* Chatbox Section */}
        <div style={styles.chatboxContainer}>
          <h2>Chatbox</h2>
          <input type="text" placeholder="Type a message..." style={styles.chatInput} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-auto flex">
      <div className="pl-10 pt-10 pb-10">
        <FaPlusCircle className="text-4xl text-purple-800 cursor-pointer transition-colors duration-300 hover:text-white" onClick={toggleFunction} />
      </div>
      <div className={`transition-opacity duration-300 ease-in-out ${showIcon ? "opacity-100" : "opacity-0"}`}>
        {showIcon && (
          <div className="pl-4 pt-10">
            <button className="text-white bg-purple-800 hover:bg-purple-600 transition duration-300 ease-in-out p-2 rounded" onClick={openMeetingRoom}>
              Create Meeting
            </button>
            <button className="text-white bg-purple-800 hover:bg-purple-600 transition duration-300 ease-in-out p-2 rounded ml-2" onClick={Joinfunc}>
              Join Room
            </button>

            {roomId && (
              <div className="mt-4 text-white">
                <p>Room ID: {roomId}</p>
                {showStreamButton && (
                  <button className="text-white bg-green-600 hover:bg-green-500 transition duration-300 ease-in-out p-2 rounded mt-2" onClick={() => setInMeetingRoom(true)}>
                    Stream
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  cameraContainer: {
    backgroundColor: "#282828",
    width: "20%",
    height: "100%",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFF",
    padding: "10px",
  },
  screenShareContainer: {
    backgroundColor: "#6441A5",
    width: "60%",
    height: "100%",
    borderRadius: "10px",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFF",
  },
  video: {
    width: "100%",
    height: "80%",
    borderRadius: "10px",
    objectFit: "cover",
  },
  button: {
    backgroundColor: "#9147FF",
    color: "#FFF",
    border: "none",
    borderRadius: "5px",
    padding: "10px",
    marginTop: "10px",
    cursor: "pointer",
  },
  chatboxContainer: {
    backgroundColor: "#1E1E1E",
    width: "20%",
    height: "100%",
    borderRadius: "10px",
    padding: "10px",
    color: "#FFF",
    overflowY: "auto",
  },
  chatInput: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
  },
};

export default HomePage;
