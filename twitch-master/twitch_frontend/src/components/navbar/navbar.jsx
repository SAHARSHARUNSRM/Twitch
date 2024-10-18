import { useContext } from "react";
import { BsTwitch } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // Ensure this import is correct

const Navbar = () => {
  const { setUserToken, AccessToken, setAccessToken } = useContext(UserContext);
  const navigate = useNavigate();
  var a=localStorage.getItem("access_token")

  const handleLogout = async () => {
    try {
      const CLIENT_ID = "5yo6ymvaacda7679fed23c153eomoe";
      const ACCESS_TOKEN = a;

      console.log("Access Token:", ACCESS_TOKEN); 
      console.log("from the navbar"); // Log the access token

      const response = await fetch("https://id.twitch.tv/oauth2/revoke", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          token: ACCESS_TOKEN,
        }),
      });

      if (response.ok) {
        // Reset user token and access token in context
        setUserToken(false);
        setAccessToken("");
        console.log("Logout successful");

        // Optionally clear cookies (if needed, but generally not required for OAuth tokens)
        clearAllCookies();

        // Redirect to the login page or homepage
        navigate("/"); // Redirect user to the homepage or login page
      } else {
        const errorData = await response.json(); // Get error details
        console.error("Error:", errorData); // Log error details
      }
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  // Function to clear all cookies (if you specifically set any)
  const clearAllCookies = () => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      // Set cookie expiration date to the past for both root and current path
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"; // For root path
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.twitch.tv"; // For domain
    }
    console.log("All cookies cleared.");
  };

  return (
    <div className="container flex justify-between p-4 bg-navbargrey">
      <div>
        <Link to="/">
          <BsTwitch className="text-4xl text-white" />
        </Link>
      </div>

      <div>
        <ul className="flex space-x-8 mr-3">
          <li className="text-white">
            <Link to="/">Home</Link>
          </li>
          <li className="text-white">
            <Link to="/settings">Settings</Link>
          </li>
          <li>
            <button onClick={handleLogout} className="text-white">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
