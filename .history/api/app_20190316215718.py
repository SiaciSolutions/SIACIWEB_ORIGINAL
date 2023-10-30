from flask import Flask, render_template, make_response, request, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from bson.json_util import dumps
from bson import json_util
import datetime
import time
from datetime import timedelta
import os
from bson.objectid import ObjectId
# from socketIO_client import SocketIO, LoggingNamespace
import coneccion
import sqlanydb
# import arrow


app = Flask(__name__)
CORS(app)


app = Flask(__name__)
app.secret_key = 'santiago 2019 rep0rt3r14.!'
CORS(app)

urlfile = 'http://' + coneccion.ip + ':' + coneccion.puerto + '/images/'

@app.route('/reporte', methods=['POST'])
def reporte():
  datos = request.json
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  

  campos = 'idfactura,fechaemision,estadodocumento,descripcionerror,FechaAutorizacion,claveacceso,codigodocumento'
  arrcampos = campos.split(',')
  arrcampos.append('pdf')
  arrcampos.append('xml')
  sql = """
  select idfactura,fechaemision,estadodocumento,descripcionerror,FechaAutorizacion,claveacceso,codigodocumento from factura_electronica 
  where identificacioncomprador='{}' 
  union 
  select idnotacredito,fechaemision,estadodocumento,descripcionerror,FechaAutorizacion,claveacceso,codigodocumento from nota_credito_electronica
  where identificacioncomprador='{}' 
  union
  select idretencion,fechaemision,estadodocumento,descripcionerror,FechaAutorizacion,claveacceso,codigodocumento from  retencion_electronica
  where identificacionproveedor='{}' 
   """.format(datos['ruc'],datos['ruc'],datos['ruc'])
  
  # select idguia,iniciotraslado,estadodocumento,fintraslado,placa,claveacceso,codigodocumento from  v_guia_electronica
  # where ructransportista='{}'
  curs = conn.cursor()
  curs.execute(sql)
  regs = curs.fetchall()
  resp = []
  for reg in regs:
    d = dict(zip(arrcampos,reg))
    try:
      d['pdf'] = urlfile + d['claveacceso'] + '.pdf'
      d['xml'] = urlfile + d['claveacceso'] + '.xml'
      d['fechaa'] = d['FechaAutorizacion']
    except Exception as e:
      pass
    del d['FechaAutorizacion']
    d['fecha'] = d['fechaemision']
    del d['fechaemision']
    d['clave'] = d['claveacceso']
    del d['claveacceso']
    if d['codigodocumento'] == '01':
      d['tipodoc'] = 'factura'
    elif d['codigodocumento'] == '04':
      d['tipodoc'] = 'nota de crédito'
    elif d['codigodocumento'] == '07':
      d['tipodoc'] = 'retención'
    del d['codigodocumento']
    if d['estadodocumento'] == 'AUTORIZADO':
      d['estado'] = True
    else:
      d['estado'] = False
    resp.append(d)
  curs.close()
  
  sqlguia = """select idguia,iniciotraslado,estadodocumento,fintraslado,placa,claveacceso,codigodocumento from  v_guia_electronica
  where ructransportista='{}'""".format(datos['ruc'])
  curs = conn.cursor()
  curs.execute(sqlguia)
  regs = curs.fetchall()
  # resp = []
  for reg in regs:
    d = dict(zip(arrcampos,reg))
    try:
      d['pdf'] = urlfile + d['claveacceso'] + '.pdf'
      d['xml'] = urlfile + d['claveacceso'] + '.xml'
      d['fechaa'] = d['FechaAutorizacion']
    except Exception as e:
      pass
    del d['FechaAutorizacion']
    d['fecha'] = d['fechaemision']
    del d['fechaemision']
    d['clave'] = d['claveacceso']
    del d['claveacceso']
    d['tipodoc'] = 'guía de remisión'
    del d['codigodocumento']
    resp.append(d)

  conn.close()
  response = make_response(dumps(resp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)

@app.route('/images/<imagename>')
def images(imagename):
    imagename = imagename.replace("*","/")
    return send_from_directory(coneccion.imagenes, imagename)


if __name__ == "__main__":
    app.config['SESSION_TYPE'] = 'memcached'
    app.run(host='0.0.0.0', port=5000)
    # app.run(debug=True, host='0.0.0.0', port=8000)

