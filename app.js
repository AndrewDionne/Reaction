(() => {
  const content = window.YEAR9_CONTENT || { units: [], cards: [] };
  const cards = Array.isArray(content.cards) ? content.cards : [];
  const units = Array.isArray(content.units) ? content.units : [];
  const STORAGE_KEY = "year9-science-study-progress-v1";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const byId = (id) => document.getElementById(id);

  const els = {
    modeButtons: $$(".mode-button"),
    filtersPanel: byId("filtersPanel"),
    unitFilter: byId("unitFilter"),
    typeFilter: byId("typeFilter"),
    levelFilter: byId("levelFilter"),
    searchBox: byId("searchBox"),
    shuffleButton: byId("shuffleButton"),
    unitDashboard: byId("unitDashboard"),
    studyPanel: byId("studyPanel"),
    bossSetupPanel: byId("bossSetupPanel"),
    resultPanel: byId("resultPanel"),
    totalCardCount: byId("totalCardCount"),
    xpStat: byId("xpStat"),
    streakStat: byId("streakStat"),
    masteredStat: byId("masteredStat"),
    weakStat: byId("weakStat"),
    soundToggle: byId("soundToggle"),
    exportProgress: byId("exportProgress"),
    importProgressFile: byId("importProgressFile"),
    canvas: byId("burstCanvas"),
  };

  const state = {
    mode: "practice",
    deck: [],
    index: 0,
    revealed: false,
    selectedChoice: null,
    boss: null,
    sound: true,
    progress: loadProgress(),
  };

  function defaultProgress() {
    const unlocked = {};
    units.forEach((unit) => { unlocked[unit.id] = 1; });
    unlocked.all = 1;
    return {
      xp: 0,
      streak: 0,
      bestStreak: 0,
      mastered: [],
      weakIds: [],
      attempts: {},
      bossHistory: [],
      unlockedLevels: unlocked,
      updatedAt: new Date().toISOString(),
    };
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultProgress();
      const parsed = JSON.parse(raw);
      return { ...defaultProgress(), ...parsed, unlockedLevels: { ...defaultProgress().unlockedLevels, ...(parsed.unlockedLevels || {}) } };
    } catch (error) {
      console.warn("Could not load progress", error);
      return defaultProgress();
    }
  }

  function saveProgress() {
    state.progress.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
    renderStats();
    renderDashboard();
  }

  function unique(values) {
    return [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)));
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function choiceText(card, answer = card.answer) {
    const prefix = `${answer} `;
    const match = (card.choices || []).find((choice) => choice.startsWith(prefix));
    return match ? match.slice(prefix.length) : answer;
  }

  function unitTitle(unitId) {
    return units.find((unit) => unit.id === unitId)?.title || unitId;
  }

  function cardIsMcq(card) {
    return Array.isArray(card.choices) && card.choices.length >= 2 && /^[A-Z]$/.test(String(card.answer || ""));
  }

  function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function activeFilters() {
    return {
      unit: els.unitFilter.value || "all",
      type: els.typeFilter.value || "all",
      level: els.levelFilter.value || "all",
      search: (els.searchBox.value || "").trim().toLowerCase(),
    };
  }

  function filteredCards({ mcqOnly = false, weakOnly = false } = {}) {
    const f = activeFilters();
    const weakSet = new Set(state.progress.weakIds || []);
    return cards.filter((card) => {
      if (mcqOnly && !cardIsMcq(card)) return false;
      if (weakOnly && !weakSet.has(card.id)) return false;
      if (f.unit !== "all" && card.unit !== f.unit) return false;
      if (f.type !== "all" && card.type !== f.type) return false;
      if (f.level !== "all" && String(card.level) !== f.level) return false;
      if (f.search) {
        const haystack = [card.question, card.answer, card.explanation, card.source, ...(card.choices || [])].join(" ").toLowerCase();
        if (!haystack.includes(f.search)) return false;
      }
      return true;
    });
  }

  function currentDeck() {
    if (state.mode === "quiz") return filteredCards({ mcqOnly: true });
    if (state.mode === "weak") return filteredCards({ weakOnly: true });
    return filteredCards();
  }

  function rebuildDeck(resetIndex = true) {
    state.deck = currentDeck();
    if (resetIndex || state.index >= state.deck.length) state.index = 0;
    state.revealed = false;
    state.selectedChoice = null;
  }

  function initFilters() {
    els.unitFilter.innerHTML = `<option value="all">All units</option>` + units.map((unit) => `<option value="${unit.id}">${escapeHtml(unit.title)}</option>`).join("");
    const types = unique(cards.map((card) => card.type));
    els.typeFilter.innerHTML = `<option value="all">All card types</option>` + types.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join("");
    [els.unitFilter, els.typeFilter, els.levelFilter, els.searchBox].forEach((el) => {
      el.addEventListener("input", () => {
        rebuildDeck(true);
        render();
      });
    });
    els.shuffleButton.addEventListener("click", () => {
      state.deck = shuffle(currentDeck());
      state.index = 0;
      state.revealed = false;
      state.selectedChoice = null;
      renderStudy();
    });
  }

  function setMode(mode) {
    if (state.boss?.active) {
      const leave = confirm("Bail out of this boss round? Your current unsaved score will be lost.");
      if (!leave) return;
      state.boss = null;
    }
    state.mode = mode;
    state.revealed = false;
    state.selectedChoice = null;
    els.modeButtons.forEach((button) => button.classList.toggle("active", button.dataset.mode === mode));
    els.filtersPanel.classList.toggle("hidden", mode === "boss");
    els.bossSetupPanel.classList.toggle("hidden", mode !== "boss");
    els.studyPanel.classList.toggle("hidden", false);
    els.resultPanel.classList.add("hidden");
    if (mode === "boss") {
      renderBossSetup();
    } else {
      rebuildDeck(true);
      renderStudy();
    }
    renderDashboard();
  }

  function renderStats() {
    els.totalCardCount.textContent = cards.length;
    els.xpStat.textContent = state.progress.xp || 0;
    els.streakStat.textContent = state.progress.streak || 0;
    els.masteredStat.textContent = (state.progress.mastered || []).length;
    els.weakStat.textContent = (state.progress.weakIds || []).length;
  }

  function renderDashboard() {
    const mastered = new Set(state.progress.mastered || []);
    const weak = new Set(state.progress.weakIds || []);
    els.unitDashboard.innerHTML = units.map((unit) => {
      const unitCards = cards.filter((card) => card.unit === unit.id);
      const done = unitCards.filter((card) => mastered.has(card.id)).length;
      const weakCount = unitCards.filter((card) => weak.has(card.id)).length;
      const pct = unitCards.length ? Math.round((done / unitCards.length) * 100) : 0;
      const unlocked = state.progress.unlockedLevels?.[unit.id] || 1;
      return `
        <article class="panel unit-card">
          <div class="card-title-row">
            <span class="pill good">Level ${unlocked} unlocked</span>
            ${weakCount ? `<span class="pill warn">${weakCount} weak</span>` : `<span class="pill">clean</span>`}
          </div>
          <h3>${escapeHtml(unit.title)}</h3>
          <p>${escapeHtml(unit.theme)}</p>
          <div class="unit-meta">
            <span class="pill">${unitCards.length} cards</span>
            <span class="pill">${pct}% mastered</span>
          </div>
          <div class="progress-track" aria-label="${pct}% mastered"><div class="progress-fill" style="width:${pct}%"></div></div>
        </article>
      `;
    }).join("");
  }

  function renderStudy() {
    els.bossSetupPanel.classList.toggle("hidden", state.mode !== "boss");
    els.resultPanel.classList.add("hidden");
    if (state.mode === "boss") {
      if (state.boss?.active) renderBossQuestion();
      else renderBossSetup();
      return;
    }

    const deck = state.deck;
    if (!deck.length) {
      const weakText = state.mode === "weak" ? "No weak cards match these filters. Missed cards appear here after saved quiz or boss attempts." : "No cards match these filters.";
      els.studyPanel.innerHTML = `<div class="empty-state"><h2>Nothing to show</h2><p>${escapeHtml(weakText)}</p></div>`;
      return;
    }
    const card = deck[state.index];
    const isMcq = cardIsMcq(card);
    const modeLabel = state.mode === "quiz" ? "Quick quiz" : state.mode === "weak" ? "Weak review" : "Practice";
    els.studyPanel.innerHTML = `
      <div class="card-topline">
        <div class="card-title-row">
          <span class="pill">${escapeHtml(modeLabel)}</span>
          <span class="pill">${escapeHtml(unitTitle(card.unit))}</span>
          <span class="pill">Level ${card.level}</span>
          <span class="pill">${escapeHtml(card.type)}</span>
        </div>
        <span class="card-count">${state.index + 1} / ${deck.length}</span>
      </div>
      <article class="study-card">
        <p class="question-text">${escapeHtml(card.question)}</p>
        ${card.cue ? `<p class="explanation"><strong>Cue:</strong> ${escapeHtml(card.cue)}</p>` : ""}
        ${isMcq ? renderChoices(card) : renderOpenResponse(card)}
        ${state.revealed ? renderReveal(card) : ""}
        <div class="card-actions">
          ${!state.revealed ? `<button class="primary-button" data-action="reveal" type="button">Reveal answer</button>` : ""}
          ${!isMcq && state.revealed ? `<button class="primary-button" data-action="self-correct" type="button">I got it right</button><button class="danger-button" data-action="self-wrong" type="button">I missed it</button>` : ""}
          <button class="secondary-button" data-action="read" type="button">Read aloud</button>
          <button class="secondary-button" data-action="prev" type="button">Previous</button>
          <button class="primary-button" data-action="next" type="button">Next</button>
        </div>
        <p class="source-note">Source: ${escapeHtml(card.source || "Year 9 content pack")}</p>
      </article>
    `;
    bindStudyActions(card);
  }

  function renderChoices(card) {
    return `<div class="answer-grid" role="group" aria-label="Answer choices">
      ${card.choices.map((choice) => {
        const key = choice.trim().slice(0, 1);
        let cls = "answer-button";
        if (state.selectedChoice) {
          if (key === card.answer) cls += " correct";
          else if (key === state.selectedChoice) cls += " wrong";
          else cls += " neutral";
        }
        return `<button class="${cls}" data-choice="${escapeHtml(key)}" type="button">${escapeHtml(choice)}</button>`;
      }).join("")}
    </div>`;
  }

  function renderOpenResponse() {
    return `<textarea class="open-answer" placeholder="Type a rough answer here, then reveal the mark-scheme answer."></textarea>`;
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

  function bindStudyActions(card) {
    $$("[data-choice]", els.studyPanel).forEach((button) => {
      button.addEventListener("click", () => {
        if (state.selectedChoice) return;
        state.selectedChoice = button.dataset.choice;
        state.revealed = true;
        const correct = state.selectedChoice === card.answer;
        recordAttempt(card, correct, { saveImmediately: true });
        if (correct) celebrate();
        beep(correct);
        renderStudy();
      });
    });
    $$("[data-action]", els.studyPanel).forEach((button) => {
      button.addEventListener("click", () => handleStudyAction(button.dataset.action, card));
    });
  }

  function handleStudyAction(action, card) {
    if (action === "reveal") {
      state.revealed = true;
      renderStudy();
      return;
    }
    if (action === "self-correct") {
      recordAttempt(card, true, { saveImmediately: true });
      celebrate();
      beep(true);
      nextCard();
      return;
    }
    if (action === "self-wrong") {
      recordAttempt(card, false, { saveImmediately: true });
      beep(false);
      nextCard();
      return;
    }
    if (action === "next") nextCard();
    if (action === "prev") prevCard();
    if (action === "read") speak(`${card.question}. ${state.revealed ? card.answer : ""}`);
  }

  function nextCard() {
    if (!state.deck.length) return;
    state.index = (state.index + 1) % state.deck.length;
    state.revealed = false;
    state.selectedChoice = null;
    renderStudy();
  }

  function prevCard() {
    if (!state.deck.length) return;
    state.index = (state.index - 1 + state.deck.length) % state.deck.length;
    state.revealed = false;
    state.selectedChoice = null;
    renderStudy();
  }

  function recordAttempt(card, correct, { saveImmediately = false } = {}) {
    const attempts = state.progress.attempts || {};
    const current = attempts[card.id] || { seen: 0, correct: 0, wrong: 0 };
    current.seen += 1;
    if (correct) current.correct += 1;
    else current.wrong += 1;
    attempts[card.id] = current;
    state.progress.attempts = attempts;

    const weak = new Set(state.progress.weakIds || []);
    const mastered = new Set(state.progress.mastered || []);
    if (correct) {
      weak.delete(card.id);
      mastered.add(card.id);
      state.progress.xp = (state.progress.xp || 0) + (card.level || 1) * 5;
      state.progress.streak = (state.progress.streak || 0) + 1;
      state.progress.bestStreak = Math.max(state.progress.bestStreak || 0, state.progress.streak || 0);
    } else {
      weak.add(card.id);
      state.progress.streak = 0;
    }
    state.progress.weakIds = [...weak];
    state.progress.mastered = [...mastered];
    if (saveImmediately) saveProgress();
  }

  function renderBossSetup() {
    state.boss = state.boss?.active ? state.boss : null;
    const history = state.progress.bossHistory || [];
    const rows = history.slice(-6).reverse().map((h) => `
      <tr><td>${escapeHtml(h.date.slice(0, 10))}</td><td>${escapeHtml(h.unit === "all" ? "All units" : unitTitle(h.unit))}</td><td>Level ${h.level}</td><td>${h.score}/${h.total}</td><td>${h.percent}%</td></tr>
    `).join("");
    els.studyPanel.innerHTML = `<div class="empty-state"><h2>Boss mode is locked-in testing.</h2><p>Choose a unit and level, press “Let’s go!”, then complete the test without changing filters. A perfect saved score unlocks the next level.</p></div>`;
    els.bossSetupPanel.innerHTML = `
      <h2>Boss mode setup</h2>
      <p class="explanation">This is the strict test route: no browsing, no answer reveal until submitted, and bail-out asks for confirmation.</p>
      <div class="boss-controls">
        <label>Unit
          <select id="bossUnitSelect">
            <option value="all">All units</option>
            ${units.map((unit) => `<option value="${unit.id}">${escapeHtml(unit.title)}</option>`).join("")}
          </select>
        </label>
        <label>Level
          <select id="bossLevelSelect">${[1,2,3,4,5].map((level) => `<option value="${level}">Level ${level}</option>`).join("")}</select>
        </label>
        <label>Length
          <select id="bossLengthSelect">
            <option value="8">8 questions</option>
            <option value="12" selected>12 questions</option>
            <option value="20">20 questions</option>
          </select>
        </label>
        <button class="primary-button" id="startBossButton" type="button">Let’s go!</button>
      </div>
      <p class="boss-warning" id="bossLockNote"></p>
      ${history.length ? `<h3>Recent saved boss scores</h3><table class="history-table"><thead><tr><th>Date</th><th>Unit</th><th>Level</th><th>Score</th><th>%</th></tr></thead><tbody>${rows}</tbody></table>` : ""}
    `;
    const unitSelect = byId("bossUnitSelect");
    const levelSelect = byId("bossLevelSelect");
    const updateLockNote = () => {
      const unit = unitSelect.value;
      const unlocked = state.progress.unlockedLevels?.[unit] || 1;
      [...levelSelect.options].forEach((option) => { option.disabled = Number(option.value) > unlocked; });
      if (Number(levelSelect.value) > unlocked) levelSelect.value = String(unlocked);
      byId("bossLockNote").textContent = `Unlocked for ${unit === "all" ? "All units" : unitTitle(unit)}: Level ${unlocked}. Get 100% on a saved boss round to unlock the next level.`;
    };
    unitSelect.addEventListener("change", updateLockNote);
    levelSelect.addEventListener("change", updateLockNote);
    byId("startBossButton").addEventListener("click", startBoss);
    updateLockNote();
  }

  function bossPool(unit, level) {
    return cards.filter((card) => {
      if (unit !== "all" && card.unit !== unit) return false;
      if (card.level > Number(level)) return false;
      return true;
    });
  }

  function startBoss() {
    const unit = byId("bossUnitSelect").value;
    const level = Number(byId("bossLevelSelect").value || 1);
    const length = Number(byId("bossLengthSelect").value || 12);
    const unlocked = state.progress.unlockedLevels?.[unit] || 1;
    if (level > unlocked) {
      alert("That boss level is still locked.");
      return;
    }
    const pool = bossPool(unit, level);
    if (!pool.length) {
      alert("No cards available for that boss setup.");
      return;
    }
    const weakSet = new Set(state.progress.weakIds || []);
    const currentLevel = pool.filter((card) => card.level === level);
    const weakCurrent = currentLevel.filter((card) => weakSet.has(card.id));
    const freshCurrent = currentLevel.filter((card) => !weakSet.has(card.id));
    const weakLower = pool.filter((card) => card.level < level && weakSet.has(card.id));
    const freshLower = pool.filter((card) => card.level < level && !weakSet.has(card.id));
    const weighted = [...shuffle(weakCurrent), ...shuffle(freshCurrent), ...shuffle(weakLower), ...shuffle(freshLower)];
    const deck = weighted.slice(0, Math.min(length, weighted.length));
    state.boss = {
      active: true,
      unit,
      level,
      deck,
      index: 0,
      answers: [],
      selectedChoice: null,
      typedAnswer: "",
      submitted: false,
      startedAt: new Date().toISOString(),
    };
    els.bossSetupPanel.classList.add("hidden");
    els.resultPanel.classList.add("hidden");
    renderBossQuestion();
  }

  function renderBossQuestion() {
    const boss = state.boss;
    if (!boss?.active) return renderBossSetup();
    const card = boss.deck[boss.index];
    const isMcq = cardIsMcq(card);
    els.studyPanel.innerHTML = `
      <div class="boss-screen">
        <div class="card-topline">
          <div class="card-title-row">
            <span class="pill warn">Boss mode</span>
            <span class="pill">${escapeHtml(boss.unit === "all" ? "All units" : unitTitle(boss.unit))}</span>
            <span class="pill">Level ${boss.level}</span>
            <span class="pill">${escapeHtml(card.type)}</span>
          </div>
          <span class="card-count">${boss.index + 1} / ${boss.deck.length}</span>
        </div>
        <article class="study-card">
          <p class="question-text">${escapeHtml(card.question)}</p>
          ${isMcq ? renderBossChoices(card) : `<textarea class="open-answer" id="bossTypedAnswer" placeholder="Type your answer. You will self-mark against the mark scheme after submitting.">${escapeHtml(boss.typedAnswer || "")}</textarea>`}
          ${boss.submitted ? renderReveal(card) : ""}
          <div class="card-actions">
            ${isMcq ? "" : boss.submitted ? `<button class="primary-button" data-boss-action="self-correct" type="button">Mark right</button><button class="danger-button" data-boss-action="self-wrong" type="button">Mark wrong</button>` : `<button class="primary-button" data-boss-action="submit-open" type="button">Submit answer</button>`}
            <button class="secondary-button" data-boss-action="read" type="button">Read aloud</button>
            <button class="danger-button" data-boss-action="bail" type="button">Bail out</button>
          </div>
          <p class="source-note">Source: ${escapeHtml(card.source || "Year 9 content pack")}</p>
        </article>
      </div>
    `;
    if (!isMcq && !boss.submitted) {
      byId("bossTypedAnswer")?.addEventListener("input", (event) => { boss.typedAnswer = event.target.value; });
    }
    $$("[data-boss-choice]", els.studyPanel).forEach((button) => {
      button.addEventListener("click", () => answerBossMcq(button.dataset.bossChoice));
    });
    $$("[data-boss-action]", els.studyPanel).forEach((button) => {
      button.addEventListener("click", () => handleBossAction(button.dataset.bossAction, card));
    });
  }

  function renderBossChoices(card) {
    return `<div class="answer-grid" role="group" aria-label="Boss answer choices">
      ${card.choices.map((choice) => {
        const key = choice.trim().slice(0, 1);
        return `<button class="answer-button" data-boss-choice="${escapeHtml(key)}" type="button">${escapeHtml(choice)}</button>`;
      }).join("")}
    </div>`;
  }

  function answerBossMcq(choice) {
    const boss = state.boss;
    const card = boss.deck[boss.index];
    const correct = choice === card.answer;
    boss.answers.push({ cardId: card.id, correct, choice, unit: card.unit });
    beep(correct);
    if (correct) celebrate();
    advanceBoss();
  }

  function handleBossAction(action, card) {
    const boss = state.boss;
    if (action === "bail") {
      if (confirm("Are you sure? This boss attempt will not be saved.")) {
        state.boss = null;
        els.bossSetupPanel.classList.remove("hidden");
        renderBossSetup();
      }
      return;
    }
    if (action === "read") speak(card.question);
    if (action === "submit-open") {
      boss.submitted = true;
      renderBossQuestion();
    }
    if (action === "self-correct" || action === "self-wrong") {
      const correct = action === "self-correct";
      boss.answers.push({ cardId: card.id, correct, typed: boss.typedAnswer, unit: card.unit });
      beep(correct);
      if (correct) celebrate();
      advanceBoss();
    }
  }

  function advanceBoss() {
    const boss = state.boss;
    boss.index += 1;
    boss.selectedChoice = null;
    boss.typedAnswer = "";
    boss.submitted = false;
    if (boss.index >= boss.deck.length) renderBossResult();
    else renderBossQuestion();
  }

  function renderBossResult() {
    const boss = state.boss;
    const score = boss.answers.filter((answer) => answer.correct).length;
    const total = boss.deck.length;
    const percent = total ? Math.round((score / total) * 100) : 0;
    els.studyPanel.innerHTML = "";
    els.resultPanel.classList.remove("hidden");
    els.resultPanel.style.setProperty("--score", `${percent}%`);
    els.resultPanel.innerHTML = `
      <h2>Boss round complete</h2>
      <div class="score-ring"><span>${percent}%</span></div>
      <p class="explanation">Score: <strong>${score}/${total}</strong>. Save the score to update level progress, mastered cards and weak-review cards. Or choose “forget this ever happened” to discard the attempt.</p>
      <div class="card-actions" style="justify-content:center">
        <button class="primary-button" id="saveBossScore" type="button">Save score</button>
        <button class="danger-button" id="forgetBossScore" type="button">Forget this ever happened</button>
      </div>
      ${percent === 100 && boss.level < 5 ? `<p class="boss-warning">Perfect score. Saving will unlock Level ${boss.level + 1}.</p>` : ""}
    `;
    byId("saveBossScore").addEventListener("click", saveBossResult);
    byId("forgetBossScore").addEventListener("click", () => {
      state.boss = null;
      els.resultPanel.classList.add("hidden");
      els.bossSetupPanel.classList.remove("hidden");
      renderBossSetup();
    });
  }

  function saveBossResult() {
    const boss = state.boss;
    const answerMap = new Map(boss.answers.map((answer) => [answer.cardId, answer.correct]));
    boss.deck.forEach((card) => recordAttempt(card, Boolean(answerMap.get(card.id)), { saveImmediately: false }));
    const score = boss.answers.filter((answer) => answer.correct).length;
    const total = boss.deck.length;
    const percent = total ? Math.round((score / total) * 100) : 0;
    state.progress.bossHistory = [...(state.progress.bossHistory || []), {
      date: new Date().toISOString(),
      unit: boss.unit,
      level: boss.level,
      score,
      total,
      percent,
    }].slice(-40);
    if (percent === 100 && boss.level < 5) {
      const current = state.progress.unlockedLevels?.[boss.unit] || 1;
      state.progress.unlockedLevels[boss.unit] = Math.max(current, boss.level + 1);
    }
    saveProgress();
    state.boss = null;
    els.resultPanel.classList.add("hidden");
    els.bossSetupPanel.classList.remove("hidden");
    renderBossSetup();
  }

  function speak(text) {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.92;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  }

  function beep(correct) {
    if (!state.sound) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = correct ? "triangle" : "sawtooth";
      osc.frequency.value = correct ? 660 : 180;
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (error) {
      console.warn("Audio unavailable", error);
    }
  }

  function celebrate() {
    const canvas = els.canvas;
    const ctx = canvas.getContext("2d");
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    ctx.scale(ratio, ratio);
    const particles = Array.from({ length: 42 }, () => ({
      x: window.innerWidth * (0.35 + Math.random() * 0.3),
      y: window.innerHeight * (0.25 + Math.random() * 0.2),
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.9) * 8,
      life: 50 + Math.random() * 20,
      r: 3 + Math.random() * 5,
    }));
    let frame = 0;
    function draw() {
      frame += 1;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18;
        p.life -= 1;
        ctx.globalAlpha = Math.max(p.life / 70, 0);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = frame % 3 === 0 ? "#22c55e" : frame % 3 === 1 ? "#06b6d4" : "#f59e0b";
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (particles.some((p) => p.life > 0)) requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
    draw();
  }

  function exportProgress() {
    const payload = {
      app: content.title,
      exportedAt: new Date().toISOString(),
      progress: state.progress,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `year9-science-progress-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function importProgress(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(String(reader.result || "{}"));
        const imported = payload.progress || payload;
        state.progress = { ...defaultProgress(), ...imported, unlockedLevels: { ...defaultProgress().unlockedLevels, ...(imported.unlockedLevels || {}) } };
        saveProgress();
        rebuildDeck(true);
        render();
        alert("Progress imported.");
      } catch (error) {
        alert("Could not import that progress file.");
      }
    };
    reader.readAsText(file);
  }

  function render() {
    renderStats();
    renderDashboard();
    if (state.mode === "boss") renderBossSetup();
    else renderStudy();
  }

  function init() {
    initFilters();
    els.modeButtons.forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
    els.soundToggle.addEventListener("click", () => {
      state.sound = !state.sound;
      els.soundToggle.textContent = state.sound ? "🔊 Sound on" : "🔇 Sound off";
      els.soundToggle.setAttribute("aria-pressed", String(state.sound));
    });
    els.exportProgress.addEventListener("click", exportProgress);
    els.importProgressFile.addEventListener("change", (event) => importProgress(event.target.files?.[0]));
    rebuildDeck(true);
    render();
  }

  init();
})();
