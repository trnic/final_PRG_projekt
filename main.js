import { exampleTrainings, trainingTypes } from "./data.js";
const HISTORY_KEY = "training-history";
const form = document.querySelector("#training-form");
const typeInput = document.querySelector("#type");
const minutesInput = document.querySelector("#minutes");
const intensityInput = document.querySelector("#intensity");
const valueInput = document.querySelector("#value");
const valueLabel = document.querySelector("#value-label");
const valueUnit = document.querySelector("#value-unit");
const output = document.querySelector("#output");
const historyList = document.querySelector("#history-list");
const clearHistoryButton = document.querySelector("#clear-history");
const exampleButtons = document.querySelectorAll("[data-example]");
const history = [];
function getTrainingType() {
    return typeInput?.value || "sprint";
}
function readNumber(input) {
    return Number(input?.value || 0);
}
function formatValue(result) {
    const settings = trainingTypes[result.type];
    if (result.type === "technika") {
        return `${result.value}${settings.unit}`;
    }
    return `${result.value} ${settings.unit}`;
}
function updateValueField() {
    const selectedType = getTrainingType();
    const settings = trainingTypes[selectedType];
    if (valueLabel) {
        valueLabel.textContent = settings.valueLabel;
    }
    if (valueUnit) {
        valueUnit.textContent = settings.unit;
    }
    if (valueInput) {
        valueInput.placeholder = selectedType === "technika" ? "např. 8" : "např. 120";
        valueInput.max = selectedType === "technika" ? "10" : "";
    }
}
function validateTraining(training) {
    if (training.minutes <= 0) {
        return "Délka tréninku musí být větší než 0 minut.";
    }
    if (training.intensity < 1 || training.intensity > 10) {
        return "Intenzita musí být mezi 1 a 10.";
    }
    if (training.value <= 0) {
        return "Doplň hodnotu podle zvoleného typu tréninku.";
    }
    if (training.type === "technika" && training.value > 10) {
        return "Technika se hodnotí od 1 do 10.";
    }
    return null;
}
function calculateScore(training) {
    const base = training.minutes * 0.7 + training.intensity * 6;
    const typeBonus = {
        sprint: training.value / 18,
        vytrvalost: training.value / 4,
        strelba: training.value / 3,
        technika: training.value * 5,
    };
    return Math.min(Math.round(base + typeBonus[training.type]), 100);
}
function getLevel(score) {
    if (score < 40) {
        return { label: "lehký", className: "lehky" };
    }
    if (score < 75) {
        return { label: "střední", className: "stredni" };
    }
    return { label: "náročný", className: "narocny" };
}
function getAdvice(level) {
    if (level === "lehký") {
        return "Dobrý lehčí trénink. Příště můžeš mírně zvednout intenzitu.";
    }
    if (level === "střední") {
        return "Vyrovnaný trénink. Tohle je dobrá úroveň pro pravidelné zlepšování.";
    }
    return "Náročný trénink. Dej pozor na regeneraci a další den zvol lehčí zátěž.";
}
function analyzeTraining(training) {
    const score = calculateScore(training);
    const calories = Math.round(training.minutes * training.intensity * 1.2);
    const levelInfo = getLevel(score);
    const result = {
        ...training,
        score,
        calories,
        level: levelInfo.label,
        levelClass: levelInfo.className,
        advice: getAdvice(levelInfo.label),
    };
    return result;
}
function showError(message) {
    if (output) {
        output.innerHTML = `<p class="error">${message}</p>`;
    }
}
function renderResult(result) {
    const settings = trainingTypes[result.type];
    if (!output) {
        return;
    }
    output.innerHTML = `
        <article class="result">
            <div>
                <p class="result-label">${settings.title}</p>
                <h2>${result.score}/100</h2>
            </div>
            <dl>
                <div><dt>Délka</dt><dd>${result.minutes} min</dd></div>
                <div><dt>Intenzita</dt><dd>${result.intensity}/10</dd></div>
                <div><dt>${settings.valueLabel}</dt><dd>${formatValue(result)}</dd></div>
                <div><dt>Kalorie</dt><dd>${result.calories} kcal</dd></div>
            </dl>
            <p class="badge badge-${result.levelClass}">${result.level}</p>
            <p>${result.advice}</p>
        </article>
    `;
}
function saveHistory() {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}
function loadHistory() {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (!saved) {
        return;
    }
    try {
        const loaded = JSON.parse(saved);
        loaded.forEach((item) => {
            if (!item.levelClass) {
                const levelInfo = getLevel(item.score);
                item.level = levelInfo.label;
                item.levelClass = levelInfo.className;
            }
            history.push(item);
        });
    }
    catch {
        localStorage.removeItem(HISTORY_KEY);
    }
}
function renderHistory() {
    if (!historyList) {
        return;
    }
    if (history.length === 0) {
        historyList.innerHTML = `<li class="empty">Zatím žádný trénink.</li>`;
        return;
    }
    historyList.innerHTML = history
        .map((item, index) => {
        const settings = trainingTypes[item.type];
        return `
                <li data-index="${index}">
                    <span>${index + 1}. ${settings.title}</span>
                    <strong>${item.score}/100</strong>
                </li>
            `;
    })
        .join("");
    const items = historyList.querySelectorAll("li[data-index]");
    items.forEach((item) => {
        item.addEventListener("click", () => {
            const index = Number(item.dataset.index);
            renderResult(history[index]);
        });
    });
}
function addToHistory(result) {
    history.unshift(result);
    saveHistory();
    renderHistory();
}
function fillExample(index) {
    const example = exampleTrainings[index];
    if (!example || !typeInput || !minutesInput || !intensityInput || !valueInput) {
        return;
    }
    typeInput.value = example.type;
    minutesInput.value = String(example.minutes);
    intensityInput.value = String(example.intensity);
    valueInput.value = String(example.value);
    updateValueField();
    const result = analyzeTraining(example);
    renderResult(result);
}
function handleSubmit(event) {
    event.preventDefault();
    const training = {
        type: getTrainingType(),
        minutes: readNumber(minutesInput),
        intensity: readNumber(intensityInput),
        value: readNumber(valueInput),
    };
    const error = validateTraining(training);
    if (error) {
        showError(error);
        return;
    }
    const result = analyzeTraining(training);
    addToHistory(result);
    renderResult(result);
}
function clearHistory() {
    history.length = 0;
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
    if (output) {
        output.textContent = "Historie byla smazána. Zadej nový trénink.";
    }
}
typeInput?.addEventListener("change", updateValueField);
form?.addEventListener("submit", handleSubmit);
clearHistoryButton?.addEventListener("click", clearHistory);
exampleButtons.forEach((button) => {
    button.addEventListener("click", () => fillExample(Number(button.dataset.example)));
});
loadHistory();
renderHistory();
if (history.length > 0) {
    renderResult(history[0]);
}
else {
    fillExample(0);
}
