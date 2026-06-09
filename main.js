const form = document.querySelector("#training-form");
const typeInput = document.querySelector("#type");
const minutesInput = document.querySelector("#minutes");
const intensityInput = document.querySelector("#intensity");
const valueInput = document.querySelector("#value");
const valueLabel = document.querySelector("#value-label");
const valueUnit = document.querySelector("#value-unit");
const output = document.querySelector("#output");
const historyList = document.querySelector("#history-list");
const exampleButtons = document.querySelectorAll("[data-example]");

const history = [];

function getTrainingType() {
    return typeInput?.value || "sprint";
}

function readNumber(input) {
    return Number(input?.value || 0);
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
        valueInput.placeholder = selectedType === "technika" ? "napr. 8" : "napr. 120";
        valueInput.max = selectedType === "technika" ? "10" : "";
    }
}

function validateTraining(training) {
    if (training.minutes <= 0) {
        return "Delka treninku musi byt vetsi nez 0 minut.";
    }

    if (training.intensity < 1 || training.intensity > 10) {
        return "Intenzita musi byt mezi 1 a 10.";
    }

    if (training.value <= 0) {
        return "Dopln hodnotu podle zvoleneho typu treninku.";
    }

    if (training.type === "technika" && training.value > 10) {
        return "Technika se hodnoti od 1 do 10.";
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
        return "lehky";
    }

    if (score < 75) {
        return "stredni";
    }

    return "narocny";
}

function getAdvice(result) {
    if (result.level === "lehky") {
        return "Dobry lehci trenink. Priste muzes mirne zvednout intenzitu.";
    }

    if (result.level === "stredni") {
        return "Vyrovnany trenink. Tohle je dobra uroven pro pravidelne zlepsovani.";
    }

    return "Narocny trenink. Dej pozor na regeneraci a dalsi den zvol lehci zatez.";
}

function analyzeTraining(training) {
    const score = calculateScore(training);
    const calories = Math.round(training.minutes * training.intensity * 1.2);
    const level = getLevel(score);
    const result = {
        ...training,
        score,
        calories,
        level,
        advice: "",
    };

    result.advice = getAdvice(result);
    return result;
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
                <div><dt>Delka</dt><dd>${result.minutes} min</dd></div>
                <div><dt>Intenzita</dt><dd>${result.intensity}/10</dd></div>
                <div><dt>${settings.valueLabel}</dt><dd>${result.value} ${settings.unit}</dd></div>
                <div><dt>Kalorie</dt><dd>${result.calories} kcal</dd></div>
            </dl>
            <p class="badge">${result.level}</p>
            <p>${result.advice}</p>
        </article>
    `;
}

function renderHistory() {
    if (!historyList) {
        return;
    }

    historyList.innerHTML = history
        .map((item, index) => {
            const settings = trainingTypes[item.type];
            return `
                <li>
                    <span>${index + 1}. ${settings.title}</span>
                    <strong>${item.score}/100</strong>
                </li>
            `;
        })
        .join("");
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
        if (output) {
            output.innerHTML = `<p class="error">${error}</p>`;
        }
        return;
    }

    const result = analyzeTraining(training);
    history.unshift(result);
    renderResult(result);
    renderHistory();
}

typeInput?.addEventListener("change", updateValueField);
form?.addEventListener("submit", handleSubmit);

exampleButtons.forEach((button) => {
    button.addEventListener("click", () => fillExample(Number(button.dataset.example)));
});

fillExample(0);
