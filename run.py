from flask import Flask, request, render_template
import os
import psycopg2
import urlparse
import cgi
import time

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
        epoch_ms_precision = float(int(time.time() * 1000)) / 1000;
        cur.execute("INSERT INTO bigf.texts (message, create_time) VALUES (%s, to_timestamp(%s))", [body, epoch_ms_precision]);
        conn.commit()
    except Exception as e:
        print e
    return str(body)

@app.route('/raw', methods=['GET'], defaults={'from_time': None, 'to_time': None})
@app.route('/raw/<from_time>', methods=['GET'])
@app.route('/raw/<from_time>/<to_time>', methods=['GET'])
def raw_file(from_time=None, to_time=None):
    """route to get raw text for sending to the voicebox"""
    cur = conn.cursor()
    if from_time and to_time:
        cur.execute("SELECT texts.message FROM bigf.texts WHERE texts.create_time > to_timestamp(%s) AND \
                texts.create_time < to_timestamp(%s)", [from_time, to_time])
    elif from_time:
        cur.execute("SELECT texts.message FROM bigf.texts WHERE texts.create_time > to_timestamp(%s)", [from_time])
    else:
        cur.execute("SELECT texts.message FROM bigf.texts")

    records = [r[0] for r in cur.fetchall()]
    output = '. '.join(records)
    print output
    return output

@app.route("/messages/", methods=['GET'])
def get_messages():
    """route to display messages in a pretty way for the audience"""
    return render_template('messages.html')

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
