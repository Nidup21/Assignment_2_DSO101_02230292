# Assignment 2: Quick Start Checklist

## ✅ QUICK REFERENCE - COMPLETE THIS IN ORDER

### PHASE 1: Verify Your Code (5 minutes)
- [ ] Test backend locally: `cd backend && npm test`
- [ ] Test frontend locally: `cd frontend && npm test`
- [ ] Both should pass and generate junit.xml

### PHASE 2: GitHub Setup (10 minutes)
- [ ] Push code to GitHub: `git push origin main`
- [ ] Go to GitHub Settings → Developer settings → Personal Access Tokens
- [ ] Create PAT with `repo` and `admin:repo_hook` permissions
- [ ] Copy and save the token (you won't see it again!)

### PHASE 3: Jenkins Installation (15 minutes)
```bash
# Install Jenkins
brew install jenkins-lts

# Start Jenkins
brew services start jenkins-lts

# Access http://localhost:8080
```

### PHASE 4: Jenkins Initial Setup (10 minutes)
- [ ] Unlock Jenkins with the initial admin password:
  ```bash
  cat ~/.jenkins/secrets/initialAdminPassword
  ```
- [ ] Install suggested plugins
- [ ] Create admin user
- [ ] Access Jenkins Dashboard

### PHASE 5: Install Jenkins Plugins (15 minutes)
Manage Jenkins → Manage Plugins → Available
- [ ] NodeJS Plugin
- [ ] Pipeline
- [ ] GitHub Integration
- [ ] Docker Pipeline (optional)
- [ ] Restart Jenkins

### PHASE 6: Configure Node.js in Jenkins (5 minutes)
- [ ] Manage Jenkins → Tools → NodeJS installations
- [ ] Add NodeJS with version 20.x LTS

### PHASE 7: Add GitHub Credentials (5 minutes)
- [ ] Manage Jenkins → Credentials → System → Global credentials
- [ ] Add Credentials → Username with password
- [ ] Username: Your GitHub username
- [ ] Password: Your GitHub PAT
- [ ] ID: `github-credentials`

### PHASE 8: Create Pipeline Job (10 minutes)
- [ ] New Item → Pipeline → Name: `assignment2-todo-pipeline`
- [ ] Configure:
  - [ ] GitHub project: `https://github.com/YOUR_USERNAME/assignment2-node-app/`
  - [ ] Build Triggers: Check "GitHub hook trigger"
  - [ ] Pipeline Definition: "Pipeline script from SCM"
  - [ ] SCM: Git
  - [ ] Repository URL: `https://github.com/YOUR_USERNAME/assignment2-node-app.git`
  - [ ] Credentials: Select `github-credentials`
  - [ ] Branch: `*/main`
  - [ ] Script Path: `Jenkinsfile`

### PHASE 9: Run the Pipeline (10 minutes)
- [ ] Click "Build Now"
- [ ] Monitor Console Output
- [ ] Wait for completion (5-10 minutes first time)

### PHASE 10: Verify Results (5 minutes)
- [ ] Build should be GREEN ✅
- [ ] All stages completed
- [ ] Test Results visible
- [ ] Docker images created

### PHASE 11: Docker Hub Setup (Optional, 15 minutes)

**Step 1: Create Docker Hub Account (if needed)**
- [ ] Go to https://hub.docker.com
- [ ] Click **Sign Up**
- [ ] Create account with username: `nidup21`
- [ ] Verify email
- [ ] Login to Docker Hub

**Step 2: Create Docker Hub Access Token**
- [ ] Login to hub.docker.com
- [ ] Click profile icon (top-right) → **Account Settings**
- [ ] Left sidebar → **Security** → **Access Tokens**
- [ ] Click **New Access Token**
- [ ] **Token name:** `jenkins-token`
- [ ] **Access permissions:** Select `Read & Write`
- [ ] Click **Generate**
- [ ] **Copy the token** (you won't see it again!)

**Step 3: Add Docker Hub Credentials to Jenkins**
- [ ] Jenkins Dashboard → **Manage Jenkins** → **Credentials**
- [ ] Click **System** → **Global credentials (unrestricted)**
- [ ] Click **+ Add Credentials**
- [ ] **Kind:** `Username with password`
- [ ] **Scope:** `Global`
- [ ] **Username:** `nidup21`
- [ ] **Password:** Paste the Docker Hub access token
- [ ] **ID:** `dockerhub-credentials`
- [ ] **Description:** `Docker Hub credentials for nidup21`
- [ ] Click **Create**

**Step 4: Verify Jenkinsfile Configuration**
- [ ] Jenkinsfile Line 13 should show: `DOCKER_USERNAME = 'nidup21'`
- [ ] Jenkinsfile Line 14 should show: `BACKEND_IMAGE = 'nidup21/assignment2-backend'`
- [ ] Jenkinsfile Line 15 should show: `FRONTEND_IMAGE = 'nidup21/assignment2-frontend'`

### PHASE 12: Documentation (20 minutes)
- [ ] Take screenshots of:
  - [ ] Successful build (green checkmarks)
  - [ ] Console output (full logs)
  - [ ] Test results section
  - [ ] Docker images pushed to Docker Hub (if applicable)
  
**Verify Docker Hub Images:**
- [ ] Go to https://hub.docker.com/r/nidup21/assignment2-backend
- [ ] Verify images show up with tags: `latest`, and build number (e.g., `1`, `2`)
- [ ] Take screenshot of Docker Hub repo page

**Update README.md with:**
- [ ] Pipeline configuration details
- [ ] Jenkins URL (http://localhost:8080)
- [ ] Docker Hub repo links (optional)
- [ ] How to run pipeline
- [ ] Test results summary
- [ ] Any challenges faced during setup

---

## 📋 FILES YOU NEED

### Already Created:
- ✅ `/Jenkinsfile` - Pipeline definition
- ✅ `/backend/jest.config.js` - Jest configuration
- ✅ `/ASSIGNMENT2_GUIDE.md` - Detailed guide

### Need to Verify:
- ✅ `/backend/package.json` - Must have test script
- ✅ `/frontend/package.json` - Must have test script

### Need to Update (in Jenkinsfile):
- [ ] Line 11: Replace `YOUR_USERNAME` with your GitHub username
- [x] Line 13: Docker Hub username already set to `nidup21` ✅
- [x] Line 14-15: Docker image names already set ✅

---

## 🔧 TROUBLESHOOTING QUICK FIXES

| Issue | Quick Fix |
|-------|-----------|
| "npm test fails locally" | Run `npm install` in backend and frontend directories |
| "jest-junit not found" | Add `npm install --save-dev jest-junit` |
| "Jenkins can't find Node" | Restart Jenkins after installing NodeJS plugin |
| "GitHub connection fails" | Verify credentials and PAT has correct permissions |
| "Build hangs" | Check Console Output, may need to accept npm license |
| "Docker errors" | Install Docker or remove Docker stages from Jenkinsfile |

---

## 📊 PIPELINE OVERVIEW

```
Checkout Code
    ↓
Backend Install Dependencies
    ↓
Backend Run Tests ← Test Results Generated
    ↓
Frontend Install Dependencies
    ↓
Frontend Build Application
    ↓
Frontend Run Tests ← Test Results Generated
    ↓
Build Backend Docker Image
    ↓
Build Frontend Docker Image
    ↓
Push to Docker Hub (if main branch)
    ↓
✅ BUILD SUCCESS
```

---

## 🎯 SUCCESS CRITERIA

Your assignment is complete when:

1. ✅ Jenkins running on localhost:8080
2. ✅ Pipeline job created and visible
3. ✅ First build executed successfully
4. ✅ All stages showing GREEN checkmarks
5. ✅ Test results visible in Jenkins
6. ✅ Docker images created (or error ignored)
7. ✅ Screenshots captured
8. ✅ README.md updated with documentation

---

## 📞 COMMON COMMANDS

```bash
# Start Jenkins
brew services start jenkins-lts

# Stop Jenkins
brew services stop jenkins-lts

# Restart Jenkins
brew services restart jenkins-lts

# View Jenkins logs
tail -f /usr/local/var/log/jenkins/jenkins.log

# Check if running
ps aux | grep jenkins

# Test npm scripts locally
cd backend && npm test
cd frontend && npm test

# View Jenkins initial password
cat ~/.jenkins/secrets/initialAdminPassword
```

---

## 📝 NOTES

- First build takes 5-10 minutes (npm installs large packages)
- Subsequent builds are faster (3-5 minutes)
- Docker push only happens on `main` branch
- Tests must pass locally before pipeline will work
- Jenkins runs as a background service

---

**START HERE:** Begin with PHASE 1, then proceed through each phase in order. Each phase depends on the previous one.
