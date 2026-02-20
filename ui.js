// ui.js - Interface e manipulação DOM
import { rawDrugDatabase } from './database.js';
import { calculateResults, getMinDoseFromRange, groupDrugsByBaseName } from './calculator.js';
import { exportToCSV, exportToPDF, downloadCSV } from './exportService.js';

let groupedDrugDatabase = {};
let formCache = {};
let currentGroupKey = null;
let currentMode = null;
let currentPresentationIndex = 0;

const LIMITS = {
    weight: { min: 0.5, max: 300 },
    height: { min: 100, max: 250 },
    age: { min: 16, max: 105 }
};

const APP_VERSION = '2.1';

// Elementos DOM
let calculatorBody, drugPresentationDiv, weightInput, heightInput, weightError, heightError;
let ageInput, genderSelect, ageError, genderError;
let modeBolusBtn, modeInfusionBtn, modeCheckDoseBtn, modeNotesBtn;
let drugSelectorButton, drugSearchModal, drugSearchInput, drugList;
let presentationSection, presentationSelector;

// Funções de validação
function validateNumericInput(input, limits, errorElement) {
    const value = parseFloat(input.value.replace(',', '.'));
    
    input.classList.remove('error', 'warning');
    errorElement.textContent = '';
    
    if (input.value === '') {
        input.classList.add('error');
        errorElement.textContent = 'Campo obrigatório';
        return false;
    }
    
    if (isNaN(value)) {
        input.classList.add('error');
        errorElement.textContent = 'Apenas números';
        return false;
    }
    
    if (value <= 0) {
        input.classList.add('error');
        errorElement.textContent = 'Valor inválido';
        return false;
    }
    
    if (value < limits.min) {
        input.classList.add('error');
        errorElement.textContent = `Mínimo: ${limits.min}`;
        return false;
    }
    
    if (value > limits.max) {
        input.classList.add('error');
        errorElement.textContent = `Máximo: ${limits.max}`;
        return false;
    }
    
    input.classList.remove('error', 'warning');
    return true;
}

function validateGender() {
    genderSelect.classList.remove('error');
    genderError.textContent = '';
    
    if (!genderSelect.value) {
        genderSelect.classList.add('error');
        genderError.textContent = 'Selecione um sexo';
        return false;
    }
    
    genderSelect.classList.remove('error');
    return true;
}

function sanitizeNumericInput(input) {
    let value = input.value;
    value = value.replace(/,/g, '.');
    value = value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts.length === 2 && parts[1].length > 2) {
        value = parts[0] + '.' + parts[1].substring(0, 2);
    }
    input.value = value;
}

// Sistema de Disclaimer
function checkFirstLaunch() {
    const hasAccepted = localStorage.getItem('disclaimerAccepted');
    const acceptedVersion = localStorage.getItem('disclaimerVersion');
    
    if (!hasAccepted || acceptedVersion !== APP_VERSION) {
        showDisclaimerModal();
    }
}

function showDisclaimerModal() {
    const modal = document.getElementById('legal-modal');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('legal-close-btn');
    const acceptBtn = document.getElementById('accept-disclaimer-btn');
    
    modal.style.display = 'block';
    modal.classList.add('disclaimer-required');
    overlay.classList.add('show', 'disclaimer-active');
    
    closeBtn.style.display = 'none';
    acceptBtn.classList.remove('hidden');
    
    acceptBtn.onclick = () => {
        localStorage.setItem('disclaimerAccepted', 'true');
        localStorage.setItem('disclaimerVersion', APP_VERSION);
        modal.style.display = 'none';
        modal.classList.remove('disclaimer-required');
        overlay.classList.remove('show', 'disclaimer-active');
        closeBtn.style.display = 'block';
        acceptBtn.classList.add('hidden');
    };
    
    overlay.onclick = null;
}

