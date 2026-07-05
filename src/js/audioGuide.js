export function initAudioGuide() {
  const audioGuideButton = document.getElementById("audio-guide-toggle");
  const focusableSelector = "a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])";
  let audioGuideEnabled = localStorage.getItem("audio-guide") === "true";

  function getReadableText(element) {
    if (!element) return "";

    const ariaLabel = element.getAttribute("aria-label");
    const placeholder = element.getAttribute("placeholder");
    const text = element.innerText || element.textContent || "";

    if (ariaLabel) return ariaLabel;
    if (placeholder) return placeholder;
    return text.replace(/\s+/g, " ").trim();
  }

  function speakText(text) {
    if (!audioGuideEnabled || !("speechSynthesis" in window) || !text) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-AU";
    utterance.rate = 0.88;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  function syncAudioButton() {
    audioGuideButton.setAttribute("aria-pressed", String(audioGuideEnabled));
    audioGuideButton.textContent = audioGuideEnabled ? "Audio on" : "Audio guide";
  }

  syncAudioButton();

  audioGuideButton.addEventListener("click", () => {
    audioGuideEnabled = !audioGuideEnabled;
    localStorage.setItem("audio-guide", String(audioGuideEnabled));
    syncAudioButton();

    if (audioGuideEnabled) {
      speakText("Audio guide on. Use the Tab key to move through links, buttons, and search.");
    } else if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  });

  document.addEventListener("focusin", (event) => {
    const target = event.target.closest(focusableSelector);
    if (!target || target === audioGuideButton) return;

    const label = getReadableText(target);
    speakText(label);
  });
}
