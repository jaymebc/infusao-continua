// calculos.js

document.addEventListener('DOMContentLoaded', function () {

    // ─── ELEMENTOS ────────────────────────────────────────────────────────────

    var weightInput   = document.getElementById('weight');
    var heightInput   = document.getElementById('height');
    var ageInput      = document.getElementById('age');
    var genderSelect  = document.getElementById('gender');
    var syncInfo      = document.getElementById('patient-sync-info');

    // ─── SYNC DADOS DO PACIENTE ───────────────────────────────────────────────

    function loadPatientData() {
        try {
            var saved = localStorage.getItem('patientData');
            if (!saved) return;
            var data = JSON.parse(saved);
            if (data.weight) weightInput.value = data.weight;
            if (data.height) heightInput.value = data.height;
            if (data.age)    ageInput.value    = data.age;
            if (data.gender) genderSelect.value = data.gender;
            if (syncInfo) {
                syncInfo.textContent = 'Dados carregados da Calculadora de Infusão';
                syncInfo.className = 'sync-info-ok';
            }
        } catch (e) {}
        recalcAll();
    }

    function savePatientData() {
        try {
            var data = {
                weight: weightInput.value,
                height: heightInput.value,
                age:    ageInput.value,
                gender: genderSelect.value
            };
            localStorage.setItem('patientData', JSON.stringify(data));
        } catch (e) {}
    }

    // ─── HELPERS ─────────────────────────────────────────────────────────────

    function val(id) {
        var el = document.getElementById(id);
        if (!el) return 0;
        return parseFloat(el.value.replace(',', '.')) || 0;
    }

    function setResult(id, value, decimals) {
        var el = document.getElementById(id);
        if (!el) return;
        if (value === null || isNaN(value) || !isFinite(value)) {
            el.textContent = '-';
            return;
        }
        var d = (decimals === undefined) ? 2 : decimals;
        el.textContent = value.toFixed(d);
        el.classList.add('updated');
        setTimeout(function () { el.classList.remove('updated'); }, 300);
    }

    function setResultText(id, text) {
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

    // ─── CÁLCULOS: ANTROPOMETRIA ──────────────────────────────────────────────

    function calcAntropometria() {
        var peso   = val('weight');
        var altura = val('height');
        var idade  = val('age');
        var sexo   = genderSelect.value;

        if (!peso || !altura) {
            setResultText('res-imc', '-');
            setResultText('res-imc-class', '-');
            setResultText('res-sc', '-');
            setResultText('res-pi', '-');
            setResultText('res-pa', '-');
            setResultText('res-lbw', '-');
            return;
        }

        var alturaM = altura / 100;

        // IMC
        var imc = peso / (alturaM * alturaM);
        setResult('res-imc', imc, 1);

        // Classificação IMC
        var imcClass = '';
        if (imc < 18.5)      imcClass = 'Abaixo do peso';
        else if (imc < 25)   imcClass = 'Peso normal';
        else if (imc < 30)   imcClass = 'Sobrepeso';
        else if (imc < 35)   imcClass = 'Obesidade I';
        else if (imc < 40)   imcClass = 'Obesidade II';
        else                 imcClass = 'Obesidade III';
        setResultText('res-imc-class', imcClass);

        // Superfície Corporal - DuBois
        var sc = 0.007184 * Math.pow(altura, 0.725) * Math.pow(peso, 0.425);
        setResult('res-sc', sc, 2);

        // Peso Ideal - Devine
        var pi = 0;
        if (sexo === 'M') {
            pi = 50 + 2.3 * ((altura - 152.4) / 2.54);
        } else if (sexo === 'F') {
            pi = 45.5 + 2.3 * ((altura - 152.4) / 2.54);
        }
        if (pi > 0) setResult('res-pi', pi, 1);
        else setResultText('res-pi', 'Informe o sexo');

        // Peso Ajustado
        if (pi > 0 && imc > 30) {
            var pa = pi + 0.4 * (peso - pi);
            setResult('res-pa', pa, 1);
        } else {
            setResultText('res-pa', imc <= 30 ? 'IMC <= 30' : '-');
        }

        // Peso Magro - Janmahasatian
        var lbw = 0;
        if (sexo === 'M') {
            lbw = (9270 * peso) / (6680 + 216 * imc);
        } else if (sexo === 'F') {
            lbw = (9270 * peso) / (8780 + 244 * imc);
        }
        if (lbw > 0) setResult('res-lbw', lbw, 1);
        else setResultText('res-lbw', 'Informe o sexo');
    }

    // ─── CÁLCULOS: FUNÇÃO RENAL ───────────────────────────────────────────────

    function calcRenal() {
        var peso   = val('weight');
        var idade  = val('age');
        var sexo   = genderSelect.value;
        var creat  = val('creatinina');

        if (!creat || !peso || !idade || !sexo) {
            setResultText('res-cg', '-');
            setResultText('res-ckdepi', '-');
            setResultText('res-drc', '-');
            return;
        }

        // Cockcroft-Gault
        var cg = ((140 - idade) * peso) / (72 * creat);
        if (sexo === 'F') cg = cg * 0.85;
        setResult('res-cg', cg, 1);

        // CKD-EPI 2021
        var ckdepi = 0;
        var k  = sexo === 'F' ? 0.7 : 0.9;
        var a  = sexo === 'F' ? -0.241 : -0.302;
        var ratio = creat / k;
        if (ratio < 1) {
            ckdepi = 142 * Math.pow(ratio, a) * Math.pow(0.9938, idade);
        } else {
            ckdepi = 142 * Math.pow(ratio, -1.200) * Math.pow(0.9938, idade);
        }
        if (sexo === 'F') ckdepi = ckdepi * 1.012;
        setResult('res-ckdepi', ckdepi, 1);

        // Estadio DRC
        var estadio = '';
        if (ckdepi >= 90)      estadio = 'G1 - Normal (>= 90)';
        else if (ckdepi >= 60) estadio = 'G2 - Levemente reduzido';
        else if (ckdepi >= 45) estadio = 'G3a - Moderadamente reduzido';
        else if (ckdepi >= 30) estadio = 'G3b - Moderadamente severo';
        else if (ckdepi >= 15) estadio = 'G4 - Severamente reduzido';
        else                   estadio = 'G5 - Falencia renal';
        setResultText('res-drc', estadio);
    }

    // ─── CÁLCULOS: HEMODINÂMICA ───────────────────────────────────────────────

    function calcHemo() {
        var pas   = val('pas');
        var pad   = val('pad');
        var pvc   = val('pvc');
        var fc    = val('fc');
        var vsInp = val('vs-input');
        var hb    = val('hemoglobina');
        var sao2  = val('sao2');
        var pao2  = val('pao2');
        var svo2  = val('svo2');
        var pvo2  = val('pvo2');

        var altura = val('height');
        var peso   = val('weight');
        var sc     = (altura && peso) ? 0.007184 * Math.pow(altura, 0.725) * Math.pow(peso, 0.425) : 0;

        // PAM
        var pam = (pas && pad) ? (pas + 2 * pad) / 3 : null;
        setResult('res-pam', pam, 1);

        // Pressão de pulso
        var pp = (pas && pad) ? pas - pad : null;
        setResult('res-pp', pp, 0);

        // CaO2 e CvO2
        var cao2 = (hb && sao2) ? (hb * 13.4 * (sao2 / 100)) + (pao2 * 0.0031) : null;
        var cvo2 = (hb && svo2) ? (hb * 13.4 * (svo2 / 100)) + (pvo2 * 0.0031) : null;
        setResult('res-cao2', cao2, 2);
        setResult('res-cvo2', cvo2, 2);

        // VO2 estimado por Brody (125 mL/min/m²)
        var vo2 = sc ? 125 * sc : null;
        setResult('res-vo2', vo2, 1);

        // DC pelo princípio de Fick
        var dc = null;
        if (cao2 !== null && cvo2 !== null && vo2 !== null && cao2 > cvo2) {
            dc = vo2 / (cao2 - cvo2);
        }
        setResult('res-dc', dc, 2);

        // DC por FC x VS
        var dc2 = (fc && vsInp) ? (fc * vsInp) / 1000 : null;
        setResult('res-dc2', dc2, 2);

        // Usar dc disponível (Fick preferencial, senão FC x VS)
        var dcUsado = dc !== null ? dc : dc2;

        // IC
        var ic = (dcUsado !== null && sc) ? dcUsado / sc : null;
        setResult('res-ic', ic, 2);

        // RVS
        var rvs = (dcUsado && pam !== null) ? 80 * (pam - pvc) / dcUsado : null;
        setResult('res-rvs', rvs, 0);

        // IRVS
        var irvs = (rvs !== null && sc) ? rvs * sc : null;
        setResult('res-irvs', irvs, 0);
    }

    // ─── CÁLCULOS: HIDROELETROLÍTICO ─────────────────────────────────────────

    function calcHidro() {
        var peso     = val('weight');
        var naAtual  = val('na-atual');
        var naAlvo   = val('na-alvo');
        var glicose  = val('glicose');
        var ureia    = val('ureia');
        var sexo     = genderSelect.value;

        if (!peso) {
            setResultText('res-deficit-na', '-');
            setResultText('res-agua-livre', '-');
            setResultText('res-deficit-agua', '-');
            setResultText('res-osm', '-');
            return;
        }

        // Déficit de sódio
        if (naAtual && naAlvo) {
            var fatorNa = sexo === 'F' ? 0.5 : 0.6;
            var deficitNa = fatorNa * peso * (naAlvo - naAtual);
            setResult('res-deficit-na', deficitNa, 1);
        } else {
            setResultText('res-deficit-na', '-');
        }

        // ACT (água corporal total)
        var factorACT = sexo === 'F' ? 0.5 : 0.6;
        var act = factorACT * peso;

        // Excesso de água livre (hiponatremia)
        if (naAtual && naAtual < 135) {
            var excessoAgua = act * (1 - naAtual / 140);
            setResult('res-agua-livre', excessoAgua * 1000, 0);
        } else {
            setResultText('res-agua-livre', '-');
        }

        // Déficit de água livre (hipernatremia)
        if (naAtual && naAtual > 145) {
            var deficitAgua = act * (naAtual / 140 - 1);
            setResult('res-deficit-agua', deficitAgua * 1000, 0);
        } else {
            setResultText('res-deficit-agua', '-');
        }

        // Osmolaridade
        if (naAtual && glicose && ureia) {
            var osm = 2 * naAtual + glicose / 18 + ureia / 6;
            setResult('res-osm', osm, 1);
        } else {
            setResultText('res-osm', '-');
        }
    }

    // ─── CÁLCULOS: TRANSFUSÃO ────────────────────────────────────────────────

    function calcTransf() {
        var peso      = val('weight');
        var hbAtual   = val('hb-atual');
        var htInicial = val('ht-inicial');
        var htMinimo  = val('ht-minimo');
        var hbAlvo    = val('hb-alvo');
        var sexo      = genderSelect.value;

        if (!peso) {
            setResultText('res-vse', '-');
            setResultText('res-pmt', '-');
            setResultText('res-ch', '-');
            setResultText('res-plaq', '-');
            return;
        }

        // Volume sanguíneo estimado
        var factorVSE = sexo === 'F' ? 65 : 70;
        if (!sexo) factorVSE = 70;
        var vse = peso * factorVSE;
        setResult('res-vse', vse, 0);

        // Perda máxima tolerada
        if (htInicial && htMinimo) {
            var htMedio = (htInicial + htMinimo) / 2;
            var pmt = vse * (htInicial - htMinimo) / htMedio;
            setResult('res-pmt', pmt, 0);
        } else {
            setResultText('res-pmt', '-');
        }

        // CH necessários
        if (hbAtual && hbAlvo) {
            var deficitHb = hbAlvo - hbAtual;
            if (deficitHb > 0) {
                var ch = (deficitHb * peso * 0.3) / 50;
                setResult('res-ch', ch, 1);
            } else {
                setResultText('res-ch', 'Hb acima do alvo');
            }
        } else {
            setResultText('res-ch', '-');
        }

        // Plaquetas
        var plaq = peso / 10;
        setResult('res-plaq', plaq, 1);
    }

    // ─── RECALC GERAL ────────────────────────────────────────────────────────

    function recalcAll() {
        calcAntropometria();
        calcRenal();
        calcHemo();
        calcHidro();
        calcTransf();
    }

    // ─── ADICIONAR À SESSÃO ───────────────────────────────────────────────────

    function getModuleResults(module) {
        var results = [];
        switch (module) {
            case 'antropometria':
                results = [
                    { label: 'IMC', value: document.getElementById('res-imc').textContent },
                    { label: 'Classificacao IMC', value: document.getElementById('res-imc-class').textContent },
                    { label: 'Superficie Corporal (m2)', value: document.getElementById('res-sc').textContent },
                    { label: 'Peso Ideal - Devine (kg)', value: document.getElementById('res-pi').textContent },
                    { label: 'Peso Ajustado (kg)', value: document.getElementById('res-pa').textContent },
                    { label: 'Peso Magro - LBW (kg)', value: document.getElementById('res-lbw').textContent }
                ];
                break;
            case 'renal':
                results = [
                    { label: 'Creatinina (mg/dL)', value: val('creatinina').toString() },
                    { label: 'Cockcroft-Gault (mL/min)', value: document.getElementById('res-cg').textContent },
                    { label: 'CKD-EPI (mL/min/1.73m2)', value: document.getElementById('res-ckdepi').textContent },
                    { label: 'Estadio DRC', value: document.getElementById('res-drc').textContent }
                ];
                break;
            case 'hemo':
                results = [
                    { label: 'PAM (mmHg)', value: document.getElementById('res-pam').textContent },
                    { label: 'PP (mmHg)', value: document.getElementById('res-pp').textContent },
                    { label: 'DC Fick (L/min)', value: document.getElementById('res-dc').textContent },
                    { label: 'DC FC x VS (L/min)', value: document.getElementById('res-dc2').textContent },
                    { label: 'IC (L/min/m2)', value: document.getElementById('res-ic').textContent },
                    { label: 'RVS (dyn.s/cm5)', value: document.getElementById('res-rvs').textContent },
                    { label: 'IRVS (dyn.s/cm5.m2)', value: document.getElementById('res-irvs').textContent },
                    { label: 'CaO2 (mL/L)', value: document.getElementById('res-cao2').textContent },
                    { label: 'CvO2 (mL/L)', value: document.getElementById('res-cvo2').textContent }
                ];
                break;
            case 'hidro':
                results = [
                    { label: 'Deficit de Na+ (mEq)', value: document.getElementById('res-deficit-na').textContent },
                    { label: 'Excesso Agua Livre (mL)', value: document.getElementById('res-agua-livre').textContent },
                    { label: 'Deficit Agua Livre (mL)', value: document.getElementById('res-deficit-agua').textContent },
                    { label: 'Osmolaridade (mOsm/L)', value: document.getElementById('res-osm').textContent }
                ];
                break;
            case 'transf':
                results = [
                    { label: 'Vol. Sanguineo Est. (mL)', value: document.getElementById('res-vse').textContent },
                    { label: 'Perda Max. Tolerada (mL)', value: document.getElementById('res-pmt').textContent },
                    { label: 'CH necessarios (unid.)', value: document.getElementById('res-ch').textContent },
                    { label: 'Plaquetas (unid.)', value: document.getElementById('res-plaq').textContent }
                ];
                break;
        }
        return results.filter(function (r) { return r.value !== '-' && r.value !== ''; });
    }

    function getModuleName(module) {
        var names = {
            'antropometria': 'Antropometria',
            'renal': 'Funcao Renal',
            'hemo': 'Hemodinamica',
            'hidro': 'Hidroeletrolitico',
            'transf': 'Transfusao'
        };
        return names[module] || module;
    }

    function addToSession(module) {
        var results = getModuleResults(module);
        if (results.length === 0) {
            alert('Nenhum resultado disponivel para adicionar.');
            return;
        }
        try {
            var session = JSON.parse(localStorage.getItem('sessionData')) || { calcs: [], drugs: [] };
            if (!session.calcs) session.calcs = [];

            var entry = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                module: getModuleName(module),
                weight: weightInput.value,
                results: results
            };

            session.calcs.push(entry);
            localStorage.setItem('sessionData', JSON.stringify(session));

            var btn = document.querySelector('.btn-add-session[data-module="' + module + '"]');
            if (btn) {
                var original = btn.textContent;
                btn.textContent = '✅ Adicionado!';
                btn.disabled = true;
                setTimeout(function () {
                    btn.textContent = original;
                    btn.disabled = false;
                }, 2000);
            }
        } catch (e) {
            alert('Erro ao adicionar a sessao.');
        }
    }

    // ─── MÓDULOS COLAPSÁVEIS ─────────────────────────────────────────────────

    function initModuleToggles() {
        var headers = document.querySelectorAll('.calc-module-header');
        headers.forEach(function (header) {
            header.addEventListener('click', function () {
                var targetId = header.getAttribute('data-target');
                var body = document.getElementById(targetId);
                var toggle = header.querySelector('.module-toggle');
                if (!body) return;
                var isOpen = !body.classList.contains('module-collapsed');
                if (isOpen) {
                    body.classList.add('module-collapsed');
                    if (toggle) toggle.textContent = '▶';
                } else {
                    body.classList.remove('module-collapsed');
                    if (toggle) toggle.textContent = '▼';
                }
            });
        });
    }

    // ─── MENU ────────────────────────────────────────────────────────────────

    function initMenu() {
        var hamburger  = document.getElementById('hamburger-menu');
        var sideMenu   = document.querySelector('.side-menu');
        var overlay    = document.getElementById('overlay');
        var legalBtn   = document.getElementById('legal-btn');
        var devBtn     = document.getElementById('dev-btn');
        var appInfoBtn = document.getElementById('app-info-btn');
        var legalModal = document.getElementById('legal-modal');
        var devModal   = document.getElementById('dev-modal');
        var appInfoModal = document.getElementById('app-info-modal');
        var closeButtons = document.querySelectorAll('.close-button');
        var darkModeToggle = document.getElementById('darkModeToggle');
        var navInfusao = document.getElementById('nav-infusao');
        var navSessao  = document.getElementById('nav-sessao');

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

        if (navInfusao) navInfusao.addEventListener('click', function () { window.location.href = 'index.html'; });
        if (navSessao)  navSessao.addEventListener('click', function () { window.location.href = 'sessao.html'; });

        if (legalBtn)   legalBtn.addEventListener('click', function () { openModal(legalModal); });
        if (devBtn)     devBtn.addEventListener('click', function () { openModal(devModal); });
        if (appInfoBtn) appInfoBtn.addEventListener('click', function () { openModal(appInfoModal); });

        closeButtons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                var modal = e.currentTarget.closest('.modal');
                if (modal) modal.style.display = 'none';
            });
        });

        window.addEventListener('click', function (event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        });

        function applyDarkMode(isDark) {
            document.body.classList.toggle('dark-mode', isDark);
            if (darkModeToggle) darkModeToggle.checked = isDark;
        }

        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', function () {
                localStorage.setItem('darkMode', darkModeToggle.checked);
                applyDarkMode(darkModeToggle.checked);
            });
        }

        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var savedTheme  = localStorage.getItem('darkMode');
        applyDarkMode(savedTheme === 'true' || (savedTheme === null && prefersDark));
    }

    // ─── EVENT LISTENERS ─────────────────────────────────────────────────────

    function initInputs() {
        var patientInputs = [weightInput, heightInput, ageInput, genderSelect];
        patientInputs.forEach(function (el) {
            if (!el) return;
            var eventType = el.tagName === 'SELECT' ? 'change' : 'input';
            el.addEventListener(eventType, function () {
                if (el.tagName !== 'SELECT') sanitize(el);
                savePatientData();
                recalcAll();
            });
        });

        var calcInputIds = [
            'creatinina',
            'pas', 'pad', 'pvc', 'fc', 'vs-input',
            'hemoglobina', 'sao2', 'pao2', 'svo2', 'pvo2',
            'na-atual', 'na-alvo', 'glicose', 'ureia',
            'hb-atual', 'ht-inicial', 'ht-minimo', 'hb-alvo'
        ];

        calcInputIds.forEach(function (id) {
            var el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('input', function () {
                sanitize(el);
                recalcAll();
            });
        });

        var addBtns = document.querySelectorAll('.btn-add-session');
        addBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                addToSession(btn.getAttribute('data-module'));
            });
        });
    }

    // ─── INIT ─────────────────────────────────────────────────────────────────

    initMenu();
    initModuleToggles();
    initInputs();
    loadPatientData();
});