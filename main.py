from cryptography.fernet import Fernet

class PasswordManager:
    
    #constructor to initialize the key, the path for the password file and
    #the dictionary that will store the passwords and their respefctive sites
    def __init__(self):
        self.key = None
        self.password_file = None
        self.password_dict = {}
        
    def create_key(self, path):
        # Generate a new encryption key and save it to the specified path
        self.key = Fernet.generate_key()
        with open(path, 'wb') as f:
            f.write(self.key)
        print(f"Key created and saved to {path}")
            
    def load_key(self, path):
        # Load an existing encryption key from the specified path
        with open(path, 'rb') as f:
            self.key = f.read()
        print(f"Key loaded from {path}")
            
    def create_password_file(self, path, initial_values=None):
        # Create a new password file and optionally initialize it with given values
        self.password_file = path
        if initial_values is not None:
            with open(path, 'w') as f:
                for key, value in initial_values.items():
                    # Encrypt each password and write it to the file
                    encrypted = Fernet(self.key).encrypt(value.encode())
                    f.write(key + ":" + encrypted.decode() + "\n")
                    self.password_dict[key] = value
        print(f"Password file created at {path}")
            
    def load_password(self, path):
        # Load passwords from an existing password file
        self.password_file = path
        with open(path, 'r') as f:
            for line in f:
                site, encrypted = line.strip().split(":")
                # Decrypt each password and store it in the dictionary
                self.password_dict[site] = Fernet(self.key).decrypt(encrypted.encode()).decode()
        print(f"Passwords loaded from {path}")

    def add_password(self, site, password):
        # Add a new password for the specified site
        self.password_dict[site] = password
        if self.password_file is not None:
            with open(self.password_file, 'a') as f:
                # Encrypt the password and append it to the password file
                encrypted = Fernet(self.key).encrypt(password.encode())
                f.write(site + ":" + encrypted.decode() + "\n")
        print(f"Password for {site} added.")
    
    def get_password(self, site):
        # Retrieve the password for the specified site, if it exists
        return self.password_dict.get(site, f"No password found for {site}")
    
def main():
    # Initial set of passwords
    passwords = {
        "email": "123456",
        "instagram" : "instamoney123",
        "youtube" : "ytpassword",
        "something" : "bigpassword_123"
    }
                         
    pm = PasswordManager()
    
    print("""What would you like to do?
        (1) Create a new key
        (2) Load an existing key
        (3) Create new password file
        (4) Load existing password file
        (5) Add a new password
        (6) Get a password
        (q) Quit
        """)

    done = False

    while not done:
        choice = input("Enter your choice: ")
        if choice == "1":
            # Create a new key and save it to the specified path
            path = input("Enter path: ")
            pm.create_key(path)
        elif choice == "2":
            # Load an existing key from the specified path
            path = input("Enter path: ")
            pm.load_key(path)
        elif choice == "3":
            # Create a new password file and initialize it with the given passwords
            path = input("Enter path: ")
            pm.create_password_file(path, passwords)
        elif choice == "4":
            # Load passwords from an existing password file
            path = input("Enter path: ")
            pm.load_password(path)
        elif choice == "5":
            # Add a new password for a specified site
            site = input("Enter the site: ")
            password = input("Enter the password: ")
            pm.add_password(site, password)
        elif choice == "6":
            # Retrieve and print the password for a specified site
            site = input("What site do you want: ")
            print(f"Password for {site} is {pm.get_password(site)}")
        elif choice == "q":
            # Quit the program
            done = True
            print("Bye")
        else:
            # Handle invalid choices
            print("Invalid Choice!")
                
if __name__ == "__main__":
    main()