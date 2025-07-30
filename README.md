# Health Service - Research Study Management Platform

A comprehensive React.js frontend application for managing research studies, patient matching, and data collection in healthcare research environments.

## 🏥 Project Overview

This platform provides researchers with tools to:
- **Manage Research Studies**: Create, view, and track research studies
- **Patient Matching**: AI-powered patient matching for study eligibility  
- **Dynamic Forms**: JSON schema-based form rendering for data collection
- **Generative AI Integration**: Intelligent assistance for criteria augmentation and note summarization
- **Data Export**: One-click export of curated datasets
- **Contextual Q&A**: RAG-based chat interface for study-specific queries

## 🚀 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **State Management**: Zustand
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **API Client**: Axios
- **Testing**: Jest + React Testing Library

## 📋 Features by Phase

### Phase 1: Foundation & Core Study Management ✅
- [x] Project setup with TypeScript and Vite
- [x] Material-UI integration and theming
- [x] Authentication system with protected routes
- [x] Main application layout (sidebar, header, content)
- [x] Dashboard with study statistics and activity feed
- [x] Study management (list, create, view)
- [x] Form handling with React Hook Form

### Phase 2: Data Interaction & Visualization 🚧
- [ ] Dynamic form rendering with JSON Schema
- [ ] Patient matching visualization interface
- [ ] Enhanced dashboard with real-time charts
- [ ] Basic descriptive statistics display

### Phase 3: Generative AI Integration 🔄
- [ ] Criteria augmentation with AI suggestions
- [ ] Note summarization functionality
- [ ] One-click data export system

### Phase 4: Advanced Features & Deployment 📋
- [ ] Contextual Q&A chat interface
- [ ] Comprehensive testing suite
- [ ] Accessibility improvements
- [ ] Docker containerization
- [ ] Production deployment configuration

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Health-Service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_APP_NAME=Health Service
   VITE_APP_VERSION=1.0.0
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode

## 🔐 Authentication

### Demo Credentials
- **Email**: demo@healthservice.com
- **Password**: demo123

### API Integration
The application expects a backend API with the following endpoints:
- `POST /api/auth/login` - User authentication
- `POST /api/auth/refresh` - Token refresh
- `GET /api/studies` - Fetch studies
- `POST /api/studies` - Create new study
- And more...

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout/         # Main layout components
├── pages/              # Page components
│   ├── Auth/           # Authentication pages
│   ├── Dashboard/      # Dashboard page
│   ├── Studies/        # Study management pages
│   ├── Patients/       # Patient-related pages
│   ├── Forms/          # Dynamic form pages
│   └── Chat/           # AI chat interface
├── services/           # API service layers
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── hooks/              # Custom React hooks
```

## 🎨 UI/UX Design

- **Design System**: Material Design 3 principles
- **Theme**: Professional healthcare aesthetic with blue primary colors
- **Responsive**: Mobile-first approach with breakpoint optimization
- **Accessibility**: WCAG 2.1 AA compliance target

## 🧪 Testing Strategy

- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: API integration and user flow testing
- **E2E Tests**: Critical path testing (planned)

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Docker (Planned)
```bash
docker build -t health-service-frontend .
docker run -p 3000:3000 health-service-frontend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🔄 Version History

- **v1.0.0** - Initial release with core study management
- **v0.9.0** - Beta release with authentication and dashboard
- **v0.1.0** - Project initialization and setup

---

Built with ❤️ for healthcare research advancement