// Seleção de droga
function selectDrug(groupKey) {
    currentGroupKey = groupKey;
    currentPresentationIndex = 0;
    
    if (formCache[groupKey]) {
        delete formCache[groupKey];
    }
    
    const drugGroup = groupedDrugDatabase[groupKey];
    
    let fullName = drugGroup.name;
    if (drugGroup.brand_name) {
        fullName += ' <span class="brand-name">(' + drugGroup.brand_name + '®)</span>';
    }
    drugSelectorButton.innerHTML = fullName;
    
    const firstMode = drugGroup.bolus || drugGroup.infusion;
    drugPresentationDiv.innerHTML = firstMode.presentation;
    
    if (firstMode.has_presentation_selector || firstMode.has_concentration_selector) {
        presentationSection.classList.remove('hidden');
        populatePresentationSelector(firstMode);
    } else {
        presentationSection.classList.add('hidden');
    }
    
    modeBolusBtn.disabled = !drugGroup.bolus;
    modeInfusionBtn.disabled = !drugGroup.infusion;
    modeCheckDoseBtn.disabled = !(drugGroup.bolus || drugGroup.infusion);
    modeNotesBtn.disabled = !drugGroup.notes;

    let initialMode = null;
    if (drugGroup.bolus) initialMode = 'bolus';
    else if (drugGroup.infusion) initialMode = 'infusion';
    else initialMode = 'check-dose';
    
    setActiveMode(initialMode);
}

function populatePresentationSelector(drugData) {
    presentationSelector.innerHTML = '';
    
    if (drugData.presentation_options) {
        drugData.presentation_options.forEach((option, index) => {
            const opt = document.createElement('option');
            opt.value = index;
            opt.textContent = option.label;
            if (option.isDefault) {
                opt.selected = true;
                currentPresentationIndex = index;
            }
            presentationSelector.appendChild(opt);
        });
    }
}

function setActiveMode(mode) {
    if (!mode) return;
    
    currentMode = mode;
    
    [modeBolusBtn, modeInfusionBtn, modeCheckDoseBtn, modeNotesBtn].forEach(btn => {
        btn.classList.toggle('active', btn.id === `mode-${mode}`);
    });

    const drugGroup = groupedDrugDatabase[currentGroupKey];
    let drugData = null;
    
    if (mode === 'bolus') drugData = drugGroup.bolus;
    else if (mode === 'infusion') drugData = drugGroup.infusion;
    else if (mode === 'check-dose') drugData = drugGroup.infusion || drugGroup.bolus;
    
    if (drugData && (drugData.has_presentation_selector || drugData.has_concentration_selector)) {
        presentationSection.classList.remove('hidden');
        populatePresentationSelector(drugData);
    } else {
        presentationSection.classList.add('hidden');
    }

    renderCalculator();
}

