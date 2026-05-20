# Docker Hub Setup - nidup21 Configuration

## Your Docker Hub Details

**Docker Hub Username:** `nidup21`

**Docker Hub Repositories (will be created after first push):**
- Backend: `https://hub.docker.com/r/nidup21/assignment2-backend`
- Frontend: `https://hub.docker.com/r/nidup21/assignment2-frontend`

---

## Step-by-Step Docker Hub Setup

### 1. Create Docker Hub Account (if you don't have one)
```
URL: https://hub.docker.com
Username: nidup21
```

### 2. Create Docker Hub Access Token

**Path in Docker Hub:**
```
Profile Icon (top-right)
    ↓
Account Settings
    ↓
Security
    ↓
Access Tokens
    ↓
New Access Token
```

**Token Configuration:**
```
Token Name:  jenkins-token
Permissions: Read & Write
```

**⚠️ IMPORTANT:** Copy the token immediately. You won't see it again!

Token format: `dckr_pat_XXXXXXXXXXXXXXXXXXXXX`

---

### 3. Add to Jenkins

**Jenkins Path:**
```
Manage Jenkins
    ↓
Credentials
    ↓
System
    ↓
Global credentials (unrestricted)
    ↓
+ Add Credentials
```

**Jenkins Credentials Form:**
```
Kind:          Username with password
Scope:         Global
Username:      nidup21
Password:      [Paste Docker Hub access token here]
ID:            dockerhub-credentials
Description:   Docker Hub credentials for nidup21
```

---

## Verify Configuration

### In Jenkinsfile:
```groovy
Line 13: DOCKER_USERNAME = 'nidup21'           ✅
Line 14: BACKEND_IMAGE = 'nidup21/assignment2-backend'   ✅
Line 15: FRONTEND_IMAGE = 'nidup21/assignment2-frontend' ✅
```

### Expected Docker Images After First Build:
```
nidup21/assignment2-backend:latest
nidup21/assignment2-backend:1
nidup21/assignment2-backend:2
...

nidup21/assignment2-frontend:latest
nidup21/assignment2-frontend:1
nidup21/assignment2-frontend:2
...
```

---

## Commands to Test Docker Hub

```bash
# Login to Docker Hub locally (optional, for testing)
docker login -u nidup21

# When prompted, paste your Docker Hub access token

# View local images
docker images | grep nidup21

# Check if images were pushed to Docker Hub
curl -s https://hub.docker.com/v2/repositories/nidup21/assignment2-backend/tags | jq '.results[]?.name'
```

---

## Verification Checklist

### After Phase 11 (Docker Hub Setup):
- [ ] Docker Hub account created (username: nidup21)
- [ ] Access token generated and copied
- [ ] Credentials added to Jenkins with ID: `dockerhub-credentials`
- [ ] Jenkinsfile shows `nidup21` as Docker username

### After First Pipeline Build:
- [ ] Docker images built successfully (check Jenkins console)
- [ ] Images pushed to Docker Hub (check Jenkins console for "Push" stage)
- [ ] Visit https://hub.docker.com/r/nidup21 to verify images appear

---

## Images Created Per Build

**Build #1:**
```
✅ nidup21/assignment2-backend:latest
✅ nidup21/assignment2-backend:1
✅ nidup21/assignment2-frontend:latest
✅ nidup21/assignment2-frontend:1
```

**Build #2:**
```
✅ nidup21/assignment2-backend:latest (updated)
✅ nidup21/assignment2-backend:2
✅ nidup21/assignment2-frontend:latest (updated)
✅ nidup21/assignment2-frontend:2
```

---

## Troubleshooting Docker Hub Issues

| Problem | Solution |
|---------|----------|
| "Access denied" when pushing | Verify credentials ID is `dockerhub-credentials` |
| "No matching manifest" error | Check Docker images built successfully (see Jenkins logs) |
| Images don't appear on Docker Hub | Check "Push to Docker Hub" stage in Jenkins console |
| Token expired | Generate new access token and update Jenkins credentials |

---

## Screenshots to Take

After successful pipeline run with Docker Hub:

1. **Jenkins Pipeline Success:**
   - Screenshot showing all GREEN stages
   - Include the "Push to Docker Hub" stage

2. **Docker Hub Repository:**
   - Visit: https://hub.docker.com/r/nidup21/assignment2-backend
   - Screenshot showing your images with tags (latest, 1, 2, etc.)

3. **Jenkins Console Output:**
   - Last section showing "Docker push successful"

---

## Next Steps

1. ✅ Create Docker Hub account with username: **nidup21**
2. ✅ Generate Docker Hub access token
3. ✅ Add credentials to Jenkins (done via PHASE 11)
4. ✅ Run pipeline (PHASE 9)
5. ✅ Verify images pushed to Docker Hub
6. ✅ Take screenshots for assignment submission

---

**Jenkins Credential Summary for Your Records:**

```
Type: Username with password
Username: nidup21
Password: dckr_pat_XXXXXXXXXXXXXXXXXXXXXXXXX (your token)
ID: dockerhub-credentials
Purpose: Push Docker images to Docker Hub
```

---

All your Docker Hub configuration is now set to use username **nidup21**!
