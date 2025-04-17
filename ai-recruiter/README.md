# AI-Recruiter

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?style=for-the-badge&logo=openai)](https://openai.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)

![AI-Recruiter Banner](/public/hero-image2.png)

## 🚀 Overview

AI-Recruiter is a cutting-edge platform revolutionizing the hiring process through AI-powered interviews. It bridges the gap between employers and talent with smart, bias-free AI interviews, saving time, reducing costs, and facilitating perfect matches for teams.

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#the-problem">The Problem</a> •
  <a href="#our-solution">Solution</a> •
  <a href="#technologies">Technologies</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#license">License</a>
</p>

## 🔍 The Problem

Traditional recruitment processes face several challenges:
- Time-consuming manual screening and interviewing
- Unconscious bias affecting hiring decisions
- Inconsistent interview experiences for candidates
- Difficulty in objectively evaluating technical and soft skills
- High costs associated with the hiring process

## 💡 Our Solution

AI-Recruiter addresses these challenges through:
- Automated AI interviews that save time and resources
- Standardized interview processes that ensure consistency
- Bias-free evaluations based on objective skill assessments
- Comprehensive feedback and scoring for both candidates and employers
- Speech recognition and natural language processing for realistic interview experiences

## 🛠️ Key Features

- **AI-Powered Interviews**: Conduct automated interviews with natural language processing
- **Real-time Feedback**: Provide instant analysis of candidate responses
- **Skill Assessment**: Objectively evaluate technical and soft skills
- **Voice Recognition**: Interact with candidates via speech recognition
- **Dashboard Analytics**: Track and analyze recruitment metrics
- **Customizable Job Listings**: Create detailed job postings with requirements
- **Candidate Management**: Organize and review applicants efficiently

## 🔧 Technologies

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js" alt="Next.js"></a>
  <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react" alt="React"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript" alt="TypeScript"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind"></a>
  <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-6.0-2D3748?style=flat-square&logo=prisma" alt="Prisma"></a>
  <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-14.0-336791?style=flat-square&logo=postgresql" alt="PostgreSQL"></a>
  <a href="https://next-auth.js.org/"><img src="https://img.shields.io/badge/NextAuth-4.0-000000?style=flat-square" alt="NextAuth"></a>
  <a href="https://openai.com/"><img src="https://img.shields.io/badge/OpenAI-API-412991?style=flat-square&logo=openai" alt="OpenAI"></a>
  <a href="https://azure.microsoft.com/"><img src="https://img.shields.io/badge/Azure-OpenAI-0078D4?style=flat-square&logo=microsoftazure" alt="Azure"></a>
  <a href="https://www.framer.com/motion/"><img src="https://img.shields.io/badge/Framer-Motion-0055FF?style=flat-square&logo=framer" alt="Framer Motion"></a>
</p>

### Frontend
- **Next.js 15**: React framework for server-rendered applications
- **React 19**: UI component library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS 4**: Utility-first CSS framework
- **Framer Motion**: Animation library for React
- **Radix UI**: Unstyled, accessible UI components
- **React Hook Form**: Form validation library

### Backend
- **Next.js API Routes**: Server-side API functionality
- **Prisma 6**: Type-safe ORM for database access
- **PostgreSQL**: Relational database for data storage
- **NextAuth.js**: Authentication solution for Next.js

### AI & Machine Learning
- **Azure OpenAI**: AI models for natural language processing
- **Microsoft Cognitive Services**: Speech recognition for voice interviews
- **OpenAI API**: Advanced language models for interview analysis

### Development Tools
- **ESLint 9**: JavaScript linting
- **TypeScript 5**: Static type checking
- **Zod**: TypeScript-first schema validation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ [![Node.js](https://img.shields.io/badge/node-18+-43853d?style=flat-square&logo=node.js)](https://nodejs.org/)
- PostgreSQL database [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
- OpenAI API key [![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?style=flat-square&logo=openai)](https://openai.com/)
- Azure OpenAI key [![Azure](https://img.shields.io/badge/Azure-OpenAI-0078D4?style=flat-square&logo=microsoftazure)](https://azure.microsoft.com/)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-recruiter.git
cd ai-recruiter
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create a .env file with the following variables
DATABASE_URL="postgresql://username:password@localhost:5432/ai_recruiter"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
OPENAI_API_KEY="your-openai-key"
AZURE_OPENAI_KEY="your-azure-openai-key"
```

4. Set up the database:
```bash
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📈 Project Status

[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)](https://github.com/yourusername/ai-recruiter)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)](https://github.com/yourusername/ai-recruiter)
[![Last Commit](https://img.shields.io/github/last-commit/yourusername/ai-recruiter?style=for-the-badge)](https://github.com/yourusername/ai-recruiter/commits/main)

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next Auth Documentation](https://next-auth.js.org/getting-started/introduction)
- [Azure OpenAI Service](https://azure.microsoft.com/en-us/products/ai-services/openai-service)

## 📄 License

[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- OpenAI for providing the AI models
- Microsoft for Azure Cognitive Services
- The Next.js team for the excellent framework

## 👥 Contributors

[![Contributors](https://img.shields.io/github/contributors/yourusername/ai-recruiter?style=for-the-badge)](https://github.com/yourusername/ai-recruiter/graphs/contributors)
