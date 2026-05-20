# Assignment 2: CI/CD Pipeline Setup - Detailed Step-by-Step Guide

## Overview
This guide will walk you through setting up a Jenkins CI/CD pipeline for your Node.js To-Do application, including automated testing, building, and deployment.

---

## PHASE 1: Prepare Your Application

### Step 1.1: Verify package.json Has Proper Scripts

Your `package.json` needs these scripts for testing and building:

**For Backend (backend/package.json):**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest --ci --coverage --reporters=default --reporters=jest-junit",
    "build": "echo 'Backend build complete'"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "jest-junit": "^16.0.0",
    "jest-config": "^29.7.0"
  }
}
```

**For Frontend (frontend/package.json):**
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --ci --coverage --watchAll=false --reporters=default --reporters=jest-junit",
    "eject": "react-scripts eject"
  },
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "jest-junit": "^16.0.0"
  }
}
```

**✅ Action Items:**
- [ ] Update backend/package.json with proper scripts
- [ ] Update frontend/package.json with proper scripts
- [ ] Run `npm test` locally in both directories to ensure tests work

---

## PHASE 2: GitHub Repository Setup

### Step 2.1: Push Code to GitHub

If not already done:

```bash
# Initialize git (if needed)
cd /Users/m3/Desktop/Assignment2_DSO101
git init

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/assignment2-node-app.git

# Create initial commit
git add .
git commit -m "Initial commit: Node.js To-Do app with Docker setup"

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2.2: Generate GitHub Personal Access Token (PAT)

1. Go to **GitHub.com** → Click your **Profile** (top-right corner)
2. Click **Settings**
3. Scroll down → Click **Developer settings** (left sidebar)
4. Click **Personal access tokens** → **Tokens (classic)**
5. Click **Generate new token** → **Generate new token (classic)**
6. **Token name:** `jenkins-ci-token`
7. **Expiration:** 90 days
8. **Select scopes:**
   - ☑️ `repo` (Full control of private repositories)
   - ☑️ `admin:repo_hook` (Full control of hooks)
9. Click **Generate token**
10. **⚠️ Copy and save the token** (you won't see it again!)

**✅ Action Items:**
- [ ] Repository pushed to GitHub
- [ ] GitHub PAT generated and saved

---

## PHASE 3: Jenkins Installation & Setup

### Step 3.1: Install Jenkins (macOS)

```bash
# Option 1: Using Homebrew
brew install jenkins-lts

# Option 2: Manual Download
# Download from: https://www.jenkins.io/download/
# Download LTS version
```

### Step 3.2: Start Jenkins

```bash
# If installed via Homebrew
brew services start jenkins-lts

