# installer.ps1 - Script to be hosted online

# --- CONFIGURATION ---
$ToolUrl = "https://cli.vps.webdock.cloud/dl/windows/webdock.exe" # <--- IMPORTANT: URL of the executable to download
$AppName = "Webdock.io"                                # <--- Name for the folder in Program Files
$ToolFileName = "webdock.exe"                           # <--- Filename for the downloaded tool (can be same as in URL)
# --- END CONFIGURATION ---

# Function to check for Admin privileges and elevate if necessary
function Ensure-Admin {
    if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
        Write-Warning "Administrator privileges are required. Attempting to elevate..."
        Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
        exit
    }
}

# Ensure we are running as Administrator
Ensure-Admin

Write-Host "Starting installation of $AppName..."

# 1. Define Installation Path
$InstallDir = Join-Path $env:ProgramFiles $AppName
$ToolFullPath = Join-Path $InstallDir $ToolFileName

# 2. Create Installation Directory if it doesn't exist
if (-not (Test-Path $InstallDir)) {
    Write-Host "Creating directory: $InstallDir"
    try {
        New-Item -ItemType Directory -Path $InstallDir -Force -ErrorAction Stop | Out-Null
        Write-Host "Directory created."
    } catch {
        Write-Error "Failed to create directory '$InstallDir'. Error: $($_.Exception.Message)"
        exit 1
    }
} else {
    Write-Host "Directory '$InstallDir' already exists."
}

# 3. Download the tool
Write-Host "Downloading '$ToolFileName' from '$ToolUrl' to '$ToolFullPath'..."
try {
    Invoke-WebRequest -Uri $ToolUrl -OutFile $ToolFullPath -ErrorAction Stop
    Write-Host "Download complete."
} catch {
    Write-Error "Failed to download '$ToolFileName'. Error: $($_.Exception.Message)"
    # Optional: Clean up created directory if download fails
    # Remove-Item -Path $InstallDir -Recurse -Force -ErrorAction SilentlyContinue
    exit 1
}

# 4. Add Installation Directory to System PATH (Persistently)
Write-Host "Adding '$InstallDir' to system PATH variable..."
try {
    $CurrentSystemPath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
    if ($CurrentSystemPath -notlike "*$($InstallDir -replace '\\', '\\\\')*") { # Check if not already present (escape backslashes for regex-like -like)
        $NewSystemPath = "$CurrentSystemPath;$InstallDir".TrimEnd(';') # Ensure no trailing semicolon if current path was empty
        [System.Environment]::SetEnvironmentVariable("Path", $NewSystemPath, "Machine")
        Write-Host "'$InstallDir' added to system PATH. You may need to restart your terminal or log out/in for changes to take full effect everywhere."

        # Update current session's PATH as well
        $env:Path += ";$InstallDir"
        Write-Host "PATH updated for the current session."
    } else {
        Write-Host "'$InstallDir' is already in the system PATH."
    }
} catch {
    Write-Error "Failed to update system PATH. Error: $($_.Exception.Message). This usually requires Administrator privileges (which should have been handled)."
    exit 1
}

Write-Host "Installation of '$AppName' ($ToolFileName) complete!"
Write-Host "You should now be able to run '$ToolFileName' from a new command prompt."
Write-Host "If it doesn't work in a new prompt, try restarting your computer."

# Optional: Wait for a key press before exiting, useful if run directly
# Read-Host "Press Enter to exit"
