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
            
    #function for creating the password file
    
    def create_password_file(self, path, initial_values = None):        
        self.password_file = path
        
        if initial_values is not None:
            for key, value in initial_values.items():
                pass # TODO: add password function ()
            
    def load_password(self, path):
        self.password_file = path
        
        with open(path, 'r') as f:
            for line in f:
                site, encrypted = line.split(":")

                        
pm = PasswordManager()
pm.create_key("PasswordManager/mykey.key")



