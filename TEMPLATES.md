# Assignment 2: Configuration Templates (Copy-Paste Ready)

## 1. Backend package.json - Test Script

Add this to your `backend/package.json`:

```json
{
  "name": "todo-backend",
  "version": "1.0.0",
  "description": "Backend API for To-Do List application",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest --ci --coverage --reporters=default --reporters=jest-junit",
    "build": "echo 'Backend build complete'"
  },
  "keywords": ["todo", "api", "express"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.10.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "jest-junit": "^16.0.0",
    "supertest": "^6.3.3",
    "nodemon": "^3.0.1"
  }
}
```

---

## 2. Frontend package.json - Test Script

Add this to your `frontend/package.json`:

```json
{
  "name": "todo-frontend",
  "version": "0.1.0",
  "private": true,
  "proxy": "http://localhost:5000",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --ci --coverage --watchAll=false --reporters=default --reporters=jest-junit",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "jest-junit": "^16.0.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5"
  }
}
```

---

## 3. Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
# Build stage
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

---

## 4. Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
# Build stage
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 5. Docker Compose (Optional - for local testing)

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: todo_user
      POSTGRES_PASSWORD: todo_password
      POSTGRES_DB: todo_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "5001:5001"
    environment:
      DB_HOST: postgres
      DB_USER: todo_user
      DB_PASSWORD: todo_password
      DB_NAME: todo_db
      PORT: 5001
    depends_on:
      - postgres
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## 6. Jenkinsfile (Already Created - Just Verify)

Your `Jenkinsfile` is ready! Just update these lines:

**Line 11:** Replace with your GitHub username
```groovy
GITHUB_URL = 'https://github.com/YOUR_USERNAME/assignment2-node-app.git'
```

**Line 13:** Replace with your Docker Hub username
```groovy
DOCKER_USERNAME = 'YOUR_DOCKERHUB_USERNAME'
```

---

## 7. GitHub SSH Key Setup (Alternative to PAT)

If you prefer SSH instead of HTTPS + PAT:

```bash
# Generate SSH key (if not exists)
ssh-keygen -t ed25519 -C "your-email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Go to GitHub Settings → SSH and GPG keys → New SSH key
# Paste the public key

# Test connection
ssh -T git@github.com
```

In Jenkins:
1. Go to **Credentials** → **System** → **Global credentials**
2. **Add Credentials**
3. **Kind:** SSH Username with private key
4. **Username:** `git`
5. **Private Key:** Paste content of `~/.ssh/id_ed25519`
6. **ID:** `github-ssh`

---

## 8. Sample Backend Test File

If you need a test file, create `backend/__tests__/server.test.js`:

```javascript
const request = require('supertest');
const app = require('../server');

describe('Server API', () => {
  test('Health check endpoint', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Server is running');
  });

  test('Invalid route returns 404', async () => {
    const response = await request(app).get('/invalid-route');
    expect(response.status).toBe(404);
  });
});
```

---

## 9. Sample Frontend Test File

Create `frontend/src/App.test.js`:

```javascript
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('Renders app title', () => {
    render(<App />);
    const titleElement = screen.getByText(/to.do/i);
    expect(titleElement).toBeInTheDocument();
  });
});
```

---

## 10. GitHub Workflow File (Optional - Auto-trigger)

Create `.github/workflows/jenkins-webhook.yml`:

```yaml
name: Notify Jenkins

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  trigger-jenkins:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Jenkins Build
        run: |
          curl -X POST http://localhost:8080/github-webhook/ \
            -H "Content-Type: application/json" \
            -d '{"action": "push"}'
```

---

## 11. Jenkins Credentials Setup Commands

```bash
# View Jenkins secrets directory
ls -la ~/.jenkins/

# Create Jenkins user (if needed)
# Via Jenkins UI: Manage Jenkins → Manage Users → Create User

# Get initial admin password
cat ~/.jenkins/secrets/initialAdminPassword

# Backup Jenkins config
tar -czf jenkins-backup.tar.gz ~/.jenkins/

# Restore from backup
tar -xzf jenkins-backup.tar.gz -C ~/

# Docker Hub Login (for local testing)
docker login -u nidup21
# When prompted, enter your Docker Hub access token (from Phase 11)
```

