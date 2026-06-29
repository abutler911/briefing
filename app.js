// ── State ──
const LS = (key) => `newtab_${key}`;
const get = (key) => localStorage.getItem(LS(key));
const set = (key, val) => localStorage.setItem(LS(key), val);

// ── Clock ──
function updateClock() {
  const now = new Date();
  const fmt = get("clock_format") || "24h";
  const showSeconds = get("clock_seconds") === "true";
  let h = now.getHours();
  let suffix = "";
  if (fmt === "12h") {
    suffix = h >= 12 ? "pm" : "am";
    h = h % 12 || 12;
  }
  const hh = fmt === "12h" ? String(h) : String(h).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  let time = `${hh}:${m}`;
  if (showSeconds) time += `:${String(now.getSeconds()).padStart(2, "0")}`;
  document.getElementById("clock").innerHTML = suffix
    ? `${time}<span class="clock-ampm">${suffix}</span>`
    : time;
}
setInterval(updateClock, 1000);
updateClock();

// ── Greeting ──
function updateGreeting() {
  const h = new Date().getHours();
  const phase = h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
  const name = (get("user_name") || "").trim();
  document.getElementById("greeting").textContent = name
    ? `Good ${phase}, ${name}`
    : `Good ${phase}`;
}
updateGreeting();
setInterval(updateGreeting, 60000);

// ── Date ──
function updateDate() {
  const now = new Date();
  const opts = { weekday: "long", month: "long", day: "numeric" };
  document.getElementById("dateDisplay").textContent = now.toLocaleDateString(
    "en-US",
    opts,
  );
}
updateDate();

// ── Seeded daily random ──
function dayOfYear() {
  const now = new Date();
  return Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
}

function seededRandom(seed) {
  // Simple hash-based PRNG for daily rotation
  let h = seed;
  return function () {
    h = (h * 16807 + 0) % 2147483647;
    return (h - 1) / 2147483646;
  };
}

function dailyPick(arr, offset = 0) {
  const rng = seededRandom(
    dayOfYear() * 31 + offset + new Date().getFullYear() * 7,
  );
  return arr[Math.floor(rng() * arr.length)];
}

// ── Time-based rotation (background + quote) ──
const ROTATE_HOURS = 2;
function periodIndex() {
  return Math.floor(Date.now() / (ROTATE_HOURS * 3600000));
}

// ── Mantra ──
const mantras = [
  "Breathe.",
  "Begin.",
  "Stay sharp.",
  "Trust the process.",
  "One thing at a time.",
  "Commit.",
  "Be here.",
  "Do the work.",
  "Less noise.",
  "Forward.",
  "Keep climbing.",
  "Steady hands.",
  "Stay the course.",
  "Earn it.",
  "Focus.",
  "Show up.",
  "Move.",
  "Build.",
  "No shortcuts.",
  "This matters.",
  "Eyes up.",
  "Simplify.",
  "Finish what you start.",
  "Make it count.",
  "Hold the line.",
];

const mantraEl = document.getElementById("mantra");
mantraEl.textContent = dailyPick(mantras, 0);

// ── Todos ──
function getTodos() {
  try {
    const today = new Date().toDateString();
    const stored = JSON.parse(get("todos") || "{}");
    if (stored.date !== today) {
      // Keep undone tasks, clear done ones for new day
      const carried = (stored.items || []).filter((t) => !t.done);
      return { date: today, items: carried };
    }
    return stored;
  } catch {
    return { date: new Date().toDateString(), items: [] };
  }
}

function saveTodos(data) {
  set("todos", JSON.stringify(data));
}

function renderTodos() {
  const data = getTodos();
  const list = document.getElementById("todoList");
  list.innerHTML = "";
  data.items.forEach((todo, i) => {
    const li = document.createElement("li");
    li.className = `todo-item${todo.done ? " done" : ""}`;
    li.dataset.index = i;
    li.innerHTML = `
      <div class="todo-check${todo.done ? " done" : ""}" data-action="toggle"></div>
      <span class="todo-text">${escHtml(todo.text)}</span>
      <button class="todo-delete" data-action="delete">×</button>
    `;
    list.appendChild(li);
  });
}

function addTodo(text) {
  if (!text.trim()) return;
  const data = getTodos();
  data.items.push({ text: text.trim(), done: false });
  saveTodos(data);
  renderTodos();
}

function toggleTodo(i) {
  const data = getTodos();
  data.items[i].done = !data.items[i].done;
  saveTodos(data);
  renderTodos();
}

