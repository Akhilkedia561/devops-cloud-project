pipeline {
    agent any

    environment {
        BACKEND_IMAGE  = "shipstack-backend"
        FRONTEND_IMAGE = "shipstack-frontend"

        BACKEND_CONTAINER  = "shipstack-backend"
        FRONTEND_CONTAINER = "shipstack-frontend"

        BACKEND_PORT   = "5000"
        WEBSOCKET_PORT = "5001"
        FRONTEND_PORT  = "3000"

        NETWORK_NAME = "shipstack-net"

        // Image versioning using commit SHA
        IMAGE_TAG = "${env.GIT_COMMIT}"

        // UPDATED: New EC2 public IP
        EC2_IP = "13.211.191.167"
    }

    stages {

        stage('Create Docker Network') {
            steps {
                sh 'docker network create ${NETWORK_NAME} || true'
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} -f backend/Dockerfile --target production backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                withCredentials([string(credentialsId: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', variable: 'CLERK_PUB_KEY')]) {
                    sh """
                        docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \\
                        --build-arg NEXT_PUBLIC_API_URL=http://${EC2_IP}:${BACKEND_PORT} \\
                        --build-arg NEXT_PUBLIC_WS_URL=ws://${EC2_IP}:${WEBSOCKET_PORT} \\
                        --build-arg NEXT_PUBLIC_APP_NAME=ShipStack \\
                        --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=\${CLERK_PUB_KEY} \\
                        --build-arg NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in \\
                        --build-arg NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up \\
                        -f frontend/Dockerfile frontend
                    """
                }
            }
        }

        stage('Stop Old Containers') {
            steps {
                sh 'docker stop ${BACKEND_CONTAINER} || true'
                sh 'docker rm ${BACKEND_CONTAINER} || true'
                sh 'docker stop ${FRONTEND_CONTAINER} || true'
                sh 'docker rm ${FRONTEND_CONTAINER} || true'
            }
        }

        stage('Run Backend Container') {
            steps {
                // FIXED: Added GITHUB_WEBHOOK_SECRET and JENKINS_TOKEN to credentials block
                withCredentials([
                    string(credentialsId: 'CLERK_SECRET_KEY', variable: 'CLERK_SECRET_KEY'),
                    string(credentialsId: 'GITHUB_WEBHOOK_SECRET', variable: 'GITHUB_WEBHOOK_SECRET'),
                    string(credentialsId: 'JENKINS_TOKEN', variable: 'JENKINS_TOKEN')
                ]) {
                    sh """
                        docker run -d \\
                        -p ${BACKEND_PORT}:${BACKEND_PORT} \\
                        -p ${WEBSOCKET_PORT}:${WEBSOCKET_PORT} \\
                        --name ${BACKEND_CONTAINER} \\
                        --network ${NETWORK_NAME} \\
                        --restart unless-stopped \\
                        -e NODE_ENV=production \\
                        -e PORT=${BACKEND_PORT} \\
                        -e CLERK_SECRET_KEY=\${CLERK_SECRET_KEY} \\
                        -e FRONTEND_URL=http://${EC2_IP}:${FRONTEND_PORT} \\
                        -e GITHUB_WEBHOOK_SECRET=\${GITHUB_WEBHOOK_SECRET} \\
                        -e JENKINS_TOKEN=\${JENKINS_TOKEN} \\
                        -v /var/run/docker.sock:/var/run/docker.sock \\
                        ${BACKEND_IMAGE}:${IMAGE_TAG}
                    """
                }
            }
        }

        stage('Run Frontend Container') {
            steps {
                withCredentials([
                    string(credentialsId: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', variable: 'CLERK_PUB_KEY'),
                    string(credentialsId: 'CLERK_SECRET_KEY', variable: 'CLERK_SECRET_KEY')
                ]) {
                    sh """
                        docker run -d \\
                        -p ${FRONTEND_PORT}:${FRONTEND_PORT} \\
                        --name ${FRONTEND_CONTAINER} \\
                        --network ${NETWORK_NAME} \\
                        --restart unless-stopped \\
                        -e NODE_ENV=production \\
                        -e NEXT_PUBLIC_API_URL=http://${EC2_IP}:${BACKEND_PORT} \\
                        -e NEXT_PUBLIC_WS_URL=ws://${EC2_IP}:${WEBSOCKET_PORT} \\
                        -e NEXT_PUBLIC_APP_NAME=ShipStack \\
                        -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=\${CLERK_PUB_KEY} \\
                        -e CLERK_SECRET_KEY=\${CLERK_SECRET_KEY} \\
                        -e NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in \\
                        -e NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up \\
                        ${FRONTEND_IMAGE}:${IMAGE_TAG}
                    """
                }
            }
        }

        stage('Cleanup Old Images') {
            steps {
                sh 'docker image prune -f'
            }
        }

        stage('Health Check') {
            steps {
                sh 'sleep 5'
                sh 'docker ps --filter name=${BACKEND_CONTAINER} --filter status=running | grep ${BACKEND_CONTAINER}'
                sh 'docker ps --filter name=${FRONTEND_CONTAINER} --filter status=running | grep ${FRONTEND_CONTAINER}'
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful — tag: ${IMAGE_TAG}"
            echo "🌐 Frontend: http://${EC2_IP}:${FRONTEND_PORT}"
            echo "🔌 Backend:  http://${EC2_IP}:${BACKEND_PORT}"
        }
        failure {
            echo "❌ Deployment failed — tag: ${IMAGE_TAG}"
            sh 'docker logs --tail 50 ${BACKEND_CONTAINER} || true'
            sh 'docker logs --tail 50 ${FRONTEND_CONTAINER} || true'
        }
        always {
            cleanWs()
        }
    }
}