function renderCalculator() {
    if (!currentGroupKey || !currentMode) {
        calculatorBody.innerHTML = '';
        return;
    }
    
    if (currentMode === 'notes') {
        renderNotes();
        return;
    }

    const drugGroup = groupedDrugDatabase[currentGroupKey];
    let drugData = null;
    
    if (currentMode === 'bolus') {
        drugData = drugGroup.bolus;
    } else if (currentMode === 'infusion') {
        drugData = drugGroup.infusion;
    } else if (currentMode === 'check-dose') {
        drugData = drugGroup.infusion || drugGroup.bolus;
    }
    
    if (!drugData) {
        calculatorBody.innerHTML = '<p>Modo não disponível para esta droga.</p>';
        return;
    }
    
    if (!formCache[currentGroupKey]) {
        formCache[currentGroupKey] = {};
    }
    
    const drugCache = formCache[currentGroupKey];
    const modeCache = drugCache[currentMode] || {};
    
    const defaultDose = getMinDoseFromRange(drugData.dose_range_text);
    
    function getCachedOrDefault(cacheObj, key, defaultValue) {
        const cachedValue = cacheObj[key];
        const hasCache = cachedValue !== undefined && cachedValue !== '';
        return hasCache ? cachedValue : defaultValue;
    }
    
    let quantity = drugData.default_quantity;
    let volume = drugData.default_volume;
    
    if (drugData.presentation_options) {
        const selectedOption = drugData.presentation_options[currentPresentationIndex];
        if (selectedOption) {
            quantity = selectedOption.quantity;
            volume = selectedOption.volume || drugData.default_volume;
        }
    }
    
    let inputs = [];
    
    if (currentMode === 'bolus') {
        if (drugData.bolus_type === 'direct') {
            inputs = [
                { 
                    id: 'dose', 
                    label: `Dose Alvo (${drugData.dose_unit})`, 
                    value: getCachedOrDefault(modeCache, 'dose', defaultDose),
                    doseRange: drugData.dose_range_text 
                }
            ];
        } else {
            inputs = [
                { 
                    id: 'quantity', 
                    label: `Quantidade (${drugData.default_quantity_unit})`, 
                    value: getCachedOrDefault(modeCache, 'quantity', quantity)
                },
                { 
                    id: 'volume', 
                    label: 'Volume Final (mL)', 
                    value: getCachedOrDefault(modeCache, 'volume', volume)
                },
                { 
                    id: 'dose', 
                    label: `Dose Alvo (${drugData.dose_unit})`, 
                    value: getCachedOrDefault(modeCache, 'dose', defaultDose),
                    doseRange: drugData.dose_range_text 
                }
            ];
        }
    } else if (currentMode === 'infusion') {
        inputs = [
            { 
                id: 'quantity', 
                label: `Quantidade (${drugData.default_quantity_unit})`, 
                value: getCachedOrDefault(modeCache, 'quantity', quantity)
            },
            { 
                id: 'volume', 
                label: 'Volume Final (mL)', 
                value: getCachedOrDefault(modeCache, 'volume', volume)
            },
            { 
                id: 'dose', 
                label: `Dose Alvo (${drugData.dose_unit})`, 
                value: getCachedOrDefault(modeCache, 'dose', defaultDose),
                doseRange: drugData.dose_range_text 
            }
        ];
    } else if (currentMode === 'check-dose') {
        const thisDrugInfusionCache = drugCache['infusion'] || {};
        inputs = [
            { 
                id: 'quantity', 
                label: `Quantidade (${drugData.default_quantity_unit})`, 
                value: getCachedOrDefault(modeCache, 'quantity', 
                       getCachedOrDefault(thisDrugInfusionCache, 'quantity', quantity))
            },
            { 
                id: 'volume', 
                label: 'Volume Final (mL)', 
                value: getCachedOrDefault(modeCache, 'volume',
                       getCachedOrDefault(thisDrugInfusionCache, 'volume', volume))
            },
            { 
                id: 'infusionRate', 
                label: 'Velocidade (mL/h)', 
                value: getCachedOrDefault(modeCache, 'infusionRate', '10')
            }
        ];
    }
    
    const params = getParams(true, inputs);
    const { results, dilutionNote } = calculateResults(currentMode, drugData, params, currentPresentationIndex);
    
    if (drugData.group_key === 'rocuronio' && currentMode === 'bolus') {
        let html = '<div class="input-row calculator-content">';
        html += '<div class="input-column">';
        
        inputs.forEach(input => {
            html += `
                <div class="input-group-calculator">
                    <label for="${input.id}">${input.label}</label>
                    <input type="text" id="${input.id}" inputmode="decimal" value="${input.value}">
                    <small class="dose-range">${input.doseRange || '&nbsp;'}</small>
                </div>`;
        });
        
        html += '</div>';
        html += '<div class="output-column">';
        html += `
            <div class="result-group">
                <label>${results[0].label}</label>
                <span id="result-0">${results[0].value}</span>
                <small class="dose-range">&nbsp;</small>
            </div>`;
        html += '</div>';
        html += '</div>';
        
        html += '<div class="rocuronio-container">';
        
        if (dilutionNote) {
            html += `<div class="dilution-note">📋 ${dilutionNote}</div>`;
        }
        
        html += '<div class="rocuronio-fixed-doses">';
        html += `
            <div class="rocuronio-dose-box">
                <label>Dose de Indução (0.6 mg/kg)</label>
                <div class="dose-value" id="result-induction">${results[1].value}</div>
            </div>`;
        html += `
            <div class="rocuronio-dose-box">
                <label>Dose de SRI (1.2 mg/kg)</label>
                <div class="dose-value" id="result-sri">${results[2].value}</div>
            </div>`;
        html += '</div>';
        html += '</div>';
        
        html += `
            <div id="exportButtons" style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
                <button id="exportCSVBtn" style="padding: 10px 20px; background-color: #27ae60; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                    📊 Exportar CSV
                </button>
                <button id="exportPDFBtn" style="padding: 10px 20px; background-color: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                    📄 Exportar PDF
                </button>
            </div>
        `;
        
        calculatorBody.innerHTML = html;
    } else {
        let html = '<div class="input-row calculator-content">';
        html += '<div class="input-column">';
        
        inputs.forEach(input => {
            html += `
                <div class="input-group-calculator">
                    <label for="${input.id}">${input.label}</label>
                    <input type="text" id="${input.id}" inputmode="decimal" value="${input.value}">
                    <small class="dose-range">${input.doseRange || '&nbsp;'}</small>
                </div>`;
        });
        
        html += '</div>';
        html += '<div class="output-column">';
        
        results.forEach((result, i) => {
            html += `
                <div class="result-group">
                    <label>${result.label}</label>
                    <span id="result-${i}">${result.value}</span>
                    <small class="dose-range">&nbsp;</small>
                </div>`;
        });
        
        html += '</div>';
        html += '</div>';
        
        if (dilutionNote) {
            html += `<div class="dilution-note">📋 ${dilutionNote}</div>`;
        }
        
        html += `
            <div id="exportButtons" style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
                <button id="exportCSVBtn" style="padding: 10px 20px; background-color: #27ae60; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                    📊 Exportar CSV
                </button>
                <button id="exportPDFBtn" style="padding: 10px 20px; background-color: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                    📄 Exportar PDF
                </button>
            </div>
        `;
        
        calculatorBody.innerHTML = html;
    }
    
    addEventListenersToInputs(inputs);
    setupExportButtons(drugData, currentMode, params, inputs, results, dilutionNote);
}

