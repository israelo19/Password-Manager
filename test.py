from flask import Flask # importing Flask

app = Flask(__name__) # Creating a Flask object 

@app.route('/') # This is telling Flask to run the hello_world function when '/' URL is accessed
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__': # This makes sure the application runs only when the script is excucted directly
    app.run()