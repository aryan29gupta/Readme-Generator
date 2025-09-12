import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {
      console.error("No code in URL");
      return;
    }
    

    const fetchToken = async () => {
      try {
        const res = await axios.post(`https://readme-generator-7mpr.onrender.com/auth/github`, { code });
        const { accessToken } = res.data;
        if (!accessToken) {
          console.error("No access token returned");
          return;
        }

        localStorage.setItem("github_token", accessToken);
        navigate("/"); 
      } catch (err) {
        console.error("GitHub OAuth failed:", err);
      }
    };

    fetchToken();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-700 text-lg">Logging in with GitHub...</p>
    </div>
  );
};

export default AuthCallback;
