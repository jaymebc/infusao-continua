// calculator.js - Lógica de cálculos (funções puras)

export function calculateResults(mode, drugData, params, currentPresentationIndex) {
    const weight = params.weight;
    const quantity = parseFloat(params.quantity) || 0;
    const volume = parseFloat(params.volume) || 0;
    const dose = parseFloat(params.dose) || 0;
    const infusionRate = parseFloat(params.infusionRate) || 0;
    
    let results = [];
    let dilutionNote = null;
    
    if (weight === 0) {
        return { results: [{ label: 'Erro', value: 'Peso inválido' }], dilutionNote: null };
    }
    
    if (mode === 'bolus') {
        if (drugData.bolus_type === 'direct') {
            const totalDose = dose * weight;
            
            // ✅ CORRIGIDO: Usar dose_min e dose_max
            const doseWarning = checkDoseRange(drugData, dose);
            
            results.push({ 
                label: `Dose Total (${drugData.default_quantity_unit})`, 
                value: totalDose.toFixed(2) + (doseWarning ? ' ⚠️' : '')
            });
            
            if (drugData.group_key === 'fentanil') {
                const originalConcentration = 50;
                const targetConcentration = 10;
                const step = 50;
                
                const multiple = Math.ceil(totalDose / step) * step;
                const volumeFentanilPure = multiple / originalConcentration;
                const volumeFinal = multiple / targetConcentration;
                const volumeABD = volumeFinal - volumeFentanilPure;
                const volumeApply = totalDose / targetConcentration;
                
                dilutionNote = `Dilua ${volumeFentanilPure.toFixed(1)}mL com ${volumeABD.toFixed(1)}mL de ABD e aplique ${volumeApply.toFixed(1)}mL da solução`;
                
            } else if (drugData.group_key === 'ketamina') {
                const originalConcentration = 50;
                const targetConcentration = 5;
                const step = 50;
                
                const multiple = Math.ceil(totalDose / step) * step;
                const volumeKetaminePure = multiple / originalConcentration;
                const volumeFinal = multiple / targetConcentration;
                const volumeABD = volumeFinal - volumeKetaminePure;
                const volumeApply = totalDose / targetConcentration;
                
                dilutionNote = `Dilua ${volumeKetaminePure.toFixed(1)}mL com ${volumeABD.toFixed(1)}mL de ABD e aplique ${volumeApply.toFixed(1)}mL da solução`;
                
            } else if (drugData.group_key === 'midazolam') {
                const selectedOption = drugData.presentation_options[currentPresentationIndex];
                const concentration = selectedOption.concentration;
                
                if (concentration === 1) {
                    // Apresentação 5mg/5mL (1mg/mL)
                    const volumeApply = totalDose; // totalDose em mg = volume em mL (pois 1mg/mL)
                    const ampouleVolume = 5; // Volume da ampola
                    const ampouleQuantity = 5; // Quantidade em mg da ampola
                    
                    results.push({ 
                        label: 'Volume (mL)', 
                        value: volumeApply.toFixed(2) 
                    });
                    
                    // Se a dose é menor ou igual à ampola, usar apenas uma ampola
                    if (totalDose <= ampouleQuantity) {
                        dilutionNote = `Aspire ${ampouleVolume.toFixed(1)}mL da ampola e aplique ${volumeApply.toFixed(1)}mL no paciente`;
                    } else {
                        // Múltiplas ampolas necessárias
                        const ampsNeeded = Math.ceil(totalDose / ampouleQuantity);
                        dilutionNote = `Use ${ampsNeeded} ampola(s). Aspire todo o conteúdo e aplique ${volumeApply.toFixed(1)}mL no paciente`;
                    }
                    
                } else {
                    // Apresentação 5mg/mL - diluir para 1mg/mL
                    const originalConcentration = 5;
                    const targetConcentration = 1;
                    const step = 5;
                    
                    const multiple = Math.ceil(totalDose / step) * step;
                    const volumeMidazolamPure = multiple / originalConcentration;
                    const volumeFinal = multiple / targetConcentration;
                    const volumeABD = volumeFinal - volumeMidazolamPure;
                    const volumeApply = totalDose / targetConcentration;
                    
                    dilutionNote = `Dilua ${volumeMidazolamPure.toFixed(1)}mL com ${volumeABD.toFixed(1)}mL de ABD e aplique ${volumeApply.toFixed(1)}mL da solução`;
                }
                
            } else if (drugData.group_key === 'propofol') {
                const volumeApply = totalDose / 10;
                results.push({ 
                    label: 'Volume (mL)', 
                    value: volumeApply.toFixed(2) 
                });
                
            } else if (drugData.group_key === 'rocuronio') {
                const inductionDose = 0.6 * weight;
                const rsiDose = 1.2 * weight;
                
                results.push({ 
                    label: 'Dose de Indução (0.6 mg/kg)', 
                    value: inductionDose.toFixed(1) + ' mg' 
                });
                results.push({ 
                    label: 'Dose de SRI (1.2 mg/kg)', 
                    value: rsiDose.toFixed(1) + ' mg' 
                });
                
                const originalConcentration = 10;
                const targetConcentration = 5;
                const step = 50;
                
                const multiple = Math.ceil(totalDose / step) * step;
                const volumeRocuronioPure = multiple / originalConcentration;
                const volumeFinal = multiple / targetConcentration;
                const volumeABD = volumeFinal - volumeRocuronioPure;
                const volumeApply = totalDose / targetConcentration;
                
                dilutionNote = `Dilua ${volumeRocuronioPure.toFixed(1)}mL com ${volumeABD.toFixed(1)}mL de ABD e aplique ${volumeApply.toFixed(1)}mL da solução`;
                
            } else if (drugData.group_key === 'heparina') {
                const volumeApply = totalDose / 5000;
                results.push({ 
                    label: 'Volume (mL)', 
                    value: volumeApply.toFixed(2) 
                });
            }
            
            // Adicionar nota de aviso se dose alta
            if (doseWarning) {
                if (!dilutionNote) {
                    dilutionNote = doseWarning;
                } else {
                    dilutionNote += `\n\n⚠️ ${doseWarning}`;
                }
            }
            
        } else {
            // BOLUS DILUTED
            if (volume === 0) {
                return { results: [{ label: 'Erro', value: 'Volume inválido' }], dilutionNote: null };
            }
            
            const totalDose = dose * weight;
            
            // ✅ CORRIGIDO: Usar dose_min e dose_max
            const doseWarning = checkDoseRange(drugData, dose);
            
            let concentrationFactor = 1;
            if (drugData.dose_unit.includes('mcg') && drugData.default_quantity_unit === 'mg') {
                concentrationFactor = 1000;
            }
            const calculatedConcentration = (quantity * concentrationFactor) / volume;
            
            const totalVolume = calculatedConcentration > 0 ? totalDose / calculatedConcentration : 0;
            
            const concentrationLabel = drugData.dose_unit.includes('mcg') ? 'mcg/mL' : 'mg/mL';
            
            results.push({ label: `Dose Total (${drugData.default_quantity_unit})`, value: totalDose.toFixed(2) + (doseWarning ? ' ⚠️' : '') });
            results.push({ label: `Concentração (${concentrationLabel})`, value: calculatedConcentration.toFixed(2) });
            results.push({ label: 'Volume Total (mL)', value: totalVolume.toFixed(2) });
            
            if (drugData.group_key === 'dexmedetomidina') {
                const rate10min = totalVolume * 6;
                const rate20min = totalVolume * 3;
                results.push({ label: 'Bolus em 10 min (mL/h)', value: rate10min.toFixed(2) });
                results.push({ label: 'Bolus em 20 min (mL/h)', value: rate20min.toFixed(2) });
            } else if (drugData.group_key === 'acido_tranexamico') {
                const rate20min = totalVolume * 3;
                const maxRate = calculatedConcentration > 0 ? (100 / calculatedConcentration) * 60 : 0;
                const finalRate = Math.min(rate20min, maxRate);
                results.push({ label: 'Velocidade em 20 min (mL/h)', value: finalRate.toFixed(2) });
                if (finalRate < rate20min && finalRate > 0) {
                    const actualTime = (totalVolume / (finalRate / 60)).toFixed(1);
                    results.push({ label: 'Tempo real (min)', value: actualTime });
                }
            } else if (drugData.group_key === 'milrinona') {
                const rate10min = totalVolume * 6;
                results.push({ label: 'Bolus em 10 min (mL/h)', value: rate10min.toFixed(2) });
            } else if (drugData.group_key === 'sulfato_magnesio') {
                const rate15min = totalVolume * 4;
                results.push({ label: 'Velocidade em 15 min (mL/h)', value: rate15min.toFixed(2) });
            }
            
            // Adicionar aviso de dose alta
            if (doseWarning) {
                if (!dilutionNote) {
                    dilutionNote = doseWarning;
                } else {
                    dilutionNote += `\n\n⚠️ ${doseWarning}`;
                }
            }
        }
        
    } else if (mode === 'infusion') {
        if (volume === 0) {
            return { results: [{ label: 'Erro', value: 'Volume inválido' }], dilutionNote: null };
        }
        
        // ✅ CORRIGIDO: Usar dose_min e dose_max
        const doseWarning = checkDoseRange(drugData, dose);
        
        let concentrationFactor = 1;
        if (drugData.dose_unit.includes('mcg') && drugData.default_quantity_unit === 'mg') {
            concentrationFactor = 1000;
        }
        
        const calculatedConcentration = (quantity * concentrationFactor) / volume;
        
        let infusionRateCalc = 0;
        if (drugData.dose_unit.includes('/min') && drugData.dose_unit.includes('kg')) {
            infusionRateCalc = calculatedConcentration > 0 ? (dose * weight * 60) / calculatedConcentration : 0;
        } else if (drugData.dose_unit.includes('/h') && drugData.dose_unit.includes('kg')) {
            infusionRateCalc = calculatedConcentration > 0 ? (dose * weight) / calculatedConcentration : 0;
        } else if (drugData.dose_unit === 'U/min') {
            infusionRateCalc = calculatedConcentration > 0 ? (dose * 60) / calculatedConcentration : 0;
        } else if (drugData.dose_unit === 'mcg/min') {
            infusionRateCalc = calculatedConcentration > 0 ? (dose * 60) / calculatedConcentration : 0;
        } else if (drugData.dose_unit === 'UI/kg/h') {
            infusionRateCalc = calculatedConcentration > 0 ? (dose * weight) / calculatedConcentration : 0;
        }
        
        const concentrationLabel = drugData.dose_unit.includes('mcg') ? 'mcg/mL' : 
                                  drugData.dose_unit.includes('UI') || drugData.dose_unit.includes('U') ? 'U/mL' : 'mg/mL';
        
        results.push({ label: `Concentração (${concentrationLabel})`, value: calculatedConcentration.toFixed(2) });
        results.push({ label: 'Velocidade (mL/h)', value: infusionRateCalc.toFixed(2) + (doseWarning ? ' ⚠️' : '') });
        
        // Adicionar aviso de dose alta
        if (doseWarning) {
            dilutionNote = doseWarning;
        }
        
    } else if (mode === 'check-dose') {
        if (volume === 0) {
            return { results: [{ label: 'Erro', value: 'Volume inválido' }], dilutionNote: null };
        }
        
        let concentrationFactor = 1;
        if (drugData.dose_unit.includes('mcg') && drugData.default_quantity_unit === 'mg') {
            concentrationFactor = 1000;
        }
        
        const calculatedConcentration = (quantity * concentrationFactor) / volume;
        
        let realDose = 0;
        if (drugData.dose_unit.includes('/min') && drugData.dose_unit.includes('kg')) {
            realDose = (weight > 0 && calculatedConcentration > 0) ? (infusionRate * calculatedConcentration) / (weight * 60) : 0;
        } else if (drugData.dose_unit.includes('/h') && drugData.dose_unit.includes('kg')) {
            realDose = (weight > 0 && calculatedConcentration > 0) ? (infusionRate * calculatedConcentration) / weight : 0;
        } else if (drugData.dose_unit === 'U/min') {
            realDose = calculatedConcentration > 0 ? (infusionRate * calculatedConcentration) / 60 : 0;
        } else if (drugData.dose_unit === 'mcg/min') {
            realDose = calculatedConcentration > 0 ? (infusionRate * calculatedConcentration) / 60 : 0;
        } else if (drugData.dose_unit === 'UI/kg/h') {
            realDose = (weight > 0 && calculatedConcentration > 0) ? (infusionRate * calculatedConcentration) / weight : 0;
        }
        
        const concentrationLabel = drugData.dose_unit.includes('mcg') ? 'mcg/mL' : 
                                  drugData.dose_unit.includes('UI') || drugData.dose_unit.includes('U') ? 'U/mL' : 'mg/mL';
        
        // ✅ CORRIGIDO: Usar dose_min e dose_max
        const doseWarning = checkDoseRange(drugData, realDose);
        
        results.push({ label: `Concentração (${concentrationLabel})`, value: calculatedConcentration.toFixed(2) });
        results.push({ label: `Dose Real (${drugData.dose_unit})`, value: realDose.toFixed(3) + (doseWarning ? ' ⚠️' : '') });
        
        // Adicionar aviso
        if (doseWarning) {
            dilutionNote = doseWarning;
        }
    }
    
    return { results, dilutionNote };
}

