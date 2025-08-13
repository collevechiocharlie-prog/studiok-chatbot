# main.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

# --- This part is the same as before ---
API_KEY = "AIzaSyAoiQCwQCN0p3gTDAiP7ZCI08NQ0HPtrA0"
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')
# -----------------------------------------

app = Flask(__name__)
CORS(app)  # Allows our webpage to talk to this server

# This is our new "endpoint". The webpage will send messages here.
@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_message = request.json['message']

        prompt = f"""
        You are a helpful and friendly customer support assistant for "studiok," a fashion retailer.
        Your knowledge base is: "Our policy for a shrunken item is to first ask the customer if they followed the care instructions on the label. If they did, we offer a one-time exchange for the same item in the correct size. The customer must have a receipt."

        Now, answer the following customer question based ONLY on that knowledge.
        Customer Question: "{user_message}"
        """

        print(f"Received message: {user_message}")

        response = model.generate_content(prompt)

        # Send the AI's response back to the webpage
        return jsonify({'reply': response.text})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'reply': 'Sorry, something went wrong on my end.'}), 500

if __name__ == '__main__':
    app.run(port=5000)