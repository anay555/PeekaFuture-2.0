
# 🚀 Peekafuture - AI-Powered Career Guidance Dashboard

![Peekafuture Banner](https://via.placeholder.com/1200x400.png?text=Peekafuture+Dashboard)

> **Decode Your Future with AI Precision.**

Peekafuture is a comprehensive, modern web application designed to guide 10th-grade students (and beyond) through the complex landscape of career choices. Leveraging **Google's Gemini AI**, it provides hyper-personalized academic stream recommendations, college insights, future trend analysis, and entrepreneurship planning—all within a futuristic, gamified dashboard.

---

## ✨ Key Features

### 🧠 Core Guidance
- **AI Persona Survey:** A dynamic questionnaire that analyzes user interests, learning styles, and risk tolerance.
- **Stream Recommendation:** Instantly suggests Science, Commerce, or Arts based on survey results using `gemini-2.5-pro`.
- **"Day in the Life" Simulation:** Generates an immersive narrative describing a typical day in the recommended career path.
- **Follow-up Chat:** Context-aware Q&A to answer specific "What if?" scenarios (e.g., "Can I do Art with Science?").

### 🎓 Academic & College
- **Academic Navigator:** Generates a custom 2-year roadmap (Grade 11 & 12) with subject checklists and skill development goals.
- **Skill Deep Dives:** AI-generated learning guides with curated free resources (YouTube, Coursera, etc.) for specific skills.
- **College Insights:**
  - **Conversational Search:** "Find top engineering colleges in Mumbai with fees under 5 Lakhs."
  - **Comparison Tool:** Select up to 3 colleges to compare fees, rankings, and placements side-by-side with an AI summary.
  - **Smart Filters:** Filter by stream, city, ownership, and ROI metrics.

### 💼 Career & Business
- **Entrepreneurship Hub:**
  - **Startup Idea Generator:** Combines user interest + academic background to generate viable business concepts.
  - **One-Page Business Plan:** instantly drafts a plan including SWOT analysis, target audience, and financial outlook.
  - **Income Comparison Chart:** Visual breakdown of potential earnings across sectors.
- **Future Trends:** Deep-dive reports on the 5-10 year outlook of a career, grounded with Google Search data.
- **Live Market Insights:** Real-time analysis of salary ranges, market demand, and hiring hotspots.

### 🎨 Creative & Competitive
- **Artists' Corner:** Specialized roadmaps for creative fields and an **AI Grant Finder** for scholarships/residencies.
- **Competition Finder:** Locates relevant Hackathons, Olympiads, and Contests based on the user's profile.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Dark Mode support included)
- **Visualization:** [Chart.js](https://www.chartjs.org/) for data rendering

### Backend & Services
- **Authentication:** [Firebase Auth](https://firebase.google.com/docs/auth) (Google, Email/Password, Anonymous)
- **Database:** [Firebase Firestore](https://firebase.google.com/docs/firestore) (User data persistence, College/Stream data)
- **AI Engine:** [Google Gemini API](https://ai.google.dev/) via `@google/genai` SDK
  - Models: `gemini-2.5-pro`, `gemini-2.5-flash`
  - Tools: Google Search Grounding

---

## ⚙️ Architecture

The application uses a **Client-Serverless** architecture:

1.  **Client:** The React app handles all UI and state management.
2.  **AI Layer:** The client communicates *directly* with the Gemini API. This ensures low latency and utilizes the `gemini-2.5` models for reasoning and search grounding.
3.  **Persistence Layer:** User progress (survey results, roadmaps, saved plans) is stored in Firebase Firestore. Static data (Colleges, Stream info) is also served from Firestore.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A Google Cloud Project with **Gemini API** enabled.
- A **Firebase** project.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/peekafuture.git
cd peekafuture
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_google_gemini_api_key
```

### 4. Firebase Setup
1.  Go to [Firebase Console](https://console.firebase.google.com/).
2.  Create a project and add a Web App.
3.  Copy the config and update `src/services/firebase.ts`.
4.  **Enable Authentication:** Email/Password, Google, and Anonymous.
5.  **Enable Firestore:** Create a database in **Test Mode**.

### 5. Seeding the Database (Important)
The app relies on Firestore data for Colleges and Stream info. A script is provided to populate this.

1.  In Firebase Console, go to **Project Settings > Service Accounts**.
2.  Click **Generate New Private Key**.
3.  Rename the downloaded file to `serviceAccountKey.json`.
4.  Move this file into the `scripts/` folder of the project.
5.  Run the seeder:

```bash
cd scripts
npm install
node seed.js
cd ..
```

### 6. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` to view the app.

---

## 📂 Project Structure

```
src/
├── components/       # UI Components (Cards, Modals, Tabs)
├── context/          # React Context (Theme)
├── data/             # Static fallback data (Survey questions, placeholders)
├── services/         # API integrations (Firebase, Gemini)
├── types.ts          # TypeScript interfaces
├── App.tsx           # Main routing & auth logic
└── index.tsx         # Entry point
scripts/              # Database seeding scripts
```

---

## 🤝 Contributing

Contributions are welcome!
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by Anany Sharma
</p>