// ✅ FUNÇÃO CORRIGIDA: Validação de dose usando dose_min e dose_max
function checkDoseRange(drugData, dose) {
    // Se não tiver dose_min e dose_max, não validar
    if (drugData.dose_min === undefined || drugData.dose_max === undefined) {
        return null;
    }
    
    const minDose = drugData.dose_min;
    const maxDose = drugData.dose_max;
    const unit = drugData.dose_unit || '';
    
    // Verificar se está muito acima do máximo (>150%)
    if (dose > maxDose * 1.5) {
        return `⚠️ ATENÇÃO: Dose MUITO ALTA! (${dose.toFixed(3)} ${unit}) Range recomendado: ${minDose}-${maxDose} ${unit}`;
    }
    
    // Verificar se está acima do máximo (100-150%)
    if (dose > maxDose) {
        return `⚠️ Aviso: Dose acima do recomendado (${dose.toFixed(3)} ${unit}). Range: ${minDose}-${maxDose} ${unit}`;
    }
    
    // Verificar se está abaixo do mínimo recomendado
    if (dose < minDose) {
        return `⚠️ Aviso: Dose abaixo do recomendado (${dose.toFixed(3)} ${unit}). Range: ${minDose}-${maxDose} ${unit}`;
    }
    
    // Verificar se está muito abaixo do mínimo (< 50%)
    if (dose < minDose * 0.5) {
        return `⚠️ Aviso: Dose MUITO BAIXA! (${dose.toFixed(3)} ${unit}). Range recomendado: ${minDose}-${maxDose} ${unit}`;
    }
    
    return null;
}

