#!/bin/bash

set -euo pipefail
TOOL_URL="https://cli-src.webdock.tech/dl/linux/webdock" 
APP_NAME="webdock"                                    
INSTALL_DIR="/usr/local/bin"
INSTALL_PATH="$INSTALL_DIR/$APP_NAME"


echo "Starting installation of '$APP_NAME'..."
if [ "$(id -u)" -ne 0 ]; then
    echo "This script must be run with sudo or as root."
    echo "Please try again with: sudo $0"
    exit 1
fi


if ! command -v curl &> /dev/null; then
    echo "Error: curl is not installed. Please install it to continue."
    exit 1
fi

echo "Downloading '$APP_NAME' from '$TOOL_URL' to '$INSTALL_PATH'..."
if ! curl -fsSL "$TOOL_URL" -o "$INSTALL_PATH"; then
    echo "Error: Failed to download the binary. Please check the URL and your connection."
    exit 1
fi
echo "Download complete."


echo "Setting execute permissions on '$INSTALL_PATH'..."
if ! chmod +x "$INSTALL_PATH"; then
    echo "Error: Failed to set execute permissions on the file."
    
    rm -f "$INSTALL_PATH"
    exit 1
fi



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
