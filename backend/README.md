# Health Service Backend API

Backend API for the Health Service Research Study Management Platform built with Node.js, Express, and TypeScript.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Study Management**: Complete CRUD operations for research studies  
- **Patient Management**: Patient enrollment and data management
- **Dynamic Forms**: JSON Schema-based form creation and response handling
- **Patient Matching**: AI-powered patient matching against study criteria
- **Data Export**: Multi-format export (JSON, CSV, Excel) with customizable reports
- **GenAI Integration**: AI-powered text generation, criteria analysis, and optimization suggestions
- **Security**: Helmet, CORS, rate limiting, input validation, and sanitization

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Validation**: Joi for request validation
- **Authentication**: JWT with bcrypt for password hashing
- **Security**: Helmet, CORS, express-rate-limit
- **Development**: tsx for TypeScript execution, nodemon for hot reload

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update environment variables in `.env`:
```env
NODE_ENV=development
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-token-secret
CORS_ORIGIN=http://localhost:5173
```

## Development

Start the development server with hot reload:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## Production

Build and start the production server:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Studies
- `GET /api/studies` - List all studies
- `GET /api/studies/:id` - Get study by ID
- `POST /api/studies` - Create new study
- `PUT /api/studies/:id` - Update study
- `DELETE /api/studies/:id` - Delete study
- `GET /api/studies/:id/stats` - Get study statistics
- `GET /api/studies/:id/matches` - Get patient matches for study

### Patients
- `GET /api/patients` - List all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `POST /api/patients/search` - Search patients by criteria

### Forms
- `GET /api/forms` - List all forms
- `GET /api/forms/:id` - Get form by ID
- `POST /api/forms` - Create new form
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form
- `GET /api/forms/:id/responses` - Get form responses
- `POST /api/forms/:id/responses` - Submit form response

### Patient Matching
- `POST /api/matches/studies/:studyId/find` - Find patient matches
- `GET /api/matches/:id` - Get match details
- `PUT /api/matches/:id/status` - Update match status
- `GET /api/matches/:id/history` - Get match history
- `GET /api/matches/studies/:studyId/export` - Export matches

### AI/GenAI
- `POST /api/genai/generate-text` - Generate AI text
- `POST /api/genai/analyze-criteria` - Analyze study criteria
- `POST /api/genai/suggest-optimizations` - Get optimization suggestions
- `POST /api/genai/process-document` - Process and analyze documents
- `POST /api/genai/chat` - AI chat interface

### Export
- `GET /api/export/studies/:studyId` - Export study data
- `POST /api/export/patients` - Export patient data
- `GET /api/export/forms/:formId/responses` - Export form responses
- `POST /api/export/reports/:studyId` - Generate custom reports

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Default Users
- **Demo User**: `demo@healthservice.com` / `password123`
- **Admin User**: `admin@healthservice.com` / `admin123`

## Request/Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Architecture

```
src/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Express middleware
├── routes/          # API route definitions
├── services/        # Business logic services
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── validation/      # Request validation schemas
└── server.ts        # Main application entry point
```

## Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Request validation with Joi
- Rate limiting to prevent abuse
- CORS configuration
- Security headers with Helmet
- Input sanitization

## Error Handling

The API includes comprehensive error handling with:
- Global error middleware
- Consistent error response format
- Detailed validation error messages
- Request ID tracking for debugging

## Logging

Development and production logging with Morgan:
- Request/response logging
- Error tracking
- Performance monitoring

## Mock Data

The current implementation uses in-memory mock data for rapid development. In production, replace MockDataService with actual database implementations.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

## License

MIT License - see LICENSE file for details
