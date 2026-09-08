"use strict";
const assert = require("assert");
const E = require("../engine.js");
const now = new Date("2026-09-03T12:00:00Z");

assert.strictEqual(E.normalize("Hello,  World!"), "hello world");
assert.strictEqual(E.evaluate("The war interrupted the food supply.", "The war interrupted the food supply.", false).correct, true);
assert.strictEqual(E.evaluate("completely unrelated", "The war interrupted the food supply.", false).correct, false);

let p = E.nextProgress(null, { correct: false, close: false, usedHint: false }, now);
assert.strictEqual(p.status, E.STATUS.ERROR);
assert.strictEqual(E.dayKey(p.nextReviewAt), "2026-09-04");

p = E.nextProgress(p, { correct: true, close: true, usedHint: true }, now);
assert.strictEqual(p.status, E.STATUS.UNSTABLE);

let good = E.nextProgress(null, { correct: true, close: true, usedHint: false }, now);
assert.strictEqual(good.status, E.STATUS.UNFAMILIAR);
good = E.nextProgress(good, { correct: true, close: true, usedHint: false }, now);
assert.strictEqual(good.status, E.STATUS.UNFAMILIAR, "同一天重复答对不能直接标记为已掌握");
good = E.nextProgress(good, { correct: true, close: true, usedHint: false }, new Date("2026-09-06T12:00:00Z"));
assert.strictEqual(good.status, E.STATUS.MASTERED);
assert.strictEqual(E.dayKey(good.nextReviewAt), "2026-09-13");

assert.strictEqual(E.due({ nextReviewAt: "2026-09-03T11:00:00Z" }, now), true);
assert.strictEqual(E.due({ nextReviewAt: "2026-09-04T11:00:00Z" }, now), false);
assert.strictEqual(E.streak(["2026-09-01", "2026-09-02", "2026-09-03"], now), 3);
assert.strictEqual(E.streak(["2026-08-20"], now), 0);

let recovered = E.nextProgress(null, { correct: false, close: false, usedHint: false }, now);
recovered = E.nextProgress(recovered, { correct: true, close: true, usedHint: false }, new Date("2026-09-04T12:00:00Z"));
assert.strictEqual(recovered.status, E.STATUS.UNSTABLE, "一次正确不能抹去已有错误记录");

const legacy = { progress: { old: { status: E.STATUS.UNSTABLE } }, errors: [{ task: "old error" }], sessions: [{ minutes: 10 }] };
const migrated = E.migrateState(legacy, now);
assert.strictEqual(migrated.version, 2);
assert.strictEqual(migrated.progress.old.status, E.STATUS.UNSTABLE, "旧句子进度必须保留");
assert.strictEqual(migrated.errors.length, 1, "旧错误记录必须保留");
assert.strictEqual(migrated.sessions.length, 1, "旧训练记录必须保留");
assert.strictEqual(migrated.skills.listening.level, "待评估");
assert.strictEqual(migrated.sound, true, "旧数据没有声音字段时应默认启用朗读");
assert.strictEqual(E.daysRemaining(migrated.profile, now), 180);
const plan = E.buildDailyPlan(migrated, "standard", now);
assert.ok(plan.some(task => task.type === "skill"));
assert.ok(plan.reduce((sum, task) => sum + task.minutes, 0) <= 50);

console.log("engine tests: 24 assertions passed");
