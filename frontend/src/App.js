import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [githubUrl, setGithubUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

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
    if (score >= 70) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <h1>🚀 GitHub Portfolio Analyzer</h1>
          <p>Turn your repositories into recruiter-ready proof</p>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <form onSubmit={handleAnalyze} className="search-form">
            <div className="input-group">
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="Enter GitHub username or profile URL (e.g., octocat)"
                className="input"
                disabled={loading}
                required
              />
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze Profile'}
              </button>
            </div>
          </form>

          {error && (
            <div className="error-box">
              <strong>Error:</strong> {error}
            </div>
          )}

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Analyzing GitHub profile...</p>
            </div>
          )}

          {analysis && (
            <div className="results">
              {/* Profile Header */}
              <div className="profile-header">
                <img src={analysis.avatarUrl} alt={analysis.username} className="avatar" />
                <div>
                  <h2>{analysis.username}</h2>
                  <a href={analysis.profileUrl} target="_blank" rel="noopener noreferrer" className="profile-link">
                    View on GitHub →
                  </a>
                </div>
              </div>

              {/* Overall Score */}
              <div className="overall-score">
                <h3>Overall Portfolio Score</h3>
                <div className="score-circle" style={{ borderColor: getScoreColor(analysis.overallScore) }}>
                  <div className="score-value">{analysis.overallScore}</div>
                  <div className="score-label">{getScoreLabel(analysis.overallScore)}</div>
                </div>
                
                {/* Score Legend */}
                <div className="score-legend">
                  <h4>Score Guide</h4>
                  <div className="legend-items">
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
                      <div className="legend-text">
                        <span className="legend-label">80-100</span>
                        <span className="legend-desc">Excellent</span>
                      </div>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
                      <div className="legend-text">
                        <span className="legend-label">70-79</span>
                        <span className="legend-desc">Good</span>
                      </div>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
                      <div className="legend-text">
                        <span className="legend-label">50-69</span>
                        <span className="legend-desc">Fair</span>
                      </div>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
                      <div className="legend-text">
                        <span className="legend-label">0-49</span>
                        <span className="legend-desc">Needs Work</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{analysis.stats.totalRepos}</div>
                  <div className="stat-label">Public Repos</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{analysis.stats.followers}</div>
                  <div className="stat-label">Followers</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{Math.floor(analysis.stats.accountAge / 365)}y</div>
                  <div className="stat-label">Account Age</div>
                </div>
              </div>

              {/* Language Statistics */}
              {analysis.languageStats && analysis.languageStats.topLanguages.length > 0 && (
                <div className="language-stats">
                  <h3>💻 Most Used Programming Languages</h3>
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
              <div className="score-breakdown">
                <h3>Score Breakdown</h3>
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
                <div className="insight-box strengths">
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

                <div className="insight-box weaknesses">
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
                  <div className="insight-box red-flags">
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
              <div className="recommendations">
                <h3>🎯 Actionable Recommendations</h3>
                <div className="recommendations-grid">
                  {analysis.recommendations.map((rec, idx) => (
                    <div key={idx} className="recommendation-card">
                      <div className="rec-header">
                        <span className="rec-category">{rec.category}</span>
                        <span className={`rec-priority priority-${rec.priority.toLowerCase()}`}>
                          {rec.priority} Priority
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

      <footer className="footer">
        <p>Built for UnsaidTalks GitHub Portfolio Analyzer Hackathon 2026</p>
      </footer>
    </div>
  );
}

export default App;
