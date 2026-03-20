# Turing Machine Simulator

A static web application that simulates a Turing Machine with:

- tape visualization
- read/write head highlighting
- transition rule editor
- step-by-step execution log
- run, pause, reset controls
- example machine for quick demo

## Files

- `index.html` – app structure
- `styles.css` – styling and responsive layout
- `script.js` – simulator logic

## Deploy on GitHub Pages

1. Create a new GitHub repository.
2. Upload all project files to the repository root.
3. Commit and push the files.
4. Open **Settings → Pages** in the repository.
5. Under **Build and deployment**, choose:
   - **Source:** Deploy from a branch
   - **Branch:** `main` (or `master`) and `/root`
6. Save the settings.
7. GitHub will generate a public link for your project.

## Example Machine Included

The **Load Example Machine** button loads a simple unary incrementer:

- Input: `111`
- Output after execution: `1111`

## Notes

- Blank symbol defaults to `_`
- If no transition is found, the machine halts
- Accept and reject states are configurable
- Best suited for educational demonstration and BTech software project submission