# Or manually
java -jar jenkins.war --httpPort=8080
```

**Expected output:**
```
Jenkins is fully up and running
[Jenkins URL] http://localhost:8080/
```

### Step 3.3: Access Jenkins Initial Setup

1. Open browser → **http://localhost:8080**
2. You'll see "Unlock Jenkins" page
3. Get the admin password:
   ```bash
   cat ~/.jenkins/secrets/initialAdminPassword
   ```
4. Paste the password in Jenkins
5. Click **Continue**
6. Click **Install suggested plugins** (wait 5-10 minutes)
7. **Create First Admin User:**
   - Username: `admin`
   - Password: `your-secure-password`
   - Full name: `Admin User`
   - Email: `your-email@example.com`
8. Click **Save and Continue**
9. Click **Save and Finish**

**✅ Action Items:**
- [ ] Jenkins installed and running on localhost:8080
- [ ] Admin user created
- [ ] Suggested plugins installed

---

## PHASE 4: Install Required Jenkins Plugins

### Step 4.1: Install Plugins

1. From Jenkins Dashboard → **Manage Jenkins** (left sidebar)
2. Click **Manage Plugins**
3. Go to **Available plugins** tab
4. Search and install these plugins:
   - [ ] **NodeJS Plugin** (nodejs)
   - [ ] **Pipeline** (workflow-aggregator)
   - [ ] **GitHub Integration** (github)
   - [ ] **JUnit Plugin** (junit) - usually pre-installed
   - [ ] **Docker Pipeline** (docker-workflow) - Optional, for Docker deployment

5. For each plugin:
   - Type name in search box
   - Check the checkbox
   - Click **Install without restart**

6. After all installed → **Restart Jenkins**
   ```bash
   # Navigate to http://localhost:8080/restart
   # Or restart from terminal:
   brew services restart jenkins-lts
   ```

**✅ Action Items:**
- [ ] All required plugins installed
- [ ] Jenkins restarted

---

## PHASE 5: Configure Node.js in Jenkins

### Step 5.1: Add Node.js Installation

1. Go to **Manage Jenkins** → **Tools**
2. Scroll down to **NodeJS installations**
3. Click **Add NodeJS**
4. **Name:** `NodeJS`
5. **Version:** Select `20.x LTS` (or latest LTS)
6. Leave other options as default
7. Click **Save**

**✅ Action Items:**
- [ ] Node.js configured in Jenkins

---

## PHASE 6: Add GitHub Credentials to Jenkins

### Step 6.1: Store GitHub PAT

1. Go to **Manage Jenkins** → **Credentials**
2. Click **System** (under "Stores scoped to Jenkins")
3. Click **Global credentials (unrestricted)**
4. Click **+ Add Credentials** (top-left)
5. **Kind:** Select `Username with password`
6. **Scope:** `Global`
7. **Username:** Your GitHub username
8. **Password:** Paste your GitHub PAT (from Phase 2)
9. **ID:** `github-credentials`
10. **Description:** `GitHub Personal Access Token`
11. Click **Create**

**✅ Action Items:**
- [ ] GitHub credentials added to Jenkins

---

## PHASE 7: Create Jenkinsfile

### Step 7.1: Create Jenkinsfile in Project Root

Create file: `/Users/m3/Desktop/Assignment2_DSO101/Jenkinsfile`

```groovy
pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '====== STAGE: Code Checkout ======'
                git branch: 'main',
                    credentialsId: 'github-credentials',
                    url: 'https://github.com/YOUR_USERNAME/assignment2-node-app.git'
            }
        }
        
        stage('Backend Install') {
            steps {
                echo '====== STAGE: Backend Dependencies ======'
                dir('backend') {
                    sh 'npm install'
                }
            }
        }
        
        stage('Backend Test') {
            steps {
                echo '====== STAGE: Backend Unit Tests ======'
                dir('backend') {
                    sh 'npm test'
                }
            }
            post {
                always {
                    junit 'backend/junit.xml'
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'backend/coverage',
                        reportFiles: 'index.html',
                        reportName: 'Backend Coverage Report'
                    ])
                }
            }
        }
        
        stage('Frontend Install') {
            steps {
                echo '====== STAGE: Frontend Dependencies ======'
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }
        
        stage('Frontend Build') {
            steps {
                echo '====== STAGE: Frontend Build ======'
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }
        
        stage('Frontend Test') {
            steps {
                echo '====== STAGE: Frontend Unit Tests ======'
                dir('frontend') {
                    sh 'npm test'
                }
            }
            post {
                always {
                    junit 'frontend/junit.xml'
                }
            }
        }
        
        stage('Build Backend Docker Image') {
            steps {
                echo '====== STAGE: Build Backend Docker Image ======'
                dir('backend') {
                    script {
                        docker.build('assignment2-backend:latest')
                    }
                }
            }
        }
        
        stage('Build Frontend Docker Image') {
            steps {
                echo '====== STAGE: Build Frontend Docker Image ======'
                dir('frontend') {
                    script {
                        docker.build('assignment2-frontend:latest')
                    }
                }
            }
        }
        
        stage('Success Summary') {
            steps {
                echo '====== ✅ Pipeline Completed Successfully ======'
                echo 'Backend and Frontend built and tested'
                echo 'Docker images ready for deployment'
            }
        }
    }
    
    post {
        always {
            echo '====== Pipeline Execution Summary ======'
        }
        success {
            echo '✅ Build succeeded!'
        }
        failure {
            echo '❌ Build failed!'
        }
    }
}
```

### Step 7.2: Add Backend jest.config.js

Create: `/Users/m3/Desktop/Assignment2_DSO101/backend/jest.config.js`

```javascript
module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: ['*.js', '!jest.config.js', '!__tests__/**'],
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: '.',
      outputName: 'junit.xml',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › ',
      usePathAsClassName: 'true'
    }]
  ]
};
```

**✅ Action Items:**
- [ ] Jenkinsfile created in project root
- [ ] jest.config.js created in backend directory

---

## PHASE 8: Create Jenkins Pipeline Job

### Step 8.1: Create New Pipeline Job

1. From Jenkins Dashboard → **+ New Item** (top-left)
2. **Item name:** `assignment2-todo-pipeline`
3. **Type:** Select `Pipeline`
4. Click **OK**

### Step 8.2: Configure Pipeline

**General Tab:**
- ☑️ Check: **GitHub project**
- **Project url:** `https://github.com/YOUR_USERNAME/assignment2-node-app/`

