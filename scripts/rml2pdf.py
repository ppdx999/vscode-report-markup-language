#!/usr/bin/env python3
"""
RML to PDF converter script
Usage: python rml2pdf.py input.rml output.pdf
"""

import sys
import os
from trml2pdf import parseString

def register_cid_fonts():
    """Register common CID fonts for Japanese text support"""
    try:
        from reportlab.pdfbase import pdfmetrics
        from reportlab.pdfbase.cidfonts import UnicodeCIDFont
        
        # Common Japanese CID fonts
        japanese_fonts = [
            'HeiseiMin-W3',      # Mincho (serif)
            'HeiseiKakuGo-W5',   # Gothic (sans-serif)
            'STSong-Light',      # Chinese simplified
            'MSung-Light',       # Chinese traditional
            'HYGoThic-Medium',   # Korean
        ]
        
        registered_fonts = []
        for font_name in japanese_fonts:
            try:
                pdfmetrics.registerFont(UnicodeCIDFont(font_name))
                registered_fonts.append(font_name)
            except Exception:
                # Font not available on this system, continue
                pass
        
        if registered_fonts:
            print(f"Registered CID fonts: {', '.join(registered_fonts)}")
        else:
            print("Warning: No CID fonts could be registered")
            
    except ImportError:
        print("Warning: Could not import CID font support")

def readContent(file_path):
    """Read content from RML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error reading file '{file_path}': {e}", file=sys.stderr)
        sys.exit(1)

def main():
    if len(sys.argv) != 3:
        print("Usage: python rml2pdf.py input.rml output.pdf", file=sys.stderr)
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    # Check if input file exists
    if not os.path.exists(input_file):
        print(f"Error: Input file '{input_file}' does not exist", file=sys.stderr)
        sys.exit(1)
    
    try:
        # Register CID fonts for Japanese/CJK text support
        register_cid_fonts()
        
        # Convert RML to PDF using the provided logic
        pdf_data = parseString(readContent(input_file))
        
        with open(output_file, "wb") as f:
            f.write(pdf_data)
        
        print(f"Successfully converted '{input_file}' to '{output_file}'")
        
    except Exception as e:
        print(f"Error during conversion: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()