// ✅ FUNÇÃO CORRIGIDA: Extrair mínimo do range
export function getMinDoseFromRange(doseRangeText) {
    if (!doseRangeText) return '1';
    
    // Extrair AMBOS os números (min e max)
    const rangeMatch = doseRangeText.match(/([0-9.]+)\s*-\s*([0-9.]+)/);
    
    if (!rangeMatch) return '1';
    
    const minDose = parseFloat(rangeMatch[1]);
    const maxDose = parseFloat(rangeMatch[2]);
    
    // Retornar o menor valor
    return Math.min(minDose, maxDose).toString();
}

export function groupDrugsByBaseName(rawDb) {
    const grouped = {};
    for (const key in rawDb) {
        const drug = rawDb[key];
        const group_key = drug.group_key;
        
        if (!grouped[group_key]) {
            grouped[group_key] = {
                group_key: group_key,
                name: drug.name,
                brand_name: drug.brand_name || null,
                category: drug.category,
                bolus: null,
                infusion: null,
                notes: ''
            };
        }
        
        if (drug.calc_type === 'bolus') {
            grouped[group_key].bolus = drug;
        } else if (drug.calc_type === 'infusion') {
            grouped[group_key].infusion = drug;
        }
        
        if (drug.notes) {
            grouped[group_key].notes += (grouped[group_key].notes ? '\n\n' : '') + drug.notes;
        }
    }
    return grouped;
}