from cryptography.fernet import Fernet

class PasswordManager:
    
    
    def __init__(self):
        self.key = None
        self.password_file = None
        self.password_dict = {} #this is to store the passwords
        
    def create_key(self, path):
        self.key = Fernet.generate_key()
        print(self.key)
        with open(path, 'wb') as f:
            f.write(self.key)
            
    def load_key(self, path):
        with open(path, 'rb') as f:
            self.key = f.read()        
        
pm = PasswordManager()
pm.create_key("PasswordManager/mykey.key")