**Build Triggers Tab:**
- ☑️ Check: **GitHub hook trigger for GITScm polling**

**Pipeline Tab:**
1. **Definition:** Select `Pipeline script from SCM`
2. **SCM:** Select `Git`
3. **Repository URL:** `https://github.com/YOUR_USERNAME/assignment2-node-app.git`
4. **Credentials:** Select `github-credentials` (from Phase 6)
5. **Branch Specifier:** `*/main`
6. **Script Path:** `Jenkinsfile`
7. Click **Save**

**✅ Action Items:**
- [ ] Pipeline job created
- [ ] All configurations applied
- [ ] Job saved

---

## PHASE 9: Run the Pipeline

### Step 9.1: Trigger Build Manually

1. From Jenkins Dashboard → Click **assignment2-todo-pipeline**
2. Click **Build Now** (left sidebar)
3. Wait for build to complete (5-10 minutes first run)

### Step 9.2: Monitor Build Progress

1. Click on the **build number** (e.g., `#1`)
2. Click **Console Output** to see real-time logs
3. Wait for all stages to complete

### Step 9.3: Check Results

- **Build Success:** Green checkmark ✅
- **View Test Results:** Click **Test Results** (if available)
- **View Logs:** Click **Console Output**

---

## PHASE 10: Verify Test Reports

### Step 10.1: Configure HTML Publisher (Optional)

For better test visualization:

1. Go back to job configuration
2. Scroll to **Post-build Actions**
3. Click **Add post-build action** → **Publish HTML reports**
4. **HTML directory to archive:** `backend/coverage`
5. **Index page:** `index.html`
6. **Report title:** `Coverage Report`
7. Click **Save**

---

## PHASE 11: Docker Hub Setup (Optional but Recommended)

### Step 11.1: Create Docker Hub Account

1. Go to **hub.docker.com**
2. Sign up if you don't have account
3. Login

### Step 11.2: Add Docker Credentials to Jenkins

1. Go to **Manage Jenkins** → **Credentials**
2. Click **System** → **Global credentials**
3. Click **+ Add Credentials**
4. **Kind:** `Username with password`
5. **Username:** Your Docker Hub username
6. **Password:** Your Docker Hub password (or access token)
7. **ID:** `docker-hub-credentials`
8. Click **Create**

### Step 11.3: Update Jenkinsfile for Docker Push

Add this stage to your Jenkinsfile:

```groovy
stage('Push to Docker Hub') {
    when {
        branch 'main'
    }
    steps {
        echo '====== STAGE: Push Docker Images ======'
        script {
            docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                docker.image('assignment2-backend:latest').push('latest')
                docker.image('assignment2-frontend:latest').push('latest')
            }
        }
    }
}
```

---

## PHASE 12: Documentation & Screenshots

### Step 12.1: Take Screenshots

Capture screenshots of:

1. ✅ Jenkins Dashboard showing successful pipeline
2. ✅ Build #1 Console Output (full logs)
3. ✅ Test Results page
4. ✅ Coverage Report
5. ✅ Docker images in Docker Hub (if used)
6. ✅ GitHub repository with Jenkinsfile

### Step 12.2: Create README.md Report

