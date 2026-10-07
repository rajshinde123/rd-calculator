/**
 * Recurring Deposit (RD) Calculator
 * Author: rajshinde123
 * Standard Quarterly Compounding (Indian Banking / Post Office standard)
 */

(function () {
    'use strict';

    // DOM Elements - Inputs
    const monthlyDepositInput = document.getElementById('monthlyDepositInput');
    const monthlyDepositSlider = document.getElementById('monthlyDepositSlider');
    const interestRateInput = document.getElementById('interestRateInput');
    const interestRateSlider = document.getElementById('interestRateSlider');
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
    const maturityAmountEl = document.getElementById('maturityAmount');
    const maturityDateEl = document.getElementById('maturityDate');
    const returnPercentageEl = document.getElementById('returnPercentage');
    const totalInvestedEl = document.getElementById('totalInvested');
    const investedPctEl = document.getElementById('investedPct');
    const totalInterestEl = document.getElementById('totalInterest');
    const interestPctEl = document.getElementById('interestPct');
    const chartTenureEl = document.getElementById('chartTenure');

    // DOM Elements - Donut Chart
    const donutInvested = document.getElementById('donutInvested');
    const donutInterest = document.getElementById('donutInterest');
    const CIRCUMFERENCE = 2 * Math.PI * 75; // r = 75

    // DOM Elements - Schedule Table
    const viewYearlyBtn = document.getElementById('viewYearly');
    const viewMonthlyBtn = document.getElementById('viewMonthly');
    const thPeriod = document.getElementById('thPeriod');
    const scheduleTableBody = document.getElementById('scheduleTableBody');

    // DOM Elements - Actions & Theme
    const themeToggle = document.getElementById('themeToggle');
    const themeIconSun = document.getElementById('themeIconSun');
    const themeIconMoon = document.getElementById('themeIconMoon');
    const printBtn = document.getElementById('printBtn');
    const copySummaryBtn = document.getElementById('copySummaryBtn');
    const toast = document.getElementById('toast');

    // State
    let tenureUnit = 'years'; // 'years' or 'months'
    let scheduleView = 'yearly'; // 'yearly' or 'monthly'

    // Currency Formatter (Indian Rupee)
    const inrFormatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    });

    const inrFormatterDecimal = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    });

    /**
     * Initialize Theme
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
     * Slider Track Fill Gradient Sync
     */
    function updateSliderFill(slider) {
        const min = parseFloat(slider.min) || 0;
        const max = parseFloat(slider.max) || 100;
        const val = parseFloat(slider.value) || 0;
        const percentage = ((val - min) / (max - min)) * 100;
        slider.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${percentage}%, var(--bg-card-subtle) ${percentage}%, var(--bg-card-subtle) 100%)`;
    }

    /**
     * Sync Inputs & Sliders
     */
    function syncInputs(inputEl, sliderEl) {
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

    syncInputs(monthlyDepositInput, monthlyDepositSlider);
    syncInputs(interestRateInput, interestRateSlider);
    syncInputs(tenureInput, tenureSlider);

    /**
     * Quick Preset Chips
     */
    document.querySelectorAll('[data-deposit]').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('[data-deposit]').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            monthlyDepositInput.value = chip.dataset.deposit;
            monthlyDepositSlider.value = chip.dataset.deposit;
            updateSliderFill(monthlyDepositSlider);
            calculateAndRender();
        });
    });

    document.querySelectorAll('[data-rate]').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('[data-rate]').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            interestRateInput.value = chip.dataset.rate;
            interestRateSlider.value = chip.dataset.rate;
            updateSliderFill(interestRateSlider);
            calculateAndRender();
        });
    });

    /**
     * Switch Tenure Unit (Years vs Months)
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

            // Convert months to years (default to nearest)
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

            // Convert years to months
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
     * RD Calculation Engine
     * Standard Banking formula with configurable compounding frequency
     */
    function computeRD(P, annualRate, totalMonths, frequency) {
        let totalInvested = P * totalMonths;
        let maturityAmount = 0;

        if (frequency === 'simple') {
            // Simple Interest formula for each installment: P * (1 + r * (n - i + 1) / 12)
            for (let i = 1; i <= totalMonths; i++) {
                let monthsRemaining = totalMonths - i + 1;
                maturityAmount += P * (1 + (annualRate / 100) * (monthsRemaining / 12));
            }
        } else {
            // Compound Interest formula: P * (1 + r / (100 * n))^(n * t)
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
     * Compute progressive balance month by month
     */
    function computeMonthlySchedule(P, annualRate, totalMonths, frequency) {
        let schedule = [];
        let runningInvested = 0;

        for (let m = 1; m <= totalMonths; m++) {
            runningInvested += P;
            // What is the maturity value if we stop and calculate for month m:
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
     * Main Calculation & Render Function
     */
    function calculateAndRender() {
        const P = Math.max(100, parseFloat(monthlyDepositInput.value) || 0);
        const rate = Math.max(0.1, parseFloat(interestRateInput.value) || 0);
        const tenureRaw = Math.max(1, parseFloat(tenureInput.value) || 1);
        const totalMonths = tenureUnit === 'years' ? Math.round(tenureRaw * 12) : Math.round(tenureRaw);
        const frequency = compoundingSelect.value;

        // Perform calculation
        const result = computeRD(P, rate, totalMonths, frequency);

        // Render Summary Numbers
        maturityAmountEl.textContent = inrFormatter.format(result.maturityAmount);
        totalInvestedEl.textContent = inrFormatter.format(result.totalInvested);
        totalInterestEl.textContent = inrFormatter.format(result.totalInterest);

        // Percentages
        const investedPct = result.maturityAmount > 0 ? ((result.totalInvested / result.maturityAmount) * 100).toFixed(1) : 0;
        const interestPct = result.maturityAmount > 0 ? ((result.totalInterest / result.maturityAmount) * 100).toFixed(1) : 0;
        const returnPct = result.totalInvested > 0 ? ((result.totalInterest / result.totalInvested) * 100).toFixed(1) : 0;

        investedPctEl.textContent = `${investedPct}% of maturity`;
        interestPctEl.textContent = `${interestPct}% of maturity`;
        returnPercentageEl.textContent = `Net Gain: +${returnPct}%`;

        // Calculate Maturity Date
        const now = new Date();
        const maturityDate = new Date(now.getFullYear(), now.getMonth() + totalMonths, 1);
        const options = { month: 'short', year: 'numeric' };
        maturityDateEl.textContent = `Maturity on: ${maturityDate.toLocaleDateString('en-IN', options)}`;

        // Center chart tenure text
        chartTenureEl.textContent = tenureUnit === 'years' 
            ? `${tenureRaw} ${tenureRaw === 1 ? 'Year' : 'Years'}` 
            : `${totalMonths} Months`;

        // Update Donut Chart
        updateDonutChart(result.totalInvested, result.totalInterest, result.maturityAmount);

        // Update Schedule Table
        renderSchedule(P, rate, totalMonths, frequency);
    }

    /**
     * Render SVG Donut Chart
     */
    function updateDonutChart(invested, interest, total) {
        if (total <= 0) return;

        const investedFraction = invested / total;
        const interestFraction = interest / total;

        const investedLength = investedFraction * CIRCUMFERENCE;
        const interestLength = interestFraction * CIRCUMFERENCE;

        // Invested Segment (starts at top, offset 0)
        donutInvested.style.strokeDasharray = `${investedLength} ${CIRCUMFERENCE}`;
        donutInvested.style.strokeDashoffset = '0';

        // Interest Segment (starts right after invested segment)
        donutInterest.style.strokeDasharray = `${interestLength} ${CIRCUMFERENCE}`;
        donutInterest.style.strokeDashoffset = `-${investedLength}`;
    }

    /**
     * Render Schedule Table (Yearly / Monthly)
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

    // Schedule View Tabs
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
     * Copy Summary to Clipboard
     */
    copySummaryBtn.addEventListener('click', () => {
        const P = monthlyDepositInput.value;
        const r = interestRateInput.value;
        const tenure = chartTenureEl.textContent;
        const maturity = maturityAmountEl.textContent;
        const invested = totalInvestedEl.textContent;
        const interest = totalInterestEl.textContent;
        const returnPct = returnPercentageEl.textContent;

        const summaryText = `🏦 Recurring Deposit (RD) Summary:
------------------------------------
• Monthly Deposit: ₹${Number(P).toLocaleString('en-IN')}
• Annual Interest Rate: ${r}%
• Tenure: ${tenure}
• Compounding: ${compoundingSelect.options[compoundingSelect.selectedIndex].text}
------------------------------------
• Total Invested: ${invested}
• Total Interest Earned: ${interest}
• Maturity Amount: ${maturity} (${returnPct})
------------------------------------
Calculated using RD Calculator (rajshinde123)`;

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
        monthlyDepositInput.value = 5000;
        monthlyDepositSlider.value = 5000;
        interestRateInput.value = 7.1;
        interestRateSlider.value = 7.1;
        compoundingSelect.value = '4';
        setTenureUnit('years');
        tenureInput.value = 5;
        tenureSlider.value = 5;

        // Reset chips
        document.querySelectorAll('.preset-chips .chip').forEach(c => c.classList.remove('active'));
        const defaultDepositChip = document.querySelector('[data-deposit="5000"]');
        if (defaultDepositChip) defaultDepositChip.classList.add('active');
        const defaultRateChip = document.querySelector('[data-rate="7.1"]');
        if (defaultRateChip) defaultRateChip.classList.add('active');

        updateSliderFill(monthlyDepositSlider);
        updateSliderFill(interestRateSlider);
        updateSliderFill(tenureSlider);
        calculateAndRender();
        showToast('Reset to default values');
    });

    // Initialize
    initTheme();
    updateSliderFill(monthlyDepositSlider);
    updateSliderFill(interestRateSlider);
    updateSliderFill(tenureSlider);
    calculateAndRender();

})();
