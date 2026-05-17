
(() => {
  const content = window.YEAR9_CONTENT || { units: [], questions: [] };
  const questions = Array.isArray(content.cards) ? content.cards : [];
  const units = Array.isArray(content.units) ? content.units : [];
  const learningObjectives = Array.isArray(content.learningObjectives) ? content.learningObjectives : [];
  const notesBundle = window.YEAR9_NOTES || { notes: [] };
  const classNotes = Array.isArray(notesBundle.notes) ? notesBundle.notes : [];
  const unitOverviews = Array.isArray(notesBundle.unitOverviews) ? notesBundle.unitOverviews : [];
  const STORAGE_KEY = "reaction-y9-progress-v2";
  const LEGACY_STORAGE_KEY = "year9-science-study-progress-v1";
  const QUESTION_SET_SIZE_OPTIONS = [10, 20, 30, 40, "all"];
  const QUESTION_SET_DEFAULTS = { practice: 20, test: 20 };
  const SUBJECT_UNITS = {
    biology: ["9A", "9B"],
    chemistry: ["9E", "9F"],
    physics: ["9I", "9J"],
  };
  const SUBJECT_ORDER = ["biology", "chemistry", "physics"];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const byId = (id) => document.getElementById(id);

  const els = {
    homeLink: byId("homeLink"),
    hubView: byId("hubView"),
    sessionView: byId("sessionView"),
    backToHub: byId("backToHub"),
    unitFilter: byId("unitFilter"),
    objectiveFilter: byId("objectiveFilter"),
    typeFilter: byId("typeFilter"),
    levelFilter: byId("levelFilter"),
    searchBox: byId("searchBox"),
    shuffleButton: byId("shuffleButton"),
    unitDashboard: byId("unitDashboard"),
    notesDashboard: byId("notesDashboard"),
    routeEntryButton: byId("routeEntryButton"),
    selectionSummary: byId("selectionSummary"),
    selectionDetail: byId("selectionDetail"),
    studyPanel: byId("studyPanel"),
    resultPanel: byId("resultPanel"),
    totalCardCount: byId("totalCardCount"),
    journeyCount: byId("journeyCount"),
    xpStat: byId("xpStat"),
    streakStat: byId("streakStat"),
    masteredStat: byId("masteredStat"),
    hubMasteredStat: byId("hubMasteredStat"),
    revisitStat: byId("revisitStat"),
    hubRevisitStat: byId("hubRevisitStat"),
    hubRevisitTestStat: byId("hubRevisitTestStat"),
    studyStat: byId("studyStat"),
    hubStudyStat: byId("hubStudyStat"),
    soundToggle: byId("soundToggle"),
    exportProgress: byId("exportProgress"),
    importProgressFile: byId("importProgressFile"),
    canvas: byId("burstCanvas"),
    sessionEyebrow: byId("sessionEyebrow"),
    sessionTitle: byId("sessionTitle"),
    sessionSubtitle: byId("sessionSubtitle"),
    sessionIndex: byId("sessionIndex"),
    sessionTotal: byId("sessionTotal"),
    sessionUnitArt: byId("sessionUnitArt"),
    answerFormatHelpButton: byId("answerFormatHelpButton"),
    reviewSheetButton: byId("reviewSheetButton"),
    answerFormatModal: byId("answerFormatModal"),
  };

  const modeText = {
    practice: {
      eyebrow: "Revision journey",
      title: "Revision journey",
      subtitle: "Flexible learn-as-you-go practice with feedback, class notes, Secure and Revisit sorting.",
      empty: "No questions match these filters.",
    },
    revisit: {
      eyebrow: "Revisit queue",
      title: "Revisit questions",
      subtitle: "Practise the questions you want to come back to.",
      empty: "No Revisit questions match these filters yet.",
    },
    "revisit-test": {
      eyebrow: "Revisit test",
      title: "Test your Revisit questions",
      subtitle: "Build a test from the questions currently in Revisit.",
      empty: "No Revisit questions match these filters yet.",
    },
    study: {
      eyebrow: "Need notes queue",
      title: "Review with notes",
      subtitle: "Review questions where class notes would help.",
      empty: "No questions are marked for notes with these filters.",
    },
    "unit-test": {
      eyebrow: "End of unit test",
      title: "End of unit written test",
      subtitle: "Build a written test from one selected unit. No multiple-choice questions are included.",
      empty: "Choose one unit to build an end of unit test.",
    },
    written: {
      eyebrow: "Written exam practice",
      title: "Written exam practice",
      subtitle: "Build a written-answer paper with balanced Biology, Chemistry and Physics marks.",
      empty: "No written questions are available for this selection.",
    },
    exam: {
      eyebrow: "Exam mode",
      title: "Exam mode",
      subtitle: "Open a normal 80-mark source-style written paper. Digital answers come first; print/PDF is secondary.",
      empty: "No exam paper is available.",
    },
    test: {
      eyebrow: "Test your knowledge",
      title: "Test your knowledge",
      subtitle: "Use selected units or sub-units. Answers stay locked until the test is submitted.",
      empty: "No questions match these filters.",
    },
  };

  const REVIEW_CATEGORIES = ["formulas", "vocabulary", "concepts", "questions"];
  const REVIEW_CATEGORY_LABELS = {
    formulas: "Formulas",
    vocabulary: "Vocabulary",
    concepts: "Concepts",
    questions: "Questions",
  };

  function emptyReviewSheet() {
    return REVIEW_CATEGORIES.reduce((sheet, category) => {
      sheet[category] = [];
      return sheet;
    }, {});
  }

  function normalizeReviewCategory(category) {
    const clean = String(category || "concepts").toLowerCase().trim();
    if (["formula", "formulae", "equation", "equations", "memorize", "memorise"].includes(clean)) return "formulas";
    if (["vocab", "term", "terms", "definition", "definitions"].includes(clean)) return "vocabulary";
    if (["question", "questions", "review-question"].includes(clean)) return "questions";
    return REVIEW_CATEGORIES.includes(clean) ? clean : "concepts";
  }

  function normalizeReviewSheet(raw) {
    const sheet = emptyReviewSheet();
    if (!raw || typeof raw !== "object") return sheet;
    REVIEW_CATEGORIES.forEach((category) => {
      const items = Array.isArray(raw[category]) ? raw[category] : [];
      sheet[category] = items.map((item) => ({
        id: String(item?.id || "").trim(),
        category,
        unit: String(item?.unit || "").trim(),
        source: String(item?.source || "").trim(),
        title: String(item?.title || "").trim(),
        text: String(item?.text || "").trim(),
        detail: String(item?.detail || "").trim(),
        noteId: String(item?.noteId || "").trim(),
        questionId: String(item?.questionId || "").trim(),
        qid: String(item?.qid || "").trim(),
        answer: String(item?.answer || "").trim(),
        addedAt: String(item?.addedAt || "").trim(),
      })).filter((item) => item.id && (item.text || item.title));
    });
    return sheet;
  }


  const state = {
    mode: "practice",
    selectedMode: "practice",
    selectedUnits: new Set(),
    selectedObjectives: new Set(),
    deck: [],
    index: 0,
    revealed: false,
    selectedChoice: null,
    choiceOrder: null,
    test: null,
    written: null,
    session: null,
    noteContext: null,
    definitionInput: "",
    definitionCompared: false,
    definitionReview: null,
    sound: true,
    progress: loadProgress(),
    reviewSelection: null,
    reviewCandidates: {},
    reviewNotice: "",
  };

  function isTestMode(mode = state.mode) {
    return mode === "test" || mode === "revisit-test";
  }


  const WRITTEN_EXAM_BANK = [
    {
        "id": "we-bio-state-photosynthesis-equation",
        "domain": "biology",
        "unit": "9B",
        "commandWord": "state",
        "marks": 1,
        "difficulty": 1,
        "skills": [
            "recall",
            "equation"
        ],
        "question": "State the word equation for photosynthesis.",
        "answerFrame": "One short equation only.",
        "modelAnswer": "carbon dioxide + water → glucose + oxygen",
        "markScheme": [
            "1 mark for carbon dioxide + water → glucose + oxygen."
        ],
        "keywords": [
            "carbon dioxide",
            "water",
            "glucose",
            "oxygen"
        ],
        "commonMistakes": [
            "Do not write the respiration equation.",
            "Do not miss out glucose."
        ],
        "answerStructure": [
            "Write the reactants.",
            "Add the arrow.",
            "Write the products."
        ]
    },
    {
        "id": "we-bio-identify-glucose-uses",
        "domain": "biology",
        "unit": "9B",
        "commandWord": "identify",
        "marks": 3,
        "difficulty": 2,
        "skills": [
            "visual",
            "identify",
            "diagram"
        ],
        "question": "Use the glucose map. Identify three ways a plant can use glucose.",
        "answerFrame": "Use three short bullet points.",
        "modelAnswer": "Glucose can be used in respiration, stored as starch and used to make cellulose for cell walls. It can also be used to make lipids/oils and proteins with mineral ions.",
        "markScheme": [
            "1 mark for each correct use of glucose, up to 3 marks."
        ],
        "keywords": [
            "respiration",
            "starch",
            "cellulose",
            "lipids",
            "oils",
            "proteins"
        ],
        "commonMistakes": [
            "Do not say glucose is only made, not used.",
            "Do not confuse glucose with oxygen."
        ],
        "answerStructure": [
            "Bullet 1: first use.",
            "Bullet 2: second use.",
            "Bullet 3: third use."
        ],
        "media": [
            {
                "src": "assets/webp/9B-glucose-uses-question-v151.webp",
                "alt": "Question-safe glucose use map with branches labelled A to E.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-bio-describe-photosynthesis-light-graph",
        "domain": "biology",
        "unit": "9B",
        "commandWord": "describe",
        "marks": 3,
        "difficulty": 3,
        "skills": [
            "visual",
            "graph",
            "describe"
        ],
        "question": "Use the graph. Describe how light intensity affects the rate of photosynthesis.",
        "answerFrame": "Describe the trend in two parts.",
        "modelAnswer": "As light intensity increases, the rate of photosynthesis increases. At higher light intensity the graph levels off, so increasing light further does not increase the rate much. This is because another factor becomes limiting.",
        "markScheme": [
            "1 mark for rate increasing at first.",
            "1 mark for graph levelling off/plateauing.",
            "1 mark for another factor becoming limiting."
        ],
        "keywords": [
            "light intensity",
            "rate",
            "increases",
            "levels off",
            "limiting factor"
        ],
        "commonMistakes": [
            "Do not say the rate keeps increasing forever.",
            "Do not ignore the plateau."
        ],
        "answerStructure": [
            "Say the first trend.",
            "Say what happens at high light intensity.",
            "Give the reason if asked to explain."
        ],
        "media": [
            {
                "src": "assets/webp/9B-photosynthesis-light-graph-blank.webp",
                "alt": "Question-safe graph of rate of photosynthesis against light intensity.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-bio-explain-magnesium-deficiency",
        "domain": "biology",
        "unit": "9B",
        "commandWord": "explain",
        "marks": 3,
        "difficulty": 3,
        "skills": [
            "explain",
            "cause-effect"
        ],
        "question": "Explain why a plant may grow poorly if it does not get enough magnesium ions.",
        "answerFrame": "Use because/so to link magnesium to growth.",
        "modelAnswer": "Magnesium is needed to make chlorophyll. Chlorophyll absorbs light for photosynthesis. With less chlorophyll, the plant photosynthesises less and makes less glucose for growth.",
        "markScheme": [
            "1 mark for magnesium being needed to make chlorophyll.",
            "1 mark for chlorophyll absorbing light/being needed for photosynthesis.",
            "1 mark for reduced photosynthesis/glucose/growth."
        ],
        "keywords": [
            "magnesium",
            "chlorophyll",
            "light",
            "photosynthesis",
            "glucose",
            "growth"
        ],
        "commonMistakes": [
            "Do not say magnesium is the food itself.",
            "Link the ion to photosynthesis and growth."
        ],
        "answerStructure": [
            "Point: magnesium role.",
            "Because: chlorophyll/photosynthesis.",
            "Result: less glucose/growth."
        ]
    },
    {
        "id": "we-bio-describe-natural-selection-giraffes",
        "domain": "biology",
        "unit": "9A",
        "commandWord": "explain",
        "marks": 4,
        "difficulty": 4,
        "skills": [
            "visual",
            "explain",
            "process"
        ],
        "question": "Use the giraffe image. Explain how natural selection could lead to longer necks becoming more common over many generations.",
        "answerFrame": "Write the chain in order: variation → advantage → reproduction → inherited change.",
        "modelAnswer": "There is variation in neck length in the giraffe population. Giraffes with longer necks can reach more food, so they are more likely to survive. They reproduce and pass on alleles for longer necks. Over many generations, long necks become more common in the population.",
        "markScheme": [
            "1 mark for variation in the population.",
            "1 mark for the advantageous characteristic improving survival.",
            "1 mark for survivors reproducing/passing on alleles.",
            "1 mark for the characteristic becoming more common over generations."
        ],
        "keywords": [
            "variation",
            "advantage",
            "survive",
            "reproduce",
            "pass on",
            "generations"
        ],
        "commonMistakes": [
            "Do not say individual giraffes stretch and pass on stretched necks.",
            "Natural selection acts over generations."
        ],
        "answerStructure": [
            "Variation.",
            "Selection pressure/advantage.",
            "Survival and reproduction.",
            "Inherited change over generations."
        ],
        "media": [
            {
                "src": "assets/webp/9A-natural-selection-giraffes.webp",
                "alt": "Giraffes of different neck lengths feeding near a tree.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-bio-describe-biodiversity-conservation",
        "domain": "biology",
        "unit": "9A",
        "commandWord": "describe",
        "marks": 3,
        "difficulty": 3,
        "skills": [
            "visual",
            "describe",
            "identify"
        ],
        "question": "Use the biodiversity diagram. Describe two causes of extinction risk and one way biodiversity can be preserved.",
        "answerFrame": "Use three bullet points.",
        "modelAnswer": "Habitat destruction and climate change can put species at risk of extinction. Biodiversity can be preserved using nature reserves, breeding programmes, hunting bans or seed/gene banks.",
        "markScheme": [
            "1 mark for a valid cause of extinction risk.",
            "1 mark for a second valid cause.",
            "1 mark for a valid preservation method."
        ],
        "keywords": [
            "habitat destruction",
            "climate change",
            "pollution",
            "hunting",
            "invasive species",
            "nature reserve",
            "breeding programme",
            "gene bank"
        ],
        "commonMistakes": [
            "Do not only name endangered animals; state causes or methods.",
            "Use examples from the diagram."
        ],
        "answerStructure": [
            "Cause 1.",
            "Cause 2.",
            "Preservation method."
        ],
        "media": [
            {
                "src": "assets/webp/9A-biodiversity-extinction-conservation-question-v151.webp",
                "alt": "Question-safe biodiversity diagram showing extinction causes and preservation methods.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-bio-explain-farming-method-impact",
        "domain": "biology",
        "unit": "9B",
        "commandWord": "explain",
        "marks": 3,
        "difficulty": 3,
        "skills": [
            "visual",
            "explain",
            "benefit-problem"
        ],
        "question": "Use the farming table. Choose one farming method and explain one benefit and one environmental problem.",
        "answerFrame": "Name the method, then give one benefit and one problem.",
        "modelAnswer": "Using fertilisers helps crops grow because it adds mineral ions to the soil. However, fertiliser runoff can enter rivers and cause algal growth, reducing oxygen and harming aquatic animals.",
        "markScheme": [
            "1 mark for naming a suitable farming method.",
            "1 mark for a linked benefit/increased yield idea.",
            "1 mark for a linked environmental problem."
        ],
        "keywords": [
            "fertiliser",
            "pesticide",
            "greenhouse",
            "yield",
            "habitat",
            "biodiversity",
            "pollution"
        ],
        "commonMistakes": [
            "Do not give only benefits.",
            "Link the problem to the method chosen."
        ],
        "answerStructure": [
            "Method.",
            "Benefit.",
            "Environmental problem."
        ],
        "media": [
            {
                "src": "assets/webp/9B-farming-yield-methods-question-v151.webp",
                "alt": "Question-safe farming methods table with blank benefit and drawback areas.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-bio-describe-food-web-pesticide",
        "domain": "biology",
        "unit": "9B",
        "commandWord": "describe",
        "marks": 3,
        "difficulty": 3,
        "skills": [
            "visual",
            "describe",
            "ecosystem"
        ],
        "question": "Use the food web. Describe what may happen if pesticides reduce the number of insects.",
        "answerFrame": "Write 2–3 linked sentences.",
        "modelAnswer": "If insects decrease, animals that eat insects have less food and may decrease. Predators that feed on those animals may also decrease. This can affect the balance of the food web.",
        "markScheme": [
            "1 mark for insects decreasing.",
            "1 mark for insect-eaters having less food/decreasing.",
            "1 mark for a knock-on effect on higher predators or the food web."
        ],
        "keywords": [
            "insects",
            "less food",
            "predator",
            "decrease",
            "food web"
        ],
        "commonMistakes": [
            "Do not describe only one organism if the question asks about the food web.",
            "Use linked consequences."
        ],
        "answerStructure": [
            "Initial change.",
            "Direct effect.",
            "Knock-on effect."
        ],
        "media": [
            {
                "src": "assets/webp/9B-food-web-population-changes-blank-v2.webp",
                "alt": "Question-safe food web diagram for population change questions.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-bio-explain-bioaccumulation-top-predator",
        "domain": "biology",
        "unit": "9B",
        "commandWord": "explain",
        "marks": 3,
        "difficulty": 4,
        "skills": [
            "visual",
            "explain",
            "ecosystem"
        ],
        "question": "Use the food-chain diagram. Explain why the top predator has the highest toxin concentration.",
        "answerFrame": "Use the words toxin, food chain and concentration.",
        "modelAnswer": "Toxins build up in organisms and are passed along the food chain when organisms are eaten. Each predator eats many prey, so more toxin accumulates at each level. The top predator has the highest concentration because it is at the end of the food chain.",
        "markScheme": [
            "1 mark for toxins being passed along the food chain.",
            "1 mark for toxin building up/increasing at each level.",
            "1 mark for top predators eating many contaminated organisms/highest concentration."
        ],
        "keywords": [
            "toxin",
            "food chain",
            "build up",
            "concentration",
            "top predator"
        ],
        "commonMistakes": [
            "Do not say the toxin is made by the predator.",
            "Explain the build-up along the chain."
        ],
        "answerStructure": [
            "Toxin enters food chain.",
            "Toxin builds up at each level.",
            "Top predator has highest concentration."
        ],
        "media": [
            {
                "src": "assets/webp/9B-bioaccumulation-food-chain-blank-v3.webp",
                "alt": "Question-safe food chain diagram showing toxin particles increasing along the food chain.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-bio-identify-root-hair-adaptations",
        "domain": "biology",
        "unit": "9B",
        "commandWord": "identify",
        "marks": 2,
        "difficulty": 2,
        "skills": [
            "visual",
            "identify"
        ],
        "question": "Use the root hair cell diagram. Identify two adaptations that help it absorb water and mineral ions.",
        "answerFrame": "Use two bullet points.",
        "modelAnswer": "Root hair cells have a long hair-like extension that gives a large surface area. They also have a thin cell wall/short diffusion distance for absorption.",
        "markScheme": [
            "1 mark for large surface area/long extension.",
            "1 mark for thin cell wall/short diffusion distance or another valid adaptation."
        ],
        "keywords": [
            "root hair cell",
            "large surface area",
            "thin cell wall",
            "absorb",
            "mineral ions"
        ],
        "commonMistakes": [
            "Do not give adaptations of palisade cells.",
            "Link the adaptation to absorption."
        ],
        "answerStructure": [
            "Adaptation 1.",
            "Adaptation 2."
        ],
        "media": [
            {
                "src": "assets/webp/9B-root-hair-cell-base.webp",
                "alt": "Root hair cell diagram for identifying adaptations.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-bio-identify-leaf-transport-features",
        "domain": "biology",
        "unit": "9B",
        "commandWord": "identify",
        "marks": 2,
        "difficulty": 2,
        "skills": [
            "visual",
            "identify"
        ],
        "question": "Use the plant transport diagram. Identify the tissue that carries water and the opening that lets carbon dioxide enter the leaf.",
        "answerFrame": "Use two short bullet points.",
        "modelAnswer": "Xylem carries water through the plant. Stomata are openings that let carbon dioxide diffuse into the leaf.",
        "markScheme": [
            "1 mark for xylem carrying water.",
            "1 mark for stomata allowing carbon dioxide to enter."
        ],
        "keywords": [
            "xylem",
            "water",
            "stomata",
            "carbon dioxide",
            "diffusion"
        ],
        "commonMistakes": [
            "Do not say phloem carries water.",
            "Stomata are openings, not food stores."
        ],
        "answerStructure": [
            "Water transport tissue.",
            "Carbon dioxide entry feature."
        ],
        "media": [
            {
                "src": "assets/webp/9B-plant-transport-process.webp",
                "alt": "Plant transport diagram showing roots, xylem and leaf gas exchange.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-chem-state-neutralisation-products",
        "domain": "chemistry",
        "unit": "9F",
        "commandWord": "state",
        "marks": 1,
        "difficulty": 1,
        "skills": [
            "recall",
            "equation"
        ],
        "question": "State the products of a neutralisation reaction between an acid and an alkali.",
        "answerFrame": "One short sentence.",
        "modelAnswer": "The products are a salt and water.",
        "markScheme": [
            "1 mark for salt and water."
        ],
        "keywords": [
            "salt",
            "water"
        ],
        "commonMistakes": [
            "Do not write carbon dioxide unless the acid reacts with a carbonate."
        ],
        "answerStructure": [
            "State the two products."
        ]
    },
    {
        "id": "we-chem-identify-state-symbols",
        "domain": "chemistry",
        "unit": "9E",
        "commandWord": "identify",
        "marks": 2,
        "difficulty": 2,
        "skills": [
            "recall",
            "identify"
        ],
        "question": "Identify what the state symbols (s) and (aq) mean in chemical equations.",
        "answerFrame": "Use two bullet points.",
        "modelAnswer": "(s) means solid. (aq) means aqueous, which means dissolved in water.",
        "markScheme": [
            "1 mark for (s) = solid.",
            "1 mark for (aq) = aqueous/dissolved in water."
        ],
        "keywords": [
            "solid",
            "aqueous",
            "dissolved in water"
        ],
        "commonMistakes": [
            "Do not confuse aq with gas or liquid."
        ],
        "answerStructure": [
            "Define (s).",
            "Define (aq)."
        ]
    },
    {
        "id": "we-chem-describe-peer-review-process",
        "domain": "chemistry",
        "unit": "9E",
        "commandWord": "describe",
        "marks": 3,
        "difficulty": 3,
        "skills": [
            "visual",
            "describe",
            "process"
        ],
        "question": "Use the peer-review diagram. Describe the peer-review process in science.",
        "answerFrame": "Write the process in order.",
        "modelAnswer": "A scientist writes a paper and submits it to a scientific journal. The editor sends it to expert reviewers. The reviewers check the method, evidence, originality and conclusions before the paper is accepted, revised or rejected.",
        "markScheme": [
            "1 mark for paper being submitted to a journal/editor.",
            "1 mark for expert reviewers checking the work.",
            "1 mark for an outcome such as accepted/revised/rejected or improved reliability."
        ],
        "keywords": [
            "paper",
            "journal",
            "editor",
            "expert reviewers",
            "method",
            "evidence",
            "accepted",
            "revised",
            "rejected"
        ],
        "commonMistakes": [
            "Do not say peer review is done by classmates.",
            "Mention experts checking the evidence or method."
        ],
        "answerStructure": [
            "Submission.",
            "Expert checking.",
            "Outcome."
        ],
        "media": [
            {
                "src": "assets/webp/9E-peer-review-process-question-v151.webp",
                "alt": "Question-safe peer review process flowchart.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-chem-identify-exothermic-endothermic",
        "domain": "chemistry",
        "unit": "9E",
        "commandWord": "identify",
        "marks": 2,
        "difficulty": 2,
        "skills": [
            "visual",
            "identify",
            "energy"
        ],
        "question": "Use the two energy-transfer diagrams. Identify which change is exothermic and which is endothermic.",
        "answerFrame": "Use one sentence or two bullet points.",
        "modelAnswer": "The diagram with energy transferred to the surroundings is exothermic. The diagram with energy taken in from the surroundings is endothermic.",
        "markScheme": [
            "1 mark for identifying the exothermic diagram.",
            "1 mark for identifying the endothermic diagram."
        ],
        "keywords": [
            "exothermic",
            "endothermic",
            "surroundings",
            "energy transfer"
        ],
        "commonMistakes": [
            "Do not focus only on the colour; use the direction of energy transfer.",
            "Exothermic warms the surroundings; endothermic cools the surroundings."
        ],
        "answerStructure": [
            "Identify exothermic.",
            "Identify endothermic."
        ],
        "media": [
            {
                "src": "assets/webp/9E-exothermic-endothermic-question-v151.webp",
                "alt": "Question-safe comparison of two reaction containers with energy transfer arrows and thermometer readings.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-chem-describe-displacement-reaction",
        "domain": "chemistry",
        "unit": "9F",
        "commandWord": "describe",
        "marks": 3,
        "difficulty": 3,
        "skills": [
            "visual",
            "describe",
            "reactivity"
        ],
        "question": "Use the displacement reaction diagram. Describe what happens when magnesium is added to copper sulfate solution.",
        "answerFrame": "Use reactivity language and say what forms.",
        "modelAnswer": "Magnesium is more reactive than copper, so magnesium displaces copper from copper sulfate. Magnesium forms magnesium sulfate in solution. Copper forms as a solid deposit.",
        "markScheme": [
            "1 mark for magnesium being more reactive than copper.",
            "1 mark for magnesium displacing copper/forming magnesium sulfate.",
            "1 mark for copper being formed/deposited."
        ],
        "keywords": [
            "magnesium",
            "copper sulfate",
            "more reactive",
            "displaces",
            "copper",
            "deposit"
        ],
        "commonMistakes": [
            "Do not say copper displaces magnesium.",
            "Compare reactivity first."
        ],
        "answerStructure": [
            "Compare reactivity.",
            "State displacement.",
            "State product/observation."
        ],
        "media": [
            {
                "src": "assets/webp/9F-displacement-reaction-clean-v2.webp",
                "alt": "Before and after displacement reaction diagram for magnesium and copper sulfate.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-chem-explain-reactivity-extraction",
        "domain": "chemistry",
        "unit": "9F",
        "commandWord": "explain",
        "marks": 3,
        "difficulty": 4,
        "skills": [
            "visual",
            "explain",
            "decision"
        ],
        "question": "Use the reactivity series. Explain why aluminium is extracted by electrolysis but iron can be extracted using carbon.",
        "answerFrame": "Compare each metal with carbon.",
        "modelAnswer": "Aluminium is more reactive than carbon, so carbon cannot remove oxygen from aluminium oxide. Aluminium must therefore be extracted by electrolysis. Iron is less reactive than carbon, so carbon can reduce iron oxide and extract iron.",
        "markScheme": [
            "1 mark for aluminium being above/more reactive than carbon.",
            "1 mark for aluminium needing electrolysis/carbon cannot reduce it.",
            "1 mark for iron being below/less reactive than carbon so carbon reduction works."
        ],
        "keywords": [
            "reactivity series",
            "carbon",
            "aluminium",
            "electrolysis",
            "iron",
            "reduction"
        ],
        "commonMistakes": [
            "Do not choose extraction method from metal price or melting point.",
            "Use the position relative to carbon."
        ],
        "answerStructure": [
            "Aluminium compared with carbon.",
            "Extraction method for aluminium.",
            "Iron compared with carbon and extraction method."
        ],
        "media": [
            {
                "src": "assets/webp/9F-reactivity-series-question-safe-v2.webp",
                "alt": "Question-safe reactivity series diagram arranged from most reactive to least reactive.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-chem-explain-thermite-redox",
        "domain": "chemistry",
        "unit": "9F",
        "commandWord": "explain",
        "marks": 4,
        "difficulty": 5,
        "skills": [
            "explain",
            "redox"
        ],
        "question": "In the thermite reaction, aluminium reacts with iron oxide to make aluminium oxide and iron. Explain which substance is oxidised and which is reduced.",
        "answerFrame": "Use gain/loss of oxygen.",
        "modelAnswer": "Aluminium gains oxygen to form aluminium oxide, so aluminium is oxidised. Iron oxide loses oxygen to form iron, so iron oxide is reduced. Oxidation and reduction happen together in the reaction.",
        "markScheme": [
            "1 mark for aluminium gaining oxygen.",
            "1 mark for aluminium being oxidised.",
            "1 mark for iron oxide losing oxygen/being reduced.",
            "1 mark for recognising oxidation and reduction together."
        ],
        "keywords": [
            "aluminium",
            "iron oxide",
            "oxygen",
            "oxidised",
            "reduced"
        ],
        "commonMistakes": [
            "Do not define oxidation as only reacting with air.",
            "Use gain/loss of oxygen."
        ],
        "answerStructure": [
            "Aluminium change.",
            "Iron oxide change.",
            "Name oxidation and reduction."
        ],
        "media": [
            {
                "src": "assets/webp/9F-heating-metal-oxide.webp",
                "alt": "Heating metal oxide reaction context for redox/extraction questions.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-chem-describe-recycling-method",
        "domain": "chemistry",
        "unit": "9E",
        "commandWord": "describe",
        "marks": 3,
        "difficulty": 3,
        "skills": [
            "visual",
            "describe",
            "environment"
        ],
        "question": "Use the recycling diagram. Describe how one material is recycled and give one benefit of recycling.",
        "answerFrame": "Name the material, describe the process, then give a benefit.",
        "modelAnswer": "Glass can be collected, sorted, crushed, melted and remade into new glass products. Recycling reduces landfill and reduces the need for new raw materials.",
        "markScheme": [
            "1 mark for naming a recyclable material.",
            "1 mark for describing a valid recycling process step/sequence.",
            "1 mark for a valid benefit such as less landfill, less pollution, less energy use or fewer raw materials."
        ],
        "keywords": [
            "recycling",
            "collect",
            "sort",
            "melt",
            "reuse",
            "landfill",
            "raw materials"
        ],
        "commonMistakes": [
            "Do not only say 'put it in a bin'.",
            "Give both method and benefit."
        ],
        "answerStructure": [
            "Material.",
            "Recycling method.",
            "Benefit."
        ],
        "media": [
            {
                "src": "assets/webp/9E-recycling-methods-blank.webp",
                "alt": "Question-safe recycling methods grid.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-chem-identify-physical-chemical-change",
        "domain": "chemistry",
        "unit": "9F",
        "commandWord": "identify",
        "marks": 2,
        "difficulty": 2,
        "skills": [
            "visual",
            "identify"
        ],
        "question": "Use the change diagrams. Identify one physical change and one chemical reaction.",
        "answerFrame": "Use two bullet points and give the reason briefly.",
        "modelAnswer": "A physical change does not make a new substance. A chemical reaction makes a new substance, often shown by signs such as gas, colour change, heat/light or a precipitate.",
        "markScheme": [
            "1 mark for correctly identifying a physical change.",
            "1 mark for correctly identifying a chemical reaction or giving a valid new-substance reason."
        ],
        "keywords": [
            "physical change",
            "chemical reaction",
            "new substance"
        ],
        "commonMistakes": [
            "Do not say every change of state is a chemical reaction.",
            "The key idea is whether a new substance forms."
        ],
        "answerStructure": [
            "Physical change + reason.",
            "Chemical reaction + reason."
        ],
        "media": [
            {
                "src": "assets/webp/9F-physical-change-chemical-reaction-blank-v2.webp",
                "alt": "Question-safe comparison of physical and chemical changes.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-phys-state-resultant-force",
        "domain": "physics",
        "unit": "9I",
        "commandWord": "state",
        "marks": 1,
        "difficulty": 1,
        "skills": [
            "recall"
        ],
        "question": "State what is meant by the resultant force on an object.",
        "answerFrame": "One short sentence.",
        "modelAnswer": "The resultant force is the overall force on an object.",
        "markScheme": [
            "1 mark for overall force/sum of all forces."
        ],
        "keywords": [
            "resultant force",
            "overall force",
            "sum"
        ],
        "commonMistakes": [
            "Do not list only one force if several forces act."
        ],
        "answerStructure": [
            "Term is definition."
        ]
    },
    {
        "id": "we-phys-describe-distance-time-graph",
        "domain": "physics",
        "unit": "9I",
        "commandWord": "describe",
        "marks": 3,
        "difficulty": 3,
        "skills": [
            "visual",
            "graph",
            "describe"
        ],
        "question": "Use the distance-time graph. Describe the motion shown by the graph.",
        "answerFrame": "Describe each section and use graph language.",
        "modelAnswer": "A sloping line means the object is moving at constant speed. A steeper line means a greater speed. A horizontal line means the object is stationary because the distance is not changing.",
        "markScheme": [
            "1 mark for a sloping section showing movement/constant speed.",
            "1 mark for a horizontal section showing stationary.",
            "1 mark for steeper line meaning faster speed or using a section label correctly."
        ],
        "keywords": [
            "distance-time graph",
            "sloping line",
            "steeper",
            "faster",
            "horizontal",
            "stationary"
        ],
        "commonMistakes": [
            "Do not say a horizontal line on a distance-time graph means constant speed.",
            "Use the y-axis: distance."
        ],
        "answerStructure": [
            "Section 1.",
            "Section 2.",
            "Compare steepness if relevant."
        ],
        "media": [
            {
                "src": "assets/webp/9I-distance-time-journey-question-v149.webp",
                "alt": "Question-safe distance-time graph for journey interpretation.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-phys-describe-speed-time-graph",
        "domain": "physics",
        "unit": "9I",
        "commandWord": "describe",
        "marks": 3,
        "difficulty": 3,
        "skills": [
            "visual",
            "graph",
            "describe"
        ],
        "question": "Use the speed-time graph. Describe the motion shown in the graph.",
        "answerFrame": "Use graph sections and values where possible.",
        "modelAnswer": "The object accelerates at first because its speed increases. It then travels at constant speed when the line is horizontal above zero. If the line slopes down, the object decelerates.",
        "markScheme": [
            "1 mark for identifying acceleration from increasing speed.",
            "1 mark for constant speed from a horizontal line above zero.",
            "1 mark for deceleration from decreasing speed or use of graph values."
        ],
        "keywords": [
            "speed-time graph",
            "accelerates",
            "constant speed",
            "decelerates",
            "horizontal"
        ],
        "commonMistakes": [
            "Do not say a horizontal line above zero means stationary.",
            "On a speed-time graph, horizontal above zero means constant speed."
        ],
        "answerStructure": [
            "First section.",
            "Middle/constant section.",
            "Final section."
        ],
        "media": [
            {
                "src": "assets/webp/9I-speed-time-graph-blank.webp",
                "alt": "Question-safe speed-time graph with labelled sections.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-phys-explain-terminal-velocity",
        "domain": "physics",
        "unit": "9I",
        "commandWord": "explain",
        "marks": 4,
        "difficulty": 4,
        "skills": [
            "visual",
            "explain",
            "forces"
        ],
        "question": "Use the falling-object sequence. Explain why a falling object reaches terminal velocity.",
        "answerFrame": "Use weight, air resistance, resultant force and constant speed.",
        "modelAnswer": "At first weight is greater than air resistance, so the object accelerates. As speed increases, air resistance increases. Eventually air resistance equals weight, so the resultant force is zero. The object then falls at constant speed, called terminal velocity.",
        "markScheme": [
            "1 mark for weight initially being greater than air resistance.",
            "1 mark for air resistance increasing as speed increases.",
            "1 mark for air resistance equalling weight/resultant force zero.",
            "1 mark for constant speed/terminal velocity."
        ],
        "keywords": [
            "weight",
            "air resistance",
            "speed increases",
            "resultant force",
            "zero",
            "constant speed",
            "terminal velocity"
        ],
        "commonMistakes": [
            "Do not say forces disappear.",
            "At terminal velocity the forces are balanced, not absent."
        ],
        "answerStructure": [
            "Start forces.",
            "Change with speed.",
            "Balanced forces.",
            "Result."
        ],
        "media": [
            {
                "src": "assets/webp/9I-forces-terminal-velocity-sequence.webp",
                "alt": "Falling-object sequence showing force arrows for terminal velocity explanation.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-phys-calculate-moment",
        "domain": "physics",
        "unit": "9I",
        "commandWord": "calculate",
        "marks": 2,
        "difficulty": 3,
        "skills": [
            "visual",
            "calculation"
        ],
        "question": "Use the balanced lever diagram. Calculate the missing distance on the right-hand side.",
        "answerFrame": "Formula, substitution, answer with unit.",
        "modelAnswer": "Left moment = 240 × 2 = 480 N m. For balance, right moment = 480 N m. Distance = 480 ÷ 160 = 3 m.",
        "markScheme": [
            "1 mark for using equal clockwise and anticlockwise moments/force × distance.",
            "1 mark for 3 m."
        ],
        "keywords": [
            "moment",
            "force",
            "distance",
            "480 N m",
            "3 m"
        ],
        "commonMistakes": [
            "Do not forget that balanced means equal moments.",
            "Use distance from the pivot."
        ],
        "answerStructure": [
            "Known moment.",
            "Set equal for balance.",
            "Divide by force."
        ],
        "media": [
            {
                "src": "assets/webp/9I-moment-balanced-missing-distance-question-v149.webp",
                "alt": "Balanced lever with 240 N at 2 m and 160 N at an unknown distance.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-phys-calculate-density-displacement",
        "domain": "physics",
        "unit": "9I",
        "commandWord": "calculate",
        "marks": 3,
        "difficulty": 3,
        "skills": [
            "visual",
            "calculation"
        ],
        "question": "Use the measuring cylinders. Calculate the density of the object in g/cm³.",
        "answerFrame": "Find volume first, then use density = mass ÷ volume.",
        "modelAnswer": "Initial volume = 35 cm³ and final volume = 60 cm³, so volume = 25 cm³. Density = 125 ÷ 25 = 5 g/cm³.",
        "markScheme": [
            "1 mark for volume = final volume − initial volume.",
            "1 mark for volume = 25 cm³.",
            "1 mark for density = 5 g/cm³."
        ],
        "keywords": [
            "initial volume",
            "final volume",
            "volume",
            "density",
            "g/cm³"
        ],
        "commonMistakes": [
            "Do not use the final volume as the object's volume.",
            "Subtract initial volume from final volume."
        ],
        "answerStructure": [
            "Calculate object volume.",
            "Write density formula.",
            "Substitute and answer with unit."
        ],
        "media": [
            {
                "src": "assets/webp/9I-density-water-displacement-question-v149.webp",
                "alt": "Measuring cylinder displacement diagram with object mass.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-phys-explain-pressure-contact-area",
        "domain": "physics",
        "unit": "9I",
        "commandWord": "explain",
        "marks": 3,
        "difficulty": 3,
        "skills": [
            "visual",
            "explain",
            "calculation"
        ],
        "question": "Use the shoe diagrams. Explain which shoe produces the greater pressure on the ground.",
        "answerFrame": "Compare force and contact area.",
        "modelAnswer": "Both shoes have the same force, but shoe A has a smaller contact area. Pressure = force ÷ area, so the same force over a smaller area gives a greater pressure. Shoe A produces the greater pressure.",
        "markScheme": [
            "1 mark for same force.",
            "1 mark for smaller contact area.",
            "1 mark for pressure increasing when the same force acts over a smaller area."
        ],
        "keywords": [
            "pressure",
            "force",
            "area",
            "smaller contact area",
            "greater pressure"
        ],
        "commonMistakes": [
            "Do not say larger area gives larger pressure when force is the same.",
            "Compare both force and area."
        ],
        "answerStructure": [
            "Compare force.",
            "Compare area.",
            "Link to pressure formula."
        ],
        "media": [
            {
                "src": "assets/webp/9I-pressure-shoe-contact-area-question-v149.webp",
                "alt": "Two shoe diagrams with equal force and different contact area.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-phys-identify-circuit-meters",
        "domain": "physics",
        "unit": "9J",
        "commandWord": "identify",
        "marks": 2,
        "difficulty": 2,
        "skills": [
            "visual",
            "identify",
            "circuit"
        ],
        "question": "Use the circuit diagram. Identify where an ammeter and a voltmeter should be connected.",
        "answerFrame": "Use two bullet points and the position labels.",
        "modelAnswer": "The ammeter should be connected in series, for example at position X or Z. The voltmeter should be connected in parallel across the lamp, at position Y.",
        "markScheme": [
            "1 mark for ammeter in series/position X or Z.",
            "1 mark for voltmeter in parallel/position Y."
        ],
        "keywords": [
            "ammeter",
            "series",
            "voltmeter",
            "parallel",
            "X",
            "Y"
        ],
        "commonMistakes": [
            "Do not connect the ammeter in parallel.",
            "Do not connect the voltmeter in series."
        ],
        "answerStructure": [
            "Ammeter position and connection.",
            "Voltmeter position and connection."
        ],
        "media": [
            {
                "src": "assets/webp/9J-meter-placement-xy-question-v149.webp",
                "alt": "Circuit diagram with positions X, Y and Z for meter placement.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-phys-explain-wire-resistance-investigation",
        "domain": "physics",
        "unit": "9J",
        "commandWord": "describe",
        "marks": 4,
        "difficulty": 4,
        "skills": [
            "visual",
            "practical",
            "explain"
        ],
        "question": "Use the practical setup. Describe how to investigate how wire length affects resistance.",
        "answerFrame": "Method, variables, measurements and calculation.",
        "modelAnswer": "Set up the wire with an ammeter in series and a voltmeter in parallel across the test length. Change the length of the wire using the crocodile clips. Keep the wire material, thickness and temperature the same. Measure voltage and current, then calculate resistance using resistance = voltage ÷ current.",
        "markScheme": [
            "1 mark for changing wire length.",
            "1 mark for ammeter in series/voltmeter in parallel.",
            "1 mark for controlling material/thickness/temperature or another valid control variable.",
            "1 mark for calculating resistance from voltage ÷ current or repeating/recording results."
        ],
        "keywords": [
            "wire length",
            "ammeter",
            "series",
            "voltmeter",
            "parallel",
            "control variable",
            "resistance"
        ],
        "commonMistakes": [
            "Do not change several variables at once.",
            "Do not place the voltmeter in series."
        ],
        "answerStructure": [
            "Set up circuit.",
            "Change independent variable.",
            "Control variables.",
            "Measure/calculate resistance."
        ],
        "media": [
            {
                "src": "assets/webp/9J-wire-resistance-investigation-blank.webp",
                "alt": "Question-safe circuit setup for wire resistance investigation.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-phys-compare-current-voltage-resistance",
        "domain": "physics",
        "unit": "9J",
        "commandWord": "explain",
        "marks": 3,
        "difficulty": 4,
        "skills": [
            "visual",
            "graph",
            "explain"
        ],
        "question": "Use the current-voltage graph. Explain which component has the greater resistance.",
        "answerFrame": "Compare current at the same voltage.",
        "modelAnswer": "For the same potential difference, the component with the smaller current has the greater resistance. Line B has a smaller current than line A at the same voltage, so line B has the greater resistance.",
        "markScheme": [
            "1 mark for comparing at the same voltage/potential difference.",
            "1 mark for lower current meaning higher resistance.",
            "1 mark for identifying the correct line/component."
        ],
        "keywords": [
            "potential difference",
            "current",
            "resistance",
            "same voltage",
            "lower current"
        ],
        "commonMistakes": [
            "Do not compare two different voltages.",
            "Use V = I × R or R = V ÷ I."
        ],
        "answerStructure": [
            "Choose a voltage.",
            "Compare current.",
            "State resistance conclusion."
        ],
        "media": [
            {
                "src": "assets/webp/9J-current-voltage-graph-question-v149.webp",
                "alt": "Current-voltage graph with two lines labelled A and B.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-phys-explain-static-charge-transfer",
        "domain": "physics",
        "unit": "9J",
        "commandWord": "explain",
        "marks": 3,
        "difficulty": 3,
        "skills": [
            "visual",
            "explain",
            "electricity"
        ],
        "question": "Use the static-charge diagram. Explain how one object becomes negatively charged after rubbing.",
        "answerFrame": "Use electron transfer language.",
        "modelAnswer": "Electrons are transferred from one object to the other during rubbing. The object that gains electrons becomes negatively charged. The other object loses electrons and becomes positively charged.",
        "markScheme": [
            "1 mark for electrons being transferred.",
            "1 mark for gaining electrons causing negative charge.",
            "1 mark for the other object losing electrons/becoming positive."
        ],
        "keywords": [
            "electrons",
            "transferred",
            "gains",
            "negative",
            "loses",
            "positive"
        ],
        "commonMistakes": [
            "Do not say protons move between objects.",
            "Static charge is caused by electron transfer."
        ],
        "answerStructure": [
            "Electron transfer.",
            "Object that gains electrons.",
            "Object that loses electrons."
        ],
        "media": [
            {
                "src": "assets/webp/9J-static-electricity-charge-transfer-blank-v3.webp",
                "alt": "Question-safe static electricity electron transfer diagram.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    },
    {
        "id": "we-phys-describe-electromagnet-strength",
        "domain": "physics",
        "unit": "9J",
        "commandWord": "describe",
        "marks": 3,
        "difficulty": 3,
        "skills": [
            "visual",
            "describe",
            "electromagnet"
        ],
        "question": "Use the electromagnet diagram. Describe two ways to make the electromagnet stronger and explain one of them.",
        "answerFrame": "Give two changes and one reason.",
        "modelAnswer": "The electromagnet can be made stronger by increasing the current, adding more turns to the coil or adding an iron core. More turns or a larger current produce a stronger magnetic field, and an iron core makes the field stronger inside the coil.",
        "markScheme": [
            "1 mark for a valid strengthening method.",
            "1 mark for a second valid strengthening method.",
            "1 mark for a linked explanation using magnetic field strength."
        ],
        "keywords": [
            "electromagnet",
            "current",
            "turns",
            "coil",
            "iron core",
            "magnetic field"
        ],
        "commonMistakes": [
            "Do not say a permanent magnet can simply be switched off.",
            "Link the change to magnetic field strength."
        ],
        "answerStructure": [
            "Method 1.",
            "Method 2.",
            "Explanation."
        ],
        "media": [
            {
                "src": "assets/webp/9J-electromagnet-strength-variables-blank-v3.webp",
                "alt": "Question-safe electromagnet strength variables diagram.",
                "mediaTiming": "question",
                "presentation": "media-image-base"
            }
        ]
    }
];

  const WRITTEN_SIZE_OPTIONS = {
    15: { label: "Quick written test", marksPerDomain: 5 },
    30: { label: "Standard written test", marksPerDomain: 10 },
    45: { label: "Full written practice", marksPerDomain: 15 },
  };

  function domainLabel(domain) {
    if (domain === "biology") return "Biology";
    if (domain === "chemistry") return "Chemistry";
    if (domain === "physics") return "Physics";
    return domain || "Science";
  }

  const ANSWER_TYPE_GUIDES = {
    identify: {
      label: "Identify",
      also: "state / name / label",
      clueWords: "what, which, where, name, state, identify, label",
      summary: "Give the answer. Keep it short and exact.",
      goodAnswer: "A good answer gives the correct science word or short fact.",
      template: "The answer is ____.",
      questionPiece: "what / which / where / name",
      answerPiece: "the word, label, place, value or short fact",
      strategy: "Find the thing being asked for, then write only that answer.",
      exampleQuestion: "Name the organelle that controls the cell.",
      exampleAnswer: "The nucleus.",
      pitfall: "Do not write a long explanation unless the question asks why or how."
    },
    describe: {
      label: "Describe",
      also: "short linked science sentences",
      clueWords: "describe, what happens, what changes, how things are linked, relationship, sequence, pattern, trend, use the graph/table",
      summary: "Use short descriptive sentences to link science points in order.",
      goodAnswer: "A good answer uses short sentences. Each sentence describes one science point or one link to the next point.",
      template: "Sentence 1: say the first science point. Sentence 2: link it to the next science point. Sentence 3: add a final detail or evidence.",
      questionPiece: "what is linked / what happens / sequence / pattern",
      answerPiece: "short sentence → linked science sentence → final detail or evidence",
      strategy: "Write a series of short sentences. Keep each sentence limited to one science point, one link, or one detail.",
      exampleQuestion: "Describe how chromosomes, DNA and genes are linked together.",
      exampleAnswer: "Chromosomes are found in the nucleus. Chromosomes are made from long molecules of DNA. Genes are short sections of DNA found on chromosomes. Genes carry instructions for inherited features.",
      pitfall: "If the question asks why, it is an Explain question. Do not turn a Describe answer into a long because explanation."
    },
    explain: {
      label: "Explain",
      also: "why / how / suggest / compare",
      clueWords: "why, how, because, give a reason, suggest, compare",
      summary: "Give the reason. Link the science point to the result.",
      goodAnswer: "A good answer uses because, so or therefore to link cause and effect.",
      template: "____ happens because ____. This means ____.",
      questionPiece: "why / how / suggest / compare",
      answerPiece: "point → because/reason → result",
      strategy: "Make the science point, add because, then finish with the result or effect.",
      exampleQuestion: "Explain why an iron core makes an electromagnet stronger.",
      exampleAnswer: "The iron core becomes magnetised, so the magnetic field is stronger.",
      pitfall: "Do not only describe what happens. Explain why or how it happens."
    }
  };

  function inferAnswerType(item = {}) {
    const command = String(item.examCommand || item.commandWord || item.command || "").toLowerCase().trim();
    if (["identify", "state", "name", "label", "classify", "complete"].includes(command)) return "identify";
    if (["describe", "graph", "interpret"].includes(command)) return "describe";
    if (["explain", "suggest", "compare", "evaluate"].includes(command)) return "explain";

    const text = String(item.question || item.prompt || "").toLowerCase().replace(/\s+/g, " ").trim();
    if (/\b(why|explain|because|give a reason|suggest)\b/.test(text)) return "explain";
    if (/\b(compare|difference between|similarity|different from|higher than|lower than|greater than|less than)\b/.test(text)) return "explain";
    if (/\b(how)\b/.test(text) && /\b(cause|affect|increase|decrease|change|make|become|produce|result)\b/.test(text)) return "explain";
    if (/\b(describe|what happens|what changes|pattern|trend|use the graph|use the table|shown by the graph|shown in the diagram)\b/.test(text)) return "describe";
    if (/\b(identify|state|name|label|which|where|what is|what are|give one|give two|complete)\b/.test(text)) return "identify";
    if (item.type === "definition") return "identify";
    return "describe";
  }

  function answerTypeGuide(item = {}) {
    return ANSWER_TYPE_GUIDES[inferAnswerType(item)] || ANSWER_TYPE_GUIDES.describe;
  }

  function commandHint(commandWord) {
    return answerTypeGuide({ commandWord }).summary;
  }

  function formatSlot(label) {
    return `<span class="question-type-format-slot"><span>${escapeHtml(label)}</span><b>____</b></span>`;
  }

  function renderDecomposedAnswerFormat(guide) {
    const type = String(guide.label || "").toLowerCase();
    if (type === "identify") {
      return `The answer is ${formatSlot("answer")}.`;
    }
    if (type === "describe") {
      return `Sentence 1: ${formatSlot("first science point")}. Sentence 2: ${formatSlot("linked science point")}. Sentence 3: ${formatSlot("final detail / evidence")}.`;
    }
    return `${formatSlot("science point")} happens because ${formatSlot("reason")}. This means ${formatSlot("result")}.`;
  }

  function renderAnswerTypeGuide(item = {}, className = "question-type-guide") {
    const guide = answerTypeGuide(item);
    return `
      <aside class="${className} compact-question-type-guide">
        <div class="question-type-mini-heading">
          <span class="pill command-word">${escapeHtml(guide.label)}</span>
          <strong>${escapeHtml(guide.also)}</strong>
          <span>${escapeHtml(guide.goodAnswer)}</span>
        </div>
        <div class="question-type-format-line">
          <strong>Answer format:</strong>
          <span>${renderDecomposedAnswerFormat(guide)}</span>
        </div>
        <p class="question-type-clue-line"><strong>Look for:</strong> ${escapeHtml(guide.questionPiece)}. <strong>Remember:</strong> ${escapeHtml(guide.pitfall)}</p>
      </aside>
    `;
  }

  function renderAnswerFormatHelpDialog() {
    return `
      <div class="answer-help-dialog-card">
        <div class="answer-help-header">
          <div>
            <p class="eyebrow">Written answers</p>
            <h2>How to answer written questions</h2>
            <p>Use three answer types. The quickest choice is: identify gives the answer, describe links science points in order, explain gives the reason.</p>
          </div>
          <button class="soft-button answer-help-close" data-answer-help-close type="button" aria-label="Close answer help">×</button>
        </div>
        <div class="answer-help-quick-choice">
          <strong>Quick choice:</strong>
          <span><b>Identify</b> = what / which / where / name</span>
          <span><b>Describe</b> = short sentences linking science points</span>
          <span><b>Explain</b> = why / because / give a reason</span>
        </div>
        <div class="answer-help-stack">
          ${Object.values(ANSWER_TYPE_GUIDES).map((guide) => `
            <article class="answer-help-type-card">
              <div class="answer-help-type-title">
                <span class="pill command-word">${escapeHtml(guide.label)}</span>
                <strong>${escapeHtml(guide.also)}</strong>
              </div>
              <p>${escapeHtml(guide.goodAnswer)}</p>
              <div class="answer-help-decompose">
                <span><b>Question clue:</b> ${escapeHtml(guide.questionPiece)}</span>
                <span><b>Answer gives:</b> ${escapeHtml(guide.answerPiece)}</span>
                <span><b>Format:</b> ${escapeHtml(guide.template)}</span>
              </div>
              <p class="answer-help-example"><strong>Example:</strong> ${escapeHtml(guide.exampleQuestion)} → ${escapeHtml(guide.exampleAnswer)}</p>
              <p class="answer-help-pitfall"><strong>Common pitfall:</strong> ${escapeHtml(guide.pitfall)}</p>
            </article>
          `).join("")}
        </div>
      </div>
    `;
  }

  function openAnswerFormatHelp() {
    if (!els.answerFormatModal) return;
    els.answerFormatModal.innerHTML = renderAnswerFormatHelpDialog();
    els.answerFormatModal.classList.remove("hidden");
    document.body.classList.add("modal-open");
    els.answerFormatModal.querySelector("[data-answer-help-close]")?.focus();
  }

  function closeAnswerFormatHelp() {
    if (!els.answerFormatModal) return;
    els.answerFormatModal.classList.add("hidden");
    els.answerFormatModal.innerHTML = "";
    document.body.classList.remove("modal-open");
    els.answerFormatHelpButton?.focus();
  }

  function renderAnswerFormatClassNotesSection() {
    return "";
  }

  function writtenDifficulty(question) {
    const value = Number(question?.difficulty || question?.marks || 1);
    return Math.min(5, Math.max(1, Number.isFinite(value) ? Math.round(value) : 1));
  }

  function renderDifficultyBubbles(question) {
    const level = writtenDifficulty(question);
    const bubbles = Array.from({ length: 5 }, (_, index) => {
      const n = index + 1;
      return `<span class="difficulty-bubble ${n <= level ? "filled" : ""}" aria-hidden="true">${n}</span>`;
    }).join("");
    return `<span class="difficulty-bubbles" role="img" aria-label="Difficulty ${level} out of 5">${bubbles}</span>`;
  }

  function writtenSectionMeta(question) {
    const commandWord = normalizeWrittenCommand(question?.commandWord);
    const skills = new Set(Array.isArray(question?.skills) ? question.skills : []);
    if (commandWord === "calculate" || commandWord === "graph" || skills.has("calculation") || skills.has("graph")) {
      return { key: "C", order: 3, label: "Section C", focus: "Data and calculations" };
    }
    if (commandWord === "state" || commandWord === "identify" || skills.has("recall")) {
      return { key: "A", order: 1, label: "Section A", focus: "Core knowledge" };
    }
    return { key: "B", order: 2, label: "Section B", focus: "Written reasoning" };
  }

  function writtenSectionSortValue(question) {
    return writtenSectionMeta(question).order;
  }

  function sortWrittenExamIntoSections(questions) {
    return shuffleWritten(questions)
      .map((question, index) => ({ question, index }))
      .sort((a, b) => {
        const sectionDiff = writtenSectionSortValue(a.question) - writtenSectionSortValue(b.question);
        if (sectionDiff) return sectionDiff;
        const domainOrder = { biology: 1, chemistry: 2, physics: 3 };
        const domainDiff = (domainOrder[a.question.domain] || 9) - (domainOrder[b.question.domain] || 9);
        if (domainDiff) return domainDiff;
        return a.index - b.index;
      })
      .map((item) => item.question);
  }

  function unitToWrittenDomain(unit) {
    if (["9A", "9B"].includes(unit)) return "biology";
    if (["9E", "9F"].includes(unit)) return "chemistry";
    if (["9I", "9J"].includes(unit)) return "physics";
    return "science";
  }

  function clampWrittenMarks(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 1;
    return Math.min(5, Math.max(1, Math.round(n)));
  }

  function hasOpenAnswerShape(card) {
    return Boolean(card && (!Array.isArray(card.choices) || !card.choices.length) && card.question && (card.answer || card.explanation));
  }

  function normalizeWrittenCommand(commandWord) {
    const cmd = String(commandWord || "").toLowerCase().trim();
    if (["state", "identify", "describe", "explain", "calculate", "graph"].includes(cmd)) return cmd;
    if (["classify", "name", "label", "complete"].includes(cmd)) return "identify";
    if (["suggest", "compare", "evaluate"].includes(cmd)) return "explain";
    if (cmd === "interpret") return "describe";
    return "state";
  }

  function writtenAnswerFrame(commandWord, marks = 1, fallback = "") {
    if (fallback) return fallback;
    const plural = marks === 1 ? "point" : "points";
    const frames = {
      state: `Give ${marks} clear ${plural}. Use the exact science word, fact or equation.`,
      identify: `Name the correct label, feature, part or item. Give ${marks} clear ${plural} if needed.`,
      describe: `Write ${marks} short descriptive ${plural}. Link one science point to the next without explaining why unless asked.`,
      explain: `Use point → because → result. Aim for ${marks} credit-worthy linked ${plural}.`,
      calculate: "Show equation/method, substitution, answer and unit where possible.",
      graph: "Use the axes, quote values where useful, and describe or draw the trend."
    };
    return frames[commandWord] || "Write a clear science answer using key words.";
  }

  function writtenAnswerStructure(commandWord, marks = 1) {
    if (commandWord === "calculate") return ["Write the equation or method before calculating.", "Substitute the values with correct units where useful.", "Give the final answer with the unit or required rounding."];
    if (commandWord === "explain") return ["Make the science point first.", "Use because/so/therefore to link cause and effect.", "Finish with the result, consequence or application."];
    if (commandWord === "describe") return ["Write one short sentence for the first science point.", "Write another short sentence linking it to the next science point.", "Add a final detail, observation or evidence without explaining why unless asked."];
    if (commandWord === "identify") return ["Read the labels, diagram or context carefully.", "Name the correct item(s), part(s), feature(s) or value(s).", "Keep each answer concise and clearly matched to the label if labels are used."];
    if (commandWord === "graph") return ["Check the x-axis, y-axis and scale.", "Describe or draw the overall relationship or trend.", "Quote a value, turning point or comparison if useful."];
    return ["Write the key term, fact or equation.", "Keep the sentence short and precise.", "Do not add unrelated detail." ];
  }

  function writtenModelSnippets(modelAnswer, limit = 4) {
    const cleaned = String(modelAnswer || "").replace(/\s+/g, " ").trim();
    if (!cleaned) return [];
    const sentencePieces = cleaned
      .split(/(?:\.\s+|;\s+|\n+|\s+•\s+)/)
      .map((part) => part.replace(/^[-–•]\s*/, "").replace(/\.$/, "").trim())
      .filter((part) => part.length >= 10);
    const commaPieces = cleaned
      .split(/,\s+|\s+and\s+|\s+or\s+/)
      .map((part) => part.replace(/\.$/, "").trim())
      .filter((part) => part.length >= 4 && part.length <= 70);
    return unique((sentencePieces.length > 1 ? sentencePieces : commaPieces).map((part) => part.slice(0, 140))).slice(0, limit);
  }

  function makeWrittenMarkScheme(commandWord, marks = 1, modelAnswer = "") {
    const safeMarks = clampWrittenMarks(marks);
    const markText = safeMarks === 1 ? "1 mark" : `${safeMarks} marks`;
    const snippets = writtenModelSnippets(modelAnswer, Math.min(4, safeMarks + 1));
    const modelPrompt = snippets.length
      ? `Use model-answer points such as: ${snippets.join(" / ")}.`
      : "Use the model answer as the marking authority.";

    if (commandWord === "calculate") {
      if (safeMarks === 1) return ["1 mark for the correct final answer, including unit or rounding where required.", "Allow equivalent working if the final value is correct."];
      return [
        "Credit the correct equation, formula or method.",
        "Credit correct substitution and working.",
        "Credit the correct final answer, including unit or rounding where required.",
        "Allow follow-through where the method is sound but one arithmetic slip has been made."
      ].slice(0, Math.max(3, Math.min(4, safeMarks + 1)));
    }
    if (commandWord === "explain") {
      return [
        `Award up to ${markText} for a correct science point, a linked reason and a clear result.`,
        "Look for because/so/therefore links rather than isolated facts.",
        modelPrompt,
        "Accept equivalent wording with the same science meaning."
      ];
    }
    if (commandWord === "describe" || commandWord === "graph") {
      return [
        `Award up to ${markText} for correct observations, steps, trends or comparisons.`,
        "Credit accurate use of labels, values, axes or diagram context where shown.",
        modelPrompt,
        "Do not require the exact wording if the science meaning is correct."
      ];
    }
    if (commandWord === "identify") {
      return [
        `Award up to ${markText} for correct identification(s).`,
        "Each label, item, feature or value must be clearly named.",
        modelPrompt,
        "Do not credit vague answers that could refer to more than one item."
      ];
    }
    return [
      `Award up to ${markText} for the correct key fact(s), term(s) or equation(s).`,
      modelPrompt,
      "Accept equivalent wording with the same science meaning.",
      "Do not require a long explanation unless the question asks for one."
    ];
  }

  function writtenKeywordsFromAnswer(answer) {
    const stop = new Set(["about", "after", "because", "between", "correct", "could", "during", "each", "from", "have", "into", "more", "most", "that", "their", "there", "these", "they", "this", "when", "where", "which", "with", "would"]);
    return unique(String(answer || "")
      .replace(/[→=+,.()/:;!?]/g, " ")
      .split(/\s+/)
      .map((word) => word.trim().toLowerCase())
      .filter((word) => word.length > 4 && !stop.has(word)))
      .slice(0, 8);
  }

  function derivedWrittenSkills(card, commandWord) {
    const text = `${card.question || ""} ${card.answer || ""} ${card.type || ""}`.toLowerCase();
    const skills = [commandWord, "open-answer"];
    if (Array.isArray(card.media) && card.media.length) skills.push("visual", "diagram");
    if (commandWord === "calculate" || /calculate|formula|equation|substitut|unit|significant figure|decimal place/.test(text)) skills.push("calculation");
    if (commandWord === "graph" || /graph|axis|axes|gradient|trend/.test(text)) skills.push("graph");
    if (card.examPool === "written-recall") skills.push("recall");
    if (card.examPool === "written-review") skills.push("review-needed");
    return unique(skills);
  }

  function derivedWrittenQuestionFromCard(card) {
    if (!card?.examEligible || !hasOpenAnswerShape(card)) return null;
    const commandWord = normalizeWrittenCommand(card.examCommand);
    const marks = clampWrittenMarks(card.examMarks || 1);
    const modelAnswer = String(card.answer || card.explanation || "").trim();
    const sourceParts = [card.source, card.sourceFidelity].filter(Boolean).join(" · ");
    return {
      id: `derived-${card.id}`,
      qid: card.qid || card.id,
      sourceCardId: card.id,
      sourceQid: card.qid || "",
      origin: "open-answer-card",
      pool: card.examPool || "written-main",
      sourceRef: sourceParts,
      domain: card.examDomain || unitToWrittenDomain(card.unit),
      unit: card.unit,
      commandWord,
      marks,
      difficulty: Math.min(5, Math.max(1, Number(card.level || marks || 1))),
      skills: derivedWrittenSkills(card, commandWord),
      question: String(card.question || "").trim(),
      answerFrame: writtenAnswerFrame(commandWord, marks, card.answerFormatHint),
      examFormatKind: card.examFormatKind || commandWord,
      modelAnswer,
      markScheme: makeWrittenMarkScheme(commandWord, marks, modelAnswer),
      keywords: writtenKeywordsFromAnswer(modelAnswer),
      commonMistakes: commandWord === "calculate"
        ? ["Do not give a number without the correct unit where a unit is needed.", "Do not skip the method if method marks are available."]
        : ["Do not give a vague answer without the key science term.", "Do not write a list of unrelated facts."],
      answerStructure: Array.isArray(card.answerFormatSteps) && card.answerFormatSteps.length
        ? card.answerFormatSteps
        : writtenAnswerStructure(commandWord, marks),
      media: Array.isArray(card.media) ? card.media : []
    };
  }

  let writtenExamBankCache = null;

  function writtenExamBank() {
    if (writtenExamBankCache) return writtenExamBankCache;
    const curatedIds = new Set(WRITTEN_EXAM_BANK.map((item) => item.id));
    const derived = questions
      .map(derivedWrittenQuestionFromCard)
      .filter(Boolean)
      .filter((item) => !curatedIds.has(item.id));
    const curated = assignMissingWrittenQids(WRITTEN_EXAM_BANK.map((item) => ({ ...item, origin: item.origin || "curated-visual-bank", pool: item.pool || "written-visual" })));
    writtenExamBankCache = [...curated, ...derived];
    return writtenExamBankCache;
  }

  function shuffleWritten(items) {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function writtenQuestionHasSkill(question, skill) {
    return Array.isArray(question.skills) && question.skills.includes(skill);
  }

  function scoreWrittenCombo(combo, targetMarks) {
    const commands = new Set(combo.map((item) => item.commandWord));
    const units = new Set(combo.map((item) => item.unit));
    const origins = new Set(combo.map((item) => item.origin || item.pool || "unknown"));
    const hasVisual = combo.some((item) => Array.isArray(item.media) && item.media.length);
    const hasGraph = combo.some((item) => writtenQuestionHasSkill(item, "graph"));
    const hasCalculation = combo.some((item) => writtenQuestionHasSkill(item, "calculation"));
    const hasExplain = combo.some((item) => item.commandWord === "explain");
    const hasIdentify = combo.some((item) => item.commandWord === "identify");
    const visualCount = combo.filter((item) => Array.isArray(item.media) && item.media.length).length;
    const sectionMarks = combo.reduce((acc, item) => {
      const key = writtenSectionMeta(item).key;
      acc[key] = (acc[key] || 0) + clampWrittenMarks(item.marks);
      return acc;
    }, { A: 0, B: 0, C: 0 });
    const visualRatio = combo.length ? visualCount / combo.length : 0;
    let score = 0;
    score += commands.size * 5;
    score += units.size * 4;
    score += origins.size * 2;
    score += Math.min(visualCount, targetMarks >= 10 ? 3 : 2) * 2;
    if (hasVisual) score += 4;
    if (targetMarks >= 10 && hasGraph) score += 4;
    if (targetMarks >= 10 && hasCalculation) score += 4;
    if (hasExplain) score += 4;
    if (hasIdentify) score += 3;

    const bands = targetMarks >= 10
      ? { A: [0.15, 0.45], B: [0.35, 0.70], C: [0.05, 0.40] }
      : { A: [0.15, 0.45], B: [0.30, 0.70], C: [0.00, 0.45] };
    Object.entries(bands).forEach(([key, [low, high]]) => {
      const ratio = targetMarks ? (sectionMarks[key] || 0) / targetMarks : 0;
      score += ratio >= low && ratio <= high ? 12 : -Math.min(24, Math.abs(ratio - ((low + high) / 2)) * 60);
    });
    const idealQuestionCount = targetMarks <= 5 ? 3 : targetMarks <= 10 ? 5 : 7;
    score -= Math.abs(combo.length - idealQuestionCount) * 24;
    if (visualRatio > 0.60) score -= (visualRatio - 0.60) * 60;
    return score + Math.random();
  }

  function writtenItemBaseScore(item) {
    const marks = clampWrittenMarks(item.marks);
    let score = marks * 8 - 2.5;
    if (item.origin === "open-answer-card") score += 0.5;
    if (item.origin === "curated-visual-bank") score += 0.8;
    if (item.pool === "written-main") score += 0.8;
    if (item.pool === "written-visual") score += 0.8;
    if (item.pool === "written-recall") score += 0.2;
    if (item.pool === "written-review") score += 0.1;
    if (Array.isArray(item.media) && item.media.length) score += 0.5;
    if (["describe", "explain", "calculate", "graph"].includes(item.commandWord)) score += 0.5;
    return score + Math.random();
  }

  function betterWrittenCandidate(candidate, existing, targetMarks, includeDiversity = false) {
    if (!candidate) return existing;
    if (!existing) return candidate;
    const candidateScore = candidate.score + (includeDiversity ? scoreWrittenCombo(candidate.combo, targetMarks) : 0);
    const existingScore = existing.score + (includeDiversity ? scoreWrittenCombo(existing.combo, targetMarks) : 0);
    return candidateScore > existingScore ? candidate : existing;
  }

  function findWrittenCombo(items, targetMarks) {
    const attempts = 8;
    let best = null;
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const pool = shuffleWritten(items);
      const dp = Array.from({ length: targetMarks + 1 }, () => null);
      dp[0] = { combo: [], score: 0, sourceIds: new Set(), questionKeys: new Set() };
      pool.forEach((item) => {
        const marks = clampWrittenMarks(item.marks);
        const key = String(item.question || item.id || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 80);
        const sourceId = item.sourceCardId || item.id;
        for (let total = targetMarks; total >= marks; total -= 1) {
          const prev = dp[total - marks];
          if (!prev || prev.sourceIds.has(sourceId) || prev.questionKeys.has(key)) continue;
          const next = {
            combo: [...prev.combo, item],
            score: prev.score + writtenItemBaseScore(item),
            sourceIds: new Set([...prev.sourceIds, sourceId]),
            questionKeys: new Set([...prev.questionKeys, key])
          };
          dp[total] = betterWrittenCandidate(next, dp[total], targetMarks);
        }
      });
      best = betterWrittenCandidate(dp[targetMarks], best, targetMarks, true);
    }
    return best?.combo || [];
  }

  function selectWrittenDomainQuestions(domain, targetMarks) {
    const available = writtenExamBank().filter((item) => item.domain === domain);
    const exact = findWrittenCombo(available, targetMarks);
    if (exact.length) return exact;

    const greedy = [];
    let marks = 0;
    shuffleWritten(available).sort((a, b) => writtenItemBaseScore(b) - writtenItemBaseScore(a)).forEach((item) => {
      const nextMarks = marks + clampWrittenMarks(item.marks);
      if (nextMarks > targetMarks) return;
      greedy.push(item);
      marks = nextMarks;
    });
    return greedy;
  }

  function writtenPaperMarkTotal(questions) {
    return questions.reduce((sum, question) => sum + clampWrittenMarks(question.marks), 0);
  }

  function writtenPaperSectionMarks(questions) {
    return questions.reduce((acc, question) => {
      const key = writtenSectionMeta(question).key;
      acc[key] = (acc[key] || 0) + clampWrittenMarks(question.marks);
      return acc;
    }, { A: 0, B: 0, C: 0 });
  }

  function writtenPaperQualityScore(questions, requestedMarks) {
    if (!Array.isArray(questions) || !questions.length) return -Infinity;
    const totalMarks = writtenPaperMarkTotal(questions);
    const commands = new Set(questions.map((question) => question.commandWord));
    const units = new Set(questions.map((question) => question.unit));
    const domains = new Set(questions.map((question) => question.domain));
    const sections = writtenPaperSectionMarks(questions);
    const visualCount = questions.filter((question) => Array.isArray(question.media) && question.media.length).length;
    const calculationOrGraphMarks = questions
      .filter((question) => writtenSectionMeta(question).key === "C")
      .reduce((sum, question) => sum + clampWrittenMarks(question.marks), 0);
    const sourceKeys = questions.map((question) => question.sourceCardId || question.id);
    const duplicateSourcePenalty = sourceKeys.length - new Set(sourceKeys).size;
    const questionKeys = questions.map((question) => String(question.question || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 80));
    const duplicateQuestionPenalty = questionKeys.length - new Set(questionKeys).size;

    let score = 0;
    score += totalMarks === requestedMarks ? 100 : -Math.abs(requestedMarks - totalMarks) * 25;
    score += domains.size * 20;
    score += units.size * 8;
    score += commands.size * 7;
    score += Math.min(visualCount, requestedMarks >= 45 ? 5 : requestedMarks >= 30 ? 4 : 2) * 8;
    score += Math.min(calculationOrGraphMarks, requestedMarks >= 45 ? 10 : requestedMarks >= 30 ? 7 : 4) * 2;
    score -= duplicateSourcePenalty * 80;
    score -= duplicateQuestionPenalty * 100;

    const targetBands = requestedMarks >= 30
      ? { A: [0.18, 0.38], B: [0.38, 0.64], C: [0.12, 0.34] }
      : { A: [0.15, 0.45], B: [0.30, 0.70], C: [0.00, 0.40] };
    Object.entries(targetBands).forEach(([key, [low, high]]) => {
      const ratio = totalMarks ? (sections[key] || 0) / totalMarks : 0;
      if (ratio >= low && ratio <= high) score += 24;
      else score -= Math.min(70, Math.abs(ratio - ((low + high) / 2)) * 140);
    });

    const visualRatio = questions.length ? visualCount / questions.length : 0;
    const maxVisualRatio = requestedMarks >= 30 ? 0.45 : 0.60;
    if (visualRatio > maxVisualRatio) score -= Math.min(80, (visualRatio - maxVisualRatio) * 160);
    if (sections.A === 0) score -= requestedMarks >= 30 ? 65 : 30;
    if (sections.B === 0) score -= 50;
    if (requestedMarks >= 30 && visualCount === 0) score -= 30;
    if (requestedMarks >= 30 && calculationOrGraphMarks === 0) score -= 40;
    return score + Math.random();
  }

  function buildWrittenExamCandidate(totalMarks) {
    const targetPerDomain = totalMarks / 3;
    const questions = ["biology", "chemistry", "physics"].flatMap((domain) => selectWrittenDomainQuestions(domain, targetPerDomain));
    return sortWrittenExamIntoSections(questions);
  }

  function buildWrittenExam(totalMarks = 30) {
    const requested = [15, 30, 45].includes(Number(totalMarks)) ? Number(totalMarks) : 30;
    let best = null;
    let bestScore = -Infinity;
    const attempts = requested >= 30 ? 12 : 8;
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const candidate = buildWrittenExamCandidate(requested);
      const score = writtenPaperQualityScore(candidate, requested);
      if (score > bestScore) {
        best = candidate;
        bestScore = score;
      }
    }
    return best || buildWrittenExamCandidate(requested);
  }

  function bitCount(value) {
    let n = Number(value) || 0;
    let count = 0;
    while (n) {
      n &= n - 1;
      count += 1;
    }
    return count;
  }

  function selectedUnitTestUnit() {
    const unitIds = new Set([...state.selectedUnits]);
    [...state.selectedObjectives].forEach((objectiveId) => {
      const objective = objectiveMeta(objectiveId);
      if (objective?.unit) unitIds.add(objective.unit);
    });
    return unitIds.size === 1 ? [...unitIds][0] : null;
  }

  function unitTestScopeObjectiveIds(unitId) {
    if (!unitId) return [];
    if (state.selectedUnits.has(unitId)) {
      return learningObjectives.filter((objective) => objective.unit === unitId).map((objective) => objective.id);
    }
    const selectedForUnit = [...state.selectedObjectives].filter((objectiveId) => objectiveMeta(objectiveId)?.unit === unitId);
    if (selectedForUnit.length) return selectedForUnit;
    return learningObjectives.filter((objective) => objective.unit === unitId).map((objective) => objective.id);
  }

  function unitTestWrittenBank(unitId = selectedUnitTestUnit()) {
    if (!unitId) return [];
    const scopedObjectives = new Set(unitTestScopeObjectiveIds(unitId));
    const hasObjectiveScope = scopedObjectives.size > 0;
    return writtenExamBank().filter((item) => {
      if (item.unit !== unitId) return false;
      if (!hasObjectiveScope) return true;
      return item.learningObjective ? scopedObjectives.has(item.learningObjective) : true;
    });
  }

  function unitWrittenPaperQualityScore(questions, requestedMarks, objectiveIds = []) {
    if (!Array.isArray(questions) || !questions.length) return -Infinity;
    const totalMarks = writtenPaperMarkTotal(questions);
    const coveredObjectives = new Set(questions.map((question) => question.learningObjective).filter(Boolean));
    const targetObjectives = objectiveIds.filter((objectiveId) => questions.some((question) => question.learningObjective === objectiveId));
    const visualCount = questions.filter((question) => Array.isArray(question.media) && question.media.length).length;
    const commands = new Set(questions.map((question) => question.commandWord));
    const sections = writtenPaperSectionMarks(questions);
    const calculationOrGraphMarks = questions
      .filter((question) => writtenSectionMeta(question).key === "C")
      .reduce((sum, question) => sum + clampWrittenMarks(question.marks), 0);
    const sourceKeys = questions.map((question) => question.sourceCardId || question.id);
    const duplicateSourcePenalty = sourceKeys.length - new Set(sourceKeys).size;
    let score = 0;
    score += totalMarks === requestedMarks ? 120 : -Math.abs(requestedMarks - totalMarks) * 30;
    score += targetObjectives.length ? (coveredObjectives.size / targetObjectives.length) * 140 : 0;
    score += commands.size * 8;
    score += Math.min(visualCount, requestedMarks >= 30 ? 4 : 2) * 10;
    score += Math.min(calculationOrGraphMarks, requestedMarks >= 30 ? 8 : 4) * 2;
    score -= duplicateSourcePenalty * 90;
    if (sections.A === 0) score -= 35;
    if (sections.B === 0) score -= 35;
    if (requestedMarks >= 30 && sections.C === 0) score -= 25;
    const visualRatio = questions.length ? visualCount / questions.length : 0;
    if (visualRatio > 0.60) score -= (visualRatio - 0.60) * 120;
    return score + Math.random();
  }

  function findUnitWrittenCombo(items, targetMarks, objectiveIds = []) {
    const objectiveIndexes = new Map(objectiveIds.map((id, index) => [id, index]));
    const maxMask = objectiveIds.length ? (1 << Math.min(objectiveIds.length, 20)) - 1 : 0;
    const attempts = 6;
    let best = null;
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const pool = shuffleWritten(items);
      const dp = Array.from({ length: targetMarks + 1 }, () => new Map());
      dp[0].set(0, { combo: [], score: 0, sourceIds: new Set(), questionKeys: new Set(), mask: 0 });
      pool.forEach((item) => {
        const marks = clampWrittenMarks(item.marks);
        const key = String(item.question || item.id || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 80);
        const sourceId = item.sourceCardId || item.id;
        const objectiveIndex = objectiveIndexes.has(item.learningObjective) ? objectiveIndexes.get(item.learningObjective) : -1;
        const objectiveBit = objectiveIndex >= 0 && objectiveIndex < 20 ? (1 << objectiveIndex) : 0;
        for (let total = targetMarks; total >= marks; total -= 1) {
          const previousStates = Array.from(dp[total - marks].values());
          previousStates.forEach((prev) => {
            if (!prev || prev.sourceIds.has(sourceId) || prev.questionKeys.has(key)) return;
            const nextMask = prev.mask | objectiveBit;
            const next = {
              combo: [...prev.combo, item],
              score: prev.score + writtenItemBaseScore(item) + (objectiveBit && !(prev.mask & objectiveBit) ? 18 : 0),
              sourceIds: new Set([...prev.sourceIds, sourceId]),
              questionKeys: new Set([...prev.questionKeys, key]),
              mask: nextMask
            };
            const existing = dp[total].get(nextMask);
            if (!existing || next.score > existing.score) dp[total].set(nextMask, next);
          });
        }
      });
      const exactStates = Array.from(dp[targetMarks].values());
      exactStates.forEach((candidate) => {
        if (!candidate) return;
        if (!best) {
          best = candidate;
          return;
        }
        const candidateCoverage = bitCount(candidate.mask);
        const bestCoverage = bitCount(best.mask);
        if (candidateCoverage > bestCoverage || (candidateCoverage === bestCoverage && candidate.score > best.score)) best = candidate;
      });
      if (best && maxMask && best.mask === maxMask) break;
    }
    return best?.combo || [];
  }

  function buildUnitWrittenExam(totalMarks = 30, unitId = selectedUnitTestUnit()) {
    const requested = [15, 30, 45].includes(Number(totalMarks)) ? Number(totalMarks) : 30;
    const available = unitTestWrittenBank(unitId);
    if (!available.length) return [];
    const objectiveIds = unitTestScopeObjectiveIds(unitId).filter((objectiveId) => available.some((item) => item.learningObjective === objectiveId));
    let best = null;
    let bestScore = -Infinity;
    const attempts = requested >= 30 ? 10 : 7;
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const candidate = findUnitWrittenCombo(available, requested, objectiveIds);
      const score = unitWrittenPaperQualityScore(candidate, requested, objectiveIds);
      if (score > bestScore) {
        best = candidate;
        bestScore = score;
      }
    }
    if (best && best.length) return sortWrittenExamIntoSections(best);
    return sortWrittenExamIntoSections(findWrittenCombo(available, requested));
  }


  function defaultProgress() {
    return {
      xp: 0,
      streak: 0,
      bestStreak: 0,
      masteredIds: [],
      revisitIds: [],
      studyIds: [],
      attempts: {},
      testHistory: [],
      writtenExamHistory: [],
      writtenExamMarks: 30,
      questionSetSize: { ...QUESTION_SET_DEFAULTS },
      recentQuestionIds: { practice: [], test: [] },
      reviewSheet: emptyReviewSheet(),
      sessionPositions: {},
      sound: true,
      updatedAt: new Date().toISOString(),
    };
  }

  function normalizeQuestionSetSize(value, fallback = 20) {
    if (value === "all") return "all";
    const numeric = Number(value);
    return QUESTION_SET_SIZE_OPTIONS.includes(numeric) ? numeric : fallback;
  }

  function normalizeQuestionSetSizeMap(raw) {
    const source = raw && typeof raw === "object" ? raw : {};
    return {
      practice: normalizeQuestionSetSize(source.practice, QUESTION_SET_DEFAULTS.practice),
      test: normalizeQuestionSetSize(source.test, QUESTION_SET_DEFAULTS.test),
    };
  }

  function normalizeRecentQuestionIds(raw) {
    const source = raw && typeof raw === "object" ? raw : {};
    return {
      practice: Array.isArray(source.practice) ? source.practice.filter(Boolean).slice(0, 160) : [],
      test: Array.isArray(source.test) ? source.test.filter(Boolean).slice(0, 160) : [],
    };
  }

  function normalizeProgress(raw) {
    const base = defaultProgress();
    if (!raw || typeof raw !== "object") return base;
    const masteredIds = raw.masteredIds || raw.mastered || [];
    const revisitIds = raw.revisitIds || raw.weakIds || [];
    return {
      ...base,
      ...raw,
      masteredIds: Array.isArray(masteredIds) ? masteredIds : [],
      revisitIds: Array.isArray(revisitIds) ? revisitIds : [],
      studyIds: Array.isArray(raw.studyIds) ? raw.studyIds : [],
      attempts: raw.attempts && typeof raw.attempts === "object" ? raw.attempts : {},
      testHistory: Array.isArray(raw.testHistory) ? raw.testHistory : Array.isArray(raw.bossHistory) ? raw.bossHistory : [],
      writtenExamHistory: Array.isArray(raw.writtenExamHistory) ? raw.writtenExamHistory : [],
      writtenExamMarks: [15, 30, 45].includes(Number(raw.writtenExamMarks)) ? Number(raw.writtenExamMarks) : 30,
      questionSetSize: normalizeQuestionSetSizeMap(raw.questionSetSize),
      recentQuestionIds: normalizeRecentQuestionIds(raw.recentQuestionIds),
      reviewSheet: normalizeReviewSheet(raw.reviewSheet),
      sessionPositions: raw.sessionPositions && typeof raw.sessionPositions === "object" ? raw.sessionPositions : {},
      sound: typeof raw.sound === "boolean" ? raw.sound : true,
    };
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return normalizeProgress(JSON.parse(raw));
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy) return normalizeProgress(JSON.parse(legacy));
    } catch (error) {
      console.warn("Could not load progress", error);
    }
    return defaultProgress();
  }

  function writeProgress() {
    state.progress.updatedAt = new Date().toISOString();
    state.progress.sound = state.sound;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
  }

  function saveProgress() {
    writeProgress();
    renderStats();
    renderDashboard();
    renderNotesDashboard();
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function unique(values) {
    return [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)));
  }

  function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }


  function reviewSheetCount(sheet = state.progress.reviewSheet) {
    const clean = normalizeReviewSheet(sheet);
    return REVIEW_CATEGORIES.reduce((sum, category) => sum + clean[category].length, 0);
  }

  function reviewHash(value) {
    const text = String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
    let hash = 0;
    for (let i = 0; i < text.length; i += 1) {
      hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
    }
    return Math.abs(hash).toString(36);
  }

  function makeReviewItemId(item = {}) {
    const category = normalizeReviewCategory(item.category);
    const unit = String(item.unit || "mixed").replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "mixed";
    const source = String(item.questionId || item.noteId || item.source || "item").replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "item";
    return `${category}-${unit}-${source}-${reviewHash([item.title, item.text, item.answer].filter(Boolean).join("|"))}`;
  }

  function isReviewSelectionActive(contextKey) {
    return Boolean(state.reviewSelection?.active && state.reviewSelection.contextKey === contextKey);
  }

  function registerReviewCandidate(item = {}) {
    const category = normalizeReviewCategory(item.category);
    const candidate = {
      id: item.id || makeReviewItemId({ ...item, category }),
      category,
      unit: String(item.unit || "").trim(),
      source: String(item.source || "").trim(),
      title: String(item.title || "").trim(),
      text: String(item.text || "").trim(),
      detail: String(item.detail || "").trim(),
      noteId: String(item.noteId || "").trim(),
      questionId: String(item.questionId || "").trim(),
      qid: String(item.qid || "").trim(),
      answer: String(item.answer || "").trim(),
      addedAt: item.addedAt || new Date().toISOString(),
    };
    if (!state.reviewCandidates || typeof state.reviewCandidates !== "object") state.reviewCandidates = {};
    state.reviewCandidates[candidate.id] = candidate;
    return candidate;
  }

  function reviewItemExists(id, category = "") {
    const sheet = normalizeReviewSheet(state.progress.reviewSheet);
    const categories = category ? [normalizeReviewCategory(category)] : REVIEW_CATEGORIES;
    return categories.some((cat) => sheet[cat].some((item) => item.id === id));
  }

  function addReviewItems(items = []) {
    const sheet = normalizeReviewSheet(state.progress.reviewSheet);
    let added = 0;
    items.forEach((raw) => {
      if (!raw || typeof raw !== "object") return;
      const item = registerReviewCandidate(raw);
      const category = normalizeReviewCategory(item.category);
      const existingIndex = sheet[category].findIndex((existing) => existing.id === item.id);
      if (existingIndex >= 0) {
        const existing = sheet[category][existingIndex];
        if (item.answer && !existing.answer) sheet[category][existingIndex] = { ...existing, answer: item.answer, detail: item.detail || existing.detail };
        return;
      }
      sheet[category].push({ ...item, category, addedAt: new Date().toISOString() });
      added += 1;
    });
    state.progress.reviewSheet = sheet;
    if (added) saveProgress();
    return added;
  }

  function removeReviewItem(category, id) {
    const sheet = normalizeReviewSheet(state.progress.reviewSheet);
    const cleanCategory = normalizeReviewCategory(category);
    sheet[cleanCategory] = sheet[cleanCategory].filter((item) => item.id !== id);
    state.progress.reviewSheet = sheet;
    saveProgress();
  }

  function clearReviewSheet() {
    state.progress.reviewSheet = emptyReviewSheet();
    saveProgress();
  }

  function compactReviewText(value, max = 180) {
    const clean = String(value || "").replace(/\s+/g, " ").trim();
    if (clean.length <= max) return clean;
    return `${clean.slice(0, max - 1).trim()}…`;
  }

  function compactQuestionAnswer(card = {}) {
    return compactReviewText(card.answer || card.explanation || "Check the linked class note for the expected answer.", 220);
  }

  function questionReviewItem(card = {}, source = "Question card", options = {}) {
    const note = noteForCard(card);
    return registerReviewCandidate({
      category: "questions",
      unit: card.unit || "",
      source,
      title: questionIdentifier(card) || card.id || "Question to review",
      text: card.question || "Question to review",
      detail: note ? `Class note: ${note.title}` : unitTitle(card.unit || ""),
      noteId: note?.id || "",
      questionId: card.id || "",
      qid: questionIdentifier(card),
      answer: options.includeAnswer === false ? "" : compactQuestionAnswer(card),
    });
  }

  function addQuestionToReview(card, source = "Question card", options = {}) {
    const added = addReviewItems([questionReviewItem(card, source, options)]);
    state.reviewNotice = added ? "Added question to last-minute review." : "This question is already on the last-minute review sheet.";
    return added;
  }

  function renderReviewSelectionToolbar(contextKey, label = "class notes") {
    const active = isReviewSelectionActive(contextKey);
    const count = reviewSheetCount();
    const notice = state.reviewNotice ? `<p class="review-sheet-notice">${escapeHtml(state.reviewNotice)}</p>` : "";
    if (active) {
      return `<div class="review-selection-toolbar active">
        <div>
          <strong>Select items for last-minute review</strong>
          <span>Choose only the formulas, vocabulary or concepts you want on the compact sheet.</span>
          ${notice}
        </div>
        <div class="review-selection-actions">
          <button class="primary-button" data-review-action="add-selected" type="button">Add selected items</button>
          <button class="secondary-button" data-review-action="cancel-selection" type="button">Cancel</button>
        </div>
      </div>`;
    }
    return `<div class="review-selection-toolbar">
      <div>
        <strong>Build a last-minute review sheet</strong>
        <span>Add selected ${escapeHtml(label)} points, then print a compact summary before the test.</span>
        ${notice}
      </div>
      <div class="review-selection-actions">
        <button class="secondary-button" data-review-action="start-selection" type="button">Add to last-minute review</button>
        <button class="soft-button" data-review-action="open-sheet" type="button">Open review sheet (${count})</button>
      </div>
    </div>`;
  }

  function renderReviewCheckbox(item, contextKey) {
    const candidate = registerReviewCandidate(item);
    if (!isReviewSelectionActive(contextKey)) return "";
    const exists = reviewItemExists(candidate.id, candidate.category);
    return `<label class="review-select-box ${exists ? "already-added" : ""}">
      <input type="checkbox" data-review-candidate="${escapeHtml(candidate.id)}" ${exists ? "disabled" : ""}>
      <span>${exists ? "Added" : "Add"}</span>
    </label>`;
  }

  function renderReviewableBulletList(items = [], category = "concepts", options = {}) {
    if (!Array.isArray(items) || !items.length) return "";
    const contextKey = options.contextKey || "";
    const title = options.title || "";
    const unit = options.unit || "";
    const detail = options.detail || title || REVIEW_CATEGORY_LABELS[normalizeReviewCategory(category)];
    const noteId = options.noteId || "";
    return `<ul class="reviewable-list">${items.map((raw) => {
      const text = typeof raw === "string" ? raw : (raw?.text || raw?.title || raw?.definition || "");
      if (!text) return "";
      const checkbox = renderReviewCheckbox({ category, unit, title, text, detail, source: options.source || title, noteId }, contextKey);
      return `<li class="reviewable-list-item">${checkbox}<span>${escapeHtml(String(text))}</span></li>`;
    }).join("")}</ul>`;
  }

  function renderReviewableVocabularySections(sections = [], options = {}) {
    if (!Array.isArray(sections) || !sections.length) return "";
    const contextKey = options.contextKey || "";
    const unit = options.unit || "";
    const entries = (terms = []) => terms.map((entry) => {
      if (entry && typeof entry === "object") {
        return { term: String(entry.term || "").trim(), definition: String(entry.definition || "").trim() };
      }
      return { term: String(entry || "").trim(), definition: "" };
    }).filter((entry) => entry.term);
    return `<div class="overview-vocabulary-list">${sections.map((section) => `
      <details class="overview-vocab-group">
        <summary>${escapeHtml(section.title || "Vocabulary")}</summary>
        <div class="overview-vocab-terms">${entries(section.terms || []).map((item) => {
          const text = item.definition ? `${item.term} — ${item.definition}` : item.term;
          const checkbox = renderReviewCheckbox({
            category: "vocabulary",
            unit,
            title: item.term,
            text,
            detail: section.title || "Vocabulary",
            source: "Unit overview vocabulary",
          }, contextKey);
          return `<article class="overview-vocab-entry reviewable-vocab-entry">${checkbox}<div><strong>${escapeHtml(item.term)}</strong>${item.definition ? `<p>${escapeHtml(item.definition)}</p>` : ""}</div></article>`;
        }).join("")}</div>
      </details>
    `).join("")}</div>`;
  }

  function bindReviewSelectionActions(contextKey) {
    $$('[data-review-action]', els.studyPanel).forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.reviewAction;
        if (action === "start-selection") {
          state.reviewSelection = { active: true, contextKey };
          state.reviewNotice = "";
          renderSession();
          return;
        }
        if (action === "cancel-selection") {
          state.reviewSelection = null;
          state.reviewNotice = "";
          renderSession();
          return;
        }
        if (action === "add-selected") {
          const selected = $$('[data-review-candidate]:checked', els.studyPanel)
            .map((input) => state.reviewCandidates?.[input.dataset.reviewCandidate])
            .filter(Boolean);
          const added = addReviewItems(selected);
          state.reviewSelection = null;
          state.reviewNotice = added ? `Added ${added} item${added === 1 ? "" : "s"} to last-minute review.` : "No new items were selected.";
          renderSession();
          return;
        }
        if (action === "open-sheet") {
          state.reviewNotice = "";
          openReviewSheet();
        }
      });
    });
  }

  function renderReviewSheetItem(item) {
    const noteButton = item.noteId && noteMeta(item.noteId) ? `<button class="soft-button review-note-link" data-review-note="${escapeHtml(item.noteId)}" type="button">Class notes</button>` : "";
    return `<article class="review-sheet-item">
      <div>
        ${item.unit ? `<span class="review-sheet-unit">${escapeHtml(item.unit)}</span>` : ""}
        ${item.title ? `<strong>${escapeHtml(item.title)}</strong>` : ""}
        <p>${escapeHtml(item.text)}</p>
        ${item.answer ? `<p class="review-sheet-answer"><b>Key answer:</b> ${escapeHtml(item.answer)}</p>` : ""}
        ${item.detail ? `<small>${escapeHtml(item.detail)}</small>` : ""}
      </div>
      <div class="review-sheet-item-actions">
        ${noteButton}
        <button class="soft-button" data-review-remove="${escapeHtml(item.id)}" data-review-category="${escapeHtml(item.category)}" type="button">Remove</button>
      </div>
    </article>`;
  }

  function renderReviewSheetDialog() {
    const sheet = normalizeReviewSheet(state.progress.reviewSheet);
    const total = reviewSheetCount(sheet);
    return `<div class="answer-help-dialog-card review-sheet-dialog-card">
      <div class="answer-help-header review-sheet-header">
        <div>
          <p class="eyebrow">Last-minute review</p>
          <h2>Review sheet</h2>
          <p>A compact summary built from selected class-note items and questions to review.</p>
        </div>
        <button class="soft-button answer-help-close" data-answer-help-close type="button" aria-label="Close review sheet">×</button>
      </div>
      <div class="review-sheet-actions">
        <button class="primary-button" data-review-print type="button">Print / Save PDF</button>
        ${total ? `<button class="secondary-button" data-review-clear type="button">Clear sheet</button>` : ""}
      </div>
      ${total ? `<div class="review-sheet-sections">
        ${REVIEW_CATEGORIES.map((category) => {
          const items = sheet[category] || [];
          return `<section class="review-sheet-section ${escapeHtml(category)}">
            <h3>${escapeHtml(REVIEW_CATEGORY_LABELS[category])} <span>${items.length}</span></h3>
            ${items.length ? items.map(renderReviewSheetItem).join("") : `<p class="empty-review-section">No ${escapeHtml(REVIEW_CATEGORY_LABELS[category].toLowerCase())} added yet.</p>`}
          </section>`;
        }).join("")}
      </div>` : `<div class="empty-state compact-empty"><h3>No review items yet</h3><p>Open class notes and use <strong>Add to last-minute review</strong>, or add questions from Revision journey and Test your knowledge.</p></div>`}
    </div>`;
  }

  function openReviewSheet() {
    if (!els.answerFormatModal) return;
    els.answerFormatModal.innerHTML = renderReviewSheetDialog();
    els.answerFormatModal.classList.remove("hidden");
    document.body.classList.add("modal-open");
    bindReviewSheetDialogActions();
    els.answerFormatModal.querySelector("[data-answer-help-close]")?.focus();
  }

  function bindReviewSheetDialogActions() {
    $$('[data-review-remove]', els.answerFormatModal).forEach((button) => {
      button.addEventListener('click', () => {
        removeReviewItem(button.dataset.reviewCategory, button.dataset.reviewRemove);
        openReviewSheet();
      });
    });
    $$('[data-review-note]', els.answerFormatModal).forEach((button) => {
      button.addEventListener('click', () => {
        closeAnswerFormatHelp();
        openNoteContext(button.dataset.reviewNote);
      });
    });
    $('[data-review-clear]', els.answerFormatModal)?.addEventListener('click', () => {
      if (confirm("Clear all items from the last-minute review sheet?")) {
        clearReviewSheet();
        openReviewSheet();
      }
    });
    $('[data-review-print]', els.answerFormatModal)?.addEventListener('click', () => {
      document.body.classList.add('print-review-sheet');
      window.print();
      setTimeout(() => document.body.classList.remove('print-review-sheet'), 250);
    });
  }

  function unitTitle(unitId) {
    return units.find((unit) => unit.id === unitId)?.title || unitId;
  }

  const unitGraphicMap = {
    "9A": "assets/brand/unit-9A-dna.webp",
    "9B": "assets/brand/unit-9B-plant.webp",
    "9E": "assets/brand/unit-9E-crystal.webp",
    "9F": "assets/brand/unit-9F-reaction.webp",
    "9I": "assets/brand/unit-9I-forces.webp",
    "9J": "assets/brand/unit-9J-magnet.webp",
  };

  const unitHeroMap = {
    "9A": "assets/brand/unit-9A-hero.webp",
    "9B": "assets/brand/unit-9B-hero.webp",
    "9E": "assets/brand/unit-9E-hero.webp",
    "9F": "assets/brand/unit-9F-hero.webp",
    "9I": "assets/brand/unit-9I-hero.webp",
    "9J": "assets/brand/unit-9J-hero.webp",
  };

  function unitGraphic(unitId) {
    return unitGraphicMap[unitId] || "";
  }

  function unitHeroGraphic(unitId) {
    return unitHeroMap[unitId] || unitGraphic(unitId) || "";
  }


  function singleDeckUnit() {
    if (!state.deck.length) return "";
    const deckUnits = unique(state.deck.map((card) => card.unit));
    return deckUnits.length === 1 ? deckUnits[0] : "";
  }

  function sessionUnitFor(card = null, explicitUnit = "") {
    if (explicitUnit) return explicitUnit;
    if (card?.unit) return card.unit;
    if (state.selectedUnits?.size === 1) return [...state.selectedUnits][0];
    return singleDeckUnit();
  }

  function updateSessionChrome({ card = null, unitId = "", title = "Reaction", subtitle = "", eyebrow = "" } = {}) {
    const resolvedUnit = sessionUnitFor(card, unitId);
    const text = modeText[state.mode] || modeText.practice;
    const modeName = state.noteContext?.overviewUnitId ? "Unit overview" : state.noteContext ? "Class Notes" : modeLabel(state.mode);
    if (els.sessionEyebrow) els.sessionEyebrow.textContent = eyebrow || text.eyebrow || "Focused session";
    if (els.sessionTitle) els.sessionTitle.textContent = title || "Reaction";
    if (els.sessionSubtitle) {
      els.sessionSubtitle.textContent = subtitle || [resolvedUnit ? unitTitle(resolvedUnit) : "Mixed units", modeName].filter(Boolean).join(" · ");
    }
    if (els.sessionUnitArt) {
      const graphic = unitHeroGraphic(resolvedUnit);
      els.sessionUnitArt.classList.toggle("empty", !graphic);
      els.sessionUnitArt.innerHTML = graphic
        ? `<img src="${escapeHtml(graphic)}" alt="" loading="lazy">`
        : `<span>Mixed units</span>`;
    }
  }

  function modeEntryText(mode = state.selectedMode) {
    if (mode === "exam") return "Open exam mode";
    if (mode === "revisit") return "Revisit your studies";
    if (mode === "revisit-test") return "Build Revisit test";
    if (mode === "test") return "Start test";
    if (mode === "unit-test") return "Build end of unit test";
    if (mode === "written") return "Build written exam";
    return "Start revision";
  }

  function modeReadyCount(mode = state.selectedMode) {
    if (mode === "exam") return 1;
    if (mode === "written") return writtenExamBank().length;
    if (mode === "unit-test") return unitTestWrittenBank().length;
    return questionsForMode(mode).length;
  }

  function modeLabel(mode = state.selectedMode) {
    if (mode === "exam") return "Exam mode";
    if (mode === "revisit") return "Revisit";
    if (mode === "revisit-test") return "Revisit test";
    if (mode === "test") return "Test your knowledge";
    if (mode === "unit-test") return "End of unit test";
    if (mode === "written") return "Written exam";
    return "Revision journey";
  }

  function objectiveMeta(objectiveId) {
    return learningObjectives.find((objective) => objective.id === objectiveId) || null;
  }

  function objectiveTitle(objectiveId) {
    return objectiveMeta(objectiveId)?.title || objectiveId || "Learning objective";
  }

  function noteMeta(noteId) {
    return classNotes.find((note) => note.id === noteId) || null;
  }

  function unitOverviewMeta(unitId) {
    return unitOverviews.find((overview) => overview.unit === unitId || overview.id === unitId) || null;
  }

  function noteForCard(card) {
    return noteMeta(card?.noteId || card?.learningObjective) || null;
  }

  function linkedCardsForNote(noteId) {
    return questions.filter((card) => (card.noteId || card.learningObjective) === noteId);
  }

  function objectivesForUnit(unitId) {
    const list = unitId && unitId !== "all"
      ? learningObjectives.filter((objective) => objective.unit === unitId)
      : learningObjectives;
    return list;
  }

  function updateObjectiveOptions() {
    if (!els.objectiveFilter) return;
    const current = els.objectiveFilter.value || "all";
    const unit = els.unitFilter.value || "all";
    const list = objectivesForUnit(unit);
    els.objectiveFilter.innerHTML = `<option value="all">All learning objectives</option>` + list.map((objective) => `<option value="${escapeHtml(objective.id)}">${escapeHtml(objective.title)}</option>`).join("");
    els.objectiveFilter.value = list.some((objective) => objective.id === current) ? current : "all";
  }

  function cardIsMcq(card) {
    return Array.isArray(card.choices) && card.choices.length >= 2 && /^[A-Z]$/.test(String(card.answer || ""));
  }

  function questionIdentifier(item) {
    return String(item?.qid || item?.questionId || item?.sourceQid || item?.sourceCardId || item?.id || "").trim();
  }

  function writtenQidType(question) {
    const cmd = normalizeWrittenCommand(question?.commandWord);
    return cmd === "calculate" ? "CALC" : "WE";
  }

  function buildQidCounterSeed() {
    const seed = {};
    questions.forEach((card) => {
      const match = String(card.qid || "").match(/^(9[A-Z])-([A-Z]+)-(\d+)$/i);
      if (!match) return;
      const unit = match[1].toUpperCase();
      const type = match[2].toUpperCase();
      const number = Number(match[3]);
      const key = `${unit}-${type}`;
      seed[key] = Math.max(seed[key] || 0, Number.isFinite(number) ? number : 0);
    });
    return seed;
  }

  function nextQuestionIdentifier(seed, unit, type) {
    const cleanUnit = String(unit || "9X").toUpperCase();
    const cleanType = String(type || "WE").toUpperCase();
    const key = `${cleanUnit}-${cleanType}`;
    seed[key] = (seed[key] || 0) + 1;
    return `${key}-${String(seed[key]).padStart(2, "0")}`;
  }

  function assignMissingWrittenQids(items) {
    const seed = buildQidCounterSeed();
    return items.map((item) => {
      if (questionIdentifier(item)) return item;
      return { ...item, qid: nextQuestionIdentifier(seed, item.unit, writtenQidType(item)) };
    });
  }

  function displayKey(index) {
    return String.fromCharCode(65 + index);
  }

  function normalizeChoice(choice, index = 0) {
    const raw = String(choice || "").trim();
    const match = raw.match(/^([A-Z])(?:[).:-]|\s)+(.+)$/);
    return {
      originalKey: match ? match[1] : displayKey(index),
      text: match ? match[2].trim() : raw,
    };
  }

  function originalChoiceText(card, answer = card.answer) {
    const normalized = (card.choices || []).map(normalizeChoice);
    const match = normalized.find((choice) => choice.originalKey === answer);
    return match ? match.text : String(answer || "");
  }

  function getDisplayChoices(card) {
    const normalized = (card.choices || []).map(normalizeChoice);
    const shouldShuffle = cardIsMcq(card) && normalized.length > 2;
    if (!state.choiceOrder || state.choiceOrder.cardId !== card.id) {
      const order = normalized.map((_, index) => index);
      state.choiceOrder = {
        cardId: card.id,
        order: shouldShuffle ? shuffle(order) : order,
      };
    }
    return state.choiceOrder.order.map((sourceIndex, displayIndex) => {
      const source = normalized[sourceIndex] || { originalKey: displayKey(sourceIndex), text: "" };
      return {
        key: displayKey(displayIndex),
        originalKey: source.originalKey,
        text: source.text,
        label: `${displayKey(displayIndex)} ${source.text}`,
        correct: source.originalKey === card.answer,
      };
    });
  }

  function correctDisplayChoice(card) {
    return getDisplayChoices(card).find((choice) => choice.correct) || { key: card.answer, text: originalChoiceText(card) };
  }

  function choiceText(card, answer = null) {
    if (answer) {
      const displayed = getDisplayChoices(card).find((choice) => choice.key === answer);
      if (displayed) return displayed.text;
    }
    return correctDisplayChoice(card).text;
  }

  function resetCardInteraction() {
    state.revealed = false;
    state.selectedChoice = null;
    state.choiceOrder = null;
    state.definitionInput = "";
    state.definitionCompared = false;
    state.definitionReview = null;
  }

  function cardIsDefinition(card) {
    return !cardIsMcq(card) && (String(card?.type || "").toLowerCase() === "vocabulary" || /^define[:\s]/i.test(String(card?.question || "")));
  }

  const DEFINITION_STOP_WORDS = new Set([
    "about", "after", "also", "and", "are", "because", "been", "being", "between", "but", "can", "called", "does", "from", "have", "into", "means", "more", "most", "that", "the", "their", "them", "then", "there", "these", "they", "this", "through", "used", "when", "where", "which", "with", "your"
  ]);

  function normalizeWord(word) {
    return String(word || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .replace(/(ing|ed|es|s)$/i, "");
  }

  function definitionKeywords(card) {
    const text = `${card?.question || ""} ${card?.answer || ""} ${card?.explanation || ""}`;
    const raw = text.match(/[A-Za-z0-9]+/g) || [];
    const words = raw
      .map(normalizeWord)
      .filter((word) => word && (word.length >= 4 || ["dna", "ion", "ohm"].includes(word)))
      .filter((word) => !DEFINITION_STOP_WORDS.has(word));
    const uniqueWords = [...new Set(words)];
    return uniqueWords.slice(0, 8);
  }

  function definitionReview(card, learnerAnswer) {
    const keywords = definitionKeywords(card);
    const learnerWords = new Set((String(learnerAnswer || "").match(/[A-Za-z0-9]+/g) || []).map(normalizeWord));
    const matched = keywords.filter((word) => learnerWords.has(word));
    const ratio = keywords.length ? matched.length / keywords.length : 0;
    let label = "Compare carefully";
    let tone = "warn";
    let guidance = "Your wording may still be valid, but compare it with the key idea and missing words.";
    if (ratio >= 0.6) {
      label = "Looks like a good match";
      tone = "good";
      guidance = "You included most of the key ideas. If the meaning is clear, mark it Secure.";
    } else if (ratio >= 0.3) {
      label = "Partly there";
      tone = "partial";
      guidance = "You have some of the right idea. Check the missing keywords before deciding.";
    }
    return { keywords, matched, missing: keywords.filter((word) => !matched.includes(word)), ratio, label, tone, guidance };
  }

  function setMembership(cardId) {
    return {
      mastered: new Set(state.progress.masteredIds || []).has(cardId),
      revisit: new Set(state.progress.revisitIds || []).has(cardId),
      study: new Set(state.progress.studyIds || []).has(cardId),
    };
  }

  function startSessionTracker(mode) {
    state.session = {
      mode,
      startedAt: new Date().toISOString(),
      cardIds: state.deck.map((card) => card.id),
      statuses: {},
    };
  }

  function recordSessionStatus(card, status) {
    if (!state.session || !card || isTestMode()) return;
    state.session.statuses[card.id] = status;
  }

  function sessionStatusCounts() {
    const statuses = Object.values(state.session?.statuses || {});
    return {
      reviewed: statuses.length,
      mastered: statuses.filter((status) => status === "mastered").length,
      revisit: statuses.filter((status) => status === "revisit").length,
      study: statuses.filter((status) => status === "study").length,
    };
  }

  function setCardStatus(card, status, options = {}) {
    const { advance = true, countAttempt = true, clearRevisit = false } = options;
    const mastered = new Set(state.progress.masteredIds || []);
    const revisit = new Set(state.progress.revisitIds || []);
    const study = new Set(state.progress.studyIds || []);
    const wasInRevisit = revisit.has(card.id);

    // If a card has already been missed, keep it in Revisit until it is answered
    // correctly from Revisit mode. This prevents a student from going back, guessing
    // again, and clearing the revision queue without actually revising it.
    const keepInRevisit = status === "mastered" && wasInRevisit && state.mode !== "revisit" && !clearRevisit;

    mastered.delete(card.id);
    study.delete(card.id);
    if (!keepInRevisit) revisit.delete(card.id);

    if (status === "mastered" && !keepInRevisit) {
      mastered.add(card.id);
      state.progress.xp = (state.progress.xp || 0) + Math.max(5, (card.level || 1) * 5);
      state.progress.streak = (state.progress.streak || 0) + 1;
      state.progress.bestStreak = Math.max(state.progress.bestStreak || 0, state.progress.streak || 0);
      celebrate();
      beep(true);
    } else if (status === "mastered" && keepInRevisit) {
      revisit.add(card.id);
      state.progress.streak = 0;
      beep(false);
    } else if (status === "revisit") {
      revisit.add(card.id);
      state.progress.streak = 0;
      beep(false);
    } else if (status === "study") {
      study.add(card.id);
      state.progress.streak = 0;
      beep(false);
    }

    state.progress.masteredIds = [...mastered];
    state.progress.revisitIds = [...revisit];
    state.progress.studyIds = [...study];
    if (countAttempt) recordSeen(card, status === "mastered" && !keepInRevisit);
    recordSessionStatus(card, keepInRevisit ? "revisit" : status);
    saveProgress();

    if (state.mode === "revisit" || state.mode === "study" || isTestMode()) {
      const currentId = card.id;
      rebuildDeck(false);
      const stillHere = state.deck.findIndex((candidate) => candidate.id === currentId);
      if (stillHere >= 0) state.index = stillHere;
      else if (state.index >= state.deck.length) state.index = Math.max(0, state.deck.length - 1);
      if (!state.deck.length) {
        finishSession();
        return;
      }
    }
    if (advance) nextCard();
    else renderCard();
  }

  function recordSeen(card, correct) {
    const attempts = state.progress.attempts || {};
    const current = attempts[card.id] || { seen: 0, correct: 0, wrong: 0 };
    current.seen += 1;
    if (correct) current.correct += 1;
    else current.wrong += 1;
    attempts[card.id] = current;
    state.progress.attempts = attempts;
  }

  function activeFilters() {
    return {
      units: new Set(state.selectedUnits || []),
      objectives: new Set(state.selectedObjectives || []),
      type: els.typeFilter?.value || "all",
      level: els.levelFilter?.value || "all",
      search: (els.searchBox?.value || "").trim().toLowerCase(),
    };
  }

  function usesQuestionSetBuilder(mode = state.selectedMode) {
    return mode === "practice" || mode === "test";
  }

  function questionSetSizeForMode(mode = state.selectedMode) {
    const sizes = normalizeQuestionSetSizeMap(state.progress.questionSetSize);
    state.progress.questionSetSize = sizes;
    return sizes[mode] || "all";
  }

  function questionSetLimit(mode = state.selectedMode, availableCount = 0) {
    if (!usesQuestionSetBuilder(mode)) return availableCount;
    const size = questionSetSizeForMode(mode);
    return size === "all" ? availableCount : Math.max(0, Math.min(Number(size), availableCount));
  }

  function setQuestionSetSize(mode, value) {
    if (!usesQuestionSetBuilder(mode)) return;
    const sizes = normalizeQuestionSetSizeMap(state.progress.questionSetSize);
    sizes[mode] = normalizeQuestionSetSize(value, QUESTION_SET_DEFAULTS[mode] || 20);
    state.progress.questionSetSize = sizes;
    writeProgress();
    renderStats();
  }

  function isAllMaterialSelection() {
    const f = activeFilters();
    return !(f.units && f.units.size)
      && !(f.objectives && f.objectives.size)
      && (f.type || "all") === "all"
      && (f.level || "all") === "all"
      && !f.search;
  }

  function subjectForUnit(unitId) {
    return SUBJECT_ORDER.find((subject) => SUBJECT_UNITS[subject].includes(unitId)) || "other";
  }

  function recentQuestionIdSet(mode) {
    const recent = normalizeRecentQuestionIds(state.progress.recentQuestionIds);
    state.progress.recentQuestionIds = recent;
    return new Set(recent[mode] || []);
  }

  function attemptForCard(card) {
    return state.progress.attempts?.[card.id] || { seen: 0, correct: 0, wrong: 0 };
  }

  function rankedQuestionPool(cards = [], mode = state.mode) {
    const recent = recentQuestionIdSet(mode);
    const shuffled = shuffle(cards);
    return shuffled.sort((a, b) => {
      const aa = attemptForCard(a);
      const bb = attemptForCard(b);
      const score = (card, attempt) => {
        const seen = Number(attempt.seen || 0);
        const wrong = Number(attempt.wrong || 0);
        const correct = Number(attempt.correct || 0);
        return (recent.has(card.id) ? 80 : 0) + (seen * 8) + correct - (wrong * 2);
      };
      return score(a, aa) - score(b, bb);
    });
  }

  function takeRankedCards(pool, count, pickedIds, mode) {
    if (count <= 0) return [];
    const result = [];
    for (const card of rankedQuestionPool(pool, mode)) {
      if (pickedIds.has(card.id)) continue;
      result.push(card);
      pickedIds.add(card.id);
      if (result.length >= count) break;
    }
    return result;
  }

  function takeBalancedCards(pool, count, pickedIds, mode) {
    if (count <= 0) return [];
    if (!isAllMaterialSelection()) return takeRankedCards(pool, count, pickedIds, mode);
    const grouped = new Map();
    SUBJECT_ORDER.forEach((subject) => grouped.set(subject, []));
    grouped.set("other", []);
    rankedQuestionPool(pool, mode).forEach((card) => {
      if (pickedIds.has(card.id)) return;
      const subject = subjectForUnit(card.unit);
      if (!grouped.has(subject)) grouped.set(subject, []);
      grouped.get(subject).push(card);
    });
    const result = [];
    let guard = 0;
    while (result.length < count && guard < count * 8 + 12) {
      guard += 1;
      const subjects = SUBJECT_ORDER.filter((subject) => (grouped.get(subject) || []).length);
      const fallback = (grouped.get("other") || []).length ? ["other"] : [];
      const availableSubjects = subjects.length ? subjects : fallback;
      if (!availableSubjects.length) break;
      availableSubjects.sort((a, b) => {
        const pickedA = result.filter((card) => subjectForUnit(card.unit) === a).length;
        const pickedB = result.filter((card) => subjectForUnit(card.unit) === b).length;
        return pickedA - pickedB;
      });
      const subject = availableSubjects[0];
      const next = grouped.get(subject).shift();
      if (!next || pickedIds.has(next.id)) continue;
      result.push(next);
      pickedIds.add(next.id);
    }
    return result;
  }

  function mixedQuestionSetFromPool(available = [], mode = state.mode, limit = available.length, pickedIds = new Set()) {
    if (limit <= 0 || !available.length) return [];
    const revisit = new Set(state.progress.revisitIds || []);
    const revisitPool = available.filter((card) => revisit.has(card.id));
    const newPool = available.filter((card) => !revisit.has(card.id) && !Number(attemptForCard(card).seen || 0));
    const olderPool = available.filter((card) => !revisit.has(card.id) && Number(attemptForCard(card).seen || 0));
    const revisitShare = mode === "test" ? 0.2 : 0.3;
    const revisitTarget = Math.min(revisitPool.length, Math.round(limit * revisitShare));
    const selected = [];
    selected.push(...takeRankedCards(revisitPool, revisitTarget, pickedIds, mode));
    selected.push(...takeRankedCards(newPool, limit - selected.length, pickedIds, mode));
    selected.push(...takeRankedCards(olderPool, limit - selected.length, pickedIds, mode));
    selected.push(...takeRankedCards(revisitPool, limit - selected.length, pickedIds, mode));
    return selected.slice(0, limit);
  }

  function balancedSubjectTargets(available = [], limit = 0) {
    const counts = new Map(SUBJECT_ORDER.map((subject) => [subject, available.filter((card) => subjectForUnit(card.unit) === subject).length]));
    const targets = new Map(SUBJECT_ORDER.map((subject) => [subject, 0]));
    let remaining = Math.max(0, limit);
    while (remaining > 0) {
      let assignedThisRound = 0;
      for (const subject of SUBJECT_ORDER) {
        if (remaining <= 0) break;
        const count = counts.get(subject) || 0;
        const current = targets.get(subject) || 0;
        if (current >= count) continue;
        targets.set(subject, current + 1);
        assignedThisRound += 1;
        remaining -= 1;
      }
      if (!assignedThisRound) break;
    }
    return targets;
  }

  function interleaveSubjectCards(cards = []) {
    const grouped = new Map();
    SUBJECT_ORDER.forEach((subject) => grouped.set(subject, []));
    grouped.set("other", []);
    cards.forEach((card) => {
      const subject = subjectForUnit(card.unit);
      if (!grouped.has(subject)) grouped.set(subject, []);
      grouped.get(subject).push(card);
    });
    const ordered = [];
    let guard = 0;
    while (ordered.length < cards.length && guard < cards.length * 4 + 12) {
      guard += 1;
      const subjects = [...SUBJECT_ORDER, "other"].filter((subject) => (grouped.get(subject) || []).length);
      if (!subjects.length) break;
      subjects.sort((a, b) => {
        const pickedA = ordered.filter((card) => subjectForUnit(card.unit) === a).length;
        const pickedB = ordered.filter((card) => subjectForUnit(card.unit) === b).length;
        return pickedA - pickedB;
      });
      const next = grouped.get(subjects[0]).shift();
      if (next) ordered.push(next);
    }
    return ordered;
  }

  function buildBalancedSubjectQuestionSet(available = [], mode = state.mode, limit = available.length) {
    const targets = balancedSubjectTargets(available, limit);
    const pickedIds = new Set();
    const selected = [];
    for (const subject of SUBJECT_ORDER) {
      const target = targets.get(subject) || 0;
      const pool = available.filter((card) => subjectForUnit(card.unit) === subject);
      selected.push(...mixedQuestionSetFromPool(pool, mode, target, pickedIds));
    }
    if (selected.length < limit) {
      selected.push(...mixedQuestionSetFromPool(available, mode, limit - selected.length, pickedIds));
    }
    return interleaveSubjectCards(selected).slice(0, limit);
  }

  function buildPriorityQuestionSet(available = [], mode = state.mode, limit = available.length) {
    if (!usesQuestionSetBuilder(mode) || limit >= available.length) return available.slice();
    if (isAllMaterialSelection()) return buildBalancedSubjectQuestionSet(available, mode, limit);
    return mixedQuestionSetFromPool(available, mode, limit, new Set());
  }

  function buildDeckForMode(mode = state.mode) {
    const available = questionsForMode(mode);
    if (!usesQuestionSetBuilder(mode)) return available;
    const limit = questionSetLimit(mode, available.length);
    return buildPriorityQuestionSet(available, mode, limit);
  }

  function rememberQuestionSet(mode, cards = []) {
    if (!usesQuestionSetBuilder(mode) || !cards.length) return;
    const recent = normalizeRecentQuestionIds(state.progress.recentQuestionIds);
    const ids = cards.map((card) => card.id).filter(Boolean);
    const combined = [...ids, ...(recent[mode] || [])];
    recent[mode] = unique(combined).slice(0, 160);
    state.progress.recentQuestionIds = recent;
    writeProgress();
  }

  function renderQuestionSetControls(mode = state.selectedMode, ready = 0) {
    if (!usesQuestionSetBuilder(mode) || ready <= 0) return "";
    const selected = questionSetSizeForMode(mode);
    const options = QUESTION_SET_SIZE_OPTIONS.map((value) => {
      const active = String(selected) === String(value);
      const label = value === "all" ? "All" : String(value);
      return `<button class="question-size-option ${active ? "active" : ""}" data-question-set-size="${escapeHtml(value)}" type="button" aria-pressed="${active}">${escapeHtml(label)}</button>`;
    }).join("");
    const limit = questionSetLimit(mode, ready);
    return `<span class="question-set-size-controls"><span class="question-size-label">Number of questions</span><span class="question-size-options">${options}</span><span class="question-size-note">This session will use ${limit} of ${ready} available questions.</span></span>`;
  }

  function bindQuestionSetControls() {
    $$('[data-question-set-size]').forEach((button) => {
      button.addEventListener('click', () => setQuestionSetSize(state.selectedMode, button.dataset.questionSetSize));
    });
  }

  function sessionPositionKey(mode = state.mode) {
    const f = activeFilters();
    const unitsKey = [...(f.units || [])].sort().join(",") || "all";
    const objectivesKey = [...(f.objectives || [])].sort().join(",") || "all";
    return [mode, unitsKey, objectivesKey, f.type || "all", f.level || "all", f.search || ""].join("|");
  }

  function saveSessionPosition() {
    if (!state.deck.length || state.noteContext || isTestMode()) return;
    const card = state.deck[state.index];
    if (!card) return;
    const positions = state.progress.sessionPositions && typeof state.progress.sessionPositions === "object" ? state.progress.sessionPositions : {};
    positions[sessionPositionKey()] = {
      index: state.index,
      cardId: card.id,
      updatedAt: new Date().toISOString(),
    };
    state.progress.sessionPositions = positions;
    writeProgress();
  }

  function restoreSessionPosition(mode = state.mode) {
    if (!state.deck.length || isTestMode(mode)) return;
    const saved = state.progress.sessionPositions?.[sessionPositionKey(mode)];
    if (!saved) return;
    const byCard = state.deck.findIndex((card) => card.id === saved.cardId);
    if (byCard >= 0) state.index = byCard;
    else if (Number.isFinite(Number(saved.index))) state.index = Math.max(0, Math.min(state.deck.length - 1, Number(saved.index)));
  }

  function selectionMatchesCard(card, filters = activeFilters()) {
    const unitsSelected = filters.units && filters.units.size > 0;
    const objectivesSelected = filters.objectives && filters.objectives.size > 0;
    if (!unitsSelected && !objectivesSelected) return true;
    return (unitsSelected && filters.units.has(card.unit)) || (objectivesSelected && filters.objectives.has(card.learningObjective));
  }

  function baseFilteredCards() {
    const f = activeFilters();
    return questions.filter((card) => {
      if (!selectionMatchesCard(card, f)) return false;
      if (f.type !== "all" && card.type !== f.type) return false;
      if (f.level !== "all" && String(card.level) !== f.level) return false;
      if (f.search) {
        const haystack = [
          card.question,
          card.answer,
          card.explanation,
          card.source,
          card.cue,
          card.learningObjectiveTitle,
          card.learningObjectiveDescription,
          ...(card.choices || []),
          ...(card.tags || []),
        ].join(" ").toLowerCase();
        if (!haystack.includes(f.search)) return false;
      }
      return true;
    });
  }

  function selectedObjectivesForUnit(unitId) {
    return learningObjectives.filter((objective) => objective.unit === unitId && state.selectedObjectives.has(objective.id));
  }

  function toggleUnitSelection(unitId) {
    if (state.selectedUnits.has(unitId)) state.selectedUnits.delete(unitId);
    else state.selectedUnits.add(unitId);
    renderStats();
    renderDashboard();
  }

  function toggleObjectiveSelection(objectiveId) {
    if (state.selectedObjectives.has(objectiveId)) state.selectedObjectives.delete(objectiveId);
    else state.selectedObjectives.add(objectiveId);
    renderStats();
    renderDashboard();
  }

  function questionsForMode(mode = state.mode) {
    const base = baseFilteredCards();
    const mastered = new Set(state.progress.masteredIds || []);
    const revisit = new Set(state.progress.revisitIds || []);
    const study = new Set(state.progress.studyIds || []);

    if (mode === "revisit") return base.filter((card) => revisit.has(card.id));
    if (mode === "study") return base.filter((card) => study.has(card.id));
    if (mode === "test") return base;
    if (mode === "revisit-test") return base.filter((card) => revisit.has(card.id));
    if (mode === "unit-test") return unitTestWrittenBank();
    if (mode === "written") return writtenExamBank();
    if (mode === "exam") return [];
    return base;
  }

  function isWrittenMode(mode = state.mode) {
    return mode === "written" || mode === "unit-test";
  }

  function rebuildDeck(resetIndex = true) {
    if (isWrittenMode()) return;
    state.deck = buildDeckForMode(state.mode);
    if (resetIndex || state.index >= state.deck.length) state.index = 0;
    resetCardInteraction();
  }

  function initFilters() {
    if (els.unitFilter) els.unitFilter.innerHTML = `<option value="all">All units</option>` + units.map((unit) => `<option value="${escapeHtml(unit.id)}">${escapeHtml(unit.title)}</option>`).join("");
    updateObjectiveOptions();
    const types = unique(questions.map((card) => card.type));
    if (els.typeFilter) els.typeFilter.innerHTML = `<option value="all">All card types</option>` + types.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join("");

    [els.typeFilter, els.levelFilter, els.searchBox].filter(Boolean).forEach((el) => {
      el.addEventListener("input", () => {
        if (els.sessionView.classList.contains("hidden")) {
          renderStats();
          renderDashboard();
        } else {
          rebuildDeck(true);
          renderSession();
        }
      });
    });

    els.shuffleButton?.addEventListener("click", () => {
      state.mode = "practice";
      state.deck = buildDeckForMode("practice");
      state.index = 0;
      rememberQuestionSet("practice", state.deck);
      startSession("practice", { preserveDeck: true });
    });
  }

  function startSession(mode, options = {}) {
    if (mode === "exam") {
      window.location.href = "exam-paper.html";
      return;
    }
    state.mode = mode;
    state.noteContext = null;
    state.test = isTestMode(mode) ? { answers: {}, submitted: false, typeOpen: {} } : null;
    state.written = null;
    if (isWrittenMode(mode)) {
      const totalMarks = [15, 30, 45].includes(Number(options.totalMarks)) ? Number(options.totalMarks) : (state.progress.writtenExamMarks || 30);
      state.progress.writtenExamMarks = totalMarks;
      const unitId = mode === "unit-test" ? selectedUnitTestUnit() : null;
      state.written = { totalMarks, unitId, answers: {}, marksAwarded: {}, submitted: {}, formatOpen: {}, revisitAdded: {} };
      state.deck = mode === "unit-test" ? buildUnitWrittenExam(totalMarks, unitId) : buildWrittenExam(totalMarks);
      state.index = 0;
      resetCardInteraction();
      writeProgress();
    } else {
      resetCardInteraction();
      if (!options.preserveDeck) {
        rebuildDeck(true);
        if (!usesQuestionSetBuilder(mode) || questionSetSizeForMode(mode) === "all") restoreSessionPosition(mode);
        rememberQuestionSet(mode, state.deck);
      }
      if (!isTestMode(mode)) startSessionTracker(mode);
    }

    document.body.classList.add("session-active");
    els.hubView.classList.add("hidden");
    els.sessionView.classList.remove("hidden");
    els.resultPanel.classList.add("hidden");
    renderSession();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showHub() {
    saveSessionPosition();
    document.body.classList.remove("session-active");
    els.sessionView.classList.add("hidden");
    els.hubView.classList.remove("hidden");
    state.test = null;
    state.written = null;
    state.session = null;
    state.noteContext = null;
    resetCardInteraction();
    renderStats();
    renderDashboard();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderStats() {
    const mastered = new Set(state.progress.masteredIds || []);
    const revisit = new Set(state.progress.revisitIds || []);
    const study = new Set(state.progress.studyIds || []);

    const selectedCards = baseFilteredCards();
    const sortedSelected = selectedCards.filter((card) => mastered.has(card.id) || revisit.has(card.id) || study.has(card.id)).length;
    const ready = modeReadyCount(state.selectedMode);
    if (els.totalCardCount) els.totalCardCount.textContent = questions.length;
    if (els.journeyCount) els.journeyCount.textContent = `${sortedSelected} / ${selectedCards.length} sorted`;
    if (els.xpStat) els.xpStat.textContent = state.progress.xp || 0;
    if (els.streakStat) els.streakStat.textContent = state.progress.streak || 0;
    if (els.masteredStat) els.masteredStat.textContent = questionsForMode("test").length;
    if (els.hubMasteredStat) els.hubMasteredStat.textContent = mastered.size;
    if (els.revisitStat) els.revisitStat.textContent = questionsForMode("revisit").length;
    if (els.hubRevisitStat) els.hubRevisitStat.textContent = revisit.size;
    if (els.hubRevisitTestStat) els.hubRevisitTestStat.textContent = questionsForMode("revisit-test").length;
    if (els.studyStat) els.studyStat.textContent = study.size;
    if (els.hubStudyStat) els.hubStudyStat.textContent = study.size;
    if (els.routeEntryButton) {
      if (state.selectedMode === "exam") {
        els.routeEntryButton.textContent = modeEntryText();
        els.routeEntryButton.disabled = false;
      } else if (state.selectedMode === "written" || state.selectedMode === "unit-test") {
        const marks = state.progress.writtenExamMarks || 30;
        els.routeEntryButton.textContent = `${modeEntryText()} (${marks} marks)`;
        els.routeEntryButton.disabled = state.selectedMode === "unit-test" ? ready === 0 : false;
      } else if (usesQuestionSetBuilder(state.selectedMode)) {
        const limit = questionSetLimit(state.selectedMode, ready);
        els.routeEntryButton.textContent = `${modeEntryText()} (${limit})`;
        els.routeEntryButton.disabled = ready === 0 || limit === 0;
      } else {
        els.routeEntryButton.textContent = `${modeEntryText()} (${ready})`;
        els.routeEntryButton.disabled = ready === 0;
      }
    }
    if (els.selectionSummary) {
      const unitCount = state.selectedUnits.size;
      const objectiveCount = state.selectedObjectives.size;
      if (state.selectedMode === "exam") {
        els.selectionSummary.textContent = "Exam mode: normal 80-mark source-style written paper";
      } else if (state.selectedMode === "written") {
        const marks = state.progress.writtenExamMarks || 30;
        const perDomain = marks / 3;
        els.selectionSummary.textContent = `Written exam: ${marks} marks · ${perDomain} marks each for Biology, Chemistry and Physics · ${writtenExamBank().length} questions available`;
      } else if (state.selectedMode === "unit-test") {
        const marks = state.progress.writtenExamMarks || 30;
        const unitId = selectedUnitTestUnit();
        els.selectionSummary.textContent = unitId
          ? `End of unit test: ${unitTitle(unitId)} · ${marks} marks · ${ready} written questions available`
          : "End of unit test: choose exactly one unit";
      } else if (state.selectedMode === "revisit-test") {
        els.selectionSummary.textContent = `Revisit test: ${ready} Revisit card${ready === 1 ? "" : "s"} available`;
      } else if (usesQuestionSetBuilder(state.selectedMode)) {
        const limit = questionSetLimit(state.selectedMode, ready);
        const availableText = `${ready} card${ready === 1 ? "" : "s"} available`;
        const setText = questionSetSizeForMode(state.selectedMode) === "all" ? "all selected" : `${limit}-question set`;
        els.selectionSummary.textContent = !unitCount && !objectiveCount
          ? `Selected questions: all units · ${availableText} · ${setText}`
          : `Selected questions: ${unitCount || "all"} unit${unitCount === 1 ? "" : "s"} · ${objectiveCount} sub-unit${objectiveCount === 1 ? "" : "s"} · ${availableText} · ${setText}`;
      } else if (!unitCount && !objectiveCount) els.selectionSummary.textContent = `Selected questions: all units · ${ready} card${ready === 1 ? "" : "s"}`;
      else els.selectionSummary.textContent = `Selected questions: ${unitCount || "all"} unit${unitCount === 1 ? "" : "s"} · ${objectiveCount} sub-unit${objectiveCount === 1 ? "" : "s"} · ${ready} card${ready === 1 ? "" : "s"}`;
    }
    if (els.selectionDetail) {
      const detailText = state.selectedMode === "exam"
        ? "Opens the digital-first paper. Use Print / Save PDF inside exam mode only if needed."
        : state.selectedMode === "written"
          ? "Answer the paper in three sections: core knowledge, written reasoning, then data and calculations. Self-mark each response after submitting it."
          : state.selectedMode === "unit-test"
            ? "Select one unit to build a written test that covers its sub-units."
            : state.selectedMode === "test"
              ? "Choose a smaller mixed set. The app includes mostly new questions plus a few Revisit questions. Answers unlock after submission."
              : state.selectedMode === "revisit-test"
                ? "Select units or sub-units below to narrow the Revisit test, or leave all selected."
                : `Choose a smaller mixed set. The app includes mostly new questions plus a few Revisit questions.`;
      els.selectionDetail.innerHTML = `<span>${escapeHtml(detailText)}</span>${renderQuestionSetControls(state.selectedMode, ready)}`;
      bindQuestionSetControls();
    }
    $$('[data-mode-select]').forEach((button) => {
      const active = button.dataset.modeSelect === state.selectedMode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-checked', String(active));
    });
    els.soundToggle.textContent = state.sound ? "Sound on" : "Sound off";
    els.soundToggle.setAttribute("aria-pressed", String(state.sound));
  }

  function renderDashboard() {
    const mastered = new Set(state.progress.masteredIds || []);
    const revisit = new Set(state.progress.revisitIds || []);
    const study = new Set(state.progress.studyIds || []);

    els.unitDashboard.innerHTML = units.map((unit) => {
      const unitCards = questions.filter((card) => card.unit === unit.id);
      const masteredCount = unitCards.filter((card) => mastered.has(card.id)).length;
      const revisitCount = unitCards.filter((card) => revisit.has(card.id)).length;
      const studyCount = unitCards.filter((card) => study.has(card.id)).length;
      const pct = unitCards.length ? Math.round((masteredCount / unitCards.length) * 100) : 0;
      const selectedUnit = state.selectedUnits.has(unit.id);
      const graphic = unitGraphic(unit.id);
      const objectiveRows = learningObjectives
        .filter((objective) => objective.unit === unit.id)
        .map((objective) => {
          const objectiveCards = unitCards.filter((card) => card.learningObjective === objective.id);
          const objectiveMastered = objectiveCards.filter((card) => mastered.has(card.id)).length;
          const objectiveRevisit = objectiveCards.filter((card) => revisit.has(card.id)).length;
          const objectiveStudy = objectiveCards.filter((card) => study.has(card.id)).length;
          const selectedObjective = state.selectedObjectives.has(objective.id);
          const objectivePct = objectiveCards.length ? Math.round((objectiveMastered / objectiveCards.length) * 100) : 0;
          return `<div class="objective-row ${selectedObjective ? "selected" : ""}">
            <button class="objective-toggle" data-objective-toggle="${escapeHtml(objective.id)}" type="button" aria-pressed="${selectedObjective}">
              <strong>${escapeHtml(objective.title)}</strong>
              <span>${objectiveCards.length} questions · ${objectiveMastered}/${objectiveCards.length} secure · ${objectiveRevisit} revisit · ${objectiveStudy} notes</span>
              <span class="objective-progress-track" aria-label="${objectiveMastered} of ${objectiveCards.length} questions secure"><i style="width:${objectivePct}%"></i></span>
            </button>
            <button class="objective-notes-button" data-note-open="${escapeHtml(objective.id)}" type="button" aria-label="Open class notes for ${escapeHtml(objective.title)}"><span aria-hidden="true">📘</span><span class="notes-button-text">Class Notes</span></button>
          </div>`;
        }).join("");
      const sortedCount = masteredCount + revisitCount + studyCount;
      return `
        <article class="panel unit-card ${selectedUnit ? "selected" : ""}" data-unit-card="${escapeHtml(unit.id)}">
          ${graphic ? `<div class="unit-graphic"><img src="${escapeHtml(graphic)}" alt="" loading="lazy"></div>` : ""}
          <div class="unit-summary-row">
            <span class="pill">${sortedCount} / ${unitCards.length} sorted</span>
            <span class="pill good">${masteredCount}/${unitCards.length} secure</span>
            <span class="pill warn">${revisitCount} revisit</span>
            <span class="pill study">${studyCount} notes</span>
          </div>
          <h3>${escapeHtml(unit.title)}</h3>
          <p>${escapeHtml(unit.theme)}</p>
          <div class="unit-progress-summary"><span>Unit progress</span><strong>${pct}%</strong></div>
          <div class="progress-track" aria-label="${masteredCount} of ${unitCards.length} questions secure"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="objective-list" aria-label="Learning objectives in ${escapeHtml(unit.title)}">
            <div class="objective-row full-unit-row ${selectedUnit ? "selected" : ""}">
              <button class="objective-toggle full-unit-toggle" data-unit-toggle="${escapeHtml(unit.id)}" type="button" aria-pressed="${selectedUnit}">
                <strong>${escapeHtml(unit.title)}</strong>
                <span>Full unit · ${unitCards.length} revision questions</span>
              </button>
            </div>
            ${unitOverviewMeta(unit.id) ? `<div class="unit-overview-row"><button class="unit-overview-button" data-unit-overview="${escapeHtml(unit.id)}" type="button">📚 Unit overview</button></div>` : ""}
            ${objectiveRows}
          </div>
        </article>
      `;
    }).join("");

    $$('[data-unit-toggle]', els.unitDashboard).forEach((button) => {
      button.addEventListener('click', () => toggleUnitSelection(button.dataset.unitToggle));
    });
    $$('[data-objective-toggle]', els.unitDashboard).forEach((button) => {
      button.addEventListener('click', () => toggleObjectiveSelection(button.dataset.objectiveToggle));
    });
    $$('[data-note-open]', els.unitDashboard).forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        openNoteContext(button.dataset.noteOpen);
      });
    });
    $$('[data-unit-overview]', els.unitDashboard).forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        openUnitOverviewContext(button.dataset.unitOverview);
      });
    });
  }


  function renderNotesDashboard() {
    return;
  }

  function openUnitOverviewContext(unitId) {
    state.noteContext = { overviewUnitId: unitId };
    state.test = null;
    resetCardInteraction();
    document.body.classList.add("session-active");
    els.hubView.classList.add("hidden");
    els.sessionView.classList.remove("hidden");
    els.resultPanel.classList.add("hidden");
    renderSession();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderPlainList(items = []) {
    if (!Array.isArray(items) || !items.length) return "";
    return `<ul>${items.map((item) => `<li>${escapeHtml(String(item))}</li>`).join("")}</ul>`;
  }

  function renderOverviewMedia(items, className = "overview-media-grid") {
    const mediaItems = Array.isArray(items) ? items : (items ? [items] : []);
    if (!mediaItems.length) return "";
    return renderMediaItems(mediaItems, "Unit overview visual", className, { showCaptions: true });
  }

  function renderOverviewRoute(items = []) {
    if (!Array.isArray(items) || !items.length) return "";
    return `<div class="overview-route-grid">${items.map((item) => `
      <article class="overview-route-card">
        <strong>${escapeHtml(item.title || "Sub-unit")}</strong>
        <p>${escapeHtml(item.focus || "")}</p>
      </article>
    `).join("")}</div>`;
  }

  function renderVocabularySections(sections = []) {
    if (!Array.isArray(sections) || !sections.length) return "";
    const entries = (terms = []) => terms.map((entry) => {
      if (entry && typeof entry === "object") {
        return { term: String(entry.term || "").trim(), definition: String(entry.definition || "").trim() };
      }
      return { term: String(entry || "").trim(), definition: "" };
    }).filter((entry) => entry.term);
    return `<div class="overview-vocabulary-list">${sections.map((section) => `
      <details class="overview-vocab-group">
        <summary>${escapeHtml(section.title || "Vocabulary")}</summary>
        <div class="overview-vocab-terms">${entries(section.terms || []).map((item) => `<article class="overview-vocab-entry"><strong>${escapeHtml(item.term)}</strong>${item.definition ? `<p>${escapeHtml(item.definition)}</p>` : ""}</article>`).join("")}</div>
      </details>
    `).join("")}</div>`;
  }

  function renderTargetedSubUnits(items = []) {
    if (!Array.isArray(items) || !items.length) return "";
    return `<div class="targeted-subunit-grid">${items.map((item) => `
      <article class="targeted-subunit-card">
        <strong>${escapeHtml(item.title || "Sub-unit")}</strong>
        <p>${escapeHtml(item.description || "")}</p>
      </article>
    `).join("")}</div>`;
  }

  function renderOverviewPracticeLinks(qids = []) {
    const clean = Array.isArray(qids) ? qids.filter(Boolean) : [];
    if (!clean.length) return "";
    return `<div class="overview-practice-row"><strong>Practise questions:</strong>${clean.map((qid) => `<button class="overview-qid-button" data-overview-practice="${escapeHtml(qid)}" type="button">${escapeHtml(qid)}</button>`).join("")}</div>`;
  }

  function renderOverviewClassNoteLink(noteId) {
    if (!noteId) return "";
    const note = noteMeta(noteId);
    if (!note) return "";
    return `<button class="secondary-button overview-note-button" data-overview-note="${escapeHtml(noteId)}" type="button">Learn this: ${escapeHtml(note.title)}</button>`;
  }
  function isYearEndEssentialNote(note = {}) {
    return String(note.objective || "").startsWith("year-end-essentials");
  }

  function commonMistakeText(item) {
    if (!item) return "";
    if (typeof item === "string") return item;
    if (typeof item === "object") {
      const wrong = item.wrong ? `Avoid: ${item.wrong}` : "";
      const correct = item.correct ? `Use: ${item.correct}` : "";
      const why = item.why ? `Why: ${item.why}` : "";
      return [wrong, correct, why].filter(Boolean).join(" ");
    }
    return String(item);
  }

  function yearEndEssentialsForUnit(unitId) {
    return classNotes.filter((note) => note.unit === unitId && isYearEndEssentialNote(note));
  }

  function renderYearEndEssentialsSection(unitId, contextKey = "") {
    const notes = yearEndEssentialsForUnit(unitId);
    if (!notes.length) return "";
    return `<section class="note-section targeted-overview-section year-end-essentials-section">
      <div class="year-end-essentials-heading">
        <div>
          <p class="overview-kicker">Year-end essentials</p>
          <h3>High-value exam content for this unit</h3>
        </div>
        <p>These used to sit behind a separate Year-end essentials button. They now live inside the relevant unit overview and class notes.</p>
      </div>
      <div class="year-end-essential-grid">
        ${notes.map((note) => {
          const keyPoints = Array.isArray(note.keyPoints) ? note.keyPoints.slice(0, 6) : [];
          const mistakes = Array.isArray(note.commonMistakes) ? note.commonMistakes.map(commonMistakeText).filter(Boolean).slice(0, 3) : [];
          return `<article class="year-end-essential-card">
            <h4>${escapeHtml(note.title || "Year-end essential")}</h4>
            ${note.summary ? `<p>${escapeHtml(note.summary)}</p>` : ""}
            ${keyPoints.length ? `<details open><summary>Must know</summary>${renderReviewableBulletList(keyPoints, "concepts", { contextKey, unit: unitId, title: note.title || "Year-end essential", detail: "Year-end essentials", source: "Year-end essentials", noteId: note.id })}</details>` : ""}
            ${mistakes.length ? `<details><summary>Common exam traps</summary>${renderReviewableBulletList(mistakes, "concepts", { contextKey, unit: unitId, title: note.title || "Common exam trap", detail: "Year-end essentials · common trap", source: "Year-end essentials", noteId: note.id })}</details>` : ""}
            <button class="secondary-button overview-note-button" data-overview-note="${escapeHtml(note.id)}" type="button">Open class note</button>
          </article>`;
        }).join("")}
      </div>
    </section>`;
  }


  function renderTargetedChecklistItem(item = {}, index = 0, options = {}) {
    const media = Array.isArray(item.media) ? item.media : (item.media ? [item.media] : []);
    const mediaItems = media.map((entry) => typeof entry === "string" ? { src: entry, alt: item.title || "Study image" } : entry);
    const category = options.category || "concepts";
    const contextKey = options.contextKey || "";
    const unit = options.unit || "";
    const title = item.title || `Checklist item ${index + 1}`;
    const summaryText = item.description ? `${title} — ${item.description}` : title;
    const checkbox = renderReviewCheckbox({
      category,
      unit,
      title,
      text: summaryText,
      detail: options.title || "Unit overview",
      source: "Unit overview",
      noteId: item.noteId || "",
    }, contextKey);
    return `
      <details class="targeted-check-row">
        <summary><span class="targeted-summary-title">${checkbox}<span>${escapeHtml(title)}</span></span></summary>
        <div class="targeted-check-detail">
          ${Array.isArray(item.notes) && item.notes.length ? renderReviewableBulletList(item.notes, category, { contextKey, unit, title, detail: options.title || title, source: "Unit overview", noteId: item.noteId || "" }) : ""}
          ${mediaItems.length ? renderMediaItems(mediaItems, item.title || "Study visual", "media-grid overview-detail-media", { showCaptions: true }) : ""}
          <div class="overview-detail-actions">
            ${renderOverviewClassNoteLink(item.noteId)}
            ${renderOverviewPracticeLinks(item.practice)}
          </div>
        </div>
      </details>
    `;
  }

  function renderTargetedChecklistSection(title, items = [], className = "", options = {}) {
    if (!Array.isArray(items) || !items.length) return "";
    return `<section class="note-section targeted-overview-section ${escapeHtml(className)}"><h3>${escapeHtml(title)}</h3><div class="targeted-check-list">${items.map((item, index) => renderTargetedChecklistItem(item, index, { ...options, title })).join("")}</div></section>`;
  }

  function qidCard(qid) {
    return questions.find((card) => card.qid === qid || card.id === qid);
  }

  function practiceOverviewQids(qidString = "") {
    const qids = String(qidString || "").split(",").map((item) => item.trim()).filter(Boolean);
    const selected = qids.map(qidCard).filter(Boolean);
    if (!selected.length) return;
    state.noteContext = null;
    state.selectedMode = "practice";
    state.mode = "practice";
    state.deck = selected;
    state.index = 0;
    startSession("practice", { preserveDeck: true });
  }

  function renderTargetedUnitOverview(overview) {
    const target = overview.targetedOverview;
    const unitCards = questions.filter((card) => card.unit === overview.unit);
    const reviewContextKey = `overview:${overview.unit}`;
    state.reviewCandidates = {};
    updateSessionChrome({
      unitId: overview.unit,
      title: unitTitle(overview.unit),
      eyebrow: "Unit learning checklist",
      subtitle: `${unitTitle(overview.unit)} · What to know, understand and practise`
    });
    els.sessionIndex.textContent = String(unitCards.length);
    els.sessionTotal.textContent = " questions";
    els.resultPanel.classList.add("hidden");
    els.studyPanel.innerHTML = `
      <article class="study-card note-context-card unit-overview-card targeted-overview-card">
        <section class="note-section note-summary targeted-overview-hero">
          <p class="overview-kicker">Unit learning checklist</p>
          <h2>${escapeHtml(target.title || overview.title || `${unitTitle(overview.unit)} overview`)}</h2>
          <p>${escapeHtml(target.description || overview.summary || "")}</p>
        </section>
        ${renderReviewSelectionToolbar(reviewContextKey, "unit overview")}
        <section class="note-section targeted-overview-section">
          <h3>Sub-units</h3>
          ${renderTargetedSubUnits(target.subUnits)}
        </section>
        <section class="note-section targeted-overview-section vocabulary-section">
          <h3>Must know vocabulary</h3>
          <p class="overview-section-help">Open a group, check the terms, then use the vocabulary questions if any words are unfamiliar.</p>
          ${renderReviewableVocabularySections(target.vocabulary, { contextKey: reviewContextKey, unit: overview.unit })}
        </section>
        ${renderTargetedChecklistSection("Must understand", target.understand, "must-understand-section", { contextKey: reviewContextKey, unit: overview.unit, category: "concepts" })}
        ${renderTargetedChecklistSection("Must be able to identify", target.identify, "must-identify-section", { contextKey: reviewContextKey, unit: overview.unit, category: "concepts" })}
        ${renderTargetedChecklistSection("Must memorise equations / calculations", target.memorize, "must-memorize-section", { contextKey: reviewContextKey, unit: overview.unit, category: "formulas" })}
        ${renderYearEndEssentialsSection(overview.unit, reviewContextKey)}
        <div class="card-actions">
          <button class="primary-button" data-overview-action="practice-unit" type="button">Practise this unit</button>
          <button class="secondary-button" data-overview-action="hub" type="button">Back to revision hub</button>
        </div>
      </article>
    `;
    $$('[data-overview-action]', els.studyPanel).forEach((button) => {
      button.addEventListener('click', () => handleUnitOverviewAction(button.dataset.overviewAction, overview));
    });
    $$('[data-overview-note]', els.studyPanel).forEach((button) => {
      button.addEventListener('click', () => openNoteContext(button.dataset.overviewNote, null, overview.unit));
    });
    $$('[data-overview-practice]', els.studyPanel).forEach((button) => {
      button.addEventListener('click', () => practiceOverviewQids(button.dataset.overviewPractice));
    });
    bindReviewSelectionActions(reviewContextKey);
  }

  function renderUnitOverviewContext() {
    const ctx = state.noteContext;
    const overview = unitOverviewMeta(ctx?.overviewUnitId);
    if (!overview) {
      state.noteContext = null;
      renderSession();
      return;
    }
    if (overview.targetedOverview) {
      renderTargetedUnitOverview(overview);
      return;
    }
    const unitCards = questions.filter((card) => card.unit === overview.unit);
    const reviewContextKey = `overview:${overview.unit}`;
    state.reviewCandidates = {};
    updateSessionChrome({
      unitId: overview.unit,
      title: unitTitle(overview.unit),
      eyebrow: "Unit overview",
      subtitle: `${unitTitle(overview.unit)} · Unit map`
    });
    els.sessionIndex.textContent = String(unitCards.length);
    els.sessionTotal.textContent = " questions";
    els.resultPanel.classList.add("hidden");
    els.studyPanel.innerHTML = `
      <article class="study-card note-context-card unit-overview-card">
        <section class="note-section note-summary">
          <h2>${escapeHtml(overview.title || `${unitTitle(overview.unit)} overview`)}</h2>
          <p>${escapeHtml(overview.summary || "")}</p>
        </section>
        ${renderReviewSelectionToolbar(reviewContextKey, "unit overview")}
        ${renderOverviewMedia(overview.leadMedia, "overview-lead-media")}
        <section class="note-section">
          <h3>By the end of this unit, you should be able to...</h3>
          ${renderReviewableBulletList(overview.revisionPackFocus, "concepts", { contextKey: reviewContextKey, unit: overview.unit, title: "Unit focus", detail: "Unit overview", source: "Unit overview" })}
        </section>
        ${Array.isArray(overview.formulae) && overview.formulae.length ? `<section class="note-section formula-note"><h3>Key formulae and equations</h3>${renderReviewableBulletList(overview.formulae, "formulas", { contextKey: reviewContextKey, unit: overview.unit, title: "Formula", detail: "Key formulae and equations", source: "Unit overview" })}</section>` : ""}
        <section class="note-section">
          <h3>Sub-units and must-know points</h3>
          ${renderOverviewRoute(overview.subUnitRoute)}
        </section>
        ${Array.isArray(overview.visualTiles) && overview.visualTiles.length ? `<section class="note-section overview-visual-section"><h3>Revision images</h3>${renderOverviewMedia(overview.visualTiles, "overview-tile-media")}</section>` : ""}
        <section class="note-section sentence-note">
          <h3>How to write better answers</h3>
          ${renderPlainList(overview.examAnswerMoves)}
        </section>
        ${renderYearEndEssentialsSection(overview.unit, reviewContextKey)}
        <div class="card-actions">
          <button class="primary-button" data-overview-action="practice-unit" type="button">Practise this unit</button>
          <button class="secondary-button" data-overview-action="hub" type="button">Back to revision hub</button>
        </div>
      </article>
    `;
    $$('[data-overview-action]', els.studyPanel).forEach((button) => {
      button.addEventListener('click', () => handleUnitOverviewAction(button.dataset.overviewAction, overview));
    });
    $$('[data-overview-note]', els.studyPanel).forEach((button) => {
      button.addEventListener('click', () => openNoteContext(button.dataset.overviewNote, null, overview.unit));
    });
    $$('[data-overview-practice]', els.studyPanel).forEach((button) => {
      button.addEventListener('click', () => practiceOverviewQids(button.dataset.overviewPractice));
    });
    bindReviewSelectionActions(reviewContextKey);
  }

  function handleUnitOverviewAction(action, overview) {
    if (action === "practice-unit") {
      state.noteContext = null;
      state.selectedUnits = new Set([overview.unit]);
      state.selectedObjectives = new Set();
      startSession("practice");
      return;
    }
    showHub();
  }

  function openNoteContext(noteId, cardId = null, returnOverviewUnitId = null) {
    state.noteContext = { noteId, cardId, returnOverviewUnitId };
    state.test = null;
    resetCardInteraction();
    document.body.classList.add("session-active");
    els.hubView.classList.add("hidden");
    els.sessionView.classList.remove("hidden");
    els.resultPanel.classList.add("hidden");
    renderSession();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderCommonMistakes(mistakes = []) {
    if (!Array.isArray(mistakes) || !mistakes.length) return "";
    const rows = mistakes.map((item) => {
      if (typeof item === "string") {
        return `
          <article class="mistake-card legacy-mistake">
            <div class="mistake-block">
              <span class="mistake-label caution">Check carefully</span>
              <p>${escapeHtml(item)}</p>
            </div>
          </article>
        `;
      }
      return `
        <article class="mistake-card">
          <div class="mistake-block wrong-idea">
            <span class="mistake-label wrong">Common mistake</span>
            <p>${escapeHtml(item.wrong || "")}</p>
          </div>
          <div class="mistake-block correct-idea">
            <span class="mistake-label correct">Actually</span>
            <p>${escapeHtml(item.correct || "")}</p>
          </div>
          ${item.why ? `<div class="mistake-block why-idea"><span class="mistake-label why">Why</span><p>${escapeHtml(item.why)}</p></div>` : ""}
        </article>
      `;
    }).join("");
    return `<section class="note-section warning-note"><h3>Common mistakes</h3><div class="mistake-list">${rows}</div></section>`;
  }

  function renderNoteContext() {
    const ctx = state.noteContext;
    const note = noteMeta(ctx?.noteId);
    const sourceCard = ctx?.cardId ? questions.find((card) => card.id === ctx.cardId) : null;
    const returnOverviewUnitId = ctx?.returnOverviewUnitId || "";
    if (!note) {
      state.noteContext = null;
      renderSession();
      return;
    }
    const linked = linkedCardsForNote(note.id);
    const reviewContextKey = `note:${note.id}`;
    state.reviewCandidates = {};
    const sourceMedia = sourceCard && Array.isArray(sourceCard.media) ? sourceCard.media.filter((item) => !item.mediaTiming || item.mediaTiming === "question") : [];
    const noteMedia = Array.isArray(note.media) ? note.media : [];
    updateSessionChrome({
      unitId: note.unit,
      title: "Reaction",
      eyebrow: sourceCard ? "Study this concept" : (returnOverviewUnitId ? "Class notes" : "Class notes"),
      subtitle: `${unitTitle(note.unit)} · ${note.title}`
    });
    els.sessionIndex.textContent = String(linked.length);
    els.sessionTotal.textContent = " related questions";
    els.resultPanel.classList.add("hidden");

    els.studyPanel.innerHTML = `
      <article class="study-card note-context-card">
        <div class="card-topline">
          <div class="card-title-row">
            <span class="pill">${escapeHtml(unitTitle(note.unit))}</span>
            <span class="pill objective-pill">${escapeHtml(note.title)}</span>
            <span class="pill">Class note</span>
          </div>
        </div>
        ${sourceCard ? `<aside class="source-question"><span class="eyebrow">Question to practise</span><p>${escapeHtml(sourceCard.question)}</p></aside>` : ""}
        ${renderReviewSelectionToolbar(reviewContextKey, "class-note")}
        ${sourceMedia.length ? renderMediaItems(sourceMedia, sourceCard.question || note.title, "media-grid note-source-media") : ""}
        ${noteMedia.length ? `<section class="note-section note-visual-section"><h3>Study visual</h3>${renderMediaItems(noteMedia, note.title, "media-grid note-media-grid")}</section>` : ""}
        <section class="note-section note-summary">
          <h2>Big idea</h2>
          <div class="reviewable-note-summary">
            ${renderReviewCheckbox({ category: "concepts", unit: note.unit, title: note.title, text: note.summary, detail: "Big idea", source: "Class note", noteId: note.id }, reviewContextKey)}
            <p>${escapeHtml(note.summary)}</p>
          </div>
        </section>
        ${note.explanation ? `<section class="note-section explanation-note"><h3>Deeper explanation</h3><p>${escapeHtml(note.explanation)}</p></section>` : ""}
        <section class="note-section">
          <h3>Key points</h3>
          ${renderReviewableBulletList(note.keyPoints || [], "concepts", { contextKey: reviewContextKey, unit: note.unit, title: note.title, detail: "Key point", source: "Class note", noteId: note.id })}
        </section>
        ${note.memoryHook ? `<section class="note-section memory-note"><h3>Memory hook</h3><p>${escapeHtml(note.memoryHook)}</p></section>` : ""}
        ${Array.isArray(note.commonMistakes) && note.commonMistakes.length ? `<section class="note-section warning-note"><h3>Common mistakes</h3>${renderReviewableBulletList(note.commonMistakes.map(commonMistakeText), "concepts", { contextKey: reviewContextKey, unit: note.unit, title: note.title, detail: "Common mistake", source: "Class note", noteId: note.id })}</section>` : ""}
        ${note.example ? `<section class="note-section example-note"><h3>Worked / model example</h3><p><strong>Question:</strong> ${escapeHtml(note.example.question)}</p><p><strong>Answer:</strong> ${escapeHtml(note.example.answer)}</p></section>` : ""}
        ${note.selfCheck ? `<section class="note-section self-check-note"><h3>Quick self-check</h3><p>${escapeHtml(note.selfCheck)}</p></section>` : ""}
        ${note.sentenceStarter ? `<section class="note-section sentence-note"><h3>Useful answer sentence</h3><div class="reviewable-note-summary">${renderReviewCheckbox({ category: "concepts", unit: note.unit, title: note.title, text: note.sentenceStarter, detail: "Useful answer sentence", source: "Class note", noteId: note.id }, reviewContextKey)}<p>${escapeHtml(note.sentenceStarter)}</p></div></section>` : ""}
        ${note.practicePrompt ? `<section class="note-section practice-note"><h3>Try next</h3><p>${escapeHtml(note.practicePrompt)}</p></section>` : ""}
        <div class="card-actions">
          ${sourceCard ? `
            <button class="primary-button" data-note-action="mastered" type="button">I get it now · Secure</button>
            <button class="secondary-button" data-note-action="revisit" type="button">Almost · Revisit</button>
            <button class="danger-button" data-note-action="study" type="button">Use notes again</button>
            <button class="secondary-button" data-note-action="back-card" type="button">Back to card</button>
          ` : `
            <button class="primary-button" data-note-action="practice" type="button">Practise related questions</button>
            ${returnOverviewUnitId ? `<button class="secondary-button" data-note-action="back-overview" type="button">Back to unit overview</button>` : `<button class="secondary-button" data-note-action="hub" type="button">Back to hub</button>`}
          `}
        </div>
      </article>
    `;
    $$('[data-note-action]', els.studyPanel).forEach((button) => {
      button.addEventListener('click', () => handleNoteAction(button.dataset.noteAction, note, sourceCard, returnOverviewUnitId));
    });
    bindReviewSelectionActions(reviewContextKey);
  }

  function handleNoteAction(action, note, sourceCard, returnOverviewUnitId = "") {
    if (action === "back-overview" && returnOverviewUnitId) {
      openUnitOverviewContext(returnOverviewUnitId);
      return;
    }
    if (action === "hub") {
      showHub();
      return;
    }
    if (action === "practice") {
      state.noteContext = null;
      els.unitFilter.value = note.unit;
      updateObjectiveOptions();
      if (els.objectiveFilter) els.objectiveFilter.value = note.id;
      startSession("practice");
      return;
    }
    if (action === "back-card") {
      state.noteContext = null;
      renderSession();
      return;
    }
    if (sourceCard && ["mastered", "revisit", "study"].includes(action)) {
      state.noteContext = null;
      setCardStatus(sourceCard, action);
    }
  }

  function renderSession() {
    if (state.noteContext?.overviewUnitId) {
      renderUnitOverviewContext();
      return;
    }
    if (state.noteContext) {
      renderNoteContext();
      return;
    }
    const text = modeText[state.mode] || modeText.practice;
    updateSessionChrome({
      title: "Reaction",
      eyebrow: text.eyebrow,
      subtitle: [singleDeckUnit() ? unitTitle(singleDeckUnit()) : "Mixed units", modeLabel(state.mode)].filter(Boolean).join(" · ")
    });
    els.sessionIndex.textContent = state.deck.length ? String(state.index + 1) : "0";
    els.sessionTotal.textContent = `/ ${state.deck.length}`;

    if (!state.deck.length) {
      els.studyPanel.innerHTML = `
        <div class="empty-state">
          <h2>${escapeHtml(text.empty)}</h2>
          <p>Try changing the filters, or go back to the revision hub and choose another route.</p>
          <button class="primary-button" data-empty-back type="button">Back to hub</button>
        </div>
      `;
      $("[data-empty-back]", els.studyPanel)?.addEventListener("click", showHub);
      return;
    }

    renderCard();
  }


  function renderMediaLayerText(item, showCaptions = true) {
    if (!showCaptions) return "";
    const title = item.mediaTitle || item.title || "";
    const lead = item.mediaLead || item.caption || "";
    const points = Array.isArray(item.mediaPoints) ? item.mediaPoints.filter(Boolean) : [];
    if (!title && !lead && !points.length) return "";
    const pointList = points.length ? `<ul class="media-layer-points">${points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>` : "";
    return `
      <figcaption class="media-layer-text">
        ${title ? `<strong class="media-layer-title">${escapeHtml(title)}</strong>` : ""}
        ${lead ? `<span class="media-layer-lead">${escapeHtml(lead)}</span>` : ""}
        ${pointList}
      </figcaption>`;
  }

  function renderMediaMarkers(item) {
    const markers = Array.isArray(item.mediaMarkers) ? item.mediaMarkers : [];
    if (!markers.length) return "";
    return `<div class="media-marker-layer" aria-hidden="true">${markers.map((marker) => {
      const x = Number.isFinite(Number(marker.x)) ? Math.max(0, Math.min(100, Number(marker.x))) : 50;
      const y = Number.isFinite(Number(marker.y)) ? Math.max(0, Math.min(100, Number(marker.y))) : 50;
      const label = escapeHtml(marker.label || "");
      const markerClass = marker.variant ? ` ${escapeHtml(marker.variant)}` : "";
      return `<span class="media-marker${markerClass}" style="left:${x}%;top:${y}%">${label}</span>`;
    }).join("")}</div>`;
  }

  function renderMediaItems(items, fallbackAlt = "Study image", className = "media-grid", options = {}) {
    if (!Array.isArray(items) || !items.length) return "";
    const { showCaptions = true } = options;
    return `<div class="${className}">${items.map((item) => {
      const src = escapeHtml(item.src || "");
      const alt = escapeHtml(item.alt || fallbackAlt || "Study image");
      const presentationClass = item.presentation ? ` ${escapeHtml(item.presentation)}` : "";
      const layerText = renderMediaLayerText(item, showCaptions);
      const markers = renderMediaMarkers(item);
      return `<figure class="card-media${presentationClass}"><div class="media-visual-wrap"><img src="${src}" alt="${alt}" loading="lazy">${markers}</div>${layerText}</figure>`;
    }).join("")}</div>`;
  }

  function renderMedia(card) {
    if (!Array.isArray(card.media) || !card.media.length) return "";
    const questionMedia = card.media.filter((item) => !item.mediaTiming || item.mediaTiming === "question");
    // Question diagrams should support the task without giving away the answer or adding extra noise.
    // Captions remain available in Class Notes, but are intentionally hidden in the live question card.
    return renderMediaItems(questionMedia, card.question || "Diagram", "media-grid question-media-grid", { showCaptions: false });
  }

  function renderObjectivePanel(card) {
    return "";
  }

  function renderStudyPrompt(card) {
    if (state.mode !== "study") return "";
    const explanation = card.explanation || card.cue || "Read the question and inspect any diagram. Open Class Notes if you want the explanation before deciding.";
    return `
      <aside class="study-support">
        <strong>Class notes focus</strong>
        <p>${escapeHtml(explanation)}</p>
        <ul>
          <li>Say the key idea out loud in your own words.</li>
          <li>Use the diagram or question clue if one is shown.</li>
          <li>Use Class Notes, then move the card to Revisit or Secure.</li>
        </ul>
      </aside>
    `;
  }


  function writtenCurrentAnswer(question) {
    return state.written?.answers?.[question.id] || "";
  }

  function writtenCurrentMark(question) {
    const value = state.written?.marksAwarded?.[question.id];
    return Number.isFinite(Number(value)) ? Number(value) : null;
  }

  function renderWrittenCard() {
    const question = state.deck[state.index];
    if (!question) return;
    const submitted = Boolean(state.written?.submitted?.[question.id]);
    const typed = writtenCurrentAnswer(question);
    const awarded = writtenCurrentMark(question);
    const formatOpen = Boolean(state.written?.formatOpen?.[question.id]);
    const section = writtenSectionMeta(question);
    updateSessionChrome({
      title: state.mode === "unit-test" ? "End of unit test" : "Written exam practice",
      eyebrow: `${section.label}: ${section.focus}`,
      subtitle: state.mode === "unit-test"
        ? `${unitTitle(question.unit)} · ${question.marks} mark${question.marks === 1 ? "" : "s"}`
        : `${domainLabel(question.domain)} · ${unitTitle(question.unit)} · ${question.marks} mark${question.marks === 1 ? "" : "s"}`
    });
    els.sessionIndex.textContent = String(state.index + 1);
    els.sessionTotal.textContent = `/ ${state.deck.length}`;
    els.resultPanel.classList.add("hidden");

    els.studyPanel.innerHTML = `
      <article class="study-card written-card">
        <div class="written-question-meta">
          ${questionIdentifier(question) ? `<span class="pill question-id-pill">${escapeHtml(questionIdentifier(question))}</span>` : ""}
          <span class="pill section-pill">${escapeHtml(section.label)} · ${escapeHtml(section.focus)}</span>
          <span class="pill">${escapeHtml(domainLabel(question.domain))}</span>
          <span class="pill">${escapeHtml(unitTitle(question.unit))}</span>
          <span class="pill">${question.marks} mark${question.marks === 1 ? "" : "s"}</span>
          <span class="difficulty-meta">${renderDifficultyBubbles(question)}</span>
        </div>
        <p class="question-text">${escapeHtml(question.question)}</p>
        ${Array.isArray(question.media) && question.media.length ? renderMediaItems(question.media.filter((item) => !item.mediaTiming || item.mediaTiming === "question"), question.question || "Question diagram", "media-grid question-media-grid", { showCaptions: false }) : ""}
        <div class="written-answer-label-row">
          <label for="writtenAnswer" class="written-answer-label">Your written answer</label>
          <button class="answer-format-button" data-written-action="toggle-format" type="button" aria-expanded="${formatOpen}">Question type</button>
        </div>
        ${formatOpen ? renderAnswerTypeGuide(question, "written-answer-guide") : ""}
        <textarea id="writtenAnswer" class="open-answer written-answer-box" placeholder="Write your answer here. Use short sentences or bullet points where useful.">${escapeHtml(typed)}</textarea>

        ${submitted ? renderWrittenMarkScheme(question, awarded) : ""}

        <div class="card-actions primary-actions">
          ${!submitted ? `<button class="primary-button" data-written-action="submit" type="button">Submit answer</button>` : `<button class="primary-button" data-written-action="next" type="button">Next question</button>`}
          <button class="secondary-button" data-written-action="prev" type="button">Previous</button>
          ${submitted ? `<button class="secondary-button" data-written-action="finish" type="button">Finish exam</button>` : ""}
        </div>
      </article>
    `;

    const answerBox = byId("writtenAnswer");
    answerBox?.addEventListener("input", () => {
      state.written.answers[question.id] = answerBox.value;
    });

    $$('[data-written-action]', els.studyPanel).forEach((button) => {
      button.addEventListener("click", () => handleWrittenAction(button.dataset.writtenAction, question));
    });

    $$('[data-written-mark]', els.studyPanel).forEach((button) => {
      button.addEventListener("click", () => {
        state.written.marksAwarded[question.id] = Number(button.dataset.writtenMark);
        renderWrittenCard();
      });
    });
  }

  function renderWrittenMarkScheme(question, awarded) {
    const typed = writtenCurrentAnswer(question).trim();
    const sourceCard = question.sourceCardId ? questions.find((card) => card.id === question.sourceCardId) : null;
    const addedToRevisit = Boolean(state.written?.revisitAdded?.[question.id]);
    const markButtons = Array.from({ length: question.marks + 1 }, (_, mark) => {
      const active = awarded === mark ? " active" : "";
      return `<button class="written-mark-button${active}" data-written-mark="${mark}" type="button">${mark}/${question.marks}</button>`;
    }).join("");
    const lowMark = awarded !== null && awarded < Math.ceil(Number(question.marks || 1) * 0.7);
    return `
      <section class="written-mark-scheme">
        <h3>Mark scheme</h3>
        <div class="written-student-answer">
          <strong>Your answer</strong>
          <p>${typed ? escapeHtml(typed) : "No answer written."}</p>
        </div>
        <div class="written-model-answer">
          <strong>Model answer</strong>
          <p>${escapeHtml(question.modelAnswer)}</p>
        </div>
        <div class="written-checklist">
          <strong>Credit checklist</strong>
          <ul>${(question.markScheme || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
        ${(question.answerStructure || []).length ? `<div class="written-format-review">
          <strong>Answer structure check</strong>
          <ul>${question.answerStructure.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ul>
        </div>` : ""}
        <div class="written-keywords">
          <strong>Key words and actions</strong>
          <p>${(question.keywords || []).map((word) => `<span>${escapeHtml(word)}</span>`).join("")}</p>
        </div>
        <div class="written-common-mistakes">
          <strong>Common mistakes</strong>
          <ul>${(question.commonMistakes || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
        <div class="written-self-mark">
          <strong>Self-mark</strong>
          <p>Select the mark your answer deserves. Use the checklist and choose the mark your answer earns.</p>
          <div class="written-mark-buttons">${markButtons}</div>
          ${lowMark && sourceCard ? `<div class="written-revisit-callout">
            <button class="secondary-button revisit-highlight-button" data-written-action="add-revisit" type="button" ${addedToRevisit ? "disabled" : ""}>${addedToRevisit ? "Added to Revisit" : "Add to Revisit"}</button>
          </div>` : ""}
        </div>
      </section>
    `;
  }

  function handleWrittenAction(action, question) {
    if (action === "toggle-format") {
      state.written.answers[question.id] = byId("writtenAnswer")?.value || "";
      state.written.formatOpen = state.written.formatOpen || {};
      state.written.formatOpen[question.id] = !state.written.formatOpen[question.id];
      renderWrittenCard();
      return;
    }
    if (action === "add-revisit") {
      const sourceCard = question.sourceCardId ? questions.find((card) => card.id === question.sourceCardId) : null;
      if (sourceCard) {
        const mastered = new Set(state.progress.masteredIds || []);
        const revisit = new Set(state.progress.revisitIds || []);
        mastered.delete(sourceCard.id);
        revisit.add(sourceCard.id);
        state.progress.masteredIds = [...mastered];
        state.progress.revisitIds = [...revisit];
        state.written.revisitAdded = state.written.revisitAdded || {};
        state.written.revisitAdded[question.id] = true;
        saveProgress();
      }
      renderWrittenCard();
      return;
    }
    if (action === "submit") {
      state.written.answers[question.id] = byId("writtenAnswer")?.value || "";
      state.written.submitted[question.id] = true;
      renderWrittenCard();
      return;
    }
    if (action === "next") {
      if (state.index >= state.deck.length - 1) finishWrittenExam();
      else {
        state.index += 1;
        renderWrittenCard();
      }
      return;
    }
    if (action === "prev") {
      if (state.index > 0) {
        state.index -= 1;
        renderWrittenCard();
      }
      return;
    }
    if (action === "finish") finishWrittenExam();
  }

  function finishWrittenExam() {
    const total = state.deck.reduce((sum, question) => sum + Number(question.marks || 0), 0);
    const awarded = state.deck.reduce((sum, question) => sum + Number(state.written?.marksAwarded?.[question.id] || 0), 0);
    const isUnitTest = state.mode === "unit-test";
    const byDomain = ["biology", "chemistry", "physics"].map((domain) => {
      const questions = state.deck.filter((question) => question.domain === domain);
      return {
        domain,
        total: questions.reduce((sum, question) => sum + Number(question.marks || 0), 0),
        awarded: questions.reduce((sum, question) => sum + Number(state.written?.marksAwarded?.[question.id] || 0), 0)
      };
    });
    const byObjective = [...new Set(state.deck.map((question) => question.learningObjective).filter(Boolean))].map((objectiveId) => {
      const questions = state.deck.filter((question) => question.learningObjective === objectiveId);
      return {
        objectiveId,
        title: objectiveTitle(objectiveId),
        total: questions.reduce((sum, question) => sum + Number(question.marks || 0), 0),
        awarded: questions.reduce((sum, question) => sum + Number(state.written?.marksAwarded?.[question.id] || 0), 0)
      };
    });
    const sectionKeys = ["A", "B", "C"];
    const bySection = sectionKeys.map((key) => {
      const questions = state.deck.filter((question) => writtenSectionMeta(question).key === key);
      const meta = questions.length ? writtenSectionMeta(questions[0]) : { label: `Section ${key}`, focus: "" };
      return {
        key,
        label: meta.label,
        focus: meta.focus,
        total: questions.reduce((sum, question) => sum + Number(question.marks || 0), 0),
        awarded: questions.reduce((sum, question) => sum + Number(state.written?.marksAwarded?.[question.id] || 0), 0)
      };
    }).filter((item) => item.total > 0);
    const percent = total ? Math.round((awarded / total) * 100) : 0;
    const record = {
      date: new Date().toISOString(),
      mode: isUnitTest ? "unit-test" : "written",
      unit: isUnitTest ? state.written?.unitId || singleDeckUnit() || "" : "",
      totalMarks: state.written?.totalMarks || total,
      awarded,
      total,
      percent,
    };
    state.progress.writtenExamHistory = [...(state.progress.writtenExamHistory || []), record].slice(-20);
    saveProgress();

    els.studyPanel.innerHTML = "";
    els.resultPanel.classList.remove("hidden");
    els.resultPanel.innerHTML = `
      <h2>${isUnitTest ? "End of unit test complete" : "Written exam complete"}</h2>
      <p>You self-marked <strong>${awarded}/${total}</strong> (${percent}%).</p>
      ${isUnitTest ? `<h3>Sub-units practised</h3>
      <div class="written-domain-summary written-objective-summary">
        ${byObjective.map((item) => `<div><strong>${escapeHtml(item.title)}</strong><span>${item.awarded}/${item.total}</span></div>`).join("")}
      </div>` : `<h3>Science balance</h3>
      <div class="written-domain-summary">
        ${byDomain.map((item) => `<div><strong>${escapeHtml(domainLabel(item.domain))}</strong><span>${item.awarded}/${item.total}</span></div>`).join("")}
      </div>`}
      <h3>Answer-type balance</h3>
      <div class="written-domain-summary written-section-summary">
        ${bySection.map((item) => `<div><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.focus)} · ${item.awarded}/${item.total}</span></div>`).join("")}
      </div>
      <p>Use the score summary to choose what to practise next.</p>
      <div class="card-actions">
        <button class="primary-button" data-result-action="written-again" type="button">${isUnitTest ? "Build another end of unit test" : "Build another written exam"}</button>
        
        <button class="secondary-button" data-result-action="hub" type="button">Back to revision hub</button>
      </div>
    `;
    $('[data-result-action="hub"]', els.resultPanel)?.addEventListener("click", showHub);
    $('[data-result-action="written-again"]', els.resultPanel)?.addEventListener("click", () => startSession(isUnitTest ? "unit-test" : "written", { totalMarks: state.progress.writtenExamMarks || 30 }));
    $('[data-result-action="revisit-test"]', els.resultPanel)?.addEventListener("click", () => startSession("revisit-test"));
  }

  function renderCard() {
    if (isWrittenMode()) {
      renderWrittenCard();
      return;
    }
    const card = state.deck[state.index];
    const isMcq = cardIsMcq(card);
    const isDefinition = cardIsDefinition(card);
    const membership = setMembership(card.id);
    const testMode = isTestMode();
    const reviewCandidate = questionReviewItem(card, testMode ? "Test your knowledge" : "Revision journey");
    const reviewQuestionAdded = reviewItemExists(reviewCandidate.id, "questions");
    updateSessionChrome({
      card,
      title: "Reaction",
      eyebrow: modeText[state.mode]?.eyebrow || "Focused session",
      subtitle: `${unitTitle(card.unit)} · ${modeLabel(state.mode)}`
    });
    els.sessionIndex.textContent = String(state.index + 1);
    els.sessionTotal.textContent = `/ ${state.deck.length}`;
    els.resultPanel.classList.add("hidden");

    els.studyPanel.innerHTML = `
      <article class="study-card">
        <div class="card-topline card-topline-clean">
          <div class="card-title-row">
            ${questionIdentifier(card) ? `<span class="pill question-id-pill">${escapeHtml(questionIdentifier(card))}</span>` : ""}
            ${card.learningObjective ? `<span class="pill objective-pill">${escapeHtml(objectiveTitle(card.learningObjective))}</span>` : ""}
            <span class="pill">Level ${card.level}</span>
            ${(!isMcq && membership.mastered) ? `<span class="pill good">secure</span>` : ""}
            ${(!isMcq && membership.revisit) ? `<span class="pill warn">revisit</span>` : ""}
            ${(!isMcq && membership.study) ? `<span class="pill study">notes</span>` : ""}
          </div>
        </div>

        ${renderStudyPrompt(card)}
        <p class="question-text">${escapeHtml(card.question)}</p>
        ${renderMedia(card)}
        ${(!testMode && card.cue) ? `<p class="explanation"><strong>Cue:</strong> ${escapeHtml(card.cue)}</p>` : ""}
        ${isMcq ? renderChoices(card, testMode) : isDefinition && !testMode ? renderDefinitionResponse(card) : renderOpenResponse(testMode, card)}
        ${!testMode && state.revealed ? renderReveal(card) : ""}
        ${!testMode && isMcq && state.selectedChoice ? renderChoiceFeedback(card) : ""}

        <div class="card-actions primary-actions">
          ${testMode ? `
            <button class="primary-button" data-action="${state.index >= state.deck.length - 1 ? "test-submit" : "next"}" type="button">${state.index >= state.deck.length - 1 ? "Submit test" : "Save and next"}</button>
            <button class="secondary-button" data-action="prev" type="button">Previous</button>
            <button class="secondary-button" data-action="test-submit" type="button">Submit test</button>
            <button class="secondary-button review-sheet-card-button" data-action="add-review-question" type="button" ${reviewQuestionAdded ? "disabled" : ""}>${reviewQuestionAdded ? "On review sheet" : "Last-minute review"}</button>
          ` : `
            ${!state.revealed && !isDefinition && !state.selectedChoice ? `<button class="primary-button" data-action="reveal" type="button">Reveal answer</button>` : ""}
            ${isDefinition && !state.definitionCompared ? `<button class="primary-button" data-action="compare-definition" type="button">Compare notes</button>` : ""}
            ${isMcq && (state.selectedChoice || state.revealed) ? `<button class="primary-button" data-action="next" type="button">Next card</button>` : ""}
            <button class="secondary-button" data-action="prev" type="button">Previous</button>
            ${!(isMcq && (state.selectedChoice || state.revealed)) ? `<button class="secondary-button" data-action="next" type="button">Skip</button>` : ""}
            <button class="secondary-button class-notes-button" data-action="study-context" type="button">Class Notes</button>
            <button class="secondary-button review-sheet-card-button" data-action="add-review-question" type="button" ${reviewQuestionAdded ? "disabled" : ""}>${reviewQuestionAdded ? "On review sheet" : "Last-minute review"}</button>
          `}
        </div>

        ${!testMode && !isMcq && (!isDefinition || state.definitionCompared) ? `
          <div class="state-actions" aria-label="Learning state">
            <button class="primary-button" data-state="mastered" type="button">Good match · Secure</button>
            <button class="secondary-button" data-state="revisit" type="button">Nearly there · Revisit</button>
          </div>
        ` : ""}
      </article>
    `;

    bindCardActions(card);
  }

  function renderChoiceFeedback(card) {
    const correctChoice = correctDisplayChoice(card);
    const correct = state.selectedChoice === correctChoice.key;
    const membership = setMembership(card.id);
    const heldForRevisit = correct && membership.revisit && !membership.mastered && state.mode !== "revisit";
    const headline = correct
      ? "Correct."
      : "Not quite — moved to Revisit.";
    return `
      <div class="choice-feedback ${correct && !heldForRevisit ? "good" : "needs-review"}">
        <strong>${headline}</strong>
        <p>The answer is <strong>${escapeHtml(correctChoice.key)} — ${escapeHtml(correctChoice.text)}</strong>.</p>
        ${card.explanation ? `<p>${escapeHtml(card.explanation)}</p>` : ""}
      </div>
    `;
  }

  function renderChoices(card, testMode) {
    const displayChoices = getDisplayChoices(card);
    const correctKey = correctDisplayChoice(card).key;
    const savedAnswer = testMode ? testAnswerFor(card)?.answer : "";
    return `<div class="answer-grid" role="group" aria-label="Answer choices">
      ${displayChoices.map((choice) => {
        const key = choice.key;
        let cls = "answer-button";
        if (testMode) {
          if (savedAnswer === key) cls += " selected";
        } else if (state.selectedChoice) {
          if (key === correctKey) cls += " correct";
          else if (key === state.selectedChoice) cls += " wrong";
          else cls += " neutral";
        }
        const label = testMode ? "Choose answer" : "Answer choice";
        return `<button class="${cls}" data-choice="${escapeHtml(key)}" type="button" aria-label="${label}: ${escapeHtml(choice.label)}">${escapeHtml(choice.label)}</button>`;
      }).join("")}
    </div>`;
  }

  function renderDefinitionResponse(card) {
    const review = state.definitionReview;
    const typed = state.definitionInput || "";
    const note = noteForCard(card);
    return `
      <div class="definition-response">
        <label for="definitionAnswer"><strong>Write your definition in your own words.</strong></label>
        <textarea id="definitionAnswer" class="open-answer definition-answer" placeholder="Type your answer, then compare notes.">${escapeHtml(typed)}</textarea>
        ${state.definitionCompared && review ? `
          <div class="compare-notes-panel ${escapeHtml(review.tone)}">
            <div class="compare-notes-header">
              <strong>${escapeHtml(review.label)}</strong>
              <span>${Math.round(review.ratio * 100)}% keyword match</span>
            </div>
            <p>${escapeHtml(review.guidance)}</p>
            <div class="definition-comparison-grid">
              <div>
                <h4>Your answer</h4>
                <p>${escapeHtml(typed || "No answer typed yet.")}</p>
              </div>
              <div>
                <h4>Expected definition</h4>
                <p>${escapeHtml(card.answer || card.explanation || "Check the class notes for this term.")}</p>
              </div>
            </div>
            <div class="keyword-row">
              <span>Key words:</span>
              ${review.keywords.map((word) => `<em class="${review.matched.includes(word) ? "matched" : "missing"}">${escapeHtml(word)}</em>`).join("")}
            </div>
            ${note ? `<button class="secondary-button class-notes-button" data-action="study-context" type="button">Open Class Notes</button>` : ""}
          </div>
        ` : `
          <p class="definition-hint">Your wording does not need to be identical. The comparison checks for key ideas, then you choose what to do next.</p>
        `}
      </div>
    `;
  }

  function renderOpenResponse(testMode, card = null) {
    const savedAnswer = testMode && card ? testAnswerFor(card)?.answer || "" : "";
    const placeholder = testMode
      ? "Type your answer. Answers and explanations unlock after you submit the test."
      : "Type a rough answer here, then reveal the mark-scheme answer.";
    const id = testMode ? "testOpenAnswer" : "";
    if (!testMode || !card) {
      return `<textarea ${id ? `id="${id}"` : ""} class="open-answer" placeholder="${escapeHtml(placeholder)}">${escapeHtml(savedAnswer)}</textarea>`;
    }
    const typeOpen = Boolean(state.test?.typeOpen?.[card.id]);
    return `
      <div class="written-answer-label-row test-answer-label-row">
        <label for="testOpenAnswer" class="written-answer-label">Your written answer</label>
        <button class="answer-format-button" data-action="toggle-question-type" type="button" aria-expanded="${typeOpen}">Question type</button>
      </div>
      ${typeOpen ? renderAnswerTypeGuide(card, "written-answer-guide test-question-type-guide") : ""}
      <textarea id="testOpenAnswer" class="open-answer" placeholder="${escapeHtml(placeholder)}">${escapeHtml(savedAnswer)}</textarea>
    `;
  }

  function renderReveal(card) {
    const correctChoice = cardIsMcq(card) ? correctDisplayChoice(card) : null;
    const answerLine = cardIsMcq(card) ? `${correctChoice.key} — ${correctChoice.text}` : card.answer;
    return `
      <div class="reveal-box">
        <strong>Answer</strong>
        <div>${escapeHtml(answerLine)}</div>
        ${card.explanation ? `<div class="explanation">${escapeHtml(card.explanation)}</div>` : ""}
      </div>
    `;
  }

  function bindCardActions(card) {
    $$("[data-choice]", els.studyPanel).forEach((button) => {
      button.addEventListener("click", () => {
        if (isTestMode()) {
          recordTestAnswer(card, button.dataset.choice);
          if (state.index >= state.deck.length - 1) renderCard();
          else nextCard();
          return;
        }
        if (state.selectedChoice) return;
        state.selectedChoice = button.dataset.choice;
        state.revealed = true;
        const correct = state.selectedChoice === correctDisplayChoice(card).key;
        setCardStatus(card, correct ? "mastered" : "revisit", { advance: false, countAttempt: true });
      });
    });

    $$("[data-state]", els.studyPanel).forEach((button) => {
      button.addEventListener("click", () => setCardStatus(card, button.dataset.state));
    });

    const definitionAnswer = byId("definitionAnswer");
    if (definitionAnswer) {
      definitionAnswer.addEventListener("input", () => {
        state.definitionInput = definitionAnswer.value;
      });
    }

    $$("[data-action]", els.studyPanel).forEach((button) => {
      button.addEventListener("click", () => handleAction(button.dataset.action, card));
    });
  }

  function handleAction(action, card) {
    if (action === "add-review-question") {
      if (isTestMode()) saveOpenTestAnswer(card);
      addQuestionToReview(card, isTestMode() ? "Test your knowledge" : "Revision journey", { includeAnswer: !isTestMode() });
      renderCard();
      return;
    }
    if (isTestMode() && action === "toggle-question-type") {
      saveOpenTestAnswer(card);
      state.test.typeOpen = state.test.typeOpen || {};
      state.test.typeOpen[card.id] = !state.test.typeOpen[card.id];
      renderCard();
      return;
    }
    if (isTestMode() && ["next", "prev", "test-submit"].includes(action)) {
      saveOpenTestAnswer(card);
      if (action === "test-submit") finishTest();
      else if (action === "next") nextCard();
      else prevCard();
      return;
    }
    if (action === "compare-definition") {
      const typed = byId("definitionAnswer")?.value || state.definitionInput || "";
      state.definitionInput = typed;
      state.definitionReview = definitionReview(card, typed);
      state.definitionCompared = true;
      state.revealed = false;
      renderCard();
      return;
    }
    if (action === "reveal") {
      state.revealed = true;
      if (!isTestMode()) setCardStatus(card, "revisit", { advance: false, countAttempt: true });
      else renderCard();
      return;
    }
    if (action === "test-open-submit") {
      state.revealed = true;
      renderCard();
      return;
    }
    if (action === "test-right") {
      recordTestAnswer(card, true, "open");
      nextCard();
      return;
    }
    if (action === "test-wrong") {
      recordTestAnswer(card, false, "open");
      nextCard();
      return;
    }
    if (action === "study-context") {
      const note = noteForCard(card);
      if (note) openNoteContext(note.id, card.id);
      else setCardStatus(card, "study");
      return;
    }
    if (action === "next") nextCard();
    if (action === "prev") prevCard();
    if (action === "read") speak(`${card.question}. ${state.revealed ? card.answer : ""}`);
  }

  function nextCard() {
    if (!state.deck.length) return;
    if (state.index >= state.deck.length - 1) {
      if (isTestMode()) finishTest();
      else finishSession();
      return;
    } else {
      state.index += 1;
    }
    resetCardInteraction();
    saveSessionPosition();
    renderSession();
  }

  function prevCard() {
    if (!state.deck.length) return;
    state.index = (state.index - 1 + state.deck.length) % state.deck.length;
    resetCardInteraction();
    saveSessionPosition();
    renderSession();
  }

  function finishSession() {
    const counts = sessionStatusCounts();
    const total = state.deck.length;
    els.studyPanel.innerHTML = "";
    els.resultPanel.classList.remove("hidden");
    updateSessionChrome({
      unitId: singleDeckUnit(),
      title: "Reaction",
      eyebrow: "Session complete",
      subtitle: "Revision session complete · Use the summary to choose what to practise next."
    });
    els.sessionIndex.textContent = String(counts.reviewed);
    els.sessionTotal.textContent = `/ ${total}`;
    els.resultPanel.innerHTML = `
      <h2>Session complete</h2>
      <p>You reviewed <strong>${counts.reviewed}/${total}</strong> card${total === 1 ? "" : "s"}.</p>
      <div class="session-summary-grid">
        <div><strong>${counts.mastered}</strong><span>secure</span></div>
        <div><strong>${counts.revisit}</strong><span>revisit</span></div>
        <div><strong>${counts.study}</strong><span>notes</span></div>
      </div>
      <p>${counts.revisit ? `Next: review your ${counts.revisit} Revisit card${counts.revisit === 1 ? "" : "s"}.` : counts.study ? `Next: open Class Notes for ${counts.study} card${counts.study === 1 ? "" : "s"}.` : "Next: test your knowledge when you feel ready."}</p>
      <div class="card-actions">
        ${counts.revisit ? `<button class="primary-button" data-result-action="revisit" type="button">Review Revisit questions</button>` : ""}
        ${counts.mastered ? `<button class="secondary-button" data-result-action="test" type="button">Test your knowledge</button>` : ""}
        <button class="secondary-button" data-result-action="hub" type="button">Back to revision hub</button>
      </div>
    `;
    $("[data-result-action='hub']", els.resultPanel)?.addEventListener("click", showHub);
    $("[data-result-action='revisit']", els.resultPanel)?.addEventListener("click", () => startSession("revisit"));
    $("[data-result-action='test']", els.resultPanel)?.addEventListener("click", () => startSession("test"));
  }

  function testAnswerFor(card) {
    if (!card || !state.test?.answers) return null;
    return state.test.answers[card.id] || null;
  }

  function saveOpenTestAnswer(card) {
    if (!isTestMode() || cardIsMcq(card)) return;
    recordTestAnswer(card, byId("testOpenAnswer")?.value || "");
  }

  function testAnswerCount() {
    return Object.keys(state.test?.answers || {}).length;
  }

  function testAutoScore() {
    const answers = Object.values(state.test?.answers || {});
    const autoMarked = answers.filter((item) => typeof item.correct === "boolean");
    return {
      score: autoMarked.filter((item) => item.correct).length,
      total: autoMarked.length,
      percent: autoMarked.length ? Math.round((autoMarked.filter((item) => item.correct).length / autoMarked.length) * 100) : 0,
    };
  }

  function renderTestAnswerReview(card) {
    const saved = testAnswerFor(card) || { answer: "", correct: null };
    const note = noteForCard(card);
    const isMcq = cardIsMcq(card);
    const correctChoice = isMcq ? correctDisplayChoice(card) : null;
    const expected = isMcq ? `${correctChoice.key} — ${correctChoice.text}` : card.answer;
    const answerText = saved.answer ? saved.answer : "No answer entered.";
    const status = typeof saved.correct === "boolean" ? (saved.correct ? "Correct" : "Needs review") : "Self-mark";
    return `
      <article class="test-review-card ${saved.correct === false ? "needs-review" : saved.correct === true ? "good" : ""}">
        <div class="written-question-meta">
          ${questionIdentifier(card) ? `<span class="pill question-id-pill">${escapeHtml(questionIdentifier(card))}</span>` : ""}
          ${card.learningObjective ? `<span class="pill objective-pill">${escapeHtml(objectiveTitle(card.learningObjective))}</span>` : ""}
          <span class="pill">${escapeHtml(status)}</span>
        </div>
        <h3>${escapeHtml(card.question)}</h3>
        <div class="written-student-answer"><strong>Your answer</strong><p>${escapeHtml(answerText)}</p></div>
        <details class="written-mark-scheme" open>
          <summary><strong>Answer, explanation and class notes</strong></summary>
          <div class="written-model-answer"><strong>Expected answer</strong><p>${escapeHtml(expected || "Check the class notes for the expected answer.")}</p></div>
          ${card.explanation ? `<div class="written-format-review"><strong>Why it is correct</strong><p>${escapeHtml(card.explanation)}</p></div>` : ""}
          <div class="written-common-mistakes"><strong>Common mistakes</strong><ul><li>Choosing a keyword without linking it to the question.</li><li>Writing a vague answer when a specific science term is needed.</li></ul></div>
          <div class="test-review-actions">
            ${note ? `<button class="secondary-button class-notes-button" data-result-note="${escapeHtml(note.id)}" type="button">Class Notes: ${escapeHtml(note.title)}</button>` : ""}
            <button class="secondary-button review-sheet-card-button" data-result-review-question="${escapeHtml(card.id)}" type="button">Last-minute review</button>
          </div>
        </details>
      </article>
    `;
  }

  function recordTestAnswer(card, answer) {
    if (!state.test || !card) return;
    const cleanAnswer = String(answer ?? "").trim();
    const isMcq = cardIsMcq(card);
    const correct = isMcq ? cleanAnswer === correctDisplayChoice(card).key : null;
    state.test.answers = state.test.answers && typeof state.test.answers === "object" && !Array.isArray(state.test.answers)
      ? state.test.answers
      : {};
    if (!isMcq && !cleanAnswer) {
      delete state.test.answers[card.id];
      return;
    }
    state.test.answers[card.id] = { cardId: card.id, answer: cleanAnswer, correct };
  }

  function applySubmittedTestProgress() {
    const answers = state.test?.answers || {};
    const revisit = new Set(state.progress.revisitIds || []);
    const mastered = new Set(state.progress.masteredIds || []);
    Object.values(answers).forEach((item) => {
      if (typeof item.correct !== "boolean") return;
      const card = questions.find((candidate) => candidate.id === item.cardId);
      if (!card) return;
      recordSeen(card, item.correct);
      if (item.correct) {
        revisit.delete(card.id);
        mastered.add(card.id);
        state.progress.xp = (state.progress.xp || 0) + Math.max(5, (card.level || 1) * 5);
        state.progress.streak = (state.progress.streak || 0) + 1;
        state.progress.bestStreak = Math.max(state.progress.bestStreak || 0, state.progress.streak || 0);
      } else {
        mastered.delete(card.id);
        revisit.add(card.id);
        state.progress.streak = 0;
      }
    });
    state.progress.masteredIds = [...mastered];
    state.progress.revisitIds = [...revisit];
  }

  function finishTest() {
    if (state.test?.submitted) return;
    saveOpenTestAnswer(state.deck[state.index]);
    state.test.submitted = true;
    const total = state.deck.length;
    const answered = testAnswerCount();
    const auto = testAutoScore();
    applySubmittedTestProgress();
    const record = {
      date: new Date().toISOString(),
      selection: sessionPositionKey("test"),
      score: auto.score,
      total: auto.total,
      percent: auto.percent,
      answered,
      questionCount: total,
    };
    state.progress.testHistory = [...(state.progress.testHistory || []), record].slice(-20);
    saveProgress();

    els.studyPanel.innerHTML = "";
    els.resultPanel.classList.remove("hidden");
    updateSessionChrome({
      unitId: singleDeckUnit(),
      title: "Reaction",
      eyebrow: "Test submitted",
      subtitle: "Answers, explanations and class-note links are now unlocked."
    });
    els.sessionIndex.textContent = String(answered);
    els.sessionTotal.textContent = `/ ${total}`;
    const canRunAgain = questionsForMode("test").length > 0;
    const scoreLine = auto.total
      ? `Auto-marked score: <strong>${auto.score}/${auto.total}</strong> multiple-choice question${auto.total === 1 ? "" : "s"} (${auto.percent}%).`
      : "No multiple-choice questions were auto-marked. Use the answer review below to self-mark your written answers.";
    els.resultPanel.innerHTML = `
      <h2>Test your knowledge submitted</h2>
      <p>${scoreLine}</p>
      <p>You answered <strong>${answered}/${total}</strong> question${total === 1 ? "" : "s"}. Written answers are shown with the expected answer, explanation, common mistakes and class-note links.</p>
      <div class="test-review-list">
        ${state.deck.map(renderTestAnswerReview).join("")}
      </div>
      <div class="card-actions">
        <button class="primary-button" data-result-action="hub" type="button">Back to revision hub</button>
        ${canRunAgain ? `<button class="secondary-button" data-result-action="again" type="button">Build another test</button>` : ""}
      </div>
    `;
    $('[data-result-action="hub"]', els.resultPanel)?.addEventListener("click", showHub);
    $('[data-result-action="again"]', els.resultPanel)?.addEventListener("click", () => startSession("test"));
    $$('[data-result-note]', els.resultPanel).forEach((button) => {
      button.addEventListener("click", () => openNoteContext(button.dataset.resultNote));
    });
    $$('[data-result-review-question]', els.resultPanel).forEach((button) => {
      button.addEventListener("click", () => {
        const card = questions.find((candidate) => candidate.id === button.dataset.resultReviewQuestion);
        if (!card) return;
        const added = addQuestionToReview(card, "Test your knowledge review");
        button.textContent = added ? "Added to review sheet" : "On review sheet";
        button.disabled = true;
      });
    });
  }

  function speak(text) {
    if (!state.sound || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text || ""));
    utterance.rate = 0.96;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  function beep(ok) {
    if (!state.sound || !window.AudioContext) return;
    try {
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = ok ? 740 : 240;
      gain.gain.value = 0.035;
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.12);
    } catch (error) {
      // Sound is optional.
    }
  }

  function celebrate() {
    const canvas = els.canvas;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const ratio = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(ratio, ratio);

    const particles = Array.from({ length: 38 }, () => ({
      x: width / 2,
      y: Math.min(height * 0.34, 280),
      vx: (Math.random() - 0.5) * 9,
      vy: Math.random() * -7 - 2,
      size: Math.random() * 5 + 3,
      life: 42,
    }));

    let frame = 0;
    const colors = ["#6d28d9", "#0891b2", "#ec4899", "#16a34a", "#f59e0b"];
    function draw() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22;
        p.life -= 1;
        ctx.globalAlpha = Math.max(0, p.life / 42);
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      frame += 1;
      if (frame < 46) requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, width, height);
    }
    draw();
  }

  function exportProgress() {
    const blob = new Blob([JSON.stringify(state.progress, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reaction-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importProgress(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        state.progress = normalizeProgress(JSON.parse(String(reader.result || "{}")));
        state.sound = state.progress.sound !== false;
        saveProgress();
        renderStats();
        renderDashboard();
        alert("Progress imported.");
      } catch (error) {
        alert("Could not import this progress file.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function bindGlobalActions() {
    $$('[data-mode-select]').forEach((button) => {
      button.addEventListener('click', () => {
        state.selectedMode = button.dataset.modeSelect || 'practice';
        renderStats();
      });
    });

    els.routeEntryButton?.addEventListener('click', () => {
      if ((state.selectedMode || 'practice') === 'exam') startSession('exam');
      else if ((state.selectedMode || 'practice') === 'written') startSession('written', { totalMarks: state.progress.writtenExamMarks || 30 });
      else if ((state.selectedMode || 'practice') === 'unit-test') startSession('unit-test', { totalMarks: state.progress.writtenExamMarks || 30 });
      else startSession(state.selectedMode || 'practice');
    });


    els.answerFormatHelpButton?.addEventListener('click', openAnswerFormatHelp);
    els.reviewSheetButton?.addEventListener('click', openReviewSheet);
    els.answerFormatModal?.addEventListener('click', (event) => {
      if (event.target === els.answerFormatModal || event.target.closest('[data-answer-help-close]')) closeAnswerFormatHelp();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && els.answerFormatModal && !els.answerFormatModal.classList.contains('hidden')) closeAnswerFormatHelp();
    });

    $$('[data-written-size]').forEach((button) => {
      button.addEventListener('click', () => {
        const marks = Number(button.dataset.writtenSize || 30);
        state.progress.writtenExamMarks = marks;
        saveProgress();
        if (state.selectedMode === 'unit-test') {
          if (!unitTestWrittenBank().length) {
            renderStats();
            return;
          }
          startSession('unit-test', { totalMarks: marks });
        } else {
          state.selectedMode = 'written';
          startSession('written', { totalMarks: marks });
        }
      });
    });

    els.backToHub.addEventListener("click", showHub);
    els.homeLink.addEventListener("click", (event) => {
      event.preventDefault();
      showHub();
    });

    els.soundToggle.addEventListener("click", () => {
      state.sound = !state.sound;
      saveProgress();
    });

    els.exportProgress.addEventListener("click", exportProgress);
    els.importProgressFile.addEventListener("change", importProgress);
  }

  function initDeepLink() {
    const hash = String(window.location.hash || "").replace(/^#/, "");
    const match = hash.match(/^note=([^&]+)/);
    if (!match) return;
    const noteId = decodeURIComponent(match[1]);
    if (!noteMeta(noteId)) return;
    setTimeout(() => openNoteContext(noteId), 0);
  }

  function init() {
    state.sound = state.progress.sound !== false;
    initFilters();
    bindGlobalActions();
    renderStats();
    renderDashboard();
    renderNotesDashboard();
    initDeepLink();
  }

  init();
})();
