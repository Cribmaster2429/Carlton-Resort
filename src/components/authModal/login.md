# Login Authentication Implementation Plan (Revised)

This document outlines how we'll implement secure backend authentication for Carlton Resort.

---

## Recommended Approach: JWT + httpOnly Cookies + Express + MongoDB

**Why this stack?**
- **JWT (JSON Web Tokens)**: Industry standard, stateless authentication
- **httpOnly Cookies**: Secure token storage (immune to XSS attacks)
- **Access + Refresh Tokens**: Short-lived access tokens with refresh capability
- **Express.js**: Lightweight, easy to set up, excellent ecosystem
- **MongoDB**: Flexible schema, free tier on Atlas, pairs well with Node.js
- **bcrypt**: Battle-tested password hashing

---

## Architecture Overview

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Frontend │ ──────► │  Express API    │ ──────► │    MongoDB      │
│  (AuthModal)    │ ◄────── │  (JWT Auth)     │ ◄────── │    (Users)      │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                           │
        │                           │
        ▼                           ▼
   httpOnly Cookies            Security Layer:
   (access + refresh)          - bcrypt hashing
                               - Rate limiting
                               - Input sanitization
                               - Joi validation
```

---

## Security Improvements (vs. Original Plan)

| Issue | Original | Improved |
|-------|----------|----------|
| Token storage | localStorage (XSS vulnerable) | httpOnly cookies (secure) |
| Token strategy | Single long-lived token | Access token (15min) + Refresh token (7d) |
| Rate limiting | Not included | `express-rate-limit` from start |
| Input sanitization | None | `express-mongo-sanitize` |
| Password validation | minlength: 6 | 8+ chars, uppercase, number, special char |
| CORS origin | Hardcoded | Environment variable |
| User state | Stored separately in localStorage | Derived from `/api/auth/me` endpoint |

---

## Implementation Steps

### STEP 1: Create Backend Folder Structure

```
Carlton-Resort/
├── server/                      # NEW - Backend folder
│   ├── index.js                # Express server entry point
│   ├── .env                    # Environment variables (secrets)
│   ├── .env.example            # Template for env vars (commit this)
│   ├── package.json            # Backend dependencies
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── models/
│   │   └── User.js             # User schema (Mongoose)
│   ├── routes/
│   │   └── auth.js             # Login/Register endpoints
│   ├── controllers/
│   │   └── authController.js   # Auth logic
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification
│   │   ├── rateLimiter.js      # Rate limiting
│   │   └── validate.js         # Input validation
│   └── utils/
│       └── validators.js       # Joi schemas
```

---

### STEP 2: Backend Dependencies

```bash
cd server
npm init -y
npm install express mongoose bcryptjs jsonwebtoken dotenv cors cookie-parser express-rate-limit express-mongo-sanitize joi helmet
npm install nodemon --save-dev
```

| Package | Purpose |
|---------|---------|
| express | Web server framework |
| mongoose | MongoDB object modeling |
| bcryptjs | Password hashing (pure JS, no compilation issues) |
| jsonwebtoken | Create and verify JWTs |
| dotenv | Load environment variables |
| cors | Allow frontend to call backend (with credentials) |
| cookie-parser | Parse cookies from requests |
| express-rate-limit | Prevent brute force attacks |
| express-mongo-sanitize | Prevent NoSQL injection |
| joi | Input validation and sanitization |
| helmet | Security headers |
| nodemon | Auto-restart server during development |

---

### STEP 3: Environment Variables

**server/.env** (DO NOT COMMIT)
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/carlton-resort

JWT_ACCESS_SECRET=your-access-secret-min-32-chars-random
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars-random
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5
```

**server/.env.example** (COMMIT THIS - template for other developers)
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/carlton-resort

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5
```

**Security Notes:**
- Never commit `.env` to git (add to `.gitignore`)
- Use strong, random secrets (32+ characters) - generate with `openssl rand -hex 32`
- MongoDB Atlas provides free 512MB cluster

---

### STEP 4: Input Validation (server/utils/validators.js)

```javascript
const Joi = require('joi');

/**
 * Password must contain:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const passwordMessages = {
  'string.pattern.base': 'Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)'
};

exports.registerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required'
    }),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .pattern(passwordRegex)
    .required()
    .messages({
      ...passwordMessages,
      'any.required': 'Password is required'
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Please confirm your password'
    })
});

exports.loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});
```

---

### STEP 5: Validation Middleware (server/middleware/validate.js)

```javascript
/**
 * Creates a validation middleware using a Joi schema
 * Validates req.body and returns detailed error messages
 */
