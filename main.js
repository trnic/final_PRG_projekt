const MAX_DIFFICULTY_SCORE = 100;

const TRAINING_FIELD_MAPPING = {
    sprint: ['duration', 'intensity', 'distance'],
    endurance: ['duration', 'intensity', 'averageHeartRate'],
    shooting: ['duration', 'intensity', 'shots', 'accuracy'],
    skills: ['duration', 'intensity', 'technique', 'ballControl'],
};

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
function formatDifficulty(score) {
    if (score < 35)
        return 'nízká';
    if (score < 70)
        return 'střední';
    return 'vysoká';
}
function formatTrainingDate(performedAt) {
    return new Date(performedAt).toLocaleString('cs-CZ');
}
function validateTrainingData(data) {
    const issues = [];
    if (!Number.isFinite(data.duration) || data.duration <= 0) {
        issues.push({ field: 'duration', message: 'Délka trvání musí být kladná hodnota.' });
    }
    if (!Number.isFinite(data.intensity) || data.intensity < 1 || data.intensity > 10) {
        issues.push({ field: 'intensity', message: 'Intenzita musí být v rozmezí 1 až 10.' });
    }
    switch (data.type) {
        case 'sprint':
            if (!Number.isFinite(data.distance) || data.distance <= 0) {
                issues.push({ field: 'distance', message: 'Vzdálenost musí být kladné číslo.' });
            }
            break;
        case 'endurance':
            if (!Number.isFinite(data.averageHeartRate) || data.averageHeartRate < 40 || data.averageHeartRate > 220) {
                issues.push({ field: 'averageHeartRate', message: 'Průměrný tep musí být mezi 40 a 220.' });
            }
            break;
        case 'shooting':
            if (!Number.isFinite(data.shots) || data.shots <= 0) {
                issues.push({ field: 'shots', message: 'Počet střel musí být kladný.' });
            }
            if (!Number.isFinite(data.accuracy) || data.accuracy < 0 || data.accuracy > 1) {
                issues.push({ field: 'accuracy', message: 'Přesnost musí být v rozmezí 0 až 1.' });
            }
            break;
        case 'skills':
            if (!Number.isFinite(data.technique) || data.technique < 0 || data.technique > 10) {
                issues.push({ field: 'technique', message: 'Technika musí být v rozmezí 0 až 10.' });
            }
            if (!Number.isFinite(data.ballControl) || data.ballControl < 0 || data.ballControl > 10) {
                issues.push({ field: 'ballControl', message: 'Kontrola míče musí být v rozmezí 0 až 10.' });
            }
            break;
    }
    return {
        isValid: issues.length === 0,
        issues,
    };
}
function formatValidationErrors(issues) {
    return issues.map(issue => issue.message).join(' ');
}
function createValidationErrorMessage(index, data, issues) {
    return `Záznam č. ${index + 1} (${data.type}) je neplatný: ${formatValidationErrors(issues)}`;
}
function readFormInputsForTraining(element) {
    const inputs = element.querySelectorAll('.training-fields input[type="number"]');
    return Array.from(inputs).map(input => parseFloat(input.value) || 0);
}
function buildTrainingDataFromForm(trainingType, formValues) {
    const type = trainingType;
    const fieldMapping = TRAINING_FIELD_MAPPING[type];
    if (!fieldMapping || formValues.length < fieldMapping.length) {
        return null;
    }
    const baseData = {
        type,
        duration: formValues[0],
        intensity: formValues[1],
    };
    switch (type) {
        case 'sprint':
            return {
                ...baseData,
                distance: formValues[2],
            };
        case 'endurance':
            return {
                ...baseData,
                averageHeartRate: formValues[2],
            };
        case 'shooting':
            return {
                ...baseData,
                shots: formValues[2],
                accuracy: formValues[3],
            };
        case 'skills':
            return {
                ...baseData,
                technique: formValues[2],
                ballControl: formValues[3],
            };
        default:
            return null;
    }
}
function analyzeUserTraining(formData, previousRecord, previousScore, allAnalyses) {
    const validation = validateTrainingData(formData);
    if (!validation.isValid) {
        throw new Error(formatValidationErrors(validation.issues));
    }
    const sourceRecord = buildTrainingRecord(formData, 0);
    const training = createTrainingFromData(formData);
    const analysis = analyzeTraining(training, sourceRecord, 0, previousRecord, previousScore, allAnalyses);
    return analysis;
}
function createFormSubmitHandler(detailsElement, analysisHistory, output) {
    return function (event) {
        event.preventDefault();
        const button = event.target;
        try {
            const trainingType = detailsElement.dataset.type;
            if (!trainingType) {
                throw new Error('Neznámý typ tréninku.');
            }
            const formValues = readFormInputsForTraining(detailsElement);
            const formData = buildTrainingDataFromForm(trainingType, formValues);
            if (!formData) {
                throw new Error('Chyba při čtení formuláře.');
            }
            const previousAnalysis = analysisHistory.length > 0 ? analysisHistory[analysisHistory.length - 1] : null;
            const previousScore = previousAnalysis?.difficultyScore ?? null;
            const previousRecord = previousAnalysis
                ? {
                    id: previousAnalysis.id,
                    performedAt: previousAnalysis.performedAt,
                    type: previousAnalysis.type,
                    duration: previousAnalysis.duration,
                    intensity: previousAnalysis.intensity,
                    ...(previousAnalysis.type === 'sprint' && { distance: previousAnalysis.distance }),
                    ...(previousAnalysis.type === 'endurance' && { averageHeartRate: previousAnalysis.averageHeartRate }),
                    ...(previousAnalysis.type === 'shooting' && { shots: previousAnalysis.shots, accuracy: previousAnalysis.accuracy }),
                    ...(previousAnalysis.type === 'skills' && { technique: previousAnalysis.technique, ballControl: previousAnalysis.ballControl }),
                }
                : null;
            const analysis = analyzeUserTraining(formData, previousRecord, previousScore, analysisHistory);
            if (analysis) {
                analysisHistory.push(analysis);
                renderTrainingAnalysis([analysis], output);
            }
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Došlo k chybě při zpracování formuláře.';
            console.error(message);
            renderValidationError(message, output);
        }
    };
}
function initializeFormHandlers(analysisHistory, output) {
    const detailsElements = document.querySelectorAll('.training-item[data-type]');
    detailsElements.forEach(details => {
        const button = details.querySelector('.btn-submit');
        if (button) {
            button.addEventListener('click', createFormSubmitHandler(details, analysisHistory, output));
        }
    });
}