function renderNotes() {
    const drugGroup = groupedDrugDatabase[currentGroupKey];
    let notesHtml = '<div class="notes-display">';
    if (drugGroup && drugGroup.notes) {
        notesHtml += `<h4>Notas:</h4><p>${drugGroup.notes}</p>`;
    } else {
        notesHtml += '<p>Nenhuma nota para esta droga.</p>';
    }
    notesHtml += '</div>';
    calculatorBody.innerHTML = notesHtml;
}

function updateCalculations() {
    if (!currentGroupKey || !currentMode || currentMode === 'notes') return;

    const drugGroup = groupedDrugDatabase[currentGroupKey];
    let drugData = null;
    
    if (currentMode === 'bolus') {
        drugData = drugGroup.bolus;
    } else if (currentMode === 'infusion') {
        drugData = drugGroup.infusion;
    } else if (currentMode === 'check-dose') {
        drugData = drugGroup.infusion || drugGroup.bolus;
    }
    
    if (!drugData) return;

    const inputEls = Array.from(calculatorBody.querySelectorAll('input[type="text"], select')).map(input => ({
        id: input.id
    }));
    
    const params = getParams(false, inputEls);
    const { results, dilutionNote } = calculateResults(currentMode, drugData, params, currentPresentationIndex);

    // Coletar inputs com label + value atual para export
    const inputsForExport = Array.from(calculatorBody.querySelectorAll('input[type="text"], select')).map(el => ({
        label: el.previousElementSibling ? el.previousElementSibling.textContent : el.id,
        value: el.value
    }));
    
    if (drugData.group_key === 'rocuronio' && currentMode === 'bolus') {
        const el0 = document.getElementById('result-0');
        const elInd = document.getElementById('result-induction');
        const elSri = document.getElementById('result-sri');
        
        if (el0) {
            el0.textContent = results[0].value;
            el0.classList.add('updated');
            setTimeout(() => el0.classList.remove('updated'), 300);
        }
        if (elInd) elInd.textContent = results[1].value;
        if (elSri) elSri.textContent = results[2].value;
        
        const existingNote = calculatorBody.querySelector('.dilution-note');
        if (dilutionNote && existingNote) {
            existingNote.innerHTML = `📋 ${dilutionNote}`;
        }
    } else {
        results.forEach((result, i) => {
            const el = document.getElementById(`result-${i}`);
            if (el) {
                el.textContent = result.value;
                el.classList.add('updated');
                setTimeout(() => el.classList.remove('updated'), 300);
            }
        });
        
        const existingNote = calculatorBody.querySelector('.dilution-note');
        if (dilutionNote) {
            if (existingNote) {
                existingNote.innerHTML = `📋 ${dilutionNote}`;
            } else {
                const noteDiv = document.createElement('div');
                noteDiv.className = 'dilution-note';
                noteDiv.innerHTML = `📋 ${dilutionNote}`;
                calculatorBody.appendChild(noteDiv);
            }
        } else {
            if (existingNote) existingNote.remove();
        }
    }
    
    setupExportButtons(drugData, currentMode, params, inputsForExport, results, dilutionNote);
}

