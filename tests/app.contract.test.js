"use strict";
const assert = require("assert");
const fs = require("fs");

const app = fs.readFileSync("app.js", "utf8");
const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("styles.css", "utf8");

assert.match(app, /localStorage\.getItem\(KEY\).*localStorage\.getItem\(OLD_KEY\)/, "应用应优先读取 v2 并兼容 v1 记录");
assert.match(app, /localStorage\.setItem\(KEY/, "应用应将记录写入 localStorage");
assert.match(app, /new SpeechSynthesisUtterance\(text\)/, "朗读应使用 SpeechSynthesisUtterance");
assert.match(app, /if \(!answer\) return toast\("请先完成自己的回答"\)/, "未作答时应阻止查看答案");
assert.match(app, /提交并查看参考/, "训练必须先提交再查看参考");
assert.match(app, /buildDailyPlan/, "首页应使用动态任务计划");
assert.match(app, /D\.ielts\.diagnostics/, "应用应提供渐进式入学诊断");
assert.match(app, /state\.skills\[key\]/, "应用应维护四科能力档案");
assert.match(app, /JSON\.stringify\(state,null,2\)/, "应用应支持学习数据导出");
assert.match(html, /name="viewport"/, "页面应设置移动端 viewport");
assert.match(css, /min-height: 48px/, "主要按钮应至少有 48px 点击高度");
assert.match(css, /@media \(max-width: 359px\)/, "应为超窄手机提供布局降级");

console.log("app contract tests: 12 assertions passed");
