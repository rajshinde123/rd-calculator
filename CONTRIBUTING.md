# Contributing to RD Calculator

Thank you for considering contributing to the **Recurring Deposit (RD) Calculator** project! Open source projects thrive when people like you get involved.

---

## 🌟 How Can You Contribute?

You can contribute in several ways:
1. **Reporting Bugs:** If you discover a calculation discrepancy or UI glitch, open an issue.
2. **Suggesting Enhancements:** Have an idea for a new feature (e.g., inflation adjustment, loan against RD, SIP comparison)? Let us know!
3. **Improving Documentation:** Clarify math formulas, fix typos, or improve explanations.
4. **Submitting Pull Requests:** Implement bug fixes or new features.

---

## 🛠️ Getting Started & Workflow

### 1. Fork & Clone
Fork the repository on GitHub and clone your fork locally:
```bash
git clone https://github.com/<your-username>/rd-calculator.git
cd rd-calculator
```

### 2. Create a Topic Branch
Always create a descriptive branch for your work:
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 3. Make Your Changes
- Keep changes clean, minimal, and focused.
- Ensure the code adheres to pure vanilla HTML/CSS/JavaScript with zero heavy dependencies.
- Verify that standard quarterly compounding formulas remain accurate.

### 4. Test Locally
Open `index.html` in your browser and test:
- Responsive layout across desktop and mobile screens.
- Light and Dark theme toggles.
- Calculation accuracy across various tenure and rate inputs.
- Copy and print functions.

### 5. Commit and Push
Write meaningful commit messages:
```bash
git add .
git commit -m "feat: add tax deduction (TDS) estimation toggle"
git push origin feature/your-feature-name
```

### 6. Open a Pull Request
Go to the original repository on GitHub and open a Pull Request. Fill out the provided PR template.

---

## 📋 Code Style Guidelines

- **HTML5:** Semantic elements (`<main>`, `<section>`, `<header>`, `<footer>`, `<label>`).
- **CSS3:** Use CSS custom properties (variables) defined in `:root` and `[data-theme="dark"]`. Avoid inline styles.
- **JavaScript:** ES6+ vanilla JavaScript. Maintain pure functional math logic and descriptive variable names.

---

## 📜 Code of Conduct

Please adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) in all project interactions.
