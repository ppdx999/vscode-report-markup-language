# VSCode RML Extension

Rich RML (Report Markup Language) support for Visual Studio Code with automatic Japanese font handling and PDF export capabilities.

## Features

- 🎨 **Syntax Highlighting**: Full RML syntax highlighting with keywords, strings, and comments
- 📄 **PDF Export**: Convert RML files to PDF with a simple right-click
- 🌏 **Japanese Font Support**: Automatic CJK font registration (no setup required)
- 🔧 **Language Configuration**: Auto-closing brackets, comments, and intelligent pairing
- 📁 **Context Menus**: Right-click RML files for quick PDF export

## PDF Preview

This extension focuses purely on RML to PDF conversion. For viewing PDFs, we recommend installing a dedicated PDF viewer extension:

**Recommended: [PDF Viewer (vscode-pdf)](https://marketplace.visualstudio.com/items?itemName=tomoki1207.pdf)**
- Excellent Japanese/CJK font support
- Clean, fast PDF viewing in VSCode
- Perfect integration with exported RML files

## Installation

1. Install the extension from the VSCode marketplace
2. **Recommended**: Install [PDF Viewer (vscode-pdf)](https://marketplace.visualstudio.com/items?itemName=tomoki1207.pdf) for viewing PDFs
3. Ensure Python 3 is installed and available in your PATH
4. Install the required Python package: `pip install trml2pdf`

## Usage

### Basic Workflow

1. Create or open an `.rml` file
2. Write your RML content with syntax highlighting
3. Right-click the file and select **"Export to PDF"**
4. PDF is generated in the same directory as your RML file
5. **Optional**: Open the generated PDF with vscode-pdf extension for preview

### Example RML File

```xml
<?xml version="1.0" encoding="utf-8" standalone="no" ?>
<!DOCTYPE document SYSTEM "rml.dtd">
<document filename="example.pdf">

<template>
    <pageTemplate id="main">
        <frame id="main" x1="72" y1="72" width="451" height="698"/>
    </pageTemplate>
</template>

<stylesheet>
    <paraStyle name="title" fontName="Helvetica-Bold" fontSize="18" alignment="center"/>
    <paraStyle name="body" fontName="Helvetica" fontSize="12" alignment="left"/>
</stylesheet>

<story>
    <para style="title">My Report</para>
    <spacer length="20"/>
    <para style="body">This is the content of my report.</para>
</story>

</document>
```

## Japanese Font Support

The extension automatically registers common CJK (Chinese, Japanese, Korean) fonts for seamless international text support.

### Automatically Registered Fonts

When you export RML files, these CID fonts are automatically registered:

- **HeiseiMin-W3** - Japanese Mincho (serif)
- **HeiseiKakuGo-W5** - Japanese Gothic (sans-serif)  
- **STSong-Light** - Chinese Simplified
- **MSung-Light** - Chinese Traditional
- **HYGoThic-Medium** - Korean

### Usage in RML

Simply specify the font name in your stylesheet - no `<docinit>` tags required:

```xml
<stylesheet>
    <paraStyle name="japanese-serif" 
               fontName="HeiseiMin-W3" 
               fontSize="12"/>
    
    <paraStyle name="japanese-sans" 
               fontName="HeiseiKakuGo-W5" 
               fontSize="12"/>
</stylesheet>

<story>
    <para style="japanese-serif">これは明朝体のテキストです。</para>
    <para style="japanese-sans">これはゴシック体のテキストです。</para>
    <para style="japanese-serif">漢字、ひらがな、カタカナの混在テスト</para>
</story>
```

### No Manual Setup Required

- ✅ **Automatic Registration**: Fonts are registered automatically during PDF generation
- ✅ **Cross-Platform**: Works on Windows, macOS, and Linux without font file paths
- ✅ **Graceful Fallback**: Silently skips unavailable fonts
- ✅ **UTF-8 Support**: Full Unicode character support

## WSL2 Development

The extension works perfectly in WSL2 environments. Combined with vscode-pdf extension, you get seamless PDF viewing.

### Recommended Setup

1. Install this RML extension in WSL2 VSCode
2. Install vscode-pdf extension for PDF viewing
3. Export RML files and view them directly in VSCode

### Benefits

- 🌏 **Perfect Font Rendering**: vscode-pdf handles Japanese fonts excellently
- 🔄 **No Path Issues**: Everything stays within VSCode/WSL2
- 🖥️ **Unified Workflow**: Edit RML → Export PDF → View PDF all in one place

## Sample Files

The extension includes sample RML files:

- `sample/helloworld.rml` - Basic RML structure
- `sample/japanese-test.rml` - Japanese font examples
- `sample/table-helloworld.rml` - Table layouts
- `sample/style-helloworld.rml` - Styling examples

## Requirements

### System Requirements

- Visual Studio Code 1.74.0 or higher
- Python 3.x installed and available in PATH
- `trml2pdf` Python package

### Installation Commands

```bash
# Install Python dependencies
pip install trml2pdf

# Verify installation
python -c "import trml2pdf; print('RML support ready!')"
```

## Commands

The extension provides the following command:

- **RML: Export to PDF** (`rml.exportToPdf`) - Convert RML file to PDF

Available in:
- Command Palette (`Ctrl+Shift+P`)
- Right-click context menu on `.rml` files
- Editor context menu when viewing RML files

After export, you can open the generated PDF with the vscode-pdf extension for immediate preview.

## Configuration

The extension works out of the box with no configuration required. It automatically:

- Detects your Python installation
- Registers CJK fonts for international text
- Handles cross-platform path differences
- Integrates with your system's PDF viewer

## Troubleshooting

### Common Issues

**"Python not found"**
- Ensure Python 3 is installed and in your PATH
- Try `python --version` or `python3 --version` in your terminal

**"Missing Python dependencies"**
- Install the required package: `pip install trml2pdf`
- For Python 3: `pip3 install trml2pdf`

**"Japanese text not displaying"**
- The extension automatically handles CJK fonts
- Ensure your RML file is saved with UTF-8 encoding
- Check that your system supports the specified CID fonts

**PDF Viewing Issues**
- Install the recommended vscode-pdf extension for best PDF viewing experience
- Ensure your PDF viewer supports Japanese/CJK fonts if needed

### Debug Information

The extension logs conversion progress to the Developer Console:
1. Press `Ctrl+Shift+P`
2. Type "Developer: Toggle Developer Tools"
3. Check the Console tab for debug output

## Development

### Building the Extension

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch
```

### Project Structure

```
vscode-report-markup-language/
├── src/
│   └── extension.ts          # Main extension logic
├── scripts/
│   └── rml2pdf.py           # Python RML converter
├── syntaxes/
│   └── rml.tmLanguage.json  # Syntax highlighting rules
├── sample/                   # Example RML files
├── package.json             # Extension manifest
└── README.md               # This file
```

## Contributing

Contributions are welcome! Please feel free to:

- Report bugs and issues
- Request new features
- Submit pull requests
- Improve documentation

## License

This extension is released under the MIT License.

## Changelog

### Latest Changes

- ✅ Simplified to export-only functionality for better reliability
- ✅ Automatic CJK font registration without manual configuration
- ✅ Enhanced WSL2 support with seamless Windows integration
- ✅ Comprehensive syntax highlighting for RML files
- ✅ Right-click context menu integration

---

**Enjoy creating beautiful PDFs with RML!** 🎉