# 🛡 ShieldScan — AI-Powered Malicious URL Detector

A full-stack cybersecurity tool that analyzes URLs for phishing, malware, and threat indicators using Claude AI, DNS analysis, SSL checks, WHOIS data, and a machine learning model.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+ (for ML model)
- Anthropic API key

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env .env.local
# Edit .env with your keys:
# ANTHROPIC_API_KEY=your_key_here
```

### 3. Run development (frontend + backend)
```bash
npm run dev:full
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health check**: http://localhost:5000/api/health

---

## 📁 Project Structure

```
malicious-url-detector/
├── public/                   # Static assets
├── src/                      # React frontend
│   ├── api/                  # API client functions
│   ├── components/           # Reusable UI components
│   │   └── charts/           # Chart.js chart components
│   ├── context/              # React context (global state)
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Page components
│   ├── styles/               # Global CSS + animations
│   └── utils/                # Client-side utilities
├── server/                   # Express.js backend
│   ├── controllers/          # Route handler logic
│   ├── middleware/            # Auth, rate limiting, errors
│   ├── routes/               # Express route definitions
│   ├── services/             # DNS, SSL, WHOIS, AI services
│   └── utils/                # Server utilities
├── ml-model/                 # Python ML pipeline
│   ├── feature_engineering.py
│   ├── train_model.py
│   ├── predict.py
│   └── dataset.csv
└── reports/                  # Scan reports & analytics
```

---

## 🔌 API Reference

### POST `/api/scan`
Full deep scan: DNS + SSL + WHOIS + AI analysis.
```json
{ "url": "https://example.com" }
```

### POST `/api/scan/quick`
Fast scan: DNS + SSL only (no AI or WHOIS).

### POST `/api/scan/ai-analyze`
Standalone Claude AI threat analysis.
```json
{ "url": "https://example.com", "metadata": { "ssl": true, "domainAgeDays": 365 } }
```

### GET `/api/whois/:domain`
WHOIS domain registration data.

### GET `/api/scan/ip/:ip`
IP geolocation and reputation info.

### GET `/api/health`
Server health check.

---

## 🤖 ML Model

Train the Random Forest classifier:
```bash
cd ml-model
pip install scikit-learn pandas joblib
python train_model.py
```

Start the ML prediction microservice:
```bash
pip install fastapi uvicorn
python predict.py --server
# → http://localhost:8000/predict
```

---

## 🐳 Docker

```bash
docker-compose up --build
```

---

## 🔬 Features Analyzed

| Feature | Description |
|---|---|
| DNS Resolution | A, MX, NS, TXT records |
| SSL Certificate | Valid, expiry, issuer, self-signed check |
| WHOIS Data | Registrar, creation date, domain age |
| Domain Entropy | Shannon entropy (DGA detection) |
| IP Reputation | Geolocation, hosting provider detection |
| URL Features | Length, special chars, hex encoding, suspicious words |
| AI Analysis | Claude semantic threat classification |
| ML Score | Random Forest probability score |

---

## ⚙️ Environment Variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Claude API key (required for AI analysis) |
| `PORT` | Backend server port (default: 5000) |
| `IPINFO_TOKEN` | ipinfo.io token for IP lookups (optional) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window (default: 100) |
| `API_KEY` | Optional API key for auth protection |

---

## ⚠️ Disclaimer

ShieldScan is for **educational and research purposes only**. Always verify results independently. Not a replacement for enterprise security tooling.
