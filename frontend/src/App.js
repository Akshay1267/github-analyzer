import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// SVG score ring component
function ScoreRing({ score, color, size = 200 }) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="score-ring-container" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="score-ring-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <circle
          className="score-ring-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="score-text-group">
        <div className="score-value">{score}</div>
      </div>
    </div>
  );
}

function App() {
  const [githubUrl, setGithubUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await axios.post(`${API_URL}/api/analyze`, { githubUrl });
      setAnalysis(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze profile. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#4ADE80';
    if (score >= 50) return '#FBBF24';
    return '#F87171';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="App">
      {/* ─── Header ─── */}
      <header className="header">
        <div className="container">
          <div className="header-inner">
            <div className="header-brand">
              <div className="brand-icon">📊</div>
              <div className="brand-text">
                <h1>GitHub Analyzer</h1>
                <p>Portfolio Intelligence</p>
              </div>
            </div>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main ─── */}
      <main className="main">
        <div className="container">
          {/* Hero / Search */}
          <section className="hero-section">
            <h2 className="hero-title">
              Analyze your <span className="accent">GitHub</span> portfolio
            </h2>
            <p className="hero-subtitle">
              Get recruiter-ready scores, actionable insights, and data-driven recommendations for your GitHub profile.
            </p>

            <form onSubmit={handleAnalyze} className="search-form">
              <div className="input-group">
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="Enter GitHub username or profile URL..."
                  className="input"
                  disabled={loading}
                  required
                  id="github-url-input"
                />
                <button type="submit" className="btn-primary" disabled={loading} id="analyze-btn">
                  {loading ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>
            </form>
          </section>

          {/* Error */}
          {error && (
            <div className="error-box" role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Analyzing GitHub profile…</p>
            </div>
          )}

          {/* ─── Results ─── */}
          {analysis && (
            <div className="results">
              {/* Profile Header */}
              <div className="profile-header stagger-item">
                <img src={analysis.avatarUrl} alt={analysis.username} className="avatar" />
                <div className="profile-info">
                  <h2>{analysis.username}</h2>
                  <a href={analysis.profileUrl} target="_blank" rel="noopener noreferrer" className="profile-link">
                    View on GitHub →
                  </a>
                </div>
              </div>

              {/* Overall Score */}
              <div className="overall-score stagger-item">
                <div className="section-title">
                  <span className="section-icon">🏆</span>
                  Overall Portfolio Score
                </div>
                <ScoreRing
                  score={analysis.overallScore}
                  color={getScoreColor(analysis.overallScore)}
                />
                <div className="score-label">{getScoreLabel(analysis.overallScore)}</div>

                {/* Score Legend */}
                <div className="score-legend">
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#4ADE80' }}></div>
                    <div className="legend-text">
                      <span className="legend-label">80–100</span>
                      <span className="legend-desc">Excellent</span>
                    </div>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#4ADE80' }}></div>
                    <div className="legend-text">
                      <span className="legend-label">70–79</span>
                      <span className="legend-desc">Good</span>
                    </div>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#FBBF24' }}></div>
                    <div className="legend-text">
                      <span className="legend-label">50–69</span>
                      <span className="legend-desc">Fair</span>
                    </div>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: '#F87171' }}></div>
                    <div className="legend-text">
                      <span className="legend-label">0–49</span>
                      <span className="legend-desc">Needs Work</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="stats-grid">
                <div className="stat-card stagger-item">
                  <div className="stat-value">{analysis.stats.totalRepos}</div>
                  <div className="stat-label">Public Repos</div>
                </div>
                <div className="stat-card stagger-item">
                  <div className="stat-value">{analysis.stats.followers}</div>
                  <div className="stat-label">Followers</div>
                </div>
                <div className="stat-card stagger-item">
                  <div className="stat-value">{Math.floor(analysis.stats.accountAge / 365)}y</div>
                  <div className="stat-label">Account Age</div>
                </div>
              </div>

              {/* Language Statistics */}
              {analysis.languageStats && analysis.languageStats.topLanguages.length > 0 && (
                <div className="language-stats stagger-item">
                  <div className="section-title">
                    <span className="section-icon">💻</span>
                    Most Used Languages
                  </div>
                  <div className="language-grid">
                    {analysis.languageStats.topLanguages.map((lang, idx) => (
                      <div key={idx} className="language-card">
                        <div className="language-header">
                          <span className="language-name">{lang.language}</span>
                          <span className="language-percentage">{lang.percentage}%</span>
                        </div>
                        <div className="language-bar">
                          <div
                            className="language-fill"
                            style={{ width: `${lang.percentage}%` }}
                          ></div>
                        </div>
                        <div className="language-count">{lang.count} {lang.count === 1 ? 'repository' : 'repositories'}</div>
                      </div>
                    ))}
                  </div>
                  <div className="language-summary">
                    <p>
                      <strong>Primary Language:</strong> {analysis.languageStats.mostUsed}
                      <span className="separator">•</span>
                      <strong>Total Languages:</strong> {analysis.languageStats.totalLanguages}
                    </p>
                  </div>
                </div>
              )}

              {/* Score Breakdown */}
              <div className="score-breakdown stagger-item">
                <div className="section-title">
                  <span className="section-icon">📈</span>
                  Score Breakdown
                </div>
                <div className="scores-grid">
                  {Object.entries(analysis.scores).map(([key, value]) => (
                    <div key={key} className="score-item">
                      <div className="score-item-header">
                        <span className="score-item-name">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <span className="score-item-value" style={{ color: getScoreColor(value) }}>
                          {value}/100
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${value}%`,
                            backgroundColor: getScoreColor(value)
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights */}
              <div className="insights-section">
                <div className="insight-box strengths stagger-item">
                  <h4>💪 Strengths</h4>
                  {analysis.insights.strengths.length > 0 ? (
                    <ul>
                      {analysis.insights.strengths.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="empty-state">Keep building to unlock strengths!</p>
                  )}
                </div>

                <div className="insight-box weaknesses stagger-item">
                  <h4>⚠️ Areas to Improve</h4>
                  {analysis.insights.weaknesses.length > 0 ? (
                    <ul>
                      {analysis.insights.weaknesses.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="empty-state">Great job! No major weaknesses found.</p>
                  )}
                </div>

                {analysis.insights.redFlags.length > 0 && (
                  <div className="insight-box red-flags stagger-item">
                    <h4>🚩 Red Flags</h4>
                    <ul>
                      {analysis.insights.redFlags.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Recommendations */}
              <div className="recommendations stagger-item">
                <div className="section-title">
                  <span className="section-icon">🎯</span>
                  Actionable Recommendations
                </div>
                <div className="recommendations-grid">
                  {analysis.recommendations.map((rec, idx) => (
                    <div key={idx} className="recommendation-card">
                      <div className="rec-header">
                        <span className="rec-category">{rec.category}</span>
                        <span className={`rec-priority priority-${rec.priority.toLowerCase()}`}>
                          {rec.priority}
                        </span>
                      </div>
                      <h4>{rec.action}</h4>
                      <p>{rec.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="footer">
        <p>Built for UnsaidTalks GitHub Portfolio Analyzer Hackathon 2026</p>
      </footer>
    </div>
  );
}

export default App;