function getParams(isInitial, inputs) {
    const params = {
        weight: parseFloat(weightInput.value.replace(',', '.')) || 0,
        height: parseFloat(heightInput.value.replace(',', '.')) || 0,
        age: parseInt(ageInput.value) || 0,
        gender: genderSelect.value || '',
    };
    
    if (!currentGroupKey) return params;
    
    inputs.forEach(inputConf => {
        if (isInitial) {
            params[inputConf.id] = inputConf.value;
        } else {
            const inputEl = document.getElementById(inputConf.id);
            if (inputEl) {
                if (inputEl.tagName === 'SELECT') {
                    params[inputConf.id] = inputEl.value;
                } else {
                    params[inputConf.id] = inputEl.value.replace(',', '.');
                }
            } else {
                params[inputConf.id] = '0';
            }
        }
    });
    
    return params;
}

function cacheFormValues() {
    if (!currentGroupKey || !currentMode || currentMode === 'notes') return;
    
    if (!formCache[currentGroupKey]) {
        formCache[currentGroupKey] = {};
    }
    
    const drugCache = formCache[currentGroupKey];
    const modeCache = {};
    
    const inputs = calculatorBody.querySelectorAll('input[type="text"], select');
    if (inputs.length === 0) return;
    
    inputs.forEach(input => {
        modeCache[input.id] = input.value;
    });
    
    drugCache[currentMode] = modeCache;
}

function addEventListenersToInputs(inputs) {
    inputs.forEach(inputConf => {
        const inputEl = document.getElementById(inputConf.id);
        if (inputEl) {
            if (inputEl.tagName === 'SELECT') {
                inputEl.addEventListener('change', () => {
                    updateCalculations();
                    cacheFormValues();
                });
            } else {
                inputEl.addEventListener('input', () => {
                    sanitizeNumericInput(inputEl);
                    updateCalculations();
                    cacheFormValues();
                });
            }
        }
    });
}

function setupExportButtons(drugData, mode, params, inputs, results, dilutionNote) {
    const exportCSVBtn = document.getElementById('exportCSVBtn');
    const exportPDFBtn = document.getElementById('exportPDFBtn');
    
    if (!exportCSVBtn || !exportPDFBtn) return;
    
    const exportData = {
        drugName: drugData.name,
        mode: mode,
        weight: params.weight,
        dose: params.dose,
        doseUnit: drugData.dose_unit,
        inputs: inputs,
        results: results,
        dilutionNote: dilutionNote,
        timestamp: new Date()
    };
    
    exportCSVBtn.onclick = () => {
        try {
            const csv = exportToCSV(exportData);
            const filename = `infusao_${drugData.name.replace(/\s+/g, '_')}_${new Date().getTime()}.csv`;
            downloadCSV(csv, filename);
        } catch (error) {
            alert('Erro ao exportar CSV: ' + error.message);
        }
    };
    
    exportPDFBtn.onclick = async () => {
        try {
            exportPDFBtn.disabled = true;
            exportPDFBtn.textContent = '⏳ Gerando PDF...';
            await exportToPDF(exportData);
            exportPDFBtn.disabled = false;
            exportPDFBtn.textContent = '📄 Exportar PDF';
        } catch (error) {
            alert('Erro ao exportar PDF: ' + error.message);
            exportPDFBtn.disabled = false;
            exportPDFBtn.textContent = '📄 Exportar PDF';
        }
    };
}

