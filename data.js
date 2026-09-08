/* 所有课程内容集中在这里。新增内容时沿用现有字段即可。 */
window.LAB_DATA = {
  sentences: [
    {
      id: "define-medicine",
      english: "Chinese medicine is a complex issue. Different people define it differently.",
      chinese: "中医是一个复杂的议题。不同的人对它有不同的定义。",
      ipa: "/ˌtʃaɪˈniːz ˈmedɪsɪn ɪz ə ˈkɒmpleks ˈɪʃuː/  /ˈdɪfrənt ˈpiːpl dɪˈfaɪn ɪt ˈdɪfrəntli/",
      keywords: ["complex", "issue", "define", "differently"],
      grammar: "一般现在时用于陈述普遍观点；define + 宾语表示“定义……”。",
      confusionIds: ["define-definition"],
      scenarios: ["中医", "研究生课堂"],
      substitutions: [
        { label: "研究方法", english: "This research method is a complex issue. Different scholars define it differently." },
        { label: "健康", english: "Health is a complex issue. Different cultures define it differently." }
      ],
      transfer: { prompt: "课堂场景：请用相同结构表达“健康是一个复杂议题，不同文化对它有不同定义”。", answer: "Health is a complex issue. Different cultures define it differently." }
    },
    {
      id: "considerable-debate",
      english: "There is considerable debate over how we should explain Chinese medicine.",
      chinese: "关于我们应该如何解释中医，存在相当多的争论。",
      ipa: "/ðeər ɪz kənˈsɪdərəbl dɪˈbeɪt ˈəʊvə haʊ wi ʃʊd ɪkˈspleɪn ˌtʃaɪˈniːz ˈmedɪsɪn/",
      keywords: ["considerable", "debate", "explain"],
      grammar: "There is + 名词表示“存在……”；debate over 后接争议主题。",
      confusionIds: [],
      scenarios: ["中医", "研究生课堂"],
      substitutions: [
        { label: "针灸研究", english: "There is considerable debate over how we should study acupuncture." },
        { label: "临床证据", english: "There is considerable debate over how we should evaluate clinical evidence." }
      ],
      transfer: { prompt: "研究生课堂：请表达“关于我们应该如何评价临床证据，存在相当多的争论”。", answer: "There is considerable debate over how we should evaluate clinical evidence." }
    },
    {
      id: "war-interrupted",
      english: "The war interrupted the food supply.",
      chinese: "战争中断了食物供应。",
      ipa: "/ðə wɔːr ˌɪntəˈrʌptɪd ðə fuːd səˈplaɪ/",
      keywords: ["interrupt", "supply"],
      grammar: "一般过去时描述已发生事件；interrupt 后直接接受影响的事物。",
      confusionIds: ["interrupt-disrupt-disturb", "provide-supply"],
      scenarios: ["新闻", "日常表达"],
      substitutions: [
        { label: "暴风雨/电力", english: "The storm interrupted the power supply." },
        { label: "电话/谈话", english: "The phone call interrupted our conversation." }
      ],
      transfer: { prompt: "生活场景：请表达“暴风雨中断了电力供应”。", answer: "The storm interrupted the power supply." }
    },
    {
      id: "learning-ten-years",
      english: "I have been learning English for ten years.",
      chinese: "我学习英语已经十年了。",
      ipa: "/aɪ həv bɪn ˈlɜːnɪŋ ˈɪŋɡlɪʃ fə ten jɪəz/",
      keywords: ["have been learning", "for"],
      grammar: "现在完成进行时 have been doing 强调从过去持续到现在；for 后接一段时间。",
      confusionIds: ["plural-third-s"],
      scenarios: ["日常社交", "研究生课堂"],
      substitutions: [
        { label: "针灸", english: "I have been studying acupuncture for five years." },
        { label: "研究项目", english: "We have been working on this project for six months." }
      ],
      transfer: { prompt: "课堂场景：请表达“我们研究这个项目已经六个月了”。", answer: "We have been working on this project for six months." }
    },
    {
      id: "migration-complex",
      english: "Migration is a complex issue. Different people define it differently.",
      chinese: "移民是一个复杂的议题。不同的人对它有不同的定义。",
      ipa: "/maɪˈɡreɪʃn ɪz ə ˈkɒmpleks ˈɪʃuː/  /ˈdɪfrənt ˈpiːpl dɪˈfaɪn ɪt ˈdɪfrəntli/",
      keywords: ["complex", "issue", "define", "differently"],
      grammar: "一般现在时陈述观点；different 是形容词，differently 是副词。",
      confusionIds: ["define-definition", "different-differently", "plural-third-s"],
      scenarios: ["IELTS Writing", "IELTS Speaking"],
      substitutions: [{ label: "中医", english: "Chinese medicine is a complex issue. Different people define it differently." }],
      transfer: { prompt: "Writing：请表达“健康是一个复杂议题，不同文化对它有不同定义”。", answer: "Health is a complex issue. Different cultures define it differently." }
    },
    {
      id: "world-wars-supply",
      english: "The two world wars, which interrupted the supply of raw materials, had a major impact on trade.",
      chinese: "两次世界大战中断了原材料供应，并对贸易产生了重大影响。",
      ipa: "/ðə tuː wɜːld wɔːz wɪtʃ ˌɪntəˈrʌptɪd ðə səˈplaɪ əv rɔː məˈtɪəriəlz hæd ə ˈmeɪdʒə ˈɪmpækt ɒn treɪd/",
      keywords: ["interrupt", "supply"],
      grammar: "which 引导非限制性定语从句，补充说明两次世界大战的影响。",
      confusionIds: ["interrupt-disrupt-disturb", "provide-supply", "plural-third-s"],
      scenarios: ["IELTS Reading", "长难句"],
      substitutions: [{ label: "疫情/医疗", english: "The pandemic, which interrupted the supply of medical equipment, affected many hospitals." }],
      transfer: { prompt: "Reading/Writing：用 which 表达“疫情中断医疗设备供应，并影响许多医院”。", answer: "The pandemic, which interrupted the supply of medical equipment, affected many hospitals." }
    }
  ],
  vocabulary: {
    complex: { ipa: "/ˈkɒmpleks/", meaning: "复杂的", example: "Pain is a complex experience." },
    issue: { ipa: "/ˈɪʃuː/", meaning: "议题；问题", example: "This is an important clinical issue." },
    define: { ipa: "/dɪˈfaɪn/", meaning: "定义（动词）", example: "How do you define health?" },
    differently: { ipa: "/ˈdɪfrəntli/", meaning: "不同地", example: "Patients may respond differently." },
    considerable: { ipa: "/kənˈsɪdərəbl/", meaning: "相当大的；值得注意的", example: "The topic has attracted considerable interest." },
    debate: { ipa: "/dɪˈbeɪt/", meaning: "争论；讨论", example: "There is ongoing debate about the evidence." },
    explain: { ipa: "/ɪkˈspleɪn/", meaning: "解释", example: "Let me explain the treatment." },
    interrupt: { ipa: "/ˌɪntəˈrʌpt/", meaning: "打断；中断正在进行的事", example: "Please do not interrupt the patient." },
    supply: { ipa: "/səˈplaɪ/", meaning: "供应；供给", example: "The clinic has a steady supply of needles." },
    "have been learning": { ipa: "/hæv bɪn ˈlɜːnɪŋ/", meaning: "一直在学习", example: "I have been learning medical English." },
    for: { ipa: "/fɔː/", meaning: "持续（多长时间）", example: "I have lived here for two years." }
  },
  confusions: [
    {
      id: "interrupt-disrupt-disturb", title: "interrupt / disrupt / disturb", type: "近义词",
      comparison: [
        ["interrupt", "打断一个正在进行的动作、讲话或供应"],
        ["disrupt", "严重扰乱计划、系统或秩序"],
        ["disturb", "打扰人的休息、注意力或平静状态"]
      ],
      examples: ["Please don't interrupt me.", "The strike disrupted train services.", "Do not disturb the patient."],
      choice: { prompt: "The loud noise ___ the patient’s sleep.", options: ["interrupted", "disrupted", "disturbed"], answer: "disturbed" },
      translation: { prompt: "暴风雨扰乱了航班时刻表。", answer: "The storm disrupted the flight schedule." }
    },
    {
      id: "provide-supply", title: "provide / supply", type: "近义词",
      comparison: [["provide", "提供所需之物；provide someone with something"], ["supply", "持续或大量供应；supply something to someone"]],
      examples: ["We provide patients with clear information.", "The company supplies medicine to the clinic."],
      choice: { prompt: "The guide will ___ you with more information.", options: ["provide", "supply"], answer: "provide" },
      translation: { prompt: "诊所为病人提供清晰的信息。", answer: "The clinic provides patients with clear information." }
    },
    {
      id: "define-definition", title: "define / definition", type: "词性",
      comparison: [["define", "动词：给……下定义"], ["definition", "名词：定义"]],
      examples: ["How do you define health?", "There is no single definition of health."],
      choice: { prompt: "Different cultures ___ health differently.", options: ["define", "definition"], answer: "define" },
      translation: { prompt: "这个词很难定义。", answer: "This word is difficult to define." }
    },
    {
      id: "plural-third-s", title: "名词复数 -s / 第三人称动词 -s", type: "语法",
      comparison: [["名词复数 -s", "表示一个以上：patients"], ["第三人称动词 -s", "一般现在时主语为 he/she/it：works"]],
      examples: ["The clinic treats many patients.", "The doctor treats each patient carefully."],
      choice: { prompt: "The doctor ___ five patients every morning.", options: ["treat", "treats"], answer: "treats" },
      translation: { prompt: "这位医生每天治疗很多病人。", answer: "The doctor treats many patients every day." }
    },
    {
      id: "different-differently", title: "different / differently", type: "词性",
      comparison: [["different", "形容词：修饰名词，或放在 be 后"], ["differently", "副词：修饰动作发生的方式"]],
      examples: ["People have different opinions.", "People define health differently."],
      choice: { prompt: "People may respond ___ to treatment.", options: ["different", "differently"], answer: "differently" },
      translation: { prompt: "不同的人有不同的看法。", answer: "Different people have different opinions." }
    },
    {
      id: "be-lexical-verbs", title: "be 动词 / 实义动词", type: "语法",
      comparison: [["be 动词", "连接主语与身份、状态或形容词：is complex"], ["实义动词", "表达动作或过程：define the issue"]],
      examples: ["Migration is complex.", "People define migration differently."],
      choice: { prompt: "Chinese medicine ___ a complex issue.", options: ["is", "defines"], answer: "is" },
      translation: { prompt: "这个问题很复杂。", answer: "This issue is complex." }
    }
  ],
  ielts: {
    goal: { overall: 6.0, durationDays: 180 },
    stages: [
      { id: 1, name: "基础重建", focus: "高频语法、核心词汇、基本听说与正确句子" },
      { id: 2, name: "IELTS 能力建立", focus: "常见题型、同义替换与段落表达" },
      { id: 3, name: "四科专项训练", focus: "按弱项动态分配四科训练" },
      { id: 4, name: "题型强化", focus: "限时训练、真实题型与错误归因" },
      { id: 5, name: "模考与补弱", focus: "完整模拟、风险预测与集中补强" }
    ],
    diagnostics: [
      { id: "vocabulary", label: "基础词汇", skill: "foundation", prompt: "请选择 complex 最接近的中文意思。", type: "choice", options: ["复杂的", "传统的", "快速的"], answer: "复杂的" },
      { id: "grammar", label: "基础语法", skill: "writing", prompt: "The doctor ___ five patients every day.", type: "choice", options: ["treat", "treats"], answer: "treats" },
      { id: "listening", label: "Listening", skill: "listening", prompt: "点击播放，写下你听到的句子。", type: "audio", audioText: "The appointment is on the fifteenth of May.", answer: "The appointment is on the fifteenth of May." },
      { id: "reading", label: "Reading", skill: "reading", passage: "Many people use acupuncture to manage pain, although researchers continue to debate how it works.", prompt: "What do some people use acupuncture for?", type: "text", answer: "to manage pain" },
      { id: "writing", label: "Writing", skill: "writing", prompt: "请用 2—3 个英文句子说明你为什么学习英语。", type: "reflection" },
      { id: "speaking", label: "Speaking", skill: "speaking", prompt: "Why are you learning English? 请先口头回答 30 秒。", type: "reflection" }
    ],
    skillTasks: {
      listening: { title: "数字与日期精听", type: "audio", prompt: "写下你听到的日期。", audioText: "The course begins on September the twenty-third.", answer: "September the twenty-third", errorOptions: ["没听见", "数字或日期", "拼写", "没有识别同义替换"] },
      reading: { title: "定位与同义替换", type: "reading", passage: "Acupuncture is widely used for pain relief. However, evidence about its effectiveness varies between conditions.", prompt: "Which phrase means ‘减轻疼痛’?", answer: "pain relief", errorOptions: ["定位错误", "词汇不足", "未识别同义替换", "长句理解"] },
      writing: { title: "正确句子到段落", type: "writing", prompt: "用 3—4 句英文说明学习英语对你未来研究的作用。", reference: "English will help me participate in graduate classes. It will also allow me to explain Chinese medicine more clearly. Therefore, improving my English is important for my future research.", errorOptions: ["语法", "用词", "逻辑", "重复表达"] },
      speaking: { title: "Speaking Part 1", type: "speaking", prompt: "Why do you want to improve your English?", reference: "I want to improve my English because I plan to attend graduate classes and discuss Chinese medicine with people from different countries.", errorOptions: ["卡顿", "语法", "词汇不足", "重复用词", "无法展开"] }
    }
  }
};
