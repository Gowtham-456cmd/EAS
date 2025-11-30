# Employee Attendance System

A full-stack web application for managing employee attendance with role-based access control.

## Features

- **Employee Features**:
  - User authentication (login/register)
  - Check-in/Check-out functionality
  - View attendance history
  - View and update profile

- **Manager Features**:
  - View team attendance
  - Department-wise analytics
  - Employee management

## Tech Stack

### Frontend
- React
- Redux for state management
- Styled Components
- React Router

### Backend
- Node.js with Express
- JWT Authentication
- MongoDB with Mongoose

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB (local or cloud)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd EAS
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables:
   - Create `.env` in both `backend` and `frontend` directories
   - Refer to `.env.example` in each directory for required variables

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd ../frontend
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
EAS/
├── backend/          # Backend server code
│   ├── config/       # Configuration files
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Custom middleware
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   └── utils/        # Utility functions
│
└── frontend/         # Frontend React application
    ├── public/       # Static files
    └── src/
        ├── components/  # Reusable UI components
        ├── pages/       # Page components
        ├── store/       # Redux store configuration
        ├── styles/      # Global styles and theme
        └── utils/       # Helper functions
```

## Available Scripts

### Backend
- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon

### Frontend
- `npm start` - Start the development server
- `npm test` - Run tests
- `npm run build` - Build for production

## Environment Variables

### Backend (`.env`)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Frontend (`.env`)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Create React App](https://create-react-app.dev/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
