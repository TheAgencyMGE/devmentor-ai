# DevMentor AI

DevMentor AI is an intelligent coding assistant and learning platform designed to help developers improve their programming skills through personalized mentorship, code reviews, and interactive learning experiences.

## 🚀 Features

- **AI-Powered Code Reviews**: Get instant feedback on your code with detailed analysis, best practices, and improvement suggestions
- **Interactive Learning Paths**: Personalized learning journeys tailored to your skill level and goals
- **Live Code Playground**: Write, test, and experiment with code in a built-in editor with real-time AI assistance
- **Skill Assessments**: Evaluate your programming knowledge and track your progress over time
- **Coding Challenges**: Solve progressively challenging problems to sharpen your skills
- **Concept Explanations**: Get clear, detailed explanations of programming concepts with examples
- **Debugging Assistance**: AI-powered help to identify and fix issues in your code

## 🛠️ Technologies Used

This project is built with modern web technologies:

- **Frontend**: React + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **AI Integration**: Google Gemini AI API
- **State Management**: React Hooks + Context
- **Code Editor**: Monaco Editor (VS Code editor)
- **Styling**: Tailwind CSS with custom components

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TheAgencyMGE/dev-aid-ai.git
cd dev-aid-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env` (if available) or create a new `.env` file
   - Add your Google Gemini AI API key:
   ```
   VITE_GOOGLE_AI_API_KEY=your_api_key_here
   ```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── AIAssistant.tsx # AI chat interface
│   ├── CodeEditor.tsx  # Code playground editor
│   ├── Dashboard.tsx   # Main dashboard
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
├── services/           # API services and AI integration
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- **Live Demo**: [DevMentor AI](https://devmentor-ai-ten.vercel.app)
- **Repository**: [GitHub](https://github.com/TheAgencyMGE/devmentor-ai)
