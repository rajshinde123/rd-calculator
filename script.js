/**
 * Recurring Deposit (RD) Calculator - Advanced Real-World Features
 * Author: rajshinde123
 * Standard Quarterly Compounding (Indian Banking / Post Office standard)
 */

(function () {
    'use strict';

    // DOM Elements - Calculation Mode
    const modeStandardBtn = document.getElementById('modeStandard');
    const modeGoalBtn = document.getElementById('modeGoal');
    const amountLabel = document.getElementById('amountLabel');
    const amountInput = document.getElementById('amountInput');
    const amountSlider = document.getElementById('amountSlider');
    const amountTicks = document.getElementById('amountTicks');
    const amountChipsContainer = document.getElementById('amountChips');

    // DOM Elements - Interest & Senior Citizen & Banks
    const interestRateInput = document.getElementById('interestRateInput');
    const interestRateSlider = document.getElementById('interestRateSlider');
    const seniorCitizenToggle = document.getElementById('seniorCitizenToggle');
    const srBadge = document.getElementById('srBadge');
    const seniorBenefitBadge = document.getElementById('seniorBenefitBadge');
    const srGainValue = document.getElementById('srGainValue');
    const bankChips = document.querySelectorAll('.bank-chip');

    // DOM Elements - Tenure
    const tenureInput = document.getElementById('tenureInput');
    const tenureSlider = document.getElementById('tenureSlider');
    const tenureUnitLabel = document.getElementById('tenureUnitLabel');
    const unitYearsBtn = document.getElementById('unitYears');
    const unitMonthsBtn = document.getElementById('unitMonths');
    const tenureTicks = document.getElementById('tenureTicks');
    const tenureChipsContainer = document.getElementById('tenureChips');
    const compoundingSelect = document.getElementById('compoundingSelect');
    const resetBtn = document.getElementById('resetBtn');

    // DOM Elements - Results
    const highlightCard = document.getElementById('highlightCard');
    const highlightLabel = document.getElementById('highlightLabel');
    const highlightMainValue = document.getElementById('highlightMainValue');
    const maturityDateEl = document.getElementById('maturityDate');
    const returnPercentageEl = document.getElementById('returnPercentage');
    const totalInvestedEl = document.getElementById('totalInvested');
    const investedPctEl = document.getElementById('investedPct');
    const totalInterestEl = document.getElementById('totalInterest');
    const interestPctEl = document.getElementById('interestPct');
    const chartTenureEl = document.getElementById('chartTenure');
    const legendInvestedText = document.getElementById('legendInvestedText');
    const statInvestedLabel = document.getElementById('statInvestedLabel');

    // DOM Elements - Donut Chart
    const donutInvested = document.getElementById('donutInvested');
    const donutInterest = document.getElementById('donutInterest');
    const CIRCUMFERENCE = 2 * Math.PI * 75; // r = 75

    // DOM Elements - Premature Closure
    const prematureToggle = document.getElementById('prematureToggle');
    const prematureBody = document.getElementById('prematureBody');
    const prematureSlider = document.getElementById('prematureSlider');
    const prematureMonthsText = document.getElementById('prematureMonthsText');
    const prematureMidTick = document.getElementById('prematureMidTick');
    const prematureMaxTick = document.getElementById('prematureMaxTick');
    const pDeposited = document.getElementById('pDeposited');
    const pRateApplied = document.getElementById('pRateApplied');
    const pInterest = document.getElementById('pInterest');
    const pPayout = document.getElementById('pPayout');
    const pLossTag = document.getElementById('pLossTag');

    // DOM Elements - Schedule Table
    const viewYearlyBtn = document.getElementById('viewYearly');
    const viewMonthlyBtn = document.getElementById('viewMonthly');
    const thPeriod = document.getElementById('thPeriod');
    const scheduleTableBody = document.getElementById('scheduleTableBody');
    const downloadCsvBtn = document.getElementById('downloadCsvBtn');

    // DOM Elements - Actions & Theme
    const themeToggle = document.getElementById('themeToggle');
    const themeIconSun = document.getElementById('themeIconSun');
    const themeIconMoon = document.getElementById('themeIconMoon');
    const printBtn = document.getElementById('printBtn');
    const copySummaryBtn = document.getElementById('copySummaryBtn');
    const toast = document.getElementById('toast');

    // State Variables
    let currentMode = 'standard'; // 'standard' or 'goal'
    let tenureUnit = 'years';      // 'years' or 'months'
    let scheduleView = 'yearly';   // 'yearly' or 'monthly'
    let activeBank = 'postoffice'; // 'postoffice', 'sbi', etc.
    let baseRateWithoutSr = 7.10;
    let latestCalculation = null;

    // Currency Formatters
    const inrFormatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    });

    // Smooth Number Count-Up Animation
    const previousValues = new WeakMap();

    function animateNumberValue(el, targetVal, suffix = '', duration = 300) {
        if (!el) return;
        const startVal = previousValues.has(el) ? previousValues.get(el) : targetVal;
        previousValues.set(el, targetVal);

        if (startVal === targetVal) {
            el.textContent = inrFormatter.format(targetVal) + suffix;
            return;
        }

        const startTime = performance.now();
        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const current = Math.round(startVal + (targetVal - startVal) * ease);
            el.textContent = inrFormatter.format(current) + suffix;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = inrFormatter.format(targetVal) + suffix;
            }
        }
        requestAnimationFrame(tick);
    }

    /**
     * Theme Handler
     */
    function initTheme() {
        const savedTheme = localStorage.getItem('rd_theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const currentTheme = savedTheme || (systemDark ? 'dark' : 'light');
        setTheme(currentTheme);
    }

    function setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('rd_theme', theme);
        if (theme === 'dark') {
            themeIconSun.classList.add('hidden');
            themeIconMoon.classList.remove('hidden');
        } else {
            themeIconSun.classList.remove('hidden');
            themeIconMoon.classList.add('hidden');
        }
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    /**
     * Slider Track Fill Sync
     */
    function updateSliderFill(slider) {
        const min = parseFloat(slider.min) || 0;
        const max = parseFloat(slider.max) || 100;
        const val = parseFloat(slider.value) || 0;
        const percentage = Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
        slider.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${percentage}%, var(--bg-card-subtle) ${percentage}%, var(--bg-card-subtle) 100%)`;
    }

    /**
     * Sync Inputs & Sliders
     */
    function setupSync(inputEl, sliderEl) {
        sliderEl.addEventListener('input', () => {
            inputEl.value = sliderEl.value;
            updateSliderFill(sliderEl);
            calculateAndRender();
        });

        inputEl.addEventListener('input', () => {
            let val = parseFloat(inputEl.value);
            if (!isNaN(val)) {
                sliderEl.value = val;
                updateSliderFill(sliderEl);
                calculateAndRender();
            }
        });
    }

    setupSync(amountInput, amountSlider);
    setupSync(interestRateInput, interestRateSlider);
    setupSync(tenureInput, tenureSlider);

    /**
     * Calculation Mode Switcher (Standard RD vs Target Goal RD)
     */
    function setCalculationMode(mode) {
        if (currentMode === mode) return;
        currentMode = mode;

        if (mode === 'standard') {
            modeStandardBtn.classList.add('active');
            modeGoalBtn.classList.remove('active');
            amountLabel.textContent = 'Monthly Deposit';

            amountInput.min = 500;
            amountInput.max = 1000000;
            amountInput.step = 500;
            amountInput.value = 5000;

            amountSlider.min = 500;
            amountSlider.max = 100000;
            amountSlider.step = 500;
            amountSlider.value = 5000;

            amountTicks.innerHTML = `
                <span>₹500</span>
                <span>₹25,000</span>
                <span>₹50,000</span>
                <span>₹1,00,000</span>
            `;

            amountChipsContainer.innerHTML = `
                <button type="button" class="chip" data-amount="2000">₹2,000</button>
                <button type="button" class="chip active" data-amount="5000">₹5,000</button>
                <button type="button" class="chip" data-amount="10000">₹10,000</button>
                <button type="button" class="chip" data-amount="25000">₹25,000</button>
            `;

            highlightLabel.textContent = 'Expected Maturity Amount';
            statInvestedLabel.textContent = 'Total Investment';
            legendInvestedText.textContent = 'Invested Amount';
        } else {
            modeGoalBtn.classList.add('active');
            modeStandardBtn.classList.remove('active');
            amountLabel.textContent = 'Target Maturity Goal';

            amountInput.min = 10000;
            amountInput.max = 5000000;
            amountInput.step = 5000;
            amountInput.value = 100000;

            amountSlider.min = 10000;
            amountSlider.max = 1000000;
            amountSlider.step = 5000;
            amountSlider.value = 100000;

            amountTicks.innerHTML = `
                <span>₹10,000</span>
                <span>₹2,50,000</span>
                <span>₹5,00,000</span>
                <span>₹10,00,000</span>
            `;

            amountChipsContainer.innerHTML = `
                <button type="button" class="chip" data-amount="50000">₹50,000</button>
                <button type="button" class="chip active" data-amount="100000">₹1,00,000</button>
                <button type="button" class="chip" data-amount="200000">₹2,00,000</button>
                <button type="button" class="chip" data-amount="500000">₹5,00,000</button>
            `;

            highlightLabel.textContent = 'Required Monthly Deposit';
            statInvestedLabel.textContent = 'Total You Will Deposit';
            legendInvestedText.textContent = 'Monthly Installments';
        }

        attachAmountChipListeners();
        updateSliderFill(amountSlider);
        calculateAndRender();
    }

    function attachAmountChipListeners() {
        amountChipsContainer.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', () => {
                amountChipsContainer.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                amountInput.value = chip.dataset.amount;
                amountSlider.value = chip.dataset.amount;
                updateSliderFill(amountSlider);
                calculateAndRender();
            });
        });
    }

    modeStandardBtn.addEventListener('click', () => setCalculationMode('standard'));
    modeGoalBtn.addEventListener('click', () => setCalculationMode('goal'));
    attachAmountChipListeners();

    /**
     * Senior Citizen Toggle
     */
    seniorCitizenToggle.addEventListener('change', () => {
        applyBankOrRate();
    });

    /**
     * Bank Presets
     */
    bankChips.forEach(chip => {
        chip.addEventListener('click', () => {
            bankChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeBank = chip.dataset.bank;
            applyBankOrRate();
        });
    });

    function applyBankOrRate() {
        const isSr = seniorCitizenToggle.checked;
        const activeChip = document.querySelector(`.bank-chip[data-bank="${activeBank}"]`);

        if (activeChip) {
            const standardRate = parseFloat(activeChip.dataset.rate);
            const srRate = parseFloat(activeChip.dataset.srRate);
            const selectedRate = isSr ? srRate : standardRate;

            interestRateInput.value = selectedRate.toFixed(2);
            interestRateSlider.value = selectedRate;
            baseRateWithoutSr = standardRate;
        } else {
            // Custom rate
            let currentVal = parseFloat(interestRateInput.value) || 7.0;
            if (isSr) {
                currentVal += 0.50;
            } else {
                currentVal = Math.max(1, currentVal - 0.50);
            }
            interestRateInput.value = currentVal.toFixed(2);
            interestRateSlider.value = currentVal;
        }

        updateSliderFill(interestRateSlider);
        calculateAndRender();
    }

    // Unselect bank chip on manual slider/input change
    interestRateSlider.addEventListener('change', () => {
        bankChips.forEach(c => c.classList.remove('active'));
        activeBank = 'custom';
    });
    interestRateInput.addEventListener('change', () => {
        bankChips.forEach(c => c.classList.remove('active'));
        activeBank = 'custom';
    });

    /**
     * Tenure Switcher
     */
    function setTenureUnit(unit) {
        if (tenureUnit === unit) return;
        tenureUnit = unit;
        let currentVal = parseFloat(tenureInput.value) || 1;

        if (unit === 'years') {
            unitYearsBtn.classList.add('active');
            unitMonthsBtn.classList.remove('active');
            tenureUnitLabel.textContent = 'Yr';

            tenureInput.min = 1;
            tenureInput.max = 10;
            tenureSlider.min = 1;
            tenureSlider.max = 10;

            let years = Math.max(1, Math.min(10, Math.round(currentVal / 12) || 5));
            tenureInput.value = years;
            tenureSlider.value = years;

            tenureTicks.innerHTML = `
                <span>1 Yr</span>
                <span>3 Yr</span>
                <span>5 Yr</span>
                <span>10 Yr</span>
            `;

            tenureChipsContainer.innerHTML = `
                <button type="button" class="chip" data-tenure-val="1">1 Year</button>
                <button type="button" class="chip" data-tenure-val="3">3 Years</button>
                <button type="button" class="chip active" data-tenure-val="5">5 Years</button>
                <button type="button" class="chip" data-tenure-val="10">10 Years</button>
            `;
        } else {
            unitMonthsBtn.classList.add('active');
            unitYearsBtn.classList.remove('active');
            tenureUnitLabel.textContent = 'Mo';

            tenureInput.min = 3;
            tenureInput.max = 120;
            tenureSlider.min = 3;
            tenureSlider.max = 120;

            let months = Math.max(3, Math.min(120, Math.round(currentVal * 12) || 60));
            tenureInput.value = months;
            tenureSlider.value = months;

            tenureTicks.innerHTML = `
                <span>3 Mo</span>
                <span>36 Mo</span>
                <span>60 Mo</span>
                <span>120 Mo</span>
            `;

            tenureChipsContainer.innerHTML = `
                <button type="button" class="chip" data-tenure-val="6">6 Months</button>
                <button type="button" class="chip" data-tenure-val="12">12 Months</button>
                <button type="button" class="chip active" data-tenure-val="60">60 Months</button>
                <button type="button" class="chip" data-tenure-val="120">120 Months</button>
            `;
        }

        attachTenureChipListeners();
        updateSliderFill(tenureSlider);
        calculateAndRender();
    }

    function attachTenureChipListeners() {
        tenureChipsContainer.querySelectorAll('[data-tenure-val]').forEach(chip => {
            chip.addEventListener('click', () => {
                tenureChipsContainer.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                tenureInput.value = chip.dataset.tenureVal;
                tenureSlider.value = chip.dataset.tenureVal;
                updateSliderFill(tenureSlider);
                calculateAndRender();
            });
        });
    }

    unitYearsBtn.addEventListener('click', () => setTenureUnit('years'));
    unitMonthsBtn.addEventListener('click', () => setTenureUnit('months'));
    attachTenureChipListeners();
    compoundingSelect.addEventListener('change', calculateAndRender);

    /**
     * Core Math Engine
     */
    function computeRD(P, annualRate, totalMonths, frequency) {
        let totalInvested = P * totalMonths;
        let maturityAmount = 0;

        if (frequency === 'simple') {
            for (let i = 1; i <= totalMonths; i++) {
                let monthsRemaining = totalMonths - i + 1;
                maturityAmount += P * (1 + (annualRate / 100) * (monthsRemaining / 12));
            }
        } else {
            const n = parseFloat(frequency) || 4; // Quarterly = 4
            for (let i = 1; i <= totalMonths; i++) {
                let monthsRemaining = totalMonths - i + 1;
                let periods = (monthsRemaining / 12) * n;
                maturityAmount += P * Math.pow(1 + (annualRate / (100 * n)), periods);
            }
        }

        let totalInterest = maturityAmount - totalInvested;
        return {
            totalInvested: Math.round(totalInvested),
            totalInterest: Math.round(totalInterest),
            maturityAmount: Math.round(maturityAmount)
        };
    }

    /**
     * Reverse RD Calculation (Target Goal)
     */
    function computeReverseRD(targetMaturity, annualRate, totalMonths, frequency) {
        let compoundingFactorSum = 0;
        if (frequency === 'simple') {
            for (let i = 1; i <= totalMonths; i++) {
                let monthsRemaining = totalMonths - i + 1;
                compoundingFactorSum += (1 + (annualRate / 100) * (monthsRemaining / 12));
            }
        } else {
            const n = parseFloat(frequency) || 4;
            for (let i = 1; i <= totalMonths; i++) {
                let monthsRemaining = totalMonths - i + 1;
                let periods = (monthsRemaining / 12) * n;
                compoundingFactorSum += Math.pow(1 + (annualRate / (100 * n)), periods);
            }
        }

        // Required monthly installment P
        let P = Math.ceil(targetMaturity / compoundingFactorSum);
        let normalCalc = computeRD(P, annualRate, totalMonths, frequency);

        return {
            requiredMonthly: P,
            totalInvested: normalCalc.totalInvested,
            totalInterest: normalCalc.totalInterest,
            maturityAmount: normalCalc.maturityAmount
        };
    }

    /**
     * Schedule Computation
     */
    function computeMonthlySchedule(P, annualRate, totalMonths, frequency) {
        let schedule = [];
        let runningInvested = 0;

        for (let m = 1; m <= totalMonths; m++) {
            runningInvested += P;
            let resultAtM = computeRD(P, annualRate, m, frequency);
            schedule.push({
                period: m,
                depositThisPeriod: P,
                totalInvested: runningInvested,
                totalInterest: resultAtM.totalInterest,
                closingBalance: resultAtM.maturityAmount
            });
        }
        return schedule;
    }

    /**
     * Main Calculation & Render
     */
    function calculateAndRender() {
        const rawAmount = Math.max(100, parseFloat(amountInput.value) || 0);
        const rate = Math.max(0.1, parseFloat(interestRateInput.value) || 0);
        const tenureRaw = Math.max(1, parseFloat(tenureInput.value) || 1);
        const totalMonths = tenureUnit === 'years' ? Math.round(tenureRaw * 12) : Math.round(tenureRaw);
        const frequency = compoundingSelect.value;
        const isSr = seniorCitizenToggle.checked;

        let monthlyP = 0;
        let result = null;

        if (currentMode === 'standard') {
            monthlyP = rawAmount;
            result = computeRD(monthlyP, rate, totalMonths, frequency);
            animateNumberValue(highlightMainValue, result.maturityAmount, '');
        } else {
            // Target Goal Mode
            const targetGoal = rawAmount;
            const goalResult = computeReverseRD(targetGoal, rate, totalMonths, frequency);
            monthlyP = goalResult.requiredMonthly;
            result = goalResult;
            animateNumberValue(highlightMainValue, goalResult.requiredMonthly, ' / mo');
        }

        // Trigger micro-pulse on highlight number
        highlightMainValue.classList.remove('number-pulse');
        void highlightMainValue.offsetWidth;
        highlightMainValue.classList.add('number-pulse');

        latestCalculation = {
            monthlyP,
            rate,
            totalMonths,
            frequency,
            result
        };

        // Render Stats with smooth count-up animation
        animateNumberValue(totalInvestedEl, result.totalInvested);
        animateNumberValue(totalInterestEl, result.totalInterest);

        const investedPct = result.maturityAmount > 0 ? ((result.totalInvested / result.maturityAmount) * 100).toFixed(1) : 0;
        const interestPct = result.maturityAmount > 0 ? ((result.totalInterest / result.maturityAmount) * 100).toFixed(1) : 0;
        const returnPct = result.totalInvested > 0 ? ((result.totalInterest / result.totalInvested) * 100).toFixed(1) : 0;

        investedPctEl.textContent = `${investedPct}% of total`;
        interestPctEl.textContent = `${interestPct}% of total`;
        returnPercentageEl.textContent = `Net Gain: +${returnPct}%`;

        // Senior Citizen Gain Badge
        if (isSr && rate > 0.5) {
            const baseResult = computeRD(monthlyP, rate - 0.50, totalMonths, frequency);
            const extraSrGain = Math.max(0, result.totalInterest - baseResult.totalInterest);
            if (extraSrGain > 0) {
                srGainValue.textContent = inrFormatter.format(extraSrGain);
                seniorBenefitBadge.classList.remove('hidden');
            } else {
                seniorBenefitBadge.classList.add('hidden');
            }
        } else {
            seniorBenefitBadge.classList.add('hidden');
        }

        // Maturity Date
        const now = new Date();
        const maturityDate = new Date(now.getFullYear(), now.getMonth() + totalMonths, 1);
        const options = { month: 'short', year: 'numeric' };
        maturityDateEl.textContent = `Maturity: ${maturityDate.toLocaleDateString('en-IN', options)}`;

        // Center chart text with pop animation
        const newTenureText = tenureUnit === 'years' 
            ? `${tenureRaw} ${tenureRaw === 1 ? 'Year' : 'Years'}` 
            : `${totalMonths} Months`;
        
        if (chartTenureEl.textContent !== newTenureText) {
            chartTenureEl.textContent = newTenureText;
            const chartCenter = document.querySelector('.chart-center-content');
            if (chartCenter) {
                chartCenter.classList.remove('pop');
                void chartCenter.offsetWidth;
                chartCenter.classList.add('pop');
            }
        }

        // Donut Chart
        updateDonutChart(result.totalInvested, result.totalInterest, result.maturityAmount);

        // Schedule Table
        renderSchedule(monthlyP, rate, totalMonths, frequency);

        // Premature Range Limits & Calculations
        updatePrematureLimits(monthlyP, rate, totalMonths, frequency, result.maturityAmount);
    }

    /**
     * Render SVG Donut Chart
     */
    function updateDonutChart(invested, interest, total) {
        if (total <= 0) return;
        const investedLength = (invested / total) * CIRCUMFERENCE;
        const interestLength = (interest / total) * CIRCUMFERENCE;

        donutInvested.style.strokeDasharray = `${investedLength} ${CIRCUMFERENCE}`;
        donutInvested.style.strokeDashoffset = '0';

        donutInterest.style.strokeDasharray = `${interestLength} ${CIRCUMFERENCE}`;
        donutInterest.style.strokeDashoffset = `-${investedLength}`;
    }

    /**
     * Premature Break Calculator
     */
    function updatePrematureLimits(P, rate, totalMonths, frequency, fullMaturity) {
        if (totalMonths <= 3) {
            prematureToggle.disabled = true;
            return;
        }
        prematureToggle.disabled = false;

        prematureSlider.min = 3;
        prematureSlider.max = totalMonths - 1;

        let currentPremature = parseInt(prematureSlider.value) || 12;
        if (currentPremature >= totalMonths) {
            currentPremature = Math.max(3, Math.floor(totalMonths / 2));
            prematureSlider.value = currentPremature;
        }

        prematureMaxTick.textContent = `${totalMonths - 1} Mos`;
        prematureMidTick.textContent = `${Math.floor(totalMonths / 2)} Mos`;
        updateSliderFill(prematureSlider);

        calculatePremature(P, rate, totalMonths, frequency, fullMaturity);
    }

    function calculatePremature(P, rate, totalMonths, frequency, fullMaturity) {
        const breakMonths = parseInt(prematureSlider.value) || 12;
        prematureMonthsText.textContent = `${breakMonths} Months`;

        // Bank Rule: applicable rate for period minus 1.00% penalty
        const penaltyRate = Math.max(0.1, rate - 1.00);
        const preResult = computeRD(P, penaltyRate, breakMonths, frequency);

        const depositedTillThen = P * breakMonths;
        const inHandPayout = preResult.maturityAmount;
        const lossVsFull = Math.max(0, fullMaturity - inHandPayout);

        pDeposited.textContent = inrFormatter.format(depositedTillThen);
        pRateApplied.textContent = `${penaltyRate.toFixed(2)}% (1.00% penalty deducted)`;
        pInterest.textContent = `+${inrFormatter.format(preResult.totalInterest)}`;
        pPayout.textContent = inrFormatter.format(inHandPayout);
        pLossTag.textContent = `Loss vs Full Maturity: ${inrFormatter.format(lossVsFull)}`;
    }

    prematureSlider.addEventListener('input', () => {
        updateSliderFill(prematureSlider);
        if (latestCalculation) {
            calculatePremature(
                latestCalculation.monthlyP,
                latestCalculation.rate,
                latestCalculation.totalMonths,
                latestCalculation.frequency,
                latestCalculation.result.maturityAmount
            );
        }
    });

    prematureToggle.addEventListener('change', () => {
        if (prematureToggle.checked) {
            prematureBody.classList.remove('hidden');
            updateSliderFill(prematureSlider);
        } else {
            prematureBody.classList.add('hidden');
        }
    });

    /**
     * Render Schedule Table
     */
    function renderSchedule(P, rate, totalMonths, frequency) {
        const fullMonthly = computeMonthlySchedule(P, rate, totalMonths, frequency);
        scheduleTableBody.innerHTML = '';

        if (scheduleView === 'yearly') {
            thPeriod.textContent = 'Year';
            const totalYears = Math.ceil(totalMonths / 12);

            for (let y = 1; y <= totalYears; y++) {
                const endMonth = Math.min(y * 12, totalMonths);
                const startMonth = (y - 1) * 12 + 1;
                const monthsInThisYear = endMonth - startMonth + 1;
                const snapAtYearEnd = fullMonthly[endMonth - 1];

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>Year ${y}</strong> <span style="font-size: 0.75rem; color: var(--text-muted);">(${monthsInThisYear} mos)</span></td>
                    <td>${inrFormatter.format(P * monthsInThisYear)}</td>
                    <td>${inrFormatter.format(snapAtYearEnd.totalInvested)}</td>
                    <td style="color: var(--color-interest); font-weight: 600;">+${inrFormatter.format(snapAtYearEnd.totalInterest)}</td>
                    <td><strong>${inrFormatter.format(snapAtYearEnd.closingBalance)}</strong></td>
                `;
                scheduleTableBody.appendChild(tr);
            }
        } else {
            thPeriod.textContent = 'Month';
            fullMonthly.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>Month ${row.period}</strong></td>
                    <td>${inrFormatter.format(row.depositThisPeriod)}</td>
                    <td>${inrFormatter.format(row.totalInvested)}</td>
                    <td style="color: var(--color-interest); font-weight: 600;">+${inrFormatter.format(row.totalInterest)}</td>
                    <td><strong>${inrFormatter.format(row.closingBalance)}</strong></td>
                `;
                scheduleTableBody.appendChild(tr);
            });
        }
    }

    viewYearlyBtn.addEventListener('click', () => {
        viewYearlyBtn.classList.add('active');
        viewMonthlyBtn.classList.remove('active');
        scheduleView = 'yearly';
        calculateAndRender();
    });

    viewMonthlyBtn.addEventListener('click', () => {
        viewMonthlyBtn.classList.add('active');
        viewYearlyBtn.classList.remove('active');
        scheduleView = 'monthly';
        calculateAndRender();
    });

    /**
     * Download Schedule as CSV
     */
    downloadCsvBtn.addEventListener('click', () => {
        if (!latestCalculation) return;
        const P = latestCalculation.monthlyP;
        const rate = latestCalculation.rate;
        const totalMonths = latestCalculation.totalMonths;
        const frequency = latestCalculation.frequency;
        const monthlySchedule = computeMonthlySchedule(P, rate, totalMonths, frequency);

        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += 'Month,Monthly Deposit (INR),Total Principal Invested (INR),Cumulative Interest Earned (INR),Closing Maturity Balance (INR)\r\n';

        monthlySchedule.forEach(row => {
            csvContent += `${row.period},${row.depositThisPeriod},${row.totalInvested},${row.totalInterest},${row.closingBalance}\r\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `RD_Schedule_${totalMonths}Months.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('CSV schedule downloaded!');
    });

    /**
     * Copy Summary to Clipboard
     */
    copySummaryBtn.addEventListener('click', () => {
        if (!latestCalculation) return;
        const P = latestCalculation.monthlyP;
        const r = latestCalculation.rate;
        const tenure = chartTenureEl.textContent;
        const maturity = highlightMainValue.textContent;
        const invested = totalInvestedEl.textContent;
        const interest = totalInterestEl.textContent;
        const returnPct = returnPercentageEl.textContent;
        const isSr = seniorCitizenToggle.checked ? 'Yes (+0.50% added)' : 'No';

        const summaryText = `🏦 Recurring Deposit (RD) Summary:
------------------------------------
• Mode: ${currentMode === 'standard' ? 'Standard RD' : 'Target Goal RD'}
• Monthly Deposit: ₹${Number(P).toLocaleString('en-IN')}
• Annual Interest Rate: ${r.toFixed(2)}%
• Senior Citizen: ${isSr}
• Tenure: ${tenure}
• Compounding: ${compoundingSelect.options[compoundingSelect.selectedIndex].text}
------------------------------------
• Total Invested: ${invested}
• Total Interest Earned: ${interest}
• Maturity Amount: ${maturity} (${returnPct})
------------------------------------
Calculated with RD Calculator by rajshinde123`;

        navigator.clipboard.writeText(summaryText).then(() => {
            showToast('Summary copied to clipboard!');
        }).catch(() => {
            showToast('Failed to copy summary');
        });
    });

    /**
     * Print / Save PDF
     */
    printBtn.addEventListener('click', () => {
        window.print();
    });

    /**
     * Toast Helper
     */
    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

    /**
     * Reset to Defaults
     */
    resetBtn.addEventListener('click', () => {
        currentMode = 'standard';
        modeStandardBtn.classList.add('active');
        modeGoalBtn.classList.remove('active');
        amountLabel.textContent = 'Monthly Deposit';

        amountInput.value = 5000;
        amountSlider.value = 5000;
        seniorCitizenToggle.checked = false;
        activeBank = 'postoffice';

        bankChips.forEach(c => {
            if (c.dataset.bank === 'postoffice') c.classList.add('active');
            else c.classList.remove('active');
        });

        interestRateInput.value = 7.10;
        interestRateSlider.value = 7.10;
        compoundingSelect.value = '4';

        setTenureUnit('years');
        tenureInput.value = 5;
        tenureSlider.value = 5;

        prematureToggle.checked = false;
        prematureBody.classList.add('hidden');

        updateSliderFill(amountSlider);
        updateSliderFill(interestRateSlider);
        updateSliderFill(tenureSlider);
        calculateAndRender();
        showToast('Reset to default values');
    });

    // Initialize Application
    initTheme();
    updateSliderFill(amountSlider);
    updateSliderFill(interestRateSlider);
    updateSliderFill(tenureSlider);
    calculateAndRender();

})();
