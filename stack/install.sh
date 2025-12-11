#!/bin/bash

# StellarStack Installer
# https://github.com/MarquesCoding/StellarStack
# This is a mock installer for demonstration purposes

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color
BOLD='\033[1m'
DIM='\033[2m'

# Service states (0 = not selected, 1 = selected)
declare -A services
services=(
    ["control_plane"]=1
    ["postgresql"]=1
    ["redis"]=1
    ["traefik"]=1
    ["prometheus"]=0
    ["grafana"]=0
    ["watchtower"]=1
    ["rust_daemon"]=0
)

# Service descriptions
declare -A service_names
service_names=(
    ["control_plane"]="Control Plane (Next.js + Hono API)"
    ["postgresql"]="PostgreSQL Database"
    ["redis"]="Redis Cache"
    ["traefik"]="Traefik Reverse Proxy"
    ["prometheus"]="Prometheus Monitoring"
    ["grafana"]="Grafana Dashboards"
    ["watchtower"]="Watchtower Auto-Updates"
    ["rust_daemon"]="Rust Daemon (Game Node)"
)

# Service order for display
service_order=("control_plane" "postgresql" "redis" "traefik" "prometheus" "grafana" "watchtower" "rust_daemon")

current_selection=0
current_step="welcome"

# Clear screen and show header
clear_screen() {
    clear
    echo -e "${CYAN}"
    cat << 'EOF'
   _____ _       _ _            _____ _             _
  / ____| |     | | |          / ____| |           | |
 | (___ | |_ ___| | | __ _ _ _| (___ | |_ __ _  ___| | __
  \___ \| __/ _ \ | |/ _` | '__\___ \| __/ _` |/ __| |/ /
  ____) | ||  __/ | | (_| | |  ____) | || (_| | (__|   <
 |_____/ \__\___|_|_|\__,_|_| |_____/ \__\__,_|\___|_|\_\

EOF
    echo -e "${NC}"
    echo -e "${DIM}────────────────────────────────────────────────────────────${NC}"
    echo -e "${GRAY}  Open Source Game Server Management Panel${NC}"
    echo -e "${GRAY}  https://github.com/MarquesCoding/StellarStack${NC}"
    echo -e "${DIM}────────────────────────────────────────────────────────────${NC}"
    echo ""
}

# Show welcome screen
show_welcome() {
    clear_screen
    echo -e "${WHITE}${BOLD}  Welcome to the StellarStack Installer${NC}"
    echo ""
    echo -e "${GRAY}  This installer will help you set up StellarStack on your server.${NC}"
    echo -e "${GRAY}  You'll be able to choose which components to install.${NC}"
    echo ""
    echo -e "${DIM}────────────────────────────────────────────────────────────${NC}"
    echo ""
    echo -e "${YELLOW}  System Requirements:${NC}"
    echo -e "${GRAY}    • Ubuntu 20.04+ / Debian 11+${NC}"
    echo -e "${GRAY}    • 2GB RAM minimum (4GB recommended)${NC}"
    echo -e "${GRAY}    • 20GB disk space${NC}"
    echo -e "${GRAY}    • Docker & Docker Compose${NC}"
    echo ""
    echo -e "${DIM}────────────────────────────────────────────────────────────${NC}"
    echo ""
    echo -e "${GREEN}  Press ${WHITE}[ENTER]${GREEN} to continue or ${WHITE}[Q]${GREEN} to quit${NC}"
}

# Show service selection
show_services() {
    clear_screen
    echo -e "${WHITE}${BOLD}  Select Services to Install${NC}"
    echo ""
    echo -e "${GRAY}  Use ${WHITE}↑/↓${GRAY} to navigate, ${WHITE}[SPACE]${GRAY} to toggle, ${WHITE}[ENTER]${GRAY} to confirm${NC}"
    echo ""
    echo -e "${DIM}────────────────────────────────────────────────────────────${NC}"
    echo ""

    local i=0
    for service in "${service_order[@]}"; do
        local name="${service_names[$service]}"
        local selected="${services[$service]}"

        if [ $i -eq $current_selection ]; then
            echo -ne "${CYAN}  ▶ ${NC}"
        else
            echo -ne "    "
        fi

        if [ "$selected" -eq 1 ]; then
            echo -e "${GREEN}[✓]${NC} ${WHITE}${name}${NC}"
        else
            echo -e "${GRAY}[ ]${NC} ${GRAY}${name}${NC}"
        fi

        ((i++))
    done

    echo ""
    echo -e "${DIM}────────────────────────────────────────────────────────────${NC}"
    echo ""

    # Show selected count
    local count=0
    for service in "${service_order[@]}"; do
        if [ "${services[$service]}" -eq 1 ]; then
            ((count++))
        fi
    done
    echo -e "${GRAY}  ${count} service(s) selected${NC}"
    echo ""
    echo -e "${YELLOW}  [SPACE]${NC} Toggle  ${YELLOW}[ENTER]${NC} Continue  ${YELLOW}[A]${NC} Select All  ${YELLOW}[N]${NC} Select None"
}

# Show configuration screen
show_configuration() {
    clear_screen
    echo -e "${WHITE}${BOLD}  Configuration${NC}"
    echo ""
    echo -e "${GRAY}  The following services will be installed:${NC}"
    echo ""
    echo -e "${DIM}────────────────────────────────────────────────────────────${NC}"
    echo ""

    for service in "${service_order[@]}"; do
        if [ "${services[$service]}" -eq 1 ]; then
            echo -e "  ${GREEN}✓${NC} ${WHITE}${service_names[$service]}${NC}"
        fi
    done

    echo ""
    echo -e "${DIM}────────────────────────────────────────────────────────────${NC}"
    echo ""
    echo -e "${YELLOW}  Installation Directory:${NC} ${WHITE}/opt/stellarstack${NC}"
    echo -e "${YELLOW}  Docker Network:${NC} ${WHITE}stellarstack${NC}"
    echo -e "${YELLOW}  Default Port:${NC} ${WHITE}3000${NC}"
    echo ""
    echo -e "${DIM}────────────────────────────────────────────────────────────${NC}"
    echo ""
    echo -e "${GREEN}  Press ${WHITE}[ENTER]${GREEN} to start installation or ${WHITE}[B]${GREEN} to go back${NC}"
}

# Show installation progress (mock)
show_installation() {
    clear_screen
    echo -e "${WHITE}${BOLD}  Installing StellarStack${NC}"
    echo ""
    echo -e "${GRAY}  Please wait while we set up your services...${NC}"
    echo ""
    echo -e "${DIM}────────────────────────────────────────────────────────────${NC}"
    echo ""

    local tasks=(
        "Checking system requirements"
        "Installing dependencies"
        "Pulling Docker images"
        "Creating network"
        "Generating configuration"
        "Setting up volumes"
        "Starting services"
        "Running health checks"
        "Configuring firewall"
        "Finalizing installation"
    )

    for task in "${tasks[@]}"; do
        echo -ne "  ${YELLOW}◯${NC} ${GRAY}${task}...${NC}"
        sleep 0.5
        echo -e "\r  ${GREEN}●${NC} ${WHITE}${task}${NC}    "
    done

    echo ""
    echo -e "${DIM}────────────────────────────────────────────────────────────${NC}"
    echo ""
    sleep 0.5
}

# Show completion screen
show_complete() {
    clear_screen
    echo -e "${GREEN}${BOLD}  Installation Complete!${NC}"
    echo ""
    echo -e "${GRAY}  StellarStack has been successfully installed.${NC}"
    echo ""
    echo -e "${DIM}────────────────────────────────────────────────────────────${NC}"
    echo ""
    echo -e "${WHITE}  Access your panel:${NC}"
    echo ""
    echo -e "    ${CYAN}➜${NC}  Panel:     ${WHITE}http://localhost:3000${NC}"
    echo -e "    ${CYAN}➜${NC}  API:       ${WHITE}http://localhost:3000/api${NC}"
    if [ "${services["traefik"]}" -eq 1 ]; then
        echo -e "    ${CYAN}➜${NC}  Traefik:   ${WHITE}http://localhost:8080${NC}"
    fi
    if [ "${services["grafana"]}" -eq 1 ]; then
        echo -e "    ${CYAN}➜${NC}  Grafana:   ${WHITE}http://localhost:3001${NC}"
    fi
    echo ""
    echo -e "${DIM}────────────────────────────────────────────────────────────${NC}"
    echo ""
    echo -e "${WHITE}  Default Credentials:${NC}"
    echo ""
    echo -e "    ${YELLOW}Email:${NC}    ${WHITE}admin@stellarstack.app${NC}"
    echo -e "    ${YELLOW}Password:${NC} ${WHITE}changeme123${NC}"
    echo ""
    echo -e "${DIM}────────────────────────────────────────────────────────────${NC}"
    echo ""
    echo -e "${WHITE}  Useful Commands:${NC}"
    echo ""
    echo -e "    ${GRAY}cd /opt/stellarstack${NC}"
    echo -e "    ${GRAY}docker compose ps${NC}        ${DIM}# View running services${NC}"
    echo -e "    ${GRAY}docker compose logs -f${NC}   ${DIM}# View logs${NC}"
    echo -e "    ${GRAY}docker compose down${NC}      ${DIM}# Stop services${NC}"
    echo -e "    ${GRAY}docker compose up -d${NC}     ${DIM}# Start services${NC}"
    echo ""
    echo -e "${DIM}────────────────────────────────────────────────────────────${NC}"
    echo ""
    echo -e "${YELLOW}  ⚠  Remember to change your password after first login!${NC}"
    echo ""
    echo -e "${GREEN}  Thank you for installing StellarStack!${NC}"
    echo -e "${GRAY}  Documentation: https://docs.stellarstack.app${NC}"
    echo -e "${GRAY}  Discord: https://discord.gg/stellarstack${NC}"
    echo ""
}

# Read single keypress
read_key() {
    local key
    IFS= read -rsn1 key 2>/dev/null >&2

    # Handle escape sequences (arrow keys)
    if [[ $key == $'\x1b' ]]; then
        read -rsn2 -t 0.1 key 2>/dev/null >&2
        case $key in
            '[A') echo "UP" ;;
            '[B') echo "DOWN" ;;
            *) echo "ESC" ;;
        esac
    elif [[ $key == "" ]]; then
        echo "ENTER"
    elif [[ $key == " " ]]; then
        echo "SPACE"
    else
        echo "$key"
    fi
}

