const vscode = require('vscode');

function activate(context) {
    let isUpdating = false; 
    const deco = {
        // --- SARI TONLARI ---
        sarı0: vscode.window.createTextEditorDecorationType({ backgroundColor: 'rgba(235, 255, 0, 0.18)', isWholeLine: true, before: { contentText: '🔘', margin: '0 10px 0 5px' } }),
        sarı1: vscode.window.createTextEditorDecorationType({ backgroundColor: 'rgba(242, 255, 0, 0.28)', isWholeLine: true, before: { contentText: '🔘', margin: '0 10px 0 5px' } }),
        sarı2: vscode.window.createTextEditorDecorationType({ backgroundColor: 'rgba(250, 255, 0, 0.38)', isWholeLine: true, before: { contentText: '🔘', margin: '0 10px 0 5px' } }),
        sarı3: vscode.window.createTextEditorDecorationType({ backgroundColor: 'rgba(255, 255, 0, 0.50)', isWholeLine: true, before: { contentText: '🔘', margin: '0 10px 0 5px' } }),
        // --- KIRMIZI TONLARI (Error / Bug) ---
        kırmızı0: vscode.window.createTextEditorDecorationType({ backgroundColor: 'rgba(255, 60, 60, 0.15)', isWholeLine: true, before: { contentText: '❌', margin: '0 10px 0 5px' } }),
        kırmızı1: vscode.window.createTextEditorDecorationType({ backgroundColor: 'rgba(255, 40, 40, 0.25)', isWholeLine: true, before: { contentText: '❌', margin: '0 10px 0 5px' } }),
        kırmızı2: vscode.window.createTextEditorDecorationType({ backgroundColor: 'rgba(255, 20, 20, 0.35)', isWholeLine: true, before: { contentText: '❌', margin: '0 10px 0 5px' } }),
        kırmızı3: vscode.window.createTextEditorDecorationType({ backgroundColor: 'rgba(255, 0, 0, 0.45)', isWholeLine: true, before: { contentText: '❌', margin: '0 10px 0 5px' } }),
        // --- YEŞİL TONLARI (Tamamlandı) ---
        done0: vscode.window.createTextEditorDecorationType({ backgroundColor: 'rgba(50, 255, 50, 0.12)', isWholeLine: true, textDecoration: 'line-through opacity 0.5', before: { contentText: '✅', margin: '0 10px 0 5px' } }),
        done1: vscode.window.createTextEditorDecorationType({ backgroundColor: 'rgba(50, 255, 50, 0.22)', isWholeLine: true, textDecoration: 'line-through opacity 0.5', before: { contentText: '✅', margin: '0 10px 0 5px' } }),
        done2: vscode.window.createTextEditorDecorationType({ backgroundColor: 'rgba(50, 255, 50, 0.35)', isWholeLine: true, textDecoration: 'line-through opacity 0.6', before: { contentText: '✅', margin: '0 10px 0 5px' } }),
        done3: vscode.window.createTextEditorDecorationType({ backgroundColor: 'rgba(0, 255, 0, 0.50)', isWholeLine: true, textDecoration: 'line-through opacity 0.7', before: { contentText: '✅', margin: '0 10px 0 5px' } })
    };

    let storage = context.globalState.get('todoo_data', {});

    function updateDecorations(editor) {
        if (!editor || !editor.document.fileName.endsWith('.todo')) return;
        
        const fileName = editor.document.fileName;
        const fileState = storage[fileName] || [];
        const ranges = { sarı0: [], sarı1: [], sarı2: [], sarı3: [], kırmızı0: [], kırmızı1: [], kırmızı2: [], kırmızı3: [], done0: [], done1: [], done2: [], done3: [] };

        for (let i = 0; i < editor.document.lineCount; i++) {
            const line = editor.document.lineAt(i);
            const text = line.text;
            if (text.trim().length === 0) continue;

            // --- YENİ MANTIK: İLK 2 KELİME KONTROLÜ ---
            const words = text.trim().toLowerCase().split(/\s+/);
            const firstTwo = words.slice(0, 2).join(' ');

            const isError = firstTwo.includes('!e') || firstTwo.includes('!error') || firstTwo.includes('error:') || firstTwo.includes('e:') 
            const isBug = firstTwo.includes('!bug');

            let level = 0;
            if (firstTwo.includes('!!!')) level = 3;
            else if (firstTwo.includes('!!')) level = 2;
            else if (firstTwo.includes('!')) level = 1;

            if (fileState.includes(text)) {
                ranges['done' + level].push(line.range);
            } else {
                let key;
                if (isError || isBug) {
                    key = 'kırmızı' + level;
                } else {
                    key = 'sarı' + level;
                }
                ranges[key].push(line.range);
            }
        }
        Object.keys(deco).forEach(key => editor.setDecorations(deco[key], ranges[key]));
    }

    context.subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection(async (e) => {
            if (isUpdating || e.kind !== 2 || !e.selections[0].isEmpty) return;
            const editor = e.textEditor;
            if (!editor || !editor.document.fileName.endsWith('.todo')) return;

            const selection = e.selections[0];
            const line = editor.document.lineAt(selection.start.line);
            const fileName = editor.document.fileName;

            if (selection.start.character <= 8 && line.text.trim().length > 0) {
                isUpdating = true;
                
                let fileState = storage[fileName] || [];
                if (fileState.includes(line.text)) {
                    fileState = fileState.filter(t => t !== line.text);
                } else {
                    fileState.push(line.text);
                }
                
                storage[fileName] = fileState;
                await context.globalState.update('todoo_data', storage);
                
                updateDecorations(editor);
                setTimeout(() => { isUpdating = false; }, 200);
            }
        })
    );

    vscode.workspace.onDidChangeTextDocument(ev => {
        if (vscode.window.activeTextEditor && ev.document === vscode.window.activeTextEditor.document) updateDecorations(vscode.window.activeTextEditor);
    }, null, context.subscriptions);

    vscode.window.onDidChangeActiveTextEditor(editor => { if (editor) updateDecorations(editor); }, null, context.subscriptions);

    if (vscode.window.activeTextEditor) updateDecorations(vscode.window.activeTextEditor);
}

exports.activate = activate;