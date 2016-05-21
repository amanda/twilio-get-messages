from flask import Flask, request, render_template
import os
import psycopg2
import urlparse
import cgi

app = Flask(__name__)

# global postgres stuff eep
urlparse.uses_netloc.append("postgres")
url = urlparse.urlparse(os.environ["DATABASE_URL"])
conn = psycopg2.connect(
    database=url.path[1:],
    user=url.username,
    password=url.password,
    host=url.hostname,
    port=url.port
)


@app.route('/', methods=['POST'])
def get_text_body():
    """route that the twilio api POSTs to with text messages"""
    body = request.values.get('Body', None)
    print body
    # write message to the DB
    cur = conn.cursor()
    try:
        cur.execute("INSERT INTO bigf.texts (message) VALUES (%s)", [body])
        conn.commit()
    except Exception as e:
        print e
    return str(body)

@app.route('/raw', methods=['GET'])
def raw_file():
    """route to get raw text for sending to the voicebox"""
    # select all from DB, return raw period-separated text to curl
    cur = conn.cursor()
    cur.execute("SELECT texts.message FROM bigf.texts")
    records = ' '.join([r[0] + '.' for r in cur.fetchall()])
    print records
    return records

@app.route("/messages", methods=['GET'])
def get_messages():
    """route to display messages in a pretty way for the audience"""
    cur = conn.cursor()
    cur.execute("SELECT texts.message FROM bigf.texts")
    records = [r[0] for r in cur.fetchall()]
    print records
    return render_template('messages.html', msgs=records)

@app.route("/test", methods=['GET'])
    return render_template('messages.html', msgs=["cat", "candy", "a much longer thing a much longer thing a
    much longer thing a much longer thing"])

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
