# Year 9 Science Study — drop-in static repo

A static, dependency-free Year 9 science end-of-year study app built from the useful parts of the **Electric Bones** Year 7 app pattern: single-page GitHub Pages deployment, local browser progress, practice mode, weak-review mode, quick-quiz cards, and a stricter **Boss mode** test flow.

This repo removes the Year 7 educational content and replaces it with a Year 9 content bank generated from the supplied Year 9 science pack.

## Included units

| Unit | Topic | Cards |
|---|---|---:|
| 9A | Genetics and evolution | 51 |
| 9B | Plant growth | 48 |
| 9E | Making materials | 42 |
| 9F | Reactivity and extraction | 42 |
| 9I | Forces and motion | 43 |
| 9J | Force fields and electromagnets | 48 |


## Content bank

| Card type | Count |
|---|---:|
| Quick quiz | 120 |
| Vocabulary | 108 |
| Progress check | 39 |
| Calculation | 7 |
| **Total** | **274** |

| Level | Count |
|---|---:|
| Level 1 | 172 |
| Level 2 | 66 |
| Level 3 | 28 |
| Level 4 | 5 |
| Level 5 | 3 |


## Features

- **Practice mode**: browse any card, reveal answers, self-mark written answers.
- **Quick quiz mode**: multiple-choice quiz cards reconstructed from the Year 9 quick quiz PDFs.
- **Boss mode**: locked-in test mode. Press **Let’s go!**, complete the isolated test screen, bail-out requires confirmation, and the end screen asks whether to save the score or **forget this ever happened**.
- **Level-ups**: each unit starts at Level 1. A saved 100% Boss mode score unlocks the next level for that unit. “All units” has its own unlock track.
- **Weak review**: missed cards are stored locally and can be revised separately.
- **Progress storage**: XP, streaks, mastered cards, weak cards, boss history and unlocked levels are saved in `localStorage`.
- **Export/import**: progress can be backed up as JSON and restored later.
- **Read aloud**: browser text-to-speech button for questions/answers.
- No backend, build step, npm install, package manager, database or API key.

## Source mapping

The Year 9 content bank was built from:

- `9A`, `9B`, `9E`, `9F`, `9I`, `9J` quick quiz PDFs
- word sheets and summary sheets
- assess-yourself PDFs
- progression checks and revision prompts extracted from the supplied PowerPoints

Most quick-quiz cards keep the original wording closely. A small number of diagram-only questions were converted to text prompts because the original images were not carried into this static repo.

## Run locally

Open `index.html` directly in a browser, or run a simple local server:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Publish to GitHub Pages

From inside this folder:

```bash
git init
git add .
git commit -m "Add Year 9 science study app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Then in GitHub:

1. Open the repo.
2. Go to **Settings** → **Pages**.
3. Choose **Deploy from a branch**.
4. Branch: `main`.
5. Folder: `/ root`.
6. Save.

## Edit the content

Edit:

```text
data/year9-content.js
```

The app reads `window.YEAR9_CONTENT.cards`. Each card supports:

```js
{
  id: "unique-id",
  unit: "9A",
  type: "Quick quiz",
  question: "...",
  answer: "C",
  choices: ["A ...", "B ...", "C ...", "D ..."],
  explanation: "...",
  source: "9A quick quiz 9Aa Q1",
  level: 1,
  cue: "optional cue"
}
```

For open-response cards, use an empty `choices: []` array and put the mark-scheme/model answer in `answer`.

## Source-pack licence note

The supplied content pack includes publisher notices indicating copying is permitted for the purchasing institution only and that the material is not copyright free. Keep this repo private or use it only within the permitted classroom/institution context unless you replace the reconstructed source-pack questions with your own original wording.
