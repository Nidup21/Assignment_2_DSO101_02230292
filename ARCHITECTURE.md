# Assignment 2: Visual Setup Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ASSIGNMENT 2 CI/CD PIPELINE                         │
└─────────────────────────────────────────────────────────────────────────────┘

                                    GitHub
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
              (Push Code)        (Webhook)         (PAT)
                    │                 │                 │
                    ▼                 ▼                 ▼
            ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
            │ Repository   │    │ Webhook Hook │    │ Credentials  │
            │ (main branch)│    │ Triggers     │    │ (GitHub PAT) │
            └──────────────┘    └──────┬───────┘    └──────────────┘
                                       │
                                       │ (triggers)
                                       ▼
                            ┌─────────────────────┐
                            │   Jenkins Server    │
                            │  localhost:8080     │
                            └────────┬────────────┘
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        │                            │                            │
        ▼                            ▼                            ▼
   ┌─────────────┐            ┌──────────────┐            ┌──────────────┐
   │   Git Clone │            │ NodeJS 20.x  │            │ Credentials  │
   │ Repository  │            │  (in tools)  │            │   Manager    │
   └──────┬──────┘            └──────────────┘            └──────────────┘
          │
          ▼
   ┌──────────────────────────────────────────────────┐
   │         Pipeline Execution Stages                │
   ├──────────────────────────────────────────────────┤
   │ 1. Checkout                                      │
   │    └─ git clone from GitHub                      │
   │                                                  │
   │ 2. Backend Install Dependencies                  │
   │    └─ npm install (backend/)                     │
   │                                                  │
   │ 3. Backend Run Tests                             │
   │    └─ npm test (backend/)                        │
   │    └─ generates junit.xml                        │
   │                                                  │
   │ 4. Frontend Install Dependencies                 │
   │    └─ npm install (frontend/)                    │
   │                                                  │
   │ 5. Frontend Build Application                    │
   │    └─ npm run build                              │
   │    └─ generates build/ folder                    │
   │                                                  │
   │ 6. Frontend Run Tests                            │
   │    └─ npm test (frontend/)                       │
   │    └─ generates junit.xml                        │
   │                                                  │
   │ 7. Build Backend Docker Image                    │
   │    └─ docker build (backend/)                    │
   │                                                  │
   │ 8. Build Frontend Docker Image                   │
   │    └─ docker build (frontend/)                   │
   │                                                  │
   │ 9. Push to Docker Hub (optional)                 │
   │    └─ docker push (if main branch)               │
   │                                                  │
   │ 10. Build Summary                                │
   │     └─ Display build info                        │
   └──────────────────────────────────────────────────┘
          │
          ▼
   ┌──────────────────────────────┐
   │  Test Results Report (JUnit) │
   │                              │
   │  ✅ Backend Tests: 5/5       │
   │  ✅ Frontend Tests: 3/3      │
   │                              │
   │  Coverage Report: 65%        │
   └──────────────────────────────┘
          │
          ▼
   ┌──────────────────────────────┐
   │   Artifacts Generated        │
   │                              │
   │  📦 Docker Images            │
   │     - backend:latest         │
   │     - backend:BUILD_#        │
   │     - frontend:latest        │
   │     - frontend:BUILD_#       │
   │                              │
   │  📄 Reports                  │
   │     - junit.xml (backend)    │
   │     - junit.xml (frontend)   │
   │     - coverage/index.html    │
   └──────────────────────────────┘
          │
          ▼
   ┌──────────────────────────────┐
   │   Ready for Deployment       │
   │   (Optional Docker Push)     │
   └──────────────────────────────┘
```

## Step-by-Step Setup Timeline

```
Day 1: Preparation
├─ 10 min: Verify package.json scripts
├─ 15 min: Push code to GitHub
└─ 15 min: Generate GitHub PAT

Day 1: Jenkins Installation (30-45 min)
├─ 15 min: Install Jenkins (brew)
├─ 10 min: Access localhost:8080
├─ 10 min: Complete initial setup
└─ 5 min: Create admin user

Day 1: Configuration (45-60 min)
├─ 15 min: Install plugins
├─ 10 min: Configure Node.js
├─ 10 min: Add GitHub credentials
├─ 10 min: Add Docker credentials (optional)
└─ 5 min: Create pipeline job

Day 1/2: Pipeline Execution (5-10 min)
├─ 2 min: Click "Build Now"
├─ 8 min: Wait for completion
└─ 2 min: View results

