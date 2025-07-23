#!/usr/bin/env python3
"""
RML to PDF converter script
Usage: python rml2pdf.py input.rml output.pdf
"""

import sys
import os
from trml2pdf import parseString

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