(function (root) {
  "use strict";
  const DAY = 86400000;
  const STATUS = { MASTERED: "已掌握", UNSTABLE: "不稳定", UNFAMILIAR: "不熟悉", ERROR: "错误" };

  function dayKey(date) {
    const d = new Date(date);
    return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
  }
  function addDays(date, count) { const d = new Date(date); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + count); return d.toISOString(); }
  function normalize(value) { return String(value || "").toLowerCase().replace(/[.,!?;:'’“”]/g, "").replace(/\s+/g, " ").trim(); }
  function similarity(a, b) {
    a = normalize(a); b = normalize(b);
    if (!a || !b) return 0;
    if (a === b) return 1;
    const aa = a.split(" "), bb = b.split(" ");
    const common = aa.filter((word, i) => word === bb[i]).length;
    const bag = aa.filter(word => bb.includes(word)).length;
    return Math.max(common / Math.max(aa.length, bb.length), bag / Math.max(aa.length, bb.length) * 0.88);
  }
  function evaluate(answer, expected, usedHint) {
    const score = similarity(answer, expected);
    return { score, correct: score >= 0.82, close: score >= 0.58, usedHint: Boolean(usedHint) };
  }
  function nextProgress(previous, result, now) {
    const p = Object.assign({ attempts: 0, errors: 0, hintCount: 0, consecutiveCorrect: 0, status: STATUS.UNFAMILIAR }, previous || {});
    const reviewDay = dayKey(now);
    p.attempts += 1;
    p.lastReviewedAt = new Date(now).toISOString();
    if (result.usedHint) p.hintCount += 1;
    if (!result.correct) p.errors += 1;
    if (!result.correct && !result.close) {
      p.consecutiveCorrect = 0; p.status = STATUS.ERROR; p.nextReviewAt = addDays(now, 1);
    } else if (!result.correct || result.usedHint) {
      p.consecutiveCorrect = 0; p.status = STATUS.UNSTABLE; p.nextReviewAt = addDays(now, 1);
    } else {
      if (p.lastSuccessfulDay !== reviewDay) p.consecutiveCorrect += 1;
      p.lastSuccessfulDay = reviewDay;
      if (p.consecutiveCorrect >= 2) {
        p.status = STATUS.MASTERED; p.nextReviewAt = addDays(now, 7); p.masteredAt = new Date(now).toISOString();
      } else {
        p.status = p.errors ? STATUS.UNSTABLE : STATUS.UNFAMILIAR; p.nextReviewAt = addDays(now, 3);
      }
    }
    return p;
  }
  function streak(days, now) {
    const unique = [...new Set(days || [])].sort().reverse();
    if (!unique.length) return 0;
    let cursor = new Date(now); cursor.setHours(12, 0, 0, 0);
    const today = dayKey(cursor), yesterday = dayKey(new Date(cursor.getTime() - DAY));
    if (unique[0] !== today && unique[0] !== yesterday) return 0;
    cursor = new Date(unique[0] + "T12:00:00Z");
    let total = 0;
    for (const key of unique) {
      if (key !== dayKey(cursor)) break;
      total += 1; cursor = new Date(cursor.getTime() - DAY);
    }
    return total;
  }
  function due(progress, now) { return !progress || !progress.nextReviewAt || new Date(progress.nextReviewAt) <= new Date(now); }
  function migrateState(raw, now) {
    const source = raw && typeof raw === "object" ? raw : {};
    const startDate = source.profile && source.profile.startDate || dayKey(now || new Date());
    const skills = ["listening", "reading", "writing", "speaking"].reduce((all, skill) => {
      all[skill] = Object.assign({ level: "待评估", recent: [], errors: {}, weaknesses: [], history: [], weeklyMinutes: 0, trend: "证据不足" }, (source.skills || {})[skill]);
      return all;
    }, {});
    return Object.assign({}, source, {
      version: 2,
      sound: source.sound !== false,
      preferredMode: source.preferredMode || "standard",
      lastSentenceIndex: Number.isInteger(source.lastSentenceIndex) ? source.lastSentenceIndex : -1,
      profile: Object.assign({ goalBand: 6, durationDays: 180, startDate, currentStage: 1 }, source.profile || {}),
      skills,
      diagnostics: Object.assign({}, source.diagnostics || {}),
      assessments: Array.isArray(source.assessments) ? source.assessments : [],
      taskHistory: Array.isArray(source.taskHistory) ? source.taskHistory : [],
      expressionLibrary: Array.isArray(source.expressionLibrary) ? source.expressionLibrary : [],
      customContent: Object.assign({ sentences: [], vocabulary: [], questions: [], materials: [] }, source.customContent || {}),
      progress: Object.assign({}, source.progress || {}),
      confusions: Object.assign({}, source.confusions || {}),
      errors: Array.isArray(source.errors) ? source.errors : [],
      sessions: Array.isArray(source.sessions) ? source.sessions : [],
      studyDays: Array.isArray(source.studyDays) ? source.studyDays : []
    });
  }
  function daysRemaining(profile, now) {
    const elapsed = Math.floor((new Date(dayKey(now) + "T12:00:00") - new Date(profile.startDate + "T12:00:00")) / DAY);
    return Math.max(0, profile.durationDays - elapsed);
  }
  function weakestSkill(skills) {
    const order = ["listening", "reading", "writing", "speaking"];
    const rank = { "待评估": 0, "基础薄弱": 1, "基础建立中": 2, "接近目标": 3 };
    return order.slice().sort((a, b) => (rank[skills[a].level] || 0) - (rank[skills[b].level] || 0) || skills[a].weeklyMinutes - skills[b].weeklyMinutes)[0];
  }
  function buildDailyPlan(state, mode, now) {
    const budgets = { minimum: 10, standard: 50, intensive: 90 }, budget = budgets[mode] || budgets.standard;
    const assessedFocus = state.assessments[0] && state.assessments[0].focus;
    const weak = state.skills[assessedFocus] ? assessedFocus : weakestSkill(state.skills), tasks = [];
    const repeated = state.errors.filter(e => (e.count || 1) > 1).length;
    if (repeated) tasks.push({ type: "errors", skill: "foundation", minutes: Math.min(10, budget), priority: 100, reason: `${repeated} 个重复错误` });
    const dueCount = Object.values(state.progress).filter(p => due(p, now)).length + Object.values(state.confusions).filter(p => due(p, now)).length;
    if (dueCount) tasks.push({ type: "review", skill: "foundation", minutes: Math.min(10, budget), priority: 90, reason: `${dueCount} 项到期复习` });
    tasks.push({ type: "skill", skill: weak, minutes: mode === "minimum" ? 6 : mode === "intensive" ? 35 : 25, priority: 80, reason: "当前最弱或证据最少的能力" });
    if (mode !== "minimum") tasks.push({ type: "skill", skill: weak === "listening" ? "writing" : "listening", minutes: mode === "intensive" ? 25 : 15, priority: 60, reason: "IELTS 高价值技能" });
    tasks.push({ type: "foundation", skill: "foundation", minutes: mode === "minimum" ? 4 : 10, priority: 40, reason: "Language Foundation 迁移" });
    let used = 0;
    return tasks.sort((a,b) => b.priority-a.priority).map(t => { const remaining = budget-used; const item = Object.assign({},t,{minutes:Math.max(0,Math.min(t.minutes,remaining))}); used += item.minutes; return item; }).filter(t=>t.minutes>0);
  }
  const api = { STATUS, normalize, similarity, evaluate, nextProgress, streak, due, dayKey, addDays, migrateState, daysRemaining, weakestSkill, buildDailyPlan };
  root.LabEngine = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
