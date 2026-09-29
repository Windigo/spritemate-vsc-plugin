# Spritemate - C64 Sprite Editor (VS Code Plugin)

Run **Spritemate**, the browser-based Commodore 64 sprite editor, directly inside VS Code.

This extension is a **VS Code plugin** that wraps the original [Spritemate](https://github.com/Esshahn/spritemate) web app in a VS Code webview panel, so it runs "as-is" in the editor — no browser required.

## Usage

1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. Run **Spritemate: Open C64 Sprite Editor**.
3. Or press `Ctrl+Alt+S` (`Cmd+Alt+S` on macOS).

## Features

- 16-color C64 palette (Colodore, PALette, Pepto + custom)
- Draw pixels on a 24×21 (single color) or 12×21 (multicolor) canvas
- Select, fill, shift, flip, invert, move, erase, copy & paste sprites
- Sprite overlays, double width/height, animation, playfield preview
- Undo / redo, multiple sprites, sprite sorting
- Import/export: SpritePad (`.spd`), project (`.spm`), PNG, VICE snapshot (`.vsf`), assembly, BASIC code

## File handling

- **Open / Import** uses VS Code's native file picker.
- **Save / Export** triggers a file download. Export your `.spm`, `.spd`, PNG or code to disk from there.

## Notes

- The app stores its settings and autosave in the webview's local storage. Use **File → Save Project** to keep your work as a `.spm` file.

## Authors

- **Spritemate** (the application) is created by [Ingo Hinterding (awsm)](https://github.com/Esshahn/spritemate) and released under the MIT license.
- **This VS Code extension** is packaged by Menno Homan (Windigo).

## Development

Spritemate is included as a [git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules), which points at an exact commit of the upstream project.

### Build locally

```bash
./build-extension.sh
```

This builds spritemate, copies its output into `media/`, and produces `spritemate-<version>.vsix`.

### Update spritemate to a newer version

```bash
(cd spritemate && git fetch origin && git checkout main)   # or a commit SHA
git add spritemate
git commit -m "Update spritemate"
git push
```

### Release a new version

1. Bump `version` in `package.json`.
2. Tag and push:

```bash
git tag v1.3.0
git push origin v1.3.0
```

GitHub Actions builds the `.vsix` on every push. When you push a `v*` tag, it also creates a GitHub Release with the `.vsix` attached.