class Training {
    _duration;
    _intensity;
    constructor(duration, intensity) {
        // Základní kontrola, aby neprošly nesmyslné hodnoty
        if (duration <= 0)
            throw new Error("Délka trvání musí být kladná.");
        if (intensity < 1 || intensity > 10)
            throw new Error("Intenzita musí být mezi 1 a 10.");
        this._duration = duration;
        this._intensity = intensity;
    }
    /** Společný textový výpis pro všechny typy tréninku */
    getSummary() {
        return `Trénink: trvání ${this._duration} min, intenzita ${this._intensity}/10`;
    }
    getDifficultySummary() {
        const score = this.calculateDifficultyScore();
        return `Náročnost: ${score.toFixed(0)} / ${MAX_DIFFICULTY_SCORE} (${formatDifficulty(score)})`;
    }
}
class SprintTraining extends Training {
    distance;
    constructor(duration, intensity, distance) {
        super(duration, intensity);
        // Sprint potřebuje kladnou vzdálenost
        if (distance <= 0)
            throw new Error("Vzdálenost musí být kladná.");
        this.distance = distance;
    }
    calculateCalories() {
        // Jednoduchý odhad kalorií pro sprint
        return this._duration * this._intensity * 1.5;
    }
    calculateLoad() {
        return (this.distance / this._duration) * this._intensity;
    }
    calculateDifficultyScore() {
        const durationScore = clamp(this._duration * 0.5, 0, 30);
        const intensityScore = this._intensity * 3;
        const distanceScore = clamp(this.distance / 25, 0, 40);
        return clamp(durationScore + intensityScore + distanceScore, 0, MAX_DIFFICULTY_SCORE);
    }
}
class EnduranceTraining extends Training {
    averageHeartRate;
    constructor(duration, intensity, avgHeartRate) {
        super(duration, intensity);
        // U vytrvalosti hlídáme tepovou frekvenci
        if (avgHeartRate <= 0)
            throw new Error("Tepová frekvence musí být kladná.");
        this.averageHeartRate = avgHeartRate;
    }
    calculateCalories() {
        // Jednoduchý odhad kalorií pro vytrvalost
        return this._duration * (this.averageHeartRate / 10);
    }
    calculateLoad() {
        return this._duration * this._intensity;
    }
    calculateDifficultyScore() {
        const durationScore = clamp(this._duration * 0.5, 0, 30);
        const intensityScore = this._intensity * 3;
        const heartRateScore = clamp((this.averageHeartRate - 100) / 1.5, 0, 40);
        return clamp(durationScore + intensityScore + heartRateScore, 0, MAX_DIFFICULTY_SCORE);
    }
}
class ShootingTraining extends Training {
    shots;
    accuracy;
    constructor(duration, intensity, shots, accuracy) {
        super(duration, intensity);
        // Střelba používá počet pokusů a přesnost
        this.shots = shots;
        this.accuracy = accuracy;
    }
    calculateCalories() {
        // Střelba má menší energetickou náročnost
        return this._duration * 5;
    }
    calculateLoad() {
        return this.shots * this.accuracy;
    }
    calculateDifficultyScore() {
        const durationScore = clamp(this._duration * 0.4, 0, 25);
        const intensityScore = this._intensity * 3;
        const shotsScore = clamp(this.shots / 2.5, 0, 25);
        const accuracyScore = clamp(this.accuracy * 15, 0, 15);
        return clamp(durationScore + intensityScore + shotsScore + accuracyScore, 0, MAX_DIFFICULTY_SCORE);
    }
}
class SkillsTraining extends Training {
    technique;
    ballControl;
    constructor(duration, intensity, technique, ballControl) {
        super(duration, intensity);
        if (technique < 0 || technique > 10)
            throw new Error("Technika musí být mezi 0 a 10.");
        if (ballControl < 0 || ballControl > 10)
            throw new Error("Kontrola míče musí být mezi 0 a 10.");
        this.technique = technique;
        this.ballControl = ballControl;
    }
    calculateCalories() {
        return this._duration * (this._intensity + this.technique + this.ballControl) * 0.6;
    }
    calculateLoad() {
        return (this.technique + this.ballControl) * this._intensity;
    }
    calculateDifficultyScore() {
        const durationScore = clamp(this._duration * 0.4, 0, 25);
        const intensityScore = this._intensity * 3;
        const techniqueScore = this.technique * 2;
        const ballControlScore = this.ballControl * 2;
        return clamp(durationScore + intensityScore + techniqueScore + ballControlScore, 0, MAX_DIFFICULTY_SCORE);
    }
}
function createTrainingFromData(data) {
    const validation = validateTrainingData(data);
    if (!validation.isValid) {
        throw new Error(formatValidationErrors(validation.issues));
    }
    switch (data.type) {
        case 'sprint':
            return new SprintTraining(data.duration, data.intensity, data.distance);
        case 'endurance':
            return new EnduranceTraining(data.duration, data.intensity, data.averageHeartRate);
        case 'shooting':
            return new ShootingTraining(data.duration, data.intensity, data.shots, data.accuracy);
        case 'skills':
            return new SkillsTraining(data.duration, data.intensity, data.technique, data.ballControl);
        default:
            throw new Error("Neznámý typ tréninku");
    }
}
function buildTrainingRecord(data, index) {
    return {
        id: `${data.type}-${index + 1}`,
        performedAt: new Date().toISOString(),
        ...data,
    };
}
function calculateTrainingValues(training) {
    const difficultyScore = training.calculateDifficultyScore();
    return {
        calories: training.calculateCalories(),
        load: training.calculateLoad(),
        difficultyScore,
        difficultyLabel: formatDifficulty(difficultyScore),
    };
}
function compareTrainingDifficulty(currentRecord, currentScore, previousRecord, previousScore) {
    if (!previousRecord || previousScore === null) {
        return {
            previousId: null,
            previousScore: null,
            currentScore,
            scoreDelta: 0,
            percentDelta: null,
            direction: 'stejný',
            summary: 'První trénink v sérii, zatím bez porovnání.',
        };
    }
    const scoreDelta = currentScore - previousScore;
    const roundedDelta = Math.abs(scoreDelta) < 1 ? 0 : scoreDelta;
    const percentDelta = previousScore === 0 ? null : (roundedDelta / previousScore) * 100;
    if (roundedDelta === 0) {
        return {
            previousId: previousRecord.id,
            previousScore,
            currentScore,
            scoreDelta: 0,
            percentDelta,
            direction: 'stejný',
            summary: `Stejná náročnost jako předchozí trénink (${previousRecord.id}).`,
        };
    }
    if (roundedDelta > 0) {
        return {
            previousId: previousRecord.id,
            previousScore,
            currentScore,
            scoreDelta: roundedDelta,
            percentDelta,
            direction: 'lepší',
            summary: `Lepší než předchozí trénink (${previousRecord.id}): náročnost vzrostla o ${roundedDelta.toFixed(0)} bodů${percentDelta === null ? '' : `, tedy o ${percentDelta.toFixed(0)} %`}.`,
        };
    }
    return {
        previousId: previousRecord.id,
        previousScore,
        currentScore,
        scoreDelta: roundedDelta,
        percentDelta,
        direction: 'horší',
        summary: `Horší než předchozí trénink (${previousRecord.id}): náročnost klesla o ${Math.abs(roundedDelta).toFixed(0)} bodů${percentDelta === null ? '' : `, tedy o ${Math.abs(percentDelta).toFixed(0)} %`}.`,
    };
}
function calculateTrainingTrend(analyses, currentIndex) {
    const TREND_WINDOW = 5;
    const recentForTrend = Math.min(TREND_WINDOW, currentIndex);
    if (recentForTrend === 0) {
        return {
            recentCount: 0,
            recentAverage: 0,
            currentVsAverage: 0,
            isTrendingUp: null,
            trendSummary: 'Zatím bez historie pro analýzu trendu.',
        };
    }
    const recentAnalyses = analyses.slice(Math.max(0, currentIndex - recentForTrend), currentIndex);
    const recentScores = recentAnalyses.map(a => a.difficultyScore);
    const recentAverage = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
    const currentScore = analyses[currentIndex].difficultyScore;
    const currentVsAverage = currentScore - recentAverage;
    let trendingUp = null;
    let trendSummary = '';
    if (recentAnalyses.length >= 2) {
        const firstHalf = recentAnalyses.slice(0, Math.ceil(recentAnalyses.length / 2)).map(a => a.difficultyScore);
        const secondHalf = recentAnalyses.slice(Math.ceil(recentAnalyses.length / 2)).map(a => a.difficultyScore);
        const avgFirstHalf = firstHalf.reduce((sum, s) => sum + s, 0) / firstHalf.length;
        const avgSecondHalf = secondHalf.reduce((sum, s) => sum + s, 0) / secondHalf.length;
        trendingUp = avgSecondHalf > avgFirstHalf;
        const trendLabel = trendingUp ? 'roste' : 'klesá';
        trendSummary = `Trend v posledních tréninků ${trendLabel}. Průměr: ${recentAverage.toFixed(0)} bodů.`;
    }
    else {
        trendSummary = `Dostatek záznamů pro trend. Průměr: ${recentAverage.toFixed(0)} bodů.`;
    }
    if (Math.abs(currentVsAverage) < 5) {
        trendSummary += ` Aktuální performance je blízko průměru.`;
    }
    else if (currentVsAverage > 0) {
        trendSummary += ` Aktuální trénink je výrazně lepší než průměr o ${currentVsAverage.toFixed(0)} bodů.`;
    }
    else {
        trendSummary += ` Aktuální trénink je výrazně horší než průměr o ${Math.abs(currentVsAverage).toFixed(0)} bodů.`;
    }
    return {
        recentCount: recentAnalyses.length,
        recentAverage,
        currentVsAverage,
        isTrendingUp: trendingUp,
        trendSummary,
    };
}
function analyzeTraining(training, sourceRecord, index, previousRecord, previousScore, allAnalyses) {
    const computedValues = calculateTrainingValues(training);
    const comparison = compareTrainingDifficulty(sourceRecord, computedValues.difficultyScore, previousRecord, previousScore);
    return {
        index,
        ...sourceRecord,
        ...computedValues,
        summary: training.getSummary(),
        difficultySummary: `Náročnost: ${computedValues.difficultyScore.toFixed(0)} / ${MAX_DIFFICULTY_SCORE} (${computedValues.difficultyLabel})`,
        comparison,
        trend: allAnalyses ? calculateTrainingTrend([...allAnalyses], index) : { recentCount: 0, recentAverage: 0, currentVsAverage: 0, isTrendingUp: null, trendSummary: 'Bez historie.' },
    };
}
function analyzeTrainings(trainingData) {
    const analyses = [];
    return trainingData.map((data, index, array) => {
        const validation = validateTrainingData(data);
        if (!validation.isValid) {
            throw new Error(createValidationErrorMessage(index, data, validation.issues));
        }
        const sourceRecord = buildTrainingRecord(data, index);
        const previousData = index > 0 ? array[index - 1] : null;
        const previousRecord = previousData ? buildTrainingRecord(previousData, index - 1) : null;
        const previousScore = previousData ? createTrainingFromData(previousData).calculateDifficultyScore() : null;
        const analysis = analyzeTraining(createTrainingFromData(data), sourceRecord, index, previousRecord, previousScore, analyses);
        analyses.push(analysis);
        return analysis;
    });
}
function logTrainingAnalysis(analyses) {
    console.log("--- ANALÝZA FOTBALOVÝCH TRÉNINKŮ ---");
    analyses.forEach(analysis => {
        console.log(`Záznam č. ${analysis.index + 1} (${analysis.id})`);
        console.log(`Vytvořeno: ${formatTrainingDate(analysis.performedAt)}`);
        console.log(analysis.summary);
        console.log(analysis.difficultySummary);
        console.log(analysis.comparison.summary);
        console.log(analysis.trend.trendSummary);
        console.log(`Vypočtené kalorie: ${analysis.calories.toFixed(0)} kcal`);
        console.log(`Vypočtené zatížení: ${analysis.load.toFixed(1)} j.`);
        console.log("------------------------------------");
    });
}
function renderTrainingAnalysis(analyses, output) {
    if (!output) {
        return;
    }
    output.innerHTML = analyses
        .map(analysis => {
        const cssClass = `result-item result-${analysis.comparison.direction}`;
        return `
                <article class="${cssClass}">
                    <h3>Záznam ${analysis.index + 1}</h3>
                    <p>ID: ${analysis.id}</p>
                    <p>Vytvořeno: ${formatTrainingDate(analysis.performedAt)}</p>
                    <p>${analysis.summary}</p>
                    <p>${analysis.difficultySummary}</p>
                    <p>${analysis.comparison.summary}</p>
                    <p><strong>Trend:</strong> ${analysis.trend.trendSummary}</p>
                    <p>Skóre pro porovnání dalších tréninků: ${analysis.difficultyScore.toFixed(0)} bodů.</p>
                </article>
            `;
    })
        .join('');
}
function renderValidationError(message, output) {
    if (!output) {
        return;
    }
    output.innerHTML = `
        <article class="result-item result-item--error">
            <h3>Chyba validace</h3>
            <p>${message}</p>
        </article>
    `;
}
function renderTrainingHistory(analyses, output) {
    if (!output || analyses.length === 0) {
        return;
    }
    const historyHtml = `
        <section class="history-section">
            <h3>Historie tréninků</h3>
            <div class="history-list">
                ${analyses
        .map((analysis, idx) => {
        const icon = analysis.comparison.direction === 'lepší' ? '📈' : analysis.comparison.direction === 'horší' ? '📉' : '➡️';
        return `
                            <div class="history-item">
                                <div>
                                    <strong>${icon} ${analysis.type}</strong>
                                    ${formatTrainingDate(analysis.performedAt)}
                                </div>
                                <div class="score">${analysis.difficultyScore.toFixed(0)}</div>
                            </div>
                        `;
    })
        .join('')}
            </div>
            <button type="button" class="btn-export" data-analyses='${JSON.stringify(analyses)}'>Exportovat JSON</button>
        </section>
    `;
    output.innerHTML += historyHtml;
    const exportButton = output.querySelector('.btn-export');
    if (exportButton) {
        exportButton.addEventListener('click', (event) => {
            const button = event.target;
            const analysesJson = button.dataset.analyses;
            if (analysesJson) {
                downloadJSON(JSON.parse(analysesJson), 'training-history.json');
            }
        });
    }
}
function downloadJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
const output = document.querySelector('#output');
try {
    const trainingAnalyses = analyzeTrainings(rawTrainings);
    logTrainingAnalysis(trainingAnalyses);
    renderTrainingAnalysis(trainingAnalyses, output);
    renderTrainingHistory(trainingAnalyses, output);
    initializeFormHandlers(trainingAnalyses, output);
}
catch (error) {
    const message = error instanceof Error ? error.message : 'Došlo k neznámé chybě při validaci tréninku.';
    console.error(message);
    renderValidationError(message, output);
}