


# ResearchDB Platform

A platform for exploring and analyzing research data from Indian academic institutions.

![Login](Login.png)

![Dashboard](Dashboard.png)

![Researchers](Researchers.png)


---

## Overview
The ResearchDB platform provides visualization and analysis tools to understand:
- Researcher contributions
- Institutional standings
- Research field distributions across India's academic landscape

---

## Features

### Dashboard
- **Total Metrics**: Researchers, institutions, and country-level data.
- **Top Institutions**: Visualization of top institutions by researcher count.
- **Leading Researchers**: Ranked by citation metrics.
- **Distribution Charts**: Institution-wise analysis.

### Researcher Search
- **Filters**: Search researchers by field and institution.
- **Detailed Profiles**:
  - H-index metrics
  - Citation counts
  - Field rankings
  - Institutional affiliations

### Data Coverage
- **Researchers**: 2,939
- **Institutions**: 882
- **Metrics**: Citation data, field classifications, and institutional rankings.

---

## Setup Instructions

### Prerequisites
- **Node.js** (with npm)
- **MongoDB** (local installation)

### Installation Steps
1. Clone the repository:
 ```
   git clone https://github.com/Yash-Shindey/researcher-platform.git
   cd researcher-platform
   npm install
```
2.	Start the MongoDB server locally.
```
brew tap mongodb/brew
```

```
brew services start mongodb/brew/mongodb-community
```
4.	Set up and start the server:

```
 cd researcher-platform/apps/server
 npm install
 npm run import-data   # Import researcher data into MongoDB
 npm run dev           # Start the server
```

4.	In a new terminal, set up and start the client:
```
cd researcher-platform/apps/client
npm install
npm run dev
```

5.	Access the application in your browser at:
http://localhost:5173

## Tech Stack

	•	Frontend: React with TypeScript
	•	Backend: Node.js, Express
	•	Database: MongoDB
	•	State Management: Zustand
	•	Visualization: Recharts

## Project Structure
```
researcher-platform/ 
├── apps/
│   ├── client/         # React frontend
│   └── server/         # Node.js backend
└── packages/           # Shared packages
```

## Version

v1.0 - Initial Release

