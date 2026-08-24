# 🧩 React Jigsaw Puzzle Game

An interactive, responsive jigsaw puzzle game built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**. Solve beautiful preset landscape puzzles or upload your own custom pictures with custom difficulty levels!

---

## ✨ Features

- 🖼️ **Curated Image Gallery**: Choose from high-resolution preset themes (Mountain, Ocean, Forest, City, Space, Animal).
- 📸 **Custom Image Upload**: Upload any photo from your computer to create your own personalized jigsaw puzzle.
- 🎯 **Multiple Difficulty Modes**:
  - **Easy**: 3×3 Grid (9 pieces) — Great for quick casual games.
  - **Medium**: 4×4 Grid (16 pieces) — Balanced challenge.
  - **Hard**: 6×6 Grid (36 pieces) — For puzzle masters.
- ⏱️ **Timer & Move Tracker**: Keep track of your solving time and number of moves.
- 🧲 **Snap-to-Grid Mechanics**: Smooth drag-and-drop piece movement with snap effects.
- 🎉 **Completion Modal**: Win screen with celebration animations and statistics.
- 📱 **Mobile & Desktop Responsive**: Tailored layout using Tailwind CSS.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed.

### Installation

1. Clone or download the repository:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

---

## ☁️ Deploy to Vercel

### Option 1: Deploy via GitHub (Recommended)

1. Push this repository to your **GitHub** account using **GitHub Desktop** or git CLI.
2. Go to [Vercel](https://vercel.com) and log in with your GitHub account.
3. Click **"Add New..."** > **"Project"**.
4. Import your puzzle game repository from the list.
5. Vercel will automatically detect **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**. Your site will be live within seconds with a free `.vercel.app` URL and automatic updates on every push!

### Option 2: Deploy via Vercel CLI

1. Install the Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Run the deploy command from the project root:
   ```bash
   vercel
   ```
3. Follow the CLI prompts to link and deploy your project.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
