from flask import Flask, render_template, request, redirect, url_for
from cryptography.fernet import Fernet
import os

app = Flask(__name__)


class PasswordManager:
    def __init__(self):
        self.key = None
        self.password_file = None
        self.password_dict = {}

    def create_key(self, path):
        self.key = Fernet.generate_key()
        with open(path, 'wb') as f:
            f.write(self.key)
        return f"Key created and saved to {path}"

    def load_key(self, path):
        with open(path, 'rb') as f:
            self.key = f.read()
        return f"Key loaded from {path}"

    def create_password_file(self, path, initial_values=None):
        self.password_file = path
        if initial_values is not None:
            with open(path, 'w') as f:
                for key, value in initial_values.items():
                    encrypted = Fernet(self.key).encrypt(value.encode())
                    f.write(key + ":" + encrypted.decode() + "\n")
                    self.password_dict[key] = value
        return f"Password file created at {path}"

    def load_password(self, path):
        self.password_file = path
        with open(path, 'r') as f:
            for line in f:
                site, encrypted = line.strip().split(":")
                self.password_dict[site] = Fernet(self.key).decrypt(encrypted.encode()).decode()
        return f"Passwords loaded from {path}"

    def add_password(self, site, password):
        self.password_dict[site] = password
        if self.password_file is not None:
            with open(self.password_file, 'a') as f:
                encrypted = Fernet(self.key).encrypt(password.encode())
                f.write(site + ":" + encrypted.decode() + "\n")
        return f"Password for {site} added."

    def get_password(self, site):
        return self.password_dict.get(site, f"No password found for {site}")

pm = PasswordManager()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/create_key', methods=['POST'])
def create_key():
    path = request.form['path']
    pm.create_key(path)
    return redirect(url_for('home'))

@app.route('/load_key', methods=['POST'])
def load_key():
    path = request.form['path']
    pm.load_key(path)
    return redirect(url_for('home'))

@app.route('/create_password_file', methods=['POST'])
def create_password_file():
    path = request.form['path']
    pm.create_password_file(path)
    return redirect(url_for('home'))

@app.route('/load_password', methods=['POST'])
def load_password():
    path = request.form['path']
    pm.load_password(path)
    return redirect(url_for('home'))

@app.route('/add_password', methods=['POST'])
def add_password():
    site = request.form['site']
    password = request.form['password']
    pm.add_password(site, password)
    return redirect(url_for('home'))

@app.route('/get_password', methods=['POST'])
def get_password():
    site = request.form['site']
    password = pm.get_password(site)
    return render_template('index.html', password=password)

if __name__ == '__main__':
    app.run(debug=True)

