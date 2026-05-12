
(() => {
  const content = window.YEAR9_CONTENT || { units: [], cards: [] };
  const cards = Array.isArray(content.cards) ? content.cards : [];
  const units = Array.isArray(content.units) ? content.units : [];
  const learningObjectives = Array.isArray(content.learningObjectives) ? content.learningObjectives : [];
  const notesBundle = window.YEAR9_NOTES || { notes: [] };
  const classNotes = Array.isArray(notesBundle.notes) ? notesBundle.notes : [];
  const unitOverviews = Array.isArray(notesBundle.unitOverviews) ? notesBundle.unitOverviews : [];
  const STORAGE_KEY = "reaction-y9-progress-v2";
  const LEGACY_STORAGE_KEY = "year9-science-study-progress-v1";

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
  };

  const modeText = {
    practice: {
      eyebrow: "Revision journey",
      title: "Work through your revision cards",
      subtitle: "Answer each card. Correct answers move to Mastered; revealed or missed answers move to Revisit.",
      empty: "No cards match these filters.",
    },
    revisit: {
      eyebrow: "Revisit queue",
      title: "Revisit cards",
      subtitle: "These are the cards you nearly know. Move them to Mastered when they feel secure.",
      empty: "No Revisit cards match these filters yet.",
    },
    study: {
      eyebrow: "Need notes queue",
      title: "Cards that need notes",
      subtitle: "These are cards marked Still confused after using a class-note context card.",
      empty: "No Need Notes cards match these filters yet. Open Class Notes from a card, then choose Still confused to add one here.",
    },
    written: {
      eyebrow: "Written exam practice",
      title: "End-of-year written exam builder",
      subtitle: "Practise state, identify, describe and explain answers with balanced Biology, Chemistry and Physics marks.",
      empty: "No written exam questions are available for this selection.",
    },
    test: {
      eyebrow: "Focused check",
      title: "Test your knowledge",
      subtitle: "This checks only cards you have already marked Mastered. Answers are scored as you go.",
      empty: "No Mastered cards match these filters yet. Mark some cards as Mastered first.",
    },
  };

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
  };


  const WRITTEN_EXAM_BANK = [
    {
      id: "we-bio-state-photosynthesis-equation",
      domain: "biology",
      unit: "9B",
      commandWord: "state",
      marks: 1,
      question: "State the word equation for photosynthesis.",
      answerFrame: "Write one short sentence or equation only.",
      modelAnswer: "carbon dioxide + water → glucose + oxygen",
      markScheme: ["1 mark for carbon dioxide + water → glucose + oxygen."],
      keywords: ["carbon dioxide", "water", "glucose", "oxygen"],
      commonMistakes: ["Do not write respiration instead of photosynthesis.", "Do not miss out glucose."],
      answerStructure: ["State the exact equation.", "No explanation is needed."]
    },
    {
      id: "we-bio-identify-root-hair-adaptation",
      domain: "biology",
      unit: "9B",
      commandWord: "identify",
      marks: 2,
      question: "Identify two adaptations of root hair cells for absorbing water and mineral ions.",
      answerFrame: "Use two bullet points.",
      modelAnswer: "Root hair cells have a large surface area and a thin cell wall.",
      markScheme: ["1 mark for large surface area.", "1 mark for thin cell wall / short diffusion distance."],
      keywords: ["large surface area", "thin cell wall", "short diffusion distance"],
      commonMistakes: ["Do not explain photosynthesis here.", "Do not give adaptations of leaves instead of roots."],
      answerStructure: ["Bullet point 1: first adaptation.", "Bullet point 2: second adaptation."]
    },
    {
      id: "we-bio-describe-food-web-pesticide",
      domain: "biology",
      unit: "9B",
      commandWord: "describe",
      marks: 3,
      question: "Describe what may happen in a food web if pesticides reduce the number of insects.",
      answerFrame: "Write 2–3 short linked sentences. Describe what changes.",
      modelAnswer: "The number of insects decreases. Animals that eat insects have less food, so their population may decrease. Predators higher in the food web may also be affected.",
      markScheme: ["1 mark for insects decreasing.", "1 mark for insect-eaters having less food / decreasing.", "1 mark for knock-on effect on predators higher in the food web."],
      keywords: ["insects decrease", "less food", "population decreases", "predators"],
      commonMistakes: ["Do not only say pesticides are bad.", "Use food-web language: food, population, predator, prey."],
      answerStructure: ["Sentence 1: what changes first.", "Sentence 2: what happens to the organism that feeds on it.", "Sentence 3: wider food-web effect."]
    },
    {
      id: "we-bio-explain-magnesium",
      domain: "biology",
      unit: "9B",
      commandWord: "explain",
      marks: 3,
      question: "Explain why plants need magnesium ions.",
      answerFrame: "Use because / so / therefore.",
      modelAnswer: "Plants need magnesium ions to make chlorophyll. Chlorophyll absorbs light for photosynthesis. Without enough magnesium, the plant cannot photosynthesise as well, so growth is reduced.",
      markScheme: ["1 mark for magnesium being needed to make chlorophyll.", "1 mark for chlorophyll absorbing light / being needed for photosynthesis.", "1 mark for reduced photosynthesis or growth if magnesium is lacking."],
      keywords: ["magnesium ions", "chlorophyll", "light", "photosynthesis", "growth"],
      commonMistakes: ["Do not say magnesium is the food.", "Link magnesium to chlorophyll, not directly to glucose."],
      answerStructure: ["Science fact.", "Because link.", "Result linked back to the plant."]
    },
    {
      id: "we-bio-describe-natural-selection",
      domain: "biology",
      unit: "9A",
      commandWord: "describe",
      marks: 4,
      question: "Describe how natural selection can lead to evolution.",
      answerFrame: "Use short steps in order.",
      modelAnswer: "There is variation in a population. Some organisms have characteristics that make them better adapted to the environment. They are more likely to survive and reproduce. Their useful alleles are passed on, so the population changes over generations.",
      markScheme: ["1 mark for variation.", "1 mark for better adapted individuals being more likely to survive.", "1 mark for reproduction / passing on alleles.", "1 mark for change over generations."],
      keywords: ["variation", "adapted", "survive", "reproduce", "alleles", "generations"],
      commonMistakes: ["Do not say individuals choose to evolve.", "Evolution happens over generations, not during one animal's life."],
      answerStructure: ["Variation.", "Selection pressure.", "Survival and reproduction.", "Inheritance over generations."]
    },
    {
      id: "we-bio-explain-farming-sustainability",
      domain: "biology",
      unit: "9B",
      commandWord: "explain",
      marks: 2,
      question: "Explain one problem caused by using fertilisers to increase crop yield.",
      answerFrame: "One cause + one effect.",
      modelAnswer: "Fertilisers can run off fields into rivers. This can cause rapid growth of algae and reduce oxygen for aquatic animals.",
      markScheme: ["1 mark for fertiliser runoff / entering water.", "1 mark for algal growth / reduced oxygen / harm to aquatic animals."],
      keywords: ["fertiliser", "runoff", "algae", "oxygen", "aquatic animals"],
      commonMistakes: ["Do not describe pesticides instead.", "Include a problem, not only the benefit of bigger yield."],
      answerStructure: ["Cause.", "Effect."]
    },

    {
      id: "we-chem-state-neutralisation",
      domain: "chemistry",
      unit: "9F",
      commandWord: "state",
      marks: 1,
      question: "State the products of neutralisation.",
      answerFrame: "Write the products only.",
      modelAnswer: "A salt and water.",
      markScheme: ["1 mark for salt and water."],
      keywords: ["salt", "water"],
      commonMistakes: ["Do not write carbon dioxide unless the reaction involves a carbonate."],
      answerStructure: ["State the two products."]
    },
    {
      id: "we-chem-identify-state-symbols",
      domain: "chemistry",
      unit: "9E",
      commandWord: "identify",
      marks: 2,
      question: "Identify the meaning of the state symbols (s) and (aq).",
      answerFrame: "Use two bullet points.",
      modelAnswer: "(s) means solid. (aq) means aqueous, dissolved in water.",
      markScheme: ["1 mark for (s) = solid.", "1 mark for (aq) = aqueous / dissolved in water."],
      keywords: ["solid", "aqueous", "dissolved in water"],
      commonMistakes: ["Aqueous does not mean liquid; it means dissolved in water."],
      answerStructure: ["Bullet 1: (s).", "Bullet 2: (aq)."]
    },
    {
      id: "we-chem-describe-displacement",
      domain: "chemistry",
      unit: "9F",
      commandWord: "describe",
      marks: 3,
      question: "Describe what happens when a more reactive metal is placed in a solution containing a less reactive metal compound.",
      answerFrame: "Say what changes places and what is seen.",
      modelAnswer: "The more reactive metal displaces the less reactive metal from its compound. The more reactive metal goes into solution. The less reactive metal is formed as a solid deposit.",
      markScheme: ["1 mark for the more reactive metal displacing the less reactive metal.", "1 mark for the more reactive metal going into solution / forming a compound.", "1 mark for the less reactive metal being deposited / formed."],
      keywords: ["more reactive", "displaces", "less reactive", "solution", "deposit"],
      commonMistakes: ["Do not say the less reactive metal displaces the more reactive metal.", "Use the word displaces."],
      answerStructure: ["What displaces what.", "What happens to the more reactive metal.", "What is observed."]
    },
    {
      id: "we-chem-explain-aluminium-electrolysis",
      domain: "chemistry",
      unit: "9F",
      commandWord: "explain",
      marks: 3,
      question: "Explain why aluminium is extracted by electrolysis rather than by heating aluminium oxide with carbon.",
      answerFrame: "Use the reactivity series and because / so.",
      modelAnswer: "Aluminium is more reactive than carbon. Carbon cannot reduce aluminium oxide. Therefore aluminium must be extracted by electrolysis.",
      markScheme: ["1 mark for aluminium being more reactive than carbon.", "1 mark for carbon not being able to reduce aluminium oxide / displace aluminium.", "1 mark for electrolysis being required."],
      keywords: ["aluminium", "more reactive than carbon", "carbon", "reduce", "electrolysis"],
      commonMistakes: ["Do not say aluminium is less reactive than carbon.", "Do not say carbon reduction works for all metals."],
      answerStructure: ["Reactivity fact.", "Because link.", "Therefore extraction method."]
    },
    {
      id: "we-chem-explain-thermite-redox",
      domain: "chemistry",
      unit: "9F",
      commandWord: "explain",
      marks: 4,
      question: "In the thermite reaction, aluminium reacts with iron oxide to make aluminium oxide and iron. Explain why this is a redox reaction.",
      answerFrame: "Mention oxidation and reduction.",
      modelAnswer: "Aluminium gains oxygen to form aluminium oxide, so aluminium is oxidised. Iron oxide loses oxygen to form iron, so iron oxide is reduced. Oxidation and reduction happen in the same reaction, so it is redox.",
      markScheme: ["1 mark for aluminium gaining oxygen.", "1 mark for aluminium being oxidised.", "1 mark for iron oxide losing oxygen / being reduced.", "1 mark for oxidation and reduction both happening."],
      keywords: ["aluminium", "gains oxygen", "oxidised", "iron oxide", "loses oxygen", "reduced", "redox"],
      commonMistakes: ["Do not just say it burns.", "Redox needs both oxidation and reduction."],
      answerStructure: ["Oxidation statement.", "Reduction statement.", "Conclusion: redox."]
    },
    {
      id: "we-chem-describe-recycling-aluminium",
      domain: "chemistry",
      unit: "9E",
      commandWord: "explain",
      marks: 2,
      question: "Explain why recycling aluminium saves energy compared with extracting aluminium from its ore.",
      answerFrame: "One reason + one consequence.",
      modelAnswer: "Extracting aluminium from ore needs electrolysis, which uses a lot of energy. Recycling aluminium uses less energy because the metal has already been extracted.",
      markScheme: ["1 mark for extraction needing electrolysis / lots of energy.", "1 mark for recycling using less energy because aluminium is already metal."],
      keywords: ["aluminium", "electrolysis", "energy", "recycling", "already extracted"],
      commonMistakes: ["Do not say recycling makes aluminium disappear.", "Compare recycling with extraction."],
      answerStructure: ["Why extraction uses energy.", "Why recycling uses less."]
    },

    {
      id: "we-phys-state-resultant-force",
      domain: "physics",
      unit: "9I",
      commandWord: "state",
      marks: 1,
      question: "State what is meant by the resultant force on an object.",
      answerFrame: "One short sentence.",
      modelAnswer: "The resultant force is the overall force on an object.",
      markScheme: ["1 mark for overall force / sum of all forces."],
      keywords: ["resultant force", "overall force", "sum"],
      commonMistakes: ["Do not list only one force if several forces act."],
      answerStructure: ["Term is definition."]
    },
    {
      id: "we-phys-identify-circuit-meters",
      domain: "physics",
      unit: "9J",
      commandWord: "identify",
      marks: 2,
      question: "Identify how an ammeter and a voltmeter are connected in a circuit.",
      answerFrame: "Use two bullet points.",
      modelAnswer: "An ammeter is connected in series. A voltmeter is connected in parallel across a component.",
      markScheme: ["1 mark for ammeter in series.", "1 mark for voltmeter in parallel / across a component."],
      keywords: ["ammeter", "series", "voltmeter", "parallel", "across"],
      commonMistakes: ["Do not connect the ammeter in parallel.", "Do not connect the voltmeter in series."],
      answerStructure: ["Bullet 1: ammeter.", "Bullet 2: voltmeter."],
      media: [{
        src: "assets/webp/9J-meter-placement-xy-question-v149.webp",
        alt: "Circuit diagram with positions X, Y and Z around a lamp for meter placement.",
        mediaTiming: "question",
        presentation: "media-image-base"
      }]
    },
    {
      id: "we-phys-describe-speed-time",
      domain: "physics",
      unit: "9I",
      commandWord: "describe",
      marks: 3,
      question: "A speed-time graph shows speed increasing from 0 m/s to 12 m/s in the first 4 s, then staying at 12 m/s from 4 s to 10 s. Describe the motion.",
      answerFrame: "Use graph language and values.",
      modelAnswer: "The object accelerates from 0 m/s to 12 m/s during the first 4 s. From 4 s to 10 s the speed is constant at 12 m/s. This means the object is moving at steady speed after 4 s.",
      markScheme: ["1 mark for accelerating in the first 4 s.", "1 mark for using values 0 to 12 m/s or 4 s.", "1 mark for constant speed from 4 s to 10 s."],
      keywords: ["accelerates", "0 m/s", "12 m/s", "4 s", "constant speed"],
      commonMistakes: ["Do not say the object is stationary when the line is horizontal on a speed-time graph.", "Use the y-axis values."],
      answerStructure: ["Describe first section.", "Use values.", "Describe second section."],
      media: [{
        src: "assets/webp/9I-speed-time-graph-blank.webp",
        alt: "Speed-time graph for describing acceleration and constant speed.",
        mediaTiming: "question",
        presentation: "media-image-base"
      }]
    },
    {
      id: "we-phys-explain-terminal-velocity",
      domain: "physics",
      unit: "9I",
      commandWord: "explain",
      marks: 4,
      question: "Explain why a falling object reaches terminal velocity.",
      answerFrame: "Use forces and because / so.",
      modelAnswer: "At first weight is greater than air resistance, so the object accelerates. As speed increases, air resistance increases. Eventually air resistance equals weight, so the resultant force is zero. The object then falls at constant speed called terminal velocity.",
      markScheme: ["1 mark for weight initially being greater than air resistance.", "1 mark for air resistance increasing as speed increases.", "1 mark for air resistance equalling weight / resultant force zero.", "1 mark for constant speed / terminal velocity."],
      keywords: ["weight", "air resistance", "speed increases", "resultant force", "zero", "constant speed", "terminal velocity"],
      commonMistakes: ["Do not say forces disappear.", "At terminal velocity the forces are balanced, not absent."],
      answerStructure: ["Start forces.", "Change with speed.", "Balanced forces.", "Result."]
    },
    {
      id: "we-phys-calculate-moment",
      domain: "physics",
      unit: "9I",
      commandWord: "calculate",
      marks: 2,
      question: "Use the balanced lever diagram. Calculate the missing distance on the right-hand side.",
      answerFrame: "Write the moment equation, substitute values and answer with units.",
      modelAnswer: "Left moment = 240 × 2 = 480 N m. For balance, right moment = 480 N m. Distance = 480 ÷ 160 = 3 m.",
      markScheme: ["1 mark for using equal clockwise and anticlockwise moments / force × distance.", "1 mark for 3 m."],
      keywords: ["moment", "force", "distance", "480 N m", "3 m"],
      commonMistakes: ["Do not forget that balanced means equal moments.", "Use the distance from the pivot, not the total length of the lever."],
      answerStructure: ["Find the known moment.", "Set the opposite moment equal for balance.", "Divide by the force to find distance."],
      media: [{
        src: "assets/webp/9I-moment-balanced-missing-distance-question-v149.webp",
        alt: "Balanced lever with 240 N at 2 m on one side and 160 N at an unknown distance on the other side.",
        mediaTiming: "question",
        presentation: "media-image-base"
      }]
    },
    {
      id: "we-phys-explain-wire-resistance",
      domain: "physics",
      unit: "9J",
      commandWord: "explain",
      marks: 3,
      question: "Explain how increasing the length of a wire affects its resistance.",
      answerFrame: "Use particles/collisions language.",
      modelAnswer: "Increasing the length of the wire increases its resistance. Electrons have to travel further through the metal. They collide with ions more often, so it is harder for current to flow.",
      markScheme: ["1 mark for resistance increasing.", "1 mark for electrons travelling further.", "1 mark for more collisions / harder for current to flow."],
      keywords: ["length", "resistance increases", "electrons", "collide", "ions", "current"],
      commonMistakes: ["Do not say a longer wire has less resistance.", "Explain the mechanism, not just the trend."],
      answerStructure: ["Trend.", "Reason.", "Effect on current."]
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

  function commandHint(commandWord) {
    const hints = {
      state: "State: give the exact fact or term. Do not explain unless asked.",
      identify: "Identify: name the correct item, feature, value, component or graph section.",
      describe: "Describe: say what happens or what the graph/diagram shows. Use values if given.",
      explain: "Explain: make a point, then use because / so / therefore to give the science reason.",
      calculate: "Calculate: write the formula, substitute values, show the answer and include units.",
      compare: "Compare: use both items in the sentence and state a clear similarity or difference.",
      graph: "Graph: read or plot the data, then describe the trend using values."
    };
    return hints[commandWord] || "Write a clear science answer.";
  }

  function writtenDifficulty(question) {
    const explicit = Number(question?.difficulty);
    if (Number.isFinite(explicit)) return Math.max(1, Math.min(5, Math.round(explicit)));
    const marks = Number(question?.marks || 1);
    const commandBase = {
      state: 1,
      identify: 2,
      describe: 3,
      compare: 3,
      calculate: 3,
      graph: 3,
      explain: 4,
    };
    let value = commandBase[question?.commandWord] || Math.max(1, Math.ceil(marks));
    if (marks >= 4) value = Math.max(value, 4);
    if (marks >= 4 && question?.commandWord === "explain") value = 5;
    return Math.max(1, Math.min(5, value));
  }

  function writtenQuestionMarks(question) {
    const marks = Number(question?.marks || 0);
    return Number.isFinite(marks) ? marks : 0;
  }

  function writtenBlueprintScore(combo) {
    const commandTypes = new Set(combo.map((question) => question.commandWord).filter(Boolean));
    const units = new Set(combo.map((question) => question.unit).filter(Boolean));
    const difficultySpread = new Set(combo.map((question) => writtenDifficulty(question))).size;
    const hasHigherDemand = combo.some((question) => ["describe", "explain", "calculate", "compare", "graph"].includes(question.commandWord));
    const hasLowDemand = combo.some((question) => ["state", "identify"].includes(question.commandWord));
    return commandTypes.size * 3 + units.size + difficultySpread + (hasHigherDemand ? 2 : 0) + (hasLowDemand ? 1 : 0);
  }

  function writtenCombinationsForTarget(pool, targetMarks) {
    const combos = [];
    const sortedPool = [...pool].sort((a, b) => String(a.id).localeCompare(String(b.id)));
    function walk(start, total, chosen) {
      if (total === targetMarks) {
        combos.push([...chosen]);
        return;
      }
      if (total > targetMarks) return;
      for (let index = start; index < sortedPool.length; index += 1) {
        const question = sortedPool[index];
        chosen.push(question);
        walk(index + 1, total + writtenQuestionMarks(question), chosen);
        chosen.pop();
      }
    }
    walk(0, 0, []);
    return combos;
  }

  function chooseWrittenDomainQuestions(domain, targetMarks) {
    const pool = WRITTEN_EXAM_BANK.filter((question) => question.domain === domain);
    const exactCombos = writtenCombinationsForTarget(pool, targetMarks);
    if (exactCombos.length) {
      const scored = exactCombos.map((combo) => ({ combo, score: writtenBlueprintScore(combo) }));
      const bestScore = Math.max(...scored.map((item) => item.score));
      const strongCombos = scored.filter((item) => item.score >= bestScore - 1).map((item) => item.combo);
      return shuffle(strongCombos[Math.floor(Math.random() * strongCombos.length)] || exactCombos[0]);
    }

    const shuffled = shuffle(pool);
    const chosen = [];
    let total = 0;
    shuffled.forEach((question) => {
      const marks = writtenQuestionMarks(question);
      if (total + marks <= targetMarks) {
        chosen.push(question);
        total += marks;
      }
    });
    return chosen;
  }

  function buildWrittenExam(totalMarks = 30) {
    const requested = [15, 30, 45].includes(Number(totalMarks)) ? Number(totalMarks) : 30;
    const marksPerDomain = WRITTEN_SIZE_OPTIONS[requested]?.marksPerDomain || 10;
    const sections = ["biology", "chemistry", "physics"].flatMap((domain) => chooseWrittenDomainQuestions(domain, marksPerDomain));
    return shuffle(sections).map((question, index) => ({ ...question, examOrder: index + 1 }));
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
      sessionPositions: {},
      sound: true,
      updatedAt: new Date().toISOString(),
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
    if (mode === "revisit") return "Revisit your studies";
    if (mode === "test") return "Test your knowledge";
    if (mode === "written") return "Build written exam";
    return "Start revision";
  }

  function modeReadyCount(mode = state.selectedMode) {
    if (mode === "written") return WRITTEN_EXAM_BANK.length;
    return cardsForMode(mode).length;
  }

  function modeLabel(mode = state.selectedMode) {
    if (mode === "revisit") return "Revisit";
    if (mode === "test") return "Test your knowledge";
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
    return cards.filter((card) => (card.noteId || card.learningObjective) === noteId);
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
      guidance = "You included most of the key ideas. If the meaning is clear, mark it Mastered.";
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
    if (!state.session || !card || state.mode === "test") return;
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

    if (state.mode === "revisit" || state.mode === "study" || state.mode === "test") {
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

  function sessionPositionKey(mode = state.mode) {
    const f = activeFilters();
    const unitsKey = [...(f.units || [])].sort().join(",") || "all";
    const objectivesKey = [...(f.objectives || [])].sort().join(",") || "all";
    return [mode, unitsKey, objectivesKey, f.type || "all", f.level || "all", f.search || ""].join("|");
  }

  function saveSessionPosition() {
    if (!state.deck.length || state.noteContext || state.mode === "test") return;
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
    if (!state.deck.length || mode === "test") return;
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
    return cards.filter((card) => {
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

  function cardsForMode(mode = state.mode) {
    const base = baseFilteredCards();
    const mastered = new Set(state.progress.masteredIds || []);
    const revisit = new Set(state.progress.revisitIds || []);
    const study = new Set(state.progress.studyIds || []);

    if (mode === "revisit") return base.filter((card) => revisit.has(card.id));
    if (mode === "study") return base.filter((card) => study.has(card.id));
    if (mode === "test") return base.filter((card) => mastered.has(card.id));
    if (mode === "written") return WRITTEN_EXAM_BANK;
    return base;
  }

  function rebuildDeck(resetIndex = true) {
    if (state.mode === "written") return;
    state.deck = cardsForMode();
    if (resetIndex || state.index >= state.deck.length) state.index = 0;
    resetCardInteraction();
  }

  function initFilters() {
    if (els.unitFilter) els.unitFilter.innerHTML = `<option value="all">All units</option>` + units.map((unit) => `<option value="${escapeHtml(unit.id)}">${escapeHtml(unit.title)}</option>`).join("");
    updateObjectiveOptions();
    const types = unique(cards.map((card) => card.type));
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
      state.deck = shuffle(cardsForMode("practice"));
      state.index = 0;
      state.mode = "practice";
      startSession("practice", { preserveDeck: true });
    });
  }

  function startSession(mode, options = {}) {
    state.mode = mode;
    state.noteContext = null;
    state.test = mode === "test" ? { score: 0, answered: 0, answers: [] } : null;
    state.written = null;
    if (mode === "written") {
      const totalMarks = [15, 30, 45].includes(Number(options.totalMarks)) ? Number(options.totalMarks) : (state.progress.writtenExamMarks || 30);
      state.progress.writtenExamMarks = totalMarks;
      state.written = { totalMarks, answers: {}, marksAwarded: {}, formatHints: {}, examSubmitted: false, builtAt: new Date().toISOString() };
      state.deck = buildWrittenExam(totalMarks);
      state.index = 0;
      resetCardInteraction();
      writeProgress();
    } else {
      resetCardInteraction();
      if (!options.preserveDeck) {
        rebuildDeck(true);
        restoreSessionPosition(mode);
      }
      if (mode !== "test") startSessionTracker(mode);
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
    if (els.totalCardCount) els.totalCardCount.textContent = cards.length;
    if (els.journeyCount) els.journeyCount.textContent = `${sortedSelected} / ${selectedCards.length} sorted`;
    if (els.xpStat) els.xpStat.textContent = state.progress.xp || 0;
    if (els.streakStat) els.streakStat.textContent = state.progress.streak || 0;
    if (els.masteredStat) els.masteredStat.textContent = cardsForMode("test").length;
    if (els.hubMasteredStat) els.hubMasteredStat.textContent = mastered.size;
    if (els.revisitStat) els.revisitStat.textContent = cardsForMode("revisit").length;
    if (els.hubRevisitStat) els.hubRevisitStat.textContent = revisit.size;
    if (els.studyStat) els.studyStat.textContent = study.size;
    if (els.hubStudyStat) els.hubStudyStat.textContent = study.size;
    if (els.routeEntryButton) {
      if (state.selectedMode === "written") {
        const marks = state.progress.writtenExamMarks || 30;
        els.routeEntryButton.textContent = `${modeEntryText()} (${marks} marks)`;
        els.routeEntryButton.disabled = false;
      } else {
        els.routeEntryButton.textContent = `${modeEntryText()} (${ready})`;
        els.routeEntryButton.disabled = ready === 0;
      }
    }
    if (els.selectionSummary) {
      const unitCount = state.selectedUnits.size;
      const objectiveCount = state.selectedObjectives.size;
      if (state.selectedMode === "written") {
        const marks = state.progress.writtenExamMarks || 30;
        const perDomain = marks / 3;
        els.selectionSummary.textContent = `Written exam builder: ${marks} marks · ${perDomain} marks each for Biology, Chemistry and Physics`;
      } else if (!unitCount && !objectiveCount) els.selectionSummary.textContent = `Selected revision set: all units · ${ready} card${ready === 1 ? "" : "s"}`;
      else els.selectionSummary.textContent = `Selected revision set: ${unitCount || "all"} unit${unitCount === 1 ? "" : "s"} · ${objectiveCount} sub-unit${objectiveCount === 1 ? "" : "s"} · ${ready} card${ready === 1 ? "" : "s"}`;
    }
    if (els.selectionDetail) {
      els.selectionDetail.textContent = state.selectedMode === "written"
        ? "Practise state/identify, describe, explain and calculation answers. Submit the paper before seeing the mark scheme, then use the mark-test screen to self-mark."
        : `Mode: ${modeLabel()}. Select more units or sub-units below, then use the main button to begin.`;
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
      const unitCards = cards.filter((card) => card.unit === unit.id);
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
          return `<div class="objective-row ${selectedObjective ? "selected" : ""}">
            <button class="objective-toggle" data-objective-toggle="${escapeHtml(objective.id)}" type="button" aria-pressed="${selectedObjective}">
              <strong>${escapeHtml(objective.title)}</strong>
              <span>${objectiveCards.length} cards · ${objectiveMastered}/${objectiveCards.length} mastered · ${objectiveRevisit} revisit · ${objectiveStudy} need notes</span>
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
            <span class="pill good">${masteredCount}/${unitCards.length} mastered</span>
            <span class="pill warn">${revisitCount} revisit</span>
            <span class="pill study">${studyCount} need notes</span>
          </div>
          <h3>${escapeHtml(unit.title)}</h3>
          <p>${escapeHtml(unit.theme)}</p>
          <div class="progress-track" aria-label="${masteredCount} of ${unitCards.length} cards mastered"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="objective-list" aria-label="Learning objectives in ${escapeHtml(unit.title)}">
            <div class="objective-row full-unit-row ${selectedUnit ? "selected" : ""}">
              <button class="objective-toggle full-unit-toggle" data-unit-toggle="${escapeHtml(unit.id)}" type="button" aria-pressed="${selectedUnit}">
                <strong>${escapeHtml(unit.title)}</strong>
                <span>Full unit option · ${unitCards.length} revision cards</span>
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

  function renderOverviewRoute(items = []) {
    if (!Array.isArray(items) || !items.length) return "";
    return `<div class="overview-route-grid">${items.map((item) => `
      <article class="overview-route-card">
        <strong>${escapeHtml(item.title || "Sub-unit")}</strong>
        <p>${escapeHtml(item.focus || "")}</p>
      </article>
    `).join("")}</div>`;
  }

  function renderOverviewStatus(items = []) {
    if (!Array.isArray(items) || !items.length) return "";
    return `<div class="overview-status-grid">${items.map((item) => `
      <article class="overview-status-card status-${escapeHtml(item.status || "partial")}">
        <span class="overview-status-pill">${escapeHtml(item.status || "check")}</span>
        <strong>${escapeHtml(item.title || "Visual coverage")}</strong>
        <p>${escapeHtml(item.detail || "")}</p>
      </article>
    `).join("")}</div>`;
  }

  function renderInfographicBacklog(items = []) {
    if (!Array.isArray(items) || !items.length) return "";
    return `<div class="overview-backlog-list">${items.map((item) => `
      <article class="overview-backlog-card priority-${escapeHtml(item.priority || "medium")}">
        <span>${escapeHtml((item.priority || "medium").toUpperCase())}</span>
        <div>
          <strong>${escapeHtml(item.title || "Infographic")}</strong>
          <p>${escapeHtml(item.purpose || "")}</p>
        </div>
      </article>
    `).join("")}</div>`;
  }

  function renderUnitOverviewContext() {
    const ctx = state.noteContext;
    const overview = unitOverviewMeta(ctx?.overviewUnitId);
    if (!overview) {
      state.noteContext = null;
      renderSession();
      return;
    }
    const unitCards = cards.filter((card) => card.unit === overview.unit);
    const unitObjectives = learningObjectives.filter((objective) => objective.unit === overview.unit);
    const noteCount = classNotes.filter((note) => note.unit === overview.unit).length;
    updateSessionChrome({
      unitId: overview.unit,
      title: "Reaction",
      eyebrow: "Unit overview",
      subtitle: `${unitTitle(overview.unit)} · Revision-pack map`
    });
    els.sessionIndex.textContent = String(unitCards.length);
    els.sessionTotal.textContent = " cards";
    els.resultPanel.classList.add("hidden");
    els.studyPanel.innerHTML = `
      <article class="study-card note-context-card unit-overview-card">
        <div class="card-topline">
          <div class="card-title-row">
            <span class="pill">${escapeHtml(unitTitle(overview.unit))}</span>
            <span class="pill objective-pill">Unit overview</span>
            <span class="pill">${unitObjectives.length} sub-units</span>
            <span class="pill">${noteCount} note pages</span>
          </div>
        </div>
        <section class="note-section note-summary">
          <h2>${escapeHtml(overview.title || `${unitTitle(overview.unit)} overview`)}</h2>
          <p>${escapeHtml(overview.summary || "")}</p>
        </section>
        <section class="note-section">
          <h3>Revision-pack must know</h3>
          ${renderPlainList(overview.revisionPackFocus)}
        </section>
        ${Array.isArray(overview.formulae) && overview.formulae.length ? `<section class="note-section formula-note"><h3>Formulae / equations</h3>${renderPlainList(overview.formulae)}</section>` : ""}
        <section class="note-section">
          <h3>How the sub-unit pages fit</h3>
          ${renderOverviewRoute(overview.subUnitRoute)}
        </section>
        <section class="note-section">
          <h3>Diagram, graph and calculation coverage</h3>
          ${renderOverviewStatus(overview.visualCoverage)}
        </section>
        <section class="note-section practice-note">
          <h3>Infographics to develop next</h3>
          ${renderInfographicBacklog(overview.infographicBacklog)}
        </section>
        <section class="note-section sentence-note">
          <h3>Written-answer moves</h3>
          ${renderPlainList(overview.examAnswerMoves)}
        </section>
        <div class="card-actions">
          <button class="primary-button" data-overview-action="practice-unit" type="button">Practise this full unit</button>
          <button class="secondary-button" data-overview-action="hub" type="button">Back to hub</button>
        </div>
      </article>
    `;
    $$('[data-overview-action]', els.studyPanel).forEach((button) => {
      button.addEventListener('click', () => handleUnitOverviewAction(button.dataset.overviewAction, overview));
    });
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

  function openNoteContext(noteId, cardId = null) {
    state.noteContext = { noteId, cardId };
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
    const sourceCard = ctx?.cardId ? cards.find((card) => card.id === ctx.cardId) : null;
    if (!note) {
      state.noteContext = null;
      renderSession();
      return;
    }
    const linked = linkedCardsForNote(note.id);
    const sourceMedia = sourceCard && Array.isArray(sourceCard.media) ? sourceCard.media.filter((item) => !item.mediaTiming || item.mediaTiming === "question") : [];
    const noteMedia = Array.isArray(note.media) ? note.media : [];
    updateSessionChrome({
      unitId: note.unit,
      title: "Reaction",
      eyebrow: sourceCard ? "Study this concept" : "Class notes",
      subtitle: `${unitTitle(note.unit)} · ${note.title}`
    });
    els.sessionIndex.textContent = String(linked.length);
    els.sessionTotal.textContent = " linked cards";
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
        ${sourceCard ? `<aside class="source-question"><span class="eyebrow">Original question</span><p>${escapeHtml(sourceCard.question)}</p></aside>` : ""}
        ${sourceMedia.length ? renderMediaItems(sourceMedia, sourceCard.question || note.title, "media-grid note-source-media") : ""}
        ${noteMedia.length ? `<section class="note-section note-visual-section"><h3>Study visual</h3>${renderMediaItems(noteMedia, note.title, "media-grid note-media-grid")}</section>` : ""}
        <section class="note-section note-summary">
          <h2>Big idea</h2>
          <p>${escapeHtml(note.summary)}</p>
        </section>
        ${note.explanation ? `<section class="note-section explanation-note"><h3>Deeper explanation</h3><p>${escapeHtml(note.explanation)}</p></section>` : ""}
        <section class="note-section">
          <h3>Key points</h3>
          <ul>${(note.keyPoints || []).map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>
        </section>
        ${note.memoryHook ? `<section class="note-section memory-note"><h3>Memory hook</h3><p>${escapeHtml(note.memoryHook)}</p></section>` : ""}
        ${renderCommonMistakes(note.commonMistakes)}
        ${note.example ? `<section class="note-section example-note"><h3>Worked / model example</h3><p><strong>Question:</strong> ${escapeHtml(note.example.question)}</p><p><strong>Answer:</strong> ${escapeHtml(note.example.answer)}</p></section>` : ""}
        ${note.selfCheck ? `<section class="note-section self-check-note"><h3>Quick self-check</h3><p>${escapeHtml(note.selfCheck)}</p></section>` : ""}
        ${note.sentenceStarter ? `<section class="note-section sentence-note"><h3>Useful answer sentence</h3><p>${escapeHtml(note.sentenceStarter)}</p></section>` : ""}
        ${note.practicePrompt ? `<section class="note-section practice-note"><h3>Try next</h3><p>${escapeHtml(note.practicePrompt)}</p></section>` : ""}
        <div class="card-actions">
          ${sourceCard ? `
            <button class="primary-button" data-note-action="mastered" type="button">I get it now · Mastered</button>
            <button class="secondary-button" data-note-action="revisit" type="button">Almost · Revisit</button>
            <button class="danger-button" data-note-action="study" type="button">Still confused · Need notes</button>
            <button class="secondary-button" data-note-action="back-card" type="button">Back to card</button>
          ` : `
            <button class="primary-button" data-note-action="practice" type="button">Practise linked cards</button>
            <button class="secondary-button" data-note-action="hub" type="button">Back to hub</button>
          `}
        </div>
      </article>
    `;
    $$('[data-note-action]', els.studyPanel).forEach((button) => {
      button.addEventListener('click', () => handleNoteAction(button.dataset.noteAction, note, sourceCard));
    });
  }

  function handleNoteAction(action, note, sourceCard) {
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


  function fidelityLabel(value) {
    const labels = {
      "exact-source-text": "Exact source text",
      "source-style-redraw": "Source-style redraw",
      "text-equivalent": "Text equivalent",
      "success-criterion-derived": "Success criterion",
      "progress-check-derived": "Progress check",
      "calculation-practice-derived": "Calculation practice",
      "derived": "Derived"
    };
    return labels[value] || value || "";
  }

  function fidelityClass(value) {
    if (value === "exact-source-text") return "fidelity exact";
    if (value === "source-style-redraw") return "fidelity redraw";
    if (value === "text-equivalent") return "fidelity equivalent";
    return "fidelity derived";
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
    const explanation = card.explanation || card.cue || "Read the question, inspect any diagram, then use Study this if you need the class-note explanation before deciding.";
    return `
      <aside class="study-support">
        <strong>Need notes focus</strong>
        <p>${escapeHtml(explanation)}</p>
        <ul>
          <li>Say the key idea out loud in your own words.</li>
          <li>Use the diagram or source clue if one is shown.</li>
          <li>Use Class Notes for the class-note context, then move it to Revisit or Mastered.</li>
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

  function persistWrittenAnswer(question) {
    const answerBox = byId("writtenAnswer");
    if (answerBox && state.written?.answers) state.written.answers[question.id] = answerBox.value;
  }

  function renderWrittenDifficultyBubble(question) {
    const difficulty = writtenDifficulty(question);
    return `<span class="difficulty-bubble difficulty-${difficulty}" title="Difficulty ${difficulty} out of 5" aria-label="Difficulty ${difficulty} out of 5">${difficulty}</span>`;
  }

  function renderWrittenAnswerFormat(question) {
    return `
      <aside class="written-answer-guide" id="writtenAnswerFormat">
        <strong>Answer format</strong>
        <p>${escapeHtml(commandHint(question.commandWord))}</p>
        <p><strong>Use:</strong> ${escapeHtml(question.answerFrame || "Short sentences with science key words.")}</p>
        ${(question.answerStructure || []).length ? `<ul>${question.answerStructure.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ul>` : ""}
      </aside>
    `;
  }

  function renderWrittenQuestionCard(question) {
    const typed = writtenCurrentAnswer(question);
    const formatOpen = Boolean(state.written?.formatHints?.[question.id]);
    const isLast = state.index >= state.deck.length - 1;
    const answeredCount = state.deck.filter((item) => String(state.written?.answers?.[item.id] || "").trim()).length;
    const totalMarks = state.deck.reduce((sum, item) => sum + writtenQuestionMarks(item), 0);

    updateSessionChrome({
      title: "Written Exam Mode",
      eyebrow: modeText.written.eyebrow,
      subtitle: `${domainLabel(question.domain)} · ${unitTitle(question.unit)} · ${question.marks} mark${question.marks === 1 ? "" : "s"}`
    });
    els.sessionIndex.textContent = String(state.index + 1);
    els.sessionTotal.textContent = `/ ${state.deck.length}`;
    els.resultPanel.classList.add("hidden");

    els.studyPanel.innerHTML = `
      <article class="study-card written-card">
        <div class="written-phase-banner">
          <strong>Test phase</strong>
          <span>Mark scheme hidden · ${answeredCount}/${state.deck.length} answered · ${totalMarks} marks total</span>
        </div>
        <div class="written-question-meta">
          <span class="pill">${escapeHtml(domainLabel(question.domain))}</span>
          <span class="pill">${escapeHtml(unitTitle(question.unit))}</span>
          <span class="pill command-word">${escapeHtml(question.commandWord)}</span>
          <span class="pill">${question.marks} mark${question.marks === 1 ? "" : "s"}</span>
          ${renderWrittenDifficultyBubble(question)}
        </div>
        <p class="question-text">${escapeHtml(question.question)}</p>
        ${Array.isArray(question.media) && question.media.length ? renderMediaItems(question.media.filter((item) => !item.mediaTiming || item.mediaTiming === "question"), question.question || "Question diagram", "media-grid question-media-grid", { showCaptions: false }) : ""}
        <div class="written-answer-heading">
          <label for="writtenAnswer" class="written-answer-label">Your written answer</label>
          <button class="tertiary-button written-format-button" data-written-action="toggle-format" type="button" aria-expanded="${formatOpen ? "true" : "false"}" aria-controls="writtenAnswerFormat">Answer format</button>
        </div>
        ${formatOpen ? renderWrittenAnswerFormat(question) : ""}
        <textarea id="writtenAnswer" class="open-answer written-answer-box" placeholder="Write your answer here. Use short sentences or bullet points where useful.">${escapeHtml(typed)}</textarea>

        <div class="card-actions primary-actions">
          ${!isLast ? `<button class="primary-button" data-written-action="next" type="button">Next question</button>` : `<button class="primary-button" data-written-action="submit-test" type="button">Submit test and mark</button>`}
          <button class="secondary-button" data-written-action="prev" type="button">Previous</button>
          <button class="secondary-button" data-written-action="print-blank" type="button">Save / print PDF</button>
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
  }

  function renderWrittenMarkingCard(question) {
    const typed = writtenCurrentAnswer(question);
    const awarded = writtenCurrentMark(question);
    const markedCount = state.deck.filter((item) => Number.isFinite(Number(state.written?.marksAwarded?.[item.id]))).length;
    const total = state.deck.reduce((sum, item) => sum + writtenQuestionMarks(item), 0);
    const awardedTotal = state.deck.reduce((sum, item) => sum + Number(state.written?.marksAwarded?.[item.id] || 0), 0);
    const isLast = state.index >= state.deck.length - 1;

    updateSessionChrome({
      title: "Mark Test",
      eyebrow: "Written exam self-marking",
      subtitle: `${markedCount}/${state.deck.length} questions marked · ${awardedTotal}/${total} marks awarded so far`
    });
    els.sessionIndex.textContent = String(state.index + 1);
    els.sessionTotal.textContent = `/ ${state.deck.length}`;
    els.resultPanel.classList.add("hidden");

    els.studyPanel.innerHTML = `
      <article class="study-card written-card written-marking-card">
        <div class="written-phase-banner marking">
          <strong>Mark test phase</strong>
          <span>Compare your answer to the mark scheme, then award 0–${question.marks} marks.</span>
        </div>
        <div class="written-question-meta">
          <span class="pill">${escapeHtml(domainLabel(question.domain))}</span>
          <span class="pill">${escapeHtml(unitTitle(question.unit))}</span>
          <span class="pill command-word">${escapeHtml(question.commandWord)}</span>
          <span class="pill">${question.marks} mark${question.marks === 1 ? "" : "s"}</span>
          ${renderWrittenDifficultyBubble(question)}
        </div>
        <p class="question-text">${escapeHtml(question.question)}</p>
        ${Array.isArray(question.media) && question.media.length ? renderMediaItems(question.media.filter((item) => !item.mediaTiming || item.mediaTiming === "question"), question.question || "Question diagram", "media-grid question-media-grid", { showCaptions: false }) : ""}
        <section class="written-user-answer-panel">
          <strong>Your written answer</strong>
          <div class="written-user-answer">${escapeHtml(typed || "No answer entered.")}</div>
        </section>
        ${renderWrittenMarkScheme(question, awarded)}
        <div class="card-actions primary-actions">
          ${!isLast ? `<button class="primary-button" data-written-action="next" type="button">Next mark scheme</button>` : `<button class="primary-button" data-written-action="finish" type="button">Finish and score test</button>`}
          <button class="secondary-button" data-written-action="prev" type="button">Previous</button>
          <button class="secondary-button" data-written-action="print-key" type="button">Save PDF + answer key</button>
        </div>
      </article>
    `;

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

  function renderWrittenCard() {
    const question = state.deck[state.index];
    if (!question) return;
    if (state.written?.examSubmitted) renderWrittenMarkingCard(question);
    else renderWrittenQuestionCard(question);
  }

  function renderWrittenMarkScheme(question, awarded) {
    const markButtons = Array.from({ length: question.marks + 1 }, (_, mark) => {
      const active = awarded === mark ? " active" : "";
      return `<button class="written-mark-button${active}" data-written-mark="${mark}" type="button">${mark}</button>`;
    }).join("");
    return `
      <section class="written-mark-scheme">
        <h3>Mark scheme</h3>
        <div class="written-model-answer">
          <strong>Model answer</strong>
          <p>${escapeHtml(question.modelAnswer)}</p>
        </div>
        <div class="written-checklist">
          <strong>Credit checklist</strong>
          <ul>${(question.markScheme || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
        <div class="written-keywords">
          <strong>Key words/actions</strong>
          <p>${(question.keywords || []).map((word) => `<span>${escapeHtml(word)}</span>`).join("")}</p>
        </div>
        <div class="written-common-mistakes">
          <strong>Common mistakes</strong>
          <ul>${(question.commonMistakes || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
        <div class="written-self-mark">
          <strong>Self-mark</strong>
          <p>Select the mark your answer deserves.</p>
          <div class="written-mark-buttons">${markButtons}</div>
        </div>
      </section>
    `;
  }

  function handleWrittenAction(action, question) {
    if (!state.written) return;
    if (action === "toggle-format") {
      persistWrittenAnswer(question);
      state.written.formatHints = state.written.formatHints || {};
      state.written.formatHints[question.id] = !state.written.formatHints[question.id];
      renderWrittenCard();
      return;
    }
    if (action === "print-blank") {
      persistWrittenAnswer(question);
      openWrittenPdfView(false);
      return;
    }
    if (action === "print-key") {
      openWrittenPdfView(true);
      return;
    }
    if (action === "submit-test") {
      persistWrittenAnswer(question);
      const unanswered = state.deck.filter((item) => !String(state.written.answers?.[item.id] || "").trim()).length;
      if (unanswered && !window.confirm(`${unanswered} question${unanswered === 1 ? " is" : "s are"} unanswered. Submit and mark the test anyway?`)) return;
      state.written.examSubmitted = true;
      state.index = 0;
      renderWrittenCard();
      return;
    }
    if (action === "next") {
      if (!state.written.examSubmitted) persistWrittenAnswer(question);
      if (state.index >= state.deck.length - 1) {
        if (state.written.examSubmitted) finishWrittenExam();
      } else {
        state.index += 1;
        renderWrittenCard();
      }
      return;
    }
    if (action === "prev") {
      if (!state.written.examSubmitted) persistWrittenAnswer(question);
      if (state.index > 0) {
        state.index -= 1;
        renderWrittenCard();
      }
      return;
    }
    if (action === "finish") finishWrittenExam();
  }

  function writtenPrintableMedia(question) {
    const media = Array.isArray(question.media) ? question.media.filter((item) => !item.mediaTiming || item.mediaTiming === "question") : [];
    if (!media.length) return "";
    return `<div class="print-media">${media.map((item) => `<img src="${escapeHtml(item.src || "")}" alt="${escapeHtml(item.alt || "Question diagram")}">`).join("")}</div>`;
  }

  function openWrittenPdfView(includeAnswers = false) {
    if (!state.deck.length) return;
    const total = state.deck.reduce((sum, question) => sum + writtenQuestionMarks(question), 0);
    const title = `Reaction Year 9 written exam - ${total} marks`;
    const baseHref = document.baseURI || window.location.href;
    const date = new Date().toLocaleDateString();
    const questionHtml = state.deck.map((question, index) => {
      const answer = state.written?.answers?.[question.id] || "";
      const awarded = writtenCurrentMark(question);
      return `
        <section class="print-question">
          <div class="print-meta">
            <span>Q${index + 1}</span>
            <span>${escapeHtml(domainLabel(question.domain))}</span>
            <span>${escapeHtml(unitTitle(question.unit))}</span>
            <span>${escapeHtml(question.commandWord)}</span>
            <span>${question.marks} mark${question.marks === 1 ? "" : "s"}</span>
            <span>Difficulty ${writtenDifficulty(question)}/5</span>
          </div>
          <h2>${escapeHtml(question.question)}</h2>
          ${writtenPrintableMedia(question)}
          ${includeAnswers ? `
            <div class="print-answer-block">
              <strong>Student answer</strong>
              <p>${escapeHtml(answer || "No answer entered.")}</p>
              <strong>Model answer</strong>
              <p>${escapeHtml(question.modelAnswer)}</p>
              <strong>Credit checklist</strong>
              <ul>${(question.markScheme || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
              <p><strong>Self-mark:</strong> ${Number.isFinite(Number(awarded)) ? `${awarded}/${question.marks}` : `__/ ${question.marks}`}</p>
            </div>` : `
            <div class="print-lines" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>`}
        </section>
      `;
    }).join("");
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("The browser blocked the PDF/print window. Allow pop-ups for this site, then try again.");
      return;
    }
    printWindow.document.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <base href="${escapeHtml(baseHref)}">
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; margin: 28px; color: #111827; }
    header { border-bottom: 2px solid #111827; margin-bottom: 18px; padding-bottom: 12px; }
    h1 { margin: 0 0 6px; font-size: 24px; }
    h2 { font-size: 17px; line-height: 1.35; margin: 12px 0; }
    .print-subtitle { color: #475569; font-size: 13px; }
    .print-question { break-inside: avoid; page-break-inside: avoid; border-bottom: 1px solid #cbd5e1; padding: 16px 0 20px; }
    .print-meta { display: flex; flex-wrap: wrap; gap: 6px; }
    .print-meta span { border: 1px solid #cbd5e1; border-radius: 999px; padding: 3px 8px; font-size: 11px; font-weight: 700; }
    .print-media { margin: 10px 0; }
    .print-media img { max-width: 100%; max-height: 360px; border: 1px solid #cbd5e1; border-radius: 10px; }
    .print-lines span { display: block; height: 28px; border-bottom: 1px solid #94a3b8; }
    .print-answer-block { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 12px; }
    .print-answer-block p { white-space: pre-wrap; }
    @page { margin: 16mm; }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(title)}</h1>
    <div class="print-subtitle">${includeAnswers ? "Answer key and self-mark copy" : "Question paper"} · ${escapeHtml(date)} · Save as PDF from the print dialog.</div>
  </header>
  ${questionHtml}
  <script>window.addEventListener('load', function () { setTimeout(function () { window.print(); }, 250); });<\/script>
</body>
</html>`);
    printWindow.document.close();
  }

  function finishWrittenExam() {
    if (!state.written?.examSubmitted) {
      state.written.examSubmitted = true;
      state.index = 0;
      renderWrittenCard();
      return;
    }
    const total = state.deck.reduce((sum, question) => sum + Number(question.marks || 0), 0);
    const awarded = state.deck.reduce((sum, question) => sum + Number(state.written?.marksAwarded?.[question.id] || 0), 0);
    const byDomain = ["biology", "chemistry", "physics"].map((domain) => {
      const questions = state.deck.filter((question) => question.domain === domain);
      return {
        domain,
        total: questions.reduce((sum, question) => sum + Number(question.marks || 0), 0),
        awarded: questions.reduce((sum, question) => sum + Number(state.written?.marksAwarded?.[question.id] || 0), 0)
      };
    });
    const percent = total ? Math.round((awarded / total) * 100) : 0;
    const record = {
      date: new Date().toISOString(),
      mode: "written",
      totalMarks: state.written?.totalMarks || total,
      awarded,
      total,
      percent,
      questionIds: state.deck.map((question) => question.id),
    };
    state.progress.writtenExamHistory = [...(state.progress.writtenExamHistory || []), record].slice(-20);
    saveProgress();

    els.studyPanel.innerHTML = "";
    els.resultPanel.classList.remove("hidden");
    els.resultPanel.innerHTML = `
      <h2>Written exam complete</h2>
      <p>You self-marked <strong>${awarded}/${total}</strong> (${percent}%).</p>
      <div class="written-domain-summary">
        ${byDomain.map((item) => `<div><strong>${escapeHtml(domainLabel(item.domain))}</strong><span>${item.awarded}/${item.total}</span></div>`).join("")}
      </div>
      <p>Next step: redo the lowest-scoring science section and focus on the command words that lost marks.</p>
      <div class="card-actions">
        <button class="primary-button" data-result-action="written-again" type="button">Build another written exam</button>
        <button class="secondary-button" data-result-action="print-key" type="button">Save PDF + answer key</button>
        <button class="secondary-button" data-result-action="print-blank" type="button">Save blank test PDF</button>
        <button class="secondary-button" data-result-action="hub" type="button">Back to revision hub</button>
      </div>
    `;
    $('[data-result-action="hub"]', els.resultPanel)?.addEventListener("click", showHub);
    $('[data-result-action="written-again"]', els.resultPanel)?.addEventListener("click", () => startSession("written", { totalMarks: state.progress.writtenExamMarks || 30 }));
    $('[data-result-action="print-key"]', els.resultPanel)?.addEventListener("click", () => openWrittenPdfView(true));
    $('[data-result-action="print-blank"]', els.resultPanel)?.addEventListener("click", () => openWrittenPdfView(false));
  }

  function renderCard() {
    if (state.mode === "written") {
      renderWrittenCard();
      return;
    }
    const card = state.deck[state.index];
    const isMcq = cardIsMcq(card);
    const isDefinition = cardIsDefinition(card);
    const membership = setMembership(card.id);
    const testMode = state.mode === "test";
    const fidelityText = card.sourceFidelity ? fidelityLabel(card.sourceFidelity) : "";

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
            ${card.learningObjective ? `<span class="pill objective-pill">${escapeHtml(objectiveTitle(card.learningObjective))}</span>` : ""}
            <span class="pill">Level ${card.level}</span>
            ${(!isMcq && membership.mastered) ? `<span class="pill good">mastered</span>` : ""}
            ${(!isMcq && membership.revisit) ? `<span class="pill warn">revisit</span>` : ""}
            ${(!isMcq && membership.study) ? `<span class="pill study">need notes</span>` : ""}
          </div>
        </div>

        ${renderStudyPrompt(card)}
        <p class="question-text">${escapeHtml(card.question)}</p>
        ${renderMedia(card)}
        ${card.cue ? `<p class="explanation"><strong>Cue:</strong> ${escapeHtml(card.cue)}</p>` : ""}
        ${isMcq ? renderChoices(card, testMode) : isDefinition && !testMode ? renderDefinitionResponse(card) : renderOpenResponse(testMode)}
        ${state.revealed ? renderReveal(card) : ""}
        ${isMcq && state.selectedChoice ? renderChoiceFeedback(card) : ""}

        <div class="card-actions primary-actions">
          ${!state.revealed && !testMode && !isDefinition && !state.selectedChoice ? `<button class="primary-button" data-action="reveal" type="button">Reveal answer</button>` : ""}
          ${isDefinition && !testMode && !state.definitionCompared ? `<button class="primary-button" data-action="compare-definition" type="button">Compare notes</button>` : ""}
          ${!isMcq && testMode && !state.revealed ? `<button class="primary-button" data-action="test-open-submit" type="button">Show mark scheme</button>` : ""}
          ${!isMcq && testMode && state.revealed ? `<button class="primary-button" data-action="test-right" type="button">Mark right</button><button class="danger-button" data-action="test-wrong" type="button">Mark wrong</button>` : ""}
          ${isMcq && (state.selectedChoice || state.revealed) ? `<button class="primary-button" data-action="next" type="button">Next card</button>` : ""}
          <button class="secondary-button" data-action="prev" type="button">Previous</button>
          ${!(isMcq && (state.selectedChoice || state.revealed)) ? `<button class="secondary-button" data-action="next" type="button">Skip</button>` : ""}
          ${!testMode ? `<button class="secondary-button class-notes-button" data-action="study-context" type="button">Class Notes</button>` : ""}
        </div>

        ${!testMode && !isMcq && (!isDefinition || state.definitionCompared) ? `
          <div class="state-actions" aria-label="Learning state">
            <button class="primary-button" data-state="mastered" type="button">Good match · Mastered</button>
            <button class="secondary-button" data-state="revisit" type="button">Nearly there · Revisit</button>
          </div>
        ` : ""}

        <p class="source-note">Source: ${escapeHtml(card.source || "Year 9 content pack")}${fidelityText ? ` · ${escapeHtml(fidelityText.toLowerCase())}` : ""}</p>
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
    return `<div class="answer-grid" role="group" aria-label="Answer choices">
      ${displayChoices.map((choice) => {
        const key = choice.key;
        let cls = "answer-button";
        if (state.selectedChoice) {
          if (key === correctKey) cls += " correct";
          else if (key === state.selectedChoice) cls += " wrong";
          else cls += " neutral";
        }
        const label = testMode && !state.selectedChoice ? "Choose answer" : "Answer choice";
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
          <p class="definition-hint">Your wording does not need to be identical. The comparison checks for key ideas, then you choose the final status.</p>
        `}
      </div>
    `;
  }

  function renderOpenResponse(testMode) {
    const placeholder = testMode
      ? "Type your answer. Then show the mark scheme and self-mark."
      : "Type a rough answer here, then reveal the mark-scheme answer.";
    return `<textarea class="open-answer" placeholder="${escapeHtml(placeholder)}"></textarea>`;
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
        if (state.selectedChoice) return;
        state.selectedChoice = button.dataset.choice;
        state.revealed = true;
        const correct = state.selectedChoice === correctDisplayChoice(card).key;
        if (state.mode === "test") {
          recordTestAnswer(card, correct, state.selectedChoice);
          if (correct) celebrate();
          beep(correct);
          renderCard();
          return;
        }
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
      if (state.mode !== "test") setCardStatus(card, "revisit", { advance: false, countAttempt: true });
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
    if (state.mode === "test" && state.test?.answered >= state.deck.length) {
      finishTest();
      return;
    }
    if (state.index >= state.deck.length - 1) {
      if (state.mode === "test") finishTest();
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
        <div><strong>${counts.mastered}</strong><span>mastered</span></div>
        <div><strong>${counts.revisit}</strong><span>revisit</span></div>
        <div><strong>${counts.study}</strong><span>need notes</span></div>
      </div>
      <p>${counts.revisit ? `Recommended next: review your ${counts.revisit} Revisit card${counts.revisit === 1 ? "" : "s"}.` : counts.study ? `Recommended next: open Class Notes for the ${counts.study} card${counts.study === 1 ? "" : "s"} that need notes.` : "Recommended next: test your knowledge when you feel ready."}</p>
      <div class="card-actions">
        ${counts.revisit ? `<button class="primary-button" data-result-action="revisit" type="button">Review revisit cards</button>` : ""}
        ${counts.mastered ? `<button class="secondary-button" data-result-action="test" type="button">Test your knowledge</button>` : ""}
        <button class="secondary-button" data-result-action="hub" type="button">Back to revision hub</button>
      </div>
    `;
    $("[data-result-action='hub']", els.resultPanel)?.addEventListener("click", showHub);
    $("[data-result-action='revisit']", els.resultPanel)?.addEventListener("click", () => startSession("revisit"));
    $("[data-result-action='test']", els.resultPanel)?.addEventListener("click", () => startSession("test"));
  }

  function recordTestAnswer(card, correct, answer) {
    if (!state.test) return;
    const already = state.test.answers.find((item) => item.cardId === card.id);
    if (already) return;
    state.test.answers.push({ cardId: card.id, correct, answer });
    state.test.answered += 1;
    if (correct) state.test.score += 1;
    recordSeen(card, correct);
    if (correct) {
      state.progress.xp = (state.progress.xp || 0) + Math.max(5, (card.level || 1) * 5);
      state.progress.streak = (state.progress.streak || 0) + 1;
      state.progress.bestStreak = Math.max(state.progress.bestStreak || 0, state.progress.streak || 0);
    } else {
      state.progress.streak = 0;
      const revisit = new Set(state.progress.revisitIds || []);
      const mastered = new Set(state.progress.masteredIds || []);
      mastered.delete(card.id);
      revisit.add(card.id);
      state.progress.masteredIds = [...mastered];
      state.progress.revisitIds = [...revisit];
    }
    saveProgress();
  }

  function finishTest() {
    const total = state.deck.length;
    const score = state.test?.score || 0;
    const percent = total ? Math.round((score / total) * 100) : 0;
    const record = {
      date: new Date().toISOString(),
      selection: sessionPositionKey("test"),
      score,
      total,
      percent,
    };
    state.progress.testHistory = [...(state.progress.testHistory || []), record].slice(-20);
    saveProgress();

    els.studyPanel.innerHTML = "";
    els.resultPanel.classList.remove("hidden");
    els.resultPanel.innerHTML = `
      <h2>Test complete</h2>
      <p>You scored <strong>${score}/${total}</strong> (${percent}%).</p>
      <p>${percent === 100 ? "Perfect. Those cards stayed mastered." : "Missed cards were moved into Revisit so they come back later."}</p>
      <div class="card-actions">
        <button class="primary-button" data-result-action="hub" type="button">Back to revision hub</button>
        <button class="secondary-button" data-result-action="again" type="button">Test again</button>
      </div>
    `;
    $("[data-result-action='hub']", els.resultPanel)?.addEventListener("click", showHub);
    $("[data-result-action='again']", els.resultPanel)?.addEventListener("click", () => startSession("test"));
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
      if ((state.selectedMode || 'practice') === 'written') startSession('written', { totalMarks: state.progress.writtenExamMarks || 30 });
      else startSession(state.selectedMode || 'practice');
    });

    $$('[data-written-size]').forEach((button) => {
      button.addEventListener('click', () => {
        const marks = Number(button.dataset.writtenSize || 30);
        state.progress.writtenExamMarks = marks;
        saveProgress();
        state.selectedMode = 'written';
        startSession('written', { totalMarks: marks });
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

  function init() {
    state.sound = state.progress.sound !== false;
    initFilters();
    bindGlobalActions();
    renderStats();
    renderDashboard();
    renderNotesDashboard();
  }

  init();
})();
