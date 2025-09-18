#!/bin/bash

# BPN Project Deployment Script
# Run this script on your VPS after connecting via SSH

set -e  # Exit on any error

echo "🚀 Starting BPN deployment..."

# Configuration
PROJECT_DIR="/var/www/bpn"
REPO_URL="https://github.com/binhphuong-ab/BPN.git"
NODE_VERSION="18"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

echo_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

echo_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Update system packages
echo_info "Updating system packages..."
apt update && apt upgrade -y

# Install Node.js and npm
echo_info "Installing Node.js $NODE_VERSION..."
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
apt-get install -y nodejs

# Install PM2 globally
echo_info "Installing PM2..."
npm install -g pm2

# Install Git if not present
echo_info "Installing Git..."
apt-get install -y git

# Create project directory
echo_info "Setting up project directory..."
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# Clone or update repository
if [ -d ".git" ]; then
    echo_info "Updating existing repository..."
    git fetch origin
    git reset --hard origin/main
    git pull origin main
else
    echo_info "Cloning repository..."
    git clone $REPO_URL .
fi

# Install dependencies
echo_info "Installing dependencies..."
npm ci --production

# Build the application
echo_info "Building the application..."
npm run build

# Copy environment file template
if [ ! -f ".env.local" ]; then
    echo_info "Creating environment file..."
    cat > .env.local << EOF
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/bpn

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password

# Next.js Configuration
NEXTAUTH_URL=http://134.209.99.219:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Environment
NODE_ENV=production
EOF
    echo_warning "Please update .env.local with your actual configuration!"
fi

# Start or restart the application with PM2
echo_info "Starting application with PM2..."
pm2 delete bpn 2>/dev/null || true
pm2 start npm --name "bpn" -- start
pm2 save
pm2 startup

echo_success "🎉 BPN deployment completed!"
echo_info "Application is running on: http://134.209.99.219:3000"
echo_warning "Don't forget to:"
echo_warning "1. Update .env.local with your actual MongoDB URI and secrets"
echo_warning "2. Configure your MongoDB database"
echo_warning "3. Set up nginx as a reverse proxy (optional)"

# Show PM2 status
echo_info "PM2 Status:"
pm2 status