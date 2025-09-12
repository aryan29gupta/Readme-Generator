import React, { useState } from "react";

const ReadmeGenerator = ({ repositories = [], user }) => {
  const [selectedRepo, setSelectedRepo] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [repoData, setRepoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [useDropdown, setUseDropdown] = useState(true);

  // Handle repository selection from dropdown
  const handleRepoSelect = async (repoUrl) => {
    if (!repoUrl) {
      setRepoData(null);
      setSelectedRepo("");
      return;
    }

    setSelectedRepo(repoUrl);
    setLoading(true);

    try {
      // Find the selected repository from the repositories array
      const selectedRepository = repositories.find(repo => repo.html_url === repoUrl);
      
      if (selectedRepository) {
        setRepoData(selectedRepository);
      } else {
        // Fallback: fetch repo data from URL
        const response = await fetch("http://localhost:5000/fetch-repo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repoUrl }),
        });
        const data = await response.json();
        setRepoData(data);
      }
    } catch (err) {
      console.error("Error fetching repo:", err);
      alert("Failed to fetch repository data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle manual repo URL input
  const fetchRepo = async () => {
    if (!repoUrl) return;
    
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/fetch-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });
      const data = await response.json();
      setRepoData(data);
    } catch (err) {
      console.error("Error fetching repo:", err);
      alert("Failed to fetch repository data. Please check the URL.");
    } finally {
      setLoading(false);
    }
  };

  const generateReadme = async () => {
    if (!repoData) return;
    
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/generate-readme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoData }),
      });
      const data = await response.json();
      setRepoData({ ...repoData, readme: data.markdown });
    } catch (err) {
      console.error("Error generating README:", err);
      alert("Failed to generate README. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (repoData?.readme) {
      navigator.clipboard.writeText(repoData.readme);
      alert("README copied to clipboard!");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        <span role="img" aria-label="doc">📄</span> README Generator
      </h1>

      {/* Toggle between dropdown and manual input */}
      {repositories.length > 0 && (
        <div className="mb-6 text-center">
          <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setUseDropdown(true)}
              className={`px-4 py-2 text-sm font-medium ${
                useDropdown
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Select from Your Repos
            </button>
            <button
              onClick={() => setUseDropdown(false)}
              className={`px-4 py-2 text-sm font-medium ${
                !useDropdown
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Enter URL Manually
            </button>
          </div>
        </div>
      )}

      {/* Repository selection via dropdown */}
      {useDropdown && repositories.length > 0 ? (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose from your repositories:
          </label>
          <select
            value={selectedRepo}
            onChange={(e) => handleRepoSelect(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
            disabled={loading}
          >
            <option value="">Select a repository...</option>
            {repositories.map((repo) => (
              <option key={repo.id} value={repo.html_url}>
                {repo.full_name}
                {repo.private && " 🔒"}
                {repo.language && ` • ${repo.language}`}
                {` • ⭐ ${repo.stargazers_count}`}
              </option>
            ))}
          </select>
        </div>
      ) : (
        /* Manual URL input */
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GitHub Repository URL:
          </label>
          <input
            type="text"
            placeholder="https://github.com/username/repository"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={loading}
          />
          <button
            className="w-full mt-3 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            onClick={fetchRepo}
            disabled={!repoUrl || loading}
          >
            {loading ? "⏳ Fetching..." : "Fetch Repository"}
          </button>
        </div>
      )}

      {loading && !repoData && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading repository data...</p>
        </div>
      )}

      {/* Repository Information Display */}
      {repoData && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {repoData.full_name}
              </h2>
              <p className="text-gray-600 mb-3">
                {repoData.description || "No description available"}
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {repoData.language || "No language"}
                </span>
                <span className="text-gray-500">⭐ {repoData.stargazers_count} stars</span>
                <span className="text-gray-500">🍴 {repoData.forks_count} forks</span>
                <span className="text-gray-500">
                  Updated: {new Date(repoData.updated_at).toLocaleDateString()}
                </span>
                {repoData.private && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    🔒 Private
                  </span>
                )}
              </div>
            </div>
            {repoData.owner?.avatar_url && (
              <img
                src={repoData.owner.avatar_url}
                alt={repoData.owner.login}
                className="w-16 h-16 rounded-full border-2 border-gray-300"
              />
            )}
          </div>

          {/* Generate README Button */}
          <button
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-lg"
            onClick={generateReadme}
            disabled={loading}
          >
            {loading ? "🤖 Generating README..." : "✨ Generate README with AI"}
          </button>
        </div>
      )}

      {/* Generated README Display */}
      {repoData?.readme && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              🎉 Generated README
            </h3>
            <button
              onClick={copyToClipboard}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              📋 Copy to Clipboard
            </button>
          </div>
          
          {/* README Preview */}
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-800 text-white px-4 py-2 flex items-center">
              <span className="text-sm font-mono">README.md</span>
              <div className="ml-auto flex space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div className="p-6 bg-white max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                {repoData.readme}
              </pre>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">
              ✅ README generated successfully! You can copy it to your clipboard and paste it into your repository's README.md file.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadmeGenerator;