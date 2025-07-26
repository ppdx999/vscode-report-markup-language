# WSL2 Support for RML PDF Preview

The VSCode RML extension automatically detects WSL2 environments and provides seamless integration with Windows applications for PDF viewing.

## How It Works

When you click "Open External" in the PDF preview:

1. **WSL2 Detection**: Extension automatically detects if running in WSL2
2. **Path Conversion**: Converts WSL2 paths (e.g., `/tmp/file.pdf`) to Windows paths (e.g., `\\wsl.localhost\Ubuntu\tmp\file.pdf`)
3. **Windows Integration**: Opens the PDF using Windows applications

## Supported Windows Applications

The extension tries these Windows applications in order:

1. **Windows Explorer** (`explorer.exe`) - Opens with default PDF viewer
2. **PowerShell Start** (`powershell.exe -c "start"`) - System default handler
3. **Command Prompt Start** (`cmd.exe /c start`) - Fallback method

## Requirements

- WSL2 environment
- Windows 10/11 with default PDF viewer (Edge, Adobe Reader, etc.)
- `wslpath` command available (included in WSL2)

## Troubleshooting

### "No supported application found"
This error should no longer occur with WSL2 auto-detection. If it does:

1. Verify you're in WSL2: `cat /proc/version` should show "microsoft" or "WSL2"
2. Test path conversion: `wslpath -w /tmp` should return a Windows path
3. Check Windows PDF viewer: Try opening a PDF file in Windows Explorer

### PDF doesn't open
If the PDF doesn't open in Windows:

1. Check Windows default PDF viewer settings
2. Try installing a PDF viewer (Edge browser is usually available)
3. Use the "Copy Path" option and open manually in Windows

### Path Issues
- WSL2 files are accessible from Windows at `\\wsl.localhost\Ubuntu\`
- Temporary preview files are in `/tmp/vscode-rml-preview/`
- Exported PDFs remain in your workspace directory

## Benefits

- **Seamless Integration**: No need to manually copy files to Windows
- **Japanese Font Support**: Windows PDF viewers handle CJK fonts correctly
- **Native Performance**: Uses Windows' optimized PDF rendering
- **Default Applications**: Respects your Windows PDF viewer preferences

## Example Workflow

1. Edit RML file in WSL2 VSCode
2. Right-click → "Preview as PDF"
3. Click "Open External" in preview panel
4. PDF opens automatically in Windows default viewer with proper Japanese font rendering