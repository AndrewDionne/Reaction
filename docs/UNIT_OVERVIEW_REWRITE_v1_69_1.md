# Unit overview rewrite v1.69.1

## Purpose

The unit overview mode has been rewritten as a student-facing revision guide rather than a development/status dashboard. The content now gives each unit:

- a short learning overview
- a clear list of end-of-unit objectives
- sub-unit sections with must-know points
- key formulae/equations where useful
- useful visuals shown at readable size
- answer-writing tips for written responses

## Source alignment

The rewrite was aligned to the uploaded `Year 9 science.zip` materials:

- 9A: `9A assess yourself.pdf`, `9A summary sheet.pdf`, `9A quick quiz.pdf`
- 9B: `9B Assess yourself.pdf`, `9B Summary sheet.pdf`, `9B quick quizz.pdf`
- 9E: `9E assess yourself.pdf`, `9E summary sheet.pdf`, `9E quick quiz.pdf`
- 9F: `9F assess yourself.pdf`, `9F summary sheet.pdf`, `9F quick quiz.pdf`
- 9I: `9I assess yourself.pdf`, `9I summary sheet.pdf`, `9I quick quiz.pdf`
- 9J: no `assess yourself` PDF was present in the upload, so 9J was aligned to `9J summary sheet.pdf`, `9J quick QUIZ.pdf` and the 9J PowerPoint topics.

## Content changes

### 9A Genetics and evolution

Sub-units now focus on:

1. variation and classification
2. inheritance, DNA and genes
3. adaptation, natural selection and evolution
4. biodiversity, conservation and extinction

The objectives now match the assess-yourself criteria: variation, inherited/environmental examples, extinction, Triceratops-style adaptation/evidence, DNA hierarchy and natural selection.

### 9B Plant growth

Sub-units now focus on:

1. photosynthesis
2. plant organs and transport
3. uses of glucose and plant growth
4. farming yield and environmental impact

The objectives now match the assess-yourself criteria: plant resources, photosynthesis, leaves/roots/stems, crop chemicals, fertilisers, pesticides, glucose uses, chlorophyll, limiting factors and farming environmental problems.

### 9E Making materials

Sub-units now focus on:

1. material families and uses
2. structure, bonding and polymerisation
3. environmental impact and recycling
4. energy changes and peer review

The objectives now match the assess-yourself criteria: conductors/insulators, ceramics/polymers/composites, biodegradable polymers, landfill, fossil-fuel pollution, acid rain, greenhouse effect, biomagnification, recycling, thermal decomposition and exothermic/endothermic reactions.

### 9F Reactivity and extraction

Sub-units now focus on:

1. chemical reactions and equations
2. reactivity and displacement
3. metal extraction and the blast furnace
4. rusting and corrosion protection
5. combustion, rates and energy changes

The objectives now match the assess-yourself criteria around iron extraction and rusting, while preserving the active app coverage for reactivity, equations, redox and combustion from the summary materials.

### 9I Forces and motion

Sub-units now focus on:

1. forces and terminal velocity
2. speed and distance-time graphs
3. speed-time graphs and relative speed
4. levers, moments and balance
5. work, energy and simple machines

The previous pressure/density emphasis was removed from the overview because it is not present in the uploaded 9I assess-yourself/summary/quick-quiz materials. The pressure/density cards and assets were not deleted.

### 9J Force fields and electromagnets

Sub-units now focus on:

1. force fields, gravity and magnetism
2. static electricity and electric fields
3. current, voltage and circuits
4. resistance and wire investigations
5. electromagnets, relays and motors

This is aligned to the 9J summary sheets and quick quiz because no 9J assess-yourself sheet was included.

## UI changes

- Removed the top overview badges such as unit name, sub-unit count and note-page count.
- Removed `READY`/status pills from the skills section.
- Replaced development-style headings with student-facing headings:
  - `By the end of this unit, you should be able to...`
  - `Sub-units and must-know points`
  - `Useful visuals`
  - `Practise these skills`
  - `How to write better answers`
- Visuals now render in a single column at full width with no forced crop, so text inside images is much more readable.

## Image replacement notes

The overview now avoids several dense images that were not readable when shown as two-column tiles. Some images remain useful as class-note assets but should be remade before relying on them as overview visuals.

See `docs/UNIT_OVERVIEW_IMAGE_REPLACEMENT_AUDIT_v1_69_1.csv` for the replacement list.
