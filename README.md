# 🚀 GitHub Portfolio Analyzer & Enhancer

<div align="center">

![GitHub Portfolio Analyzer](https://img.shields.io/badge/Status-Live-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

**Transform Your GitHub Profile into Recruiter-Ready Proof**

[Live Demo](https://github-analyzer-liart.vercel.app/) • [Watch Demo Video](#-demo-video) • [Report Bug](#-support)

</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Demo Video](#-demo-video)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Scoring Methodology](#-scoring-methodology)
- [Contact](#-contact)

---

## 🎯 About The Project

**GitHub Portfolio Analyzer** evaluates GitHub profiles using weighted scoring algorithms across 6 key dimensions, helping developers understand how recruiters view their work.

### The Problem
Most developer profiles fail to effectively communicate real skill, consistency, and professional impact to recruiters.

### The Solution
- **Evaluates** profiles across 6 critical dimensions
- **Identifies** strengths, weaknesses, and red flags
- **Provides** prioritized, actionable recommendations
- **Visualizes** programming language statistics
- **Delivers** results in under 2 minutes

---

## 📹 Demo Video

### 🎬 Watch the Full Walkthrough

**[▶️ Click here to watch the demo video](YOUR_VIDEO_LINK_HERE)**

**Video Sections:**
- 0:00-0:30 - Introduction & Problem Statement
- 0:30-3:00 - Live Demo & Feature Walkthrough
- 3:00-4:00 - Technical Architecture
- 4:00-4:30 - Usage Guide

---

## ✨ Features

### **Core Functionality**

🔍 **Instant Profile Analysis** - Analyze any public GitHub profile in under 2 minutes

📊 **6-Dimensional Scoring System:**
1. 📚 Documentation Quality (20%)
2. 💻 Code Quality (20%)
3. 📈 Activity Consistency (15%)
4. 🗂️ Repository Organization (15%)
5. 🌟 Project Impact (15%)
6. 🔧 Technical Depth (15%)

💻 **Programming Language Statistics**
- Top 5 languages with percentages
- Visual progress bars
- Repository counts per language

🎯 **Intelligent Insights**
- Strengths identification
- Weakness detection
- Red flag warnings

📝 **Actionable Recommendations**
- 3-6 specific suggestions
- Priority levels (High/Medium/Low)
- Implementation guidance

---

## 🛠️ Tech Stack

### **Frontend**

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI Framework |
| **JavaScript** | ES6+ | Programming Language |
| **CSS3** | 3 | Styling & Animations |
| **Axios** | 1.6.0 | HTTP Client |

### **Backend**

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 16+ | Runtime Environment |
| **Express.js** | 4.18.2 | Web Framework |
| **Axios** | 1.6.0 | HTTP Client |
| **CORS** | 2.8.5 | Cross-Origin Sharing |

### **External APIs**

| API | Purpose |
|-----|---------|
| **GitHub REST API v3** | User data, repositories, events |

### **Deployment**

| Platform | Service |
|----------|---------|
| **Vercel** | Frontend Hosting |
| **Render** | Backend Hosting |

---

## 📁 Project Structure

```
github-analyzer/
│
├── 📂 backend/                          # Node.js/Express Backend
│   ├── 📄 server.js                     # Main server file (510 lines)
│   │   ├── analyzeProfile()            # Main orchestrator
│   │   ├── calculateDocumentationScore()
│   │   ├── calculateCodeQualityScore()
│   │   ├── calculateConsistencyScore()
│   │   ├── calculateOrganizationScore()
│   │   ├── calculateImpactScore()
│   │   ├── calculateTechnicalDepthScore()
│   │   ├── calculateLanguageStats()    # Language analysis
│   │   ├── generateInsights()          # Strengths/weaknesses
│   │   └── generateRecommendations()   # Action items
│   │
│   ├── 📄 package.json                  # Dependencies
│   └── 📄 .env.example                  # Environment template
│
├── 📂 frontend/                         # React Frontend
│   ├── 📂 public/
│   │   └── 📄 index.html               # HTML template
│   │
│   ├── 📂 src/
│   │   ├── 📄 App.js                   # Main component (295 lines)
│   │   │   ├── Profile input form
│   │   │   ├── Loading state
│   │   │   ├── Overall score display
│   │   │   ├── Stats grid
│   │   │   ├── Language statistics
│   │   │   ├── Score breakdown
│   │   │   ├── Insights section
│   │   │   └── Recommendations
│   │   │
│   │   ├── 📄 App.css                  # Styles (650+ lines)
│   │   │   ├── Dark gradient background
│   │   │   ├── Responsive layouts
│   │   │   ├── Animations
│   │   │   └── Color-coded scoring
│   │   │
│   │   ├── 📄 index.js                 # React entry point
│   │   └── 📄 index.css                # Global styles
│   │
│   ├── 📄 package.json                  # Dependencies
│   └── 📄 vercel.json                   # Vercel config
│
├── 📄 README.md                         # Documentation
├── 📄 QUICKSTART.md                     # Setup guide
├── 📄 CHECKLIST.md                      # Submission checklist
├── 📄 VIDEO-GUIDE.md                    # Video recording guide
├── 📄 .gitignore                        # Git ignore rules
├── 📄 render.yaml                       # Render config
└── 📄 setup.sh                          # Automated setup
```

---

## 🚀 Getting Started

### **Prerequisites**

```bash
# Check Node.js version (should be 16+)
node --version

# Check npm version
npm --version
```

**Required:**
- Node.js 16.x or higher
- npm 8.x or higher
- Modern web browser

---

## 📥 Installation

### **Method 1: Quick Setup (Linux/Mac)**

```bash
# Clone repository
git clone https://github.com/Akshay1267/github-analyzer.git
cd github-analyzer

# Run setup script
chmod +x setup.sh
./setup.sh

# Start backend (Terminal 1)
cd backend
npm start

# Start frontend (Terminal 2)
cd frontend
npm start
```

### **Method 2: Manual Setup (All Platforms)**

#### **Step 1: Clone Repository**
```bash
git clone https://github.com/Akshay1267/github-analyzer.git
cd github-analyzer
```

#### **Step 2: Backend Setup**
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# (Optional) Create environment file
cp .env.example .env
# Add GitHub token: GITHUB_TOKEN=your_token_here

# Start server
npm start
```

**Expected Output:**
```
Server running on port 5000
```

#### **Step 3: Frontend Setup**
```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Expected Output:**
```
Compiled successfully!
Local: http://localhost:3000
```

#### **Step 4: Open Browser**
```
http://localhost:3000
```

---

## 💡 Usage

### **Basic Usage**

1. **Open Application**
   ```
   http://localhost:3000 (local)
   https://github-analyzer-liart.vercel.app/ (production)
   ```

2. **Enter GitHub Username**
   - Type username: `octocat`, `torvalds`, `gaearon`
   - Or paste full GitHub URL

3. **Click "Analyze Profile"**
   - Wait 5-10 seconds
   - Loading spinner shows processing

4. **Review Results**
   - Overall score (0-100)
   - 6-dimension breakdown
   - Language statistics
   - Insights & recommendations

### **Example Profiles**

```bash
# Try these profiles:
octocat      # Beginner
torvalds     # Experienced
gaearon      # Open source maintainer
```

### **Score Interpretation**

| Score | Rating | Status |
|-------|--------|--------|
| 80-100 | 🌟 Excellent | Recruiter-ready |
| 70-79 | 👍 Good | Minor improvements needed |
| 50-69 | ⚠️ Fair | Needs attention |
| 0-49 | 🚨 Needs Work | Significant improvements needed |

---

## 📡 API Documentation

### **Base URLs**

```bash
# Development
http://localhost:5000/api

# Production
https://github-analyzer-97ye.onrender.com
```

### **Endpoints**

#### **1. Analyze Profile**

**Endpoint:** `POST /api/analyze`

**Request:**
```bash
curl -X POST https://github-analyzer-4ms0.onrender.com/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"githubUrl": "octocat"}'
```

**Request Body:**
```json
{
  "githubUrl": "octocat"
}
```

**Response (200 OK):**
```json
{
  "username": "octocat",
  "profileUrl": "https://github.com/octocat",
  "avatarUrl": "https://avatars.githubusercontent.com/u/583231",
  "overallScore": 78,
  "scores": {
    "documentation": 85,
    "codeQuality": 72,
    "consistency": 68,
    "organization": 80,
    "impact": 75,
    "technicalDepth": 82
  },
  "languageStats": {
    "topLanguages": [
      {"language": "JavaScript", "count": 15, "percentage": 45},
      {"language": "Python", "count": 10, "percentage": 30}
    ],
    "totalLanguages": 5,
    "mostUsed": "JavaScript"
  },
  "insights": {
    "strengths": ["Strong documentation practices"],
    "weaknesses": ["Irregular activity"],
    "redFlags": []
  },
  "recommendations": [
    {
      "category": "Documentation",
      "priority": "High",
      "action": "Add README files",
      "details": "Include setup instructions..."
    }
  ],
  "stats": {
    "totalRepos": 25,
    "followers": 150,
    "following": 50,
    "accountAge": 3650
  }
}
```

**Error Responses:**
```json
// 400 Bad Request
{"error": "Invalid GitHub URL"}

// 404 Not Found
{"error": "GitHub user not found"}

// 500 Internal Server Error
{"error": "Failed to analyze profile", "details": "..."}
```

#### **2. Health Check**

**Endpoint:** `GET /api/health`

**Request:**
```bash
curl https://github-analyzer-4ms0.onrender.com/api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "GitHub Analyzer API is running"
}
```

---

## 🌐 Deployment

### **Frontend Deployment (Vercel)**

#### **Using Vercel CLI:**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Create production environment
echo "REACT_APP_API_URL=https://your-backend.onrender.com" > .env.production

# Deploy
vercel --prod
```

#### **Using Vercel Dashboard:**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Select `frontend` as root directory

3. **Add Environment Variable**
   - `REACT_APP_API_URL` = `https://your-backend.onrender.com`

4. **Deploy**

### **Backend Deployment (Render)**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Backend deployment ready"
   git push origin main
   ```

2. **Create Render Service**
   - Visit [render.com](https://render.com)
   - New Web Service
   - Connect GitHub repo

3. **Configure**
   ```
   Name: github-analyzer-api
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variable** (Optional)
   ```
   GITHUB_TOKEN=your_token
   ```

5. **Deploy & Copy URL**

6. **Update Frontend**
   - Update Vercel environment variable
   - Redeploy frontend

---

## 📊 Scoring Methodology

### **Algorithm Overview**

```
Overall Score = Σ(Dimension Score × Weight)
```

### **Dimension Weights**

| Dimension | Weight | Formula |
|-----------|--------|---------|
| **Documentation** | 20% | `(README_ratio × 0.6 + desc_ratio × 0.4) × 100` |
| **Code Quality** | 20% | `stars_score + forks_score + topics_score` |
| **Consistency** | 15% | `activity_30days + activity_90days + bonus` |
| **Organization** | 15% | `topics_score + structure_score + active_ratio` |
| **Impact** | 15% | `stars + forks + followers + watchers` |
| **Technical Depth** | 15% | `language_diversity + complexity + count` |

### **Language Statistics**

```javascript
// Top 5 languages by repository count
topLanguages = languages
  .sort((a, b) => b.count - a.count)
  .slice(0, 5)
  .map(lang => ({
    language: lang.name,
    count: lang.repos,
    percentage: (lang.repos / totalRepos) × 100
  }))
```

### **Insight Rules**

**Strengths** (score ≥ 70):
- Strong documentation
- Consistent activity
- Community impact

**Weaknesses** (score < 50):
- Lack of documentation
- Irregular activity
- Poor organization

**Red Flags**:
- < 3 repositories
- > 70% forked repos
- Long inactivity

---

## 👤 Contact

**Akshay Jain**

- 📧 Email: akshay.jain9568@gmail.com
- 💼 LinkedIn: [Your Profile](https://www.linkedin.com/in/akshay-jain-8816252a5/)
- 🐙 GitHub: [@yourhandle](https://github.com/Akshay1267)

**Project:**
- 🔗 Live: [https://github-analyzer-liart.vercel.app/](https://github-analyzer-liart.vercel.app/)
- 📦 Repo: [https://github.com/YOUR_USERNAME/github-analyzer](https://github.com/Akshay1267/github-analyzer.git)

---

## 💬 Support

### **Common Issues**

**CORS Error:**
```bash
# Check backend CORS configuration
# Ensure your frontend URL is in corsOptions
```

**API Not Responding:**
```bash
# Verify backend health
curl https://your-backend.com/api/health
```

**Rate Limit:**
```bash
# Add GitHub token to backend/.env
GITHUB_TOKEN=your_token
```

## 🙏 Acknowledgments

- **[UnsaidTalks Education](https://unsaidtalks.com)** - Hackathon organizer
- **[GitHub](https://github.com)** - API provider
- **[Vercel](https://vercel.com)** - Frontend hosting
- **[Render](https://render.com)** - Backend hosting

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Made with ❤️ for the Developer Community**

Built for **UnsaidTalks GitHub Portfolio Analyzer Hackathon 2026**

[⬆ Back to Top](#-github-portfolio-analyzer--enhancer)

</div>