function deleteTodo(i) {
  const data = getTodos();
  data.items.splice(i, 1);
  saveTodos(data);
  renderTodos();
}

function escHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

renderTodos();

// ── Quotes ──
const quotes = [
  { text: "The only way out is through.", attr: "Robert Frost" },
  {
    text: "We suffer more often in imagination than in reality.",
    attr: "Seneca",
  },
  { text: "The obstacle is the way.", attr: "Marcus Aurelius" },
  {
    text: "What a disgrace it is for a man to grow old without ever seeing the beauty and strength of which his body is capable.",
    attr: "Socrates",
  },
  {
    text: "A man who dares to waste one hour of time has not discovered the value of life.",
    attr: "Charles Darwin",
  },
  {
    text: "Do not go where the path may lead, go instead where there is no path and leave a trail.",
    attr: "Emerson",
  },
  {
    text: "It is not the critic who counts; not the man who points out how the strong man stumbles.",
    attr: "Theodore Roosevelt",
  },
  {
    text: "The best time to plant a tree was twenty years ago. The second best time is now.",
    attr: "Proverb",
  },
  {
    text: "You must be ready to burn yourself in your own flame. How could you become new, if you had not first become ashes?",
    attr: "Nietzsche",
  },
  {
    text: "The world breaks everyone, and afterward, some are strong at the broken places.",
    attr: "Hemingway",
  },
  {
    text: "Ships in harbor are safe, but that's not what ships are built for.",
    attr: "John A. Shedd",
  },
  { text: "Discipline equals freedom.", attr: "Jocko Willink" },
  {
    text: "The man who moves a mountain begins by carrying away small stones.",
    attr: "Confucius",
  },
  {
    text: "He who has a why to live can bear almost any how.",
    attr: "Nietzsche",
  },
  {
    text: "No man is free who is not master of himself.",
    attr: "Epictetus",
  },
  {
    text: "Waste no more time arguing about what a good man should be. Be one.",
    attr: "Marcus Aurelius",
  },
  {
    text: "The happiness of your life depends upon the quality of your thoughts.",
    attr: "Marcus Aurelius",
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    attr: "Confucius",
  },
  {
    text: "Difficulties strengthen the mind, as labor does the body.",
    attr: "Seneca",
  },
  {
    text: "The impediment to action advances action. What stands in the way becomes the way.",
    attr: "Marcus Aurelius",
  },
  {
    text: "First say to yourself what you would be; and then do what you have to do.",
    attr: "Epictetus",
  },
  { text: "Fortune favors the bold.", attr: "Virgil" },
  {
    text: "Every man dies. Not every man really lives.",
    attr: "William Wallace",
  },
  {
    text: "There is nothing outside of yourself that can ever enable you to get better, stronger, richer, quicker, or smarter. Everything is within.",
    attr: "Miyamoto Musashi",
  },
  {
    text: "A gem cannot be polished without friction, nor a man perfected without trials.",
    attr: "Seneca",
  },
  {
    text: "The mind is everything. What you think, you become.",
    attr: "Buddha",
  },
  {
    text: "To see what is right and not do it is a want of courage.",
    attr: "Confucius",
  },
  { text: "The unexamined life is not worth living.", attr: "Socrates" },
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    attr: "Aristotle",
  },
  {
    text: "If you are going through hell, keep going.",
    attr: "Churchill",
  },
];

// quoteNudge advances the pick on manual shuffle; resets when the period rolls over
let quoteNudge = 0;
function showQuote() {
  const rng = seededRandom(periodIndex() * 31 + 17 + 7); // offset 17 so it doesn't share a seed with other picks
  const base = Math.floor(rng() * quotes.length);
  const quote = quotes[(base + quoteNudge) % quotes.length];
  document.getElementById("quoteDisplay").innerHTML = `
    "${quote.text}"
    <div class="quote-attr">${quote.attr}</div>
  `;
}

function shuffleQuote() {
  quoteNudge++;
  showQuote();
}

showQuote();

// ── Weather ──
function weatherEmoji(w) {
  const id = w.id;
  const night = (w.icon || "").endsWith("n");
  if (id >= 200 && id < 300) return "⛈"; // thunderstorm
  if (id >= 300 && id < 400) return "🌦"; // drizzle
  if (id >= 500 && id < 600) return "🌧"; // rain
  if (id >= 600 && id < 700) return "❄"; // snow
  if (id >= 700 && id < 800) return "🌫"; // atmosphere (mist/fog/haze)
  if (id === 800) return night ? "🌙" : "☀"; // clear
  if (id > 800) return "☁"; // clouds
  return "";
}

