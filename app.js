
(() => {
  const content = window.YEAR9_CONTENT || { units: [], cards: [] };
  const cards = Array.isArray(content.cards) ? content.cards : [];
  const units = Array.isArray(content.units) ? content.units : [];
  const learningObjectives = Array.isArray(content.learningObjectives) ? content.learningObjectives : [];
  const notesBundle = window.YEAR9_NOTES || { notes: [] };
  const classNotes = Array.isArray(notesBundle.notes) ? notesBundle.notes : [];
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
    test: null,
    session: null,
    noteContext: null,
    definitionInput: "",
    definitionCompared: false,
    definitionReview: null,
    sound: true,
    progress: loadProgress(),
  };

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

  function saveProgress() {
    state.progress.updatedAt = new Date().toISOString();
    state.progress.sound = state.sound;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
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

  function unitGraphic(unitId) {
    return unitGraphicMap[unitId] || "";
  }

  function modeEntryText(mode = state.selectedMode) {
    if (mode === "revisit") return "Revisit your studies";
    if (mode === "test") return "Test your knowledge";
    return "Start revision";
  }

  function modeReadyCount(mode = state.selectedMode) {
    return cardsForMode(mode).length;
  }

  function modeLabel(mode = state.selectedMode) {
    if (mode === "revisit") return "Revisit";
    if (mode === "test") return "Test your knowledge";
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

  function choiceText(card, answer = card.answer) {
    const prefix = `${answer} `;
    const match = (card.choices || []).find((choice) => choice.startsWith(prefix));
    return match ? match.slice(prefix.length) : String(answer || "");
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
    const { advance = true, countAttempt = true } = options;
    const mastered = new Set(state.progress.masteredIds || []);
    const revisit = new Set(state.progress.revisitIds || []);
    const study = new Set(state.progress.studyIds || []);

    mastered.delete(card.id);
    revisit.delete(card.id);
    study.delete(card.id);

    if (status === "mastered") {
      mastered.add(card.id);
      state.progress.xp = (state.progress.xp || 0) + Math.max(5, (card.level || 1) * 5);
      state.progress.streak = (state.progress.streak || 0) + 1;
      state.progress.bestStreak = Math.max(state.progress.bestStreak || 0, state.progress.streak || 0);
      celebrate();
      beep(true);
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
    if (countAttempt) recordSeen(card, status === "mastered");
    recordSessionStatus(card, status);
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
    return base;
  }

  function rebuildDeck(resetIndex = true) {
    state.deck = cardsForMode();
    if (resetIndex || state.index >= state.deck.length) state.index = 0;
    state.revealed = false;
    state.selectedChoice = null;
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
    state.revealed = false;
    state.selectedChoice = null;
    if (!options.preserveDeck) rebuildDeck(true);
    if (mode !== "test") startSessionTracker(mode);

    els.hubView.classList.add("hidden");
    els.sessionView.classList.remove("hidden");
    els.resultPanel.classList.add("hidden");
    renderSession();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showHub() {
    els.sessionView.classList.add("hidden");
    els.hubView.classList.remove("hidden");
    state.test = null;
    state.session = null;
    state.noteContext = null;
    state.revealed = false;
    state.selectedChoice = null;
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
      els.routeEntryButton.textContent = `${modeEntryText()} (${ready})`;
      els.routeEntryButton.disabled = ready === 0;
    }
    if (els.selectionSummary) {
      const unitCount = state.selectedUnits.size;
      const objectiveCount = state.selectedObjectives.size;
      if (!unitCount && !objectiveCount) els.selectionSummary.textContent = `Selected revision set: all units · ${ready} card${ready === 1 ? "" : "s"}`;
      else els.selectionSummary.textContent = `Selected revision set: ${unitCount || "all"} unit${unitCount === 1 ? "" : "s"} · ${objectiveCount} sub-unit${objectiveCount === 1 ? "" : "s"} · ${ready} card${ready === 1 ? "" : "s"}`;
    }
    if (els.selectionDetail) {
      els.selectionDetail.textContent = `Mode: ${modeLabel()}. Select more units or sub-units below, then use the main button to begin.`;
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
  }


  function renderNotesDashboard() {
    return;
  }

  function openNoteContext(noteId, cardId = null) {
    state.noteContext = { noteId, cardId };
    state.test = null;
    state.revealed = false;
    state.selectedChoice = null;
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
    els.sessionEyebrow.textContent = sourceCard ? "Study this concept" : "Class notes";
    els.sessionTitle.textContent = note.title;
    els.sessionSubtitle.textContent = sourceCard ? "Read the context, then decide what to do with the original card." : "Use this note to review the topic, then practise the linked cards.";
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
    if (state.noteContext) {
      renderNoteContext();
      return;
    }
    const text = modeText[state.mode] || modeText.practice;
    els.sessionEyebrow.textContent = text.eyebrow;
    els.sessionTitle.textContent = text.title;
    els.sessionSubtitle.textContent = text.subtitle;
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

  function renderMediaItems(items, fallbackAlt = "Study image", className = "media-grid") {
    if (!Array.isArray(items) || !items.length) return "";
    return `<div class="${className}">${items.map((item) => {
      const src = escapeHtml(item.src || "");
      const alt = escapeHtml(item.alt || fallbackAlt || "Study image");
      const caption = item.caption ? `<figcaption>${escapeHtml(item.caption)}</figcaption>` : "";
      return `<figure class="card-media"><img src="${src}" alt="${alt}" loading="lazy">${caption}</figure>`;
    }).join("")}</div>`;
  }

  function renderMedia(card) {
    if (!Array.isArray(card.media) || !card.media.length) return "";
    const questionMedia = card.media.filter((item) => !item.mediaTiming || item.mediaTiming === "question");
    return renderMediaItems(questionMedia, card.question || "Diagram");
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

  function renderCard() {
    const card = state.deck[state.index];
    const isMcq = cardIsMcq(card);
    const isDefinition = cardIsDefinition(card);
    const membership = setMembership(card.id);
    const testMode = state.mode === "test";
    const fidelityText = card.sourceFidelity ? fidelityLabel(card.sourceFidelity) : "";

    els.sessionIndex.textContent = String(state.index + 1);
    els.sessionTotal.textContent = `/ ${state.deck.length}`;
    els.resultPanel.classList.add("hidden");

    els.studyPanel.innerHTML = `
      <article class="study-card">
        <div class="card-topline card-topline-clean">
          <div class="card-title-row">
            <span class="pill">${escapeHtml(unitTitle(card.unit))}</span>
            ${card.learningObjective ? `<span class="pill objective-pill">${escapeHtml(objectiveTitle(card.learningObjective))}</span>` : ""}
            <span class="pill">Level ${card.level}</span>
            <span class="pill">${escapeHtml(card.type)}</span>
            ${membership.mastered ? `<span class="pill good">mastered</span>` : ""}
            ${membership.revisit ? `<span class="pill warn">revisit</span>` : ""}
            ${membership.study ? `<span class="pill study">need notes</span>` : ""}
          </div>
          <span class="pill progress-pill">${state.index + 1} / ${state.deck.length}</span>
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
          ${isMcq && state.selectedChoice ? `<button class="primary-button" data-action="next" type="button">Next card</button>` : ""}
          <button class="secondary-button" data-action="prev" type="button">Previous</button>
          ${!(isMcq && state.selectedChoice) ? `<button class="secondary-button" data-action="next" type="button">Skip</button>` : ""}
          ${!testMode ? `<button class="secondary-button class-notes-button" data-action="study-context" type="button">Class Notes</button>` : ""}
        </div>

        ${!testMode && (!isDefinition || state.definitionCompared) && !(isMcq && state.selectedChoice) ? `
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
    const correct = state.selectedChoice === card.answer;
    return `
      <div class="choice-feedback ${correct ? "good" : "needs-review"}">
        <strong>${correct ? "Correct — moved to Mastered." : "Not quite — moved to Revisit."}</strong>
        <p>The answer is <strong>${escapeHtml(card.answer)} — ${escapeHtml(choiceText(card))}</strong>.</p>
        ${card.explanation ? `<p>${escapeHtml(card.explanation)}</p>` : ""}
      </div>
    `;
  }

  function renderChoices(card, testMode) {
    return `<div class="answer-grid" role="group" aria-label="Answer choices">
      ${card.choices.map((choice) => {
        const key = choice.trim().slice(0, 1);
        let cls = "answer-button";
        if (state.selectedChoice) {
          if (key === card.answer) cls += " correct";
          else if (key === state.selectedChoice) cls += " wrong";
          else cls += " neutral";
        }
        const label = testMode && !state.selectedChoice ? "Choose answer" : "Answer choice";
        return `<button class="${cls}" data-choice="${escapeHtml(key)}" type="button" aria-label="${label}: ${escapeHtml(choice)}">${escapeHtml(choice)}</button>`;
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
    const answerLine = cardIsMcq(card) ? `${card.answer} — ${choiceText(card)}` : card.answer;
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
        const correct = state.selectedChoice === card.answer;
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
    state.revealed = false;
    state.selectedChoice = null;
    state.definitionInput = "";
    state.definitionCompared = false;
    state.definitionReview = null;
    renderSession();
  }

  function prevCard() {
    if (!state.deck.length) return;
    state.index = (state.index - 1 + state.deck.length) % state.deck.length;
    state.revealed = false;
    state.selectedChoice = null;
    state.definitionInput = "";
    state.definitionCompared = false;
    state.definitionReview = null;
    renderSession();
  }

  function finishSession() {
    const counts = sessionStatusCounts();
    const total = state.deck.length;
    els.studyPanel.innerHTML = "";
    els.resultPanel.classList.remove("hidden");
    els.sessionEyebrow.textContent = "Session complete";
    els.sessionTitle.textContent = "Revision session complete";
    els.sessionSubtitle.textContent = "Use the summary to choose what to practise next.";
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
      revisit.add(card.id);
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
      unit: activeFilters().unit,
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

    els.routeEntryButton?.addEventListener('click', () => startSession(state.selectedMode || 'practice'));

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
