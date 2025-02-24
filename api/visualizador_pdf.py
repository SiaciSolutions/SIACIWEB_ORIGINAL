from flask import Flask, render_template, make_response, request, send_from_directory, jsonify, json 
# from flask_cors import CORS
import os
# from flask_twisted import Twisted
app = Flask(__name__)
app.secret_key = 'santiago 2019 rep0rt3r14.!'
# CORS(app)
# twisted = Twisted(app)


APP_PATH = os.getcwd()


@app.route('/pdf/<ruta>/<file>', methods=['GET'])
def pdf(ruta,file):
    print ("VER PDFFFFFFFFF")
    print (ruta)
    print (file)
    PATH_PDF=ruta.replace("_","/")
    return send_from_directory(PATH_PDF,file+'.pdf')
  


if __name__ == "__main__":
    app.config['SESSION_TYPE'] = 'memcached'
    # app.run(host='0.0.0.0', port=5000)
    app.run(debug=True, host='0.0.0.0', port=8002)
	# app.config['SESSION_TYPE'] = 'memcached'
	# PUERTO_EXE = '8002'

    # app.run(host='0.0.0.0',debug=True,threaded=True, port=PUERTO_EXE)
