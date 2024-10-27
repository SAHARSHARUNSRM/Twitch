// App.js
import { BrowserRouter as Router, Route, Routes, Navigate,useLocation } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import Homepage from "./components/pages/homepage";
import Join from "./components/pages/join";
import Login from "./components/pages/login";
import { useContext, useEffect } from "react";
import { UserContext } from "./components/context/UserContext";
import MeetingRoom from "./components/pages/meetingroom";

// A wrapper to handle token extraction using useLocation inside the Router context
const TokenHandler = ({ setUserToken }) => {
  const location = useLocation(); // Now it's safely inside Router context

  useEffect(() => {
    const hash = location.hash; // Read URL fragment (e.g., #access_token=...)
    const params = new URLSearchParams(hash.replace("#", "?")); // Convert fragment to query params
    const token = params.get("access_token");

    if (token) {
      console.log("Access token found:", token);
      setUserToken(true); // Update state to logged-in
      localStorage.setItem("access_token", token); // Save token for persistence
    }
  }, [location.hash, setUserToken]);

  return null; // This component doesn't render anything
};

const App = () => {
  const { userToken, setUserToken } = useContext(UserContext);

  return (
    <Router>
      {/* TokenHandler component runs only once to extract token */}
      <TokenHandler setUserToken={setUserToken} />

      <div>
        {userToken ? (
          <>
            <Navbar setUserToken={setUserToken} />
            <div className="bg-black">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/join" element={<Join />} />
                <Route path="/room/:roomId" element={<MeetingRoom />} />
              </Routes>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
