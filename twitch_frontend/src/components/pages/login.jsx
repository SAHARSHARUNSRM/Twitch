const Login = () => {
  const CLIENT_ID = "5yo6ymvaacda7679fed23c153eomoe";
  const REDIRECT_URI = "http://localhost:5173/"; // Redirect to homepage after login
  const STATE = "c3ab8aa609ea11e793ae92361f002671";

  const SCOPES = encodeURIComponent(
    "chat:edit chat:read channel:manage:broadcast channel:read:stream_key clips:edit channel:manage:videos"
  );

  const handleLogin = () => {
    const authUrl = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${SCOPES}&state=${STATE}`;

    console.log("Redirecting to:", authUrl); // Debug log
    window.location.replace(authUrl);
  };

  return (
    <div>
      <button onClick={handleLogin} className="active:bg-red-500">
        Login with Twitch
      </button>
    </div>
  );
};

export default Login;
