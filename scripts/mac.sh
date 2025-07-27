#!/bin/bash
 
set -euo pipefail
ARCH=$(uname -m)
if [[ "$ARCH" == "arm64" ]]; then
    TOOL_URL="https://cli-src.webdock.tech/dl/mac-arm/webdock"
elif [[ "$ARCH" == "x86_64" ]]; then
    TOOL_URL="https://cli-src.webdock.tech/dl/mac-x64/webdock"
else
    echo "Error: Unsupported architecture: $ARCH"
    echo "This script supports Intel (x86_64) and Apple Silicon (arm64) Macs only."
    exit 1
fi

APP_NAME="webdock"                                  
INSTALL_DIR="/usr/local/bin"
INSTALL_PATH="$INSTALL_DIR/$APP_NAME"

echo "Starting installation of '$APP_NAME' for macOS ($ARCH)..."
if [[ "$(uname)" != "Darwin" ]]; then
    echo "Error: This script is designed for macOS only."
    echo "Detected OS: $(uname)"
    exit 1
fi
if [ "$(id -u)" -ne 0 ]; then
    echo "This script must be run with sudo or as root."
    echo "Please try again with: sudo $0"
    exit 1
fi
if ! command -v curl &> /dev/null; then
    echo "Error: curl is not installed. Please install it to continue."
    echo "You can install it using Homebrew: brew install curl"
    exit 1
fi
if [ ! -d "$INSTALL_DIR" ]; then
    echo "Creating installation directory '$INSTALL_DIR'..."
    mkdir -p "$INSTALL_DIR"
fi
echo "Downloading '$APP_NAME' from '$TOOL_URL' to '$INSTALL_PATH'..."
if ! curl -fsSL "$TOOL_URL" -o "$INSTALL_PATH"; then
    echo "Error: Failed to download the binary. Please check the URL and your connection."
    echo "Attempted URL: $TOOL_URL"
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
    echo "You will need to add it to your shell's configuration file."
    echo ""
    echo "For bash (add to ~/.bash_profile or ~/.bashrc):"
    echo "export PATH=\$PATH:$INSTALL_DIR"
    echo ""
    echo "For zsh (add to ~/.zshrc):"
    echo "export PATH=\$PATH:$INSTALL_DIR"
    echo ""
    echo "Then, restart your terminal or run 'source ~/.zshrc' (or ~/.bash_profile)."
else
    echo "'$INSTALL_DIR' is already in your PATH."
fi
echo ""
echo "Installation of '$APP_NAME' is complete!"
echo "You should now be able to run '$APP_NAME' from your terminal."
echo ""
echo "Note: If macOS shows a security warning about an unidentified developer,"
echo "you can allow it by going to System Preferences > Security & Privacy > General"
echo "and clicking 'Allow Anyway' next to the blocked app message."
echo ""
echo "If the command is not found, please start a new terminal session."