function setWeatherError(msg) {
  document.getElementById("weatherIcon").textContent = "";
  document.getElementById("weatherDesc").textContent = msg;
  document.getElementById("weatherExtra").textContent = "";
}

async function fetchWeather() {
  const apiKey = get("weather_api_key");
  const location = get("weather_location") || "Salt Lake City";
  const unit = get("weather_unit") || "imperial";
  if (!apiKey) return;

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=${unit}`,
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      // OWM returns a JSON { cod, message } even on errors
      if (res.status === 401)
        setWeatherError("key not active yet · can take ~2 hrs");
      else if (res.status === 404)
        setWeatherError("location not found · check settings");
      else if (res.status === 429)
        setWeatherError("rate limited · try again later");
      else
        setWeatherError(
          data.message ? data.message.toLowerCase() : "weather unavailable",
        );
      return;
    }
    const symbol = unit === "imperial" ? "F" : "C";
    const r = (t) => Math.round(t);
    document.getElementById("weatherIcon").textContent = weatherEmoji(
      data.weather[0],
    );
    document.getElementById("weatherTemp").textContent =
      `${r(data.main.temp)}°${symbol}`;
    document.getElementById("weatherDesc").textContent =
      `${data.weather[0].description} · ${location}`;
    document.getElementById("weatherExtra").textContent =
      `feels ${r(data.main.feels_like)}° · ↑${r(data.main.temp_max)}° ↓${r(data.main.temp_min)}°`;
  } catch (e) {
    setWeatherError("weather unavailable · network error");
  }
}

fetchWeather();
setInterval(fetchWeather, 600000); // refresh every 10 min

// ── Background ──
// Curated fallback set, used when no Unsplash Access Key is configured.
const bgImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80", // mountains
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1920&q=80", // fog mountains
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80", // forest
  "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=1920&q=80", // sunrise
  "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1920&q=80", // valley
];

const UNSPLASH_UTM = "?utm_source=briefing&utm_medium=referral";

function applyBackground(url, onError) {
  const bgEl = document.getElementById("bgImage");
  const preload = new Image();
  preload.onload = () => {
    bgEl.style.backgroundImage = `url(${url})`;
    bgEl.classList.add("loaded");
  };
  if (onError) preload.onerror = onError;
  preload.src = url;
}

// Built with DOM nodes (no innerHTML) for the photo credit Unsplash's API
// guidelines require when using their photos.
function showCredit(credit) {
  const el = document.getElementById("photoCredit");
  el.textContent = "";
  if (!credit) return;
  el.appendChild(document.createTextNode("Photo by "));
  const author = document.createElement("a");
  author.href = credit.link + UNSPLASH_UTM;
  author.target = "_blank";
  author.rel = "noopener";
  author.textContent = credit.name;
  el.appendChild(author);
  el.appendChild(document.createTextNode(" / "));
  const unsplash = document.createElement("a");
  unsplash.href = "https://unsplash.com/" + UNSPLASH_UTM;
  unsplash.target = "_blank";
  unsplash.rel = "noopener";
  unsplash.textContent = "Unsplash";
  el.appendChild(unsplash);
}

function loadCurated(attempt = 0) {
  showCredit(null);
  if (attempt >= bgImages.length) return; // every image failed; keep base bg
  const img = bgImages[(periodIndex() + attempt) % bgImages.length];
  applyBackground(img, () => loadCurated(attempt + 1));
}

// Fetch a random landscape photo from Unsplash, cached per rotation period so
// we don't burn the API rate limit on every new tab.
async function fetchUnsplashPhoto() {
  const key = get("unsplash_key");
  if (!key) return null;
  const period = periodIndex();
  try {
    const cached = JSON.parse(get("bg_cache") || "{}");
    if (cached.period === period && cached.url) return cached;
  } catch {}
  try {
    const res = await fetch(
      `https://api.unsplash.com/photos/random?orientation=landscape&content_filter=high&query=landscape,nature,mountains&client_id=${encodeURIComponent(key)}`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    const photo = Array.isArray(data) ? data[0] : data;
    if (!photo || !photo.urls) return null;
    const cache = {
      period,
      url: `${photo.urls.raw}&w=1920&q=80&fit=crop`,
      credit: { name: photo.user.name, link: photo.user.links.html },
      download: photo.links.download_location,
    };
    set("bg_cache", JSON.stringify(cache));
    // Unsplash API guidelines: ping the download endpoint when a photo is used
    fetch(`${cache.download}&client_id=${encodeURIComponent(key)}`).catch(
      () => {},
    );
    return cache;
  } catch {
    return null;
  }
}

