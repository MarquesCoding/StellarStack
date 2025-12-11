#!/bin/bash

# StellarStack Installer
# https://github.com/MarquesCoding/StellarStack
# This is a mock installer for demonstration purposes

# Colors - Old school terminal green (Alien/Nostromo style)
GREEN='\033[0;32m'
BRIGHT_GREEN='\033[1;32m'
DIM_GREEN='\033[2;32m'
NC='\033[0m' # No Color
BOLD='\033[1m'
DIM='\033[2m'

# Alias colors to green palette for retro terminal look
PRIMARY="${BRIGHT_GREEN}"
SECONDARY="${GREEN}"
MUTED="${DIM_GREEN}"
HIGHLIGHT="${BRIGHT_GREEN}${BOLD}"

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

# Domain configuration
panel_domain=""
api_domain=""
node_domain=""

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
    echo -e "${PRIMARY}"
    cat << 'EOF'

 ______     ______   ______     __         __         ______     ______     ______     ______   ______     ______     __  __
/\  ___\   /\__  _\ /\  ___\   /\ \       /\ \       /\  __ \   /\  == \   /\  ___\   /\__  _\ /\  __ \   /\  ___\   /\ \/ /
\ \___  \  \/_/\ \/ \ \  __\   \ \ \____  \ \ \____  \ \  __ \  \ \  __<   \ \___  \  \/_/\ \/ \ \  __ \  \ \ \____  \ \  _"-.
 \/\_____\    \ \_\  \ \_____\  \ \_____\  \ \_____\  \ \_\ \_\  \ \_\ \_\  \/\_____\    \ \_\  \ \_\ \_\  \ \_____\  \ \_\ \_\
  \/_____/     \/_/   \/_____/   \/_____/   \/_____/   \/_/\/_/   \/_/ /_/   \/_____/     \/_/   \/_/\/_/   \/_____/   \/_/\/_/

EOF
    echo -e "${NC}"
    echo -e "${MUTED}  ════════════════════════════════════════════════════════════════════════════════════════════════════════${NC}"
    echo -e "${SECONDARY}  INTERFACE 2037 // WEYLAND-YUTANI CORP // GAME SERVER MANAGEMENT SYSTEM${NC}"
    echo -e "${MUTED}  ════════════════════════════════════════════════════════════════════════════════════════════════════════${NC}"
    echo ""
}

# Show welcome screen
show_welcome() {
    clear_screen
    echo -e "${PRIMARY}  > INITIALIZATION SEQUENCE${NC}"
    echo ""
    echo -e "${SECONDARY}  This installer will help you set up StellarStack on your server.${NC}"
    echo -e "${SECONDARY}  You'll be able to choose which components to install.${NC}"
    echo ""
    echo -e "${MUTED}  ────────────────────────────────────────────────────────────${NC}"
    echo ""
    echo -e "${PRIMARY}  SYSTEM REQUIREMENTS:${NC}"
    echo -e "${SECONDARY}    > Ubuntu 20.04+ / Debian 11+${NC}"
    echo -e "${SECONDARY}    > 2GB RAM minimum (4GB recommended)${NC}"
    echo -e "${SECONDARY}    > 20GB disk space${NC}"
    echo -e "${SECONDARY}    > Docker & Docker Compose${NC}"
    echo ""
    echo -e "${MUTED}  ────────────────────────────────────────────────────────────${NC}"
    echo ""
    echo -e "${SECONDARY}  Press ${PRIMARY}[ENTER]${SECONDARY} to continue or ${PRIMARY}[Q]${SECONDARY} to abort${NC}"
}

# Show service selection
show_services() {
    clear_screen
    echo -e "${PRIMARY}  > MODULE SELECTION${NC}"
    echo ""
    echo -e "${SECONDARY}  Use ${PRIMARY}↑/↓${SECONDARY} to navigate, ${PRIMARY}[SPACE]${SECONDARY} to toggle, ${PRIMARY}[ENTER]${SECONDARY} to confirm${NC}"
    echo ""
    echo -e "${MUTED}  ────────────────────────────────────────────────────────────${NC}"
    echo ""

    local i=0
    for service in "${service_order[@]}"; do
        local name="${service_names[$service]}"
        local selected="${services[$service]}"

        if [ $i -eq $current_selection ]; then
            echo -ne "${PRIMARY}  > ${NC}"
        else
            echo -ne "    "
        fi

        if [ "$selected" -eq 1 ]; then
            echo -e "${PRIMARY}[■]${NC} ${PRIMARY}${name}${NC}"
        else
            echo -e "${MUTED}[ ]${NC} ${MUTED}${name}${NC}"
        fi

        ((i++))
    done

    echo ""
    echo -e "${MUTED}  ────────────────────────────────────────────────────────────${NC}"
    echo ""

    # Show selected count
    local count=0
    for service in "${service_order[@]}"; do
        if [ "${services[$service]}" -eq 1 ]; then
            ((count++))
        fi
    done
    echo -e "${SECONDARY}  ${count} module(s) selected${NC}"
    echo ""
    echo -e "${SECONDARY}  ${PRIMARY}[SPACE]${SECONDARY} Toggle  ${PRIMARY}[ENTER]${SECONDARY} Continue  ${PRIMARY}[A]${SECONDARY} Select All  ${PRIMARY}[N]${SECONDARY} Select None${NC}"
}