function populateDrugList() {
    drugList.innerHTML = '';
    const db = groupedDrugDatabase;
    const categorized = {};
    
    for (const key in db) {
        const drug = db[key];
        if (!categorized[drug.category]) categorized[drug.category] = [];
        categorized[drug.category].push(drug);
    }

    const sortedCategories = Object.keys(categorized).sort((a, b) => a.localeCompare(b));
    
    sortedCategories.forEach(category => {
        const categoryHeader = document.createElement('li');
        categoryHeader.className = 'category-header';
        categoryHeader.textContent = category;
        drugList.appendChild(categoryHeader);
        
        const drugsInCategory = categorized[category].sort((a, b) => a.name.localeCompare(b.name));
        drugsInCategory.forEach(drug => {
            const drugItem = document.createElement('li');
            
            let fullName = drug.name;
            if (drug.brand_name) {
                fullName += ' <span class="brand-name">(' + drug.brand_name + '®)</span>';
            }
            
            drugItem.innerHTML = fullName;
            drugItem.dataset.key = drug.group_key;
            drugList.appendChild(drugItem);
        });
    });
}

function filterDrugList() {
    const searchTerm = drugSearchInput.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const items = drugList.getElementsByTagName('li');
    
    for (const item of items) {
        if (item.classList.contains('category-header')) continue;
        const drugName = item.textContent.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        item.classList.toggle('hidden', !drugName.includes(searchTerm));
    }
    
    for (const item of items) {
        if (item.classList.contains('category-header')) {
            let hasVisibleItems = false;
            let nextSibling = item.nextElementSibling;
            while (nextSibling && !nextSibling.classList.contains('category-header')) {
                if (!nextSibling.classList.contains('hidden')) { 
                    hasVisibleItems = true; 
                    break; 
                }
                nextSibling = nextSibling.nextElementSibling;
            }
            item.classList.toggle('hidden', !hasVisibleItems);
        }
    }
}

function initializeMenu() {
    const hamburger = document.getElementById('hamburger-menu');
    const sideMenu = document.querySelector('.side-menu');
    const overlay = document.querySelector('.overlay');
    const legalBtn = document.getElementById('legal-btn');
    const devBtn = document.getElementById('dev-btn');
    const appInfoBtn = document.getElementById('app-info-btn');
    const legalModal = document.getElementById('legal-modal');
    const devModal = document.getElementById('dev-modal');
    const appInfoModal = document.getElementById('app-info-modal');
    const closeButtons = document.querySelectorAll('.close-button');
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    function toggleMenu() { 
        sideMenu.classList.toggle('open'); 
        overlay.classList.toggle('show'); 
    }
    
    hamburger.addEventListener('click', toggleMenu);
    
    overlay.addEventListener('click', () => {
        if (!overlay.classList.contains('disclaimer-active')) {
            toggleMenu();
        }
    });
    
    function openModal(modal) { 
        modal.style.display = 'block'; 
        if(sideMenu.classList.contains('open')) toggleMenu(); 
    }
    
    if(legalBtn) legalBtn.addEventListener('click', () => {
        openModal(legalModal);
        const closeBtn = document.getElementById('legal-close-btn');
        const acceptBtn = document.getElementById('accept-disclaimer-btn');
        closeBtn.style.display = 'block';
        acceptBtn.classList.add('hidden');
    });
    
    if(devBtn) devBtn.addEventListener('click', () => openModal(devModal));
    if(appInfoBtn) appInfoBtn.addEventListener('click', () => openModal(appInfoModal));
    
    closeButtons.forEach(btn => btn.addEventListener('click', (e) => {
        const modal = e.currentTarget.closest('.modal');
        if (!modal.classList.contains('disclaimer-required')) {
            modal.style.display = 'none';
        }
    }));
    
    window.addEventListener('click', (event) => { 
        if (event.target.classList.contains('modal') && !event.target.classList.contains('disclaimer-required')) {
            event.target.style.display = 'none'; 
        }
    });
    
    function applyDarkMode(isDark) { 
        document.body.classList.toggle('dark-mode', isDark); 
        if(darkModeToggle) darkModeToggle.checked = isDark; 
    }
    
    if(darkModeToggle) { 
        darkModeToggle.addEventListener('change', () => { 
            localStorage.setItem('darkMode', darkModeToggle.checked); 
            applyDarkMode(darkModeToggle.checked); 
        }); 
    }
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('darkMode');
    applyDarkMode(savedTheme === 'true' || (savedTheme === null && prefersDark));
}

