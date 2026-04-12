# 💰 SME Finance Intelligence

> AI-powered financial intelligence platform built for Indian small and medium enterprises (SMEs).

[![Live Demo](https://img.shields.io/badge/Live%20Demo-sme--finance--intelligence.vercel.app-blue?style=for-the-badge)](https://sme-finance-intelligence.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Free](https://img.shields.io/badge/Free-During%20Beta-green?style=for-the-badge)]()

---

## 📖 Overview

**SME Finance Intelligence** is a free, AI-powered web application that helps Indian business owners understand their finances instantly — no accountant or finance background required.

Simply upload a bank statement PDF, paste your bank SMS messages, or drop a screenshot of your inbox. The AI parses every transaction, categorizes spending across 15+ categories, calculates a financial health score, forecasts your cash flow for the next 3 months, and tells you how much business loan you may qualify for — all in seconds.

**Zero data storage. Complete privacy. Free during beta.**

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI SMS Parsing** | Paste any bank SMS — AI extracts every transaction instantly |
| 📑 **Bank Statement Upload** | Upload PDF statements from SBI, HDFC, ICICI, Axis, Union Bank & more |
| 🖼️ **Screenshot Reader** | Drop a photo of your SMS inbox — AI reads and parses every transaction |
| 📊 **Smart Dashboard** | Visual charts showing income, expenses, and 15+ spending categories |
| 🔮 **3-Month Forecast** | AI predicts future cash flow with actionable business tips |
| 🏦 **Loan Eligibility** | Know instantly how much business loan you qualify for |
| ⚠️ **Anomaly Detection** | AI flags unusual or suspicious transactions automatically |
| 💯 **Health Score** | Financial health score out of 100 — like CIBIL but for your business |
| 📱 **WhatsApp Reports** | Receive your complete financial summary on WhatsApp instantly |

---

## 🏦 Supported Banks

Works with all major Indian banks and payment systems:

- **SBI** — State Bank of India
- **HDFC Bank**
- **ICICI Bank**
- **Axis Bank**
- **Union Bank**
- **Kotak Bank**
- **PNB** — Punjab National Bank
- **BOI** — Bank of India
- All **UPI** platforms — Paytm, PhonePe, Google Pay

> Also supports SMS messages in **Hindi, Telugu, and Tamil**.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm / yarn / pnpm / bun

### Installation

```bash
# Clone the repository
git clone https://github.com/Saicharan-Billakanti/sme-finance-intelligence.git
cd sme-finance-intelligence

# Install dependencies
npm install
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## 🗂️ Project Structure

```
sme-finance-intelligence/
├── app/               # Next.js App Router — pages and layouts
├── components/        # Reusable React UI components
├── lib/               # Utility functions and AI/parsing logic
├── public/            # Static assets
├── CLAUDE.md          # Claude Code instructions
├── AGENTS.md          # AI agent configuration
├── next.config.ts     # Next.js configuration
├── tsconfig.json      # TypeScript configuration
└── package.json       # Dependencies and scripts
```

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org) (App Router)
- **Language:** JavaScript / TypeScript
- **Styling:** CSS / Tailwind CSS
- **AI:** Claude API (Anthropic) for SMS/statement parsing and financial insights
- **Deployment:** [Vercel](https://vercel.com)

---

## 📊 How It Works

```
1. Upload your data
   └── Paste SMS  |  Upload PDF  |  Drop a screenshot

2. AI analyzes instantly
   └── Reads & categorizes every transaction automatically

3. Get insights
   └── Health score · Cash flow forecast · Loan eligibility · WhatsApp report
```

---

## 📈 Key Stats

| Metric | Value |
|---|---|
| Time saved monthly | 10+ hours |
| Transaction accuracy | 95%+ |
| Banks supported | All major Indian banks |
| Setup time | ~2 minutes |
| Cost | Free (beta) |

---

## 🌐 Deployment

The easiest way to deploy is via [Vercel](https://vercel.com/new):

```bash
npm run build
```

Or connect your GitHub repo to Vercel for automatic deployments on every push to `main`.

See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source. See the repository for license details.

---

## 👤 Author

**Saicharan Billakanti**
- GitHub: [@Saicharan-Billakanti](https://github.com/Saicharan-Billakanti)

---

*Built for Indian SMEs · Powered by AI · Free during beta*