exports.validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,  // Return all errors, not just the first
      stripUnknown: true  // Remove fields not in schema
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Replace req.body with validated/sanitized value
    req.body = value;
    next();
  };
};
```

---

### STEP 6: Rate Limiter (server/middleware/rateLimiter.js)

```javascript
const rateLimit = require('express-rate-limit');

/**
 * General API rate limiter
 * Limits requests per IP address
 */
exports.apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Stricter rate limiter for auth endpoints
 * Prevents brute force attacks on login/register
 */
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 5, // 5 attempts per 15 min
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});
```

---

### STEP 7: User Model (server/models/User.js)

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false  // Never return password in queries
  },
  refreshToken: {
    type: String,
    select: false  // Never return refresh token in queries
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving (only if modified)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

---

### STEP 8: Auth Controller (server/controllers/authController.js)

```javascript
const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Generate access token (short-lived)
 */
const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' }
  );
};

/**
 * Generate refresh token (long-lived)
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
};

/**
 * Set httpOnly cookies for tokens
 */
const setTokenCookies = (res, accessToken, refreshToken) => {
  // Access token cookie (15 minutes)
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000  // 15 minutes
  });

  // Refresh token cookie (7 days)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Create user (password hashed by pre-save hook)
    const user = await User.create({ name, email, password });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Set httpOnly cookies
    setTokenCookies(res, accessToken, refreshToken);

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    // Generic error message (don't reveal if email exists)
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Set httpOnly cookies
    setTokenCookies(res, accessToken, refreshToken);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public (requires valid refresh token cookie)
 */
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'No refresh token provided'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user and verify refresh token matches
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Update refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    // Set new cookies
    setTokenCookies(res, newAccessToken, newRefreshToken);

    res.json({
      success: true,
      message: 'Tokens refreshed'
    });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token'
    });
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (clear cookies and refresh token)
 * @access  Private
 */
exports.logout = async (req, res) => {
  try {
    // Clear refresh token from database
    if (req.user) {
      await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
    }

    // Clear cookies
    res.cookie('accessToken', '', { httpOnly: true, expires: new Date(0) });
    res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
```

---

### STEP 9: Auth Middleware (server/middleware/authMiddleware.js)

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - verify access token from cookie
 */
exports.protect = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, please login'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Attach user to request (without password)
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    // Token expired - frontend should try to refresh
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        expired: true
      });
    }

    res.status(401).json({
      success: false,
      message: 'Not authorized, token invalid'
    });
  }
};
```

---

### STEP 10: Auth Routes (server/routes/auth.js)

```javascript
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  refresh,
  logout,
  getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../utils/validators');

// Public routes (with rate limiting)
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
```

---

### STEP 11: Express Server (server/index.js)

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

/* ============================================
   SECURITY MIDDLEWARE
   ============================================ */

// Security headers
app.use(helmet());

// CORS - allow credentials (cookies)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true  // Required for cookies
}));

// Rate limiting
app.use('/api', apiLimiter);

// Sanitize data - prevent NoSQL injection
app.use(mongoSanitize());

/* ============================================
   BODY PARSING MIDDLEWARE
   ============================================ */

app.use(express.json({ limit: '10kb' }));  // Limit body size
app.use(cookieParser());

/* ============================================
   ROUTES
   ============================================ */

app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* ============================================
   ERROR HANDLING
   ============================================ */

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

/* ============================================
   DATABASE CONNECTION & SERVER START
   ============================================ */

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
```

---

### STEP 12: Frontend - Auth Context (src/context/AuthContext.jsx)

```javascript
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

const API_URL = 'http://localhost:5000/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch current user from /me endpoint
   * Called on app load and after login/register
   */
  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/me`, {
        credentials: 'include'  // Send cookies
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Try to refresh token if access token expired
   */
  const refreshToken = async () => {
    try {
      const res = await fetch(`${API_URL}/refresh`, {
        method: 'POST',
        credentials: 'include'
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  /**
   * Check auth status on app load
   */
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  /**
   * Login user
   */
  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',  // Receive cookies
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      // Handle validation errors array
      if (data.errors) {
        throw new Error(data.errors.map(e => e.message).join('. '));
      }
      throw new Error(data.message || 'Login failed');
    }

    setUser(data.user);
    return data;
  };

  /**
   * Register new user
   */
  const register = async (name, email, password, confirmPassword) => {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password, confirmPassword })
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.errors) {
        throw new Error(data.errors.map(e => e.message).join('. '));
      }
      throw new Error(data.message || 'Registration failed');
    }

    setUser(data.user);
    return data;
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      refreshToken,
      fetchUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

---

### STEP 13: Update AuthModal.jsx

Key changes needed:
1. Import and use `useAuth` hook
2. Add loading and error states
3. Call `login()` or `register()` on form submit
4. Display validation errors to user

```javascript
// Add these imports
import { useAuth } from '../../context/AuthContext';