async function loadBackground() {
  const photo = await fetchUnsplashPhoto();
  if (photo && photo.url) {
    applyBackground(photo.url, () => loadCurated());
    showCredit(photo.credit);
  } else {
    loadCurated();
  }
}
loadBackground();

// Re-roll background + quote when the rotation period changes
let currentPeriod = periodIndex();
setInterval(() => {
  const p = periodIndex();
  if (p !== currentPeriod) {
    currentPeriod = p;
    quoteNudge = 0;
    loadBackground();
    showQuote();
  }
}, 60000);

// ── Settings ──
let selectedUnit = get("weather_unit") || "imperial";
let selectedClockFormat = get("clock_format") || "24h";
let selectedSeconds = get("clock_seconds") === "true";
let selectedEngine = get("search_engine") || "google";

function setSearchEngine(engine) {
  selectedEngine = engine;
  document.querySelectorAll(".engine-btn").forEach((btn) => {
    const on = btn.dataset.engine === engine;
    btn.style.borderColor = on ? "var(--crimson)" : "";
    btn.style.color = on ? "var(--text)" : "";
  });
}

function setUnit(u) {
  selectedUnit = u;
  document.querySelectorAll(".unit-btn").forEach((btn) => {
    btn.style.borderColor = btn.dataset.unit === u ? "var(--crimson)" : "";
    btn.style.color = btn.dataset.unit === u ? "var(--text)" : "";
  });
}

function setClockFormat(f) {
  selectedClockFormat = f;
  document.querySelectorAll(".fmt-btn").forEach((btn) => {
    btn.style.borderColor = btn.dataset.fmt === f ? "var(--crimson)" : "";
    btn.style.color = btn.dataset.fmt === f ? "var(--text)" : "";
  });
}

function toggleSeconds() {
  selectedSeconds = !selectedSeconds;
  document.getElementById("secondsBtn").textContent =
    `Seconds: ${selectedSeconds ? "on" : "off"}`;
}

function openSettings() {
  document.getElementById("nameInput").value = get("user_name") || "";
  document.getElementById("apiKeyInput").value = get("weather_api_key") || "";
  document.getElementById("unsplashKeyInput").value = get("unsplash_key") || "";
  document.getElementById("locationInput").value =
    get("weather_location") || "Salt Lake City";
  setUnit(get("weather_unit") || "imperial");
  setClockFormat(get("clock_format") || "24h");
  setSearchEngine(get("search_engine") || "google");
  selectedSeconds = get("clock_seconds") === "true";
  document.getElementById("secondsBtn").textContent =
    `Seconds: ${selectedSeconds ? "on" : "off"}`;
  document.getElementById("settingsOverlay").classList.add("open");
}

function closeSettings() {
  document.getElementById("settingsOverlay").classList.remove("open");
}

function saveSettings() {
  const prevUnsplashKey = get("unsplash_key") || "";
  set("user_name", document.getElementById("nameInput").value.trim());
  set("weather_api_key", document.getElementById("apiKeyInput").value.trim());
  const unsplashKey = document.getElementById("unsplashKeyInput").value.trim();
  set("unsplash_key", unsplashKey);
  set(
    "weather_location",
    document.getElementById("locationInput").value.trim() || "Salt Lake City",
  );
  set("weather_unit", selectedUnit);
  set("clock_format", selectedClockFormat);
  set("clock_seconds", selectedSeconds);
  set("search_engine", selectedEngine);
  closeSettings();
  updateClock();
  updateGreeting();
  fetchWeather();
  // If the Unsplash key changed, drop the cached photo and reload the background
  if (unsplashKey !== prevUnsplashKey) {
    set("bg_cache", "");
    loadBackground();
  }
}

// ── Search ──
const SEARCH_ENGINES = {
  google: "https://www.google.com/search?q=",
  duckduckgo: "https://duckduckgo.com/?q=",
  bing: "https://www.bing.com/search?q=",
};

function runSearch(query) {
  const q = query.trim();
  if (!q) return;
  const engine = get("search_engine") || "google";
  const base = SEARCH_ENGINES[engine] || SEARCH_ENGINES.google;
  window.location.href = base + encodeURIComponent(q);
}

// ── Main focus ──
function loadFocus() {
  const today = new Date().toDateString();
  let f = {};
  try {
    f = JSON.parse(get("focus") || "{}");
  } catch {}
  document.getElementById("focusInput").value =
    f.date === today ? f.text || "" : "";
}

