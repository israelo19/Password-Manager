"""
Modern Secure Password Manager - Flask Backend
Author: GitHub Copilot
Description: Production-ready password manager with secure authentication
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from cryptography.fernet import Fernet
import os
from datetime import datetime, timedelta
import re
import secrets

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', secrets.token_hex(32))
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', secrets.token_hex(32))
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///password_manager.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
limiter = Limiter(
    key_func=get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"]
)
CORS(app, origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"], 
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization'])

# Database Models
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    encryption_key = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationship with passwords
    passwords = db.relationship('Password', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<User {self.username}>'

class Password(db.Model):
    __tablename__ = 'passwords'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    site_name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(100), nullable=True)
    encrypted_password = db.Column(db.Text, nullable=False)
    url = db.Column(db.String(255), nullable=True)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Password {self.site_name}>'

# Utility Functions
def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password_strength(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "Password must contain at least one special character"
    return True, "Password is strong"

def encrypt_password(password, key):
    """Encrypt password using Fernet"""
    fernet = Fernet(key.encode())
    return fernet.encrypt(password.encode()).decode()

def decrypt_password(encrypted_password, key):
    """Decrypt password using Fernet"""
    fernet = Fernet(key.encode())
    return fernet.decrypt(encrypted_password.encode()).decode()

# API Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
    })

@app.route('/api/auth/register', methods=['POST', 'OPTIONS'])
@limiter.limit("3 per minute")
def register():
    """User registration endpoint"""
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.get_json()
        print(f"Registration data received: {data}")  # Debug log
        
        # Validate input
        email = data.get('email', '').strip().lower()
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        print(f"Parsed data - Email: {email}, Username: {username}")  # Debug log
        
        if not all([email, username, password]):
            print("Missing required fields")  # Debug log
            return jsonify({'error': 'All fields are required'}), 400
        
        # Validate email format
        if not validate_email(email):
            print("Invalid email format")  # Debug log
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate password strength
        is_strong, message = validate_password_strength(password)
        if not is_strong:
            print(f"Password validation failed: {message}")  # Debug log
            return jsonify({'error': message}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            print("Email already exists")  # Debug log
            return jsonify({'error': 'Email already registered'}), 400
        
        existing_username = User.query.filter_by(username=username).first()
        if existing_username:
            print("Username already exists")  # Debug log
            return jsonify({'error': 'Username already taken'}), 400
        
        # Create new user
        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        encryption_key = Fernet.generate_key().decode('utf-8')
        
        new_user = User(
            email=email,
            username=username,
            password_hash=password_hash,
            encryption_key=encryption_key
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        print(f"User created successfully: {new_user.id}")  # Debug log
        
        return jsonify({
            'message': 'User registered successfully',
            'user_id': new_user.id
        }), 201
        
    except Exception as e:
        print(f"Registration error: {str(e)}")  # Debug log
        db.session.rollback()
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500

@app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
@limiter.limit("5 per minute")
def login():
    """User login endpoint"""
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.get_json()
        print(f"Login data received: {data}")  # Debug log
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not all([email, password]):
            print("Missing email or password")  # Debug log
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user
        user = User.query.filter_by(email=email, is_active=True).first()
        print(f"User found: {user is not None}")  # Debug log
        
        if not user:
            print("User not found")  # Debug log
            return jsonify({'error': 'Invalid credentials'}), 401
            
        if not bcrypt.check_password_hash(user.password_hash, password):
            print("Password check failed")  # Debug log
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Create access token
        access_token = create_access_token(identity=str(user.id))
        print(f"Login successful for user: {user.email}")  # Debug log
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        })
        
    except Exception as e:
        print(f"Login error: {str(e)}")  # Debug log
        return jsonify({'error': f'Login failed: {str(e)}'}), 500

@app.route('/api/passwords', methods=['GET', 'OPTIONS'])
def get_passwords():
    """Get all passwords for authenticated user"""
    if request.method == 'OPTIONS':
        return '', 200
    
    # Debug: Check authorization header
    auth_header = request.headers.get('Authorization')
    print(f"🔍 Authorization header: {auth_header}")
    
    try:
        # Apply JWT verification manually for better error handling
        from flask_jwt_extended import verify_jwt_in_request
        verify_jwt_in_request()
        
        user_id = get_jwt_identity()
        print(f"🔑 Get passwords - User ID from JWT: {user_id}")  # Debug log
        
        if not user_id:
            print("❌ No user ID found in JWT token")  # Debug log
            return jsonify({'error': 'Authentication required'}), 401
        
        # Convert string back to integer
        user_id = int(user_id)
            
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        passwords = Password.query.filter_by(user_id=user_id).all()
        
        password_list = []
        for pwd in passwords:
            password_list.append({
                'id': pwd.id,
                'site_name': pwd.site_name,
                'username': pwd.username,
                'url': pwd.url,
                'notes': pwd.notes,
                'created_at': pwd.created_at.isoformat(),
                'updated_at': pwd.updated_at.isoformat()
            })
        
        return jsonify({
            'passwords': password_list,
            'count': len(password_list)
        })
        
    except Exception as e:
        print(f"❌ JWT verification error: {str(e)}")  # Debug log
        print(f"❌ Error type: {type(e)}")  # Debug log
        return jsonify({'error': 'Authentication failed'}), 401

@app.route('/api/passwords', methods=['POST', 'OPTIONS'])
@jwt_required()
def add_password():
    """Add new password entry"""
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        site_name = data.get('site_name', '').strip()
        username = data.get('username', '').strip()
        password = data.get('password', '')
        url = data.get('url', '').strip()
        notes = data.get('notes', '').strip()
        
        if not all([site_name, password]):
            return jsonify({'error': 'Site name and password are required'}), 400
        
        # Encrypt password
        encrypted_password = encrypt_password(password, user.encryption_key)
        
        # Create new password entry
        new_password = Password(
            user_id=user_id,
            site_name=site_name,
            username=username,
            encrypted_password=encrypted_password,
            url=url,
            notes=notes
        )
        
        db.session.add(new_password)
        db.session.commit()
        
        return jsonify({
            'message': 'Password added successfully',
            'password_id': new_password.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to add password'}), 500

@app.route('/api/passwords/<int:password_id>', methods=['GET'])
@jwt_required()
def get_password(password_id):
    """Get specific password (decrypted)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        password = Password.query.filter_by(id=password_id, user_id=user_id).first()
        
        if not password:
            return jsonify({'error': 'Password not found'}), 404
        
        # Decrypt password
        decrypted_password = decrypt_password(password.encrypted_password, user.encryption_key)
        
        return jsonify({
            'id': password.id,
            'site_name': password.site_name,
            'username': password.username,
            'password': decrypted_password,
            'url': password.url,
            'notes': password.notes,
            'created_at': password.created_at.isoformat(),
            'updated_at': password.updated_at.isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to retrieve password'}), 500

@app.route('/api/passwords/<int:password_id>', methods=['PUT'])
@jwt_required()
def update_password(password_id):
    """Update password entry"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        password = Password.query.filter_by(id=password_id, user_id=user_id).first()
        
        if not password:
            return jsonify({'error': 'Password not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'site_name' in data:
            password.site_name = data['site_name'].strip()
        if 'username' in data:
            password.username = data['username'].strip()
        if 'password' in data:
            password.encrypted_password = encrypt_password(data['password'], user.encryption_key)
        if 'url' in data:
            password.url = data['url'].strip()
        if 'notes' in data:
            password.notes = data['notes'].strip()
        
        password.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({'message': 'Password updated successfully'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update password'}), 500

@app.route('/api/passwords/<int:password_id>', methods=['DELETE'])
@jwt_required()
def delete_password(password_id):
    """Delete password entry"""
    try:
        user_id = get_jwt_identity()
        password = Password.query.filter_by(id=password_id, user_id=user_id).first()
        
        if not password:
            return jsonify({'error': 'Password not found'}), 404
        
        db.session.delete(password)
        db.session.commit()
        
        return jsonify({'message': 'Password deleted successfully'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete password'}), 500

@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get user profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        password_count = Password.query.filter_by(user_id=user_id).count()
        
        return jsonify({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'created_at': user.created_at.isoformat(),
                'password_count': password_count
            }
        })
        
    except Exception as e:
        return jsonify({'error': 'Failed to retrieve profile'}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({'error': 'Token has expired'}), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({'error': 'Invalid token'}), 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({'error': 'Authorization token is required'}), 401

if __name__ == '__main__':
    # Initialize database tables
    with app.app_context():
        db.create_all()
        print("✅ Database tables created successfully!")
    
    print("🚀 Starting SecureVault Password Manager Backend...")
    print("📍 Backend running at: http://localhost:5001")
    print("📍 API Health Check: http://localhost:5001/api/health")
    app.run(debug=True, host='0.0.0.0', port=5001)
