# Written exam marking and section polish — v1.63.0

## Scope

This patch improves written-exam quality without changing the source-style wording of the question bank. It keeps the active written-exam pool at **301 prompts**: **32 curated visual prompts** and **269 derived open-answer prompts**.

## Implemented

- Generated written exams are now ordered into three student-facing sections:
  - **Section A** — Core knowledge
  - **Section B** — Written reasoning
  - **Section C** — Data and calculations
- The hidden command metadata still drives answer-format support, but command labels remain hidden on the question card.
- The **Answer format** panel now gives sharper command-specific structure support only when the student opens the hint.
- The post-submit mark scheme now shows:
  - the student's answer
  - model answer
  - credit checklist
  - answer-structure check
  - key words/actions
  - common mistakes
  - self-mark buttons as `mark/total`
- Low self-marks on derived questions can add the linked study card to **Revisit**.
- Derived-card credit checklists are tied more closely to the model answer while still accepting equivalent wording.

## Guardrails

- Student-facing question text changed: **0**
- Study cards deleted: **0**
- Active written-exam prompts: **301**
- 15 / 30 / 45 mark exact Biology-Chemistry-Physics papers remain possible.

## Hidden command distribution

| Command | Count |
|---|---:|
| explain | 115 |
| state | 65 |
| describe | 55 |
| calculate | 32 |
| identify | 29 |
| graph | 5 |

## Student-facing section distribution

| Section | Count |
|---|---:|
| Section A | 94 |
| Section C | 42 |
| Section B | 165 |

## Files

- `docs/WRITTEN_EXAM_MARKING_SUPPORT_BANK_v1_63_0.csv`
- `docs/WRITTEN_EXAM_SECTION_BALANCE_v1_63_0.csv`
- `docs/WRITTEN_EXAM_QUESTION_TEXT_DIFF_v1_63_0.csv`
