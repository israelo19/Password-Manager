# 🔐 SecureVault - Modern Password Manager

A fully functional, secure password manager built with **React** frontend and **Flask** backend, featuring JWT authentication, encrypted password storage, and a modern dark theme UI.

![SecureVault](https://img.shields.io/badge/Status-Fully%20Functional-brightgreen) ![React](https://img.shields.io/badge/Frontend-React-blue) ![Flask](https://img.shields.io/badge/Backend-Flask-red) ![SQLite](https://img.shields.io/badge/Database-SQLite-green)

## ✨ Features

### 🔒 **Security & Authentication**
- **JWT Authentication**: Secure token-based user authentication
- **Password Encryption**: Individual user encryption using Fernet (AES-256)
- **Secure Database**: SQLite with encrypted password storage
- **User Isolation**: Each user can only access their own passwords
- **Rate Limiting**: Protection against brute-force attacks
- **CORS Protection**: Secure cross-origin resource sharing

### 🎨 **Modern UI/UX**
- **Dark Theme**: Professional dark interface with gradient backgrounds
- **Responsive Design**: Works perfectly on desktop and mobile
- **Particle Background**: Animated particle system for visual appeal
- **Toast Notifications**: Real-time feedback for user actions
- **Smooth Animations**: Powered by Framer Motion
- **Modern Components**: Clean, intuitive interface design

### 🛠️ **Core Functionality**
- **User Registration & Login**: Complete authentication system
- **Password Management**: Add, view, edit, and delete passwords
- **Secure Storage**: Encrypted password storage with metadata
- **Search & Organization**: Easy password discovery and management
- **Website Integration**: Store URLs, usernames, and notes
- **Auto-Redirect**: Seamless navigation after authentication

## 🚀 Quick Start

### **Prerequisites**
- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **Git** for cloning the repository

### **Installation & Setup**

1. **Clone the Repository**
```bash
git clone <your-repository-url>
cd Password-Manager
```

2. **Backend Setup**
```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Start the Flask backend
cd backend
python app.py
```
Backend will run on: **http://localhost:5001**

3. **Frontend Setup** (In a new terminal)
```bash
# Install Node.js dependencies
npm install

# Start the React development server
npm run dev
```
Frontend will run on: **http://localhost:5173**

### **🎯 Ready to Use!**
- Open **http://localhost:5173** in your browser
- Register a new account or login
- Start managing your passwords securely!

## 🏗️ **Project Structure**

```
Password-Manager/
├── 📂 backend/
│   ├── app.py                    # Flask application & API endpoints
│   ├── password_manager.db       # SQLite database (auto-created)
│   └── instance/
│       └── password_manager.db   # Alternative DB location
├── 📂 src/
│   ├── 📂 components/
│   │   ├── Navbar.jsx           # Navigation component
│   │   ├── ParticleBackground.jsx # Animated background
│   │   └── ProtectedRoute.jsx    # Route protection
│   ├── 📂 contexts/
│   │   └── AuthContext.jsx      # Authentication state management
│   ├── 📂 pages/
│   │   ├── HomePage.jsx         # Landing page
│   │   ├── LoginPage.jsx        # User login
│   │   ├── RegisterPage.jsx     # User registration
│   │   └── DashboardPage.jsx    # Password management
│   ├── 📂 services/
│   │   └── api.js              # API communication layer
│   ├── App.jsx                 # Main React component
│   ├── main.jsx               # React entry point
│   └── style.css              # Global styles & animations
├── 📄 requirements.txt         # Python dependencies
├── 📄 package.json            # Node.js dependencies
├── 📄 tailwind.config.js      # Tailwind CSS configuration
└── 📄 README.md              # This file
```

## 🌐 **API Endpoints**

### **Authentication**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | User login | ❌ |
| `GET` | `/api/health` | Health check | ❌ |

### **Password Management**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/passwords` | Get all user passwords | ✅ |
| `POST` | `/api/passwords` | Create new password | ✅ |
| `GET` | `/api/passwords/:id` | Get specific password | ✅ |
| `PUT` | `/api/passwords/:id` | Update password | ✅ |
| `DELETE` | `/api/passwords/:id` | Delete password | ✅ |

### **User Profile**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/user/profile` | Get user profile | ✅ |

## 🔧 **Configuration**

### **Environment Variables**
The application uses secure defaults but can be customized:

```env
# Flask Configuration
SECRET_KEY=auto-generated-secure-key
JWT_SECRET_KEY=auto-generated-jwt-key
JWT_ACCESS_TOKEN_EXPIRES=1hour

# Database
DATABASE_URL=sqlite:///password_manager.db

# Server Settings
FLASK_ENV=development
FLASK_DEBUG=True
```

### **JWT Configuration**
- **Token Location**: Authorization header
- **Token Type**: Bearer
- **Expiry**: 1 hour
- **Auto-refresh**: Handled by frontend

## 🔒 **Security Implementation**

### **Password Encryption**
```python
# Each user gets a unique encryption key
user_key = Fernet.generate_key()
cipher = Fernet(user_key)

# Passwords are encrypted before database storage
encrypted_password = cipher.encrypt(password.encode())
```

### **Authentication Flow**
1. User registers/logs in with email & password
2. Backend validates credentials and returns JWT token
3. Frontend stores token and includes in API requests
4. Backend validates JWT for protected endpoints
5. User-specific data is returned based on token identity

### **Database Security**
- Passwords stored encrypted with individual user keys
- User passwords hashed with bcrypt + salt
- JWT tokens include user identity claims
- Database queries filtered by authenticated user ID

## 🧪 **Testing the Application**

### **Manual Testing Steps**
1. **Registration**: Create new account with email/password
2. **Login**: Authenticate with your credentials
3. **Dashboard Access**: Verify redirect to password management
4. **Add Password**: Create a new password entry
5. **View Passwords**: See your encrypted passwords decrypted
6. **Edit/Delete**: Modify or remove password entries

### **API Testing with cURL**
```bash
# Register user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"TestPass123!"}'

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!"}'

# Get passwords (replace TOKEN with actual JWT)
curl -X GET http://localhost:5001/api/passwords \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🗃️ **Database Management**

### **View Database Contents**
```bash
# Access SQLite database
cd backend
sqlite3 password_manager.db

# View tables
.tables

# View users (passwords are hashed)
SELECT id, email, username, is_active FROM users;

# View encrypted passwords
SELECT user_id, site_name, username, url FROM passwords;

# Exit
.quit
```

### **Database Schema**
```sql
-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR(120) UNIQUE NOT NULL,
    username VARCHAR(80) UNIQUE NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    encryption_key TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Passwords table
CREATE TABLE passwords (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    site_name VARCHAR(100) NOT NULL,
    username VARCHAR(100),
    encrypted_password TEXT NOT NULL,
    url VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## 🚀 **Deployment**

### **Production Setup**
1. **Environment Configuration**
```bash
export FLASK_ENV=production
export FLASK_DEBUG=False
export SECRET_KEY=your-production-secret
export JWT_SECRET_KEY=your-production-jwt-secret
```

2. **Build Frontend**
```bash
npm run build
```

3. **Deploy with Gunicorn**
```bash
pip install gunicorn
gunicorn --bind 0.0.0.0:5000 backend.app:app
```

### **Security Considerations**
- Use HTTPS in production
- Set secure environment variables
- Configure proper CORS origins
- Implement proper backup strategies
- Regular security updates

## 🛠️ **Development**

### **Key Technologies**
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Backend**: Flask, Flask-JWT-Extended, SQLAlchemy, Cryptography
- **Database**: SQLite (easily replaceable with PostgreSQL/MySQL)
- **Authentication**: JWT tokens with bcrypt password hashing
- **Encryption**: Fernet (AES-256) for password encryption

### **Development Workflow**
1. Backend changes: Restart Flask server (`python backend/app.py`)
2. Frontend changes: Hot reload automatically updates
3. Database changes: Delete `.db` file and restart backend
4. API testing: Use provided cURL commands or Postman

## 🎯 **Current Status**

✅ **Fully Functional Features:**
- User registration and authentication
- JWT token-based security
- Password encryption and storage
- Complete CRUD operations for passwords
- Modern React frontend with routing
- Responsive design and animations
- Cross-origin resource sharing (CORS)
- Auto-redirect authentication flow

✅ **Tested & Working:**
- User registration → Login → Dashboard flow
- Password creation, viewing, editing, deletion
- Token validation and refresh
- Database persistence and encryption
- Frontend-backend communication

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Flask** - Lightweight Python web framework
- **React** - Modern JavaScript library for UI
- **Tailwind CSS** - Utility-first CSS framework
- **Cryptography** - Python cryptographic library
- **SQLAlchemy** - Python SQL toolkit and ORM

---

**🎉 Ready to use!** Start both servers and navigate to http://localhost:5173 to begin managing your passwords securely.
```bash
chmod +x fix.sh
./fix.sh
```

This script will:
- Create a Python virtual environment
- Install all backend dependencies
- Install frontend dependencies
- Create environment configuration
- Start both backend and frontend servers

### Manual Setup

If you prefer manual setup:

1. **Backend Setup**
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Start backend
cd backend
python app.py
```

2. **Frontend Setup**
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 🏗️ Project Structure

```
securevault/
├── backend/
│   ├── __init__.py
│   └── app.py              # Flask application
├── src/
│   ├── components/         # Reusable React components
│   │   ├── Navbar.jsx
│   │   ├── ParticleBackground.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/          # React contexts
│   │   └── AuthContext.jsx
│   ├── pages/             # Main application pages
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── DashboardPage.jsx
│   ├── services/          # API services
│   │   └── api.js
│   ├── App.jsx           # Main React component
│   ├── main.jsx          # React entry point
│   └── style.css         # Global styles
├── requirements.txt       # Python dependencies
├── package.json          # Node.js dependencies
├── tailwind.config.js    # Tailwind CSS configuration
├── .env.example          # Environment variables template
└── README.md
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and update the following:

```env
# Flask Settings
SECRET_KEY=your-super-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here

# Database
DATABASE_URL=sqlite:///password_manager.db

# Security Settings
FLASK_ENV=production  # Change for production
FLASK_DEBUG=False     # Change for production
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Password Management
- `GET /api/passwords` - Get all passwords
- `POST /api/passwords` - Create new password
- `GET /api/passwords/:id` - Get specific password (decrypted)
- `PUT /api/passwords/:id` - Update password
- `DELETE /api/passwords/:id` - Delete password

### User Management
- `GET /api/user/profile` - Get user profile
- `GET /api/health` - Health check

## 🔒 Security Considerations

### Password Storage
- All passwords are encrypted using Fernet (AES 128 in CBC mode)
- Each user has a unique encryption key stored securely on the server
- Master passwords are hashed using bcrypt with salt

### Authentication
- JWT tokens expire after 1 hour
- Rate limiting prevents brute-force attacks
- CORS configured for specific frontend domains

### Best Practices
- Use HTTPS in production
- Regularly rotate encryption keys
- Implement proper backup strategies
- Monitor for security vulnerabilities

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
```bash
# Set production environment variables
export FLASK_ENV=production
export FLASK_DEBUG=False
export SECRET_KEY=your-production-secret-key
export JWT_SECRET_KEY=your-production-jwt-key
```

2. **Build Frontend**
```bash
npm run build
```

3. **Deploy with Gunicorn**
```bash
pip install gunicorn
gunicorn --bind 0.0.0.0:5000 backend.app:app
```

### Docker Deployment

```dockerfile
# Dockerfile example
FROM node:16 AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ ./backend/
COPY --from=frontend /app/dist ./static
EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "backend.app:app"]
```

## 🧪 Testing

```bash
# Run backend tests
cd backend
python -m pytest

# Run frontend tests
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🛡️ Security Disclaimer

This application implements industry-standard security practices, but no system is 100% secure. Please:
- Use strong, unique master passwords
- Keep your system updated
- Report security vulnerabilities responsibly
- Regularly backup your data

## 👥 Authors

- **Israel Ogwu** - [@israelo19](https://github.com/israelo19)
- **Cedric Pierre-Louis** - [@cedricpl](https://github.com/cedricpl)

## 🙏 Acknowledgments

- [Fernet Cryptography](https://cryptography.io/en/latest/fernet/)
- [React](https://reactjs.org/)
- [Flask](https://flask.palletsprojects.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

**⚠️ Important**: This is a demonstration project. For production use, ensure proper security audits and compliance with your organization's security policies.