export function initializeApp() {
    calculatorBody = document.getElementById('calculator-body');
    drugPresentationDiv = document.getElementById('drug-presentation');
    weightInput = document.getElementById('weight');
    heightInput = document.getElementById('height');
    weightError = document.getElementById('weight-error');
    heightError = document.getElementById('height-error');
    
    ageInput = document.getElementById('age');
    genderSelect = document.getElementById('gender');
    ageError = document.getElementById('age-error');
    genderError = document.getElementById('gender-error');
    
    modeBolusBtn = document.getElementById('mode-bolus');
    modeInfusionBtn = document.getElementById('mode-infusion');
    modeCheckDoseBtn = document.getElementById('mode-check-dose');
    modeNotesBtn = document.getElementById('mode-notes');

    drugSelectorButton = document.getElementById('drug-selector-button');
    drugSearchModal = document.getElementById('drug-search-modal');
    drugSearchInput = document.getElementById('drug-search-input');
    drugList = document.getElementById('drug-list');
    
    presentationSection = document.getElementById('presentation-section');
    presentationSelector = document.getElementById('presentation-selector');
    
    groupedDrugDatabase = groupDrugsByBaseName(rawDrugDatabase);
    populateDrugList();

    [modeBolusBtn, modeInfusionBtn, modeCheckDoseBtn, modeNotesBtn].forEach(btn => {
        btn.disabled = true;
        btn.addEventListener('click', () => {
            if (!btn.disabled) setActiveMode(btn.id.replace('mode-', ''));
        });
    });

    drugSelectorButton.addEventListener('click', () => {
        drugSearchModal.style.display = 'block';
        drugSearchInput.focus();
        drugSearchInput.value = '';
        filterDrugList();
    });

    drugList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI' && e.target.dataset.key) {
            selectDrug(e.target.dataset.key);
            drugSearchModal.style.display = 'none';
        }
    });

    presentationSelector.addEventListener('change', () => {
        currentPresentationIndex = parseInt(presentationSelector.value);
        
        const drugGroup = groupedDrugDatabase[currentGroupKey];
        let drugData = null;
        
        if (currentMode === 'bolus') drugData = drugGroup.bolus;
        else if (currentMode === 'infusion') drugData = drugGroup.infusion;
        else if (currentMode === 'check-dose') drugData = drugGroup.infusion || drugGroup.bolus;
        
        if (drugData && drugData.presentation_options) {
            const selectedOption = drugData.presentation_options[currentPresentationIndex];
            
            const quantityInput = document.getElementById('quantity');
            const volumeInput = document.getElementById('volume');
            
            if (quantityInput) quantityInput.value = selectedOption.quantity;
            if (volumeInput && selectedOption.volume) volumeInput.value = selectedOption.volume;
        }
        
        renderCalculator();
    });

    drugSearchInput.addEventListener('input', filterDrugList);
    drugSearchModal.addEventListener('click', (e) => { 
        if (e.target === drugSearchModal) drugSearchModal.style.display = 'none'; 
    });
    
    weightInput.addEventListener('input', () => {
        sanitizeNumericInput(weightInput);
        validateNumericInput(weightInput, LIMITS.weight, weightError);
        if (currentGroupKey) updateCalculations();
    });
    
    heightInput.addEventListener('input', () => {
        sanitizeNumericInput(heightInput);
        validateNumericInput(heightInput, LIMITS.height, heightError);
        if (currentGroupKey) updateCalculations();
    });

    ageInput.addEventListener('input', () => {
        sanitizeNumericInput(ageInput);
        validateNumericInput(ageInput, LIMITS.age, ageError);
        if (currentGroupKey) updateCalculations();
    });

    ageInput.addEventListener('blur', () => {
        validateNumericInput(ageInput, LIMITS.age, ageError);
    });

    genderSelect.addEventListener('change', () => {
        validateGender();
        if (currentGroupKey) updateCalculations();
    });
    
    initializeMenu();
    checkFirstLaunch();
}