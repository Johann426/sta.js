
import webbrowser
from threading import Timer
from flask import Flask, request, render_template, jsonify

app = Flask(__name__,template_folder="templates")

@app.route('/') 
def index(): 
    return render_template('index.html')

# @app.route('/users/<username>')
# def get_user(username):
#     return username
 
# @app.route('/posts/<int:post_id>')
# def get_post(post_id):
#     return str(post_id)
 
# @app.route('/uuid/<uuid:uuid>')
# def get_uuid(uuid):
#     return str(uuid)

@app.route('/process', methods=['POST']) 
def process(): 
    data = request.get_json() # retrieve the data sent from JavaScript 
    # process the data using Python code 
    result = data['value'] * 2
    return jsonify(result=result) # return the result to JavaScript 

port = 5000
url = "http://127.0.0.1:{0}".format(port)

if __name__ == '__main__': 
    Timer(0.5, lambda: webbrowser.open(url) ).start()
    app.run(port=port, debug=True)
    
