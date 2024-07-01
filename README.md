# Secure Password Manager

## Overview
Secure Password Manager is a Flask-based web application that allows users to securely manage their passwords. It provides functionality for creating and loading encryption keys, managing password files, and performing password operations like adding and retrieving passwords.



## Features
- Create and load encryption keys
- Create and load password files
- Add new passwords to the manager
- Retrieve stored passwords
- Secure encryption using Fernet (symmetric encryption)
- User-friendly web interface

## Technologies Used
- Python 3.x
- Flask
- Cryptography library (Fernet)
- HTML/CSS
- JavaScript (with particles.js for background effects)

## Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/secure-password-manager.git
cd secure-password-manager
```
2. Set up a virtual environment (optional but recommended):
```
python -m venv venv
source venv/bin/activate  # On Windows use venv\Scripts\activate
```
3. Install all the requirements
```
pip install -r requirements.txt
```
## Usage

1. Run the Flask application(test.py for now, do not use seriously, we are in development):
```
python test.py
```
2. Open a web browser and navigate to `http://localhost:5000`

3. Use the interface to manage your passwords:
- Create a new encryption key
- Create a new password file
- Add passwords to the manager
- Retrieve stored passwords

## Security Considerations
- This application is for educational purposes only and should not be used to store real, sensitive passwords without further security enhancements.
- The encryption key and password file are stored locally. Ensure you keep these files secure.
- Always use strong, unique passwords for each site/service.

## Contributing
Contributions to improve the Secure Password Manager are welcome. Please feel free to submit a Pull Request.

## License
[MIT License](LICENSE)

## Disclaimer
This project is for educational purposes only. The creators are not responsible for any misuse or for any data loss that may occur from using this application.

Progress so far: ![image](https://github.com/israelo19/Password-Manager/assets/57731260/2dbf10a4-7b7b-4728-8a2c-c134e317e5fc)

@Israel Ogwu & @Cedric 