# Show configuration screen
show_configuration() {
    clear_screen
    echo -e "${PRIMARY}  > CONFIGURATION SUMMARY${NC}"
    echo ""
    echo -e "${SECONDARY}  The following modules will be installed:${NC}"
    echo ""
    echo -e "${MUTED}  ────────────────────────────────────────────────────────────${NC}"
    echo ""

    for service in "${service_order[@]}"; do
        if [ "${services[$service]}" -eq 1 ]; then
            echo -e "  ${PRIMARY}■${NC} ${PRIMARY}${service_names[$service]}${NC}"
        fi
    done

    echo ""
    echo -e "${MUTED}  ────────────────────────────────────────────────────────────${NC}"
    echo ""
    echo -e "${SECONDARY}  Installation Directory:${NC} ${PRIMARY}/opt/stellarstack${NC}"
    echo -e "${SECONDARY}  Docker Network:${NC} ${PRIMARY}stellarstack${NC}"
    echo -e "${SECONDARY}  Default Port:${NC} ${PRIMARY}3000${NC}"
    echo ""
    echo -e "${MUTED}  ────────────────────────────────────────────────────────────${NC}"
    echo ""
    echo -e "${SECONDARY}  Press ${PRIMARY}[ENTER]${SECONDARY} to continue or ${PRIMARY}[B]${SECONDARY} to go back${NC}"
}

# Show domain configuration screen
show_domains() {
    clear_screen
    echo -e "${PRIMARY}  > NETWORK CONFIGURATION${NC}"
    echo ""
    echo -e "${SECONDARY}  Configure domain names for your services (used with Traefik).${NC}"
    echo ""
    echo -e "${MUTED}  ────────────────────────────────────────────────────────────${NC}"
    echo ""

    # Panel domain
    echo -e "${SECONDARY}  Panel Domain ${MUTED}(e.g., panel.example.com)${NC}"
    echo -ne "  ${PRIMARY}>${NC} "
    read -r panel_domain </dev/tty
    if [ -z "$panel_domain" ]; then
        panel_domain="panel.localhost"
    fi
    echo ""

    # API domain
    echo -e "${SECONDARY}  API Domain ${MUTED}(e.g., api.example.com)${NC}"
    echo -ne "  ${PRIMARY}>${NC} "
    read -r api_domain </dev/tty
    if [ -z "$api_domain" ]; then
        api_domain="api.localhost"
    fi
    echo ""

    # Node domain (only if rust_daemon is selected)
    if [ "${services["rust_daemon"]}" -eq 1 ]; then
        echo -e "${SECONDARY}  Node Domain ${MUTED}(e.g., node1.example.com)${NC}"
        echo -ne "  ${PRIMARY}>${NC} "
        read -r node_domain </dev/tty
        if [ -z "$node_domain" ]; then
            node_domain="node.localhost"
        fi
        echo ""
    fi

    echo -e "${MUTED}  ────────────────────────────────────────────────────────────${NC}"
    echo ""
    echo -e "${SECONDARY}  Press ${PRIMARY}[ENTER]${SECONDARY} to continue or ${PRIMARY}[B]${SECONDARY} to go back${NC}"
}

# Show installation progress (mock)
show_installation() {
    clear_screen
    echo -e "${PRIMARY}  > DEPLOYING MODULES${NC}"
    echo ""
    echo -e "${SECONDARY}  Please wait while we set up your services...${NC}"
    echo ""
    echo -e "${MUTED}  ────────────────────────────────────────────────────────────${NC}"
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
        echo -ne "  ${MUTED}[ ]${NC} ${MUTED}${task}...${NC}"
        sleep 0.5
        echo -e "\r  ${PRIMARY}[■]${NC} ${PRIMARY}${task}${NC}    "
    done

    echo ""
    echo -e "${MUTED}  ────────────────────────────────────────────────────────────${NC}"
    echo ""
    sleep 0.5
}

