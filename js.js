// script.js
(function() {
    const projectSelect = document.getElementById('projectType');
    const areaInput = document.getElementById('areaInput');
    const finishSelect = document.getElementById('finishSelect');
    const regionSelect = document.getElementById('regionSelect');
    const calcBtn = document.getElementById('calcBtn');
    const priceSpan = document.querySelector('#priceResult span');

    function getBaseCostPerM2(projectType) {
        switch(projectType) {
            case 'skand': return 33100;
            case 'classic': return 34200;
            case 'chale': return 39800;
            case 'custom': return 32500;
            default: return 33500;
        }
    }

    function getFinishCoefficient(finishType) {
        if (finishType === 'rough') return 0.75;
        if (finishType === 'fine') return 1.0;
        if (finishType === 'premium') return 1.45;
        return 1.0;
    }

    function getRegionCoefficient(region) {
        if (region === 'center') return 1.0;
        if (region === 'north') return 1.08;
        if (region === 'south') return 0.96;
        return 1.0;
    }

    function updateCalculator() {
        let projectType = projectSelect.value;
        let areaRaw = parseFloat(areaInput.value);
        if (isNaN(areaRaw) || areaRaw < 50) areaRaw = 80;
        if (areaRaw > 800) areaRaw = 800;

        let fixedArea = 0;
        if (projectType === 'skand') fixedArea = 145;
        else if (projectType === 'classic') fixedArea = 210;
        else if (projectType === 'chale') fixedArea = 98;

        let finalArea;
        if (projectType !== 'custom') {
            finalArea = fixedArea;
            areaInput.value = fixedArea;
        } else {
            finalArea = areaRaw;
            if (finalArea < 70) finalArea = 70;
            areaInput.value = finalArea;
        }

        let basePerM2 = getBaseCostPerM2(projectType);
        let finishCoef = getFinishCoefficient(finishSelect.value);
        let regionCoef = getRegionCoefficient(regionSelect.value);

        let totalCost = basePerM2 * finalArea * finishCoef * regionCoef;
        totalCost = Math.round(totalCost / 1000) * 1000;
        priceSpan.innerText = totalCost.toLocaleString('ru-RU') + ' ₽';
    }

    function onProjectChange() {
        let projectType = projectSelect.value;
        if (projectType === 'skand') areaInput.value = 145;
        else if (projectType === 'classic') areaInput.value = 210;
        else if (projectType === 'chale') areaInput.value = 98;
        else if (projectType === 'custom') {
            let current = parseFloat(areaInput.value);
            if (isNaN(current) || current < 70) areaInput.value = 120;
        }
        updateCalculator();
    }

    projectSelect.addEventListener('change', onProjectChange);
    areaInput.addEventListener('input', function() {
        let val = parseFloat(areaInput.value);
        if (projectSelect.value !== 'custom') {
            projectSelect.value = 'custom';
        }
        if (isNaN(val)) areaInput.value = 100;
        updateCalculator();
    });
    finishSelect.addEventListener('change', updateCalculator);
    regionSelect.addEventListener('change', updateCalculator);
    calcBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updateCalculator();
    });

    onProjectChange();
})();