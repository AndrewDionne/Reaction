
(() => {
  const content = window.YEAR9_CONTENT || { units: [], cards: [] };
  const cards = Array.isArray(content.cards) ? content.cards : [];
  const units = Array.isArray(content.units) ? content.units : [];
  const learningObjectives = Array.isArray(content.learningObjectives) ? content.learningObjectives : [];
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
      subtitle: "Reveal the answer, then sort each card into Mastered, Revisit, or Study.",
      empty: "No cards match these filters.",
    },
    revisit: {
      eyebrow: "Revisit queue",
      title: "Revisit cards",
      subtitle: "These are the cards you nearly know. Move them to Mastered when they feel secure.",
      empty: "No Revisit cards match these filters yet.",
    },
    study: {
      eyebrow: "Study queue",
      title: "Study cards",
      subtitle: "These are the cards that need slower review before they become Revisit or Mastered.",
      empty: "No Study cards match these filters yet.",
    },
    test: {
      eyebrow: "Focused check",
      title: "Mastery check",
      subtitle: "This checks only cards already marked Mastered. Answers are scored as you go.",
      empty: "No Mastered cards match these filters yet. Mark some cards as Mastered first.",
    },
  };

  const state = {
    mode: "practice",
    deck: [],
    index: 0,
    revealed: false,
    selectedChoice: null,
    test: null,
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

  function objectiveMeta(objectiveId) {
    return learningObjectives.find((objective) => objective.id === objectiveId) || null;
  }

  function objectiveTitle(objectiveId) {
    return objectiveMeta(objectiveId)?.title || objectiveId || "Learning objective";
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

  function setMembership(cardId) {
    return {
      mastered: new Set(state.progress.masteredIds || []).has(cardId),
      revisit: new Set(state.progress.revisitIds || []).has(cardId),
      study: new Set(state.progress.studyIds || []).has(cardId),
    };
  }

  function setCardStatus(card, status) {
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
    recordSeen(card, status === "mastered");
    saveProgress();
    if (state.mode === "revisit" || state.mode === "study" || state.mode === "test") {
      const currentId = card.id;
      rebuildDeck(false);
      const stillHere = state.deck.findIndex((candidate) => candidate.id === currentId);
      if (stillHere >= 0) state.index = stillHere;
      else if (state.index >= state.deck.length) state.index = Math.max(0, state.deck.length - 1);
      if (!state.deck.length) {
        renderSession();
        return;
      }
    }
    nextCard();
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
      unit: els.unitFilter.value || "all",
      objective: els.objectiveFilter?.value || "all",
      type: els.typeFilter.value || "all",
      level: els.levelFilter.value || "all",
      search: (els.searchBox.value || "").trim().toLowerCase(),
    };
  }

  function baseFilteredCards() {
    const f = activeFilters();
    return cards.filter((card) => {
      if (f.unit !== "all" && card.unit !== f.unit) return false;
      if (f.objective !== "all" && card.learningObjective !== f.objective) return false;
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
    els.unitFilter.innerHTML = `<option value="all">All units</option>` + units.map((unit) => `<option value="${escapeHtml(unit.id)}">${escapeHtml(unit.title)}</option>`).join("");
    updateObjectiveOptions();
    const types = unique(cards.map((card) => card.type));
    els.typeFilter.innerHTML = `<option value="all">All card types</option>` + types.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join("");

    [els.unitFilter, els.objectiveFilter, els.typeFilter, els.levelFilter, els.searchBox].filter(Boolean).forEach((el) => {
      el.addEventListener("input", () => {
        if (el === els.unitFilter) updateObjectiveOptions();
        if (els.sessionView.classList.contains("hidden")) {
          renderStats();
          renderDashboard();
        } else {
          rebuildDeck(true);
          renderSession();
        }
      });
    });

    els.shuffleButton.addEventListener("click", () => {
      state.deck = shuffle(cardsForMode("practice"));
      state.index = 0;
      state.mode = "practice";
      startSession("practice", { preserveDeck: true });
    });
  }

  function startSession(mode, options = {}) {
    state.mode = mode;
    state.test = mode === "test" ? { score: 0, answered: 0, answers: [] } : null;
    state.revealed = false;
    state.selectedChoice = null;
    if (!options.preserveDeck) rebuildDeck(true);

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

    els.totalCardCount.textContent = cards.length;
    els.journeyCount.textContent = `${baseFilteredCards().length} cards`;
    els.xpStat.textContent = state.progress.xp || 0;
    els.streakStat.textContent = state.progress.streak || 0;
    els.masteredStat.textContent = mastered.size;
    els.hubMasteredStat.textContent = mastered.size;
    els.revisitStat.textContent = revisit.size;
    els.hubRevisitStat.textContent = revisit.size;
    els.studyStat.textContent = study.size;
    els.hubStudyStat.textContent = study.size;
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
      const objectiveRows = learningObjectives
        .filter((objective) => objective.unit === unit.id)
        .map((objective) => {
          const objectiveCards = unitCards.filter((card) => card.learningObjective === objective.id);
          const objectiveMastered = objectiveCards.filter((card) => mastered.has(card.id)).length;
          const objectivePct = objectiveCards.length ? Math.round((objectiveMastered / objectiveCards.length) * 100) : 0;
          return `<button class="objective-chip" data-objective-start="${escapeHtml(objective.id)}" data-unit-start="${escapeHtml(unit.id)}" type="button"><strong>${escapeHtml(objective.title)}</strong><span>${objectiveCards.length} cards · ${objectivePct}% mastered</span></button>`;
        }).join("");
      return `
        <article class="panel unit-card">
          <div class="card-title-row">
            <span class="pill good">${masteredCount} mastered</span>
            <span class="pill warn">${revisitCount} revisit</span>
            <span class="pill study">${studyCount} study</span>
          </div>
          <h3>${escapeHtml(unit.title)}</h3>
          <p>${escapeHtml(unit.theme)}</p>
          <div class="unit-meta">
            <span class="pill">${unitCards.length} revision cards</span>
            <span class="pill">${pct}% mastered</span>
          </div>
          <div class="progress-track" aria-label="${pct}% mastered"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="objective-list" aria-label="Learning objectives in ${escapeHtml(unit.title)}">
            ${objectiveRows}
          </div>
          <div class="card-actions">
            <button class="secondary-button" data-unit-start="${escapeHtml(unit.id)}" type="button">Revise whole unit</button>
          </div>
        </article>
      `;
    }).join("");

    $$("[data-unit-start]", els.unitDashboard).forEach((button) => {
      button.addEventListener("click", () => {
        els.unitFilter.value = button.dataset.unitStart;
        updateObjectiveOptions();
        if (button.dataset.objectiveStart) els.objectiveFilter.value = button.dataset.objectiveStart;
        else if (!button.classList.contains("objective-chip")) els.objectiveFilter.value = "all";
        startSession("practice");
      });
    });
  }

  function renderSession() {
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

  function renderMedia(card) {
    if (!Array.isArray(card.media) || !card.media.length) return "";
    return `<div class="media-grid">${card.media.map((item) => {
      const src = escapeHtml(item.src || "");
      const alt = escapeHtml(item.alt || card.question || "Diagram");
      const caption = item.caption ? `<figcaption>${escapeHtml(item.caption)}</figcaption>` : "";
      return `<figure class="card-media"><img src="${src}" alt="${alt}" loading="lazy">${caption}</figure>`;
    }).join("")}</div>`;
  }

  function renderObjectivePanel(card) {
    const meta = objectiveMeta(card.learningObjective);
    if (!meta) return "";
    return `
      <aside class="objective-panel">
        <span class="eyebrow">Learning objective</span>
        <strong>${escapeHtml(meta.title)}</strong>
        <p>${escapeHtml(meta.description)}</p>
      </aside>
    `;
  }

  function renderStudyPrompt(card) {
    if (state.mode !== "study") return "";
    const explanation = card.explanation || card.cue || "Read the question, inspect any diagram, reveal the answer, then decide whether this should move to Revisit or Mastered.";
    return `
      <aside class="study-support">
        <strong>Study focus</strong>
        <p>${escapeHtml(explanation)}</p>
        <ul>
          <li>Say the key idea out loud in your own words.</li>
          <li>Use the diagram or source clue if one is shown.</li>
          <li>Move it to Revisit if it is nearly secure, or Mastered if it is confident.</li>
        </ul>
      </aside>
    `;
  }

  function renderCard() {
    const card = state.deck[state.index];
    const isMcq = cardIsMcq(card);
    const membership = setMembership(card.id);
    const testMode = state.mode === "test";

    els.sessionIndex.textContent = String(state.index + 1);
    els.sessionTotal.textContent = `/ ${state.deck.length}`;
    els.resultPanel.classList.add("hidden");

    els.studyPanel.innerHTML = `
      <div class="card-topline">
        <div class="card-title-row">
          <span class="pill">${escapeHtml(unitTitle(card.unit))}</span>
          ${card.learningObjective ? `<span class="pill objective-pill">${escapeHtml(objectiveTitle(card.learningObjective))}</span>` : ""}
          <span class="pill">Level ${card.level}</span>
          <span class="pill">${escapeHtml(card.type)}</span>
          ${card.sourceFidelity ? `<span class="pill ${fidelityClass(card.sourceFidelity)}">${escapeHtml(fidelityLabel(card.sourceFidelity))}</span>` : ""}
          ${membership.mastered ? `<span class="pill good">Mastered</span>` : ""}
          ${membership.revisit ? `<span class="pill warn">Revisit</span>` : ""}
          ${membership.study ? `<span class="pill study">Study</span>` : ""}
        </div>
        <span class="pill">${state.index + 1} / ${state.deck.length}</span>
      </div>

      <article class="study-card">
        ${renderObjectivePanel(card)}
        ${renderStudyPrompt(card)}
        <p class="question-text">${escapeHtml(card.question)}</p>
        ${renderMedia(card)}
        ${card.cue ? `<p class="explanation"><strong>Cue:</strong> ${escapeHtml(card.cue)}</p>` : ""}
        ${isMcq ? renderChoices(card, testMode) : renderOpenResponse(testMode)}
        ${state.revealed ? renderReveal(card) : ""}

        <div class="card-actions">
          ${!state.revealed && !testMode ? `<button class="primary-button" data-action="reveal" type="button">Reveal answer</button>` : ""}
          ${!isMcq && testMode && !state.revealed ? `<button class="primary-button" data-action="test-open-submit" type="button">Show mark scheme</button>` : ""}
          ${!isMcq && testMode && state.revealed ? `<button class="primary-button" data-action="test-right" type="button">Mark right</button><button class="danger-button" data-action="test-wrong" type="button">Mark wrong</button>` : ""}
          <button class="secondary-button" data-action="read" type="button">Read aloud</button>
          <button class="secondary-button" data-action="prev" type="button">Previous</button>
          <button class="secondary-button" data-action="next" type="button">Skip</button>
        </div>

        ${!testMode ? `
          <div class="state-actions" aria-label="Learning state">
            <button class="primary-button" data-state="mastered" type="button">I know this · Mastered</button>
            <button class="secondary-button" data-state="revisit" type="button">Come back · Revisit</button>
            <button class="secondary-button" data-state="study" type="button">Need help · Study</button>
          </div>
        ` : ""}

        <p class="source-note">Source: ${escapeHtml(card.source || "Year 9 content pack")}</p>
      </article>
    `;

    bindCardActions(card);
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
        } else {
          recordSeen(card, correct);
          saveProgress();
        }
        if (correct) {
          celebrate();
          beep(true);
        } else {
          beep(false);
        }
        renderCard();
      });
    });

    $$("[data-state]", els.studyPanel).forEach((button) => {
      button.addEventListener("click", () => setCardStatus(card, button.dataset.state));
    });

    $$("[data-action]", els.studyPanel).forEach((button) => {
      button.addEventListener("click", () => handleAction(button.dataset.action, card));
    });
  }

  function handleAction(action, card) {
    if (action === "reveal") {
      state.revealed = true;
      renderCard();
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
      else state.index = 0;
    } else {
      state.index += 1;
    }
    state.revealed = false;
    state.selectedChoice = null;
    renderSession();
  }

  function prevCard() {
    if (!state.deck.length) return;
    state.index = (state.index - 1 + state.deck.length) % state.deck.length;
    state.revealed = false;
    state.selectedChoice = null;
    renderSession();
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
      <h2>Mastery check complete</h2>
      <p>You scored <strong>${score}/${total}</strong> (${percent}%).</p>
      <p>${percent === 100 ? "Perfect. Those cards stayed mastered." : "Missed cards were moved into Revisit so they come back later."}</p>
      <div class="card-actions">
        <button class="primary-button" data-result-action="hub" type="button">Back to revision hub</button>
        <button class="secondary-button" data-result-action="again" type="button">Run another check</button>
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
    $$("[data-start-mode]").forEach((button) => {
      button.addEventListener("click", () => startSession(button.dataset.startMode));
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
  }

  init();
})();
