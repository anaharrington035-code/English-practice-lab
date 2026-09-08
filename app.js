(function () {
  "use strict";
  const D = window.LAB_DATA, E = window.LabEngine;
  const OLD_KEY = "english-practice-lab-v1", KEY = "english-practice-lab-v2";
  const labels = { listening: "Listening", reading: "Reading", writing: "Writing", speaking: "Speaking", foundation: "基础" };
  const app = document.querySelector("#app"), pageTitle = document.querySelector("#page-title");
  let state = load(), view = "today", activeTask = null;

  function load() {
    let raw = {};
    try { raw = JSON.parse(localStorage.getItem(KEY) || localStorage.getItem(OLD_KEY) || "{}"); } catch (_) { raw = {}; }
    const migrated = E.migrateState(raw, new Date());
    localStorage.setItem(KEY, JSON.stringify(migrated));
    return migrated;
  }
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
  function esc(value) { const el = document.createElement("div"); el.textContent = value == null ? "" : value; return el.innerHTML; }
  function toast(text) { const el = document.querySelector("#toast"); el.textContent = text; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 1800); }
  function speak(text) { if (!state.sound || !window.speechSynthesis) return toast("当前浏览器无法朗读"); window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = "en-US"; utterance.rate = .86; window.speechSynthesis.speak(utterance); }
  function formatDate(value) { return value ? new Intl.DateTimeFormat("zh-CN", { month: "short", day: "numeric" }).format(new Date(value)) : "待安排"; }
  function skillName(key) { return labels[key] || key; }
  function modeLabel(mode) { return { minimum: "10 分钟保底", standard: "45–60 分钟标准", intensive: "90 分钟强化" }[mode]; }
  function currentMode() { return state.preferredMode || "standard"; }
  function weeklyMinutes(skill) { const since=Date.now()-7*86400000; return skill.history.filter(item=>new Date(item.at).getTime()>=since).length*5; }
  function setView(next) { view = next; activeTask = null; render(); }

  function renderDashboard() {
    pageTitle.textContent = "IELTS 训练中心";
    const remaining = E.daysRemaining(state.profile, new Date());
    const weakest = E.weakestSkill(state.skills), stage = D.ielts.stages.find(s => s.id === state.profile.currentStage);
    const plan = E.buildDailyPlan(state, currentMode(), new Date());
    const problems = Object.values(state.skills).flatMap(s => s.weaknesses).slice(0, 3);
    app.innerHTML = `<section class="goal-hero">
      <div><p class="eyebrow">180 DAY IELTS PLAN</p><h2>目标 Overall <strong>${state.profile.goalBand.toFixed(1)}</strong></h2><p>第 ${stage.id} 阶段 · ${stage.name}　${stage.focus}</p></div>
      <div class="days-ring"><strong>${remaining}</strong><span>天剩余</span></div>
    </section>
    <div class="section-title"><h2>四科能力</h2><button class="text-button" id="skills-detail">查看档案</button></div>
    <div class="skill-grid">${Object.keys(state.skills).map(key => skillCard(key)).join("")}</div>
    <section class="focus-card"><span class="badge">本周最弱项</span><h2>${skillName(weakest)}</h2><p>${state.skills[weakest].weaknesses[0] || "当前证据不足，建议先完成该科诊断。"}</p></section>
    <div class="section-title"><h2>今天怎么学</h2><span>根据时间动态生成</span></div>
    <div class="mode-picker">${["minimum","standard","intensive"].map(m => `<button data-mode="${m}" class="${currentMode()===m?"active":""}">${modeLabel(m)}</button>`).join("")}</div>
    <section class="card"><div class="row spread"><div><span class="badge">推荐计划</span><h3>${modeLabel(currentMode())}</h3></div><strong>${plan.reduce((n,t)=>n+t.minutes,0)} min</strong></div>
      <div class="task-list">${plan.map((task,i) => `<button class="plan-task" data-plan="${i}"><span>${task.minutes}′</span><div><b>${task.type === "skill" ? skillName(task.skill) : task.type === "foundation" ? "Language Foundation" : task.type === "review" ? "到期复习" : "重复错误"}</b><small>${task.reason}</small></div><i>→</i></button>`).join("")}</div>
    </section>
    <div class="section-title"><h2>本周核心任务</h2><span>不是完成句子数量</span></div>
    <section class="card"><ul class="clean-list"><li>完成尚未测评科目的轻量诊断</li><li>优先训练 ${skillName(weakest)}，建立有效能力证据</li><li>${problems.length ? `修复：${problems.join("、")}` : "从真实作答中识别首批高频错误"}</li></ul><button class="secondary" id="diagnostic">继续入学诊断</button></section>`;
    document.querySelectorAll("[data-mode]").forEach(b => b.onclick = () => { state.preferredMode = b.dataset.mode; save(); renderDashboard(); });
    document.querySelector("#diagnostic").onclick = () => setView("diagnostic");
    document.querySelector("#skills-detail").onclick = () => setView("skills");
    document.querySelectorAll("[data-plan]").forEach((b, i) => b.onclick = () => openPlanTask(plan[i]));
  }

  function skillCard(key) {
    const s = state.skills[key], measured = s.level !== "待评估";
    return `<button class="skill-card" data-skill="${key}"><span>${skillName(key)}</span><strong>${s.level}</strong><div class="skill-meter"><i style="width:${measured ? Math.min(90, 25+s.history.length*8) : 8}%"></i></div><small>${s.recent.length ? `最近 ${s.recent[0].result}` : "等待诊断"}</small></button>`;
  }

  function openPlanTask(task) {
    if (task.type === "skill") return openSkillTask(task.skill);
    if (task.type === "foundation" || task.type === "review" || task.type === "errors") return startFoundation();
  }

  function renderDiagnostics() {
    pageTitle.textContent = "入学诊断";
    const completed = Object.keys(state.diagnostics).length;
    app.innerHTML = `<section class="page-intro"><p class="eyebrow">LIGHT DIAGNOSTIC</p><h2>先了解起点，再安排训练</h2><p>六项诊断可以分开完成。结果只建立初始能力档案，不会伪装成精确 IELTS 分数。</p><div class="progress"><i style="width:${completed/6*100}%"></i></div><span>${completed} / 6 已完成</span></section>
      ${D.ielts.diagnostics.map(item => `<button class="card list-button" data-diagnostic="${item.id}"><div><span class="badge">${item.label}</span><h3>${esc(item.prompt)}</h3></div><strong>${state.diagnostics[item.id] ? "已完成 ✓" : "开始 →"}</strong></button>`).join("")}`;
    document.querySelectorAll("[data-diagnostic]").forEach(b => b.onclick = () => openDiagnostic(b.dataset.diagnostic));
  }

  function openDiagnostic(id) {
    const item = D.ielts.diagnostics.find(d => d.id === id); activeTask = { kind: "diagnostic", item, revealed: false };
    renderAnswerTask(item, result => {
      state.diagnostics[id] = { completedAt: new Date().toISOString(), result: result.correct ? "通过" : "需要加强", answer: result.answer };
      if (item.skill !== "foundation") updateSkill(item.skill, result, "入学诊断");
      save(); renderDiagnostics(); toast("诊断结果已保存");
    });
  }

  function renderSkills(selected) {
    pageTitle.textContent = "四科能力档案";
    if (selected) return renderSkillDetail(selected);
    app.innerHTML = `<section class="page-intro"><p class="eyebrow">SKILL PROFILES</p><h2>能力证据，而不是虚假分数</h2><p>在完成足够的诊断和训练前，系统只显示能力等级与证据状态。</p></section><div class="skill-list">${Object.keys(state.skills).map(key => skillCard(key)).join("")}</div>`;
    document.querySelectorAll("[data-skill]").forEach(b => b.onclick = () => renderSkills(b.dataset.skill));
  }

  function renderSkillDetail(key) {
    const s = state.skills[key], task = D.ielts.skillTasks[key];
    app.innerHTML = `<button class="secondary" id="back-skills">← 四科档案</button><section class="focus-card"><span class="badge">${skillName(key)}</span><h2>${s.level}</h2><p>${s.trend} · 本周 ${weeklyMinutes(s)} 分钟 · ${s.history.length} 条训练记录</p></section>
      <div class="detail-grid"><section class="card"><h3>薄弱点</h3>${s.weaknesses.length ? `<ul>${s.weaknesses.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>` : `<p>尚无足够证据</p>`}</section><section class="card"><h3>常见错误</h3>${Object.keys(s.errors).length ? `<ul>${Object.entries(s.errors).map(([x,n])=>`<li>${esc(x)} · ${n} 次</li>`).join("")}</ul>` : `<p>尚无记录</p>`}</section></div>
      <section class="card"><span class="badge">可实际训练</span><h3>${task.title}</h3><p>${task.prompt}</p><button class="primary" id="start-skill">开始 ${skillName(key)} 训练</button></section>
      <section class="card"><h3>最近训练</h3>${s.recent.length ? s.recent.slice(0,5).map(r=>`<p>${formatDate(r.at)} · ${r.label} · ${r.result}</p>`).join("") : `<p>完成诊断或训练后显示</p>`}</section>`;
    document.querySelector("#back-skills").onclick = () => renderSkills();
    document.querySelector("#start-skill").onclick = () => openSkillTask(key);
  }

  function openSkillTask(key) {
    const task = D.ielts.skillTasks[key]; activeTask = { kind: "skill", key, item: task, revealed: false, firstAnswer: "" };
    if (key === "speaking") return renderSpeakingTask();
    renderAnswerTask({ id:key, label:skillName(key), prompt:task.prompt, passage:task.passage, audioText:task.audioText, answer:task.answer || task.reference, type:task.type }, result => {
      showErrorReview(key, task, result);
    });
  }

  function renderAnswerTask(item, onComplete) {
    pageTitle.textContent = item.label || "专项训练";
    app.innerHTML = `<section class="card training-card"><span class="badge">先回答，后看参考</span>${item.passage ? `<div class="passage">${esc(item.passage)}</div>` : ""}<h2 class="prompt">${esc(item.prompt)}</h2>${item.audioText ? `<button class="secondary" id="play-audio">播放听力</button>` : ""}
      ${item.type === "choice" ? `<div class="choice-grid">${item.options.map(o=>`<button class="option" data-answer="${esc(o)}">${esc(o)}</button>`).join("")}</div>` : `<textarea id="task-answer" placeholder="先写下你的英文回答…"></textarea>`}
      <button class="primary" id="reveal-task">提交并查看参考</button></section>`;
    let selected = "";
    document.querySelectorAll("[data-answer]").forEach(b => b.onclick = () => { selected = b.dataset.answer; document.querySelectorAll("[data-answer]").forEach(x=>x.classList.toggle("selected",x===b)); });
    if (item.audioText) document.querySelector("#play-audio").onclick = () => speak(item.audioText);
    document.querySelector("#reveal-task").onclick = () => {
      const answer = item.type === "choice" ? selected : document.querySelector("#task-answer").value.trim();
      if (!answer) return toast("请先完成自己的回答");
      const result = item.type === "reflection" ? { correct:true, answer, score:1 } : Object.assign(E.evaluate(answer,item.answer,false),{answer});
      app.querySelector(".training-card").insertAdjacentHTML("beforeend", `<div class="answer"><strong>参考答案 / 任务完成</strong><p>${esc(item.answer || "你的回答已保存，系统将在更多证据后更新能力档案。")}</p></div><button class="primary" id="complete-task">保存结果</button>`);
      document.querySelector("#reveal-task").disabled = true;
      document.querySelector("#complete-task").onclick = () => onComplete(result);
    };
  }

  function showErrorReview(key, task, result) {
    app.innerHTML = `<section class="card"><span class="badge ${result.correct?"":"error"}">${result.correct?"完成":"需要复盘"}</span><h2>${task.title}</h2><p>请选择最接近的问题；这比只记录“答错”更有价值。</p><div class="choice-grid">${task.errorOptions.map(o=>`<button class="option" data-error="${o}">${o}</button>`).join("")}</div><button class="primary" id="save-review">保存训练记录</button></section>`;
    let error = result.correct ? "无明显错误" : task.errorOptions[0];
    document.querySelectorAll("[data-error]").forEach(b=>b.onclick=()=>{error=b.dataset.error;document.querySelectorAll("[data-error]").forEach(x=>x.classList.toggle("selected",x===b));});
    document.querySelector("#save-review").onclick=()=>{result.error=error;updateSkill(key,result,task.title);save();renderSkillDetail(key);toast("训练证据已加入能力档案");};
  }

  function renderSpeakingTask() {
    const task = activeTask.item;
    pageTitle.textContent = "Speaking 训练";
    app.innerHTML = `<section class="card training-card"><span class="badge">Part 1 · 先回答</span><h2 class="prompt">${task.prompt}</h2><textarea id="first-speaking" placeholder="口头回答后，简要记下你说了什么…"></textarea><button class="primary" id="show-speaking">完成第一次回答</button><div id="speaking-next"></div></section>`;
    document.querySelector("#show-speaking").onclick=()=>{const first=document.querySelector("#first-speaking").value.trim();if(!first)return toast("请先回答并留下简要记录");activeTask.firstAnswer=first;document.querySelector("#speaking-next").innerHTML=`<div class="answer"><strong>参考表达</strong><p>${esc(task.reference)}</p><button class="secondary" id="speak-reference">朗读</button></div><p><b>找出问题后重新回答：</b></p><textarea id="second-speaking" placeholder="记录你的第二次回答…"></textarea><button class="primary" id="finish-speaking">保存两次回答</button>`;document.querySelector("#show-speaking").disabled=true;document.querySelector("#speak-reference").onclick=()=>speak(task.reference);document.querySelector("#finish-speaking").onclick=()=>{const second=document.querySelector("#second-speaking").value.trim();if(!second)return toast("请完成第二次回答");showErrorReview("speaking",task,{correct:true,answer:second,firstAnswer:first});};};
  }

  function updateSkill(key, result, label) {
    const s = state.skills[key], now = new Date().toISOString();
    s.history.unshift({ at:now, label, correct:result.correct, answer:result.answer });
    s.recent.unshift({ at:now, label, result:result.correct?"完成":"需要加强" });
    s.weeklyMinutes += 5;
    if (result.error && result.error !== "无明显错误") { s.errors[result.error]=(s.errors[result.error]||0)+1; if(!s.weaknesses.includes(result.error))s.weaknesses.unshift(result.error); }
    const completed = s.history.filter(x=>x.correct).length;
    s.level = completed >= 4 ? "基础建立中" : completed >= 1 ? "基础薄弱" : "待评估";
    s.trend = s.history.length < 3 ? "证据积累中" : s.history.slice(0,3).filter(x=>x.correct).length >= 2 ? "近期改善" : "需要加强";
    state.taskHistory.unshift({ skill:key, at:now, label, result:result.correct });
  }

  function startFoundation() {
    const sentence = D.sentences.find(s => !state.progress[s.id]) || D.sentences[0];
    pageTitle.textContent = "Language Foundation";
    renderAnswerTask({ label:"主动提取", prompt:sentence.chinese, answer:sentence.english, type:"text" }, result => {
      state.progress[sentence.id] = E.nextProgress(state.progress[sentence.id],result,new Date());
      if(!result.correct) state.errors.unshift({ sentenceId:sentence.id, task:"主动提取", answer:result.answer, expected:sentence.english, at:new Date().toISOString(), count:1 });
      save(); renderFoundation(); toast("已安排动态复习");
    });
  }

  function renderFoundation() {
    pageTitle.textContent = "Language Foundation";
    app.innerHTML = `<section class="page-intro"><p class="eyebrow">LANGUAGE FOUNDATION</p><h2>核心句是能力材料，不是终点</h2><p>主动提取、语法、词汇网络、易混词和跨场景迁移继续保留，并服务于 IELTS 四科。</p><button class="primary" id="foundation-practice">开始到期训练</button></section>
      <div class="section-title"><h2>保留的学习内容</h2><span>${D.sentences.length} 条</span></div>${D.sentences.map(s=>`<section class="card"><div class="row spread"><span class="badge">${s.scenarios.join(" · ")}</span><small>${(state.progress[s.id]||{}).status||"未训练"}</small></div><h3>${esc(s.english)}</h3><p>${esc(s.chinese)}</p><div class="vocab-tiers"><span>A 主动：${s.keywords.slice(0,2).join("、")}</span><span>B 认识：${s.keywords.slice(2).join("、")||"—"}</span><span>C 接触：按场景补充</span></div></section>`).join("")}
      <div class="section-title"><h2>我的混淆库</h2><span>${D.confusions.length} 组</span></div>${D.confusions.map(c=>`<section class="card"><h3>${c.title}</h3><p>${c.comparison.map(x=>x[0]+"："+x[1]).join("；")}</p></section>`).join("")}`;
    document.querySelector("#foundation-practice").onclick=startFoundation;
  }

  function renderAssessments() {
    pageTitle.textContent = "阶段与数据";
    const stage = D.ielts.stages.find(s=>s.id===state.profile.currentStage);
    app.innerHTML=`<section class="page-intro"><p class="eyebrow">STAGE REVIEW</p><h2>Stage ${stage.id} · ${stage.name}</h2><p>${stage.focus}。每 2—4 周记录一次结果；阶段不会按日期机械推进。</p></section>
      <section class="card"><h3>新增阶段评估</h3><label>本阶段观察<textarea id="assessment-note" placeholder="四科表现、主要弱项、下一阶段重点…"></textarea></label><label>下一阶段重点<select id="assessment-focus">${Object.keys(state.skills).map(k=>`<option value="${k}">${skillName(k)}</option>`).join("")}</select></label><button class="primary" id="save-assessment">保存评估并调整重点</button></section>
      <section class="card"><h3>评估历史</h3>${state.assessments.length?state.assessments.map(a=>`<p>${formatDate(a.at)} · 重点 ${skillName(a.focus)}<br>${esc(a.note)}</p>`).join(""):`<p>尚无阶段评估。建议完成入学诊断后开始记录。</p>`}</section>
      <section class="card"><h3>内容与数据管理</h3><p>导出包含旧版学习记录、四科档案、诊断、阶段评估和自定义内容。</p><div class="actions"><button class="secondary" id="export-data">导出数据</button><label class="secondary file-button">导入数据<input id="import-data" type="file" accept="application/json"></label><button class="secondary" id="add-content">添加内容</button></div><div id="content-editor"></div></section>`;
    document.querySelector("#save-assessment").onclick=()=>{const note=document.querySelector("#assessment-note").value.trim();if(!note)return toast("请先填写观察");state.assessments.unshift({at:new Date().toISOString(),note,focus:document.querySelector("#assessment-focus").value,stage:stage.id});save();renderAssessments();};
    document.querySelector("#export-data").onclick=exportData;document.querySelector("#import-data").onchange=importData;document.querySelector("#add-content").onclick=renderContentEditor;
  }

  function renderContentEditor(){document.querySelector("#content-editor").innerHTML=`<div class="editor"><label>内容类型<select id="content-type"><option value="sentences">核心句</option><option value="vocabulary">词汇</option><option value="questions">IELTS 题目</option><option value="materials">听力/阅读材料</option></select></label><label>标题或英文<input id="content-title"></label><label>内容<textarea id="content-body"></textarea></label><button class="primary" id="save-content">保存到本机</button></div>`;document.querySelector("#save-content").onclick=()=>{const type=document.querySelector("#content-type").value,title=document.querySelector("#content-title").value.trim(),body=document.querySelector("#content-body").value.trim();if(!title||!body)return toast("请填写标题和内容");state.customContent[type].push({id:Date.now().toString(),title,body,createdAt:new Date().toISOString()});save();renderAssessments();toast("自定义内容已保存");};}
  function exportData(){const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`english-practice-lab-${E.dayKey(new Date())}.json`;a.click();URL.revokeObjectURL(url);}
  function importData(event){const file=event.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{state=E.migrateState(JSON.parse(reader.result),new Date());save();renderAssessments();toast("数据已导入，旧记录已保留");}catch(_){toast("导入失败：不是有效的 JSON 数据");}};reader.readAsText(file);}

  function render() {
    document.querySelectorAll("[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
    if(view==="today")renderDashboard(); else if(view==="skills")renderSkills(); else if(view==="foundation")renderFoundation(); else if(view==="assessments")renderAssessments(); else if(view==="diagnostic")renderDiagnostics();
    window.scrollTo(0,0);
  }
  document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>setView(b.dataset.view));
  document.querySelector("#sound-toggle").onclick=()=>{state.sound=!state.sound;save();document.querySelector("#sound-toggle").textContent=state.sound?"声音开":"声音关";};
  document.querySelector("#sound-toggle").textContent=state.sound===false?"声音关":"声音开";
  app.addEventListener("click",event=>{const card=event.target.closest("[data-skill]");if(card&&view==="today")renderSkills(card.dataset.skill);});
  render();
})();
