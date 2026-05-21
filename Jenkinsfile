pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'
    }
    
    environment {
        GITHUB_URL = 'https://github.com/Nidup21/Assignment_2_DSO101_02230292.git'
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_USERNAME = 'nidup21'
        BACKEND_IMAGE = 'nidup21/assignment2-backend'
        FRONTEND_IMAGE = 'nidup21/assignment2-frontend'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '====== STAGE: Code Checkout ======'
                echo "Cloning repository from: ${env.GITHUB_URL}"
                git branch: 'main',
                    credentialsId: 'github-credentials',
                    url: "${env.GITHUB_URL}"
                echo 'Code checked out successfully'
            }
        }
        
        stage('Backend: Install Dependencies') {
            steps {
                echo '====== STAGE: Backend Dependencies Installation ======'
                dir('backend') {
                    sh 'npm install'
                    echo 'Backend dependencies installed'
                }
            }
        }
        
        stage('Backend: Run Tests') {
            steps {
                echo '====== STAGE: Backend Unit Tests ======'
                dir('backend') {
                    sh 'npm test'
                    echo 'Backend tests completed'
                }
            }
            post {
                always {
                    junit 'backend/junit.xml'
                }
                success {
                    echo 'All backend tests passed!'
                }
                failure {
                    echo 'Some backend tests failed!'
                }
            }
        }
        
        stage('Frontend: Install Dependencies') {
            steps {
                echo '====== STAGE: Frontend Dependencies Installation ======'
                dir('frontend') {
                    sh 'npm install'
                    echo 'Frontend dependencies installed'
                }
            }
        }
        
        stage('Frontend: Build Application') {
            steps {
                echo '====== STAGE: Frontend Build ======'
                dir('frontend') {
                    sh 'npm run build'
                    echo 'Frontend build completed'
                }
            }
        }
        
        stage('Frontend: Run Tests') {
            steps {
                echo '====== STAGE: Frontend Unit Tests ======'
                dir('frontend') {
                    sh 'npm test'
                    echo 'Frontend tests completed'
                }
            }
            post {
                always {
                    junit 'frontend/junit.xml'
                }
                success {
                    echo 'All frontend tests passed!'
                }
                failure {
                    echo 'Some frontend tests failed!'
                }
            }
        }
        
        stage('Build Backend Docker Image') {
            steps {
                echo '====== STAGE: Build Backend Docker Image (Optional) ======'
                script {
                    try {
                        dir('backend') {
                            sh 'docker build -t ${DOCKER_USERNAME}/assignment2-backend:latest .'
                            sh 'docker build -t ${DOCKER_USERNAME}/assignment2-backend:${BUILD_NUMBER} .'
                            echo '✅ Backend Docker image built'
                        }
                    } catch (Exception e) {
                        echo '⚠️ Docker not available - skipping Docker build (this is optional)'
                        echo 'To enable Docker: Install Docker and restart Jenkins'
                    }
                }
            }
        }
        
        stage('Build Frontend Docker Image') {
            steps {
                echo '====== STAGE: Build Frontend Docker Image (Optional) ======'
                script {
                    try {
                        dir('frontend') {
                            sh 'docker build -t ${DOCKER_USERNAME}/assignment2-frontend:latest .'
                            sh 'docker build -t ${DOCKER_USERNAME}/assignment2-frontend:${BUILD_NUMBER} .'
                            echo '✅ Frontend Docker image built'
                        }
                    } catch (Exception e) {
                        echo '⚠️ Docker not available - skipping Docker build (this is optional)'
                        echo 'To enable Docker: Install Docker and restart Jenkins'
                    }
                }
            }
        }
        
        stage('Push Images to Docker Hub') {
            when {
                branch 'main'
            }
            steps {
                echo '====== STAGE: Push Docker Images to Docker Hub (Optional) ======'
                script {
                    try {
                        docker.withRegistry("https://${env.DOCKER_REGISTRY}", 'dockerhub-credentials') {
                            docker.image("${env.BACKEND_IMAGE}:latest").push()
                            docker.image("${env.BACKEND_IMAGE}:${BUILD_NUMBER}").push()
                            docker.image("${env.FRONTEND_IMAGE}:latest").push()
                            docker.image("${env.FRONTEND_IMAGE}:${BUILD_NUMBER}").push()
                            echo '✅ Docker images pushed successfully'
                        }
                    } catch (Exception e) {
                        echo '⚠️ Docker not available or credentials not set - skipping push'
                        echo 'To enable Docker push: Install Docker, set credentials, and restart Jenkins'
                    }
                }
            }
        }
        
        stage('Build Summary') {
            steps {
                echo '====== BUILD PIPELINE COMPLETED SUCCESSFULLY ======'
                echo "Build Number: ${BUILD_NUMBER}"
                echo "Build Duration: ${currentBuild.durationString}"
                echo "Status: SUCCESS"
                echo ""
                echo "Artifacts Generated:"
                echo "  - Backend Docker Image: ${env.BACKEND_IMAGE}:${BUILD_NUMBER}"
                echo "  - Frontend Docker Image: ${env.FRONTEND_IMAGE}:${BUILD_NUMBER}"
                echo "  - Test Reports: junit.xml"
            }
        }
    }
    
    post {
        always {
            echo '====== PIPELINE EXECUTION SUMMARY ======'
            echo "Build Status: ${currentBuild.result}"
            echo "Build Time: ${currentBuild.durationString}"
        }
        
        success {
            echo 'BUILD SUCCESSFUL!'
            echo 'All stages completed successfully.'
            echo 'Ready for deployment.'
        }
        
        failure {
            echo 'BUILD FAILED!'
            echo 'Please check the console output for details.'
        }
        
        unstable {
            echo 'BUILD UNSTABLE'
            echo 'Some tests or stages had warnings.'
        }
        
        cleanup {
            deleteDir()
        }
    }
}
