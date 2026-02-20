<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <title>Calculadora Clínica</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
    <style>
        .nav-active {
            background-color: var(--input-bg) !important;
            font-weight: bold !important;
            border-left: 3px solid #3498DB !important;
        }
        .patient-sync-info {
            font-size: 12px;
            text-align: center;
            margin-top: 8px;
            min-height: 18px;
        }
        .sync-info-ok {
            color: #27ae60;
        }
        .calc-module-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            user-select: none;
            padding: 4px 0;
        }
        .calc-module-header h2 {
            margin: 0 !important;
            font-size: 16px !important;
        }
        .calc-module-header:hover h2 {
            color: #3498DB;
        }
        .module-toggle {
            font-size: 14px;
            color: var(--title-color);
        }
        .module-body {
            margin-top: 15px;
        }
        .module-body.module-collapsed {
            display: none;
        }
        .calc-action-bar {
            display: flex;
            justify-content: center;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid var(--input-border);
        }
        .calc-result-span {
            background-color: var(--span-bg) !important;
            font-weight: bold !important;
            height: 37px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 100% !important;
            max-width: 180px !important;
            padding: 8px !important;
            border: 1px solid var(--input-border) !important;
            border-radius: 8px !important;
            text-align: center !important;
            font-size: 14px !important;
            box-sizing: border-box !important;
            color: var(--text-color) !important;
        }
        .calc-result-span.updated {
            animation: pulse 0.3s ease;
        }
    </style>
</head>
<body>

<div id="overlay" class="overlay"></div>

<div id="side-menu" class="side-menu">
    <ul>
        <li id="nav-infusao">💉 Calculadora de Infusão</li>
        <li id="nav-calculos" class="nav-active">🧮 Calculadora Clínica</li>
        <li id="nav-sessao">📋 Sessão de Atendimento</li>
        <li id="app-info-btn">ℹ️ Sobre o App</li>
        <li id="dev-btn">👨‍💻 Desenvolvedor</li>
        <li id="legal-btn">⚠️ Aviso Legal</li>
        <li>
            🌙 Modo Escuro
            <label class="switch">
                <input type="checkbox" id="darkModeToggle">
                <span class="slider"></span>
            </label>
        </li>
    </ul>
</div>

<!-- Modal: Aviso Legal -->
<div id="legal-modal" class="modal">
    <div class="modal-content">
        <div class="close-button">
            <svg viewBox="0 0 24 24">
                <path d="M18 6L6 18" stroke-width="2" stroke-linecap="round"/>
                <path d="M6 6L18 18" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </div>
        <h3>Termos de Uso e Aviso Legal</h3>
        <p><strong>CLASSIFICAÇÃO:</strong> Ferramenta educacional e de referência para profissionais de saúde. NÃO é um dispositivo médico regulamentado.</p>
        <p><strong>RESPONSABILIDADE:</strong> O usuário assume TOTAL responsabilidade pela validação independente de todos os cálculos.</p>
        <p><strong>DADOS PESSOAIS:</strong> Todas as informações são armazenadas EXCLUSIVAMENTE no dispositivo local. Este aplicativo NÃO transmite dados para servidores externos, em conformidade com a LGPD (Lei 13.709/2018) e CFM Resolução 2.217/2018.</p>
        <small>Versão 2.1 | Janeiro 2026 | Dr. Jayme Castilho</small>
    </div>
</div>

<!-- Modal: Desenvolvedor -->
<div id="dev-modal" class="modal">
    <div class="modal-content">
        <div class="close-button">
            <svg viewBox="0 0 24 24">
                <path d="M18 6L6 18" stroke-width="2" stroke-linecap="round"/>
                <path d="M6 6L18 18" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </div>
        <h3>Sobre o Desenvolvedor</h3>
        <p><strong>Nome:</strong> Jayme Castilho</p>
        <p><strong>Contato:</strong> <a href="mailto:chicletescerebro@gmail.com">chicletescerebro@gmail.com</a></p>
        <p><strong>Blog:</strong> <a href="https://chicletes.jaymebc.com" target="_blank">chicletes.jaymebc.com</a></p>
        <p>Médico anestesiologista e entusiasta de tecnologia.</p>
    </div>
</div>

<!-- Modal: Sobre o App -->
<div id="app-info-modal" class="modal">
    <div class="modal-content">
        <div class="close-button">
            <svg viewBox="0 0 24 24">
                <path d="M18 6L6 18" stroke-width="2" stroke-linecap="round"/>
                <path d="M6 6L18 18" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </div>
        <h3>Sobre o App</h3>
        <p>Calculadora clínica para profissionais de anestesiologia e medicina intensiva. Inclui cálculos de antropometria, função renal, hemodinâmica, hidroeletrolítico e transfusão.</p>
        <p>Os dados do paciente são compartilhados automaticamente com a Calculadora de Infusão.</p>
    </div>
</div>

