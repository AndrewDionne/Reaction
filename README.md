# Year 9 Science Study — drop-in static repo

A static, dependency-free Year 9 science end-of-year study app built from the useful parts of the **Electric Bones** Year 7 app pattern: single-page GitHub Pages deployment, local browser progress, practice mode, weak-review mode, quick-quiz cards, and a stricter **Boss mode** test flow.

This repo removes the Year 7 educational content and replaces it with a Year 9 content bank generated from the supplied Year 9 science pack.

## Included units

| Unit | Topic | Cards |
|---|---|---:|
| 9A | Genetics and evolution | 66 |
| 9B | Plant growth | 86 |
| 9E | Making materials | 61 |
| 9F | Reactivity and extraction | 58 |
| 9I | Forces and motion | 63 |
| 9J | Force fields and electromagnets | 85 |


## Content bank

| Card type | Count |
|---|---:|
| Assess check | 80 |
| Calculation | 34 |
| Progress check | 77 |
| Quick quiz | 120 |
| Vocabulary | 108 |
| **Total** | **419** |

| Level | Count |
|---|---:|
| Level 1 | 190 |
| Level 2 | 115 |
| Level 3 | 86 |
| Level 4 | 25 |
| Level 5 | 3 |


## Coverage after the content-expansion patch

The v1.1.0 content patch expands the app from the original quiz/vocabulary-focused bank into a broader source-pack mastery bank:

- Quick quiz questions: **120 / 120** represented.
- Word-sheet vocabulary: **108 / 108** represented.
- Assess-yourself success criteria: **80 / 80** represented as open-response **Assess check** cards.
- Explicit PowerPoint progress-check / lesson-check prompts: expanded from partial coverage to the practical set available in the extracted slide text.
- Calculation practice: expanded with extra weight, resistance, speed, moment and work-done cards.

Practical source-pack coverage is now estimated at **95%+** for text-convertible items. Diagram-only items remain represented as text-equivalent prompts unless original/re-drawn diagrams are added later.

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


## SVG diagrams and charts

Version 1.2.0 adds a first-pass set of original SVG teaching diagrams for the questions that were previously reconstructed from diagrams, charts or graphs in the source pack.

Included SVG topics:

- continuous variation / normal distribution
- photosynthesis plant diagram
- photosynthesis rate vs light intensity graph
- root hair cell
- food web
- brittle lattice / particle model
- falling forces
- Sankey efficiency diagrams
- distance-time graph
- lever / fulcrum diagrams
- current-voltage graph
- series and parallel circuit diagrams

These SVGs are original redraws for study use and are stored locally in `assets/diagrams/`.


## Second-pass visual expansion

Version 1.3.0 adds another pass of original SVG support diagrams for higher-value science ideas that benefit from visual explanation, including DNA/genes/chromosomes, natural selection, xylem and phloem, polymers and composites, reactivity and extraction, moments, magnetic field lines, static charges, electromagnets, relays and the motor effect.


## PNG pack

Version 1.4.0 adds a first set of PNG educational support images for topics where a more photo-real or texture-based visual works better than vector graphics. These are wired into relevant cards in `data/year9-content.js`.


## PNG pack 2

Version 1.5.0 adds a second set of realistic PNG study images for topics such as natural selection, stomata, crystal growth, conductors and insulators, blast furnaces, metal oxide reduction, circuit comparison, and magnetic field patterns. These have been wired into the Year 9 content dataset.


## UI journey patch

Version 1.6.0 changes the app from a test-heavy dashboard into a focused revision journey. Cards can now be sorted into Mastered, Revisit, and Study. The Mastery check tests cards marked Mastered, while Revisit and Study open focused queues. The Reaction brand image is included in `assets/brand/`.


## Source fidelity patch

Version 1.7.0 adds source-style redraws for key visual quiz questions, tightens terminology for voltage/potential difference and gravitational-field-strength wording, adds card-level source-fidelity metadata, and switches PNG study image references to smaller WebP copies for faster loading.


## Class notes

Version 1.9.0 adds a class-notes layer. The **Study this** action now opens a context card with the big idea, key points, common mistakes and an example. The main hub also includes **Review Class Notes** for browsing notes by unit or learning objective.


## Enhanced class notes

Version 1.10.0 expands the class-note context cards with deeper explanations, memory hooks, quick self-checks, useful answer sentence starters, and follow-up practice prompts. The goal is to make “Study this” feel like a short teaching moment rather than a simple tag.


## v1.11.0 UI cleanup

This version simplifies the main hub and focused session flow: the brand block is blended into the background, route cards are compact status/action cards, the admin-style filter panel is hidden, and multiple-choice cards now automatically move to Mastered or Revisit based on the selected answer.
