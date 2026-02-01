const vscode = require("vscode");

function activate(ctx) {
    let IsUpdating = false;
    let isHighlightEnabled = ctx.globalState.get("ToDoo_highlight_enabled", true);
    let LineMargin = "0 10px 0 5px";

    const IconDecoration = {
        Warn1: vscode.window.createTextEditorDecorationType({ before: { contentText: "🔘", margin: LineMargin } }),
        Warn2: vscode.window.createTextEditorDecorationType({ before: { contentText: "🔘", margin: LineMargin } }),
        Warn3: vscode.window.createTextEditorDecorationType({ before: { contentText: "🔘", margin: LineMargin } }),
        Error1: vscode.window.createTextEditorDecorationType({ before: { contentText: "❌", margin: LineMargin } }),
        Error2: vscode.window.createTextEditorDecorationType({ before: { contentText: "❌", margin: LineMargin } }),
        Error3: vscode.window.createTextEditorDecorationType({ before: { contentText: "❌", margin: LineMargin } }),
        Success1: vscode.window.createTextEditorDecorationType({ before: { contentText: "✅", margin: LineMargin } }),
        Success2: vscode.window.createTextEditorDecorationType({ before: { contentText: "✅", margin: LineMargin } }),
        Success3: vscode.window.createTextEditorDecorationType({ before: { contentText: "✅", margin: LineMargin } }),
    };

    const HighLightDecoraton = {
        Warn1: vscode.window.createTextEditorDecorationType({ backgroundColor: 'rgba(234, 255, 0, 0.30)', isWholeLine: true }),
        Warn2: vscode.window.createTextEditorDecorationType({ backgroundColor: 'rgba(234, 255, 0, 0.40)', isWholeLine: true }),
        Warn3: vscode.window.createTextEditorDecorationType({ backgroundColor: 'rgba(234, 255, 0, 0.50)', isWholeLine: true }),
        Error1: vscode.window.createTextEditorDecorationType({ backgroundColor: 'rgba(255, 0, 0, 0.30)', isWholeLine: true }),
        Error2: vscode.window.createTextEditorDecorationType({ backgroundColor: 'rgba(255, 0, 0, 0.40)', isWholeLine: true }),
        Error3: vscode.window.createTextEditorDecorationType({ backgroundColor: 'rgba(255, 0, 0, 0.50)', isWholeLine: true }),
        Success1: vscode.window.createTextEditorDecorationType({ backgroundColor: 'rgba(0, 255, 0, 0.30)', isWholeLine: true }),
        Success2: vscode.window.createTextEditorDecorationType({ backgroundColor: 'rgba(0, 255, 0, 0.40)', isWholeLine: true }),
        Success3: vscode.window.createTextEditorDecorationType({ backgroundColor: 'rgba(0, 255, 0, 0.50)', isWholeLine: true }),
    };

    let Storage = ctx.globalState.get('ToDoo_data', {});

    function updateDecorations(editor) {
        if (!editor || !editor.document.fileName.endsWith(".todo")) return;
        const FileName = editor.document.fileName;
        const FileState = Storage[FileName] || [];
        
        const IconRanges = { Warn1: [], Warn2: [], Warn3: [], Error1: [], Error2: [], Error3: [], Success1: [], Success2: [], Success3: [] };
        const HighLightRanges = { Warn1: [], Warn2: [], Warn3: [], Error1: [], Error2: [], Error3: [], Success1: [], Success2: [], Success3: [] };

        for (let i = 0; i < editor.document.lineCount; i++) {
            const Line = editor.document.lineAt(i);
            const Text = Line.text;
            if (Text.trim().length === 0) continue;

            const Words = Text.trim().toLowerCase().split(/\s+/).filter(w => w.length > 0);
            const FirstTwo = Words.slice(0, 2).join(' ');

            let lvl = 1;
            if (FirstTwo.includes('!!!')) lvl = 3;
            else if (FirstTwo.includes('!!')) lvl = 2;

            const IsError = FirstTwo.includes("!e") || FirstTwo.includes(":e") || FirstTwo.includes("error:");
            const IsBug = FirstTwo.includes("!b") || FirstTwo.includes(":b")||FirstTwo.includes("bug:");
            let Type = (IsError || IsBug) ? 'Error' : 'Warn';

            // ✅ YENİ MANTIK: Metne değil, satır numarasına (i) bakıyoruz
            let currentKey = (FileState.includes(i.toString()) ? 'Success' : Type) + lvl;

            if (IconRanges[currentKey]) IconRanges[currentKey].push(Line.range);
            if (isHighlightEnabled && HighLightRanges[currentKey]) {
                HighLightRanges[currentKey].push(Line.range);
            }
        }
        
        Object.keys(IconDecoration).forEach(K => editor.setDecorations(IconDecoration[K], IconRanges[K]));
        Object.keys(HighLightDecoraton).forEach(K => editor.setDecorations(HighLightDecoraton[K], HighLightRanges[K]));
    }

    ctx.subscriptions.push(vscode.commands.registerCommand('todoo.setHighlight', async () => {
        const Selection = await vscode.window.showQuickPick(['Enable', 'Disable'], { placeHolder: "ToDoo highlight configuration" });
        if (Selection) {
            isHighlightEnabled = Selection === 'Enable';
            await ctx.globalState.update("ToDoo_highlight_enabled", isHighlightEnabled);
            vscode.window.showInformationMessage(`ToDoo Highlight ${isHighlightEnabled ? 'Aktif' : 'Devre Dışı'}`);
            if (vscode.window.activeTextEditor) updateDecorations(vscode.window.activeTextEditor);
        }
    }));

    ctx.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(async (e) => {
        if (IsUpdating || e.kind !== 2 || !e.selections[0].isEmpty) return;
        const Editor = e.textEditor;
        if (!Editor || !Editor.document.fileName.endsWith(".todo")) return;

        const LineNumber = e.selections[0].start.line;
        const Line = Editor.document.lineAt(LineNumber);
        
        if (e.selections[0].start.character <= 3 && Line.text.trim().length > 0) {
            IsUpdating = true;
            let FileState = Storage[Editor.document.fileName] || [];
            
            // Satır numarasıyla işlem yap (String olarak sakla)
            const lineIdx = LineNumber.toString();
            if (FileState.includes(lineIdx)) {
                FileState = FileState.filter(id => id !== lineIdx);
            } else {
                FileState.push(lineIdx);
            }

            Storage[Editor.document.fileName] = FileState;
            await ctx.globalState.update('ToDoo_data', Storage);
            updateDecorations(Editor);

            // Seri tıklama hilesi
            const newPos = new vscode.Position(LineNumber, e.selections[0].start.character + 1);
            Editor.selection = new vscode.Selection(newPos, newPos);

            setTimeout(() => { IsUpdating = false; }, 100);
        }
    }));

    vscode.workspace.onDidChangeTextDocument(ev => {
        if (vscode.window.activeTextEditor && ev.document === vscode.window.activeTextEditor.document) updateDecorations(vscode.window.activeTextEditor);
    }, null, ctx.subscriptions);

    vscode.window.onDidChangeActiveTextEditor(editor => { if (editor) updateDecorations(editor); }, null, ctx.subscriptions);

    if (vscode.window.activeTextEditor) updateDecorations(vscode.window.activeTextEditor);

    setTimeout(() => {
        vscode.window.showInformationMessage(
            "ToDoo V1.3.0 Aktif! Renklendirmeyi ayarlamak için Ctrl+Shift+P kullanabilirsiniz.",
            "Anladım"
        );
    }, 2000);
}

exports.activate = activate;