function saveFocus(text) {
  set("focus", JSON.stringify({ date: new Date().toDateString(), text }));
}

loadFocus();

// ── Quick links ──
function getLinks() {
  try {
    return JSON.parse(get("links") || "[]");
  } catch {
    return [];
  }
}

function saveLinks(links) {
  set("links", JSON.stringify(links));
}

function faviconFor(url) {
  try {
    const host = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
  } catch {
    return "";
  }
}

function labelFor(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function normalizeUrl(raw) {
  const v = raw.trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

// Built with DOM nodes (not innerHTML) so user-provided URLs/labels can't
// inject markup and to keep the AMO validator happy.
function renderLinks() {
  const el = document.getElementById("quickLinks");
  el.textContent = "";
  const links = getLinks();
  links.forEach((link, i) => {
    const tile = document.createElement("a");
    tile.className = "ql-tile";
    tile.href = link.url;
    tile.title = link.label || link.url;

    const img = document.createElement("img");
    img.className = "ql-icon";
    img.alt = "";
    img.src = faviconFor(link.url);
    tile.appendChild(img);

    const label = document.createElement("span");
    label.className = "ql-label";
    label.textContent = link.label || labelFor(link.url);
    tile.appendChild(label);

    const del = document.createElement("button");
    del.className = "ql-del";
    del.dataset.index = i;
    del.title = "Remove";
    del.textContent = "×";
    tile.appendChild(del);

    el.appendChild(tile);
  });

  const add = document.createElement("button");
  add.className = "ql-add";
  add.id = "qlAdd";
  add.title = "Add a quick link";
  add.textContent = "+";
  el.appendChild(add);
}

function addLink() {
  const raw = window.prompt("Quick link URL (e.g. github.com):");
  if (raw === null) return;
  const url = normalizeUrl(raw);
  if (!url) return;
  const name = (window.prompt("Label (optional):", labelFor(url)) || "").trim();
  const links = getLinks();
  links.push({ url, label: name || labelFor(url) });
  saveLinks(links);
  renderLinks();
}

function deleteLink(i) {
  const links = getLinks();
  links.splice(i, 1);
  saveLinks(links);
  renderLinks();
}

renderLinks();

// ── Event wiring ──
// Extension pages run under a strict CSP (script-src 'self'), so inline
// onclick handlers are blocked. Everything is wired up here instead.
document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  runSearch(document.getElementById("searchInput").value);
});

document.getElementById("focusInput").addEventListener("input", (e) => {
  saveFocus(e.target.value);
});

document.getElementById("quickLinks").addEventListener("click", (e) => {
  if (e.target.id === "qlAdd") {
    e.preventDefault();
    addLink();
    return;
  }
  const del = e.target.closest(".ql-del");
  if (del) {
    e.preventDefault();
    deleteLink(Number(del.dataset.index));
  }
});

document.getElementById("todoAdd").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTodo(e.target.value);
    e.target.value = "";
  }
});

document.getElementById("todoList").addEventListener("click", (e) => {
  const li = e.target.closest(".todo-item");
  if (!li) return;
  const i = Number(li.dataset.index);
  const action = e.target.dataset.action;
  if (action === "toggle") toggleTodo(i);
  else if (action === "delete") deleteTodo(i);
});

document.getElementById("quoteDisplay").addEventListener("click", shuffleQuote);
document.getElementById("weatherDisplay").addEventListener("click", openSettings);
document.getElementById("settingsBtn").addEventListener("click", openSettings);

const settingsOverlay = document.getElementById("settingsOverlay");
settingsOverlay.addEventListener("click", (e) => {
  if (e.target === settingsOverlay) closeSettings();
});

document
  .querySelectorAll(".unit-btn")
  .forEach((btn) =>
    btn.addEventListener("click", () => setUnit(btn.dataset.unit)),
  );
document
  .querySelectorAll(".fmt-btn")
  .forEach((btn) =>
    btn.addEventListener("click", () => setClockFormat(btn.dataset.fmt)),
  );
document
  .querySelectorAll(".engine-btn")
  .forEach((btn) =>
    btn.addEventListener("click", () => setSearchEngine(btn.dataset.engine)),
  );
document.getElementById("secondsBtn").addEventListener("click", toggleSeconds);
document.getElementById("cancelBtn").addEventListener("click", closeSettings);
document.getElementById("saveBtn").addEventListener("click", saveSettings);
