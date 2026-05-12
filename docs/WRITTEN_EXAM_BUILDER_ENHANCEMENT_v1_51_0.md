# v1.51.0 Written Exam Builder Enhancement

## Purpose

This patch makes Written Exam Mode behave more like a real written test:

- each build generates a fresh mix of questions while preserving the Biology / Chemistry / Physics balance;
- answer-format support is available as an optional hint rather than being shown by default;
- mark schemes are hidden until the test is submitted;
- submitted tests move into a dedicated Mark Test screen;
- written questions show a small 1-5 difficulty bubble;
- the current written paper can be printed or saved as PDF from the browser print dialog.

## Changed files

- `app.js`
- `styles.css`
- `index.html`
- `data/year9-content.js`
- `data/year9-notes.js`
- `docs/CHANGELOG.md`
- `README.md`

## Exam builder behaviour

The builder still supports 15, 30 and 45 mark papers.

- 15 marks = 5 marks each for Biology, Chemistry and Physics.
- 30 marks = 10 marks each for Biology, Chemistry and Physics.
- 45 marks = 15 marks each for Biology, Chemistry and Physics.

For each domain, the builder now searches for exact mark combinations from the written question bank, scores them for command-word and difficulty spread, then randomly chooses from strong combinations. The final exam order is also shuffled.

For the 45 mark paper, the current bank uses every written question, so the question set is fixed but the order still changes. More written questions can be added later to make 45 mark papers vary by content as well.

## Test-taking phase

During the test:

- the mark scheme is not visible;
- the model answer is not visible;
- the credit checklist is not visible;
- the student can click `Answer format` to show the command-word hint;
- the student can save/print a blank PDF copy of the current paper.

## Mark-test phase

After submitting:

- the student sees their own answer;
- the model answer and credit checklist are shown;
- the student awards 0 to full marks;
- scores are summarised by Biology, Chemistry and Physics at the end.

## PDF behaviour

The app opens a browser print view. The user can then choose `Save as PDF` from the system print dialog.

Two print modes are available:

- blank test paper;
- answer key / self-mark copy after submission.

## QA performed

- `node --check app.js`
- `python3 tools/validate_content.py`
- manual exact-combination check for 5, 10 and 15 marks per domain

A Playwright browser smoke test was attempted, but the container does not have the Playwright browser executable installed. The implementation was therefore validated with static JavaScript syntax checks and the repository content validator.
