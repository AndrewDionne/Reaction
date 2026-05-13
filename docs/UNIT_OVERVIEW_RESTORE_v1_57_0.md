# Unit overview restoration audit — v1.57.0

## Scope

Restore the unit overview pages originally introduced in the v1.50.0 replacement patch without rolling back the v1.55/v1.56 written exam bank work or the later image/content updates.

## Finding

The current app still contained:

- `notesBundle.unitOverviews` data for all six Year 9 units.
- Dashboard button markup using `data-unit-overview`.
- `openUnitOverviewContext(...)`.
- `renderUnitOverviewContext(...)`.
- Unit overview styling in `styles.css`.

The regression was the missing click-event binding for `[data-unit-overview]` inside `renderDashboard()`. The button could render, but it did not open the overview page.

## Fix applied

Reinstated the v1.50.0 event listener pattern:

```js
$$('[data-unit-overview]', els.unitDashboard).forEach((button) => {
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    openUnitOverviewContext(button.dataset.unitOverview);
  });
});
```

## Content preserved

The patch intentionally does not overwrite current `data/year9-notes.js` with the older v1.50.0 notes file. The current file already contains the overview records and includes later image/status updates from r152/r153.

Overview entries present:

- 9A Genetics and evolution
- 9B Plant growth
- 9E Making materials
- 9F Reactivity and extraction
- 9I Forces and motion
- 9J Force fields and electromagnets

## Regression protection checks

- Verified `data-unit-overview` button markup exists.
- Verified `[data-unit-overview]` event binding exists.
- Verified `openUnitOverviewContext` and `renderUnitOverviewContext` exist.
- Verified all six unit overview records are present in `data/year9-notes.js`.
- Ran content and release-readiness QA.

## Expected user behaviour

On the revision hub, each unit card with overview data displays a **📚 Unit overview** button. Pressing it opens the unit overview session page with revision-pack focus, formulae/equations where applicable, source-route coverage, visual coverage and exam-answer moves.
