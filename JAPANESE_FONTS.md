# Japanese Font Support in RML

The VSCode RML extension automatically registers common CJK (Chinese, Japanese, Korean) fonts for your convenience.

## Automatically Registered Fonts

When you export or preview RML files, these CID fonts are automatically registered:

- **HeiseiMin-W3** - Japanese Mincho (serif)
- **HeiseiKakuGo-W5** - Japanese Gothic (sans-serif)  
- **STSong-Light** - Chinese Simplified
- **MSung-Light** - Chinese Traditional
- **HYGoThic-Medium** - Korean

## Usage in RML

Simply specify the font name in your stylesheet:

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
</story>
```

## No `<docinit>` Required

Unlike traditional RML usage, you **don't need** to add `<docinit>` tags or worry about font file paths. The extension handles font registration automatically.

## Font Availability

- Font availability depends on your system
- The converter will silently skip unavailable fonts
- Check the conversion output for "Registered CID fonts" message
- If no fonts are registered, you'll see a warning message

## Example Files

See `sample/japanese-test.rml` for a complete example of Japanese text rendering.

## Preview vs Export Differences

⚠️ **Important**: Japanese fonts work differently in preview vs export:

- **Export to PDF**: Full Japanese font support ✅
- **In-VSCode Preview**: Limited Japanese font support due to PDF.js limitations ⚠️

### Preview Limitations

The in-VSCode preview uses PDF.js, which has known issues with CID fonts and embedded Japanese fonts. You may see:
- Blank spaces where Japanese text should appear
- Incorrect character rendering
- Font substitution with system fonts

### Recommended Workflow

1. **Development**: Use "Preview as PDF" for quick layout checks
2. **Japanese Text Verification**: Use "Open External" button or "Export to PDF" for accurate rendering
3. **Final Review**: Always verify Japanese text in an external PDF viewer

### Warning Banner

When the extension detects Japanese/CJK content, it will show a warning banner in the preview with an "Open External" button for proper rendering.

## Troubleshooting

If Japanese text doesn't display correctly in **Export**:

1. Check that your system has the required CID fonts
2. Verify the conversion output shows "Registered CID fonts"
3. Make sure your RML file is saved with UTF-8 encoding
4. Try using different font names (HeiseiMin-W3 vs HeiseiKakuGo-W5)

If Japanese text doesn't display in **Preview**:
- This is expected behavior due to PDF.js limitations
- Use the "Open External" button for accurate preview
- The exported PDF will render correctly