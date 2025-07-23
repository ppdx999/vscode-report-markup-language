import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    console.log('RML extension is now active');

    const previewPdfCommand = vscode.commands.registerCommand('rml.previewPdf', async (uri?: vscode.Uri) => {
        const rmlFile = getRmlFile(uri);
        if (!rmlFile) return;

        const rmlPath = rmlFile.fsPath;
        const fileName = path.basename(rmlPath, '.rml');
        const tmpDir = path.join(os.tmpdir(), 'vscode-rml-preview');
        const outputPath = path.join(tmpDir, `${fileName}_${Date.now()}.pdf`);
        
        try {
            if (!fs.existsSync(tmpDir)) {
                fs.mkdirSync(tmpDir, { recursive: true });
            }
            
            await exportRmlToPdf(rmlPath, outputPath, context.extensionPath);
            await showPdfPreview(outputPath, fileName, context.extensionPath);
        } catch (error) {
            vscode.window.showErrorMessage(`Preview failed: ${error}`);
        }
    });

    const exportToPdfCommand = vscode.commands.registerCommand('rml.exportToPdf', async (uri?: vscode.Uri) => {
        const rmlFile = getRmlFile(uri);
        if (!rmlFile) return;

        const rmlPath = rmlFile.fsPath;
        const outputPath = rmlPath.replace(/\.rml$/, '.pdf');
        
        try {
            await exportRmlToPdf(rmlPath, outputPath, context.extensionPath);
            vscode.window.showInformationMessage(`PDF exported successfully: ${path.basename(outputPath)}`);
        } catch (error) {
            vscode.window.showErrorMessage(`Export failed: ${error}`);
        }
    });

    context.subscriptions.push(previewPdfCommand, exportToPdfCommand);
}

function getRmlFile(uri?: vscode.Uri): vscode.Uri | null {
    if (uri) {
        return uri;
    }
    
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor || !activeEditor.document.fileName.endsWith('.rml')) {
        vscode.window.showErrorMessage('Please select an RML file or open one in the editor');
        return null;
    }
    
    return activeEditor.document.uri;
}

async function showPdfPreview(pdfPath: string, fileName: string, extensionPath: string): Promise<void> {
    const panel = vscode.window.createWebviewPanel(
        'rmlPdfPreview',
        `RML PDF Preview - ${fileName}`,
        vscode.ViewColumn.Beside,
        {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.file(path.join(extensionPath, 'resources'))
            ]
        }
    );

    // Load the HTML content
    const htmlPath = path.join(extensionPath, 'resources', 'pdf-viewer.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    panel.webview.html = htmlContent;
    
    // Handle messages from webview
    panel.webview.onDidReceiveMessage(async (message) => {
        switch (message.type) {
            case 'ready':
                try {
                    // Read PDF file and convert to base64
                    const pdfBuffer = fs.readFileSync(pdfPath);
                    const pdfBase64 = pdfBuffer.toString('base64');
                    
                    panel.webview.postMessage({
                        type: 'loadPdf',
                        pdfData: pdfBase64,
                        fileName: fileName
                    });
                } catch (error) {
                    vscode.window.showErrorMessage(`Failed to load PDF: ${error}`);
                }
                break;
            case 'openExternal':
                await vscode.env.openExternal(vscode.Uri.file(pdfPath));
                break;
        }
    });
}

async function findPythonCommand(): Promise<string> {
    const pythonCommands = ['python3', 'python'];
    
    for (const cmd of pythonCommands) {
        try {
            await new Promise<void>((resolve, reject) => {
                exec(`${cmd} --version`, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });
            return cmd;
        } catch (error) {
            // Continue to next command
        }
    }
    
    throw new Error('Python not found. Please install Python 3 and ensure it\'s in your PATH');
}

async function exportRmlToPdf(inputPath: string, outputPath: string, extensionPath: string): Promise<void> {
    const scriptPath = path.join(extensionPath, 'scripts', 'rml2pdf.py');
    
    if (!fs.existsSync(scriptPath)) {
        throw new Error('RML to PDF converter script not found');
    }

    const pythonCmd = await findPythonCommand();
    const command = `${pythonCmd} "${scriptPath}" "${inputPath}" "${outputPath}"`;
    
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                if (stderr.includes('ModuleNotFoundError') || stderr.includes('ImportError')) {
                    reject(new Error('Missing Python dependencies. Please install: pip install trml2pdf'));
                } else {
                    reject(new Error(`Conversion failed: ${stderr || error.message}`));
                }
                return;
            }
            
            if (stderr) {
                console.warn('Conversion warning:', stderr);
            }
            
            console.log('Conversion output:', stdout);
            resolve();
        });
    });
}

export function deactivate() {
    // Clean up resources when extension is deactivated
}