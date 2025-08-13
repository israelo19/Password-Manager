import requests
import json

# Update to match your backend
BASE_URL = "http://localhost:5001/api"

def test_health():
    """Test if backend is running"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Health Check Response: {response.status_code}")
        print(f"Response Data: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health Check Error: {e}")
        return False

def test_registration():
    """Test user registration"""
    user_data = {
        "email": "test@example.com",
        "password": "TestPassword123!",
        "confirmPassword": "TestPassword123!"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/register", json=user_data)
        print(f"Registration Response: {response.status_code}")
        print(f"Response Data: {response.json()}")
        return response.status_code == 201
    except Exception as e:
        print(f"Registration Error: {e}")
        return False

def test_login():
    """Test user login"""
    login_data = {
        "email": "test@example.com",
        "password": "TestPassword123!"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/login", json=login_data)
        print(f"Login Response: {response.status_code}")
        print(f"Response Data: {response.json()}")
        if response.status_code == 200:
            return response.json().get('token')
        return None
    except Exception as e:
        print(f"Login Error: {e}")
        return None

def test_add_password(token):
    """Test adding a password"""
    password_data = {
        "website": "Gmail",
        "url": "https://gmail.com",
        "username": "test@gmail.com",
        "password": "MySecretPassword123",
        "notes": "My main email account"
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.post(f"{BASE_URL}/passwords", json=password_data, headers=headers)
        print(f"Add Password Response: {response.status_code}")
        print(f"Response Data: {response.json()}")
        return response.status_code == 201
    except Exception as e:
        print(f"Add Password Error: {e}")
        return False

def test_get_passwords(token):
    """Test getting passwords"""
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/passwords", headers=headers)
        print(f"Get Passwords Response: {response.status_code}")
        print(f"Response Data: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Get Passwords Error: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing Password Manager Backend...\n")
    
    # Test health check first
    print("0. Testing Health Check...")
    if test_health():
        print("✅ Backend is running!\n")
    else:
        print("❌ Backend is not responding!\n")
        print("Make sure backend is running on port 5001")
        exit(1)
    
    # Test registration
    print("1. Testing Registration...")
    if test_registration():
        print("✅ Registration successful!\n")
    else:
        print("❌ Registration failed!\n")
    
    # Test login
    print("2. Testing Login...")
    token = test_login()
    if token:
        print("✅ Login successful!\n")
        print(f"Token received: {token[:50]}...")
    else:
        print("❌ Login failed!\n")
        exit(1)
    
    # Test adding password
    print("3. Testing Add Password...")
    if test_add_password(token):
        print("✅ Password added successfully!\n")
    else:
        print("❌ Failed to add password!\n")
    
    # Test getting passwords
    print("4. Testing Get Passwords...")
    if test_get_passwords(token):
        print("✅ Passwords retrieved successfully!\n")
    else:
        print("❌ Failed to get passwords!\n")
    
    print("🎉 All tests completed!")