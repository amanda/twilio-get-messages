from flask import Flask, request, render_template
import os

app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def get_text_body():
    body = request.values.get('Body', None)
    print body
    return str(body)

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