// Inside component, add:
const { login, register } = useAuth();
const [error, setError] = useState('');
const [isLoading, setIsLoading] = useState(false);

// Replace handleSubmit with:
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    if (activeTab === 'login') {
      await login(formData.email, formData.password);
    } else {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
    }
    onClose();
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};

// In the JSX, add error display after the tabs:
{error && (
  <div className="formError">
    {error}
  </div>
)}

// Update submit button to show loading state:
<button type="submit" className="submitBtn" disabled={isLoading}>
  {isLoading
    ? 'Please wait...'
    : activeTab === 'login' ? 'Sign In' : 'Create Account'
  }
</button>
```

---

## Security Checklist

| Security Measure | Implementation | Status |
|-----------------|----------------|--------|
| Password hashing | bcrypt with 12 salt rounds | ✅ |
| Password never returned | `select: false` in schema | ✅ |
| Strong password policy | 8+ chars, upper, lower, number, special | ✅ |
| Token storage | httpOnly cookies (not localStorage) | ✅ |
| Short-lived access tokens | 15 minutes | ✅ |
| Refresh token rotation | New refresh token on each refresh | ✅ |
| Rate limiting | 5 attempts per 15min on auth routes | ✅ |
| NoSQL injection prevention | express-mongo-sanitize | ✅ |
| Input validation | Joi schemas with detailed errors | ✅ |
| Security headers | Helmet middleware | ✅ |
| CORS with credentials | Configured for cookies | ✅ |
| Generic auth errors | "Invalid email or password" | ✅ |
| HTTPS | Required for production (secure cookies) | ⚠️ Prod only |

---

## API Endpoints Summary

| Method | Endpoint | Description | Auth | Rate Limited |
|--------|----------|-------------|------|--------------|
| POST | `/api/auth/register` | Create new user | No | Yes (5/15min) |
| POST | `/api/auth/login` | Login user | No | Yes (5/15min) |
| POST | `/api/auth/refresh` | Refresh access token | No* | No |
| POST | `/api/auth/logout` | Logout user | Yes | No |
| GET | `/api/auth/me` | Get current user | Yes | No |
| GET | `/api/health` | Health check | No | Yes |

*Requires valid refresh token cookie

---

## Running the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev    # Uses nodemon for auto-restart
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

## Testing the API

```bash
# Health check
curl http://localhost:5000/api/health

# Register (note: password must meet requirements)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass1!",
    "confirmPassword": "SecurePass1!"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass1!"
  }'

# Get current user (using saved cookies)
curl http://localhost:5000/api/auth/me \
  -b cookies.txt

# Refresh token
curl -X POST http://localhost:5000/api/auth/refresh \
  -b cookies.txt \
  -c cookies.txt

# Logout
curl -X POST http://localhost:5000/api/auth/logout \
  -b cookies.txt
```

---

## Order of Implementation

1. **Set up MongoDB Atlas** (free tier) and get connection string
2. **Create server folder** and install dependencies
3. **Create all backend files** (copy from this document)
4. **Test API** with curl or Postman
5. **Create AuthContext** in frontend
6. **Wrap App with AuthProvider**
7. **Update AuthModal** to use auth functions
8. **Add error display CSS** to authModal.css
9. **Update Navbar** to show user name when logged in

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `server/package.json` | Create |
| `server/.env` | Create (don't commit) |
| `server/.env.example` | Create (commit this) |
| `server/index.js` | Create |
| `server/models/User.js` | Create |
| `server/routes/auth.js` | Create |
| `server/controllers/authController.js` | Create |
| `server/middleware/authMiddleware.js` | Create |
| `server/middleware/rateLimiter.js` | Create |
| `server/middleware/validate.js` | Create |
| `server/utils/validators.js` | Create |
| `src/context/AuthContext.jsx` | Create |
| `src/App.jsx` | Modify (wrap with AuthProvider) |
| `src/components/authModal/AuthModal.jsx` | Modify |
| `src/components/authModal/authModal.css` | Modify (add error styles) |
| `src/components/navbar/Navbar.jsx` | Modify (show user when logged in) |
| `.gitignore` | Modify (add server/.env) |
