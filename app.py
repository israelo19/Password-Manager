from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_wtf import CSRFProtect
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from cryptography.fernet import Fernet
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET', 'dev-secret')

bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
csrf = CSRFProtect(app)
limiter = Limiter(key_func=get_remote_address, app=app, default_limits=["200 per day", "50 per hour"])
users = {}

class User(UserMixin):
    def __init__(self, username: str):
        self.id = username

@login_manager.user_loader
def load_user(user_id):
    if user_id in users:
        return User(user_id)
    return None

@app.route('/api/register', methods=['POST'])
@limiter.limit("5 per minute")
def register():
    data = request.get_json() or {}
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    if username in users:
        return jsonify({'error': 'User already exists'}), 400
    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    key = Fernet.generate_key()
    users[username] = {'password_hash': pw_hash, 'key': key, 'passwords': {}}
    return jsonify({'message': 'User registered successfully'})

@app.route('/api/login', methods=['POST'])
@limiter.limit("5 per minute")
def login():
    data = request.get_json() or {}
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
    user = users.get(username)
    if user and bcrypt.check_password_hash(user['password_hash'], password):
        login_user(User(username))
        return jsonify({'message': 'Logged in'})
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out'})

@app.route('/api/password', methods=['POST'])
@login_required
def add_password():
    data = request.get_json() or {}
    site = data.get('site', '').strip()
    password = data.get('password', '').strip()
    if not site or not password:
        return jsonify({'error': 'Site and password are required'}), 400
    user = users[current_user.id]
    encrypted = Fernet(user['key']).encrypt(password.encode()).decode('utf-8')
    user['passwords'][site] = encrypted
    return jsonify({'message': f'Password for {site} saved'})

@app.route('/api/password/<site>', methods=['GET'])
@login_required
def get_password(site):
    user = users[current_user.id]
    encrypted = user['passwords'].get(site)
    if not encrypted:
        return jsonify({'error': 'Password not found'}), 404
    password = Fernet(user['key']).decrypt(encrypted.encode()).decode('utf-8')
    return jsonify({'site': site, 'password': password})

if __name__ == '__main__':
    app.run(debug=True)