Day 2: Documentation (15-20 min)
├─ 10 min: Take screenshots
└─ 10 min: Update README.md
```

## Jenkins Dashboard Layout

```
┌────────────────────────────────────────────────────────────┐
│  Jenkins                                    Version 2.414.3  │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  Welcome Admin                              [Logout]        │
│                                                              │
│  ┌──────────────────┐  ┌───────────────────────────────┐   │
│  │ New Item         │  │  Manage Jenkins               │   │
│  │ [+ New Item]     │  │  ├─ Configure System          │   │
│  │                  │  │  ├─ Manage Plugins            │   │
│  │ Pipeline Jobs    │  │  ├─ Manage Users              │   │
│  │ ├─ [✅ Build #1] │  │  ├─ Tools                     │   │
│  │ ├─ [✅ Build #2] │  │  ├─ Credentials               │   │
│  │ ├─ [⏳ Build #3] │  │  └─ Script Console            │   │
│  │ └─ [❌ Build #4] │  └───────────────────────────────┘   │
│  └──────────────────┘                                       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ assignment2-todo-pipeline                            │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ Last Build: #5 (Last Saturday 12:34 PM)              │  │
│  │ Status: ✅ SUCCESS (45 sec)                          │  │
│  │ Coverage: 75%                                         │  │
│  │                                                        │  │
│  │ [Build Now] [Configure] [Delete] [Rename]            │  │
│  │                                                        │  │
│  │ Recent Builds:                                         │  │
│  │  #5 - ✅ SUCCESS (45 sec)  - May 19, 12:34          │  │
│  │  #4 - ❌ FAILED (120 sec)  - May 19, 12:10          │  │
│  │  #3 - ✅ SUCCESS (50 sec)  - May 19, 11:45          │  │
│  │  #2 - ⏳ RUNNING           - May 19, 11:20          │  │
│  │  #1 - ✅ SUCCESS (600 sec) - May 19, 10:00          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

## Configuration Hierarchy

```
Jenkins Server (localhost:8080)
│
├─ Manage Jenkins
│  ├─ Tools
│  │  └─ NodeJS installations
│  │     └─ NodeJS 20.x LTS ✅
│  │
│  ├─ Manage Plugins
│  │  ├─ NodeJS Plugin ✅
│  │  ├─ Pipeline ✅
│  │  ├─ GitHub Integration ✅
│  │  └─ Docker Pipeline ✅
│  │
│  └─ Credentials
│     ├─ Global
│     │  ├─ github-credentials
│     │  │  ├─ Username: your-github-username
│     │  │  └─ Password: github-PAT
│     │  │
│     │  └─ docker-hub-credentials
│     │     ├─ Username: your-dockerhub-username
│     │     └─ Password: dockerhub-PAT/password
│
└─ Pipeline Jobs
   └─ assignment2-todo-pipeline
      ├─ Definition: Pipeline script from SCM
      ├─ Repository: https://github.com/...
      ├─ Credentials: github-credentials
      ├─ Branch: main
      ├─ Script Path: Jenkinsfile
      │
      └─ Build Triggers
         └─ GitHub hook trigger ✅
```

## Execution Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│  Build Initiated (Click "Build Now")                     │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Checkout Stage  │
        │ (60 seconds)    │
        └────────┬────────┘
                 │
                 ▼ (success) ← (failure → abort)
        ┌─────────────────┐
        │ Backend Install │
        │ Dependencies    │
        │ (90 seconds)    │
        └────────┬────────┘
                 │
                 ▼ (success) ← (failure → fail build)
        ┌─────────────────┐
        │ Backend Test    │
        │ (45 seconds)    │
        │ 📊 junit.xml    │
        └────────┬────────┘
                 │
                 ▼ (success) ← (failure → fail build)
        ┌─────────────────┐
        │ Frontend Install│
        │ Dependencies    │
        │ (120 seconds)   │
        └────────┬────────┘
                 │
                 ▼ (success) ← (failure → fail build)
        ┌─────────────────┐
        │ Frontend Build  │
        │ (60 seconds)    │
        │ 📦 build/       │
        └────────┬────────┘
                 │
                 ▼ (success) ← (failure → fail build)
        ┌─────────────────┐
        │ Frontend Test   │
        │ (45 seconds)    │
        │ 📊 junit.xml    │
        └────────┬────────┘
                 │
                 ▼ (success) ← (failure → fail build)
        ┌─────────────────┐
        │ Docker Build    │
        │ Backend Image   │
        │ (30 seconds)    │
        └────────┬────────┘
                 │
                 ▼ (success) ← (failure → warning only)
        ┌─────────────────┐
        │ Docker Build    │
        │ Frontend Image  │
        │ (30 seconds)    │
        └────────┬────────┘
                 │
                 ▼ (success) ← (failure → warning only)
        ┌─────────────────┐
        │ Push to         │
        │ Docker Hub      │
        │ (if main)       │
        │ (45 seconds)    │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Build Summary   │
        │ 📊 Report       │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │  Build Complete │
        │  ✅ SUCCESS     │
        │  Total: 450s    │
        └─────────────────┘
```

## File Structure

```
/Users/m3/Desktop/Assignment2_DSO101/
│
├─ Jenkinsfile                          ← Pipeline definition
│
├─ ASSIGNMENT2_GUIDE.md                 ← Detailed guide (THIS FILE)
├─ QUICK_START.md                       ← Quick reference
├─ ARCHITECTURE.md                      ← This visual guide
│
├─ backend/
│  ├─ package.json                      ← Must have npm test script
│  ├─ jest.config.js                    ← Jest configuration ✅
│  ├─ server.js                         ← Express server
│  ├─ db.js                             ← Database module
│  ├─ routes.js                         ← API routes
│  ├─ __tests__/
│  │  └─ server.test.js                 ← Backend tests
│  └─ Dockerfile                        ← Docker image config
│
├─ frontend/
│  ├─ package.json                      ← Must have npm test script
│  ├─ public/
│  │  └─ index.html
│  ├─ src/
│  │  ├─ App.js                         ← Main React component
│  │  ├─ App.test.js                    ← React tests
│  │  ├─ index.js
│  │  └─ ...
│  ├─ __tests__/
│  │  └─ App.test.js                    ← Component tests
│  ├─ Dockerfile                        ← Docker image config
│  └─ nginx.conf                        ← Nginx config
│
├─ .gitignore                           ← Git ignore rules
└─ README.md                            ← Project documentation (UPDATE THIS)
```

## Docker Images Generated

```
Build #1
├─ assignment2-backend:latest
├─ assignment2-backend:1
├─ assignment2-frontend:latest
└─ assignment2-frontend:1

Build #2
├─ assignment2-backend:latest (updated)
├─ assignment2-backend:2
├─ assignment2-frontend:latest (updated)
└─ assignment2-frontend:2

...

Docker Hub (if pushed)
├─ your-username/assignment2-backend:latest
├─ your-username/assignment2-backend:1
├─ your-username/assignment2-backend:2
├─ your-username/assignment2-frontend:latest
├─ your-username/assignment2-frontend:1
└─ your-username/assignment2-frontend:2
```

## Credential Flow

```
┌────────────────────────────────────┐
│ GitHub PAT                         │
│ (github-credentials)               │
│                                    │
│ Username: your-github-username     │
│ Password: ghp_xxxxxxxxxxxx...      │
└────────────────┬───────────────────┘
                 │
                 ├─ Clone Repository ✅
                 │
                 ├─ Download Code ✅
                 │
                 └─ Update Webhooks ✅

┌────────────────────────────────────┐
│ Docker Hub Credentials             │
│ (docker-hub-credentials)           │
│                                    │
│ Username: your-dockerhub-username  │
│ Password: dckr_pat_xxxx...         │
└────────────────┬───────────────────┘
                 │
                 └─ Push Images ✅
                    ├─ backend:latest
                    ├─ backend:BUILD_#
                    ├─ frontend:latest
                    └─ frontend:BUILD_#
```

## Success Indicators

```
✅ Green checkmarks on all stages = SUCCESS
├─ Checkout ✅
├─ Backend Install ✅
├─ Backend Test ✅ (with junit.xml)
├─ Frontend Install ✅
├─ Frontend Build ✅
├─ Frontend Test ✅ (with junit.xml)
├─ Docker Backend ✅
├─ Docker Frontend ✅
├─ Docker Push ✅ (if main branch)
└─ Summary ✅

❌ Red X on any stage = FAILURE
└─ Abort build and check logs
```

---

**Note:** Customize with your actual usernames and repository URLs before running.
