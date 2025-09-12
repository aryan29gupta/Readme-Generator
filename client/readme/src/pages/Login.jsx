import React from "react";

const Login = () => {
  const githubLogin = () => {
    const clientId = "Ov23liNEu0IOsb4dYWg8";
    const redirectUri = "http://localhost:5173/auth/callback";
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo`;
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6">Login to README Generator</h1>
        <p className="text-gray-600 mb-6">
          Login with GitHub to access your repositories directly.
        </p>
        <button
          onClick={githubLogin}
          className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
        >
          Login with GitHub
        </button>
      </div>
    </div>
  );
};

export default Login;
