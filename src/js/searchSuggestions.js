const SEARCH_SUGGESTIONS = [
  { text: "Bin collection day", target: "#residents-title" },
  { text: "Report a pothole", target: "#residents-title" },
  { text: "Report an issue", target: "#residents-title" },
  { text: "Pay my rates", target: "#residents-title" },
  { text: "Apply for a permit", target: "#residents-title" },
  { text: "Waste and recycling", target: "#residents-title" },
  { text: "Council meetings", target: "#insight-title", tab: "news" },
  { text: "Latest Council news", target: "#insight-title", tab: "news" },
  { text: "Have your say", target: "#community-title" },
  { text: "Bushfire information", target: "#community-title" },
  { text: "Community events", target: "#insight-title", tab: "news" },
  { text: "Get involved locally", target: "#insight-title", tab: "engagement" },
  { text: "Visitor information centre", target: "#insight-title", tab: "discover" },
  { text: "Things to do nearby", target: "#insight-title", tab: "discover" },
  { text: "Contact Council", target: "#contact-title" },
  { text: "Accessibility options", target: "#accessibility-panel", accessibility: true },
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlight(text, query) {
  if (!query) return text;

  const pattern = new RegExp(`(${escapeRegExp(query)})`, "ig");
  return text.replace(pattern, "<mark>$1</mark>");
}

export function initSearchSuggestions() {
  const form = document.querySelector("[data-search-form]");
  const input = document.querySelector("[data-search-input]");
  const list = document.querySelector("[data-search-suggestions]");

  if (!form || !input || !list) return;

  let matches = [];
  let activeIndex = -1;

  const goToSuggestion = (item) => {
    if (item.accessibility) {
      document.querySelector("[data-open-accessibility]")?.click();
    }

    if (item.tab) {
      document.querySelector(`.tab-button[data-tab="${item.tab}"]`)?.click();
    }

    document.querySelector(item.target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const closeList = () => {
    list.hidden = true;
    list.innerHTML = "";
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    matches = [];
    activeIndex = -1;
  };

  const setActive = (index) => {
    const options = Array.from(list.children);

    options.forEach((option, i) => option.classList.toggle("is-active", i === index));
    activeIndex = index;

    if (index >= 0) {
      input.setAttribute("aria-activedescendant", options[index].id);
    } else {
      input.removeAttribute("aria-activedescendant");
    }
  };

  const selectSuggestion = (item) => {
    input.value = item.text;
    closeList();
    goToSuggestion(item);
  };

  const renderList = (query) => {
    const value = query.trim();

    matches = value
      ? SEARCH_SUGGESTIONS.filter((item) => item.text.toLowerCase().includes(value.toLowerCase())).slice(0, 6)
      : [];

    if (!matches.length) {
      closeList();
      return;
    }

    list.innerHTML = "";

    matches.forEach((item, index) => {
      const option = document.createElement("li");
      option.id = `search-suggestion-${index}`;
      option.className = "search-suggestion";
      option.setAttribute("role", "option");
      option.innerHTML = highlight(item.text, value);
      option.addEventListener("mousedown", (event) => {
        event.preventDefault();
        selectSuggestion(item);
      });
      list.append(option);
    });

    list.hidden = false;
    input.setAttribute("aria-expanded", "true");
    setActive(-1);
  };

  input.addEventListener("input", () => renderList(input.value));

  input.addEventListener("keydown", (event) => {
    if (list.hidden) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((activeIndex + 1) % matches.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((activeIndex - 1 + matches.length) % matches.length);
    } else if (event.key === "Escape") {
      closeList();
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      selectSuggestion(matches[activeIndex]);
    }
  });

  input.addEventListener("blur", () => {
    window.setTimeout(closeList, 100);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const item = activeIndex >= 0 ? matches[activeIndex] : matches[0];
    if (item) selectSuggestion(item);
  });
}