# Show completion screen
show_complete() {
    clear_screen
    echo -e "${PRIMARY}  > DEPLOYMENT COMPLETE${NC}"
    echo ""
    echo -e "${SECONDARY}  StellarStack has been successfully installed.${NC}"
    echo ""
    echo -e "${MUTED}  ────────────────────────────────────────────────────────────${NC}"
    echo ""
    echo -e "${PRIMARY}  ACCESS POINTS:${NC}"
    echo ""
    if [ "${services["traefik"]}" -eq 1 ] && [ -n "$panel_domain" ]; then
        echo -e "    ${PRIMARY}>${NC}  Panel:     ${PRIMARY}https://${panel_domain}${NC}"
        echo -e "    ${PRIMARY}>${NC}  API:       ${PRIMARY}https://${api_domain}${NC}"
        if [ "${services["rust_daemon"]}" -eq 1 ] && [ -n "$node_domain" ]; then
            echo -e "    ${PRIMARY}>${NC}  Node:      ${PRIMARY}https://${node_domain}${NC}"
        fi
        echo -e "    ${PRIMARY}>${NC}  Traefik:   ${PRIMARY}http://localhost:8080${NC}"
    else
        echo -e "    ${PRIMARY}>${NC}  Panel:     ${PRIMARY}http://localhost:3000${NC}"
        echo -e "    ${PRIMARY}>${NC}  API:       ${PRIMARY}http://localhost:3001${NC}"
    fi
    if [ "${services["grafana"]}" -eq 1 ]; then
        echo -e "    ${PRIMARY}>${NC}  Grafana:   ${PRIMARY}http://localhost:3002${NC}"
    fi
    echo ""
    echo -e "${MUTED}  ────────────────────────────────────────────────────────────${NC}"
    echo ""
    echo -e "${PRIMARY}  DEFAULT CREDENTIALS:${NC}"
    echo ""
    echo -e "    ${SECONDARY}Email:${NC}    ${PRIMARY}admin@stellarstack.app${NC}"
    echo -e "    ${SECONDARY}Password:${NC} ${PRIMARY}changeme123${NC}"
    echo ""
    echo -e "${MUTED}  ────────────────────────────────────────────────────────────${NC}"
    echo ""
    echo -e "${PRIMARY}  SYSTEM COMMANDS:${NC}"
    echo ""
    echo -e "    ${SECONDARY}cd /opt/stellarstack${NC}"
    echo -e "    ${SECONDARY}docker compose ps${NC}        ${MUTED}# View running services${NC}"
    echo -e "    ${SECONDARY}docker compose logs -f${NC}   ${MUTED}# View logs${NC}"
    echo -e "    ${SECONDARY}docker compose down${NC}      ${MUTED}# Stop services${NC}"
    echo -e "    ${SECONDARY}docker compose up -d${NC}     ${MUTED}# Start services${NC}"
    echo ""
    echo -e "${MUTED}  ────────────────────────────────────────────────────────────${NC}"
    echo ""
    echo -e "${PRIMARY}  WARNING: Change your password after first login!${NC}"
    echo ""
    echo -e "${SECONDARY}  Thank you for installing StellarStack!${NC}"
    echo -e "${MUTED}  Documentation: https://docs.stellarstack.app${NC}"
    echo -e "${MUTED}  Discord: https://discord.gg/stellarstack${NC}"
    echo ""
}

# Read single keypress from terminal
read_key() {
    local key

    # Read directly from terminal
    IFS= read -rsn1 key </dev/tty

    # Handle escape sequences (arrow keys)
    if [[ $key == $'\x1b' ]]; then
        read -rsn2 -t 0.1 key </dev/tty
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
                        current_selection=$((current_selection - 1))
                        if [ $current_selection -lt 0 ]; then
                            current_selection=$((${#service_order[@]} - 1))
                        fi
                        ;;
                    "DOWN")
                        current_selection=$((current_selection + 1))
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
                    "ENTER")
                        # If Traefik is selected, go to domain config, otherwise install
                        if [ "${services["traefik"]}" -eq 1 ]; then
                            current_step="domains"
                        else
                            current_step="install"
                        fi
                        ;;
                    "b"|"B") current_step="services" ;;
                    "q"|"Q") exit 0 ;;
                esac
                ;;
            "domains")
                # Show cursor for text input
                tput cnorm 2>/dev/null || true
                show_domains
                # Hide cursor again
                tput civis 2>/dev/null || true
                key=$(read_key)
                case $key in
                    "ENTER") current_step="install" ;;
                    "b"|"B") current_step="config" ;;
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
