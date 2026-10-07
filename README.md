# 💰 Recurring Deposit (RD) Calculator

An interactive, responsive, and lightweight **Recurring Deposit (RD) Calculator** built with modern HTML5, CSS3, and Vanilla JavaScript. Accurately calculates maturity value, total investment, and compound interest using the standard **quarterly compounding formula** adopted by Indian banks (SBI, HDFC, ICICI, etc.) and India Post Office.

![GitHub repo size](https://img.shields.io/github/repo-size/rajshinde123/rd-calculator)
![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)

---

## ✨ Features

- **Standard Banking Calculation:** Computes RD maturity with standard **quarterly compounding**, with options to switch to monthly, half-yearly, annually, or simple interest.
- **Dual Controls:** Synchronized range sliders and number inputs for smooth adjustments.
- **Quick Preset Chips:** One-tap selection for popular monthly deposits (₹2K, ₹5K, ₹10K, ₹25K) and interest rates (6.5%, 7.0%, 7.1% Post Office, 7.5% Sr. Citizen).
- **Flexible Tenure:** Switch between **Years** (1–10 yrs) and **Months** (3–120 mos).
- **Dynamic Donut Chart:** Zero-dependency SVG donut chart visualizing the ratio of Invested Amount vs. Wealth Gained.
- **Growth Schedule:** Detailed year-by-year or month-by-month investment breakdown table.
- **Dark & Light Mode:** Seamless theme switcher with memory retention (`localStorage`).
- **Export & Share:**
  - One-click **Copy Summary** formatted for messaging apps.
  - **Print / Save as PDF** with optimized print stylesheets.
- **Mobile First & Responsive:** Works flawlessly across desktops, tablets, and smartphones.

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

## 🚀 Live Demo

Once GitHub Pages is enabled:
🔗 **[https://rajshinde123.github.io/rd-calculator/](https://rajshinde123.github.io/rd-calculator/)**

---

## 📁 Project Structure

```
rd-calculator/
├── index.html       # Semantic HTML5 layout and structure
├── style.css        # CSS variables, responsive design, dark/light theme & print styles
├── script.js        # Core math calculations, SVG chart renderer, event handlers
├── README.md        # Documentation
└── .gitignore       # Git ignore file
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

## 👤 Author

**Raj Shinde**  
- GitHub: [@rajshinde123](https://github.com/rajshinde123)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
