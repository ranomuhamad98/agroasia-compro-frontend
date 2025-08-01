#!/bin/bash

# Script untuk mengelola Docker deployment Shofi Grocery
# Pastikan Docker dan Docker Compose sudah terinstall

set -e

# Colors untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function untuk print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function untuk menampilkan help
show_help() {
    echo "Shofi Grocery Docker Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev           Start development environment"
    echo "  prod          Start production environment"
    echo "  build         Build production image"
    echo "  stop          Stop all containers"
    echo "  restart       Restart containers"
    echo "  logs          Show container logs"
    echo "  clean         Clean up containers and images"
    echo "  status        Show container status"
    echo "  health        Check container health"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev        # Start development server"
    echo "  $0 prod       # Start production with nginx"
    echo "  $0 logs       # View container logs"
    echo ""
}

# Function untuk check dependencies
check_dependencies() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker tidak ditemukan. Silakan install Docker terlebih dahulu."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose tidak ditemukan. Silakan install Docker Compose terlebih dahulu."
        exit 1
    fi
}

# Function untuk start development
start_dev() {
    print_status "Starting development environment..."
    
    # Stop any running containers first
    docker-compose --profile dev down 2>/dev/null || true
    
    # Start development
    docker-compose --profile dev up -d --build
    
    print_success "Development environment started!"
    print_status "Application running at: http://localhost:3000"
    print_status "Use 'docker-scripts.sh logs' to view logs"
}

# Function untuk start production
start_prod() {
    print_status "Starting production environment..."
    
    # Stop any running containers first
    docker-compose --profile prod down 2>/dev/null || true
    
    # Build and start production
    docker-compose --profile prod up -d --build
    
    print_success "Production environment started!"
    print_status "Application running at: http://localhost"
    print_status "Use 'docker-scripts.sh health' to check status"
}

# Function untuk build production image
build_prod() {
    print_status "Building production image..."
    
    docker build --target production -t shofi-grocery:latest .
    
    print_success "Production image built successfully!"
}

# Function untuk stop containers
stop_containers() {
    print_status "Stopping all containers..."
    
    docker-compose --profile dev down 2>/dev/null || true
    docker-compose --profile prod down 2>/dev/null || true
    
    print_success "All containers stopped!"
}

# Function untuk restart containers
restart_containers() {
    print_status "Restarting containers..."
    
    # Detect which profile is running
    if docker ps --format "table {{.Names}}" | grep -q "shofi-grocery-dev"; then
        docker-compose --profile dev restart
        print_success "Development containers restarted!"
    elif docker ps --format "table {{.Names}}" | grep -q "shofi-grocery-prod"; then
        docker-compose --profile prod restart
        print_success "Production containers restarted!"
    else
        print_warning "No containers running to restart."
    fi
}

# Function untuk show logs
show_logs() {
    print_status "Showing container logs..."
    
    if docker ps --format "table {{.Names}}" | grep -q "shofi-grocery"; then
        docker-compose logs -f --tail=50
    else
        print_warning "No containers running."
    fi
}

# Function untuk clean up
clean_up() {
    print_warning "This will remove all containers, images, and volumes. Are you sure? (y/N)"
    read -r response
    
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning up Docker resources..."
        
        # Stop all containers
        docker-compose --profile dev down -v 2>/dev/null || true
        docker-compose --profile prod down -v 2>/dev/null || true
        
        # Remove images
        docker rmi shofi-grocery:latest 2>/dev/null || true
        docker image prune -f
        
        # Remove unused volumes
        docker volume prune -f
        
        print_success "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Function untuk show status
show_status() {
    print_status "Container Status:"
    echo ""
    
    if docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -q "shofi"; then
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep "shofi\|NAMES"
    else
        print_warning "No Shofi containers running."
    fi
    
    echo ""
    print_status "Docker Resource Usage:"
    docker system df
}

# Function untuk health check
health_check() {
    print_status "Checking container health..."
    
    if docker ps --format "table {{.Names}}" | grep -q "shofi-grocery-prod"; then
        # Check if application is responding
        if curl -f http://localhost:3000 > /dev/null 2>&1; then
            print_success "Application is healthy!"
        else
            print_error "Application is not responding!"
        fi
        
        # Show container health status
        docker ps --format "table {{.Names}}\t{{.Status}}" | grep "shofi"
    else
        print_warning "Production containers not running."
    fi
}

# Main script logic
main() {
    check_dependencies
    
    case "${1:-help}" in
        "dev")
            start_dev
            ;;
        "prod")
            start_prod
            ;;
        "build")
            build_prod
            ;;
        "stop")
            stop_containers
            ;;
        "restart")
            restart_containers
            ;;
        "logs")
            show_logs
            ;;
        "clean")
            clean_up
            ;;
        "status")
            show_status
            ;;
        "health")
            health_check
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function
main "$@" 