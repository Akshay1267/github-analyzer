const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// GitHub API configuration
const GITHUB_API = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Optional but recommended for higher rate limits

const githubHeaders = GITHUB_TOKEN 
  ? { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' }
  : { Accept: 'application/vnd.github.v3+json' };

// Analyzer endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { githubUrl } = req.body;
    
    if (!githubUrl) {
      return res.status(400).json({ error: 'GitHub URL is required' });
    }

    // Extract username from URL
    const username = extractUsername(githubUrl);
    if (!username) {
      return res.status(400).json({ error: 'Invalid GitHub URL' });
    }

    // Fetch data from GitHub API
    const [userProfile, repos, events] = await Promise.all([
      fetchUserProfile(username),
      fetchRepos(username),
      fetchEvents(username)
    ]);

    // Analyze and score
    const analysis = analyzeProfile(userProfile, repos, events);

    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error.message);
    res.status(500).json({ 
      error: 'Failed to analyze profile', 
      details: error.message 
    });
  }
});

// Extract username from GitHub URL
function extractUsername(url) {
  const patterns = [
    /github\.com\/([^\/\?]+)/,
    /^([a-zA-Z0-9-]+)$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Fetch user profile
async function fetchUserProfile(username) {
  const response = await axios.get(`${GITHUB_API}/users/${username}`, { headers: githubHeaders });
  return response.data;
}

// Fetch repositories
async function fetchRepos(username) {
  const response = await axios.get(`${GITHUB_API}/users/${username}/repos`, {
    headers: githubHeaders,
    params: { per_page: 100, sort: 'updated' }
  });
  return response.data;
}

// Fetch recent events
async function fetchEvents(username) {
  try {
    const response = await axios.get(`${GITHUB_API}/users/${username}/events/public`, {
      headers: githubHeaders,
      params: { per_page: 100 }
    });
    return response.data;
  } catch (error) {
    return [];
  }
}

// Main analysis logic
function analyzeProfile(user, repos, events) {
  const scores = {
    documentation: calculateDocumentationScore(repos),
    codeQuality: calculateCodeQualityScore(repos),
    consistency: calculateConsistencyScore(events, user),
    organization: calculateOrganizationScore(repos),
    impact: calculateImpactScore(repos, user),
    technicalDepth: calculateTechnicalDepthScore(repos)
  };

  const overallScore = calculateOverallScore(scores);
  const insights = generateInsights(scores, repos, user, events);
  const recommendations = generateRecommendations(scores, repos);
  const languageStats = calculateLanguageStats(repos);

  return {
    username: user.login,
    profileUrl: user.html_url,
    avatarUrl: user.avatar_url,
    overallScore,
    scores,
    insights,
    recommendations,
    languageStats,
    stats: {
      totalRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      accountAge: calculateAccountAge(user.created_at)
    }
  };
}

// Documentation Score (0-100)
function calculateDocumentationScore(repos) {
  if (repos.length === 0) return 0;

  let score = 0;
  let withReadme = 0;
  let withDescription = 0;

  repos.forEach(repo => {
    if (repo.description) withDescription++;
    // We'll assume repos with good descriptions likely have READMEs
    // In production, you'd fetch each repo's README
  });

  withReadme = Math.min(repos.length, Math.floor(withDescription * 0.8));
  
  const readmeRatio = withReadme / Math.min(repos.length, 10);
  const descriptionRatio = withDescription / repos.length;
  
  score = (readmeRatio * 0.6 + descriptionRatio * 0.4) * 100;
  
  return Math.round(score);
}

// Code Quality Score (0-100)
function calculateCodeQualityScore(repos) {
  if (repos.length === 0) return 0;

  let score = 0;
  const activeRepos = repos.filter(r => !r.fork && r.size > 0);
  
  if (activeRepos.length === 0) return 30;

  // Factors: stars, forks, watchers, topics
  const avgStars = activeRepos.reduce((sum, r) => sum + r.stargazers_count, 0) / activeRepos.length;
  const avgForks = activeRepos.reduce((sum, r) => sum + r.forks_count, 0) / activeRepos.length;
  const withTopics = activeRepos.filter(r => r.topics && r.topics.length > 0).length;
  const topicsRatio = withTopics / activeRepos.length;

  score += Math.min(30, avgStars * 3);
  score += Math.min(20, avgForks * 4);
  score += topicsRatio * 30;
  score += activeRepos.length > 5 ? 20 : (activeRepos.length / 5) * 20;

  return Math.round(Math.min(100, score));
}

// Consistency Score (0-100)
function calculateConsistencyScore(events, user) {
  if (events.length === 0) return 20;

  const now = new Date();
  const pushEvents = events.filter(e => e.type === 'PushEvent');
  
  // Check activity in last 30, 90, 180 days
  const last30Days = pushEvents.filter(e => {
    const eventDate = new Date(e.created_at);
    return (now - eventDate) / (1000 * 60 * 60 * 24) <= 30;
  }).length;

  const last90Days = pushEvents.filter(e => {
    const eventDate = new Date(e.created_at);
    return (now - eventDate) / (1000 * 60 * 60 * 24) <= 90;
  }).length;

  let score = 0;
  score += Math.min(40, last30Days * 4);
  score += Math.min(30, last90Days * 1.5);
  score += pushEvents.length > 0 ? 30 : 0;

  return Math.round(Math.min(100, score));
}

// Organization Score (0-100)
function calculateOrganizationScore(repos) {
  if (repos.length === 0) return 0;

  const pinnedQuality = repos.slice(0, 6); // Assume first 6 are best maintained
  const withTopics = repos.filter(r => r.topics && r.topics.length > 0).length;
  const forkedRatio = repos.filter(r => r.fork).length / repos.length;
  const archived = repos.filter(r => r.archived).length;

  let score = 0;
  score += (withTopics / repos.length) * 40;
  score += (1 - forkedRatio) * 30;
  score += repos.length > 0 ? Math.min(30, (repos.length - archived) * 2) : 0;

  return Math.round(Math.min(100, score));
}

// Impact Score (0-100)
function calculateImpactScore(repos, user) {
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
  const totalWatchers = repos.reduce((sum, r) => sum + r.watchers_count, 0);

  let score = 0;
  score += Math.min(40, totalStars * 2);
  score += Math.min(30, totalForks * 3);
  score += Math.min(20, user.followers * 0.5);
  score += Math.min(10, totalWatchers * 1);

  return Math.round(Math.min(100, score));
}

// Technical Depth Score (0-100)
function calculateTechnicalDepthScore(repos) {
  if (repos.length === 0) return 0;

  const languages = new Set();
  repos.forEach(r => {
    if (r.language) languages.add(r.language);
  });

  const languageCount = languages.size;
  const complexRepos = repos.filter(r => r.size > 100 && !r.fork).length;
  
  let score = 0;
  score += Math.min(40, languageCount * 8);
  score += Math.min(40, complexRepos * 10);
  score += repos.length > 3 ? 20 : (repos.length / 3) * 20;

  return Math.round(Math.min(100, score));
}

// Calculate overall score
function calculateOverallScore(scores) {
  const weights = {
    documentation: 0.20,
    codeQuality: 0.20,
    consistency: 0.15,
    organization: 0.15,
    impact: 0.15,
    technicalDepth: 0.15
  };

  let overall = 0;
  for (const [key, weight] of Object.entries(weights)) {
    overall += scores[key] * weight;
  }

  return Math.round(overall);
}

// Generate insights
function generateInsights(scores, repos, user, events) {
  const insights = {
    strengths: [],
    weaknesses: [],
    redFlags: []
  };

  // Strengths
  if (scores.documentation >= 70) insights.strengths.push('Strong documentation practices');
  if (scores.consistency >= 70) insights.strengths.push('Consistent contribution activity');
  if (scores.impact >= 60) insights.strengths.push('Projects have community impact');
  if (scores.technicalDepth >= 70) insights.strengths.push('Diverse technical skill set');

  // Weaknesses
  if (scores.documentation < 50) insights.weaknesses.push('Many repositories lack proper documentation');
  if (scores.consistency < 40) insights.weaknesses.push('Irregular commit activity');
  if (scores.organization < 50) insights.weaknesses.push('Repositories need better organization');
  if (scores.codeQuality < 50) insights.weaknesses.push('Limited evidence of code quality practices');

  // Red flags
  if (repos.length < 3) insights.redFlags.push('Very few public repositories');
  if (events.length < 10) insights.redFlags.push('Low recent activity');
  const forkRatio = repos.filter(r => r.fork).length / Math.max(repos.length, 1);
  if (forkRatio > 0.7) insights.redFlags.push('Mostly forked repositories - limited original work');
  if (scores.consistency < 30) insights.redFlags.push('Long periods of inactivity');

  return insights;
}

// Generate recommendations
function generateRecommendations(scores, repos) {
  const recommendations = [];

  if (scores.documentation < 70) {
    recommendations.push({
      category: 'Documentation',
      priority: 'High',
      action: 'Add comprehensive README files to your top 5 repositories',
      details: 'Include project description, setup instructions, usage examples, and screenshots. Use badges for tech stack and build status.'
    });
  }

  if (scores.consistency < 60) {
    recommendations.push({
      category: 'Activity',
      priority: 'High',
      action: 'Maintain regular commit activity',
      details: 'Aim for consistent contributions (3-4 times per week). Quality over quantity - small, meaningful commits are better than irregular bulk updates.'
    });
  }

  if (scores.codeQuality < 60) {
    recommendations.push({
      category: 'Code Quality',
      priority: 'Medium',
      action: 'Add topics/tags to your repositories',
      details: 'Use relevant tags to improve discoverability. Add shields/badges for languages, frameworks, and tools used.'
    });
  }

  if (scores.organization < 60) {
    recommendations.push({
      category: 'Organization',
      priority: 'Medium',
      action: 'Pin your best 6 repositories',
      details: 'Choose projects that showcase different skills. Archive or make private incomplete/experimental projects.'
    });
  }

  if (scores.impact < 50) {
    recommendations.push({
      category: 'Impact',
      priority: 'Low',
      action: 'Focus on project quality over quantity',
      details: 'Build 2-3 polished, real-world projects rather than many incomplete ones. Add live demos and deployment links.'
    });
  }

  if (scores.technicalDepth < 60) {
    recommendations.push({
      category: 'Technical Depth',
      priority: 'Medium',
      action: 'Diversify your tech stack',
      details: 'Work with different languages/frameworks. Include full-stack projects showing frontend, backend, and database skills.'
    });
  }

  // Ensure at least 3 recommendations
  if (recommendations.length < 3) {
    recommendations.push({
      category: 'Profile Enhancement',
      priority: 'Low',
      action: 'Complete your GitHub profile',
      details: 'Add a professional bio, location, and links to portfolio/LinkedIn. Consider adding a profile README.'
    });
  }

  return recommendations.slice(0, 6); // Return top 6
}

// Calculate language statistics
function calculateLanguageStats(repos) {
  const languageCounts = {};
  let totalRepos = 0;

  repos.forEach(repo => {
    if (repo.language && !repo.fork) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      totalRepos++;
    }
  });

  // Convert to array and calculate percentages
  const languageArray = Object.entries(languageCounts)
    .map(([language, count]) => ({
      language,
      count,
      percentage: totalRepos > 0 ? Math.round((count / totalRepos) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 languages

  return {
    topLanguages: languageArray,
    totalLanguages: Object.keys(languageCounts).length,
    mostUsed: languageArray.length > 0 ? languageArray[0].language : 'N/A'
  };
}

// Calculate account age in days
function calculateAccountAge(createdAt) {
  const now = new Date();
  const created = new Date(createdAt);
  return Math.floor((now - created) / (1000 * 60 * 60 * 24));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GitHub Analyzer API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
