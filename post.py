import requests
import json

base_url = "http://127.0.0.1:5000"

def post_request(endpoint, data):
    try:
        response = requests.post(f"{base_url}/{endpoint}", json=data)
        response.raise_for_status()  # Raise HTTPError for bad responses
        try:
            json_response = response.json()
            print(json_response)
        except json.decoder.JSONDecodeError:
            print("Response content is not in JSON format:", response.text)
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except Exception as err:
        print(f"Other error occurred: {err}")

# Create Key
post_request("create_key", {"path": "keyfile.key"})

# Load Key
post_request("load_key", {"path": "keyfile.key"})

# Create Password File
post_request("create_password_file", {
    "path": "passwordfile.txt",
    "initial_values": {
        "email": "123456",
        "instagram": "instamoney123",
        "youtube": "ytpassword",
        "something": "bigpassword_123"
    }
})

# Load Password
post_request("load_password", {"path": "passwordfile.txt"})

# Add Password
post_request("add_password", {"site": "newsite", "password": "newpassword123"})

# Get Password
post_request("get_password", {"site": "email"})
