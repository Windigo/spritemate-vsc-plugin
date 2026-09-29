/**
 * Spritemate - C64 Sprite Editor (VS Code extension wrapper)
 *
 * Wraps the built Spritemate web app (see ../dist, copied into ./media) inside a
 * VS Code webview panel so the editor runs "as-is" inside VS Code.
 *
 * The original Spritemate is an MIT-licensed project by Ingo Hinterding (awsm):
 *   https://github.com/Esshahn/spritemate
 */
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

const VIEW_TYPE = "spritemate";

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("spritemate.open", () => {
      openPanel(context);
    })
  );
}

/**
 * Reads the built index.html and rewrites it so every relative asset
 * (CSS, JS bundle, favicons and the runtime "ui/..." images) resolves against
 * the webview's local media directory. A <base> tag is injected so dynamic
 * image references set at runtime also resolve correctly.
 *
 * @param {vscode.Webview} webview
 * @param {vscode.Uri} extensionUri
 * @returns {string}
 */
function getWebviewContent(webview, extensionUri) {
  const mediaUri = vscode.Uri.joinPath(extensionUri, "media");
  const indexPath = vscode.Uri.joinPath(mediaUri, "index.html");

  let html = fs.readFileSync(indexPath.fsPath, "utf8");

  const base = webview.asWebviewUri(mediaUri).toString();
  const cspSource = webview.cspSource;

  const csp = [
    "default-src 'none'",
    `img-src ${cspSource} data: blob: https:`,
    `style-src ${cspSource} 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src ${cspSource} https://fonts.gstatic.com`,
    `script-src ${cspSource} 'unsafe-inline'`,
    `connect-src ${cspSource} https: data: blob:`,
  ].join("; ");

  const injection = `<meta http-equiv="Content-Security-Policy" content="${csp}">\n    <base href="${base}/">`;

  // Inject into the <head> (which exists exactly once in the built index.html).
  return html.replace("<head>", `<head>\n    ${injection}`);
}

/**
 * @param {vscode.ExtensionContext} context
 */
function openPanel(context) {
  const column = vscode.window.activeTextEditor
    ? vscode.window.activeTextEditor.viewColumn
    : vscode.ViewColumn.One;

  const panel = vscode.window.createWebviewPanel(
    VIEW_TYPE,
    "Spritemate",
    column || vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [
        vscode.Uri.joinPath(context.extensionUri, "media"),
      ],
    }
  );

  panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
