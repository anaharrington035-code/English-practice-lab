# English Practice Lab

一个手机优先、无需构建工具的 **180 天 IELTS 6.0 个性化训练系统**。它以四科能力证据、渐进入学诊断、动态每日任务和阶段复盘为主线；核心句训练归入 Language Foundation。

## 本地运行

项目只使用 HTML、CSS 和 JavaScript，不需要安装依赖：

```bash
python3 -m http.server 8000
```

然后访问 <http://localhost:8000>。学习进度保存在浏览器 `localStorage` 中；英文朗读使用浏览器内置的 SpeechSynthesis。新版会从 `english-practice-lab-v1` 无损迁移到 `english-practice-lab-v2`。

## 文件结构

- `index.html`：应用入口和导航框架
- `styles.css`：手机优先的响应式界面
- `data.js`：IELTS 阶段、诊断、四科任务、核心句、词汇和混淆组种子内容
- `engine.js`：状态迁移、动态任务、答案评估、复习时间和连续学习算法
- `app.js`：IELTS 仪表盘、诊断、四科训练、基础模块、阶段评估与内容管理
- `tests/engine.test.js`：不依赖第三方包的学习算法测试

## 数据说明

浏览器中使用的存储键为 `english-practice-lab-v2`。阶段页面可以导出 JSON 备份；清理站点数据前请先导出。
