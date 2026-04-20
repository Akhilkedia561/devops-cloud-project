pipeline {
    agent any

    environment {
        DOCKER = "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe"

        BACKEND_IMAGE  = "shipstack-backend"
        FRONTEND_IMAGE = "shipstack-frontend"

        BACKEND_CONTAINER  = "shipstack-backend"
        FRONTEND_CONTAINER = "shipstack-frontend"

        BACKEND_PORT   = "8000"
        WEBSOCKET_PORT = "8001"
        FRONTEND_PORT  = "3000"

        // NEW: Image Versioning using commit SHA
        IMAGE_TAG = "${env.GIT_COMMIT}"

        // PUBLIC (safe)
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test_Y2l2aWwtdG9tY2F0LTYzLmNsZXJrLmFjY291bnRzLmRldiQ"
    }

    stages {

        stage('Build Backend Image') {
            steps {
                bat '"%DOCKER%" build -t %BACKEND_IMAGE%:%IMAGE_TAG% -f backend/Dockerfile backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                bat '''
                "%DOCKER%" build -t %FRONTEND_IMAGE%:%IMAGE_TAG% ^
                --build-arg NEXT_PUBLIC_API_URL=http://localhost:8000 ^
                --build-arg NEXT_PUBLIC_WS_URL=ws://localhost:8001 ^
                --build-arg NEXT_PUBLIC_APP_NAME=ShipStack ^
                --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=%NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY% ^
                --build-arg NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in ^
                --build-arg NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up ^
                -f frontend/Dockerfile frontend
                '''
            }
        }

        stage('Stop Old Containers') {
            steps {
                bat '"%DOCKER%" stop %BACKEND_CONTAINER% || exit 0'
                bat '"%DOCKER%" rm %BACKEND_CONTAINER% || exit 0'
                bat '"%DOCKER%" stop %FRONTEND_CONTAINER% || exit 0'
                bat '"%DOCKER%" rm %FRONTEND_CONTAINER% || exit 0'
            }
        }

        stage('Run Backend Container') {
            steps {
                withCredentials([string(credentialsId: 'CLERK_SECRET_KEY', variable: 'CLERK_SECRET_KEY')]) {
                    bat '''
                    "%DOCKER%" run -d ^
                    -p %BACKEND_PORT%:%BACKEND_PORT% ^
                    -p %WEBSOCKET_PORT%:%WEBSOCKET_PORT% ^
                    --name %BACKEND_CONTAINER% ^
                    -e NODE_ENV=production ^
                    -e PORT=%BACKEND_PORT% ^
                    -e CLERK_SECRET_KEY=%CLERK_SECRET_KEY% ^
                    %BACKEND_IMAGE%:%IMAGE_TAG%
                    '''
                }
            }
        }

        stage('Run Frontend Container') {
            steps {
                bat '''
                "%DOCKER%" run -d ^
                -p %FRONTEND_PORT%:%FRONTEND_PORT% ^
                --name %FRONTEND_CONTAINER% ^
                -e NODE_ENV=production ^
                -e NEXT_PUBLIC_API_URL=http://localhost:8000 ^
                -e NEXT_PUBLIC_WS_URL=ws://localhost:8001 ^
                -e NEXT_PUBLIC_APP_NAME=ShipStack ^
                -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=%NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY% ^
                -e NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in ^
                -e NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up ^
                %FRONTEND_IMAGE%:%IMAGE_TAG%
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Successful with tag ${IMAGE_TAG}"
        }
        failure {
            echo "❌ Deployment Failed!"
        }
    }
}