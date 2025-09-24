# NeuroIDE - Code With Intelligence

![NeuroIDE Logo](public/NeuroIDE.png)

NeuroIDE is a powerful, browser-based integrated development environment (IDE) that combines modern web technologies with AI-assisted coding capabilities. Built with Next.js and powered by WebContainer API, it allows developers to create, edit, and run full-stack applications directly in the browser without any local setup.

## ✨ Features

### 🚀 **Browser-Based Development**
- **No Local Setup Required**: Code and run applications entirely in the browser
- **WebContainer Integration**: Full Node.js runtime environment in the browser
- **Live Preview**: Real-time preview with hot reloading
- **Terminal Access**: Full terminal emulator with command execution

### 🤖 **AI-Powered Coding**
- **Smart Code Suggestions**: Context-aware AI code completions powered by Google Gemini
- **AI Chat Assistant**: Get help and explanations from AI
- **Intelligent Code Analysis**: AI understands your project structure and context
- **Fast & Reliable**: Powered by Google Gemini 1.5 Flash for lightning-fast responses

### 📁 **Rich Template Collection**
- **30+ Starter Templates**: React, Vue, Angular, Next.js, Express, Hono, and more
- **Multiple Categories**: Frontend, Backend, and Full-stack templates
- **Pre-configured Projects**: Ready-to-use project setups with dependencies

### 💻 **Professional IDE Experience**
- **Monaco Editor**: Full VS Code editing experience with syntax highlighting
- **Multi-file Support**: Tabbed interface with multiple open files
- **File Management**: Create, delete, rename files and folders
- **Auto-save**: Real-time saving with unsaved changes indicators

### 🔐 **User Management**
- **OAuth Authentication**: Sign in with GitHub or Google
- **Project Management**: Save, organize, and manage multiple playgrounds
- **Starring System**: Mark favorite projects
- **User Roles**: Support for different user permission levels

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, Radix UI Components
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Code Editor**: Monaco Editor (VS Code's editor)
- **Runtime**: WebContainer API for browser-based Node.js
- **AI Integration**: Google Gemini 1.5 Flash for fast, reliable AI assistance
- **State Management**: Zustand
- **Terminal**: XTerm.js

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- MongoDB database
- Google Gemini API key (required for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/neuroide.git
   cd neuroide
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in the required environment variables:
   ```env
   # Database
   DATABASE_URL="your_mongodb_connection_string"
   
   # Authentication
   AUTH_SECRET="your_auth_secret"
   GITHUB_ID="your_github_oauth_id"
   GITHUB_SECRET="your_github_oauth_secret"
   GOOGLE_ID="your_google_oauth_id"
   GOOGLE_SECRET="your_google_oauth_secret"
   
   # AI Configuration
   AI_PROVIDER="gemini"
   AI_API_KEY="your_gemini_api_key"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Get your Gemini API key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the API key and add it to your `.env.local` file

7. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

8. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Creating a New Project
1. Sign in with GitHub or Google
2. Click "Add New" on the dashboard
3. Select a template from the available options
4. Give your project a name and description
5. Start coding immediately in the browser

### Using the Code Editor
- **File Explorer**: Navigate and manage files in the sidebar
- **Multi-tab Editing**: Open multiple files simultaneously
- **AI Suggestions**: Enable AI assistance for smart code completions
- **Live Preview**: See your changes in real-time
- **Terminal**: Run commands and manage dependencies

### AI Features
- **Toggle AI**: Enable/disable AI suggestions in the editor
- **Chat Assistant**: Ask questions and get coding help
- **Context Awareness**: AI understands your current file and project
- **Fast Responses**: Powered by Google Gemini 1.5 Flash for instant suggestions
- **Smart Code Completion**: Context-aware code suggestions based on your project structure

## 🏗️ Project Structure

```
neuroide/
├── app/                    # Next.js app router
│   ├── (auth)/            # Authentication pages
│   ├── (root)/            # Public pages (home)
│   ├── dashboard/         # User dashboard
│   ├── playground/[id]/   # Code playground editor
│   └── api/               # API routes
├── features/              # Feature-based architecture
│   ├── ai/               # AI suggestions and chat
│   ├── auth/             # Authentication logic
│   ├── dashboard/        # Dashboard components
│   ├── playground/       # Code editor functionality
│   └── webContainers/    # WebContainer integration
├── components/ui/         # Reusable UI components
├── neuroIDEStarters/     # Template collection (30+ templates)
└── lib/                  # Utilities and database
```

## 🎨 Available Templates

### Frontend
- React, Vue.js, Angular, Svelte
- Next.js, Nuxt, SvelteKit
- Astro, Vite + React/TypeScript

### Backend
- Express.js, Hono, Koa
- Node.js, GraphQL
- JSON Server, JSON GraphQL Server

### Full-stack
- Next.js with Tailwind CSS
- Vue.js with Quasar
- SvelteKit

### Specialized
- GSAP animations (React, Vue, Svelte, Nuxt)
- Three.js (Tres) for 3D graphics
- Remotion for video creation
- Slidev for presentations

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [StackBlitz](https://stackblitz.com) for the WebContainer API
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the code editor
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Next.js](https://nextjs.org/) for the amazing React framework

## 📞 Support

- 📧 Email: support@neuroide.dev
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/neuroide/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/neuroide/discussions)

---

**NeuroIDE** - Empowering developers with intelligent, browser-based coding experiences. 🚀
