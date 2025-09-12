import React, { useState, useEffect } from "react";
import ReadmeGenerator from "../components/ReadmeGenerator";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data and repositories
  useEffect(() => {
    const token = localStorage.getItem("github_token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const userResponse = await axios.get("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        });
        setUser(userResponse.data);

        // Fetch user repositories
        const reposResponse = await axios.get("https://api.github.com/user/repos", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
          params: {
            sort: "updated",
            per_page: 100, // Get up to 100 repos
          },
        });
        setRepositories(reposResponse.data);
        
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data");
        // If token is invalid, redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem("github_token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("github_token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleLogout}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Header with User Profile */}
      <header className="w-full bg-white shadow-sm border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {user?.avatar_url && (
              <img
                src={user.avatar_url}
                alt={user.name || user.login}
                className="w-10 h-10 rounded-full border-2 border-gray-300"
              />
            )}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {user?.name || user?.login}
              </h2>
              <p className="text-sm text-gray-600">
                {user?.public_repos} repositories • {user?.followers} followers
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16 px-4 flex flex-col items-center text-center">
        <div className="flex items-center space-x-4 mb-4">
          {user?.avatar_url && (
            <img
              src={user.avatar_url}
              alt={user.name || user.login}
              className="w-16 h-16 rounded-full border-4 border-white/20"
            />
          )}
          <div className="text-left">
            <h1 className="text-3xl md:text-4xl font-bold">
              Welcome back, {user?.name?.split(' ')[0] || user?.login}!
            </h1>
            <p className="text-blue-100">
              Ready to generate some amazing README files?
            </p>
          </div>
        </div>
        <p className="text-lg md:text-xl max-w-2xl mb-8">
          Create well-structured, eye-catching README files for your GitHub projects in seconds using AI-powered automation.
        </p>
        <a
          href="#generator"
          className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300"
        >
          Get Started
        </a>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold mb-4">Save Time</h3>
            <p className="text-gray-600">
              Automatically generate README files so you can focus on coding instead of documentation.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold mb-4">AI Powered</h3>
            <p className="text-gray-600">
              Leverage AI to create accurate and professional content tailored to your project.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold mb-4">Customizable</h3>
            <p className="text-gray-600">
              Easily tweak sections, add badges, and structure your README to fit your style.
            </p>
          </div>
        </div>
      </section>

      {/* Generator Section */}
      <section id="generator" className="w-full py-20 px-4 bg-gray-100 flex justify-center">
        <div className="w-full max-w-4xl">
          <ReadmeGenerator repositories={repositories} user={user} />
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white py-6 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} README Generator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;