import "./styles/base.css";
import "./styles/header.css";
import "./styles/hero.css";
import "./styles/sections.css";
import "./styles/responsive.css";

import { initAccessibilityPanel } from "./js/accessibility.js";
import { initAudioGuide } from "./js/audioGuide.js";
import { initInsightTabs } from "./js/tabs.js";
import { initScrollCover } from "./js/scrollCover.js";

initAccessibilityPanel();
initAudioGuide();
initInsightTabs();
initScrollCover();
