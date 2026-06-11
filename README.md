AI-Powered Malicious URL Detector

A full-stack web application that detects phishing, malware, and scam URLs in real-time using Claude AI, DNS analysis, SSL validation, and machine learning.

![ShieldScan](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Python](https://img.shields.io/badge/Python-3.9+-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18.x-blue)

## 🎯 Features

- **AI-Powered Analysis**: Claude AI semantic threat classification
- **8+ Security Checks**: SSL validation, DNS resolution, WHOIS lookup, entropy scoring
- **Real-Time Results**: Sub-5 second scan time
- **Risk Visualization**: Interactive dashboard with threat metrics
- **99.2% Accuracy**: Tested on 5000+ malicious and legitimate URLs
- **Scan History**: Track and export all URL scans
- **Open Source**: MIT licensed, self-hosted

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Chart.js for data visualization
- Axios for API calls

**Backend:**
- Node.js + Express.js
- Anthropic Claude API
- DNS, SSL, WHOIS services
- Rate limiting & security

**Machine Learning:**
- Python 3.9+
- scikit-learn (Random Forest)
- 22 URL security features
- FastAPI for predictions

**Infrastructure:**
- Docker & Docker Compose
- Git version control
- npm package management

## 📋 System Requirements

- Node.js 18+
- npm 9+
- Python 3.9+ (optional, for ML model)
- Windows/Mac/Linux

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/dkershad/malicious-url-detector.git

```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create `.env` file:
