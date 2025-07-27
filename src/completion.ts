import * as vscode from 'vscode';

export class RmlCompletionProvider implements vscode.CompletionItemProvider {
    
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        
        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        
        // Check if we're in a tag context
        if (this.isInTagContext(linePrefix)) {
            return this.getTagCompletions();
        }
        
        // Check if we're in an attribute context
        if (this.isInAttributeContext(linePrefix)) {
            return this.getAttributeCompletions(linePrefix);
        }
        
        // Check if we're in an attribute value context
        if (this.isInAttributeValueContext(linePrefix)) {
            return this.getAttributeValueCompletions(linePrefix);
        }
        
        return [];
    }
    
    private isInTagContext(linePrefix: string): boolean {
        return linePrefix.endsWith('<') || /< *\w*$/.test(linePrefix);
    }
    
    private isInAttributeContext(linePrefix: string): boolean {
        return /< *\w+ +\w*$/.test(linePrefix) || /< *\w+[^>]*\s+\w*$/.test(linePrefix);
    }
    
    private isInAttributeValueContext(linePrefix: string): boolean {
        return /\w+ *= *"[^"]*$/.test(linePrefix) || /\w+ *= *'[^']*$/.test(linePrefix);
    }
    
    private getTagCompletions(): vscode.CompletionItem[] {
        const tags = [
            // Document structure
            { name: 'document', desc: 'Root document element', snippet: 'document filename="$1">\n\t$0\n</document>' },
            { name: 'template', desc: 'Template section for page layout', snippet: 'template>\n\t$2\n</template>' },
            { name: 'pageTemplate', desc: 'Page template definition', snippet: 'pageTemplate id="$1">\n\t$0\n</pageTemplate>' },
            { name: 'stylesheet', desc: 'Stylesheet section for styles', snippet: 'stylesheet>\n\t$0\n</stylesheet>' },
            { name: 'story', desc: 'Story section for flowable content', snippet: 'story>\n\t$0\n</story>' },
            
            // Layout elements
            { name: 'frame', desc: 'Content frame definition', snippet: 'frame id="$1" x1="$2" y1="$3" width="$4" height="$5" />' },
            { name: 'pageGraphics', desc: 'Page graphics container', snippet: 'pageGraphics>\n\t$0\n</pageGraphics>' },
            { name: 'place', desc: 'Place element at specific position', snippet: 'place x="$1" y="$2" width="$3" height="$4">\n\t$0\n</place>' },
            
            // Content elements
            { name: 'para', desc: 'Paragraph element', snippet: 'para${1: style="$2"}>$0</para>' },
            { name: 'spacer', desc: 'Vertical spacer', snippet: 'spacer length="$1" />' },
            { name: 'image', desc: 'Image element', snippet: 'image file="$1" width="$2" height="$3" />' },
            
            // Table elements
            { name: 'blockTable', desc: 'Block table element', snippet: 'blockTable${1: style="$2"}>\n\t<tr>\n\t\t<td>$0</td>\n\t</tr>\n</blockTable>' },
            { name: 'tr', desc: 'Table row', snippet: 'tr>\n\t<td>$0</td>\n</tr>' },
            { name: 'td', desc: 'Table cell', snippet: 'td${1: style="$2"}>$0</td>' },
            { name: 'th', desc: 'Table header cell', snippet: 'th${1: style="$2"}>$0</th>' },
            
            // Style elements
            { name: 'paraStyle', desc: 'Paragraph style definition', snippet: 'paraStyle name="$1" fontName="$2" fontSize="$3" />' },
            { name: 'blockTableStyle', desc: 'Block table style definition', snippet: 'blockTableStyle id="$1">\n\t$0\n</blockTableStyle>' },
            { name: 'tableStyle', desc: 'Table style definition', snippet: 'tableStyle id="$1">\n\t$0\n</tableStyle>' },
            
            // Graphics elements
            { name: 'fill', desc: 'Fill color', snippet: 'fill color="$1" />' },
            { name: 'setFont', desc: 'Set font', snippet: 'setFont name="$1" size="$2" />' },
            { name: 'drawString', desc: 'Draw text string', snippet: 'drawString x="$1" y="$2">$0</drawString>' },
            { name: 'circle', desc: 'Circle shape', snippet: 'circle x="$1" y="$2" radius="$3" />' },
            { name: 'rect', desc: 'Rectangle shape', snippet: 'rect x="$1" y="$2" width="$3" height="$4" />' },
            { name: 'line', desc: 'Line shape', snippet: 'line x1="$1" y1="$2" x2="$3" y2="$4" />' },
            
            // Font registration
            { name: 'docinit', desc: 'Document initialization', snippet: 'docinit>\n\t$0\n</docinit>' },
            { name: 'registerFont', desc: 'Register font', snippet: 'registerFont fontName="$1" fontFile="$2" />' },
            { name: 'registerTTFont', desc: 'Register TrueType font', snippet: 'registerTTFont faceName="$1" fileName="$2" />' },
            { name: 'registerCIDFont', desc: 'Register CID font', snippet: 'registerCIDFont faceName="$1" />' },
            
            // Inline formatting
            { name: 'b', desc: 'Bold text', snippet: 'b>$0</b>' },
            { name: 'i', desc: 'Italic text', snippet: 'i>$0</i>' },
            { name: 'u', desc: 'Underlined text', snippet: 'u>$0</u>' },
            { name: 'sup', desc: 'Superscript text', snippet: 'sup>$0</sup>' },
            { name: 'sub', desc: 'Subscript text', snippet: 'sub>$0</sub>' },
            { name: 'font', desc: 'Font element', snippet: 'font face="$1" size="$2">$0</font>' },
            { name: 'span', desc: 'Span element', snippet: 'span${1: style="$2"}>$0</span>' },
            { name: 'br', desc: 'Line break', snippet: 'br />' },
            
            // Flow control
            { name: 'keepInFrame', desc: 'Keep content in frame', snippet: 'keepInFrame>\n\t$0\n</keepInFrame>' },
            { name: 'condPageBreak', desc: 'Conditional page break', snippet: 'condPageBreak height="$1" />' },
            { name: 'nextFrame', desc: 'Next frame', snippet: 'nextFrame />' },
            { name: 'nextPage', desc: 'Next page', snippet: 'nextPage />' },
            { name: 'setNextTemplate', desc: 'Set next template', snippet: 'setNextTemplate name="$1" />' }
        ];
        
        return tags.map(tag => {
            const item = new vscode.CompletionItem(tag.name, vscode.CompletionItemKind.Snippet);
            item.detail = tag.desc;
            item.insertText = new vscode.SnippetString(tag.snippet);
            item.documentation = new vscode.MarkdownString(`**${tag.name}**\n\n${tag.desc}`);
            return item;
        });
    }
    
    private getAttributeCompletions(linePrefix: string): vscode.CompletionItem[] {
        // Extract tag name from line prefix
        const tagMatch = linePrefix.match(/< *(\w+)/);
        if (!tagMatch) return [];
        
        const tagName = tagMatch[1];
        const attributes = this.getAttributesForTag(tagName);
        
        return attributes.map(attr => {
            const item = new vscode.CompletionItem(attr.name, vscode.CompletionItemKind.Property);
            item.detail = attr.desc;
            item.insertText = new vscode.SnippetString(`${attr.name}="$1"`);
            item.documentation = new vscode.MarkdownString(`**${attr.name}**\n\n${attr.desc}\n\nType: ${attr.type}`);
            return item;
        });
    }
    
    private getAttributesForTag(tagName: string): Array<{name: string, desc: string, type: string}> {
        const commonAttrs = [
            { name: 'id', desc: 'Unique identifier', type: 'string' },
            { name: 'style', desc: 'Style reference', type: 'string' }
        ];
        
        const tagAttributes: Record<string, Array<{name: string, desc: string, type: string}>> = {
            'document': [
                { name: 'filename', desc: 'Output PDF filename', type: 'string' },
                { name: 'pageSize', desc: 'Page size (A4, letter, etc.)', type: 'string' },
                { name: 'pageMargin', desc: 'Page margins', type: 'dimension' }
            ],
            'pageTemplate': [
                ...commonAttrs,
                { name: 'showBoundary', desc: 'Show frame boundaries', type: 'boolean' }
            ],
            'frame': [
                ...commonAttrs,
                { name: 'x1', desc: 'Left position', type: 'dimension' },
                { name: 'y1', desc: 'Bottom position', type: 'dimension' },
                { name: 'width', desc: 'Frame width', type: 'dimension' },
                { name: 'height', desc: 'Frame height', type: 'dimension' },
                { name: 'leftPadding', desc: 'Left padding', type: 'dimension' },
                { name: 'rightPadding', desc: 'Right padding', type: 'dimension' },
                { name: 'topPadding', desc: 'Top padding', type: 'dimension' },
                { name: 'bottomPadding', desc: 'Bottom padding', type: 'dimension' }
            ],
            'para': [
                ...commonAttrs,
                { name: 'fontName', desc: 'Font name', type: 'font' },
                { name: 'fontSize', desc: 'Font size', type: 'number' },
                { name: 'textColor', desc: 'Text color', type: 'color' },
                { name: 'alignment', desc: 'Text alignment', type: 'alignment' },
                { name: 'leading', desc: 'Line spacing', type: 'number' }
            ],
            'paraStyle': [
                { name: 'name', desc: 'Style name', type: 'string' },
                { name: 'fontName', desc: 'Font name', type: 'font' },
                { name: 'fontSize', desc: 'Font size', type: 'number' },
                { name: 'textColor', desc: 'Text color', type: 'color' },
                { name: 'alignment', desc: 'Text alignment', type: 'alignment' },
                { name: 'leading', desc: 'Line spacing', type: 'number' },
                { name: 'spaceBefore', desc: 'Space before paragraph', type: 'dimension' },
                { name: 'spaceAfter', desc: 'Space after paragraph', type: 'dimension' },
                { name: 'leftIndent', desc: 'Left indent', type: 'dimension' },
                { name: 'rightIndent', desc: 'Right indent', type: 'dimension' }
            ],
            'blockTable': [
                ...commonAttrs,
                { name: 'colWidths', desc: 'Column widths', type: 'dimensions' },
                { name: 'rowHeights', desc: 'Row heights', type: 'dimensions' },
                { name: 'repeatRows', desc: 'Repeat header rows', type: 'number' }
            ],
            'image': [
                ...commonAttrs,
                { name: 'file', desc: 'Image file path', type: 'string' },
                { name: 'width', desc: 'Image width', type: 'dimension' },
                { name: 'height', desc: 'Image height', type: 'dimension' }
            ],
            'spacer': [
                { name: 'length', desc: 'Spacer length', type: 'dimension' }
            ],
            'fill': [
                { name: 'color', desc: 'Fill color', type: 'color' }
            ],
            'setFont': [
                { name: 'name', desc: 'Font name', type: 'font' },
                { name: 'size', desc: 'Font size', type: 'number' }
            ],
            'drawString': [
                { name: 'x', desc: 'X position', type: 'dimension' },
                { name: 'y', desc: 'Y position', type: 'dimension' }
            ]
        };
        
        return tagAttributes[tagName] || commonAttrs;
    }
    
    private getAttributeValueCompletions(linePrefix: string): vscode.CompletionItem[] {
        // Extract attribute name
        const attrMatch = linePrefix.match(/(\w+) *= *["'][^"']*$/);
        if (!attrMatch) return [];
        
        const attrName = attrMatch[1];
        const values = this.getValuesForAttribute(attrName);
        
        return values.map(value => {
            const item = new vscode.CompletionItem(value.name, vscode.CompletionItemKind.Value);
            item.detail = value.desc;
            item.insertText = value.name;
            return item;
        });
    }
    
    private getValuesForAttribute(attrName: string): Array<{name: string, desc: string}> {
        const attributeValues: Record<string, Array<{name: string, desc: string}>> = {
            'fontName': [
                { name: 'Helvetica', desc: 'Helvetica font' },
                { name: 'Helvetica-Bold', desc: 'Helvetica bold' },
                { name: 'Helvetica-Oblique', desc: 'Helvetica italic' },
                { name: 'Times-Roman', desc: 'Times Roman font' },
                { name: 'Times-Bold', desc: 'Times bold' },
                { name: 'Times-Italic', desc: 'Times italic' },
                { name: 'Courier', desc: 'Courier monospace font' },
                { name: 'Courier-Bold', desc: 'Courier bold' },
                { name: 'HeiseiMin-W3', desc: 'Japanese Mincho font' },
                { name: 'HeiseiKakuGo-W5', desc: 'Japanese Gothic font' }
            ],
            'alignment': [
                { name: 'left', desc: 'Left alignment' },
                { name: 'right', desc: 'Right alignment' },
                { name: 'center', desc: 'Center alignment' },
                { name: 'justify', desc: 'Justified alignment' }
            ],
            'textColor': [
                { name: 'black', desc: 'Black color' },
                { name: 'white', desc: 'White color' },
                { name: 'red', desc: 'Red color' },
                { name: 'green', desc: 'Green color' },
                { name: 'blue', desc: 'Blue color' },
                { name: 'yellow', desc: 'Yellow color' },
                { name: 'gray', desc: 'Gray color' }
            ],
            'color': [
                { name: 'black', desc: 'Black color' },
                { name: 'white', desc: 'White color' },
                { name: 'red', desc: 'Red color' },
                { name: 'green', desc: 'Green color' },
                { name: 'blue', desc: 'Blue color' },
                { name: 'yellow', desc: 'Yellow color' },
                { name: 'gray', desc: 'Gray color' }
            ],
            'pageSize': [
                { name: 'A4', desc: 'A4 paper size (210×297mm)' },
                { name: 'letter', desc: 'US Letter size (8.5×11")' },
                { name: 'legal', desc: 'US Legal size (8.5×14")' },
                { name: 'A3', desc: 'A3 paper size (297×420mm)' },
                { name: 'A5', desc: 'A5 paper size (148×210mm)' }
            ],
            'showBoundary': [
                { name: 'true', desc: 'Show boundaries' },
                { name: 'false', desc: 'Hide boundaries' },
                { name: '1', desc: 'Show boundaries' },
                { name: '0', desc: 'Hide boundaries' }
            ]
        };
        
        return attributeValues[attrName] || [];
    }
}