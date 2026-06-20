<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=FFD23F&height=250&section=header&text=CARBONTRACE&fontSize=80&fontColor=0F0F0F&animation=twinkling&fontAlignY=35&desc=The%20Ultimate%20Neo-Brutalist%20Eco%20Tracker&descAlignY=55&descAlign=50" alt="CarbonTrace Animated Banner" />
</div>

<div align="center">
  
  [![React](https://img.shields.io/badge/React-19.0-0F0F0F?style=for-the-badge&logo=react&logoColor=38E4FF)](https://react.dev)
  [![Vite](https://img.shields.io/badge/Vite-6.0-0F0F0F?style=for-the-badge&logo=vite&logoColor=B288FF)](https://vitejs.dev)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-0F0F0F?style=for-the-badge&logo=tailwindcss&logoColor=38E4FF)](https://tailwindcss.com)
  [![Deployed on Vercel](https://img.shields.io/badge/Ready_for-Vercel-0F0F0F?style=for-the-badge&logo=vercel&logoColor=FFFFFF)](https://vercel.com)
  
  <h3>🌍 Understand, Track, and Reduce your Carbon Footprint 🌍</h3>
</div>

<br />

## 📖 Overview

**CarbonTrace** is a highly interactive, beautifully designed carbon footprint tracker built for **Challenge 3**. Unlike boring spreadsheets or generic trackers, CarbonTrace utilizes a striking **Neo-Brutalist UI**, aggressive gamification, and AI-driven insights to make saving the planet genuinely engaging.

---

## ✨ Core Features

| Feature | Description | Status |
| :--- | :--- | :---: |
| 📊 **Dynamic Dashboard** | Real-time calculation of your emissions vs. offsets with animated progression. | 🟢 |
| 📝 **Smart Tracker** | Log daily activities (Transport, Diet, Energy) to track your exact footprint. | 🟢 |
| 🤖 **EcoCoach AI** | Simulated AI that analyzes your logging trends and provides actionable advice. | 🟢 |
| 💥 **Boss Fights** | Use your accumulated XP to battle Eco-Villains like *Smogzilla* and *King Coal*. | 🟢 |
| 💳 **Hero License** | A 3D-tilt, interactive trading card that proves your rank and displays badges. | 🟢 |
| 🧠 **Eco Trivia** | Earn bonus XP by answering climate-related trivia questions. | 🟢 |

---

## 🗺️ Application Architecture & User Flow

```mermaid
graph TD
    %% Styling
    classDef bg fill:#0F0F0F,stroke:#FFD23F,stroke-width:4px,color:#FFF,font-weight:bold,border-radius:8px;
    classDef node fill:#FFFFFF,stroke:#0F0F0F,stroke-width:3px,color:#0F0F0F,font-weight:bold;
    classDef action fill:#B8F239,stroke:#0F0F0F,stroke-width:3px,color:#0F0F0F,font-weight:bold;

    A[🌍 Onboarding / Login]:::bg --> B(📊 Dashboard):::node
    B --> C{User Actions}:::node
    
    C -->|Logs Activity| D[📝 Tracker]:::action
    C -->|Completes Mission| E[🏆 Challenges]:::action
    C -->|Buys Offsets| F[🌳 Offset Forest]:::action
    C -->|Answers Quiz| G[🧠 Eco Trivia]:::action
    
    D --> H((XP Gained!)):::bg
    E --> H
    F --> H
    G --> H
    
    H --> I[💳 Hero License Upgrades]:::node
    H --> J[💥 Boss Fights Unlocked]:::node
    
    H -.->|Triggers| K[🤖 EcoCoach AI Analysis]:::action
    K -.-> B
```

---

## 🎨 Design Philosophy (Neo-Brutalism)

CarbonTrace rejects the overused, soft "glassmorphism" aesthetic in favor of **Neo-Brutalism**. 

<details>
<summary><b>Click to expand our Style Guide!</b></summary>

- **Bold Colors:** Harsh yellows (`#FFD23F`), vibrant pinks (`#FF6B9E`), and toxic limes (`#B8F239`).
- **Heavy Borders:** Thick `4px` solid black borders on all interactive elements.
- **Offset Shadows:** Hard `4px 4px 0 #0F0F0F` box-shadows instead of blurred drop shadows.
- **Typography:** *Space Grotesk* for aggressive, highly-legible headers and *Outfit* for crisp body text.
</details>

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Prem759-0/Challenge-3-Carbon-Footprint.git
   cd Challenge-3-Carbon-Footprint
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the magic.

---

## ⚡ Deployment

This project is configured and ready to be instantly deployed to **Vercel**.
```bash
npx vercel login
npx vercel
```
A `vercel.json` file is already included to handle routing and build outputs correctly.

---

<div align="center">
  <p>Built with ❤️ for a Greener Future.</p>
  <img src="https://capsule-render.vercel.app/api?type=waving&color=38E4FF&height=100&section=footer" width="100%" />
</div>