<header>
    <button class="hamburger-menu" id="hamburger-menu">☰</button>
    <span class="header-title">
        Calculadora Clínica
        <span class="professional-badge">USO PROFISSIONAL</span>
    </span>
</header>

<div class="container">

    <!-- Dados do Paciente -->
    <div class="card">
        <h2>Dados do Paciente</h2>
        <div class="patient-data-row">
            <div class="input-group">
                <label for="weight">Peso (kg)</label>
                <input type="text" id="weight" inputmode="decimal" placeholder="Ex: 80">
                <small class="error-message" id="weight-error"></small>
            </div>
            <div class="input-group">
                <label for="height">Altura (cm)</label>
                <input type="text" id="height" inputmode="decimal" placeholder="Ex: 170">
                <small class="error-message" id="height-error"></small>
            </div>
            <div class="input-group">
                <label for="age">Idade (anos)</label>
                <input type="text" id="age" inputmode="decimal" placeholder="Ex: 45">
                <small class="error-message" id="age-error"></small>
            </div>
            <div class="input-group">
                <label for="gender">Sexo</label>
                <select id="gender">
                    <option value="">Selecione...</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                </select>
                <small class="error-message" id="gender-error"></small>
            </div>
        </div>
        <div class="patient-sync-info sync-info-ok" id="patient-sync-info"></div>
    </div>

    <!-- Módulo: Antropometria -->
    <div class="card">
        <div class="calc-module-header" id="header-antro">
            <h2>⚖️ Antropometria</h2>
            <span class="module-toggle" id="toggle-antro">▼</span>
        </div>
        <div class="module-body" id="body-antro">
            <div class="input-row calculator-content">
                <div class="input-column">
                    <div class="input-group-calculator">
                        <label>IMC (kg/m²)</label>
                        <span class="calc-result-span" id="res-imc">-</span>
                        <small class="dose-range">Normal: 18.5 - 24.9</small>
                    </div>
                    <div class="input-group-calculator">
                        <label>Classificação IMC</label>
                        <span class="calc-result-span" id="res-imc-class">-</span>
                        <small class="dose-range">&nbsp;</small>
                    </div>
                    <div class="input-group-calculator">
                        <label>Sup. Corporal (m²)</label>
                        <span class="calc-result-span" id="res-sc">-</span>
                        <small class="dose-range">DuBois | Normal: 1.6-2.0</small>
                    </div>
                </div>
                <div class="output-column">
                    <div class="input-group-calculator">
                        <label>Peso Ideal - Devine (kg)</label>
                        <span class="calc-result-span" id="res-pi">-</span>
                        <small class="dose-range">&nbsp;</small>
                    </div>
                    <div class="input-group-calculator">
                        <label>Peso Ajustado (kg)</label>
                        <span class="calc-result-span" id="res-pa">-</span>
                        <small class="dose-range">PI + 0.4 x (PR - PI)</small>
                    </div>
                    <div class="input-group-calculator">
                        <label>Peso Magro LBW (kg)</label>
                        <span class="calc-result-span" id="res-lbw">-</span>
                        <small class="dose-range">Janmahasatian</small>
                    </div>
                </div>
            </div>
            <div class="calc-action-bar">
                <button class="export-btn export-btn-save" id="btn-session-antro">📋 Adicionar à sessão</button>
            </div>
        </div>
    </div>

    <!-- Módulo: Função Renal -->
    <div class="card">
        <div class="calc-module-header" id="header-renal">
            <h2>🫘 Função Renal</h2>
            <span class="module-toggle" id="toggle-renal">▼</span>
        </div>
        <div class="module-body" id="body-renal">
            <div class="input-row calculator-content">
                <div class="input-column">
                    <div class="input-group-calculator">
                        <label for="creatinina">Creatinina (mg/dL)</label>
                        <input type="text" id="creatinina" inputmode="decimal" placeholder="Ex: 1.0">
                        <small class="dose-range">Normal: 0.6 - 1.2</small>
                    </div>
                </div>
                <div class="output-column">
                    <div class="input-group-calculator">
                        <label>Cockcroft-Gault (mL/min)</label>
                        <span class="calc-result-span" id="res-cg">-</span>
                        <small class="dose-range">Normal: &gt; 90</small>
                    </div>
                    <div class="input-group-calculator">
                        <label>CKD-EPI (mL/min/1.73m²)</label>
                        <span class="calc-result-span" id="res-ckdepi">-</span>
                        <small class="dose-range">Normal: &gt; 60</small>
                    </div>
                    <div class="input-group-calculator">
                        <label>Estadio DRC</label>
                        <span class="calc-result-span" id="res-drc">-</span>
                        <small class="dose-range">&nbsp;</small>
                    </div>
                </div>
            </div>
            <div class="calc-action-bar">
                <button class="export-btn export-btn-save" id="btn-session-renal">📋 Adicionar à sessão</button>
            </div>
        </div>
    </div>

    <!-- Módulo: Hemodinâmica -->
    <div class="card">
        <div class="calc-module-header" id="header-hemo">
            <h2>❤️ Hemodinâmica</h2>
            <span class="module-toggle" id="toggle-hemo">▼</span>
        </div>
        <div class="module-body" id="body-hemo">
            <div class="input-row calculator-content">
                <div class="input-column">
                    <div class="input-group-calculator">
                        <label for="pas">PAS (mmHg)</label>
                        <input type="text" id="pas" inputmode="decimal" placeholder="Ex: 120">
                        <small class="dose-range">&nbsp;</small>
                    </div>
                    <div class="input-group-calculator">
                        <label for="pad">PAD (mmHg)</label>
                        <input type="text" id="pad" inputmode="decimal" placeholder="Ex: 80">
                        <small class="dose-range">&nbsp;</small>
                    </div>
                    <div class="input-group-calculator">
                        <label for="pvc">PVC (mmHg)</label>
                        <input type="text" id="pvc" inputmode="decimal" placeholder="Ex: 8">
                        <small class="dose-range">Normal: 2 - 8</small>
                    </div>
                    <div class="input-group-calculator">
                        <label for="fc">FC (bpm)</label>
                        <input type="text" id="fc" inputmode="decimal" placeholder="Ex: 70">
                        <small class="dose-range">&nbsp;</small>
                    </div>
                    <div class="input-group-calculator">
                        <label for="vs-input">Vol. Sistólico (mL)</label>
                        <input type="text" id="vs-input" inputmode="decimal" placeholder="Ex: 70">
                        <small class="dose-range">Normal: 50 - 100</small>
                    </div>
                    <div class="input-group-calculator">
                        <label for="hemoglobina">Hemoglobina (g/dL)</label>
                        <input type="text" id="hemoglobina" inputmode="decimal" placeholder="Ex: 14">
                        <small class="dose-range">&nbsp;</small>
                    </div>
                    <div class="input-group-calculator">
                        <label for="sao2">SaO2 (%)</label>
                        <input type="text" id="sao2" inputmode="decimal" placeholder="Ex: 98">
                        <small class="dose-range">&nbsp;</small>
                    </div>
                    <div class="input-group-calculator">
                        <label for="pao2">PaO2 (mmHg)</label>
                        <input type="text" id="pao2" inputmode="decimal" placeholder="Ex: 100">
                        <small class="dose-range">&nbsp;</small>
                    </div>
                    <div class="input-group-calculator">
                        <label for="svo2">SvO2 (%)</label>
                        <input type="text" id="svo2" inputmode="decimal" placeholder="Ex: 75">
                        <small class="dose-range">&nbsp;</small>
                    </div>
                    <div class="input-group-calculator">
                        <label for="pvo2">PvO2 (mmHg)</label>
                        <input type="text" id="pvo2" inputmode="decimal" placeholder="Ex: 40">
                        <small class="dose-range">&nbsp;</small>
                    </div>
                </div>
                <div class="output-column">
                    <div class="input-group-calculator">
                        <label>PAM (mmHg)</label>
                        <span class="calc-result-span" id="res-pam">-</span>
                        <small class="dose-range">Normal: 70 - 100</small>
                    </div>
                    <div class="input-group-calculator">
                        <label>PP (mmHg)</label>
                        <span class="calc-result-span" id="res-pp">-</span>
                        <small class="dose-range">Normal: 40 - 60</small>
                    </div>
                    <div class="input-group-calculator">
                        <label>DC - Fick (L/min)</label>
                        <span class="calc-result-span" id="res-dc">-</span>
                        <small class="dose-range">Normal: 4.0 - 8.0</small>
                    </div>
                    <div class="input-group-calculator">
                        <label>DC - FC x VS (L/min)</label>
                        <span class="calc-result-span" id="res-dc2">-</span>
                        <small class="dose-range">Normal: 4.0 - 8.0</small>
                    </div>
                    <div class="input-group-calculator">
                        <label>IC (L/min/m²)</label>
                        <span class="calc-result-span" id="res-ic">-</span>
                        <small class="dose-range">Normal: 2.5 - 4.0</small>
                    </div>
                    <div class="input-group-calculator">
                        <label>RVS (dyn.s/cm⁵)</label>
                        <span class="calc-result-span" id="res-rvs">-</span>
                        <small class="dose-range">Normal: 900 - 1440</small>
                    </div>
                    <div class="input-group-calculator">
                        <label>IRVS (dyn.s/cm⁵.m²)</label>
                        <span class="calc-result-span" id="res-irvs">-</span>
                        <small class="dose-range">Normal: 1700 - 2400</small>
                    </div>
                    <div class="input-group-calculator">
                        <label>CaO2 (mL/L)</label>
                        <span class="calc-result-span" id="res-cao2">-</span>
                        <small class="dose-range">Normal: 160 - 200</small>
                    </div>
                    <div class="input-group-calculator">
                        <label>CvO2 (mL/L)</label>
                        <span class="calc-result-span" id="res-cvo2">-</span>
                        <small class="dose-range">Normal: 120 - 150</small>
                    </div>
                    <div class="input-group-calculator">
                        <label>VO2 estimado (mL/min)</label>
                        <span class="calc-result-span" id="res-vo2">-</span>
                        <small class="dose-range">Normal: 200 - 300</small>
                    </div>
                </div>
            </div>
            <div class="calc-action-bar">
                <button class="export-btn export-btn-save" id="btn-session-hemo">📋 Adicionar à sessão</button>
            </div>
        </div>
    </div>

    <!-- Módulo: Hidroeletrolítico -->
    <div class="card">
        <div class="calc-module-header" id="header-hidro">
            <h2>💧 Hidroeletrolítico</h2>
            <span class="module-toggle" id="toggle-hidro">▼</span>
        </div>
        <div class="module-body" id="body-hidro">
            <div class="input-row calculator-content">
                <div class="input-column">
                    <div class="input-group-calculator">
                        <label for="na-atual">Na+ atual (mEq/L)</label>
                        <input type="text" id="na-atual" inputmode="decimal" placeholder="Ex: 130">
                        <small class="dose-range">Normal: 135 - 145</small>
                    </div>
                    <div class="input-group-calculator">
                        <label for="na-alvo">Na+ alvo (mEq/L)</label>
                        <input type="text" id="na-alvo" inputmode="decimal" placeholder="Ex: 140" value="140">
                        <small class="dose-range">&nbsp;</small>
                    </div>
                    <div class="input-group-calculator">
                        <label for="glicose">Glicose (mg/dL)</label>
                        <input type="text" id="glicose" inputmode="decimal" placeholder="Ex: 90">
                        <small class="dose-range">Normal: 70 - 100</small>
                    </div>
                    <div class="input-group-calculator">
                        <label for="ureia">Ureia (mg/dL)</label>
                        <input type="text" id="ureia" inputmode="decimal" placeholder="Ex: 30">
                        <small class="dose-range">Normal: 10 - 45</small>
                    </div>
                </div>
                <div class="output-column">
                    <div class="input-group-calculator">
                        <label>Déficit de Na+ (mEq)</label>
                        <span class="calc-result-span" id="res-deficit-na">-</span>
                        <small class="dose-range">0.6 x Peso x (Alvo - Atual)</small>
                    </div>
                    <div class="input-group-calculator">
                        <label>Excesso Água Livre (mL)</label>
                        <span class="calc-result-span" id="res-agua-livre">-</span>
                        <small class="dose-range">Se Na+ &gt; 145</small>
                    </div>
                    <div class="input-group-calculator">
                        <label>Déficit Água Livre (mL)</label>
                        <span class="calc-result-span" id="res-deficit-agua">-</span>
                        <small class="dose-range">Se Na+ &lt; 135</small>
                    </div>
                    <div class="input-group-calculator">
                        <label>Osmolaridade (mOsm/L)</label>
                        <span class="calc-result-span" id="res-osm">-</span>
                        <small class="dose-range">Normal: 285 - 295</small>
                    </div>
                </div>
            </div>
            <div class="calc-action-bar">
                <button class="export-btn export-btn-save" id="btn-session-hidro">📋 Adicionar à sessão</button>
            </div>
        </div>
    </div>

    <!-- Módulo: Transfusão -->
    <div class="card">
        <div class="calc-module-header" id="header-transf">
            <h2>🩸 Transfusão</h2>
            <span class="module-toggle" id="toggle-transf">▼</span>
        </div>
        <div class="module-body" id="body-transf">
            <div class="input-row calculator-content">
                <div class="input-column">
                    <div class="input-group-calculator">
                        <label for="hb-atual">Hb atual (g/dL)</label>
                        <input type="text" id="hb-atual" inputmode="decimal" placeholder="Ex: 10">
                        <small class="dose-range">&nbsp;</small>
                    </div>
                    <div class="input-group-calculator">
                        <label for="ht-inicial">Ht inicial (%)</label>
                        <input type="text" id="ht-inicial" inputmode="decimal" placeholder="Ex: 40">
                        <small class="dose-range">&nbsp;</small>
                    </div>
                    <div class="input-group-calculator">
                        <label for="ht-minimo">Ht mínimo aceitável (%)</label>
                        <input type="text" id="ht-minimo" inputmode="decimal" placeholder="Ex: 24">
                        <small class="dose-range">&nbsp;</small>
                    </div>
                    <div class="input-group-calculator">
                        <label for="hb-alvo">Hb alvo (g/dL)</label>
                        <input type="text" id="hb-alvo" inputmode="decimal" placeholder="Ex: 10" value="10">
                        <small class="dose-range">&nbsp;</small>
                    </div>
                </div>
                <div class="output-column">
                    <div class="input-group-calculator">
                        <label>Vol. Sanguíneo Est. (mL)</label>
                        <span class="calc-result-span" id="res-vse">-</span>
                        <small class="dose-range">H: 70 mL/kg | M: 65 mL/kg</small>
                    </div>
                    <div class="input-group-calculator">
                        <label>Perda Máx. Tolerada (mL)</label>
                        <span class="calc-result-span" id="res-pmt">-</span>
                        <small class="dose-range">&nbsp;</small>
                    </div>
                    <div class="input-group-calculator">
                        <label>CH necessários (unid.)</label>
                        <span class="calc-result-span" id="res-ch">-</span>
                        <small class="dose-range">Déficit Hb x Peso x 0.3</small>
                    </div>
                    <div class="input-group-calculator">
                        <label>Plaquetas (unid.)</label>
                        <span class="calc-result-span" id="res-plaq">-</span>
                        <small class="dose-range">1 unid / 10 kg</small>
                    </div>
                </div>
            </div>
            <div class="calc-action-bar">
                <button class="export-btn export-btn-save" id="btn-session-transf">📋 Adicionar à sessão</button>
            </div>
        </div>
    </div>

