# Exam paper builder v1.71.0

## Purpose

Adds a year-end paper format that matches the uploaded example more closely than the existing one-card-at-a-time written mode.

## New files

- `data/year9-exam-paper-bank.js`
- `exam-paper.html`

## Format added

The new paper is grouped into:

- Section A: Biology
- Section B: Chemistry
- Section C: Physics
- Section D: Working scientifically

Each question block has:

- section heading
- numbered topic title
- total marks in square brackets
- sub-questions labelled `(a)`, `(b)`, `(c)`
- lined answer space
- graph grid for the Working scientifically graph question
- separate answer key
- print / save PDF button

## Current scope

This patch adds one complete sample paper based directly on the uploaded year-end exam example. It does not yet randomise the paper or generate multiple variants.

## Recommended next patch

- Add a second and third paper variant using the same data structure.
- Add section-practice mode: Biology / Chemistry / Physics / Working scientifically.
- Add a random paper generator once the fixed format is accepted.