# Toggle service selection
toggle_service() {
    local service="${service_order[$current_selection]}"
    if [ "${services[$service]}" -eq 1 ]; then
        services[$service]=0
    else
        services[$service]=1
    fi
}

# Select all services
select_all() {
    for service in "${service_order[@]}"; do
        services[$service]=1
    done
}

# Deselect all services
select_none() {
    for service in "${service_order[@]}"; do
        services[$service]=0
    done
}

# Main loop
main() {
    # When piped, we need to reassign stdin to the terminal
    if [ ! -t 0 ]; then
        exec < /dev/tty
    fi

    # Check if we have a terminal now
    if [ ! -t 0 ]; then
        echo "This script must be run in a terminal."
        exit 1
    fi

    # Hide cursor
    tput civis 2>/dev/null || true

    # Restore cursor on exit
    trap 'tput cnorm 2>/dev/null || true; echo ""' EXIT

    while true; do
        case $current_step in
            "welcome")
                show_welcome
                key=$(read_key)
                case $key in
                    "ENTER") current_step="services" ;;
                    "q"|"Q") exit 0 ;;
                esac
                ;;
            "services")
                show_services
                key=$(read_key)
                case $key in
                    "UP")
                        ((current_selection--))
                        if [ $current_selection -lt 0 ]; then
                            current_selection=$((${#service_order[@]} - 1))
                        fi
                        ;;
                    "DOWN")
                        ((current_selection++))
                        if [ $current_selection -ge ${#service_order[@]} ]; then
                            current_selection=0
                        fi
                        ;;
                    "SPACE") toggle_service ;;
                    "ENTER") current_step="config" ;;
                    "a"|"A") select_all ;;
                    "n"|"N") select_none ;;
                    "q"|"Q") exit 0 ;;
                    "b"|"B") current_step="welcome" ;;
                esac
                ;;
            "config")
                show_configuration
                key=$(read_key)
                case $key in
                    "ENTER") current_step="install" ;;
                    "b"|"B") current_step="services" ;;
                    "q"|"Q") exit 0 ;;
                esac
                ;;
            "install")
                show_installation
                current_step="complete"
                ;;
            "complete")
                show_complete
                key=$(read_key)
                exit 0
                ;;
        esac
    done
}

# Run
main