</div>

<footer>JBC Informática | 2026</footer>

<script>
document.addEventListener('DOMContentLoaded', function() {

    // ─── REFS PACIENTE 
    var weightInput  = document.getElementById('weight');
    var heightInput  = document.getElementById('height');
    var ageInput     = document.getElementById('age');
    var genderSelect = document.getElementById('gender');
    var syncInfo     = document.getElementById('patient-sync-info');

    // ─── LOAD / SAVE PACIENTE 
    function loadPatientData() {
        try {
            var saved = localStorage.getItem('patientData');
            if (!saved) return;
            var data = JSON.parse(saved);
            if (data.weight) weightInput.value = data.weight;
            if (data.height) heightInput.value = data.height;
            if (data.age)    ageInput.value    = data.age;
            if (data.gender) genderSelect.value = data.gender;
            if (syncInfo) syncInfo.textContent = 'Dados carregados da Calculadora de Infusão';
        } catch(e) {}
        recalcAll();
    }

    function savePatientData() {
        try {
            localStorage.setItem('patientData', JSON.stringify({
                weight: weightInput.value,
                height: heightInput.value,
                age:    ageInput.value,
                gender: genderSelect.value
            }));
        } catch(e) {}
    }

    // ─── HELPERS 
    function v(id) {
        var el = document.getElementById(id);
        if (!el) return 0;
        return parseFloat(el.value.replace(',', '.')) || 0;
    }

    function setR(id, value, dec) {
        var el = document.getElementById(id);
        if (!el) return;
        if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
            el.textContent = '-';
            return;
        }
        var d = (dec === undefined) ? 2 : dec;
        el.textContent = value.toFixed(d);
        el.classList.add('updated');
        setTimeout(function() { el.classList.remove('updated'); }, 300);
    }

    function setT(id, text) {
        var el = document.getElementById(id);
        if (!el) return;
        el.textContent = text || '-';
    }

    function sanitize(input) {
        var value = input.value.replace(/,/g, '.').replace(/[^0-9.]/g, '');
        var parts = value.split('.');
        if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');
        if (parts.length === 2 && parts[1].length > 2) value = parts[0] + '.' + parts[1].substring(0, 2);
        input.value = value;
    }

    // ─── ANTROPOMETRIA 
    function calcAntro() {
        var peso   = v('weight');
        var altura = v('height');
        var sexo   = genderSelect.value;

        if (!peso || !altura) {
            setT('res-imc', '-'); setT('res-imc-class', '-');
            setT('res-sc', '-');  setT('res-pi', '-');
            setT('res-pa', '-');  setT('res-lbw', '-');
            return;
        }

        var altM = altura / 100;
        var imc  = peso / (altM * altM);
        setR('res-imc', imc, 1);

        var cls = '';
        if (imc &lt; 18.5)     cls = 'Abaixo do peso';
        else if (imc &lt; 25)  cls = 'Peso normal';
        else if (imc &lt; 30)  cls = 'Sobrepeso';
        else if (imc &lt; 35)  cls = 'Obesidade I';
        else if (imc &lt; 40)  cls = 'Obesidade II';
        else                cls = 'Obesidade III';
        setT('res-imc-class', cls);

        var sc = 0.007184 * Math.pow(altura, 0.725) * Math.pow(peso, 0.425);
        setR('res-sc', sc, 2);

        var pi = 0;
        if (sexo === 'M')      pi = 50  + 2.3 * ((altura - 152.4) / 2.54);
        else if (sexo === 'F') pi = 45.5 + 2.3 * ((altura - 152.4) / 2.54);

        if (pi > 0) {
            setR('res-pi', pi, 1);
            if (imc > 30) {
                setR('res-pa', pi + 0.4 * (peso - pi), 1);
            } else {
                setT('res-pa', 'IMC &lt;= 30');
            }
            var lbw = 0;
            if (sexo === 'M')      lbw = (9270 * peso) / (6680 + 216 * imc);
            else if (sexo === 'F') lbw = (9270 * peso) / (8780 + 244 * imc);
            if (lbw > 0) setR('res-lbw', lbw, 1);
            else setT('res-lbw', '-');
        } else {
            setT('res-pi', 'Informe o sexo');
            setT('res-pa', '-');
            setT('res-lbw', 'Informe o sexo');
        }
    }

    // ─── FUNÇÃO RENAL 
    function calcRenal() {
        var peso  = v('weight');
        var idade = v('age');
        var sexo  = genderSelect.value;
        var creat = v('creatinina');

        if (!creat || !peso || !idade || !sexo) {
            setT('res-cg', '-'); setT('res-ckdepi', '-'); setT('res-drc', '-');
            return;
        }

        var cg = ((140 - idade) * peso) / (72 * creat);
        if (sexo === 'F') cg = cg * 0.85;
        setR('res-cg', cg, 1);

        var k     = sexo === 'F' ? 0.7  : 0.9;
        var a     = sexo === 'F' ? -0.241 : -0.302;
        var ratio = creat / k;
        var ckdepi;
        if (ratio &lt; 1) ckdepi = 142 * Math.pow(ratio, a) * Math.pow(0.9938, idade);
        else           ckdepi = 142 * Math.pow(ratio, -1.200) * Math.pow(0.9938, idade);
        if (sexo === 'F') ckdepi = ckdepi * 1.012;
        setR('res-ckdepi', ckdepi, 1);

        var estadio = '';
        if (ckdepi >= 90)      estadio = 'G1 - Normal (>= 90)';
        else if (ckdepi >= 60) estadio = 'G2 - Levemente reduzido';
        else if (ckdepi >= 45) estadio = 'G3a - Mod. reduzido';
        else if (ckdepi >= 30) estadio = 'G3b - Mod. severo';
        else if (ckdepi >= 15) estadio = 'G4 - Severamente reduzido';
        else                   estadio = 'G5 - Falencia renal';
        setT('res-drc', estadio);
    }

    // ─── HEMODINÂMICA 
    function calcHemo() {
        var pas   = v('pas');
        var pad   = v('pad');
        var pvc   = v('pvc');
        var fc    = v('fc');
        var vsInp = v('vs-input');
        var hb    = v('hemoglobina');
        var sao2  = v('sao2');
        var pao2  = v('pao2');
        var svo2  = v('svo2');
        var pvo2  = v('pvo2');
        var peso  = v('weight');
        var altura = v('height');

        var sc = (altura && peso) ? 0.007184 * Math.pow(altura, 0.725) * Math.pow(peso, 0.425) : 0;

        var pam = null;
        if (pas && pad) { pam = (pas + 2 * pad) / 3; setR('res-pam', pam, 1); }
        else setT('res-pam', '-');

        if (pas && pad) setR('res-pp', pas - pad, 0);
        else setT('res-pp', '-');

        var cao2 = null, cvo2 = null;
        if (hb && sao2) { cao2 = (hb * 13.4 * (sao2 / 100)) + (pao2 * 0.0031); setR('res-cao2', cao2, 2); }
        else setT('res-cao2', '-');

        if (hb && svo2) { cvo2 = (hb * 13.4 * (svo2 / 100)) + (pvo2 * 0.0031); setR('res-cvo2', cvo2, 2); }
        else setT('res-cvo2', '-');

        var vo2 = sc ? 125 * sc : null;
        if (vo2) setR('res-vo2', vo2, 1);
        else setT('res-vo2', '-');

        var dc = null;
        if (cao2 !== null && cvo2 !== null && vo2 && cao2 > cvo2) {
            dc = vo2 / (cao2 - cvo2);
            setR('res-dc', dc, 2);
        } else setT('res-dc', '-');

        var dc2 = null;
        if (fc && vsInp) { dc2 = (fc * vsInp) / 1000; setR('res-dc2', dc2, 2); }
        else setT('res-dc2', '-');

        var dcUsado = dc !== null ? dc : dc2;

        if (dcUsado && sc) setR('res-ic', dcUsado / sc, 2);
        else setT('res-ic', '-');

        if (dcUsado && pam !== null) {
            var rvs = 80 * (pam - pvc) / dcUsado;
            setR('res-rvs', rvs, 0);
            if (sc) setR('res-irvs', rvs * sc, 0);
            else setT('res-irvs', '-');
        } else {
            setT('res-rvs', '-');
            setT('res-irvs', '-');
        }
    }

    // ─── HIDROELETROLÍTICO 
    function calcHidro() {
        var peso    = v('weight');
        var naAtual = v('na-atual');
        var naAlvo  = v('na-alvo');
        var glicose = v('glicose');
        var ureia   = v('ureia');
        var sexo    = genderSelect.value;

        if (!peso) {
            setT('res-deficit-na', '-'); setT('res-agua-livre', '-');
            setT('res-deficit-agua', '-'); setT('res-osm', '-');
            return;
        }

        var fator = sexo === 'F' ? 0.5 : 0.6;
        var act   = fator * peso;

        if (naAtual && naAlvo) setR('res-deficit-na', fator * peso * (naAlvo - naAtual), 1);
        else setT('res-deficit-na', '-');

        if (naAtual && naAtual > 145) setR('res-agua-livre', act * (naAtual / 140 - 1) * 1000, 0);
        else setT('res-agua-livre', '-');

        if (naAtual && naAtual &lt; 135) setR('res-deficit-agua', act * (1 - naAtual / 140) * 1000, 0);
        else setT('res-deficit-agua', '-');

        if (naAtual && glicose && ureia) setR('res-osm', 2 * naAtual + glicose / 18 + ureia / 6, 1);
        else setT('res-osm', '-');
    }

    // ─── TRANSFUSÃO 
    function calcTransf() {
        var peso      = v('weight');
        var hbAtual   = v('hb-atual');
        var htInicial = v('ht-inicial');
        var htMinimo  = v('ht-minimo');
        var hbAlvo    = v('hb-alvo');
        var sexo      = genderSelect.value;

        if (!peso) {
            setT('res-vse', '-'); setT('res-pmt', '-');
            setT('res-ch', '-');  setT('res-plaq', '-');
            return;
        }

        var fatorVSE = sexo === 'F' ? 65 : 70;
        var vse      = peso * fatorVSE;
        setR('res-vse', vse, 0);

        if (htInicial && htMinimo) {
            var htMedio = (htInicial + htMinimo) / 2;
            setR('res-pmt', vse * (htInicial - htMinimo) / htMedio, 0);
        } else setT('res-pmt', '-');

        if (hbAtual && hbAlvo) {
            var deficit = hbAlvo - hbAtual;
            if (deficit > 0) setR('res-ch', (deficit * peso * 0.3) / 50, 1);
            else setT('res-ch', 'Hb acima do alvo');
        } else setT('res-ch', '-');

        setR('res-plaq', peso / 10, 1);
    }

    // ─── RECALC GERAL 
    function recalcAll() {
        calcAntro();
        calcRenal();
        calcHemo();
        calcHidro();
        calcTransf();
    }

    // ─── ADICIONAR À SESSÃO 
    function addToSession(moduleName, results, btnId) {
        var valid = results.filter(function(r) { return r.value !== '-' && r.value !== ''; });
        if (valid.length === 0) { alert('Nenhum resultado disponível para adicionar.'); return; }
        try {
            var session = {};
            try { session = JSON.parse(localStorage.getItem('sessionData')) || {}; } catch(e) {}
            if (!session.calcs) session.calcs = [];
            if (!session.drugs) session.drugs = [];
            session.calcs.push({
                id:        Date.now(),
                timestamp: new Date().toISOString(),
                module:    moduleName,
                weight:    weightInput.value,
                results:   valid
            });
            localStorage.setItem('sessionData', JSON.stringify(session));
            var btn = document.getElementById(btnId);
            if (btn) {
                var orig = btn.textContent;
                btn.textContent = '✅ Adicionado!';
                btn.disabled = true;
                setTimeout(function() { btn.textContent = orig; btn.disabled = false; }, 2000);
            }
        } catch(e) { alert('Erro ao adicionar à sessão.'); }
    }

    function txt(id) {
        var el = document.getElementById(id);
        return el ? el.textContent : '-';
    }

    document.getElementById('btn-session-antro').addEventListener('click', function() {
        addToSession('Antropometria', [
            { label: 'IMC (kg/m2)',            value: txt('res-imc') },
            { label: 'Classificacao IMC',       value: txt('res-imc-class') },
            { label: 'Sup. Corporal (m2)',      value: txt('res-sc') },
            { label: 'Peso Ideal (kg)',          value: txt('res-pi') },
            { label: 'Peso Ajustado (kg)',       value: txt('res-pa') },
            { label: 'Peso Magro LBW (kg)',      value: txt('res-lbw') }
        ], 'btn-session-antro');
    });

    document.getElementById('btn-session-renal').addEventListener('click', function() {
        addToSession('Funcao Renal', [
            { label: 'Creatinina (mg/dL)',      value: document.getElementById('creatinina').value },
            { label: 'Cockcroft-Gault (mL/min)',value: txt('res-cg') },
            { label: 'CKD-EPI (mL/min/1.73m2)', value: txt('res-ckdepi') },
            { label: 'Estadio DRC',             value: txt('res-drc') }
        ], 'btn-session-renal');
    });

    document.getElementById('btn-session-hemo').addEventListener('click', function() {
        addToSession('Hemodinamica', [
            { label: 'PAM (mmHg)',              value: txt('res-pam') },
            { label: 'PP (mmHg)',               value: txt('res-pp') },
            { label: 'DC Fick (L/min)',          value: txt('res-dc') },
            { label: 'DC FC x VS (L/min)',       value: txt('res-dc2') },
            { label: 'IC (L/min/m2)',            value: txt('res-ic') },
            { label: 'RVS (dyn.s/cm5)',          value: txt('res-rvs') },
            { label: 'IRVS (dyn.s/cm5.m2)',      value: txt('res-irvs') },
            { label: 'CaO2 (mL/L)',              value: txt('res-cao2') },
            { label: 'CvO2 (mL/L)',              value: txt('res-cvo2') },
            { label: 'VO2 estimado (mL/min)',    value: txt('res-vo2') }
        ], 'btn-session-hemo');
    });

    document.getElementById('btn-session-hidro').addEventListener('click', function() {
        addToSession('Hidroeletrolitico', [
            { label: 'Deficit Na+ (mEq)',        value: txt('res-deficit-na') },
            { label: 'Excesso Agua Livre (mL)',   value: txt('res-agua-livre') },
            { label: 'Deficit Agua Livre (mL)',   value: txt('res-deficit-agua') },
            { label: 'Osmolaridade (mOsm/L)',     value: txt('res-osm') }
        ], 'btn-session-hidro');
    });

    document.getElementById('btn-session-transf').addEventListener('click', function() {
        addToSession('Transfusao', [
            { label: 'Vol. Sanguineo Est. (mL)', value: txt('res-vse') },
            { label: 'Perda Max. Tolerada (mL)', value: txt('res-pmt') },
            { label: 'CH necessarios (unid.)',   value: txt('res-ch') },
            { label: 'Plaquetas (unid.)',         value: txt('res-plaq') }
        ], 'btn-session-transf');
    });

    // ─── MÓDULOS COLAPSÁVEIS 
    var modules = ['antro', 'renal', 'hemo', 'hidro', 'transf'];
    modules.forEach(function(m) {
        var header = document.getElementById('header-' + m);
        if (!header) return;
        header.addEventListener('click', function() {
            var body   = document.getElementById('body-' + m);
            var toggle = document.getElementById('toggle-' + m);
            if (!body) return;
            if (body.classList.contains('module-collapsed')) {
                body.classList.remove('module-collapsed');
                if (toggle) toggle.textContent = '▼';
            } else {
                body.classList.add('module-collapsed');
                if (toggle) toggle.textContent = '▶';
            }
        });
    });

    // ─── MENU 
    var hamburger        = document.getElementById('hamburger-menu');
    var sideMenu         = document.querySelector('.side-menu');
    var overlay          = document.getElementById('overlay');
    var legalBtn         = document.getElementById('legal-btn');
    var devBtn           = document.getElementById('dev-btn');
    var appInfoBtn       = document.getElementById('app-info-btn');
    var legalModal       = document.getElementById('legal-modal');
    var devModal         = document.getElementById('dev-modal');
    var appInfoModal     = document.getElementById('app-info-modal');
    var closeButtons     = document.querySelectorAll('.close-button');
    var darkModeToggle   = document.getElementById('darkModeToggle');
    var navInfusao       = document.getElementById('nav-infusao');
    var navSessao        = document.getElementById('nav-sessao');

    function toggleMenu() {
        sideMenu.classList.toggle('open');
        overlay.classList.toggle('show');
    }

    function openModal(modal) {
        modal.style.display = 'block';
        if (sideMenu.classList.contains('open')) toggleMenu();
    }

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    if (navInfusao) navInfusao.addEventListener('click', function() { window.location.href = 'index.html'; });
    if (navSessao)  navSessao.addEventListener('click',  function() { window.location.href = 'sessao.html'; });

    if (legalBtn)   legalBtn.addEventListener('click',   function() { openModal(legalModal); });
    if (devBtn)     devBtn.addEventListener('click',     function() { openModal(devModal); });
    if (appInfoBtn) appInfoBtn.addEventListener('click', function() { openModal(appInfoModal); });

    closeButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            var modal = e.currentTarget.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) event.target.style.display = 'none';
    });

    function applyDarkMode(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
        if (darkModeToggle) darkModeToggle.checked = isDark;
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            localStorage.setItem('darkMode', darkModeToggle.checked);
            applyDarkMode(darkModeToggle.checked);
        });
    }

    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var savedTheme  = localStorage.getItem('darkMode');
    applyDarkMode(savedTheme === 'true' || (savedTheme === null && prefersDark));

    // ─── INPUTS 
    var patientFields = [weightInput, heightInput, ageInput];
    patientFields.forEach(function(el) {
        el.addEventListener('input', function() {
            sanitize(el);
            savePatientData();
            recalcAll();
        });
    });

    genderSelect.addEventListener('change', function() {
        savePatientData();
        recalcAll();
    });

    var calcInputIds = [
        'creatinina',
        'pas', 'pad', 'pvc', 'fc', 'vs-input',
        'hemoglobina', 'sao2', 'pao2', 'svo2', 'pvo2',
        'na-atual', 'na-alvo', 'glicose', 'ureia',
        'hb-atual', 'ht-inicial', 'ht-minimo', 'hb-alvo'
    ];

    calcInputIds.forEach(function(id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', function() {
            sanitize(el);
            recalcAll();
        });
    });

    // ─── INIT 
    loadPatientData();
});
</script>

</body>
</html>