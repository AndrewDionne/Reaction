# Exam source comparison v1.71.2

## Source papers compared

This audit compares the two user-provided Year 9 practice exam examples.

- **Source exam 1**: logged as `YEAREND-PAPER-A` in `data/year9-exam-paper-bank.js`.
- **Source exam 2**: logged in this patch as `YEAREND-PAPER-D-SOURCE2`.

Note: the second paper cover states **80 marks**, but the visible question-block marks add to **88 marks**. The app preserves the visible question-block marks and stores the paper with `totalMarks: 88` and `printedTotalMarks: 80`.

## High-level structure overlap

Both papers use the same broad structure:

| Section | Source exam 1 | Source exam 2 | Trend |
|---|---|---|---|
| A Biology | 3 grouped questions | 3 grouped questions | Cells, photosynthesis/respiration, digestion/ecosystems recur. |
| B Chemistry | 3 grouped questions | 3 grouped questions | Atoms/periodic table, reactions, states/particles recur. |
| C Physics | 3 grouped questions | 3 grouped questions | Forces/motion, energy/electricity, waves/light/sound recur. |
| D Working scientifically | 2 grouped questions | 2 grouped questions | Graph/data handling plus practical variables/safety recur. |

## Strong repeated topics

These appear in both source papers and should be treated as high-priority exam-builder content.

| Topic | Source exam 1 examples | Source exam 2 examples | Builder recommendation |
|---|---|---|---|
| Cell structure and function | Prokaryotic/eukaryotic cells; mitochondria; root hair cell; diffusion; magnification | Plant vs animal cell structures; nucleus; tissue; red blood cell adaptation | Keep a recurring Biology Q1 block on cells/organisation with a mixture of recall, adaptation and one calculation/description where available. |
| Photosynthesis | Balanced symbol equation; limiting factor explanation; producer | Word equation; factors affecting rate; respiration importance | Include photosynthesis in every full paper, alternating equation recall, limiting factors and producer/respiration items. |
| Digestion / enzymes / food tests | Enzyme definition; optimum temperature; amylase; bile | Iodine test; starch colour change; small intestine function | Treat as a recurring Biology Q3 block; rotate enzymes, digestion organs and food tests. |
| Atomic structure | Proton/neutron/electron charges; isotope-style counts; groups/properties | Element definition; atom vs molecule; sodium-23 protons/neutrons/electrons | Include atomic structure in every Chemistry section, with at least one particle-count item. |
| Chemical reactions | Balancing Mg + O2; oxidation; acid + carbonate; exothermic/endothermic; temperature and rate | Neutral pH; acid + metal gas; acid + alkali; acid safety | Include equation/reaction-pattern recall and one short explanation about reaction behaviour/safety. |
| States/particles | Density equation/calculation; evaporation; gas diffusion | Solid particle arrangement; gas compression; condensation | Rotate density calculations with particle-model explanations. |
| Forces and motion | Speed equation; speed calculation; acceleration; distance-time gradient/horizontal line | Speed equation; speed calculation; balanced forces | Always include speed equation and calculation; rotate graph interpretation, acceleration and balanced forces. |
| Energy and electricity | Energy = power × time; current/potential difference; cells in series; wind power | Renewable resources; energy transfer; series circuit break; voltmeter | Include current/voltage/energy vocabulary and circuit behaviour in every Physics section. |
| Waves/light/sound | Wave equation; wave speed; reflection; pitch | Sound vs light; refraction; dispersion; sound in vacuum | Rotate wave equation/quantitative questions with light/sound concept questions. |
| Graphing | Temperature-time graph; rate from graph; estimate from graph | Distance-time graph; constant speed interpretation | Every full paper should include one graph plotting/interpreting question. |
| Practical variables and safety | Acid concentration and magnesium practical | Pondweed photosynthesis practical | Every full paper should include independent variable, dependent variable, controls, repeats/reliability and hazard/safety. |

## Command-word trends

Across both source papers, most sub-questions are short-answer items using these commands:

- **Name / state / what is meant by**: high frequency; tests direct recall and vocabulary.
- **Explain / describe**: moderate frequency; usually one concept in 1–3 sentences.
- **Calculate**: frequent but short; speed, density, acceleration, energy, wave speed, magnification.
- **Graph / plot / estimate**: appears in Working Scientifically.
- **Practical variables**: independent variable, dependent variable, control variables, repeats/reliability, hazard/safety.

The exam builder should therefore generate grouped questions with a larger share of recall/state questions than a pure written-explanation practice mode.

## Builder changes implied by the audit

1. Keep the grouped-question paper format. The second source exam strongly confirms that the format should be section → topic block → subparts `(a)`, `(b)`, `(c)`.
2. Keep Working Scientifically as a dedicated section.
3. Do not over-randomise topic structure. The repeated topic order is consistent enough that the app should preserve a stable skeleton and vary subparts.
4. Add paper variants that rotate difficulty:
   - Source exam 1 is closer to a higher-mark, more detailed paper.
   - Source exam 2 is shorter, more recall-heavy and closer to a normal practice paper.
5. Add a “Normal version” / “Challenge version” distinction later.

## Logged in the app

The second source exam has been added as:

- `YEAREND-PAPER-D-SOURCE2`
- Paper selector label: `Paper D · Source exam 2`
- Title: `Year 9 Science practice examination — normal version`

