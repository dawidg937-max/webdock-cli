


$ToolUrl = "https://cli-src.webdock.tech/dl/windows/webdock.exe" 
$AppName = "Webdock.io"                                
$ToolFileName = "webdock.exe"                           


function Ensure-Admin {
    if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
        Write-Warning "Administrator privileges are required for this installation."
        Write-Host "This script needs admin privileges to:"
        Write-Host "- Create directories in Program Files"
        Write-Host "- Modify system PATH environment variable"
        Write-Host ""
        Write-Host "Please run this script as Administrator to continue."
        Write-Host "Script execution stopped."
        Write-Host ""
        Write-Host "Press any key to exit..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        exit 1
    }
}



Ensure-Admin

Write-Host "Starting installation of $AppName..."


$InstallDir = Join-Path $env:ProgramFiles $AppName
$ToolFullPath = Join-Path $InstallDir $ToolFileName


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


Write-Host "Downloading '$ToolFileName' from '$ToolUrl' to '$ToolFullPath'..."
try {
    Invoke-WebRequest -Uri $ToolUrl -OutFile $ToolFullPath -ErrorAction Stop
    Write-Host "Download complete."
} catch {
    Write-Error "Failed to download '$ToolFileName'. Error: $($_.Exception.Message)"
    
    
    exit 1
}


Write-Host "Adding '$InstallDir' to system PATH variable..."
try {
    $CurrentSystemPath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
    if ($CurrentSystemPath -notlike "*$($InstallDir -replace '\\', '\\\\')*") { 
        $NewSystemPath = "$CurrentSystemPath;$InstallDir".TrimEnd(';') 
        [System.Environment]::SetEnvironmentVariable("Path", $NewSystemPath, "Machine")
        Write-Host "'$InstallDir' added to system PATH. You may need to restart your terminal or log out/in for changes to take full effect everywhere."

        
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
Write-Host "This window will be closed in 5 seconds"

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
exit 1