const QUESTIONS = [
  { text: "When is my bin day?", target: "#residents-title" },
  { text: "How do I report a pothole?", target: "#residents-title" },
  { text: "How do I pay my rates?", target: "#residents-title" },
  { text: "How do I apply for a permit?", target: "#residents-title" },
  { text: "How do I have my say?", target: "#community-title" },
  { text: "Where can I find bushfire updates?", target: "#community-title" },
  { text: "What's on this month?", target: "#insight-title", tab: "news" },
  { text: "Where can I see meeting agendas?", target: "#insight-title", tab: "news" },
  { text: "How do I get involved locally?", target: "#insight-title", tab: "engagement" },
  { text: "What's there to see nearby?", target: "#insight-title", tab: "discover" },
  { text: "How do I contact Council?", target: "#contact-title" },
  { text: "Need help using this site?", target: "#accessibility-panel", accessibility: true },
];

const TITLES = [
  "What's your question?",
  "Here's another one:",
  "Still exploring?",
  "One more for you:",
];

function shuffle(items) {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

export function initQuestionGuide() {
  const list = document.querySelector("[data-question-bubbles]");
  const titleEl = document.querySelector("[data-question-guide-title]");

  if (!list) return;

  const visibleCount = Math.min(3, QUESTIONS.length);
  const shownItems = [];
  let pool = shuffle(QUESTIONS);
  let clickCount = 0;

  const nextQuestion = () => {
    if (!pool.length) pool = shuffle(QUESTIONS);

    const shownTexts = new Set(shownItems.map((item) => item?.text));
    const index = pool.findIndex((item) => !shownTexts.has(item.text));

    const [item] = pool.splice(index === -1 ? 0 : index, 1);
    return item;
  };

  const goToQuestion = (item) => {
    if (item.accessibility) {
      document.querySelector("[data-open-accessibility]")?.click();
    }

    if (item.tab) {
      document.querySelector(`.tab-button[data-tab="${item.tab}"]`)?.click();
    }

    document.querySelector(item.target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const applyToButton = (button, textEl, item) => {
    textEl.textContent = item.text;
    button.classList.remove("is-new");
    void button.offsetWidth;
    button.classList.add("is-new");
  };

  const handleClick = (button, textEl, index) => {
    goToQuestion(shownItems[index]);
    clickCount += 1;

    if (titleEl) {
      titleEl.textContent = TITLES[Math.min(clickCount, TITLES.length - 1)];
    }

    const replacement = nextQuestion();
    shownItems[index] = replacement;
    applyToButton(button, textEl, replacement);
  };

  list.innerHTML = "";

  for (let i = 0; i < visibleCount; i++) {
    const item = nextQuestion();
    shownItems.push(item);

    const li = document.createElement("li");
    li.className = "question-item";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "question-bubble";

    const indexBadge = document.createElement("span");
    indexBadge.className = "question-index";
    indexBadge.textContent = String(i + 1);
    indexBadge.setAttribute("aria-hidden", "true");

    const text = document.createElement("span");
    text.className = "question-text";
    text.textContent = item.text;

    button.append(indexBadge, text);
    button.addEventListener("click", () => handleClick(button, text, i));
    li.append(button);
    list.append(li);
  }
}