Create file: `/Users/m3/Desktop/Assignment2_DSO101/README.md`

```markdown
# Assignment 2: CI/CD Pipeline - To-Do Application

## Project Overview
This project implements a complete Jenkins CI/CD pipeline for a Node.js To-Do application with separate frontend (React) and backend (Express) services.

## Pipeline Configuration

### Technologies Used
- **Jenkins:** CI/CD Orchestration
- **GitHub:** Version Control & Webhooks
- **Node.js:** Runtime environment
- **Jest:** Testing framework
- **Docker:** Containerization
- **npm:** Package management

### Pipeline Stages

1. **Checkout** - Clones code from GitHub
2. **Backend Install** - Installs backend dependencies
3. **Backend Test** - Runs Jest tests for backend
4. **Frontend Install** - Installs frontend dependencies
5. **Frontend Build** - Builds optimized React bundle
6. **Frontend Test** - Runs Jest tests for frontend
7. **Docker Build** - Creates Docker images for both services
8. **Docker Push** - Pushes images to Docker Hub

### Jenkins Configuration
- **Jenkins URL:** http://localhost:8080
- **Job Name:** assignment2-todo-pipeline
- **Plugins Installed:** NodeJS, Pipeline, GitHub Integration, Docker Pipeline
- **Credentials:** GitHub PAT, Docker Hub credentials

### How to Run Pipeline
1. Navigate to Jenkins Dashboard
2. Click "assignment2-todo-pipeline"
3. Click "Build Now"
4. Monitor progress in Console Output

### Build Status
- **Last Build:** [PASS/FAIL]
- **Build Number:** #1
- **Duration:** 5-10 minutes
- **Test Results:** See Test Results section

### Challenges Faced
1. ✅ Node.js version compatibility - Resolved by using NodeJS plugin
2. ✅ Jest JUnit reporter configuration - Fixed by adding jest-junit package
3. ✅ Docker image tagging - Used consistent naming convention
4. ✅ GitHub webhook authentication - Resolved using Personal Access Token

### Files Modified
- `backend/package.json` - Added test & build scripts
- `frontend/package.json` - Added test & build scripts
- `backend/jest.config.js` - Added Jest configuration
- `Jenkinsfile` - Created pipeline definition

### Screenshots
[Include screenshots of successful pipeline runs]

### Links
- **GitHub Repository:** https://github.com/YOUR_USERNAME/assignment2-node-app
- **Jenkins Pipeline:** http://localhost:8080/job/assignment2-todo-pipeline
- **Docker Hub:** https://hub.docker.com/r/YOUR_USERNAME/assignment2-backend

### Author
[Your Name]

### Date
[Date of Completion]
```

---

## PHASE 13: Troubleshooting Guide

| Problem | Solution |
|---------|----------|
| "No agent connected" | Click **Manage Jenkins** → **Manage Nodes** → Ensure built-in node is online |
| "npm command not found" | Ensure NodeJS plugin is installed and version is selected in job |
| "Test files not found" | Run `npm test` locally to verify test scripts work |
| "Git clone failed" | Verify GitHub credentials and repository URL |
| "Docker not found" | Install Docker or skip Docker stages |
| "Build timeout" | Increase Jenkins build timeout in job configuration |

---

## Summary Checklist

- [ ] Code pushed to GitHub
- [ ] GitHub PAT generated
- [ ] Jenkins installed & running
- [ ] Required plugins installed
- [ ] Node.js configured in Jenkins
- [ ] GitHub credentials added
- [ ] Jenkinsfile created in project root
- [ ] Jest configured for both backend & frontend
- [ ] Pipeline job created in Jenkins
- [ ] First build executed successfully
- [ ] Test results visible in Jenkins
- [ ] Screenshots captured
- [ ] README.md completed
- [ ] Ready for submission

---

## Next Steps (Optional Enhancements)

1. **Webhook Integration:** Configure GitHub to auto-trigger builds on push
2. **Slack Notifications:** Add Slack plugin for build status notifications
3. **Code Quality:** Integrate SonarQube for code analysis
4. **Deployment:** Add deployment stage to production server
5. **Performance Testing:** Add load testing stage
