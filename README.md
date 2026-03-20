# Turing Machine Simulator

A polished static web application for simulating a Turing Machine. It is ready to upload directly to a GitHub repository and deploy using **GitHub Pages**.

## Features

- visual tape with highlighted read/write head
- step-by-step execution
- run, pause, reset, and run-to-halt controls
- transition rule editor
- active rule highlighting
- execution log
- configurable run speed and tape padding
- rule search/filter
- import/export machine configuration as JSON
- built-in preset machines:
  - Unary Increment
  - Binary Increment
  - Palindrome Checker (a/b)
  - Even Number of 0s

## Files

- `index.html`
- `styles.css`
- `script.js`
- `README.md`

## Deploy on GitHub Pages

1. Create a new GitHub repository.
2. Upload all project files to the root of the repository.
3. Go to **Settings > Pages**.
4. Under **Build and deployment**, choose:
   - **Source:** Deploy from a branch
   - **Branch:** `main` (or your default branch)
   - **Folder:** `/root`
5. Save. GitHub will give you a public link.

## How to use

1. Choose a preset or enter your own machine configuration.
2. Add or edit transition rules.
3. Click **Initialize Tape**.
4. Use **Step** for one transition at a time, or **Run** for automatic execution.
5. Track changes using the tape, transition overview, and execution log.
6. Export your machine as JSON or import it later.

## Suggested demo inputs

- Unary Increment: `111`
- Binary Increment: `1011`
- Palindrome Checker: `abba`, `aba`, `abab`
- Even Number of 0s: `101001`
