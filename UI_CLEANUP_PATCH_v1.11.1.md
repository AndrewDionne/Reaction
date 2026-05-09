# Reaction v1.11.1 UI Cleanup Retry

This patch reapplies the focused journey UI cleanup more aggressively against the current repo snapshot.

## Fixes

- Adds cache-busting query strings to `styles.css`, `app.js`, and data scripts so GitHub Pages/browser cache does not keep the old UI.
- Removes the visible admin-style filter panel from the hub DOM and replaces it with hidden controls required by the existing app logic.
- Keeps unit cards as the primary navigation layer.
- Converts route cards into clickable status/action cards instead of small native buttons.
- Strengthens the brand hero background using the Reaction beaker artwork.
- Keeps the session header to one focused line.
- Keeps compact metadata chips above the card and source/fidelity text at the bottom.

## Validation

Run:

```bash
node --check app.js
python tools/validate_content.py
```
