#!/bin/bash

# curl -fsSL 'URL_TO_YOUR_INSTALLER.SH' | sudo bash


# installer.sh - Script to be hosted online
# Use strict mode
set -euo pipefail

# --- CONFIGURATION ---
TOOL_URL="https://cli.vps.webdock.cloud/dl/linux/webdock" # <--- IMPORTANT: URL of the binary to download
APP_NAME="webdock"                                    # <--- The name you want for the command
# --- END CONFIGURATION ---

# --- SCRIPT LOGIC ---
INSTALL_DIR="/usr/local/bin"
INSTALL_PATH="$INSTALL_DIR/$APP_NAME"

echo "Starting installation of '$APP_NAME'..."

# 1. Check for root/sudo privileges
if [ "$(id -u)" -ne 0 ]; then
    echo "This script must be run with sudo or as root."
    echo "Please try again with: sudo $0"
    exit 1
fi

# 2. Check for curl dependency
if ! command -v curl &> /dev/null; then
    echo "Error: curl is not installed. Please install it to continue."
    exit 1
fi

# 3. Download the binary to the installation path
echo "Downloading '$APP_NAME' from '$TOOL_URL' to '$INSTALL_PATH'..."
if ! curl -fsSL "$TOOL_URL" -o "$INSTALL_PATH"; then
    echo "Error: Failed to download the binary. Please check the URL and your connection."
    exit 1
fi
echo "Download complete."

# 4. Make the binary executable
echo "Setting execute permissions on '$INSTALL_PATH'..."
if ! chmod +x "$INSTALL_PATH"; then
    echo "Error: Failed to set execute permissions on the file."
    # Clean up the downloaded file on failure
    rm -f "$INSTALL_PATH"
    exit 1
fi

# 5. Verify the directory is in the system's PATH
# (This is more of a check, as /usr/local/bin is almost always in the PATH)
if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
    echo ""
    echo "WARNING: The installation directory '$INSTALL_DIR' is not in your system's PATH."
    echo "You will need to add it to your shell's configuration file (e.g., ~/.bashrc, ~/.zshrc) by adding the line:"
    echo "export PATH=\$PATH:$INSTALL_DIR"
    echo "Then, restart your shell or run 'source ~/.bashrc'."
else
    echo "'$INSTALL_DIR' is already in your PATH."
fi

echo ""
echo "Installation of '$APP_NAME' is complete!"
echo "You should now be able to run '$APP_NAME' from your terminal."
echo "If the command is not found, please start a new terminal session."
