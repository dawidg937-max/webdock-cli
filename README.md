# Webdock CLI
<img src="assets/webdock-cli-logo.svg" alt="Webdock CLI Logo" style="width:100%;border-radius:10px">
The official command-line interface for managing your Webdock.io resources.

webdock-cli allows you to manage servers, SSH keys, events, and more directly from your terminal, making it easy to script, automate, and integrate your Webdock infrastructure into your workflows.

## Prerequisites
Before you can use webdock-cli, you need a Webdock API Token.

You can generate an API token from your Webdock account dashboard in the API Tokens section.

## Installation

### Linux
You can install webdock-cli using our convenient installer script. It will download the latest binary for your system and place it in /usr/local/bin.
```bash
curl -fsSL 'http://cli.vps.webdock.cloud/install/linux.sh' | sudo bash
```
 
### Windows (PowerShell)
For Windows, run the following command in an administrator PowerShell terminal. This will download and execute the installer script.

 
```powershell
irm 'http://cli.vps.webdock.cloud/install/windows.ps1' | iex
```

### MacOS
```macos
curl -fsSL 'http://cli.vps.webdock.cloud/install/mac.sh' | sudo bash
```

## Configuration
```bash
webdock init --token <you-api-token-here>
```

## Help 
```bash
webdock --help
```


## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue to report a bug or suggest a new feature.