---

## 12. Environment Variables for Jenkinsfile

Add to Jenkins system environment or use in pipeline:

```groovy
environment {
    // GitHub
    GITHUB_OWNER = 'YOUR_USERNAME'
    GITHUB_REPO = 'assignment2-node-app'
    GITHUB_BRANCH = 'main'
    
    // Docker Hub
    DOCKER_HUB_OWNER = 'YOUR_DOCKERHUB_USERNAME'
    DOCKER_REGISTRY = 'docker.io'
    DOCKER_IMAGE_BACKEND = "${env.DOCKER_HUB_OWNER}/assignment2-backend"
    DOCKER_IMAGE_FRONTEND = "${env.DOCKER_HUB_OWNER}/assignment2-frontend"
    
    // Database
    DB_HOST = 'localhost'
    DB_USER = 'todo_user'
    DB_PASSWORD = 'todo_password'
    DB_NAME = 'todo_db'
    DB_PORT = '5432'
    
    // Application Ports
    BACKEND_PORT = '5001'
    FRONTEND_PORT = '3000'
    
    // Build Info
    BUILD_TIMESTAMP = sh(script: 'date +%Y%m%d_%H%M%S', returnStdout: true).trim()
}
```

---

## 13. Webhook Configuration

**GitHub to Jenkins Webhook:**

1. GitHub: Settings → Webhooks → Add webhook
2. **Payload URL:** `http://your-jenkins-domain:8080/github-webhook/`
3. **Content type:** `application/json`
4. **Trigger:** Push events
5. **Active:** ✅

---

## 14. Jenkins Security Configuration

```groovy
// Add to Jenkinsfile for security scanning
stage('Security Scan') {
    steps {
        echo 'Running npm audit...'
        dir('backend') {
            sh 'npm audit --audit-level=moderate'
        }
        dir('frontend') {
            sh 'npm audit --audit-level=moderate'
        }
    }
}
```

---

## 15. Build Parameters (Advanced)

Add to Jenkins pipeline for user input:

```groovy
properties([
    parameters([
        choice(
            name: 'ENVIRONMENT',
            choices: ['development', 'staging', 'production'],
            description: 'Deployment environment'
        ),
        booleanParam(
            name: 'SKIP_TESTS',
            defaultValue: false,
            description: 'Skip test execution'
        ),
        string(
            name: 'IMAGE_TAG',
            defaultValue: 'latest',
            description: 'Docker image tag'
        )
    ])
])
```

---

## Quick Copy-Paste Sections

### For backend/package.json (test script only):
```json
"test": "jest --ci --coverage --reporters=default --reporters=jest-junit"
```

### For frontend/package.json (test script only):
```json
"test": "react-scripts test --ci --coverage --watchAll=false --reporters=default --reporters=jest-junit"
```

### Jenkins Credentials ID References:
```
github-credentials          → GitHub PAT
docker-hub-credentials      → Docker Hub credentials (nidup21)
github-ssh                  → GitHub SSH key
```

### Your Docker Hub Configuration:
```
Docker Hub Username:        nidup21
Backend Image:              nidup21/assignment2-backend:latest
Frontend Image:             nidup21/assignment2-frontend:latest
Docker Hub Repos:           
  - https://hub.docker.com/r/nidup21/assignment2-backend
  - https://hub.docker.com/r/nidup21/assignment2-frontend
```

### Common Jenkins URLs:
```
Dashboard:        http://localhost:8080/
Jobs:            http://localhost:8080/view/all/
Manage Jenkins:  http://localhost:8080/manage/
Credentials:     http://localhost:8080/credentials/
Plugins:         http://localhost:8080/pluginManager/
System Log:      http://localhost:8080/log/all
```

---

**IMPORTANT:** Replace all instances of:
- `YOUR_USERNAME` → Your GitHub username
- `nidup21` → YOUR username (already configured as nidup21)
- `your-email@example.com` → Your actual email
- `localhost` → Your actual Jenkins URL (if not local)
