# 💰 Recurring Deposit (RD) Calculator

An interactive, responsive, and lightweight **Recurring Deposit (RD) Calculator** built with modern HTML5, CSS3, and Vanilla JavaScript. Accurately calculates maturity value, total investment, and compound interest using the standard **quarterly compounding formula** adopted by Indian banks (SBI, HDFC, ICICI, etc.) and India Post Office.

[![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://opensource.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-success.svg)](https://rajshinde123.github.io/rd-calculator/)

---

## 🚀 Live Demo

Try the application live in your browser:  
🔗 **[https://rajshinde123.github.io/rd-calculator/](https://rajshinde123.github.io/rd-calculator/)**

---

## ✨ Features

- **Standard & Target Goal Modes:**
  - **Standard RD:** Enter monthly deposit ➔ calculates expected maturity amount.
  - **Target Goal RD (Reverse RD):** Enter target goal (e.g. ₹1,00,000) ➔ calculates exact required monthly deposit.
- **Senior Citizen Booster (+0.50%):** Toggle for individuals aged 60+ to automatically apply preferential interest rates and display extra wealth gained.
- **Real Indian Bank Presets:** 1-Click rates for **Post Office (7.10%)**, **SBI (6.80%)**, **HDFC (7.00%)**, **ICICI (7.00%)**, and **PNB (6.85%)**.
- **Premature Break / Pre-Closure Penalty Calculator:** Real-world banking calculation estimating in-hand payout, 1% interest penalty deduction, and financial loss if RD is closed before maturity.
- **Standard Quarterly Compounding:** Adheres strictly to RBI & Post Office norms (with options for monthly, half-yearly, annually, and simple interest).
- **Dual Controls:** Synchronized range sliders and number inputs for smooth adjustments.
- **Dynamic Donut Chart:** Zero-dependency SVG donut chart visualizing the ratio of Invested Amount vs. Wealth Gained.
- **Growth Schedule & CSV Export:** Year-by-year or month-by-month table with 1-click **Download CSV** support.
- **Dark & Light Mode:** Seamless theme switcher with memory retention (`localStorage`).
- **Export & Share:** Print / Save as PDF and one-click Copy Summary.
- **Mobile First & Responsive:** Works flawlessly across all devices.

---

## 🧮 Mathematical Formula

Under Reserve Bank of India (RBI) guidelines, Recurring Deposit interest is compounded quarterly. For each monthly deposit $P$ made across $N$ total months:

$$M = \sum_{i=1}^{N} P \times \left(1 + \frac{R}{400}\right)^{\frac{4 \times (N - i + 1)}{12}}$$

Where:
- **$P$** = Monthly installment amount
- **$R$** = Annual interest rate in percent (%)
- **$N$** = Total number of installments (months)
- **$i$** = Installment index ($1 \dots N$)
- **$(N - i + 1)$** = Tenure in months for which installment $i$ remains invested

---

## 📁 Project Structure

```
rd-calculator/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
├── index.html            # Semantic HTML5 layout and structure
├── style.css             # CSS variables, responsive design, dark/light theme & print styles
├── script.js             # Core math calculations, SVG chart renderer, event handlers
├── CONTRIBUTING.md       # Contribution guidelines for open-source community
├── CODE_OF_CONDUCT.md    # Contributor Covenant Code of Conduct
├── SECURITY.md           # Security disclosure policy
├── LICENSE               # MIT License
├── README.md             # Project documentation
└── .gitignore            # Git ignore configuration
```

---

## 🛠️ Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/rajshinde123/rd-calculator.git
   cd rd-calculator
   ```

2. Open `index.html` in your web browser:
   - Double click `index.html`, or
   - Serve via local server (e.g. XAMPP `http://localhost/rd-calculator/` or VS Code Live Server).

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before submitting a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👤 Author & Maintainer

**Raj Shinde**  
- GitHub: [@rajshinde123](https://github.com/rajshinde123)

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.
