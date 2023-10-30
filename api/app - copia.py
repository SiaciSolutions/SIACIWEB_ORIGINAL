from flask import Flask, render_template, make_response, request, send_from_directory, jsonify, json 
from flask_cors import CORS
# from flask_twisted import Twisted
from pymongo import MongoClient
from bson.json_util import dumps
from bson import json_util
import datetime
import time
from time import sleep
# from datetime import timedelta
from datetime import datetime, date, timedelta
import os
import re
import sqlite3
from bson.objectid import ObjectId
# from socketIO_client import SocketIO, LoggingNamespace
import coneccion
import sqlanydb
# import arrow
from zipfile import ZipFile
import enviar_correo as correo
import gen_pdf_pedidos as pdf
APP_PATH = os.getcwd()
from flaskthreads import AppContextThread
from werkzeug import secure_filename
import shutil
import glob
from dbfpy3 import dbf

# C:\wamp\www\TEST_acople_webfe_PEDIDO_PDV_TALLERES\src\assets\img_talleres\ORD_12345



# app = Flask(__name__)
# CORS(app)


app = Flask(__name__)
app.secret_key = 'santiago 2019 rep0rt3r14.!'
CORS(app)
# twisted = Twisted(app)


APP_PATH = os.getcwd()
DB_PATH = APP_PATH+ '\\base_siaci_web.db'

urlfile = 'http://' + coneccion.ip + ':' + coneccion.puerto + '/images/'
urlzip = 'http://' + coneccion.ip + ':' + coneccion.puerto + '/azip/'
urlmail = 'http://' + coneccion.ip + ':' + coneccion.puerto + '/mail/'

# app.config['UPLOAD_FOLDER'] = '/../src/assets/img_talleres/ORD_12345'
# app.config['UPLOAD_FOLDER'] = APP_PATH+'\\img_talleres'

################################### SIRVIOOOOO  #################################################################
# app.config['UPLOAD_FOLDER'] = 'C:\\wamp\\www\\TEST_acople_webfe_PEDIDO_PDV_TALLERES\\src\\assets\\img_talleres'
app.config['UPLOAD_FOLDER'] = APP_PATH+'\\img_talleres_desa'
app.config['UPLOAD_FOLDER_ARTICULOS'] = APP_PATH+'\\img_articulos'


# nginx-1.14.2\html\assets\
# \img_talleres\ORD_12345
# app.config['UPLOAD_FOLDER'] = './nginx-1.14.2/html/assets/img_subidas'
# \subida\src\assets\img_subidas


############################## SQLLITE ##################
@app.route('/consulta_citas', methods=['POST'])	
def consulta_citas():
		
	sql = ''' SELECT * FROM CITAS '''
	con_sql3 = sqlite3.connect(DB_PATH)
	cursor = con_sql3.cursor()
	dev = []
	campos = ['ID','EXAMEN_TIPO','title','start','end']
	try:
		cursor.execute(sql)
	except Exception as e:
		print ('######## SELECT A TABLA CITAS FALLIDA POR EL SIGUIENTE ERROR #########')
		print (e)
		con_sql3.close()
	
	for row in cursor.fetchall():
		row_header = dict(zip(campos, row))
		# print (row_header)
		dev.append(row_header)
		print (row)
	
	
	cursor.close()
	con_sql3.close()
	
	# result = jsonify({"msg": "procesado","status":"ok"})
	result = jsonify(dev)
	

	
	return result



def convert_decimal(d):
	print ("ESTOY EN CONVERT")
	total_pedido = str(format(d,",.2f")).replace(',',' ')
	total_pedido = str(total_pedido).replace('.',',')
	total_pedido = str(total_pedido).replace(' ','.')
	total_pedido = str(total_pedido).replace(',00','')
	return total_pedido


@app.route('/login', methods=['POST'])
def login():
  d = request.json
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  print (d)
  campos = ['codus1', 'clausu','tipacc','nomemp','geoloc','punto_venta','correo_ped_cli','correo_fact','edit_ped','act_caja_reg','act_calendario',
  'act_ing_bod','act_talleres','act_clientes','act_pedidos','act_whatsapp','act_notif_auto_fac','act_retenciones_pdv','act_abrir_cierre_caja',
  'act_total_recibido_cambio','act_selecc_articulo_servicio_pdv','act_pago_efectivo_pdv','act_pago_tarjeta_pdv','act_pago_cheque_pdv','act_pago_trans_pdv',
  'act_pago_credito_pdv','act_edicion_plazo_credito_pdv','consultar_estado_cartera','act_articulos','act_servicios','act_egr_bod','busqueda_defecto_pdv','servicio_defecto_pdv']
  
  sql = "select u.codus1,u.clausu,u.tipacc,e.nomemp,u.codemp from usuario u, empresa e where u.codemp=e.codemp and u.codus1='{}' and u.clausu='{}' and u.codemp='{}'".format(d['usuario'],d['password'],d['empresa'])
  curs.execute(sql)
  print (sql)
  print ("GEOLOCALIZACION ACTIVA= "+coneccion.GEOLOC)
  print ("PUNTO DE VENTA ACTIVO= "+coneccion.PUNTO_VENTA)
  print ("ENVIAR_CORREO_PEDIDO_CLIENTE ACTIVO= "+coneccion.ENVIAR_CORREO_PEDIDO_CLIENTE)
  print ("ENVIAR_CORREO_FACTURACION ACTIVO= "+coneccion.ENVIAR_CORREO_FACTURACION)
  print ("EDITAR_PEDIDO ACTIVO= "+coneccion.EDITAR_PEDIDO)

  r = curs.fetchone()
  if (coneccion.CONF_PARAM_BD == 'NO'):
     if r:
       reg=(r[0],r[1],r[2],r[3],coneccion.GEOLOC,coneccion.PUNTO_VENTA,coneccion.ENVIAR_CORREO_PEDIDO_CLIENTE,coneccion.ENVIAR_CORREO_FACTURACION,coneccion.EDITAR_PEDIDO,
	   coneccion.ACTIVAR_CAJA_REG,coneccion.ACTIVAR_CALENDARIO,coneccion.ACTIVAR_ING_BODEGA,coneccion.ACTIVAR_TALLERES,coneccion.ACTIVAR_CLIENTES,coneccion.ACTIVAR_PEDIDOS,
	   coneccion.ACTIVAR_WHATSAPP,coneccion.ACTIVAR_NOTIF_AUTO_FAC_WS,coneccion.ACTIVAR_RETENCIONES_PDV,coneccion.ACTIVAR_ABRIR_CIERRE_CAJA,coneccion.ACTIVAR_TOTAL_RECIBIDO_CAMBIO,
	   coneccion.ACTIVAR_SELECC_ARTICULO_SERVICIO_PDV,coneccion.ACTIVAR_PAGO_EFECTIVO_PDV,coneccion.ACTIVAR_PAGO_TARJETA_PDV,coneccion.ACTIVAR_PAGO_CHEQUE_PDV,
	   coneccion.ACTIVAR_PAGO_TRANS_PDV,coneccion.ACTIVAR_PAGO_CREDITO_PDV,coneccion.ACTIVAR_EDICION_PLAZO_CREDITO,coneccion.CONSULTAR_ESTADO_CARTERA,coneccion.ACTIVAR_ARTICULO,
	   coneccion.ACTIVAR_SERVICIO,coneccion.ACTIVAR_EGR_BODEGA,coneccion.TIPO_BUSQUEDA_DEFECTO,coneccion.SERVICIO_DEFECTO_PDV)
       d = dict(zip(campos, reg))
     else:
       d = {'codus1': False}
  if (coneccion.CONF_PARAM_BD == 'SI'):
    if r:
       sql = "SELECT parametro,valor,clave_json FROM parametros_siaciweb where codemp='{}'".format(d['empresa'])
       curs.execute(sql)
       print (sql)
       campos = ['codus1', 'clausu','tipacc','nomemp']
       valores = [r[0],r[1],r[2],r[3]]
       regs = curs.fetchall()
       for params in regs:
           campos.append(params[2])
           valores.append(params[1])
       tuple(valores)
       d = dict(zip(campos, valores))
       print (d)
    else:
       d = {'codus1': False} 

  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/status_caja', methods=['POST'])
def status_caja():
  d = request.json
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos = ['tipo_caja','fecdoc','hora','almacen','nomalm', 'caja','turno','serie']
  # sql = "SELECT tipo_caja, fecdoc,hora,codalm,codcierre,turno FROM cierre_caja where codusu = '{}' and codemp = '{}' and codigo=(select max(codigo) from cierre_caja)".format(d['usuario'],d['codemp'])
  
  # sql = """ SELECT c.tipo_caja, c.fecdoc,c.hora,c.codalm, (select a1.nomalm from almacenes a1 where a1.codalm=c.codalm and a1.codemp=c.codemp) as nomalm ,c.codcierre,c.turno,
  # (select a2.serie_factura from almacenes a2 where a2.codalm=c.codalm and a2.codemp=c.codemp) as serie
  # FROM cierre_caja c where c.codusu = '{}' and c.codemp = '{}' and c.codigo=(select max(c1.codigo) from cierre_caja c1 where c1.codusu=c.codusu) """.format(d['usuario'],d['codemp'])
  
  
  sql = """  SELECT c.tipo_caja, c.fecdoc,c.hora,c.codalm, (select a1.nomalm from almacenes a1 where a1.codalm=c.codalm and a1.codemp=c.codemp) as nomalm ,c.codcierre,c.turno,
  (select a2.serie_factura from almacenes a2 where a2.codalm=c.codalm and a2.codemp=c.codemp) as serie
  FROM cierre_caja c where c.codusu = '{}' and c.codemp = '{}'
  and c.codigo=(select max(c1.codigo) from cierre_caja c1 where c1.codusu=c.codusu and 
  c1.codcierre= (SELECT CODCAJA FROM "DBA"."vendedorescob" v where v.codus1=c.codusu  AND v.CODEMP=c.codemp ) 
  and c1.codemp=c.codemp) """.format(d['usuario'],d['codemp'])
  
  

  curs.execute(sql)
  
  print (sql)
  r = curs.fetchone()
  # len(r)
  if (r):
      print("SALIDA")
      print (r)
      reg=(r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7])
      d = dict(zip(campos, reg))
  else:
      print("SALIDA en 0")
      reg=('C','C','C','C','C','C','C','C')
      d = dict(zip(campos, reg))

  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
# @app.route('/retenciones/<codemp>/<tipo>')
# def retenciones(codemp, tipo):
@app.route('/retenciones',methods=['POST'])
def retenciones():
  d = request.json
  print ("DENTRO DE RETENCIONES")
  print (d)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  sql_campos = 'codret,nomret,porret'
  string_campos = 'codret,nomret,porret'
  arr_campos = string_campos.split(',') 
  sql = "select {} from retenciones_codigos where codemp='{}' and tipo='{}' and porret not in (SELECT poriva FROM iva where codiva in ('S','A') and descripcion like 'IVA%' )".format(sql_campos, d['codemp'], d['tipo'])
  curs = conn.cursor()
  curs.execute(sql)
  regs = curs.fetchall()
  curs.close()
  curs.close()
  conn.close()
  resp = []
  for r in regs:
    d = dict(zip(arr_campos, r))
    resp.append(d)
  response = make_response(dumps(resp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
# @app.route('/bancos/<codemp>')
# def bancos(codemp):
@app.route('/bancos',methods=['POST'])
def bancos():
  d = request.json
  print ("DENTRO DE BANCOS")
  print (d)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  sql_campos = 'codban,nomban'
  string_campos = 'codban,nomban'
  arr_campos = string_campos.split(',') 
  sql = "select {} from bancos where codemp='{}' ".format(sql_campos, d['codemp'])
  curs = conn.cursor()
  curs.execute(sql)
  regs = curs.fetchall()
  curs.close()
  curs.close()
  conn.close()
  resp = []
  for r in regs:
    d = dict(zip(arr_campos, r))
    resp.append(d)
  response = make_response(dumps(resp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)

# @app.route('/tarjetascredito/<codemp>')
@app.route('/tarjetascredito',methods=['POST'])
def tarjetascredito():
  d = request.json
  print ("DENTRO DE BANCOS")
  print (d)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  sql_campos = 'codtar,nomtar'
  string_campos = 'codtar,nomtar'
  arr_campos = string_campos.split(',') 
  sql = "select {} from tarjetascredito where codemp='{}' ".format(sql_campos, d['codemp'])
  curs = conn.cursor()
  curs.execute(sql)
  regs = curs.fetchall()
  curs.close()
  curs.close()
  conn.close()
  resp = []
  for r in regs:
    d = dict(zip(arr_campos, r))
    resp.append(d)
  response = make_response(dumps(resp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
  

@app.route('/cuentas_bancarias',methods=['POST'])
def cuentas_bancarias():
  d = request.json
  print ("DENTRO DE CUENTAS BANCARIAS")
  print (d)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  sql_campos = 'numcta,nomcta'
  string_campos = 'coddep,banco'
  arr_campos = string_campos.split(',') 
  sql = "select {} from ctacorriente where codemp='{}' ".format(sql_campos, d['codemp'])
  curs = conn.cursor()
  curs.execute(sql)
  regs = curs.fetchall()
  curs.close()
  curs.close()
  conn.close()
  resp = []
  for r in regs:
    d = dict(zip(arr_campos, r))
    resp.append(d)
  response = make_response(dumps(resp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
  
@app.route('/unidades',methods=['POST'])
def unidades():
  d = request.json
  print ("########### DENTRO UNIDADES  ########")
  print (d)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  # sql_campos = 'coduni,nomuni'
  # string_campos = 'coduni,coduni'
  # arr_campos = string_campos.split(',') 
  arr_campos = ['coduni','nomuni']
  sql = "select coduni,nomuni from unidades where codemp='{}' ".format(d['codemp'])
  curs = conn.cursor()
  curs.execute(sql)
  regs = curs.fetchall()

  resp = []
  for r in regs:
    d = dict(zip(arr_campos, r))
    resp.append(d)
  curs.close()
  conn.close()
  response = make_response(dumps(resp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)


@app.route('/empresas', methods=['GET'])
def empresas():
  print (coneccion.uid)
  print (coneccion.pwd)
  print (coneccion.eng)
  print (coneccion.host)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)

  curs = conn.cursor()
  campos = ['codemp', 'nomemp']
  sql = "select codemp, nomemp from empresa"
  curs.execute(sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    d = dict(zip(campos, r))
    arrresp.append(d)
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/iva', methods=['GET'])
def iva():
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos = ['codiva', 'poriva']
  sql = "SELECT codiva,poriva FROM iva where codiva in ('S','O','N','E') and descripcion = 'IVA' "
  curs.execute(sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    d = dict(zip(campos, r))
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/ciudad', methods=['POST'])
def ciudad():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos = ['codemp', 'codgeo','nomgeo']
  sql = "select codemp,codgeo,nomgeo from nom_locgeo where codemp='01' and tipo=3".format(datos['codemp'])
  curs.execute(sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    d = dict(zip(campos, r))
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/paises', methods=['POST'])
def paises():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos = ['codemp', 'codgeo','nomgeo']
  sql = "select codemp,codgeo,nomgeo from nom_locgeo where codemp='{}' and tipo=6 order by nomgeo asc".format(datos['codemp'])
  curs.execute(sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    d = dict(zip(campos, r))
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/vendedores', methods=['POST'])
def vendedores():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  
  ####  Para validar si el usuario contiene un registro de vendedor asosiado ####
  sql = """ SELECT VALOR FROM "DBA"."parametros_siaciweb" where codemp='{}' and parametro='CAMBIO_VENDEDOR_PED'
  """.format(datos['codemp'])
  curs.execute(sql)
  r = curs.fetchone()
  if r:
    valor=r[0]
  else:
    valor='SI'
  
  if (valor == 'SI'):
     campos = ['codven','nomven']
     sql = """SELECT codven,nomven FROM vendedorescob where codemp='{}'""".format(datos['codemp'])
     curs.execute(sql)
     regs = curs.fetchall()
     arrresp = []
     for r in regs:
       d = dict(zip(campos, r))
       arrresp.append(d)
  #### SI ES "NO", TOMARA EL VENDEDOR DEL USUARIO ###
  if (valor == 'NO'):
     campos = ['codven','nomven']
     sql = """SELECT codven,nomven FROM vendedorescob where codemp='{}' and codus1='{}'""".format(datos['codemp'],datos['usuario'])
     curs.execute(sql)
     regs = curs.fetchall()
     arrresp = []
     for r in regs:
       d = dict(zip(campos, r))
       arrresp.append(d)

  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/get_prec_product', methods=['POST'])
def get_prec_product():
  datos = request.json
  print ('ENTRADAAAAA GET PRODUCT')
  print (datos)
  
  # round((p.totnet+iva_cantidad),2)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  # campos = ['prec1', 'prec2','prec3','prec4','prec5']
  campos = ['prec']
  sql = "SELECT  round(prec01,2),round(prec02,2),round(prec03,2),round(prec04,2),round(prec05,2) FROM articulos WHERE codemp = '{}' and codart = '{}'".format(datos['codemp'],datos['codart'])
  curs.execute(sql)
  print (sql)
  regs = curs.fetchone()
  arrresp = []
  arrresp2 = []
  print (regs)
  
  # T = (10,20,30,40,50)
  for element in regs:
      print (regs.index(element),element)
      j= {"prec":element}
      arrresp.append(j)
   
  print (arrresp)
  
  sql = "SELECT precio FROM precio_cliente where codemp= '{}' and codart= '{}' and codcli = '{}' and tipo = 'P' order by lispre asc".format(datos['codemp'],datos['codart'],datos['codcli'])
  curs = conn.cursor()
  curs.execute(sql)
  regs2 = curs.fetchall()
  print (sql)
  
  if (regs2):
     print("LISTA DE PRECIO SEGUN POLITICA DEL CLIENTE")
     arrresp = []
     for r in regs2:
         print (r)
         j= {"prec":r[0]}
         arrresp.append(j)
  print (arrresp)

         # arrresp.append(d)
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  # response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/get_prec_servicio', methods=['POST'])
def get_prec_servicio():
  datos = request.json
  print ('ENTRADAAAAA GET SERVICIO')
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos = ['prec01', 'prec02','prec03','prec04']
  sql = "SELECT preser,preser2,preser3,(CASE WHEN preser4 is null THEN 0 ELSE preser4 END) as preser4 FROM serviciosvarios WHERE codemp = '{}' and codser = '{}'".format(datos['codemp'],datos['codart'])
  curs.execute(sql)
  print (sql)
  regs = curs.fetchone()
  arrresp = []
  arrresp2 = []
  print (regs)
  
  # T = (10,20,30,40,50)
  for element in regs:
      print (regs.index(element),element)
      j= {"prec":element}
      arrresp.append(j)
   
  print (arrresp)
  
  sql = "SELECT precio FROM precio_cliente where codemp= '{}' and codart= '{}' and codcli = '{}' and tipo = 'S' order by lispre asc".format(datos['codemp'],datos['codart'],datos['codcli'])
  curs = conn.cursor()
  curs.execute(sql)
  regs2 = curs.fetchall()
  print (sql)
  
  if (regs2):
     print("LISTA DE PRECIO SEGUN POLITICA DEL CLIENTE")
     arrresp = []
     for r in regs2:
         print (r)
         j= {"prec":r[0]}
         arrresp.append(j)
  print (arrresp)
  # regs = curs.fetchall()
  # arrresp = []
  # for r in regs:
    # d = dict(zip(campos, r))
    # arrresp.append(d)
  
  # d = {'codus1': False}
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  # response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/cosulta_sucursales', methods=['POST'])
def cosulta_sucursales():
  datos = request.json
  print ('ENTRADAAAAA GET SUCURSALES')
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos = ['id_agencia','tipo_agencia', 'nomcli','dir_agencia','ruta']
  sql = """ SELECT ac.id_agencia,(CASE WHEN ac.tipo_agencia = 'P' THEN 'PRINCIPAL' WHEN ac.tipo_agencia = 'S' THEN 'SUCURSAL' END) as tipo_agencia,
            ac.nomcli,ac.dir_agencia, (select ru.descripcion from ruta ru where ru.codemp= ac.empresa and trim(ru.codruta)=ac.idruta )as ruta 
            FROM agencia_cliente ac where ac.codcli  = '{}' and ac.empresa = '{}' order by ac.tipo_agencia asc """.format(datos['codcli'],datos['codemp'])
  curs.execute(sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    d = dict(zip(campos, r))
    arrresp.append(d)
  
  # d = {'codus1': False}
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  # response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/update_dato_sucursal', methods=['POST'])
def update_dato_sucursal():
  datos = request.json
  print ('ENTRADAAAAA UPDATE SUCURSALES')
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  
  if (datos['dato'] == 'D'):
      sql = "update agencia_cliente set dir_agencia = '{}' where id_agencia = {}".format(datos['dir_agencia'],datos['id_agencia'])
      print (sql)
      curs.execute(sql)
      conn.commit()
  if (datos['dato'] == 'R'):
      sql = "update agencia_cliente set idruta = '{}' where id_agencia = {}".format(datos['idruta'],datos['id_agencia'])
      print (sql)
      curs.execute(sql)
      conn.commit()  
  

  d = {'Resultado': 'Exitoso'}
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/get_encabezado_pedido', methods=['POST'])  
def get_encabezado_pedido():
		
	datos = request.json
	print (datos)
	codemp=datos['codemp']
	numtra=datos['pedido']
	codusl=datos['usuario']
	conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
	curs = conn.cursor()
	
	# SELECT p.numtra,DATEFORMAT(p.fectra, 'DD-MM-YYYY') as fectra , DATEFORMAT(p.fecult, 'DD-MM-YYYY') as fecult ,c.rucced,c.nombres,c.dircli,c.codcli,c.telcli,c.email,p.observ,p.totnet,p.iva_cantidad,p.codusu,p.ciucli,
	
	sql = """
	SELECT p.numtra,fectra, p.fecult,c.rucced,c.nombres,c.dircli,c.codcli,c.telcli,c.email,p.observ,p.totnet,p.iva_cantidad,p.codusu,p.ciucli,
	(SELECT nomven FROM vendedorescob v where v.codus1='{}' and v.codemp='{}'), 
	round((p.totnet+iva_cantidad),2) as total_pedido, p.codven
	FROM encabezadopedpro p, clientes c
	where p.numtra = '{}' and p.tiptra = 1 and p.codemp='{}'
	and p.codcli=c.codcli
	""".format(codusl,codemp,numtra,codemp)
	curs.execute(sql)
	print (sql)
	r = curs.fetchone()

	
	campos = ['num_pedido', 'fectra','fecult','identificacion','cliente','direccion','codcli','telefono','email','observ','totnet','iva_cantidad','codusu','ciucli','nomven','total_pedido','codven']
	print (r)
	if r:
		# reg = (r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],r[9],convert_decimal(r[10]),convert_decimal(r[11]),r[12],r[13],r[14],convert_decimal(r[15]))
		# d = dict(zip(campos, reg))
		d = dict(zip(campos, r))
    # arrresp.append(d)
		
		# d = dict(zip(campos, r))
	else:
		d = {'codus1': False}
	response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
	response.headers['content-type'] = 'application/json'
	# return(response)


	conn.close()
	
	return(response)

@app.route('/get_renglones_pedido', methods=['POST'])  
def get_renglones_pedido():
		
	datos = request.json
	print (datos)
	codemp=datos['codemp']
	numtra=datos['pedido']
	codusl=datos['usuario']
	conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
	curs = conn.cursor()
	
	sql = """
	SELECT codart,nomart, isnull(coduni,'N/A'),codiva,
	round (cantid,2) as cantid,
	preuni,
	(select i.poriva from iva i where i.codiva=r.codiva) as poriva,
	round (((totren*poriva)/100),2) as cant_iva,
	totren,desren,num_docs,
	round((((desren*preuni)/100) * cantid),2) as des_cant 
	FROM renglonespedpro r
	where numtra='{}' and codemp='{}' and tiptra=1 order by numren asc
	""".format(numtra,codemp)
	curs.execute(sql)
	r = curs.fetchall()
	campos = ['codart','nomart','coduni','codiva','cantid','preuni','poriva','cant_iva','totren','desren','num_docs','des_cant']
	renglones_pedido = []
	for reg in r:
	   # print (reg)
	   # reg_encabezado = dict(zip(campos, reg))
	   # renglones_pedido.append(reg_encabezado)
		print ("LO QUE VIENE DE LA BASE DE DATOS")
		# print (reg)
		# row_db = [reg[0],reg[1],reg[2],reg[3],convert_decimal(reg[4]),convert_decimal(reg[5]),reg[6],convert_decimal(reg[7]),convert_decimal(reg[8]),convert_decimal(reg[9]),reg[10],convert_decimal(reg[11])]
		# reg = (reg[0],reg[1],reg[2],reg[3],convert_decimal(reg[4]),convert_decimal(reg[5]),reg[6],convert_decimal(reg[7]),convert_decimal(reg[8]),convert_decimal(reg[9]),reg[10],convert_decimal(reg[11]))
		# print (row_db)
		print (reg)
		# row = (row_db[0],row_db[1],row_db[2],row_db[3],row_db[4],row_db[5],row_db[6],row_db[7],row_db[8],row_db[9],row_db[10],row_db[11],row_db[12])
		reg_encabezado = dict(zip(campos, reg))
		renglones_pedido.append(reg_encabezado)
	print (renglones_pedido) 
	conn.close()
	
	return (jsonify(renglones_pedido))
  
  
# @app.route('/get_encabezado_pedido', methods=['POST'])  
# def get_encabezado_pedido():
		
	# datos = request.json
	# print (datos)
	# codemp=datos['codemp']
	# numtra=datos['pedido']
	# codusl=datos['usuario']
	# conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
	# curs = conn.cursor()
	
	
	# sql = """
	# SELECT p.numtra,DATEFORMAT(p.fectra, 'DD-MM-YYYY') as fectra , DATEFORMAT(p.fecult, 'DD-MM-YYYY') as fecult ,c.rucced,c.nombres,c.dircli,c.codcli,c.telcli,c.email,p.observ,p.totnet,p.iva_cantidad,p.codusu,p.ciucli,
	# (SELECT nomven FROM vendedorescob v, usuario u where v.codus1 = u.codus1 and v.codusu = u.codusu and u.codus1='{}' and u.codemp='{}'), 
	# round((p.totnet+iva_cantidad),2) as total_pedido
	# FROM encabezadopedpro p, clientes c
	# where p.numtra = '{}' and p.tiptra = 1 and p.codemp='{}'
	# and p.codcli=c.codcli
	# """.format(codusl,codemp,numtra,codemp)
	# curs.execute(sql)
	# r = curs.fetchone()
	
	# campos = ['num_pedido', 'fectra','fecult','identificacion','cliente','direccion','codcli','telefono','email','observ','totnet','iva_cantidad','codusu','ciucli','nomven','total_pedido']
	# print (r)
	# if r:
		# reg = (r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],r[9],convert_decimal(r[10]),convert_decimal(r[11]),r[12],r[13],r[14],convert_decimal(r[15]))
		# d = dict(zip(campos, reg))
    # # arrresp.append(d)
		
		# # d = dict(zip(campos, r))
	# else:
		# d = {'codus1': False}
	# response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
	# response.headers['content-type'] = 'application/json'
	# # return(response)

	# conn.close()
	
	# return(response) 
	
	
# @app.route('/get_renglones_pedido', methods=['POST'])  
# def get_renglones_pedido():
		
	# datos = request.json
	# print (datos)
	# codemp=datos['codemp']
	# numtra=datos['pedido']
	# codusl=datos['usuario']
	# conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
	# curs = conn.cursor()
	
	# sql = """
	# SELECT codart,nomart, coduni,codiva,
	# round (cantid,2) as cantid,
	# preuni,
	# (select i.poriva from iva i where i.codiva=r.codiva) as poriva,
	# round (((totren*poriva)/100),2) as cant_iva,
	# totren,desren,num_docs,
	# round((((desren*preuni)/100) * cantid),2) as des_cant 
	# FROM renglonespedpro r
	# where numtra='{}' and codemp='{}' and tiptra=1 order by numren asc
	# """.format(numtra,codemp)
	# curs.execute(sql)
	# r = curs.fetchall()
	# campos = ['codart','nomart','coduni','codiva','cantid','preuni','poriva','cant_iva','totren','desren','num_docs','des_cant']
	# renglones_pedido = []
	# for reg in r:
	   # # print (reg)
	   # # reg_encabezado = dict(zip(campos, reg))
	   # # renglones_pedido.append(reg_encabezado)
		# print ("LO QUE VIENE DE LA BASE DE DATOS")
		# print (reg)
		# row_db = [reg[0],reg[1],reg[2],reg[3],convert_decimal(reg[4]),convert_decimal(reg[5]),reg[6],convert_decimal(reg[7]),convert_decimal(reg[8]),convert_decimal(reg[9]),reg[10],convert_decimal(reg[11])]
		# reg = (reg[0],reg[1],reg[2],reg[3],convert_decimal(reg[4]),convert_decimal(reg[5]),reg[6],convert_decimal(reg[7]),convert_decimal(reg[8]),convert_decimal(reg[9]),reg[10],convert_decimal(reg[11]))
		# print (row_db)
		# print (reg)
		# # row = (row_db[0],row_db[1],row_db[2],row_db[3],row_db[4],row_db[5],row_db[6],row_db[7],row_db[8],row_db[9],row_db[10],row_db[11],row_db[12])
		# reg_encabezado = dict(zip(campos, reg))
		# renglones_pedido.append(reg_encabezado)
	# print (renglones_pedido) 
	# conn.close()
	
	# return (jsonify(renglones_pedido))
	
	
@app.route('/get_encabezado_orden', methods=['POST'])  
def get_encabezado_orden():
		
	datos = request.json
	print (datos)
	codemp=datos['codemp']
	numtra=datos['numtra']
	codusl=datos['usuario']
	conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
	curs = conn.cursor()
	
	
	sql = """
	SELECT p.numtra,p.codven,DATEFORMAT(p.fectra, 'DD-MM-YYYY') as fectra , DATEFORMAT(p.fecult, 'DD-MM-YYYY') as fecult ,c.rucced,c.nombres,c.dircli,c.codcli,c.telcli,c.email,p.observ,p.totnet,p.iva_cantidad,p.codusu,p.ciucli,
	(SELECT nomven FROM vendedorescob v, usuario u where v.codus1 = u.codus1 and v.codusu = u.codusu and u.codus1='{}' and u.codemp='{}'), 
	round((p.totnet+iva_cantidad),2) as total_pedido,
	c.tpIdCliente
	FROM encabezadopedpro p, clientes c
	where p.numtra = '{}' and p.tiptra = 7 and p.codemp='{}'
	and p.codcli=c.codcli
	""".format(codusl,codemp,numtra,codemp)
	curs.execute(sql)
	r = curs.fetchone()
	
	# print (num_pedido,fectra,identificacion,cliente,direccion,telefono,email,observ,totnet,iva_cantidad,codusu,ciucli,nomven,total_pedido)
	
	campos = ['num_pedido', 'codven','fectra','fecult','identificacion','cliente','direccion','codcli','telefono','email','observ','totnet','iva_cantidad','codusu','ciucli','nomven','total_pedido','tpIdCliente']
	print (r)
	if r:
		# reg = (r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],r[9],convert_decimal(r[10]),convert_decimal(r[11]),r[12],r[13],r[14],convert_decimal(r[15]),r[16])
		reg = (r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],r[9],r[10],r[11],r[12],r[13],r[14],r[15],r[16],r[17])
		d = dict(zip(campos, reg))
    # arrresp.append(d)
		
		# d = dict(zip(campos, r))
	else:
		d = {'codus1': False}
	response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
	response.headers['content-type'] = 'application/json'
	conn.close()
	
	return(response) 
	
	
@app.route('/get_renglones_orden', methods=['POST'])  
def get_renglones_orden():
		
	datos = request.json
	print (datos)
	codemp=datos['codemp']
	numtra=datos['numtra']
	codusl=datos['usuario']
	conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
	curs = conn.cursor()
	
	sql = """
	SELECT codart,nomart, coduni,codiva,
	round (cantid,2) as cantid,
	preuni,
	(select i.poriva from iva i where i.codiva=r.codiva) as poriva,
	round (((totren*poriva)/100),2) as cant_iva,
	totren,desren,num_docs,
	round((((desren*preuni)/100) * cantid),2) as des_cant 
	FROM renglonespedpro r
	where numtra='{}' and codemp='{}' and tiptra=7 order by numren asc
	""".format(numtra,codemp)
	curs.execute(sql)
	print (sql)
	r = curs.fetchall()
	campos = ['codart','nomart','coduni','codiva','cantid','preuni','poriva','cant_iva','totren','desren','num_docs','des_cant']
	renglones_pedido = []
	for reg in r:
	   # print (reg)
	   # reg_encabezado = dict(zip(campos, reg))
	   # renglones_pedido.append(reg_encabezado)
		print ("LO QUE VIENE DE LA BASE DE DATOS")
		print (reg)
		# row_db = [reg[0],reg[1],reg[2],reg[3],convert_decimal(reg[4]),convert_decimal(reg[5]),reg[6],convert_decimal(reg[7]),convert_decimal(reg[8]),convert_decimal(reg[9]),reg[10],convert_decimal(reg[11])]
		# reg = (reg[0],reg[1],reg[2],reg[3],convert_decimal(reg[4]),convert_decimal(reg[5]),reg[6],convert_decimal(reg[7]),convert_decimal(reg[8]),convert_decimal(reg[9]),reg[10],convert_decimal(reg[11]))
		# print (row_db)
		print (reg)
		# row = (row_db[0],row_db[1],row_db[2],row_db[3],row_db[4],row_db[5],row_db[6],row_db[7],row_db[8],row_db[9],row_db[10],row_db[11],row_db[12])
		reg_encabezado = dict(zip(campos, reg))
		renglones_pedido.append(reg_encabezado)
	print (renglones_pedido) 
	conn.close()
	
	return (jsonify(renglones_pedido))

############## CON RUTAS DE GUADAPRODUCT
# @app.route('/lista_pedidos', methods=['POST'])
# def lista_pedidos():
  # datos = request.json
  # print ('ENTRADAAAAA')
  # print (datos) 
  # conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  # curs = conn.cursor()

  # # codven = ''
    # # ##PARA OBTENER CODIGO DE VENDEDOR
  # # if (datos["tipacc"] != 'T'):
      # # sql = "SELECT v.codven, v.nomven,u.tipacc,u.nomusu FROM vendedorescob v, usuario u where v.codus1 = u.codus1 and v.codusu = u.codusu and u.codus1='{}' and u.codemp='{}'"\
            # # .format(datos['usuario'],datos['codemp'])
      # # curs.execute(sql)
      # # r = curs.fetchone()
      # # codven = r[0]
      # # nomven = r[1]
      # # tipacc = r[2]
      # # nomusu = r[3]
      # # print ("COD VENDEDOR")
      # # print (codven)
      # # print ("TIPO ACCION")
      # # print (tipacc)
      # # print ("NOMUSU")
      # # print (nomusu)

  # # campos = ['numtra', 'codcli','fectra','nomcli','observ','totnet','iva_cantidad','estado','total_iva','status']
  
  # campos = ['numtra', 'codcli','nomusu','fectra','nomcli','observ','total_iva','status','email','fecha_entrega','hora_entrega','direccion_entrega','ruta','idruta','id_agencia']
  
# ####QUERY SIN CONSULTAR RUTAS   #################  
  # # if (datos["tipacc"] == 'T'):
      # # sql = "SELECT p.numtra,p.codcli,p.codusu,DATEFORMAT(p.fectra, 'DD-MM-YYYY') as fectra,c.nomcli, p.observ,round((p.totnet+p.iva_cantidad),2) as total_iva, (CASE WHEN estado = \'P\' THEN \'EMITIDO\' WHEN estado = \'A\' THEN \'ANULADO\' WHEN estado = \'S\' THEN \'PROCESADO\' WHEN estado = \'F\' THEN \'FACTURADO\'WHEN estado = \'E\' THEN \'EN ESPERA\' WHEN estado = \'C\' THEN \'COMPRADA\' ELSE \'STATUS_NO_ENCONTRADO\' END) AS status, c.email FROM encabezadopedpro p, clientes c where p.tiptra=1 and p.codemp='{}' and p.codemp = c.codemp and p.codcli = c.codcli and codalm=\'01\' and estado=\'P\' order by p.fectra desc".format(datos['codemp'])
  # # else:
      # # sql = "SELECT p.numtra,p.codcli,p.codusu,DATEFORMAT(p.fectra, 'DD-MM-YYYY') as fectra,c.nomcli, p.observ,round((p.totnet+p.iva_cantidad),2) as total_iva, (CASE WHEN estado = \'P\' THEN \'EMITIDO\' WHEN estado = \'A\' THEN \'ANULADO\' WHEN estado = \'S\' THEN \'PROCESADO\' WHEN estado = \'F\' THEN \'FACTURADO\'WHEN estado = \'E\' THEN \'EN ESPERA\' WHEN estado = \'C\' THEN \'COMPRADA\' ELSE \'STATUS_NO_ENCONTRADO\' END) AS status, c.email FROM encabezadopedpro p, clientes c where p.tiptra=1 and p.codemp='{}' and p.codusu='{}' and p.codemp = c.codemp and p.codcli = c.codcli and codalm=\'01\' and estado=\'P\' order by p.fectra desc".format(datos['codemp'],datos['usuario'])

# ####QUERY CONSULTANDO RUTAS GUADAPRODUC ################# 
  # datos["tipacc"] = 'T'
 
  # if (datos["tipacc"] == 'T'):
      # # sql = "SELECT p.numtra,p.codcli,p.codusu,DATEFORMAT(p.fectra, 'DD-MM-YYYY') as fectra,c.nomcli, p.observ,round((p.totnet+p.iva_cantidad),2) as total_iva, (CASE WHEN estado = \'P\' THEN \'EMITIDO\' WHEN estado = \'A\' THEN \'ANULADO\' WHEN estado = \'S\' THEN \'PROCESADO\' WHEN estado = \'F\' THEN \'FACTURADO\'WHEN estado = \'E\' THEN \'EN ESPERA\' WHEN estado = \'C\' THEN \'COMPRADA\' ELSE \'STATUS_NO_ENCONTRADO\' END) AS status, c.email FROM encabezadopedpro p, clientes c where p.tiptra=1 and p.codemp='{}' and p.codemp = c.codemp and p.codcli = c.codcli and codalm=\'01\' and estado=\'P\' order by p.fectra desc".format(datos['codemp'])
      
	  # sql = """ SELECT top 500 p.numtra,p.codcli,p.codusu,
			# DATEFORMAT(p.fectra, 'DD-MM-YYYY') as fectra,c.nomcli,
			# p.observ,round((p.totnet+p.iva_cantidad),2) as total_iva,
			# (CASE WHEN estado = 'P' THEN 'EMITIDO' WHEN estado = 'A' THEN 'ANULADO' WHEN estado = 'S' THEN 'PROCESADO' WHEN estado = 'F' THEN 'FACTURADO'WHEN estado = 'E' THEN 'EN ESPERA' WHEN estado = 'C' THEN 'COMPRADA' ELSE 'STATUS_NO_ENCONTRADO' END) AS status,
			# c.email, DATEFORMAT(pr.fecha_entrega, 'DD-MM-YYYY'),CONVERT(VARCHAR, pr.hora_entrega, 108),dir_agencia,r.descripcion,pr.idruta,a.id_agencia
			# FROM encabezadopedpro p, clientes c, pedido_ruta pr, agencia_cliente a, ruta r
			# where p.tiptra=1 and p.codemp='{}' 
			# and pr.idruta = trim(r.codruta)
		# --	and a.idruta = trim(r.codruta) 
			# and p.codemp=r.codemp
			# and p.codemp = c.codemp 
			# and p.codcli = c.codcli 
			# and codalm='01' 
			# and estado <>'A' 
			# and pr.numtra_pedido = p.numtra
			# and a.empresa = p.codemp
			# and a.codcli = p.codcli
			# and a.id_agencia = pr.id_agencia
			# order by p.fectra desc
        # """.format(datos['codemp'])
  
  # else:
      # # sql = "SELECT p.numtra,p.codcli,p.codusu,DATEFORMAT(p.fectra, 'DD-MM-YYYY') as fectra,c.nomcli, p.observ,round((p.totnet+p.iva_cantidad),2) as total_iva, (CASE WHEN estado = \'P\' THEN \'EMITIDO\' WHEN estado = \'A\' THEN \'ANULADO\' WHEN estado = \'S\' THEN \'PROCESADO\' WHEN estado = \'F\' THEN \'FACTURADO\'WHEN estado = \'E\' THEN \'EN ESPERA\' WHEN estado = \'C\' THEN \'COMPRADA\' ELSE \'STATUS_NO_ENCONTRADO\' END) AS status, c.email FROM encabezadopedpro p, clientes c where p.tiptra=1 and p.codemp='{}' and p.codusu='{}' and p.codemp = c.codemp and p.codcli = c.codcli and codalm=\'01\' and estado=\'P\' order by p.fectra desc".format(datos['codemp'],datos['usuario'])
	  
      # sql = """ SELECT p.numtra,p.codcli,p.codusu,
		# DATEFORMAT(p.fectra, 'DD-MM-YYYY') as fectra,c.nomcli,
		# p.observ,round((p.totnet+p.iva_cantidad),2) as total_iva,
		# (CASE WHEN estado = 'P' THEN 'EMITIDO' WHEN estado = 'A' THEN 'ANULADO' WHEN estado = 'S' THEN 'PROCESADO' WHEN estado = 'F' THEN 'FACTURADO'WHEN estado = 'E' THEN 'EN ESPERA' WHEN estado = 'C' THEN 'COMPRADA' ELSE 'STATUS_NO_ENCONTRADO' END) AS status,
		# c.email, DATEFORMAT(pr.fecha_entrega, 'DD-MM-YYYY'),CONVERT(VARCHAR, pr.hora_entrega, 108),dir_agencia,r.descripcion,pr.idruta,a.id_agencia
		# FROM encabezadopedpro p, clientes c, pedido_ruta pr, agencia_cliente a, ruta r
		# where p.tiptra=1 and p.codemp='{}' and p.codusu='{}'
		# and pr.idruta = trim(r.codruta)
	# --	and a.idruta = trim(r.codruta) 
		# and p.codemp=r.codemp
		# and p.codemp = c.codemp 
		# and p.codcli = c.codcli 
		# and codalm='01' 
		# and estado='P' 
		# and pr.numtra_pedido = p.numtra
		# and a.empresa = p.codemp
		# and a.codcli = p.codcli
		# and a.id_agencia = pr.id_agencia
		# order by p.fectra desc
	# """.format(datos['codemp'],datos['usuario'])
   
  
  # curs.execute(sql)
  # print (sql)
  # regs = curs.fetchall()
  # arrresp = []
  # # arr_up = []
  # for r in regs:
    # # print (r)
    # reg = (r[0],r[1],r[2],r[3],r[4],r[5],convert_decimal(r[6]),r[7],r[8],r[9],r[10],r[11],r[12],r[13],r[14])
    # d = dict(zip(campos, reg))
    # arrresp.append(d)
    # # arr_up.append(arrresp)

  # # arr_up = []
  # print("CERRANDO SESION SIACI")
  # # print(arrresp)
  # curs.close()
  # conn.close()
  # return (jsonify(arrresp))
  
@app.route('/lista_pedidos', methods=['POST'])
def lista_pedidos():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos) 
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos = ['numtra', 'codcli','nomusu','fectra','nomcli','observ','totnet','status','email']

  sql = """ SELECT p.numtra,p.codcli,p.codusu,DATEFORMAT(p.fectra, 'DD-MM-YYYY') as fectra,c.nomcli,
  p.observ,round((p.totnet+p.iva_cantidad),2) as total_iva, 
  (CASE WHEN estado = 'P' THEN 'EMITIDO' 
  WHEN estado = 'A' THEN 'ANULADO' WHEN estado = 'S' THEN 'PROCESADO' WHEN estado = 'F' 
  THEN 'FACTURADO'WHEN estado = 'E' THEN 'EN ESPERA' WHEN estado = 'C' THEN 'COMPRADA'  WHEN estado = 'I' THEN 'SOLICITADO'
  ELSE 'STATUS_NO_ENCONTRADO' END) AS status,
  c.email 
  FROM encabezadopedpro p, clientes c where p.tiptra=1 and p.codemp='{}'
  and p.fectra between '{}' and '{}' and p.codusu='{}'
  and p.codemp = c.codemp and p.codcli = c.codcli and codalm='01'  and estado <> 'A' order by p.fectra desc""".format(datos['codemp'],datos['fecha_desde'],datos['fecha_hasta'],datos['usuario'])
  # and p.codemp = c.codemp and p.codcli = c.codcli and codalm='01' and estado='P' order by p.fectra desc""".format(datos['codemp'])

  curs.execute(sql)
  print (sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    d = dict(zip(campos, r))
    print(arrresp)
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  # print(arrresp)
  curs.close()
  conn.close()

  return (jsonify(arrresp))
  
@app.route('/lista_ordenes', methods=['POST'])
def lista_ordenes():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos) 
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()

  # codven = ''
    # ##PARA OBTENER CODIGO DE VENDEDOR
  # if (datos["tipacc"] != 'T'):
      # sql = "SELECT v.codven, v.nomven,u.tipacc,u.nomusu FROM vendedorescob v, usuario u where v.codus1 = u.codus1 and v.codusu = u.codusu and u.codus1='{}' and u.codemp='{}'"\
            # .format(datos['usuario'],datos['codemp'])
      # curs.execute(sql)
      # r = curs.fetchone()
      # codven = r[0]
      # nomven = r[1]
      # tipacc = r[2]
      # nomusu = r[3]
      # print ("COD VENDEDOR")
      # print (codven)
      # print ("TIPO ACCION")
      # print (tipacc)
      # print ("NOMUSU")
      # print (nomusu)

  # campos = ['numtra', 'codcli','fectra','nomcli','observ','totnet','iva_cantidad','estado','total_iva','status']
  
  campos = ['numtra', 'codcli','nomusu','fectra','nomcli','observ','total_iva','status','email','marca','modelo','placa']
  
  sql = """ SELECT p.numtra,p.codcli,p.codusu,
		DATEFORMAT(p.fectra, 'DD-MM-YYYY') as fectra,c.nomcli,
		p.observ,round((p.totnet+p.iva_cantidad),2) as total_iva,
		(CASE WHEN estado = 'P' THEN 'EMITIDO' WHEN estado = 'I' THEN 'INICIADA' WHEN estado = 'A' THEN 'ANULADO' WHEN estado = 'S' THEN 'PROCESADO' WHEN estado = 'F' THEN 'FACTURADO'WHEN estado = 'E' THEN 'EN ESPERA' WHEN estado = 'C' THEN 'COMPRADA' ELSE 'STATUS_NO_ENCONTRADO' END) AS status,
		c.email,
        (SELECT marca FROM ADICIONALES where codart = p.numtra and codemp = p.codemp ) as marca,
        (SELECT modelo FROM ADICIONALES where codart = p.numtra and codemp = p.codemp) as modelo,
		(SELECT torque FROM ADICIONALES where codart = p.numtra and codemp = p.codemp) as placa
		FROM encabezadopedpro p, clientes c
		where p.tiptra=7 and p.codemp='{}' 
		and p.codemp = c.codemp 
		and p.codcli = c.codcli 
		and p.codalm='01' 
	--	and estado='P' 
		order by p.numtra desc
	""".format(datos['codemp'])
	
  # SELECT * FROM "DBA"."ADICIONALES"
   
  
  curs.execute(sql)
  print (sql)
  regs = curs.fetchall()
  arrresp = []
  # arr_up = []
  for r in regs:
    print (r)
    # reg = (r[0],r[1],r[2],r[3],r[4],r[5],convert_decimal(r[6]),r[7],r[8],r[9],r[10],r[11],r[12],r[13],r[14])
	# reg = (r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8])
    d = dict(zip(campos, r))
    arrresp.append(d)
    # arr_up.append(arrresp)

  # arr_up = []
  print("CERRANDO SESION SIACI")
  # print(arrresp)
  curs.close()
  conn.close()

  return (jsonify(arrresp))
  

@app.route('/lista_visitas', methods=['POST'])
def lista_visitas():
  datos = request.json
  print ('ENTRADAAAAA LISTA VISITAS')
  print (datos) 
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos = ['fectra', 'hora','codven','nomven','codcli','nomcli','direccion','latitud','longitud']
  
    ##PARA OBTENER CODIGO DE VENDEDOR
  sql = "SELECT v.fectra,replace(v.hora,'.000',''),v.codven,v.nomven, v.codcli,v.nomcli,v.direccion,v.latitud,v.longitud FROM registro_visita v where v.codusu='{}' and v.codemp='{}'"\
        .format(datos['usuario'],datos['codemp'])
  curs.execute(sql)
  regs = curs.fetchall()
  arrresp = []
  # arr_up = []
  for r in regs:
    # print (r)
    # reg = (r[0],r[1],r[2],r[3],r[4],convert_decimal(r[5]),r[6],r[7])
    d = dict(zip(campos, r))
    arrresp.append(d)
    # arr_up.append(arrresp)

  # arr_up = []
  print("CERRANDO SESION SIACI")
  # print(arrresp)
  curs.close()
  conn.close()

  return (jsonify(arrresp))


  
  
@app.route('/articulos', methods=['POST'])
def articulos():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos = ['codart', 'nomart','prec01','exiact','coduni','punreo','codiva','poriva','precio_iva']
  # sql = "select codart, nomart, round(prec01, 2), (exiact-(select case when sum(cantid) is null then 0 else sum(cantid) end  as sum from v_exitencias_pedpro where codemp = '{}' and codart like '%{}%')) as exiact,coduni,punreo,codiva  from articulos where (nomart like '%{}%' or codart like '%{}%') and codemp = '{}' order by nomart asc".format(datos['codemp'],datos['nomart'],datos['nomart'],datos['nomart'],datos['codemp'])
  
  ############ COMENTADO PARA GUADAPRODUC, PARA QUE LE SELECT DE LA FICHA DE ARTICULO ################ 
  # sql = "select a.codart, a.nomart, round(a.prec01, 2) as precio01, (a.exiact-(select case when sum(p.cantid) is null then 0 else sum(p.cantid) end  as sum from v_exitencias_pedpro p where p.codemp = '{}' and p.codart like '%'||a.codart||'%'))  as exiact,a.coduni,a.punreo,a.codiva, (select i.poriva from iva i where i.codiva=a.codiva) as poriva , round(((poriva*precio01)/100),2) as precio_iva from articulos a where (a.nomart like '%{}%' or a.codart like '%{}%') and a.codemp = '{}' order by a.nomart asc".format(datos['codemp'],datos['nomart'],datos['nomart'],datos['codemp'])
  sql = "select a.codart, a.nomart, round(prec01,2), (a.exiact-(select case when sum(p.cantid) is null then 0 else sum(p.cantid) end  as sum from v_exitencias_pedpro p where p.codemp = '{}' and p.codart like a.codart||'%'))  as exiact,a.coduni,a.punreo,a.codiva, (select i.poriva from iva i where i.codiva=a.codiva) as poriva , round(((poriva*prec01)/100),2) as precio_iva from articulos a where (a.nomart like '%{}%' or a.codart like '%{}%') and a.codemp = '{}' order by a.nomart asc".format(datos['codemp'],datos['nomart'],datos['nomart'],datos['codemp'])
  curs.execute(sql)
  print (sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    codart = r[0]
    print (codart)
    sql2 = "SELECT precio FROM precio_cliente where codemp= '{}' and codart= '{}' and codcli = '{}' and tipo = 'P' and lispre = 1".format(datos['codemp'],codart,datos['codcli'])
    curs.execute(sql2)
    print (sql2)
    regs2 = curs.fetchone()
    if (regs2):
        print ("PRECIO POLITICA CLIENTE")
        # (poriva*precio01)/100
        precio_iva_new = round((r[7]*regs2[0])/100,2)
        r = (r[0],r[1],regs2[0],r[3],r[4],r[5],r[6],r[7],precio_iva_new)
    else:
        print ("PRECIO FICHA ARTICULO")
    d = dict(zip(campos, r))
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/articulos_ingresos_san_jose', methods=['POST'])
def articulos_ingresos_san_jose():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos = ['codart', 'nomart','prec01','exiact','coduni','punreo','codiva','poriva','precio_iva','cospro','maneja_serie']
  # sql = "select codart, nomart, round(prec01, 2), (exiact-(select case when sum(cantid) is null then 0 else sum(cantid) end  as sum from v_exitencias_pedpro where codemp = '{}' and codart like '%{}%')) as exiact,coduni,punreo,codiva  from articulos where (nomart like '%{}%' or codart like '%{}%') and codemp = '{}' order by nomart asc".format(datos['codemp'],datos['nomart'],datos['nomart'],datos['nomart'],datos['codemp'])
  
  # PARA PRODUCTO MATERIA PRIMA
  sql = """select a.codart, a.nomart, prec01, 0 as exiact ,a.coduni,a.punreo,a.codiva, (select i.poriva from iva i where i.codiva=a.codiva) as poriva , 
  round(((poriva*cospro)/100),2) as precio_iva, cospro,codgrupo from articulos a, renglonesordcom r
  where (a.nomart like '%{}%' or a.codart like '%{}%' 
  or a.codart = (select codart from v_articulos where codalterno = '{}')) and codcla in (select codcla from clasesarticulos where tipo in ('I','M'))
  and a.codemp = '{}' 
  and r.codemp = a.codemp
  and r.codart = a.codart
  and r.numtra = '{}'
  order by a.nomart asc""".format(datos['nomart'],datos['nomart'],datos['nomart'],datos['codemp'],datos['numtra'])
  
  
  
  if (datos['nombre_almacen'] == 'Producto terminado'):
  
    sql = """select a.codart, a.nomart, prec01, 0 as exiact,a.coduni,a.punreo,a.codiva, 
  (select i.poriva from iva i where i.codiva=a.codiva) as poriva , round(((poriva*cospro)/100),2) as precio_iva, 
  cospro,codgrupo from articulos a , renglonespedpro r
  where (a.nomart like '%{}%' or a.codart like '%{}%' 
  or a.codart = (select codart from v_articulos where codalterno = '{}')) 
  and codcla in (select codcla from clasesarticulos where tipo in ('T'))
  and a.codemp = '{}' and r.codemp = a.codemp
  and r.codart = a.codart
  and r.numtra = '{}'
  order by a.nomart asc""".format(datos['nomart'],datos['nomart'],datos['nomart'],datos['codemp'],datos['numtra'])
  
  curs.execute(sql)
  print (sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    # codart = r[0]
    # print (codart)
    # sql2 = "SELECT precio FROM precio_cliente where codemp= '{}' and codart= '{}' and codcli = '{}' and tipo = 'P' and lispre = 1".format(datos['codemp'],codart,datos['codcli'])
    # curs.execute(sql2)
    # print (sql2)
    # regs2 = curs.fetchone()
    # if (regs2):
        # print ("PRECIO POLITICA CLIENTE")
        # # (poriva*precio01)/100
        # precio_iva_new = round((r[7]*regs2[0])/100,2)
        # r = (r[0],r[1],regs2[0],r[3],r[4],r[5],r[6],r[7],precio_iva_new)
    # else:
        # print ("PRECIO FICHA ARTICULO")
    d = dict(zip(campos, r))
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
  
@app.route('/articulos_ingresos', methods=['POST'])
def articulos_ingresos():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos = ['codart', 'nomart','prec01','exiact','coduni','punreo','codiva','poriva','precio_iva','cospro','maneja_serie']
  # sql = "select codart, nomart, round(prec01, 2), (exiact-(select case when sum(cantid) is null then 0 else sum(cantid) end  as sum from v_exitencias_pedpro where codemp = '{}' and codart like '%{}%')) as exiact,coduni,punreo,codiva  from articulos where (nomart like '%{}%' or codart like '%{}%') and codemp = '{}' order by nomart asc".format(datos['codemp'],datos['nomart'],datos['nomart'],datos['nomart'],datos['codemp'])
  
  # PARA PRODUCTO MATERIA PRIMA
  sql = """select a.codart, a.nomart, prec01, 0 as exiact ,a.coduni,a.punreo,a.codiva, 
     (select i.poriva from iva i where i.codiva=a.codiva) as poriva , 
     round(((poriva*cospro)/100),2) as precio_iva, cospro,codgrupo from articulos a
     where (a.nomart like '%{}%' or a.codart like '%{}%' 
     or a.codart = (select codart from v_articulos where codalterno = '{}'))
     and a.codemp = '{}' 
     order by a.nomart asc""".format(datos['nomart'],datos['nomart'],datos['nomart'],datos['codemp'])
  
  
  
  # if (datos['nombre_almacen'] == 'Producto terminado'):
  
    # sql = """select a.codart, a.nomart, prec01, 0 as exiact,a.coduni,a.punreo,a.codiva, 
  # (select i.poriva from iva i where i.codiva=a.codiva) as poriva , round(((poriva*cospro)/100),2) as precio_iva, 
  # cospro,codgrupo from articulos a , renglonespedpro r
  # where (a.nomart like '%{}%' or a.codart like '%{}%' 
  # or a.codart = (select codart from v_articulos where codalterno = '{}')) 
  # and codcla in (select codcla from clasesarticulos where tipo in ('T'))
  # and a.codemp = '{}' and r.codemp = a.codemp
  # and r.codart = a.codart
  # and r.numtra = '{}'
  # order by a.nomart asc""".format(datos['nomart'],datos['nomart'],datos['nomart'],datos['codemp'],datos['numtra'])
  
  curs.execute(sql)
  print (sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    # codart = r[0]
    # print (codart)
    # sql2 = "SELECT precio FROM precio_cliente where codemp= '{}' and codart= '{}' and codcli = '{}' and tipo = 'P' and lispre = 1".format(datos['codemp'],codart,datos['codcli'])
    # curs.execute(sql2)
    # print (sql2)
    # regs2 = curs.fetchone()
    # if (regs2):
        # print ("PRECIO POLITICA CLIENTE")
        # # (poriva*precio01)/100
        # precio_iva_new = round((r[7]*regs2[0])/100,2)
        # r = (r[0],r[1],regs2[0],r[3],r[4],r[5],r[6],r[7],precio_iva_new)
    # else:
        # print ("PRECIO FICHA ARTICULO")
    d = dict(zip(campos, r))
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
  
# @app.route('/articulos_egresos_san_jose', methods=['POST'])
# def articulos_egresos_san_jose():
  # datos = request.json
  # print (datos)
  # conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  # curs = conn.cursor()
  # campos = ['codart', 'nomart','prec01','exiact','coduni','punreo','codiva','poriva','precio_iva','cospro','maneja_serie']
 
  # sql = """select a.codart, a.nomart, prec01, 0 as exiact,a.coduni,a.punreo,a.codiva, 
  # (select i.poriva from iva i where i.codiva=a.codiva) as poriva , round(((poriva*cospro)/100),2) as precio_iva, 
  # cospro,codgrupo from articulos a , renglonespedpro r
  # where (a.nomart like '%{}%' or a.codart like '%{}%' 
  # or a.codart = (select codart from v_articulos where codalterno = '{}')) 
  # and codcla in (select codcla from clasesarticulos where tipo in (''))
  # and a.codemp = '{}' and r.codemp = a.codemp
  # and r.codart = a.codart
  # and r.numtra = '{}'
  # order by a.nomart asc""".format(datos['nomart'],datos['nomart'],datos['nomart'],datos['codemp'],datos['numtra'])
  
  # curs.execute(sql)
  # print (sql)
  # regs = curs.fetchall()
  # arrresp = []
  # for r in regs:
    # # codart = r[0]
    # # print (codart)
    # # sql2 = "SELECT precio FROM precio_cliente where codemp= '{}' and codart= '{}' and codcli = '{}' and tipo = 'P' and lispre = 1".format(datos['codemp'],codart,datos['codcli'])
    # # curs.execute(sql2)
    # # print (sql2)
    # # regs2 = curs.fetchone()
    # # if (regs2):
        # # print ("PRECIO POLITICA CLIENTE")
        # # # (poriva*precio01)/100
        # # precio_iva_new = round((r[7]*regs2[0])/100,2)
        # # r = (r[0],r[1],regs2[0],r[3],r[4],r[5],r[6],r[7],precio_iva_new)
    # # else:
        # # print ("PRECIO FICHA ARTICULO")
    # d = dict(zip(campos, r))
    # arrresp.append(d)

  # print("CERRANDO SESION SIACI")
  # curs.close()
  # conn.close()
  # response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  # response.headers['content-type'] = 'application/json'
  # return(response)
  
  
  
  
@app.route('/articulos_egresos_san_jose', methods=['POST'])
def articulos_egresos_san_jose():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  # campos = ['codemp','numtra','codigo_terminado','desc_terminado','codigo_materia_prima','desc_materia_prima','codigobarras','existencia','maneja_serie','registra_serie','coduni',
  # 'cospro','punreo']
   # (select codgrupo from articulos a where a.codemp = r.codemp and a.codart=r.codart)
    # campos = ['codart', 'nomart','prec01','exiact','coduni','punreo','codiva','poriva','precio_iva','cospro','maneja_serie']
  
  if (datos['nombre_almacen'] == 'Materia prima'):
     campos = ['codemp','numtra','codart','nomart','codigobarras','exiact','maneja_serie','registra_serie','coduni','cospro','punreo']
     # sql = """SELECT vm.*, 
     # (select codgrupo from articulos a where a.codemp = vm.codemp and a.codart=vm.codigo_materia_prima),
     # (select count(*) from serie_articulo s where s.codemp = vm.codemp and s.codart = vm.codigo_materia_prima ) as registra_serie,
     # (select coduni from articulos a where a.codemp = vm.codemp and a.codart=vm.codigo_materia_prima) as coduni,
     # (select cospro from articulos a where a.codemp = vm.codemp and a.codart=vm.codigo_materia_prima) as cospro,
	 # (select punreo from articulos a where a.codemp = vm.codemp and a.codart=vm.codigo_materia_prima) as punreo
     # FROM "DBA"."v_materia_prima_x_orden" vm
     # where 
     # vm.numtra = '{}'
     # and (vm.desc_materia_prima like '%{}%' 
     # or vm.codigo_materia_prima like '%{}%' 
     # or vm.codigobarras = '{}')
     # and vm.codemp = '{}'
     # """.format(datos['numtra'],datos['nomart'],datos['nomart'],datos['nomart'],datos['codemp'])
	 
     sql = """SELECT 
     DISTINCT
     vm.codemp,vm.numtra,vm.codigo_materia_prima,desc_materia_prima,vm.codigobarras,vm.existencia,
     (select codgrupo from articulos a where a.codemp = vm.codemp and a.codart=vm.codigo_materia_prima),
     (select count(*) from serie_articulo s where s.codemp = vm.codemp and s.codart = vm.codigo_materia_prima ) as registra_serie,
     (select coduni from articulos a where a.codemp = vm.codemp and a.codart=vm.codigo_materia_prima) as coduni,
     (select cospro from articulos a where a.codemp = vm.codemp and a.codart=vm.codigo_materia_prima) as cospro,
     (select punreo from articulos a where a.codemp = vm.codemp and a.codart=vm.codigo_materia_prima) as punreo
     FROM "DBA"."v_materia_prima_x_orden" vm
     where
     vm.numtra = '{}'
     and (vm.desc_materia_prima like '%{}%'
     or vm.codigo_materia_prima like '%{}%'
     or vm.codigobarras = '{}')
     and vm.codemp = '{}'
     """.format(datos['numtra'],datos['nomart'],datos['nomart'],datos['nomart'],datos['codemp'])
  
  if (datos['nombre_almacen'] == 'Producto terminado'):
     campos = ['codart', 'nomart','prec01','exiact','coduni','punreo','codiva','poriva','precio_iva','cospro','maneja_serie','registra_serie']

     sql = """select a.codart, a.nomart, prec01, 0 as exiact,a.coduni,a.punreo,a.codiva, 
    (select i.poriva from iva i where i.codiva=a.codiva) as poriva , round(((poriva*cospro)/100),2) as precio_iva, 
     cospro,codgrupo ,(select count(*) from serie_articulo s where s.codemp = a.codemp and s.codart = a.codart ) as registra_serie
	 from articulos a
     where (a.nomart like '%{}%' or a.codart like '%{}%' 
     or a.codart = (select codart from v_articulos where codalterno = '{}')) 
     and codcla in (select codcla from clasesarticulos where tipo in ('T'))
     and a.codemp = '{}'
     order by a.nomart asc""".format(datos['nomart'],datos['nomart'],datos['nomart'],datos['codemp'])
  
  curs.execute(sql)
  print (sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    d = dict(zip(campos, r))
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
 
@app.route('/articulos_egresos_simple', methods=['POST'])
def articulos_egresos_simple():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  # campos = ['codemp','numtra','codigo_terminado','desc_terminado','codigo_materia_prima','desc_materia_prima','codigobarras','existencia','maneja_serie','registra_serie','coduni',
  # 'cospro','punreo']
   # (select codgrupo from articulos a where a.codemp = r.codemp and a.codart=r.codart)
    # campos = ['codart', 'nomart','prec01','exiact','coduni','punreo','codiva','poriva','precio_iva','cospro','maneja_serie']
  
  # if (datos['nombre_almacen'] == 'Materia prima'):
     # campos = ['codemp','numtra','codart','nomart','codigobarras','exiact','maneja_serie','registra_serie','coduni','cospro','punreo']
     # # sql = """SELECT vm.*, 
     # # (select codgrupo from articulos a where a.codemp = vm.codemp and a.codart=vm.codigo_materia_prima),
     # # (select count(*) from serie_articulo s where s.codemp = vm.codemp and s.codart = vm.codigo_materia_prima ) as registra_serie,
     # # (select coduni from articulos a where a.codemp = vm.codemp and a.codart=vm.codigo_materia_prima) as coduni,
     # # (select cospro from articulos a where a.codemp = vm.codemp and a.codart=vm.codigo_materia_prima) as cospro,
	 # # (select punreo from articulos a where a.codemp = vm.codemp and a.codart=vm.codigo_materia_prima) as punreo
     # # FROM "DBA"."v_materia_prima_x_orden" vm
     # # where 
     # # vm.numtra = '{}'
     # # and (vm.desc_materia_prima like '%{}%' 
     # # or vm.codigo_materia_prima like '%{}%' 
     # # or vm.codigobarras = '{}')
     # # and vm.codemp = '{}'
     # # """.format(datos['numtra'],datos['nomart'],datos['nomart'],datos['nomart'],datos['codemp'])
	 
     # sql = """SELECT 
     # DISTINCT
     # vm.codemp,vm.numtra,vm.codigo_materia_prima,desc_materia_prima,vm.codigobarras,vm.existencia,
     # (select codgrupo from articulos a where a.codemp = vm.codemp and a.codart=vm.codigo_materia_prima),
     # (select count(*) from serie_articulo s where s.codemp = vm.codemp and s.codart = vm.codigo_materia_prima ) as registra_serie,
     # (select coduni from articulos a where a.codemp = vm.codemp and a.codart=vm.codigo_materia_prima) as coduni,
     # (select cospro from articulos a where a.codemp = vm.codemp and a.codart=vm.codigo_materia_prima) as cospro,
     # (select punreo from articulos a where a.codemp = vm.codemp and a.codart=vm.codigo_materia_prima) as punreo
     # FROM "DBA"."v_materia_prima_x_orden" vm
     # where
     # vm.numtra = '{}'
     # and (vm.desc_materia_prima like '%{}%'
     # or vm.codigo_materia_prima like '%{}%'
     # or vm.codigobarras = '{}')
     # and vm.codemp = '{}'
     # """.format(datos['numtra'],datos['nomart'],datos['nomart'],datos['nomart'],datos['codemp'])
  
  # if (datos['nombre_almacen'] == 'Producto terminado'):
  
  campos = ['codart', 'nomart','prec01','exiact','coduni','punreo','codiva','poriva','precio_iva','cospro','maneja_serie','registra_serie']
  
  sql = """select a.codart, a.nomart, prec01, 0 as exiact,a.coduni,a.punreo,a.codiva, 
    (select i.poriva from iva i where i.codiva=a.codiva) as poriva , round(((poriva*cospro)/100),2) as precio_iva, 
     cospro,codgrupo ,(select count(*) from serie_articulo s where s.codemp = a.codemp and s.codart = a.codart ) as registra_serie
	 from articulos a
     where (a.nomart like '%{}%' or a.codart like '%{}%' 
     or a.codart = (select codart from v_articulos where codalterno = '{}')) 
     and a.codemp = '{}'
     order by a.nomart asc""".format(datos['nomart'],datos['nomart'],datos['nomart'],datos['codemp'])
  
  curs.execute(sql)
  print (sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    d = dict(zip(campos, r))
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
  
  
@app.route('/valida_serie_articulo', methods=['POST'])
def valida_serie_articulo():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos = ['numfac_org', 'codserie','tipo','codalm','disponible','feccad']
  
  # sql = "select codart, nomart, round(prec01, 2), (exiact-(select case when sum(cantid) is null then 0 else sum(cantid) end  as sum from v_exitencias_pedpro where codemp = '{}' and codart like '%{}%')) as exiact,coduni,punreo,codiva  from articulos where (nomart like '%{}%' or codart like '%{}%') and codemp = '{}' order by nomart asc".format(datos['codemp'],datos['nomart'],datos['nomart'],datos['nomart'],datos['codemp'])
  sql = """select numfac_org,codserie,tipo,codalm,disponible,feccad from serie_articulo 
	where codart='{}' and numserie = '{}' and codemp='{}' and codalm='{}'""".format(datos['codart'],datos['numserie'],datos['codemp'],datos['codalm'])
  
  curs.execute(sql)
  print (sql)
  regs = curs.fetchone()
  d = {'numfac_org':'NO EXISTE'}
  if regs:
     d = dict(zip(campos, regs))


  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/busqueda_orden_produccion', methods=['POST'])
def busqueda_orden_produccion():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  # campos = ['nomcli']
  
  sql = "SELECT (select c.nomcli from clientes c where c.codcli=p.codcli and c.codemp = p.codemp ) FROM encabezadopedpro p WHERE p.codemp = '{}' AND p.tiptra = '3' and p.numtra='{}'".format(datos['codemp'],datos['orden_produccion'])
  curs.execute(sql)
  print (sql)
  regs = curs.fetchone()
  
  if (regs):
    print ("EXISTE ORDEN PRODUCCION")
    print (regs)
    # d = dict(zip(campos, regs[0]))
    d = {'nomcli': regs[0]}
  else:
    print ("NO EXISTE ORDEN PRODUCCION")
    d = {'nomcli': 'NO EXISTE'}
    # d = dict(zip(campos, 'NO EXISTE'))
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)

@app.route('/busqueda_orden_compra', methods=['POST'])
def busqueda_orden_compra():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  # campos = ['nomcli']
  
  sql = "SELECT (select c.nompro from proveedores c where c.codpro=p.codpro and c.codemp = p.codemp ) FROM encabezadoordcom p WHERE p.codemp = '{}' AND p.tiptra = '1' and p.numtra='{}'".format(datos['codemp'],datos['orden_compra'])
  curs.execute(sql)
  print (sql)
  regs = curs.fetchone()
  
  if (regs):
    print ("EXISTE ORDEN PRODUCCION")
    print (regs)
    # d = dict(zip(campos, regs[0]))
    d = {'nompro': regs[0]}
  else:
    print ("NO EXISTE ORDEN COMPRA")
    d = {'nompro': 'NO EXISTE'}
    # d = dict(zip(campos, 'NO EXISTE'))
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)  
  
  
    # if r:
    # d = dict(zip(campos, r))
  # else:
    # d = {'rucced': False}
  # print("CERRANDO SESION SIACI")
  
@app.route('/busqueda_ordenes_compra_pendientes', methods=['POST'])
def busqueda_ordenes_compra_pendientes():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos = ['numtra','nompro','fectra','observ']
  # sql = "select codart, nomart, round(prec01, 2), (exiact-(select case when sum(cantid) is null then 0 else sum(cantid) end  as sum from v_exitencias_pedpro where codemp = '{}' and codart like '%{}%')) as exiact,coduni,punreo,codiva  from articulos where (nomart like '%{}%' or codart like '%{}%') and codemp = '{}' order by nomart asc".format(datos['codemp'],datos['nomart'],datos['nomart'],datos['nomart'],datos['codemp'])

  datos['patron_orden_compra']= '' if datos['patron_orden_compra'] == None else ""+datos['patron_orden_compra']+""
  
  sql = """SELECT oc.numtra,
  (select nompro from proveedores pro where pro.codemp=oc.codemp and pro.codpro= oc.codpro) as nompro,
  oc.fectra, isnull(oc.observ,'NO DISPONIBLE')
  FROM "DBA"."encabezadoordcom" oc where oc.codemp = '{}' and oc.numtra like '%{}%' and oc.tiptra = 1 and oc.estado = 'P'
  and oc.fectra > GETDATE() -30
  order by oc.fectra desc
  """.format(datos['codemp'],datos['patron_orden_compra'])
 
  
  
  curs.execute(sql)
  regs = curs.fetchall()
  arrresp = []
  print (sql)
  for r in regs:
    d = dict(zip(campos, r))
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
# 
@app.route('/busqueda_ordenes_produccion_pendientes', methods=['POST'])
def busqueda_ordenes_produccion_pendientes():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos = ['numtra','clientes','estado']
  # sql = "select codart, nomart, round(prec01, 2), (exiact-(select case when sum(cantid) is null then 0 else sum(cantid) end  as sum from v_exitencias_pedpro where codemp = '{}' and codart like '%{}%')) as exiact,coduni,punreo,codiva  from articulos where (nomart like '%{}%' or codart like '%{}%') and codemp = '{}' order by nomart asc".format(datos['codemp'],datos['nomart'],datos['nomart'],datos['nomart'],datos['codemp'])

  datos['patron_orden_prod']= '' if datos['patron_orden_prod'] == None else ""+datos['patron_orden_prod']+""
  
  if datos['estado_orden'] == None:
     sql = """select op.numtra, (select c.nomcli from clientes c where c.codcli=op.codcli and c.codemp = op.codemp) as clientes,
     op.estado from encabezadopedpro op where op.tiptra=3 and op.codemp='{}' and op.numtra like '%{}%'
     and (select count(*) from detalle_mezcla dm where dm.ordepro = op.numtra and dm.codemp=op.codemp) > 0
	 and (select count(*) from ENCABEZADOPROCESAMIENTO dm where dm.numtra = op.numtra and dm.codemp=op.codemp and estado in ('C','I')) = 0
     """.format(datos['codemp'],datos['patron_orden_prod'])
  else:
     sql = """select op.numtra, (select c.nomcli from clientes c where c.codcli=op.codcli and c.codemp = op.codemp) as clientes,
     op.estado from encabezadopedpro op where op.tiptra=3 and op.codemp='{}' and op.numtra like '%{}%'
     and (select count(*) from detalle_mezcla dm where dm.ordepro = op.numtra and dm.codemp=op.codemp) > 0
     and op.estado = '{}'
	 and (select count(*) from ENCABEZADOPROCESAMIENTO dm where dm.numtra = op.numtra and dm.codemp=op.codemp and estado='I') = 0
     """.format(datos['codemp'],datos['patron_orden_prod'],datos['estado_orden'])
  print (sql)  
  
  curs.execute(sql)
  regs = curs.fetchall()
  arrresp = []

  for r in regs:
    d = dict(zip(campos, r))
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  


  
@app.route('/articulos_index', methods=['POST'])
def articulos_index():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos = ['codart', 'nomart','prec01','exiact','coduni','punreo','codiva','poriva','precio_iva','src','cant_veces_vendida']
  # sql = "select codart, nomart, round(prec01, 2), (exiact-(select case when sum(cantid) is null then 0 else sum(cantid) end  as sum from v_exitencias_pedpro where codemp = '{}' and codart like '%{}%')) as exiact,coduni,punreo,codiva  from articulos where (nomart like '%{}%' or codart like '%{}%') and codemp = '{}' order by nomart asc".format(datos['codemp'],datos['nomart'],datos['nomart'],datos['nomart'],datos['codemp'])
  
  ############ COMENTADO PARA GUADAPRODUC, PARA QUE LE SELECT DE LA FICHA DE ARTICULO ################ 
  # sql = "select a.codart, a.nomart, round(a.prec01, 2) as precio01, (a.exiact-(select case when sum(p.cantid) is null then 0 else sum(p.cantid) end  as sum from v_exitencias_pedpro p where p.codemp = '{}' and p.codart like '%'||a.codart||'%'))  as exiact,a.coduni,a.punreo,a.codiva, (select i.poriva from iva i where i.codiva=a.codiva) as poriva , round(((poriva*precio01)/100),2) as precio_iva from articulos a where (a.nomart like '%{}%' or a.codart like '%{}%') and a.codemp = '{}' order by a.nomart asc".format(datos['codemp'],datos['nomart'],datos['nomart'],datos['codemp'])
  
  # sql = "else sum(p.cantid) end  as sum from v_exitencias_pedpro p where p.codemp = '{}' and p.codart like a.codart||'%'))  as exiact,a.coduni,a.punreo,a.codiva, (select i.poriva from iva i where i.codiva=a.codiva) as poriva , round(((poriva*prec01)/100),2) as precio_iva from articulos a where (a.nomart like '{}%' or a.codart like '{}%') and a.codemp = '{}' order by a.nomart asc".format(datos['codemp'],datos['nomart'],datos['nomart'],datos['codemp'])
  
  # SELECT top 10 idfactura FROM "DBA"."factura_electronica" order by fechaemision desc
  
  
       # (SELECT TOP 10 idfactura FROM "DBA"."factura_electronica" where fechaemision= (select max(fechaemision) from factura_electronica) and empresa='01' )
  
  sql = """SELECT top 100 a.codart,a.nomart,a.prec01,a.exiact,a.coduni,a.punreo,a.codiva,
     (select i.poriva from iva i where i.codiva=a.codiva) as poriva,
     round(((poriva*prec01)/100),2) as precio_iva,a.grafico
     ,count (codigoprincipal) as cant_veces_vendida
     FROM 
     "DBA"."detallefactura_electronica" d, articulos a
     where idfactura in 
     (SELECT top 10 idfactura FROM "DBA"."factura_electronica" where empresa='01' )
     and d.empresa = '01'
     and d.codigoprincipal = a.codart
     and d.empresa = a.codemp
     group by a.codart,a.nomart,a.prec01,a.exiact,a.coduni,a.punreo,a.codiva,a.grafico
     order by cant_veces_vendida desc"""
  
  curs.execute(sql)
  print (sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    # codart = r[0]
    # print (codart)
    # sql2 = "SELECT precio FROM precio_cliente where codemp= '{}' and codart= '{}' and codcli = '{}' and tipo = 'P' and lispre = 1".format(datos['codemp'],codart,datos['codcli'])
    # curs.execute(sql2)
    # print (sql2)
    # regs2 = curs.fetchone()
    # if (regs2):
        # print ("PRECIO POLITICA CLIENTE")
        # # (poriva*precio01)/100
        # precio_iva_new = round((r[7]*regs2[0])/100,2)
        # r = (r[0],r[1],regs2[0],r[3],r[4],r[5],r[6],r[7],precio_iva_new)
    # else:
        # print ("PRECIO FICHA ARTICULO")
		
    if (r[9]):
        print ("hay imagen")
        arr_path_img = r[9].split('\\')
        img_name = arr_path_img[-1]
        art= (r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],'../../assets/img_articulos/'+img_name,r[10])
			 
    else:
        print ("NO HAY IMAGEN")
        art= (r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],'../../assets/img_articulos/img-no-disp.jpg',r[10])
			 
             # art= (r1[0],r1[1],r1[2],r1[3],r1[4],r1[5],r1[6],r1[7],r1[8],r1[9],'../../assets/img/img-no-disp.jpg',0)
    d = dict(zip(campos, art))
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
# @app.route('/articulos_index', methods=['POST'])
# def articulos_index():
  # datos = request.json
  # print (datos)
  # conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  # curs = conn.cursor()
  # datos['codemp'] = coneccion.codemp
  # # sql = "select a.codart, a.nomart, round(a.prec01, 2) as precio01, (a.exiact-(select case when sum(p.cantid) is null then 0 else sum(p.cantid) end  as sum from v_exitencias_pedpro p where p.codemp = '{}' and p.codart like '%'||a.codart||'%'))  as exiact,a.coduni,a.punreo,a.codiva, (select i.poriva from iva i where i.codiva=a.codiva) as poriva , round(((poriva*precio01)/100),2) as precio_iva,observacion,grafico from articulos a where (a.nomart like '%{}%' or a.codart like '%{}%') and a.codemp = '{}' and a.publicarweb = '1' order by a.exiact desc".format(datos['codemp'],datos['nomart'],datos['nomart'],datos['codemp'])
  # # sql = "select a.codart, a.nomart, round(a.prec01, 2) as precio01, (a.exiact-(select case when sum(p.cantid) is null then 0 else sum(p.cantid) end  as sum from v_exitencias_pedpro p where p.codemp = '{}' and p.codart like '%'||a.codart||'%'))  as exiact,a.coduni,a.punreo,a.codiva, (select i.poriva from iva i where i.codiva=a.codiva) as poriva , round(((poriva*precio01)/100),2) as precio_iva,observacion,grafico from articulos a where  a.codemp = '{}' and a.publicarweb = '1' order by a.exiact desc".format(datos['codemp'],datos['codemp'])
  # sql = '''SELECT distinct a.codcla, ca.nomcla FROM articulos a, clasesarticulos ca 
		# where publicarweb = 1  
		# and a.codemp  = '01'
		# and a.codcla = ca.codcla
		# and a.codemp  = ca.codemp
		# '''
  # curs.execute(sql)
  # print (sql)
  # regs = curs.fetchall()
  # arrresp = []
  # tipo_categoria_lista = []
  # elemento_categoria = {}
  # for r in regs:
    # print (r[0],r[1])

    # campos_art = ['codart', 'nomart','prec01','exiact','coduni','punreo','codiva','poriva','precio_iva','desc','src','cant']
    # sql = "select TOP 5 a.codart, a.nomart, round(a.prec01, 2) as precio01, (a.exiact-(select case when sum(p.cantid) is null then 0 else sum(p.cantid) end  as sum from v_exitencias_pedpro p where p.codemp = '{}' and p.codart like '%'||a.codart||'%'))  as exiact,a.coduni,a.punreo,a.codiva, (select i.poriva from iva i where i.codiva=a.codiva) as poriva , round(((poriva*precio01)/100),2) as precio_iva,observacion,grafico from articulos a where  a.codemp = '{}' and a.publicarweb = '1' and a.codcla = '{}' order by a.exiact desc".format(datos['codemp'],datos['codemp'],r[0])
    # curs.execute(sql)
    # regs1 = curs.fetchall()
    # arr_art= []
    # grupo = {}
    # arr_grupos = []
    # print (len(regs1))
    # while len(regs1) > 0:
       # for r1 in regs1[:5]:
		   
           # # print (r1)
           
          # if (r1[10]):
             # # print ("hay imagen")
             # arr_path_img = r1[10].split('\\')
             # img_name = arr_path_img[-1]
             # art= (r1[0],r1[1],r1[2],r1[3],r1[4],r1[5],r1[6],r1[7],r1[8],r1[9],'../../assets/img/'+img_name,0)
          # else:
             # # print ("NO HAY IMAGEN")
             # art= (r1[0],r1[1],r1[2],r1[3],r1[4],r1[5],r1[6],r1[7],r1[8],r1[9],'../../assets/img/img-no-disp.jpg',0)
	
          # a = dict(zip(campos_art, art))
          # arr_art.append(a)
	   
          # # grupo = dict(zip('g', a))
          # grupo = {'grupo':arr_art}

          # print ("ELIMINO ELEMENTO")
          # # regs1.pop(0)
          # print(regs1.pop(0))
       # print ("SALGO DE FOR DE 3 ELEMENTOS, INSERTADOS LOS PRIMEROS 3 ELEMENTOS ")
       # arr_grupos.append(grupo)
       # print (arr_grupos)
       # arr_art = []
       
	   # # print (grupo)
    # # for art2 in arr_art[:3]:
       # # print (art2)
	
	
	
    # # resp = {'status': 'INSERTADO CON EXITO','numfac': numfac}
	# # print (r[0],r[1])
    # elemento_categoria = {'codigo':r[0],'nomcla':r[1],'art':arr_grupos}
    # tipo_categoria_lista.append(elemento_categoria)
    # print ("SALI DEL BUCLE")
    # print (tipo_categoria_lista)
	
	
	
    # # print (r[10])

	

	
    
    # # d = dict(zip(campos, r))
    # # arrresp.append(d)

  # print("CERRANDO SESION SIACI")
  # curs.close()
  # conn.close()
  # response = make_response(dumps(tipo_categoria_lista, sort_keys=False, indent=2, default=json_util.default))
  # response.headers['content-type'] = 'application/json'
  # return(response)

@app.route('/busqueda_razon_social', methods=['POST'])
def busqueda_razon_social():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos = ['nomcli', 'rucced','tpIdCliente','email','dircli','codcli']
  # sql = "select codart, nomart, round(prec01, 2), (exiact-(select case when sum(cantid) is null then 0 else sum(cantid) end  as sum from v_exitencias_pedpro where codemp = '{}' and codart like '%{}%')) as exiact,coduni,punreo,codiva  from articulos where (nomart like '%{}%' or codart like '%{}%') and codemp = '{}' order by nomart asc".format(datos['codemp'],datos['nomart'],datos['nomart'],datos['nomart'],datos['codemp'])
  
  sql = "select c.nombres,c.rucced,tpIdCliente,email,dircli,codcli from clientes c where c.codemp = '{}' and c.nomcli like '%{}%' order by c.nomcli asc".format(datos['codemp'],datos['patron_cliente'])
  curs.execute(sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    d = dict(zip(campos, r))
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
  

  
@app.route('/servicios', methods=['POST'])
def servicios():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos = ['codart', 'nomart','prec01','exiact','coduni','punreo','codiva','poriva','precio_iva']
  
  sql = """ SELECT VALOR FROM "DBA"."parametros_siaciweb" where codemp='{}' and parametro='SERVICIO_DEFECTO_PDV'
  """.format(datos['codemp'])
  curs.execute(sql)
  r = curs.fetchone()
  if r:
    codigos_servicios_defecto=r[0]
  else:
    codigos_servicios_defecto=coneccion.SERVICIO_DEFECTO_PDV
  
  
  
  
  
  if (codigos_servicios_defecto == 'NOAPLICA'):
  
     sql = """ select '\\'||a.codser, a.nomser,round(a.preser, 2) as precio01, 'N/A' as exiact,'N/A' as coduni,
            '0' as punreo, a.codiva, 
            (select i.poriva from iva i where i.codiva=a.codiva) as poriva ,
            round(((poriva*precio01)/100),2) as precio_iva
            from serviciosvarios a 
            where (a.nomser like '%{}%' or a.nomser like '%{}%') and a.codemp = '{}' and tipo = 'FAC' order by a.nomser asc
        """.format(datos['nomart'],datos['nomart'],datos['codemp'])
  
  else:
     sql = """ select '\\'||a.codser, a.nomser,round(a.preser, 2) as precio01, 'N/A' as exiact,'N/A' as coduni,
            '0' as punreo, a.codiva, 
            (select i.poriva from iva i where i.codiva=a.codiva) as poriva ,
            round(((poriva*precio01)/100),2) as precio_iva
            from serviciosvarios a 
            where (a.nomser like '%{}%' or a.nomser like '%{}%') and a.codemp = '{}' and tipo = 'FAC' and a.codser in ({}) order by a.nomser asc
        """.format(datos['nomart'],datos['nomart'],datos['codemp'],codigos_servicios_defecto)
  
  
  ## PARA SERVICIOS NORMALES DE LOS CLIENTES  ####
  # sql = """ select '\\'||a.codser, a.nomser,round(a.preser, 2) as precio01, 'N/A' as exiact,'N/A' as coduni,
            # '0' as punreo, a.codiva, 
            # (select i.poriva from iva i where i.codiva=a.codiva) as poriva ,
            # round(((poriva*precio01)/100),2) as precio_iva
            # from serviciosvarios a 
            # where (a.nomser like '%{}%' or a.nomser like '%{}%') and a.codemp = '{}' and tipo = 'FAC' order by a.nomser asc
        # """.format(datos['nomart'],datos['nomart'],datos['codemp'])
		
  ## PARA LIDERSCHOOL , SOLO PEM EN CODIGO####
  # coneccion.SERVICIO_DEFECTO_PDV
  
  # sql = """ select '\\'||a.codser, a.nomser,round(a.preser, 2) as precio01, 'N/A' as exiact,'N/A' as coduni,
            # '0' as punreo, a.codiva, 
            # (select i.poriva from iva i where i.codiva=a.codiva) as poriva ,
            # round(((poriva*precio01)/100),2) as precio_iva
            # from serviciosvarios a 
            # where (a.nomser like '%{}%' or a.nomser like '%{}%') and a.codemp = '{}' and tipo = 'FAC' and a.codser in ({}) order by a.nomser asc
        # """.format(datos['nomart'],datos['nomart'],datos['codemp'],codigos_servicios_defecto)
  print (sql)
  
  curs.execute(sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    # d = dict(zip(campos, r))
    # arrresp.append(d)
    codart = r[0]
    print (codart)
    sql2 = "SELECT precio FROM precio_cliente where codemp= '{}' and codart= '{}' and codcli = '{}' and tipo = 'S' and lispre = 1".format(datos['codemp'],codart,datos['codcli'])
    curs.execute(sql2)
    print (sql2)
    regs2 = curs.fetchone()
    if (regs2):
        print ("PRECIO POLITICA CLIENTE")
        # (poriva*precio01)/100
        precio_iva_new = round((r[7]*regs2[0])/100,2)
        r = (r[0],r[1],regs2[0],r[3],r[4],r[5],r[6],r[7],precio_iva_new)
    else:
        print ("PRECIO FICHA ARTICULO")
    d = dict(zip(campos, r))
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/crear_servicios', methods=['POST'])
def crear_servicios():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos) 
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  
  dateTimeObj = datetime.now()
  timestampStr= dateTimeObj.strftime("%d-%b-%Y (%H:%M:%S)")
  fecult = dateTimeObj.strftime("%Y-%m-%d")

  sql = """ insert into serviciosvarios (codemp,codser,nomser,preser,codiva,codusu,fecult,tipo,codcla)
  values('{}','{}','{}','{}','{}','{}','{}','FAC','01');
  """.format(datos['codemp'],datos['codser'],datos['nomser'],datos['preser'],datos['codiva'],datos['codusu'],fecult)
  print (sql)
  curs.execute(sql)
  conn.commit()
 
  d = {'STATUS': 'EXITOSO'}
  print("CERRANDO SESION SIACI")
  return (jsonify(d))

@app.route('/actualizar_servicio', methods=['POST'])
def actualizar_servicio():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos) 
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  
  dateTimeObj = datetime.now()
  timestampStr= dateTimeObj.strftime("%d-%b-%Y (%H:%M:%S)")
  fecult = dateTimeObj.strftime("%Y-%m-%d")

  sql = """ update serviciosvarios set nomser='{}',codiva='{}',preser='{}' where
  codemp='{}' and codser='{}'
  """.format(datos['nomser'],datos['codiva'],datos['preser'],datos['codemp'],datos['codser'])
  print (sql)
  curs.execute(sql)
  conn.commit()
  
  d = {'STATUS': 'EXITOSO'}
  print("CERRANDO SESION SIACI")

  return (jsonify(d))

@app.route('/servicio_detalle', methods=['POST'])
def servicio_detalle():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos) 
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()

  campos = ['codser', 'nomser','precio','codiva']
  
  sql = """ SELECT s.codser
  ,s.nomser
  ,round(s.preser,2) as precio,
  s.codiva
  FROM "DBA"."serviciosvarios" s
  where codemp='{}' and codser='{}';
  """.format(datos['codemp'],datos['codser'])

  curs.execute(sql)
  print (sql)
  r = curs.fetchone()
  print (r)
  if (r):
    d = dict(zip(campos, r))
    # if (r[10]):
        # print ("hay imagen")
        # arr_path_img = r[10].split('\\')
        # img_name = arr_path_img[-1]
        # art= (r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],r[9],'../../assets/img_articulos/'+img_name)
        # d = dict(zip(campos, art))
    # else:
        # print ("NO HAY IMAGEN")
        # art= (r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],r[9],'../../assets/img_articulos/subir-imagen.png')
        # d = dict(zip(campos, art))
	 
  else:
     d = {'error': 'Codigo de articulo no encontrado en la empresa '+datos['codemp']}
 
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()

  return (jsonify(d))
  
  
  
  
@app.route('/reporte_lista_pedidos_ruta', methods=['POST'])
def reporte_lista_pedidos_ruta():
  datos = request.json
  # g.user_id = request.headers.get('user-id')
  # print (g.user_id)
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos = ['header_pedido']
  # sql = "select codart, nomart, round(prec01, 2), (exiact-(select case when sum(cantid) is null then 0 else sum(cantid) end  as sum from v_exitencias_pedpro where codemp = '{}' and codart like '%{}%')) as exiact,coduni,punreo,codiva  from articulos where (nomart like '%{}%' or codart like '%{}%') and codemp = '{}' order by nomart asc".format(datos['codemp'],datos['nomart'],datos['nomart'],datos['nomart'],datos['codemp'])
  
  #sql = "select a.codart, a.nomart, round(a.prec01, 2) as precio01, (a.exiact-(select case when sum(p.cantid) is null then 0 else sum(p.cantid) end  as sum from v_exitencias_pedpro p where p.codemp = '{}' and p.codart like '%'||a.codart||'%'))  as exiact,a.coduni,a.punreo,a.codiva, (select i.poriva from iva i where i.codiva=a.codiva) as poriva , round(((poriva*precio01)/100),2) as precio_iva from articulos a where (a.nomart like '%{}%' or a.codart like '%{}%') and a.codemp = '{}' order by a.nomart asc".format(datos['codemp'],datos['nomart'],datos['nomart'],datos['codemp'])
  ##### 
  sql = """ SELECT ep.numtra+'-'+c.nomcli+'-'+substring(string(pr.hora_entrega),1,5) as hora_entrega 
        FROM "DBA"."encabezadopedpro" ep, clientes c,pedido_ruta pr where ep.numtra in (
        select p.numtra_pedido
        from pedido_ruta p,ruta r, agencia_cliente s
        where p.idruta = trim(r.codruta) 
        and s.id_agencia = p.id_agencia
        and p.idruta = '{}'
        and p.fecha_entrega = '{}'
        )and ep.codcli = c.codcli
        and ep.numtra = pr.numtra_pedido
        and ep.codemp = '{}'
		and ep.estado <>'A'
        order by pr.hora_entrega asc """.format(datos['idruta'],datos['fecha_entrega'],datos['codemp'])
		    # order by pr.hora_entrega asc """.format(datos['nomart'],datos['nomart'],datos['codemp'])
  
  curs.execute(sql)
  print (sql)
  regs = curs.fetchall()
  
  arrresp = []
  header_producto = ('PRODUCTO',)
  p = dict(zip(campos, header_producto))
  arrresp.append(p)
  
  header_unidad = ('UNI',)
  p = dict(zip(campos, header_unidad))
  arrresp.append(p)
  
  for r in regs:
    # print (r)
    # header_producto = ('PRODUCTO',)
    # p = dict(zip(campos, header_producto))
    d = dict(zip(campos, r))
    arrresp.append(d)
    # arrresp.append(p)

  print (arrresp)

  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/reporte_lista_pedidos_ruta_todas', methods=['POST'])
def reporte_lista_pedidos_ruta_todas():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos = ['header_pedido']
  # sql = "select codart, nomart, round(prec01, 2), (exiact-(select case when sum(cantid) is null then 0 else sum(cantid) end  as sum from v_exitencias_pedpro where codemp = '{}' and codart like '%{}%')) as exiact,coduni,punreo,codiva  from articulos where (nomart like '%{}%' or codart like '%{}%') and codemp = '{}' order by nomart asc".format(datos['codemp'],datos['nomart'],datos['nomart'],datos['nomart'],datos['codemp'])
  
  #sql = "select a.codart, a.nomart, round(a.prec01, 2) as precio01, (a.exiact-(select case when sum(p.cantid) is null then 0 else sum(p.cantid) end  as sum from v_exitencias_pedpro p where p.codemp = '{}' and p.codart like '%'||a.codart||'%'))  as exiact,a.coduni,a.punreo,a.codiva, (select i.poriva from iva i where i.codiva=a.codiva) as poriva , round(((poriva*precio01)/100),2) as precio_iva from articulos a where (a.nomart like '%{}%' or a.codart like '%{}%') and a.codemp = '{}' order by a.nomart asc".format(datos['codemp'],datos['nomart'],datos['nomart'],datos['codemp'])
  ##### 
  sql = """SELECT ep.numtra+'-'+c.nomcli+'-'+substring(string(pr.hora_entrega),1,5)+'-'+ru.descripcion
        FROM "DBA"."encabezadopedpro" ep, clientes c,pedido_ruta pr, ruta ru 
		where ep.numtra in (
        select p.numtra_pedido
        from pedido_ruta p,ruta r, agencia_cliente s
        where p.idruta = trim(r.codruta)
        and s.id_agencia = p.id_agencia
        and p.fecha_entrega = '{}'
        )and ep.codcli = c.codcli
        and ep.numtra = pr.numtra_pedido
        and ep.codemp = '{}'
        and ep.estado <>'A'
		and pr.idruta = trim(ru.codruta)
		and ep.codemp = ru.codemp
        order by descripcion,pr.hora_entrega asc """.format(datos['fecha_entrega'],datos['codemp'])
		    # order by pr.hora_entrega asc """.format(datos['nomart'],datos['nomart'],datos['codemp'])
  
  curs.execute(sql)
  print (sql)
  regs = curs.fetchall()
  
  arrresp = []
  header_producto = ('PRODUCTO',)
  p = dict(zip(campos, header_producto))
  arrresp.append(p)
  
  header_unidad = ('UNI',)
  p = dict(zip(campos, header_unidad))
  arrresp.append(p)
  
  for r in regs:
    # print (r)
    # header_producto = ('PRODUCTO',)
    # p = dict(zip(campos, header_producto))
    d = dict(zip(campos, r))
    arrresp.append(d)
    # arrresp.append(p)

  print (arrresp)

  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/reporte_lista_articulos', methods=['POST'])
def reporte_lista_articulos():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos = ['codart','nomart','coduni']

  sql = """ SELECT distinct(rp.codart), nomart ,rp.coduni
             FROM "DBA"."renglonespedpro" rp where rp.numtra in (
             select p.numtra_pedido
             from pedido_ruta p,ruta r, agencia_cliente s,encabezadopedpro ep
             where p.idruta = trim(r.codruta) 
             and s.id_agencia = p.id_agencia
             and p.idruta = '{}'
             and p.fecha_entrega = '{}'
             and p.empresa = r.codemp
			 and ep.codemp = p.empresa
             and  ep.codemp = s.empresa
             and ep.numtra = p.numtra_pedido
             and ep.estado <>'A'
             and p.empresa = '{}'
             )
             and rp.codemp = '{}'
             group by rp.codart,nomart,coduni
             order by nomart asc """.format(datos['idruta'],datos['fecha_entrega'],datos['codemp'],datos['codemp'])

  
  curs.execute(sql)
  print (sql)
  regs = curs.fetchall()
  
  arrresp = []
  # header_producto = ('PRODUCTO',)
  # p = dict(zip(campos, header_producto))
  # arrresp.append(p)
  
  # header_unidad = ('UNI',)
  # p = dict(zip(campos, header_unidad))
  # arrresp.append(p)
  
  for r in regs:
    d = dict(zip(campos, r))
    arrresp.append(d)
    # arrresp.append(p)

  print (arrresp)

  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/reporte_lista_articulos_todas_rutas', methods=['POST'])
def reporte_lista_articulos_todas_rutas():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos = ['codart','nomart','coduni']

  sql = """ SELECT distinct(rp.codart), nomart ,rp.coduni
             FROM "DBA"."renglonespedpro" rp where rp.numtra in (
             select p.numtra_pedido
             from pedido_ruta p,ruta r, agencia_cliente s,encabezadopedpro ep
             where p.idruta = trim(r.codruta)
             and s.id_agencia = p.id_agencia
             and p.fecha_entrega = '{}'
             and p.empresa = r.codemp
			 and ep.codemp = p.empresa
             and  ep.codemp = s.empresa
             and ep.numtra = p.numtra_pedido
             and ep.estado <>'A'
             and p.empresa = '{}'
             )
             and rp.codemp = '{}'
             group by rp.codart,nomart,coduni
             order by nomart asc """.format(datos['fecha_entrega'],datos['codemp'],datos['codemp'])

  
  curs.execute(sql)
  print (sql)
  regs = curs.fetchall()
  
  arrresp = []
  # header_producto = ('PRODUCTO',)
  # p = dict(zip(campos, header_producto))
  # arrresp.append(p)
  
  # header_unidad = ('UNI',)
  # p = dict(zip(campos, header_unidad))
  # arrresp.append(p)
  
  for r in regs:
    d = dict(zip(campos, r))
    arrresp.append(d)
    # arrresp.append(p)

  print (arrresp)

  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
  
@app.route('/reporte_renglones_pedidos_ruta', methods=['POST'])
def reporte_renglones_pedidos_ruta():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  
  sql = """ SELECT ep.numtra,ep.numtra+'-'+c.nomcli+'-'+substring(string(pr.hora_entrega),1,5) as hora_entrega 
        FROM "DBA"."encabezadopedpro" ep, clientes c,pedido_ruta pr where ep.numtra in (
        select p.numtra_pedido
        from pedido_ruta p,ruta r, agencia_cliente s
        where p.idruta = trim(r.codruta) 
        and s.id_agencia = p.id_agencia
        and p.idruta = '{}'
        and p.fecha_entrega = '{}'
        )and ep.codcli = c.codcli
        and ep.numtra = pr.numtra_pedido
        and ep.codemp = '{}'
		and ep.estado <>'A'
        order by pr.hora_entrega asc """.format(datos['idruta'],datos['fecha_entrega'],datos['codemp'])
		    # order by pr.hora_entrega asc """.format(datos['nomart'],datos['nomart'],datos['codemp'])
  
  curs.execute(sql)
  regs = curs.fetchall()
  campos_renglones = ["PRODUCTO","UNI"]
  cant_renglones = []
  
  for p in regs:
    print ("### PEDIDO ####")
    print (p)
    campos_renglones.append(p[1])
  
  # sql2 = """ SELECT distinct(rp.codart), nomart ,rp.coduni
             # FROM "DBA"."renglonespedpro" rp where rp.numtra in (
             # select p.numtra_pedido
             # from pedido_ruta p,ruta r, agencia_cliente s
             # where p.idruta = trim(r.codruta) 
             # and s.id_agencia = p.id_agencia
             # and p.idruta = '{}'
             # and p.fecha_entrega = '{}'
             # and p.empresa = '{}'
             # )
             # and rp.codemp = '{}'
             # group by rp.codart,nomart,coduni
             # order by nomart asc """.format(datos['idruta'],datos['fecha_entrega'],datos['codemp'],datos['codemp'])
  # print (sql2)
  # curs.execute(sql2)
  # regs2 = curs.fetchall()
  array_tuple_art = []
  # for art in regs2:
  print("### ARTICULOS PEDIDO ####")
  # print(art)
  art_renglon = [datos['nomart'],datos['coduni']]
  print ("art_renglon")
	
  for p1 in regs:
      print (p1)
      sql4 = """ SELECT cantid FROM "DBA"."renglonespedpro" where numtra = '{}' and codart='{}' and codemp = '{}' """.format(p1[0],datos['codart'],datos['codemp'])
      curs.execute(sql4)
      cant =  curs.fetchone()
      print (sql4)
      if (cant):
          print (cant[0])
          art_renglon.append(cant[0])
      else:
          print ("")
          art_renglon.append("")
			
  print (art_renglon)
  print (tuple(art_renglon))
  array_tuple_art.append(tuple(art_renglon))
  print (array_tuple_art)

  print ("###### CAMPOS ######")
  print (campos_renglones)
		
  regs = array_tuple_art
  arrresp = []
  d = {}
  for r in regs:
    # print (r)
    d = dict(zip(campos_renglones, r))
  
  print (d)
    # arrresp.append(d)
  
  # salida = dict(zip(campos_renglones,array_tuple_art))
  # print (salida)
  
  # print (arrresp)
  # print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/reporte_renglones_pedidos_ruta_todas', methods=['POST'])
def reporte_renglones_pedidos_ruta_todas():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  
  sql = """ SELECT ep.numtra,ep.numtra+'-'+c.nomcli+'-'+substring(string(pr.hora_entrega),1,5)+'-'+ru.descripcion
        FROM "DBA"."encabezadopedpro" ep, clientes c,pedido_ruta pr, ruta ru 
		where ep.numtra in (
        select p.numtra_pedido
        from pedido_ruta p,ruta r, agencia_cliente s
        where p.idruta = trim(r.codruta)
        and s.id_agencia = p.id_agencia
        and p.fecha_entrega = '{}'
        )and ep.codcli = c.codcli
        and ep.numtra = pr.numtra_pedido
        and ep.codemp = '{}'
        and ep.estado <>'A'
		and pr.idruta = trim(ru.codruta)
		and ep.codemp = ru.codemp
        order by descripcion,pr.hora_entrega asc """.format(datos['fecha_entrega'],datos['codemp'])
		    # order by pr.hora_entrega asc """.format(datos['nomart'],datos['nomart'],datos['codemp'])
  print (sql)
  curs.execute(sql)
  regs = curs.fetchall()
  campos_renglones = ["PRODUCTO","UNI"]
  cant_renglones = []
  
  for p in regs:
    print ("### PEDIDO ####")
    print (p)
    campos_renglones.append(p[1])
  
  # sql2 = """ SELECT distinct(rp.codart), nomart ,rp.coduni
             # FROM "DBA"."renglonespedpro" rp where rp.numtra in (
             # select p.numtra_pedido
             # from pedido_ruta p,ruta r, agencia_cliente s
             # where p.idruta = trim(r.codruta) 
             # and s.id_agencia = p.id_agencia
             # and p.idruta = '{}'
             # and p.fecha_entrega = '{}'
             # and p.empresa = '{}'
             # )
             # and rp.codemp = '{}'
             # group by rp.codart,nomart,coduni
             # order by nomart asc """.format(datos['idruta'],datos['fecha_entrega'],datos['codemp'],datos['codemp'])
  # print (sql2)
  # curs.execute(sql2)
  # regs2 = curs.fetchall()
  array_tuple_art = []
  # for art in regs2:
  print("### ARTICULOS PEDIDO ####")
  # print(art)
  art_renglon = [datos['nomart'],datos['coduni']]
  print ("art_renglon")
	
  for p1 in regs:
      print (p1)
      sql4 = """ SELECT cantid FROM "DBA"."renglonespedpro" where numtra = '{}' and codart='{}' and codemp = '{}' """.format(p1[0],datos['codart'],datos['codemp'])
      curs.execute(sql4)
      cant =  curs.fetchone()
      print (sql4)
      if (cant):
          print (cant[0])
          art_renglon.append(cant[0])
      else:
          print ("")
          art_renglon.append("")
			
  print (art_renglon)
  print (tuple(art_renglon))
  array_tuple_art.append(tuple(art_renglon))
  print (array_tuple_art)

  print ("###### CAMPOS ######")
  print (campos_renglones)
		
  regs = array_tuple_art
  arrresp = []
  d = {}
  for r in regs:
    # print (r)
    d = dict(zip(campos_renglones, r))
  
  print (d)
    # arrresp.append(d)
  
  # salida = dict(zip(campos_renglones,array_tuple_art))
  # print (salida)
  
  # print (arrresp)
  # print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  

@app.route('/reporte_renglones_pedidos_ruta_OLD', methods=['POST'])
def reporte_renglones_pedidos_ruta_OLD():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  
  sql = """ SELECT ep.numtra,ep.numtra+'-'+c.nomcli+'-'+substring(string(pr.hora_entrega),1,5) as hora_entrega 
        FROM "DBA"."encabezadopedpro" ep, clientes c,pedido_ruta pr where ep.numtra in (
        select p.numtra_pedido
        from pedido_ruta p,ruta r, agencia_cliente s
        where p.idruta = trim(r.codruta) 
        and s.id_agencia = p.id_agencia
        and p.idruta = '{}'
        and p.fecha_entrega = '{}'
        )and ep.codcli = c.codcli
        and ep.numtra = pr.numtra_pedido
        and ep.codemp = '{}'
		and ep.estado <>'A'
        order by pr.hora_entrega asc """.format(datos['idruta'],datos['fecha_entrega'],datos['codemp'])
		    # order by pr.hora_entrega asc """.format(datos['nomart'],datos['nomart'],datos['codemp'])
  
  curs.execute(sql)
  regs = curs.fetchall()
  campos_renglones = ["PRODUCTO","UNI"]
  cant_renglones = []
  
  for p in regs:
    # print ("### PEDIDO ####")
    # print (p)
    campos_renglones.append(p[1])
    # print ("#####  PEDIDO_LISTO  #####")
    # pedido_lista=[p[0],p[1]]
    # print (pedido_lista)

    # sql2 = """ SELECT distinct(rp.codart), nomart ,rp.coduni
           # FROM "DBA"."renglonespedpro" rp where rp.numtra in (
           # select p.numtra_pedido
           # from pedido_ruta p,ruta r, agencia_cliente s
           # where p.idruta = trim(r.codruta) 
           # and s.id_agencia = p.id_agencia
           # and p.idruta = '02'
           # and p.fecha_entrega = '2020-03-16'
           # )
           # group by rp.codart,nomart,coduni
           # order by nomart asc """
    # curs.execute(sql2)
    # regs2 = curs.fetchall()
    # print("### ARTICULOS PEDIDO ####")
    # for art in regs2:
       # print(art)
       # sql3 = """ SELECT cantid FROM "DBA"."renglonespedpro" where numtra = '{}' and codart='{}' """.format(p[0],art[0])
       # curs.execute(sql3)
       # cant =  curs.fetchone()
       # if (cant):
          # print (cant[0])
          # cant_renglones.append(cant[0])
       # else:
          # print ("0")
          # cant_renglones.append("0")
	   
    
  # print ("###### CAMPOS ######")
  # print (campos_renglones)
  # print (cant_renglones)
  
  sql2 = """ SELECT distinct(rp.codart), nomart ,rp.coduni
             FROM "DBA"."renglonespedpro" rp where rp.numtra in (
             select p.numtra_pedido
             from pedido_ruta p,ruta r, agencia_cliente s
             where p.idruta = trim(r.codruta) 
             and s.id_agencia = p.id_agencia
             and p.idruta = '{}'
             and p.fecha_entrega = '{}'
             and p.empresa = '{}'
             )
             and rp.codemp = '{}'
             group by rp.codart,nomart,coduni
             order by nomart asc """.format(datos['idruta'],datos['fecha_entrega'],datos['codemp'],datos['codemp'])
  curs.execute(sql2)
  regs2 = curs.fetchall()
  # print("### ARTICULOS PEDIDO ####")
  array_tuple_art = []
  for art in regs2:
    print("### ARTICULOS PEDIDO ####")
    print(art)
    art_renglon = [art[1],art[2]]
	
    for p1 in regs:
        print (p1)
        sql4 = """ SELECT cantid FROM "DBA"."renglonespedpro" where numtra = '{}' and codart='{}' and codemp = '{}' """.format(p1[0],art[0],datos['codemp'])
        curs.execute(sql4)
        cant =  curs.fetchone()
        print (sql4)
        if (cant):
            print (cant[0])
            art_renglon.append(cant[0])
        else:
            print ("")
            art_renglon.append("")
			
    print (art_renglon)
    print (tuple(art_renglon))
    array_tuple_art.append(tuple(art_renglon))
  print (array_tuple_art)
	
	
  print ("###### CAMPOS ######")
  print (campos_renglones)
		
  # campos = ['codart','nomart','coduni']
  # sql = """ SELECT distinct(rp.codart), nomart ,rp.coduni
        # FROM "DBA"."renglonespedpro" rp where rp.numtra in (
        # select p.numtra_pedido
        # from pedido_ruta p,ruta r, agencia_cliente s
        # where p.idruta = trim(r.codruta) 
        # and s.id_agencia = p.id_agencia
        # and p.idruta = '02'
        # and p.fecha_entrega = '2020-03-16'
        # )
        # group by rp.codart,nomart,coduni
        # order by nomart asc """
 
  # curs.execute(sql)
  regs = array_tuple_art
  arrresp = []
  for r in regs:
    # print (r)
    d = dict(zip(campos_renglones, r))
    arrresp.append(d)
  
  # salida = dict(zip(campos_renglones,array_tuple_art))
  # print (salida)
  
  print (arrresp)
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/generar_encabezado_pdv', methods = ['POST'])
def generar_encabezado_pdv():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  
  ##SECUENCIA INTERNA SIACI
  # sql = "select seccue from secuencias where  codemp='{}' and codalm='{}' and numcaj='{}' and codsec='PV_FAC'".format(
  sql = "select seccue from secuencias where  codemp='{}' and codalm='{}' and codsec='PV_FAC'".format(
  datos['codemp'], datos['codalm']
  # datos['codemp'], datos['codalm'], datos['numcaj']
  )

  
  
  curs.execute(sql)
  regsec = curs.fetchone()
  # curs.close()
  numfac = regsec[0]
  
  print (sql)
  
  print (numfac)
  
  ##SECUENCIA TRIBUTARIA
  # sql = "select seccue from secuencias_tmp where  codemp='{}' and codalm='{}' and numcaj='{}' and codsec='PV_FAC'".format(
  # sql = "select seccue from secuencias_tmp where  codemp='{}' and codalm='{}' and codsec='VC_FAC' and numcaj='12'".format(
  sql = "select seccue, serie from secuencias_tmp where  codemp='{}' and codalm='{}' and codsec='PV_FAC' and numcaj='{}'".format(
  datos['codemp'], datos['codalm'], datos['numcaj'])
  # datos['codemp'], datos['codalm'])
  print (sql)
  # curs = conn.cursor()
  curs.execute(sql)
  regsec = curs.fetchone()
  # curs.close()
  numfac_tributaria = regsec[0]
  # print (sql)
  
  print (numfac_tributaria)
  datos['serie'] = regsec[1]
  
  
  
  
  ##PARA OBTENER CODIGO DE VENDEDOR
  # curs = conn.cursor()
  # sql = "SELECT v.codven, nomven FROM vendedorescob v, usuario u where v.codus1 = u.codus1 and v.codusu = u.codusu and u.codus1='{}' and u.codemp='{}'"\
        # .format(datos['codus1'],datos['codemp'])
		
  sql = "SELECT v.codven, nomven FROM vendedorescob v WHERE v.codus1='{}' and v.codemp='{}'".format(datos['codus1'],datos['codemp'])
  curs.execute(sql)
  r = curs.fetchone()
  # codven = '06'
  # print ("COD VENDEDOR")
  # print (codven)
  
  # codusu = 'SUPERVISOR'
  # print ("CODUSU")
  # print (codusu)
  
  codven = r[0]
  nomven = r[1]
  print (codven)
  print (nomven)
  
  
  
  ##PARA OBTENER CODIGO DE VENDEDOR
  # curs = conn.cursor()
  sql = "SELECT vc_lis FROM parametrosiniciales where numren='PV' and codemp='{}'"\
        .format(datos['codemp'])
  curs.execute(sql)
  r_lispre = curs.fetchone()
  lispre=r_lispre[0]
  
  dateTimeObj = datetime.now()
  timestampStr= dateTimeObj.strftime("%d-%b-%Y (%H:%M:%S)")
  hora= dateTimeObj.strftime("%H:%M:%S")
  # print (timestampStr)
  print (hora)
  
  
  if (datos['conpag'] == 'E'):
    tipcre = 'X'
    numpag = '1'
    plapag = '1'
    valcre = '0'
    forpag = '0'
    cuecob = '0'
  if (datos['conpag'] == 'C'):
    tipcre = 'R'
    numpag = datos['numpag']
    plapag = datos['plapag']
    valcre = datos['valcre']
    forpag = '1'
    cuecob = '1'
	
      
 
  # dateTimeObj = datetime.now()
  # timestampStr= dateTimeObj.strftime("%d-%b-%Y (%H:%M:%S)")
  # hora= dateTimeObj.strftime("%H:%M:%S")
  # print (timestampStr)
  # print (hora)
  
  
  if (datos['codret'] == ''):
    codret = 'null'
    porret = '0'
    valret = '0'
  else:
    codret = datos['codret']
    porret = datos['porret']
    valret = datos['valret']
	
  if (datos['codiva'] == ''):
    codiva = 'null'
    porivar = '0'
    valiva = '0'
  else:
    codiva = datos['codiva']
    porivar = datos['porivar']
    valiva = datos['valiva']

  if (datos['numche'] == ''):
    datos['numche'] = 'null'

  if (datos['numtar'] == ''):
    datos['numtar'] = 'null'
	
  if (datos['numtrans'] == ''):
    datos['numtrans'] = 'null'

  datos['codtar']= 'null'  if datos['codtar'] == None else "'"+datos['codtar']+"'"
  datos['codban']= 'null'  if datos['codban'] == None else "'"+datos['codban']+"'"
  datos['coddep']= 'null'  if datos['coddep'] == None else "'"+datos['coddep']+"'"
  
  
	
	
  string_campos = '''numfac,codemp,codven,codalm,nomcli,fecfac,totnet,totdes,totbas,poriva,totfac,tipefe,valefe,tipche,numche,
  valche,tiptar,numtar,valtar,totiva,totrec,codusu,fecult,codmon,valcot,codcli,estado,numcaj,telcli,codiva,porivar,valiva,codret,porret,valret,faccli,tipodocumento,serie,turno,inserta,otrcar,
  factok,facnot,codapu,tipoorigen,tipdep,numdep,valdep,tiptra,fecven,lispre,hora,conpag,tipcre,numpag,plapag,valcre,forpag,cuecob,pordes,codtar,codban,recargo,tiptrans,valtrans,numtrans,coddep,tipo_guia'''
  
  
  sql = """insert into encabezadopuntosventa ({}) values('{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}',{},'{}','{}',{},'{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}',{},{},{},{},{},{},'{}','{}','{}','{}',{},'{}','{}','{}','{}','{}','{}',{},'{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}',{},{},{},'{}','{}',{},{},{})
  """.format(string_campos,numfac,datos['codemp'],codven,datos['codalm'],datos['nomcli'],
  datos['fecfac'],datos['totnet'],datos['totdes'],datos['totbase'],datos['poriva'],datos['totfac'],datos['tipefe'],datos['valefe'],datos['tipche'],
  datos['numche'],datos['valche'],datos['tiptar'],datos['numtar'],datos['valtar'], datos['totiva'],datos['totrec'],datos['codus1'],datos['fecfac'],'01','1',datos['codcli'],'X',
  datos['numcaj'],datos['telcli'],codiva,porivar,valiva,
  codret,porret,valret,numfac_tributaria,'01',datos['serie'],datos['turno'],'null','0','O','F','FC'+numfac,'NC','X','null','0','1',datos['fecfac'],lispre,hora,datos['conpag'],tipcre,numpag,plapag,valcre,forpag,cuecob,datos['pordes'],datos['codtar'],datos['codban'],0,datos['tiptrans'],datos['valtrans'],datos['numtrans'],datos['coddep'],1) 
  # curs = conn.cursor()

  print (sql)
  curs.execute(sql)
  # curs.close()
  conn.commit()
  
  
  
  print ("PARA OBTENER SECUENCIA INTERNA NUEVA")
  print (numfac)
  print (len(numfac))
  print (int(numfac)+1)
  print (str((int(numfac)+1)).zfill(len(numfac)))
  numfac_nueva = str((int(numfac)+1)).zfill(len(numfac))
  
  #### CAMBIO DE SECUENCIAS  ####
  # curs = conn.cursor()
  # sql = "update secuencias set seccue = seccue+1 where codalm='{}' and codsec = 'PV_FAC' and codemp='{}' and numcaj='{}'".format(datos['codalm'],datos['codemp'],datos['numcaj'])
  # sql = "update secuencias set seccue = seccue+1 where codalm='{}' and codsec = 'PV_FAC' and codemp='{}'".format(datos['codalm'],datos['codemp'])
  
  sql = "update secuencias set seccue =  '{}' where codalm='{}' and codsec = 'PV_FAC' and codemp='{}'".format(numfac_nueva,datos['codalm'],datos['codemp'])
  curs.execute(sql)
  conn.commit()
  
  print ("PARA OBTENER SECUENCIA TRIBUTARIA NUEVA")
  print (numfac_tributaria)
  print (len(numfac_tributaria))
  print (int(numfac_tributaria)+1)
  print (str((int(numfac_tributaria)+1)).zfill(len(numfac_tributaria)))
  numfac_tributaria_nueva = str((int(numfac_tributaria)+1)).zfill(len(numfac_tributaria))
  
  # zfill(8)  ####COMPLETAR CON 0
  
  #### CAMBIO DE SECUENCIAS_TMP  ####
  # curs = conn.cursor()
  # # sql = "update secuencias_tmp set seccue = '{}' where codalm='{}' and codsec = 'PV_FAC' and codemp='{}' and numcaj='{}'".format(numfac_tributaria_nueva,datos['codalm'],datos['codemp'],datos['numcaj'])
  
  sql = "update secuencias_tmp set seccue = '{}' where codalm='{}' and codsec = 'PV_FAC' and codemp='{}' and numcaj='{}'".format(numfac_tributaria_nueva,datos['codalm'],datos['codemp'],datos['numcaj'])
  curs.execute(sql)
  conn.commit()
  
  ######################## PARA SACHA QUE NO TIENE EL TRIGGER DE LAS FORMAS DE PAGO  #######################################
  # sql = """
		# INSERT INTO detalle_formas_pago_sri (codemp,numfac,tipo,tarjeta,val_tar,plazo_tar)
		# SELECT codemp,numfac,'PVE','19',valtar,numpag * plapag
		# FROM encabezadopuntosventa
		# WHERE tiptar = 'T' and 
		# codemp = '{}' and 
		# numfac = '{}';
  # """.format(datos['codemp'],numfac)
  # print (sql)
  # curs.execute(sql)
  # conn.commit()
  ######################## PARA SACHA QUE NO TIENE EL TRIGGER DE LAS FORMAS DE PAGO  #######################################
  
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  
  sleep (0.2)
  resp = {'status': 'INSERTADO CON EXITO','numfac': numfac}
  # resp = {'status': 'INSERTADO CON EXITO','numfac': '1111'}
  response = make_response(dumps(resp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/generar_renglones_pdv', methods = ['POST'])
def generar_renglones_pdv():
  renglones = request.json
  print ("##########  ENTRADA GENERAR RENGLONES PUNTO DE VENTA ######")
  print (renglones)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  
  for datos in renglones:
     codemp=datos['codemp']  
     print ("CODEMP " +codemp )  
 
     codcen=datos['codagencia']+'.'
     print ("codcen" + codcen )
  
     NUMFAC=datos['numfac'] 
     print ("NUMTRA "+str(NUMFAC) )

     numren=datos['numren']
     print ("NUMREN " +str(numren) )
 
     codart=datos['codart']
     print ("CODART "+ codart) 

     nomart=datos['nomart'] 
     print ("NOMART "+nomart )  

     coduni=datos['coduni']
     print ("CODUNI "+coduni) 

     cantid=datos['cant']
     print ("CANTID "+str(cantid))  

     preuni=datos['prec01']
     print ("PREUNI "+ str(preuni))   
 
     subtotal_art=datos['subtotal_art']
     print ("SUBTOTAL_ART "+str(subtotal_art)) 

     desren=datos['punreo']
     print ("PORCENTAJE DESCUENTO RENGLON "+str(desren)) 
  
     desc_valor_renglon = datos['v_desc_art']
     print ("DESCUENTO VALOR RENGLON "+str(desc_valor_renglon)) 
 
     totren = round(subtotal_art+desc_valor_renglon,2)
     codiva=datos['codiva']
     print ("CODIVA "+codiva) 

     numcaj=datos['numcaj']
     print ("NUMCAJ "+numcaj) 

     ## PARA OBTENER EL PROYECTO (CLASE DE ARTICULO)
  
     # SELECT codcla FROM "DBA"."articulos" where codemp='01' and codart='304222'
  
     FLAG_ARTICULO = 0
     ##PARA OBTENER CODIGO DE VENDEDOR
     sql = "SELECT codcla FROM articulos where codemp='{}' and codart='{}'"\
        .format(datos['codemp'],datos['codart'])
     curs.execute(sql)
     r_codcla = curs.fetchone()
     if (r_codcla):
       proyecto=r_codcla[0]
       FLAG_ARTICULO = 1
	
     else:
       proyecto= 'null'
  
     sql = "INSERT INTO renglonespuntosventa (codemp,numfac,numren,numite,codart,nomart,coduni,cantid,preuni,totren,estart,estcan,estpre,codiva,codmon,valcot,totext,numcaj,proyecto,codcen,tipodocumento,totaldesc,peso,inserta) values('{}','{}','{}',{},'{}','{}','{}','{}','{}',{},'{}','{}','{}','{}','{}','{}','{}','{}',{},'{}','{}','{}','{}',{})"\
        .format(codemp,NUMFAC,numren,numren,codart,nomart,coduni,cantid,preuni,totren,"P","P","P",codiva,"01","1",totren,numcaj,proyecto,codcen,"01","0.00",desren,"null")

     print (sql) 
     curs.execute(sql)
     print ("###### ANTES DEL COMMIT INSERT RENGLON")
     sleep (0.3)
  
  conn.commit()
  sleep (0.5)
  print ("###### LUEGO DEL COMMIT INSERT RENGLON")
  curs.close()
  conn.close()
  print ("###### CIERRO CONEXION BASE DE DATOS")

  d = {'status': 'INSERTADO RENGLON'}
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
 
@app.route('/get_encabezado_pdv', methods = ['POST'])
def get_encabezado_pdv():
	print ("################ GET ENCABEZADO FACTURA  ##############")
	datos = request.json
	print (datos)
	codemp=datos['codemp']
	numtra=datos['numfac']

	conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
	curs = conn.cursor()
	
	# # SELECT p.numtra,DATEFORMAT(p.fectra, 'DD-MM-YYYY') as fectra , DATEFORMAT(p.fecult, 'DD-MM-YYYY') as fecult ,c.rucced,c.nombres,c.dircli,c.codcli,c.telcli,c.email,p.observ,p.totnet,p.iva_cantidad,p.codusu,p.ciucli,
	
	sql = """
    SELECT p.codemp,p.numfac,p.faccli,fecfac,c.tpIdCliente,c.rucced,c.nombres,c.codcli,c.email,c.dircli,
    p.observ,p.totnet,p.totfac,p.totrec,
    p.tipefe,p.valefe,p.tiptar,p.numtar,p.valtar,p.codtar,p.tipche,p.numche,p.valche,p.codban,p.tipcre,p.valcre,p.numpag,p.plapag,p.tiptrans,p.valtrans,p.numtrans,p.coddep,
    p.totiva,p.poriva,p.totdes,p.pordes
    FROM encabezadopuntosventa p, clientes c
    where p.numfac = '{}' and p.codemp='{}'
    and p.codcli=c.codcli
    and c.codemp=p.codemp
	""".format(numtra,codemp)
	curs.execute(sql)
	r = curs.fetchone()

	
	campos = ['codemp', 'numfac','faccli','fecfac','tpIdCliente','rucced','razon_social','codcli','email','dircli','observ','totnet','totfac','totrec','tipefe'
	,'valefe','tiptar','numtar','valtar','codtar','tipche','numche','valche','codban','tipcre','valcre','numpag','plapag','tiptrans','valtrans','numtrans','coddep','totiva','poriva','totdes','pordes']
	print (r)
	if r:
		d = dict(zip(campos, r))
   	
	response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
	response.headers['content-type'] = 'application/json'
	# # return(response)


	conn.close()
	return(response)
	
@app.route('/get_renglones_pdv', methods = ['POST'])
def get_renglones_pdv():
		
	datos = request.json
	print (datos)
	codemp=datos['codemp']
	numtra=datos['numfac']
	conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
	curs = conn.cursor()

	
	sql = """
	SELECT
	numren
	,codart,nomart,coduni,cantid,preuni,totren,
	peso as punreo,codiva,
	(select i.poriva from iva i where i.codiva=r.codiva) as poriva,
	round (((totren*poriva)/100),2) as precio_iva,
	round((((punreo*preuni)/100) * cantid),2) as v_des_art,
	round(totren-v_des_art,2) as subtotal_art
	FROM "DBA"."renglonespuntosventa" r  where numfac='{}' and codemp='{}'
	""".format(numtra,codemp)
	
	curs.execute(sql)
	print (sql)
	r = curs.fetchall()

	campos = ['index','codart','nomart','coduni','cant','prec01','totren','punreo','codiva','poriva','precio_iva','v_desc_art','subtotal_art']
	renglones_pdv = []
	for reg in r:

		print ("LO QUE VIENE DE LA BASE DE DATOS")
		print (reg)

		reg_encabezado = dict(zip(campos, reg))
		renglones_pdv.append(reg_encabezado)
	print (renglones_pdv) 

	response = make_response(dumps(renglones_pdv, sort_keys=False, indent=2, default=json_util.default))
	response.headers['content-type'] = 'application/json'

	conn.close()
	return(response)


@app.route('/actualizar_encabezado_pdv', methods=['POST'])
def actualizar_encabezado_pdv():

  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)

  dateTimeObj = datetime.now()
  timestampStr= dateTimeObj.strftime("%d-%b-%Y (%H:%M:%S)")
  hora= dateTimeObj.strftime("%H:%M:%S")
  # print (timestampStr)
  print (hora)
  fecult = dateTimeObj.strftime("%Y-%m-%d")
  
  
  if (datos['conpag'] == 'E'):
    tipcre = 'X'
    numpag = '1'
    plapag = '1'
    valcre = '0'
    forpag = '0'
    cuecob = '0'
  if (datos['conpag'] == 'C'):
    tipcre = 'R'
    numpag = datos['numpag']
    plapag = datos['plapag']
    valcre = datos['valcre']
    forpag = '1'
    cuecob = '1'

  if (datos['codret'] == ''):
    codret = 'null'
    porret = '0'
    valret = '0'
  else:
    codret = datos['codret']
    porret = datos['porret']
    valret = datos['valret']
	
  if (datos['codiva'] == ''):
    codiva = 'null'
    porivar = '0'
    valiva = '0'
  else:
    codiva = datos['codiva']
    porivar = datos['porivar']
    valiva = datos['valiva']

  if (datos['numche'] == ''):
    datos['numche'] = 'null'

  if (datos['numtar'] == ''):
    datos['numtar'] = 'null'
	
  if (datos['numtrans'] == ''):
    datos['numtrans'] = 'null'

  datos['codtar']= 'null'  if datos['codtar'] == None else "'"+datos['codtar']+"'"
  datos['codban']= 'null'  if datos['codban'] == None else "'"+datos['codban']+"'"
  datos['coddep']= 'null'  if datos['coddep'] == None else "'"+datos['coddep']+"'"
 
  # string_campos = '''numfac,codemp,codven,codalm,nomcli,fecfac,totnet,totdes,totbas,poriva,totfac,tipefe,valefe,tipche,numche,
  # valche,tiptar,numtar,valtar,totiva,totrec,codusu,fecult,codmon,valcot,codcli,estado,numcaj,telcli,codiva,porivar,valiva,codret,porret,valret,faccli,tipodocumento,serie,turno,inserta,otrcar,
  # factok,facnot,codapu,tipoorigen,tipdep,numdep,valdep,tiptra,fecven,lispre,hora,conpag,tipcre,numpag,plapag,valcre,forpag,cuecob,pordes,codtar,codban,recargo,tiptrans,valtrans,numtrans,coddep'''
  
  
  sql = """update encabezadopuntosventa set nomcli='{}',totnet={},totdes={},totbas={},poriva={}, totfac={},tipefe='{}',valefe={},tipche='{}',numche={} ,valche={},
  tiptar='{}',numtar={},valtar={},totiva={},totrec={},fecult='{}',codcli='{}',porivar='{}',valiva='{}',codret={},porret='{}',valret='{}',conpag='{}',
  tipcre='{}',numpag={},plapag={},valcre={},forpag='{}', cuecob='{}',pordes={},codtar={},codban={},tiptrans='{}',valtrans={},numtrans={},coddep={}
  where codemp='{}' and numfac='{}'
  """.format(datos['nomcli'],datos['totnet'],datos['totdes'],datos['totbase'],datos['poriva'],datos['totfac'],datos['tipefe'],datos['valefe'],datos['tipche'],
  datos['numche'],datos['valche'],datos['tiptar'],datos['numtar'],datos['valtar'], datos['totiva'],datos['totrec'],fecult,datos['codcli'],porivar,valiva,
  codret,porret,valret,datos['conpag'],tipcre,numpag,plapag,valcre,forpag,cuecob,datos['pordes'],datos['codtar'],datos['codban'],datos['tiptrans'],datos['valtrans'],
  datos['numtrans'],datos['coddep'],datos['codemp'],datos['numfac']) 
  curs = conn.cursor()

  print (sql)
  curs.execute(sql)
  conn.commit()
  
  sql= """DELETE from renglonespuntosventa  where codemp='{}' and numfac='{}'""".format(datos['codemp'],datos['numfac'])
  curs.execute(sql)
  conn.commit()
  
  
 
  
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  resp = {'status': 'ACTUALIZADO CON EXITO','numfac': datos['numfac']}
  response = make_response(dumps(resp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  

 

  
  
@app.route('/aplicar_fact_electronica', methods = ['POST'])
def aplicar_fact_electronica():
  datos = request.json
  print ("##########  ENTRADA APLICAR FACTURACION ELECTRONICA ######")
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  
  sql = """update encabezadopuntosventa e set 
  e.inserta = (select (case when e.inserta is null then 'P' else null end))
  where e.numfac = '{}' and e.codemp = '{}'""".format(datos['numfac'] ,datos['codemp'])
  print (sql) 
  curs.execute(sql)
  conn.commit()
  
  sql = """select distinct(r.inserta) from renglonespuntosventa r 
  where r.numfac = '{}' and r.codemp = '{}'""".format(datos['numfac'] ,datos['codemp'])
  print (sql) 
  curs.execute(sql)
  r = curs.fetchone()
  inserta = r[0]
  inserta= "'P'" if inserta == None else 'null'
  print (r)
  print (inserta)

  sql = """update renglonespuntosventa r set 
  r.inserta = {}
  where r.numfac = '{}' and r.codemp = '{}'""".format(inserta,datos['numfac'] ,datos['codemp'])
  print (sql) 
  curs.execute(sql)
  conn.commit()
  
  curs.close()
  conn.close()
  sleep (0.5)  
  d = {'status': 'EXITOSO'}
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/regenerar_pdf', methods = ['POST'])
def regenerar_pdf():
  datos = request.json
  print ("##########  ENTRADA REGENERAR PDF ######")
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  
  sql = """ update factura_electronica set codigoerror = null where autorizacionsri='{}' and empresa='{}'""".format(datos['auth'],datos['codemp'])
  print (sql) 
  curs.execute(sql)
  conn.commit()
  

  d = {'status': 'EXITOSO'}
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/lista_ventas_pdv', methods = ['POST'])
def lista_ventas_pdv():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos) 
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
 
  campos = ['faccli', 'codcli','fecfac','codalm','codusu','totfac','nomcli','caja','tiptar','tipche','tipefe','serie','turno','nomalm','nomcaj','auth','status','conpag','pdf','numfac','descripcionerror','tiptrans','ticket','factok']
  
  sql = """ SELECT pv.faccli,pv.codcli,pv.fecfac,pv.codalm,pv.codusu,pv.totfac,pv.nomcli,pv.numcaj,pv.tiptar,pv.tipche,pv.tipefe,pv.serie,pv.turno,
  (select nomalm from almacenes a1 where a1.codalm=pv.codalm and a1.codemp=pv.codemp),
  (select nomcaj from cajapuntoventa c where c.numcaj=pv.numcaj and c.codemp=pv.codemp),
  (select f.autorizacionsri from factura_electronica f where f.idfactura=pv.serie||pv.numfac and tipo_origen = 'PV' and f.empresa=pv.codemp) as auth,
  (select f.estadodocumento from factura_electronica f where f.idfactura=pv.serie||pv.numfac and tipo_origen = 'PV' and f.empresa=pv.codemp),
  pv.conpag,pv.numfac,
   (select f.descripcionerror from factura_electronica f where f.idfactura=pv.serie||pv.numfac and tipo_origen = 'PV' and f.empresa=pv.codemp),
   pv.tiptrans,'ticket_'||pv.codemp||'_'||pv.numfac||'.html' as ticket_url, pv.factok
  FROM encabezadopuntosventa pv
  where pv.codalm = '{}' and pv.codemp='{}'
  and pv.fecfac between '{}' and '{}'
  ---and totfac <> 0  
  and pv.codusu = '{}'
  order by numfac desc
  """.format(datos['codalm'],datos['codemp'],datos['fecha_desde'],datos['fecha_hasta'],datos['usuario'])
  print (sql)
  curs.execute(sql)

  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    # print (r)
    # print (r[15])
    # urlfile = 'http://' + coneccion.ip + ':' + coneccion.puerto + '/images/'
    ticket_file= datos['api_url'] + '/ticket/'+r[21]
    r_salida = (r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],r[9],r[10],r[11],r[12],r[13],r[14],r[15],r[16],r[17],'no_existe_auth',r[18],r[19],r[20],ticket_file,r[22])
    if (r[15]):
       urlfile = datos['api_url'] + '/pdf_file/'+datos['codemp']+'_'
       pdf = urlfile + r[15] + '.pdf'
       r_salida = (r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],r[9],r[10],r[11],r[12],r[13],r[14],r[15],r[16],r[17],pdf,r[18],r[19],r[20],ticket_file,r[22])
    d = dict(zip(campos, r_salida))
    # print (d)
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  # print(arrresp)
  curs.close()
  conn.close()

  return (jsonify(arrresp))

@app.route('/pdf_file/<imagename>')
def pdf_file(imagename):
    print ("VER PDF")
    conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
    curs = conn.cursor()
    arr_image= imagename.split('_')
    sql = "SELECT path FROM datos_archivo where codemp='{}' ".format(arr_image[0])
    curs.execute(sql)
    r = curs.fetchone()
    PATH_PDF=r[0]
    return send_from_directory(PATH_PDF, arr_image[1])
  
  
@app.route('/ticket/<ticketname>')
def ticket(ticketname):
    print ("VER TICKET")
    conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
    curs = conn.cursor()
    arr_image= ticketname.split('_')
    arr_image= ticketname.split('_')
	
    codemp = arr_image[1]
    numfac = arr_image[2]

    generar_pdf = pdf.GEN_PDF()
    resp_pdf = generar_pdf.gen_ticket_html(codemp,numfac)

    PATH_PDF='C:\\SISTEMA\\temporales'
    # return send_from_directory(PATH_PDF, arr_image[1])
    return send_from_directory(PATH_PDF, ticketname)
  
  
@app.route('/generar_pedido', methods=['POST'])
def generar_pedido():
  datos = request.json
  print ("##########  ENTRADA GENERAR PEDIDOS ######")
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  # campos = ['codemp', 'nomcli','rucced','codcli']
  # # sql_smtp = "select servidor, cuentafe, passwordfe, port, auth, encrypt from emailsmtp where codemp='{}'".format(codemp)
  
  ##PARA OBTENER CODIGO DE VENDEDOR
  # sql = "SELECT v.codven, nomven FROM vendedorescob v, usuario u where v.codus1 = u.codus1 and v.codusu = u.codusu and u.codus1='{}' and u.codemp='{}'"\
  # sql = "SELECT v.codven, nomven FROM vendedorescob v, usuario u where v.codus1 = u.codus1 and u.codus1='{}' and u.codemp='{}'"\
        # .format(datos['codus1'],datos['codemp'])
  # curs.execute(sql)
  # r = curs.fetchone()
  # print (sql)
  
  
  codemp=datos['codemp']
  print ("CODEMP")
  print (codemp)
  
  codcli=datos['codcli']
  print ("CODCLI")
  print (codcli)
  
  ciucli=datos['ciucli']
  print ("CIUCLI")
  print (ciucli)
  if (ciucli == '*** Seleccione ciudad ***'):
    ciucli = 'NO DISPONIBLE'
  if (ciucli == '*** OTRA CIUDAD ***'):
    ciucli = 'OTRA CIUDAD'
  
  fectra='DATE(\''+datos['fectra']+'\')'
  print ("FECTRA")
  print (fectra)
  
  fecult='DATE(\''+datos['fectra']+'\')'
  print ("FECULT")
  print (fecult)
  
  totnet=datos['totnet']
  print ("TOTNET")
  print (totnet)
  
  iva_cantidad=datos['iva_cantidad']
  print ("IVA_CANTIDAD")
  print (iva_cantidad)
  
  iva_pctje=datos['iva_pctje']
  print ("IVA_PCTJE")
  print (iva_pctje)
  
  codven = datos['codven']
  print ("COD VENDEDOR")
  print (codven)
  
  codusu = datos['codus1']
  print ("CODUSU")
  print (codusu)
  
  print ("COD ALMACEN")
  codalm = '01'
  print (codalm)
  
  if (datos['tiptra']):
      TIPTRA = datos['tiptra']
      print ("TIPTRA")
  else:
      TIPTRA = '1'
  print (TIPTRA)
  
  print ("lispre")
  lispre=1
  print (lispre)
  
  print ("codmon")
  codmon='01'
  print (codmon)
  
  print ("valcot")
  valcot='01'
  print (valcot)
  
  print ("externo")
  externo='1'
  print (externo)
  
  print ("codcen")
  codcen='01.'
  print (codcen)
  
  print ("ESTADO")
  # ESTADO='I' 
  ESTADO= datos['estado']
  print (ESTADO)
  
  sql = "SELECT seccue FROM secuencias where codalm=\'01\' and codsec = '{}' and codemp='{}'".format(datos['cod_secuencia'],datos['codemp'])
  curs.execute(sql)
  r = curs.fetchone()
  NEXT_NUMTRA=r[0]
  
  print ("OBSERVACION entrada")
  observ=datos['observ']
  print (observ)
  observ= 'null'  if datos['observ'] == None else "'"+datos['observ']+"'"
  print (observ)

  
  sql = "INSERT INTO encabezadopedpro (codemp,tiptra,numtra,codcli,codven,codalm,fectra,lispre,totnet,codmon,valcot,codusu,fecult,codcen,estado,descuento,iva_cantidad,iva_pctje,externo,observ,ciucli) values('{}',{},'{}','{}','{}','{}',{},'{}','{}','{}','{}','{}',{},'{}','{}',{},{},{},{},{},'{}' )"\
        .format(codemp,TIPTRA,NEXT_NUMTRA,codcli,codven,codalm,fectra,lispre,totnet,codmon,valcot,codusu,fecult,codcen,ESTADO,0,iva_cantidad,iva_pctje,1,observ,ciucli)

  print (sql) 
  curs.execute(sql)
  conn.commit()
  
  
  print ("PARA OBTENER SECUENCIA  NUEVA DE PEDIDOS")
  print (NEXT_NUMTRA)
  print (len(NEXT_NUMTRA))
  print (int(NEXT_NUMTRA)+1)
  print (str((int(NEXT_NUMTRA)+1)).zfill(len(NEXT_NUMTRA)))
  numfac_nueva = str((int(NEXT_NUMTRA)+1)).zfill(len(NEXT_NUMTRA))
  
  # sql = "update secuencias set seccue = seccue+1 where codalm=\'01\' and codsec = \'VC_PED\' and codemp='{}'".format(datos['codemp'])
  sql = "update secuencias set seccue = '{}' where codalm=\'01\' and codsec = '{}' and codemp='{}'".format(numfac_nueva,datos['cod_secuencia'],datos['codemp'])
  curs.execute(sql)
  conn.commit()
  
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  
  # if r:
    # d = dict(zip(campos, r))
  # else:
    # d = {'rucced': False}
  d = {'status': 'INSERTADO CON EXITO','numtra': NEXT_NUMTRA}
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  

##################################################### GENERAR PEDIDO GUADAPRODUCT 
# @app.route('/generar_pedido', methods=['POST'])
# def generar_pedido():
  # datos = request.json
  # print ("##########  ENTRADA GENERAR PEDIDOS ######")
  # print (datos)
  
  # conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  # curs = conn.cursor()
  # # campos = ['codemp', 'nomcli','rucced','codcli']
  # # # sql_smtp = "select servidor, cuentafe, passwordfe, port, auth, encrypt from emailsmtp where codemp='{}'".format(codemp)
  
  # ##PARA OBTENER CODIGO DE VENDEDOR
  # # sql = "SELECT v.codven, nomven FROM vendedorescob v, usuario u where v.codus1 = u.codus1 and v.codusu = u.codusu and u.codus1='{}' and u.codemp='{}'"\
  # # sql = "SELECT v.codven, nomven FROM vendedorescob v, usuario u where v.codus1 = u.codus1 and u.codus1='{}' and u.codemp='{}'"\
        # # .format(datos['codus1'],datos['codemp'])
  # # curs.execute(sql)
  # # r = curs.fetchone()
  # # print (sql)
  
  
  # codemp=datos['codemp']
  # print ("CODEMP")
  # print (codemp)
  
  # codcli=datos['codcli']
  # print ("CODCLI")
  # print (codcli)
  
  # ciucli=datos['ciucli']
  # print ("CIUCLI")
  # print (ciucli)
  # if (ciucli == '*** Seleccione ciudad ***'):
    # ciucli = 'NO DISPONIBLE'
  # if (ciucli == '*** OTRA CIUDAD ***'):
    # ciucli = 'OTRA CIUDAD'
  
  # fectra='DATE(\''+datos['fectra']+'\')'
  # print ("FECTRA")
  # print (fectra)
  
  # fecult='DATE(\''+datos['fectra']+'\')'
  # print ("FECULT")
  # print (fecult)
  
  # totnet=datos['totnet']
  # print ("TOTNET")
  # print (totnet)
  
  # iva_cantidad=datos['iva_cantidad']
  # print ("IVA_CANTIDAD")
  # print (iva_cantidad)
  
  # iva_pctje=datos['iva_pctje']
  # print ("IVA_PCTJE")
  # print (iva_pctje)
  
  # codven = datos['codven']
  # print ("COD VENDEDOR")
  # print (codven)
  
  # codusu = datos['codus1']
  # print ("CODUSU")
  # print (codusu)
  
  # print ("COD ALMACEN")
  # codalm = '01'
  # print (codalm)
  
  # if (datos['tiptra']):
      # TIPTRA = datos['tiptra']
      # print ("TIPTRA")
  # else:
      # TIPTRA = '1'
  # print (TIPTRA)
  
  # print ("lispre")
  # lispre=1
  # print (lispre)
  
  # print ("codmon")
  # codmon='01'
  # print (codmon)
  
  # print ("valcot")
  # valcot='01'
  # print (valcot)
  
  # print ("externo")
  # externo='1'
  # print (externo)
  
  # print ("codcen")
  # codcen='01.'
  # print (codcen)
  
  # print ("ESTADO")
  # ESTADO='I'
  # print (ESTADO)
  
  # sql = "SELECT seccue FROM secuencias where codalm=\'01\' and codsec = \'VC_ORT\' and codemp='{}'".format(datos['codemp'])
  # curs.execute(sql)
  # r = curs.fetchone()
  # NEXT_NUMTRA=r[0]
  
  # print ("OBSERVACION")
  # observ=datos['observ']
  # print (observ)
  
  # # print ("NEXT_NUMTRA")
  # # print (NEXT_NUMTRA)
  
  # sql = "INSERT INTO encabezadopedpro (codemp,tiptra,numtra,codcli,codven,codalm,fectra,lispre,totnet,codmon,valcot,codusu,fecult,codcen,estado,descuento,iva_cantidad,iva_pctje,externo,observ,ciucli) values('{}',{},'{}','{}','{}','{}',{},'{}','{}','{}','{}','{}',{},'{}','{}',{},{},{},{},'{}','{}' )"\
        # .format(codemp,TIPTRA,NEXT_NUMTRA,codcli,codven,codalm,fectra,lispre,totnet,codmon,valcot,codusu,fecult,codcen,ESTADO,0,iva_cantidad,iva_pctje,1,observ,ciucli)

  # print (sql) 
  # curs.execute(sql)
  # conn.commit()
  
  
  # print ("PARA OBTENER SECUENCIA  NUEVA DE PEDIDOS")
  # print (NEXT_NUMTRA)
  # print (len(NEXT_NUMTRA))
  # print (int(NEXT_NUMTRA)+1)
  # print (str((int(NEXT_NUMTRA)+1)).zfill(len(NEXT_NUMTRA)))
  # numfac_nueva = str((int(NEXT_NUMTRA)+1)).zfill(len(NEXT_NUMTRA))
  
  # # sql = "update secuencias set seccue = seccue+1 where codalm=\'01\' and codsec = \'VC_PED\' and codemp='{}'".format(datos['codemp'])
  # sql = "update secuencias set seccue = '{}' where codalm=\'01\' and codsec = \'VC_ORT\' and codemp='{}'".format(numfac_nueva,datos['codemp'])
  # curs.execute(sql)
  # conn.commit()
  
  # print("CERRANDO SESION SIACI")
  # curs.close()
  # conn.close()
  
  # # if r:
    # # d = dict(zip(campos, r))
  # # else:
    # # d = {'rucced': False}
  # d = {'status': 'INSERTADO CON EXITO','numtra': NEXT_NUMTRA}
  # response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  # response.headers['content-type'] = 'application/json'
  # return(response)
  
######## ACTUALIZAR ENCABEZADO PEDIDO
# @app.route('/actualizar_encabezado_pedido', methods=['POST'])
# def actualizar_encabezado_pedido():
  # datos = request.json
  # print ("##########  ENTRADA ACTULIZACION ENCABEZADO PEDIDOS ######")
  # print (datos)
  
  # conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  # curs = conn.cursor()
  # fecult='DATE(\''+datos['fecult']+'\')'
  # print ("FECULT")
  # print (fecult)

  # sql = "update encabezadopedpro set codcli= '{}',observ='{}',ciucli='{}',totnet={},iva_cantidad={}, fecult= '{}', fectra= '{}' where codemp='{}' and numtra='{}' and tiptra=1"\
  # .format(datos['codcli'],datos['observ'],datos['ciucli'],datos['totnet'],datos['iva_cantidad'],datos['fecult'],datos['fectra'],datos['codemp'],datos['numtra'])
  # curs.execute(sql)
  # conn.commit()
  
  # # DELETE FROM renglonespedpro WHERE codemp='01' and numtra='10000236' and tiptra=1
  # sql = "DELETE FROM renglonespedpro WHERE codemp='{}' and numtra='{}' and tiptra=1"\
  # .format(datos['codemp'],datos['numtra'])
  # curs.execute(sql)
  # conn.commit()
  
  # print("CERRANDO SESION SIACI")
  # curs.close()
  # conn.close()

  # d = {'status': 'ACTUALIZADO CON EXITO'}
  # response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  # response.headers['content-type'] = 'application/json'
  # return(response)
  
@app.route('/actualizar_encabezado_pedido', methods=['POST'])
def actualizar_encabezado_pedido():
  datos = request.json
  print ("##########  ENTRADA ACTULIZACION ENCABEZADO PEDIDOS ######")
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  fecult='DATE(\''+datos['fecult']+'\')'
  print ("FECULT")
  print (fecult)
  # observ = 'null' if datos['observ'] == None else "'"+datos['observ']+"'"
  datos['observ'] = 'null' if datos['observ'] == None else "'"+datos['observ']+"'"


  

  sql = "update encabezadopedpro set codcli= '{}',observ={},ciucli='{}',totnet={},iva_cantidad={}, fecult= '{}', fectra= '{}' , codven= '{}' where codemp='{}' and numtra='{}' and tiptra=1"\
  .format(datos['codcli'],datos['observ'],datos['ciucli'],datos['totnet'],datos['iva_cantidad'],datos['fecult'],datos['fectra'],datos['codven'],datos['codemp'],datos['numtra'])
  print (sql)
  curs.execute(sql)
  conn.commit()
  
  # DELETE FROM renglonespedpro WHERE codemp='01' and numtra='10000236' and tiptra=1
  sql = "DELETE FROM renglonespedpro WHERE codemp='{}' and numtra='{}' and tiptra=1"\
  .format(datos['codemp'],datos['numtra'])
  curs.execute(sql)
  conn.commit()
  
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()

  d = {'status': 'ACTUALIZADO CON EXITO'}
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/actualizar_encabezado_orden', methods=['POST'])
def actualizar_encabezado_orden():
  datos = request.json
  print ("##########  ENTRADA ACTULIZACION ENCABEZADO ORDEN ######")
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  fecult='DATE(\''+datos['fecult']+'\')'
  print ("FECULT")
  print (fecult)

  sql = "update encabezadopedpro set codcli= '{}', codven='{}', observ='{}',ciucli='{}',totnet={},iva_cantidad={}, fecult= '{}', fectra= '{}' where codemp='{}' and numtra='{}' and tiptra=7"\
  .format(datos['codcli'],datos['codven'],datos['observ'],datos['ciucli'],datos['totnet'],datos['iva_cantidad'],datos['fecult'],datos['fectra'],datos['codemp'],datos['numtra'])
  curs.execute(sql)
  conn.commit()
  
  # DELETE FROM renglonespedpro WHERE codemp='01' and numtra='10000236' and tiptra=1
  sql = "DELETE FROM renglonespedpro WHERE codemp='{}' and numtra='{}' and tiptra=7"\
  .format(datos['codemp'],datos['numtra'])
  curs.execute(sql)
  conn.commit()
  
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()

  d = {'status': 'ACTUALIZADO CON EXITO'}
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
  
@app.route('/actualizar_encabezado_ingreso', methods=['POST'])
def actualizar_encabezado_ingreso():
  datos = request.json
  print ("##########  ENTRADA ACTULIZACION ENCABEZADO INGRESO ######")
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  # fecult='DATE(\''+datos['fecult']+'\')'
  # print ("FECULT")
  # print (fecult)

  sql = "update encabezadoingresos set codpro= '{}', observ='{}', totfac='{}' where codemp='{}' and numfac='{}'"\
  .format(datos['codpro'],datos['observ'],datos['totfac'],datos['codemp'],datos['numfac'])
   
  curs.execute(sql)
  conn.commit()
  
  
   
  # sql = """INSERT INTO encabezadoingresos (codemp,numfac,codpro,fecfac,observ,codmon,valcot,codalm,conpag,codusu,fecult,estado,
         # totfac,codcom,externo) 
         # values('{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}',{},'{}',{})""".format(datos['codemp'],NEXT_NUMTRA,datos['codpro'],datos['fecfac'],datos['observ'],'01','01',datos['codalm'],datos['conpag'],datos['codusu'],datos['fecfac'],'N',datos['totfac'],'03',1)

  
  # DELETE FROM renglonespedpro WHERE codemp='01' and numtra='10000236' and tiptra=1
  sql = "DELETE FROM renglonesingresos WHERE numfac='{}' and codemp='{}'"\
  .format(datos['numfac'],datos['codemp'])
  curs.execute(sql)
  conn.commit()
  
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()

  d = {'status': 'ACTUALIZADO CON EXITO'}
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/generar_renglones_pedido', methods=['POST'])
def generar_renglones_pedido():
  datos = request.json
  print ("##########  ENTRADA GENERAR RENGLONES PEDIDOS ######")
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  # # campos = ['codemp', 'nomcli','rucced','codcli']
  # # # sql_smtp = "select servidor, cuentafe, passwordfe, port, auth, encrypt from emailsmtp where codemp='{}'".format(codemp)
  
  # ##PARA OBTENER CODIGO DE VENDEDOR
  # sql = "SELECT v.codven, nomven FROM vendedorescob v, usuario u where v.codus1 = u.codus1 and v.codusu = u.codusu and u.codus1='{}' and u.codemp='{}'"\
        # .format(datos['codus1'],datos['codemp'])
  # curs.execute(sql)
  # r = curs.fetchone()
  
  codemp=datos['codemp']  
  print ("CODEMP " +codemp )  
 
  if (datos['tiptra']):
      TIPTRA = datos['tiptra']
      print ("TIPTRA")
  else:
      TIPTRA = '1'
  print (TIPTRA)

  codcen='01.' 
  print ("codcen" + codcen)
  
  NUMTRA=datos['numtra'] 
  print ("NUMTRA "+str(NUMTRA) )

  numren=datos['numren']
  print ("NUMREN " +str(numren) )
 
  codart=datos['codart']
  print ("CODART "+ codart) 

  nomart=datos['nomart']
  nomart = nomart.replace("'","''")
  print ("NOMART "+nomart )  

  coduni=datos['coduni']
  print ("CODUNI "+coduni) 

  cantid=datos['cant']
  # print ("CANTID "+cantid)  

  preuni=datos['prec01']
  print ("PREUNI "+ str(preuni))   
 
  totren=datos['subtotal_art']
  print ("TOTREN "+str(totren))    

  codiva=datos['codiva']
  print ("CODIVA "+codiva) 
  
  desren=datos['punreo']
  print ("DESREN "+str(desren)) 
  
  acumula=1
  print ("ACUMULA "+str(acumula))
  
  num_docs=datos['num_docs']
  
  num_docs= 'null'  if datos['num_docs'] == None else "'"+datos['num_docs']+"'"
  # pattern_observ = re.compile(r'Puede agregar detalles del artículo')
  
  # if (pattern_observ.search(num_docs)):
     # print ("SETEO OBSERVACION A NULL")
     # num_docs= ""

  # print ("DESCRIP_ART "+num_docs)

# insert into renglonespedpro (codemp,tiptra,numtra,numren,codart,nomart,coduni,cantid,preuni,totren,codiva,codcen,desren,acumula)
# values ('01',1,'30000030',1,'75W-90','ACEITE CAJAC MEC GETRIEBEOL EP SYNTH','UNI',1,11.62,10.46,'S','01.',10,1)
  
  if (coduni != 'N/A'):
     sql = "INSERT INTO renglonespedpro (codemp,tiptra,numtra,numren,codart,nomart,coduni,cantid,preuni,totren,codiva,codcen,desren,acumula,num_docs) values('{}','{}','{}',{},'{}','{}','{}','{}','{}',{},'{}','{}',{},{},{})"\
        .format(codemp,TIPTRA,NUMTRA,numren,codart,nomart,coduni,cantid,preuni,totren,codiva,codcen,desren,acumula,num_docs)
  else:
     sql = "INSERT INTO renglonespedpro (codemp,tiptra,numtra,numren,codart,nomart,cantid,preuni,totren,numite,codiva,codcen,desren,acumula,num_docs) values('{}','{}','{}',{},'{}','{}','{}','{}',{},'{}','{}','{}',{},{},{})"\
        .format(codemp,TIPTRA,NUMTRA,numren,codart,nomart,cantid,preuni,totren,datos['numite'],codiva,codcen,desren,acumula,num_docs)
     

  print (sql) 
  curs.execute(sql)
  conn.commit()
  
  # print("CERRANDO SESION SIACI")
  # curs.close()
  # conn.close()
  
  # if r:
    # d = dict(zip(campos, r))
  # else:
    # d = {'rucced': False}
  d = {'status': 'INSERTADO RENGLON'}
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
#####    GENERAR RENGLONES PEDIDOS GUADAPRODUC
# @app.route('/generar_renglones_pedido', methods=['POST'])
# def generar_renglones_pedido():
  # datos = request.json
  # print ("##########  ENTRADA GENERAR RENGLONES PEDIDOS ######")
  # print (datos)
  
  # conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  # curs = conn.cursor()
  # # # campos = ['codemp', 'nomcli','rucced','codcli']
  # # # # sql_smtp = "select servidor, cuentafe, passwordfe, port, auth, encrypt from emailsmtp where codemp='{}'".format(codemp)
  
  # # ##PARA OBTENER CODIGO DE VENDEDOR
  # # sql = "SELECT v.codven, nomven FROM vendedorescob v, usuario u where v.codus1 = u.codus1 and v.codusu = u.codusu and u.codus1='{}' and u.codemp='{}'"\
        # # .format(datos['codus1'],datos['codemp'])
  # # curs.execute(sql)
  # # r = curs.fetchone()
  
  # codemp=datos['codemp']  
  # print ("CODEMP " +codemp )  
 
  # if (datos['tiptra']):
      # TIPTRA = datos['tiptra']
      # print ("TIPTRA")
  # else:
      # TIPTRA = '1'
  # print (TIPTRA)

  # codcen='01.' 
  # print ("codcen" + codcen)
  
  # NUMTRA=datos['numtra'] 
  # print ("NUMTRA "+str(NUMTRA) )

  # numren=datos['numren']
  # print ("NUMREN " +str(numren) )
 
  # codart=datos['codart']
  # print ("CODART "+ codart) 

  # nomart=datos['nomart']
  # nomart = nomart.replace("'","''")
  # print ("NOMART "+nomart )  

  # coduni=datos['coduni']
  # print ("CODUNI "+coduni) 

  # cantid=datos['cant']
  # # print ("CANTID "+cantid)  

  # preuni=datos['prec01']
  # print ("PREUNI "+ str(preuni))   
 
  # totren=datos['subtotal_art']
  # print ("TOTREN "+str(totren))    

  # codiva=datos['codiva']
  # print ("CODIVA "+codiva) 
  
  # desren=datos['punreo']
  # print ("DESREN "+str(desren)) 
  
  # acumula=1
  # print ("ACUMULA "+str(acumula))
  
  # num_docs=datos['observ']
  # pattern_observ = re.compile(r'Puede agregar detalles del artículo')
  
  # if (pattern_observ.search(num_docs)):
     # print ("SETEO OBSERVACION A NULL")
     # num_docs= ""

  # print ("DESCRIP_ART "+num_docs)

# # insert into renglonespedpro (codemp,tiptra,numtra,numren,codart,nomart,coduni,cantid,preuni,totren,codiva,codcen,desren,acumula)
# # values ('01',1,'30000030',1,'75W-90','ACEITE CAJAC MEC GETRIEBEOL EP SYNTH','UNI',1,11.62,10.46,'S','01.',10,1)
  
  # if (coduni != 'N/A'):
     # sql = "INSERT INTO renglonespedpro (codemp,tiptra,numtra,numren,codart,nomart,coduni,cantid,preuni,totren,codiva,codcen,desren,acumula,num_docs) values('{}','{}','{}',{},'{}','{}','{}','{}','{}',{},'{}','{}',{},{},'{}')"\
        # .format(codemp,TIPTRA,NUMTRA,numren,codart,nomart,coduni,cantid,preuni,totren,codiva,codcen,desren,acumula,num_docs)
  # else:
     # sql = "INSERT INTO renglonespedpro (codemp,tiptra,numtra,numren,codart,nomart,cantid,preuni,totren,numite,codiva,codcen,desren,acumula,num_docs) values('{}','{}','{}',{},'{}','{}','{}','{}',{},'{}','{}','{}',{},{},'{}')"\
        # .format(codemp,TIPTRA,NUMTRA,numren,codart,nomart,cantid,preuni,totren,datos['numite'],codiva,codcen,desren,acumula,num_docs)
     

  # print (sql) 
  # curs.execute(sql)
  # conn.commit()
  
  # # print("CERRANDO SESION SIACI")
  # # curs.close()
  # # conn.close()
  
  # # if r:
    # # d = dict(zip(campos, r))
  # # else:
    # # d = {'rucced': False}
  # d = {'status': 'INSERTADO RENGLON'}
  # response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  # response.headers['content-type'] = 'application/json'
  # return(response)
  
@app.route('/actualizar_renglones_pedido', methods=['POST'])
def actualizar_renglones_pedido():
  datos = request.json
  print ("##########  ENTRADA ACTUALIZAR RENGLONES PEDIDOS ######")
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  
  codemp=datos['codemp']  
  print ("CODEMP " +codemp )  
 
  TIPTRA = '1' 
  print ("TIPTRA "+TIPTRA )

  codcen='01.' 
  print ("codcen" + codcen)
  
  NUMTRA=datos['numtra'] 
  print ("NUMTRA "+str(NUMTRA) )

  numren=datos['numren']
  print ("NUMREN " +str(numren) )
 
  codart=datos['codart']
  print ("CODART "+ codart) 

  nomart=datos['nomart']
  nomart = nomart.replace("'","''")
  print ("NOMART "+nomart )   

  coduni=datos['coduni']
  print ("CODUNI "+coduni) 

  cantid=datos['cant']
  # print ("CANTID "+cantid)  

  preuni=datos['prec01']
  print ("PREUNI "+ str(preuni))   
 
  totren=datos['subtotal_art']
  print ("TOTREN "+str(totren))    

  codiva=datos['codiva']
  print ("CODIVA "+codiva) 
  
  desren=datos['punreo']
  print ("DESREN "+str(desren)) 
  
  acumula=1
  print ("ACUMULA "+str(acumula))
  
  num_docs=datos['num_docs']
  
  num_docs= 'null'  if datos['num_docs'] == None else "'"+datos['num_docs']+"'"
  # pattern_observ = re.compile(r'Puede agregar detalles del artículo')
  
  # if (pattern_observ.search(num_docs) or (num_docs == 'null')):
     # print ("SETEO OBSERVACION A NULL")
     # num_docs= ""

  # print ("DESCRIP_ART "+num_docs)

# insert into renglonespedpro (codemp,tiptra,numtra,numren,codart,nomart,coduni,cantid,preuni,totren,codiva,codcen,desren,acumula)
# values ('01',1,'30000030',1,'75W-90','ACEITE CAJAC MEC GETRIEBEOL EP SYNTH','UNI',1,11.62,10.46,'S','01.',10,1)
  
  sql = "INSERT INTO renglonespedpro (codemp,tiptra,numtra,numren,codart,nomart,coduni,cantid,preuni,totren,codiva,codcen,desren,acumula,num_docs) values('{}','{}','{}',{},'{}','{}','{}','{}','{}',{},'{}','{}',{},{},'{}')"\
        .format(codemp,TIPTRA,NUMTRA,numren,codart,nomart,coduni,cantid,preuni,totren,codiva,codcen,desren,acumula,num_docs)

  print (sql) 
  curs.execute(sql)
  conn.commit()
  
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  
  d = {'status': 'INSERTADO RENGLON'}
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/actualizar_renglones_orden', methods=['POST'])
def actualizar_renglones_orden():
  datos = request.json
  print ("##########  ENTRADA ACTUALIZAR RENGLONES PEDIDOS ######")
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  
  codemp=datos['codemp']  
  print ("CODEMP " +codemp )  
 
  TIPTRA = '7' 
  print ("TIPTRA "+TIPTRA )

  codcen='01.' 
  print ("codcen" + codcen)
  
  NUMTRA=datos['numtra'] 
  print ("NUMTRA "+str(NUMTRA) )

  numren=datos['numren']
  print ("NUMREN " +str(numren) )
 
  codart=datos['codart']
  print ("CODART "+ codart) 

  nomart=datos['nomart']
  nomart = nomart.replace("'","''")
  print ("NOMART "+nomart )   

  coduni=datos['coduni']
  print ("CODUNI "+coduni) 

  cantid=datos['cant']
  # print ("CANTID "+cantid)  

  preuni=datos['prec01']
  print ("PREUNI "+ str(preuni))   
 
  totren=datos['subtotal_art']
  print ("TOTREN "+str(totren))    

  codiva=datos['codiva']
  print ("CODIVA "+codiva) 
  
  desren=datos['punreo']
  print ("DESREN "+str(desren)) 
  
  acumula=1
  print ("ACUMULA "+str(acumula))
  
  num_docs=datos['num_docs']
  
  num_docs= 'null'  if datos['num_docs'] == None else "'"+datos['num_docs']+"'"
  
  # num_docs=datos['num_docs']
  # pattern_observ = re.compile(r'Puede agregar detalles del artículo')
  
  # if (pattern_observ.search(num_docs) or (num_docs == 'null')):
     # print ("SETEO OBSERVACION A NULL")
     # num_docs= ""

  # print ("DESCRIP_ART "+num_docs)

  if (coduni != 'N/A'):
     sql = "INSERT INTO renglonespedpro (codemp,tiptra,numtra,numren,codart,nomart,coduni,cantid,preuni,totren,codiva,codcen,desren,acumula,num_docs) values('{}','{}','{}',{},'{}','{}','{}','{}','{}',{},'{}','{}',{},{},'{}')"\
        .format(codemp,TIPTRA,NUMTRA,numren,codart,nomart,coduni,cantid,preuni,totren,codiva,codcen,desren,acumula,num_docs)
  else:
     sql = "INSERT INTO renglonespedpro (codemp,tiptra,numtra,numren,codart,nomart,cantid,preuni,totren,numite,codiva,codcen,desren,acumula,num_docs) values('{}','{}','{}',{},'{}','{}','{}','{}',{},'{}','{}','{}',{},{},'{}')"\
        .format(codemp,TIPTRA,NUMTRA,numren,codart,nomart,cantid,preuni,totren,datos['numite'],codiva,codcen,desren,acumula,num_docs)
		

 # if (coduni != 'N/A'):
     # sql = "INSERT INTO renglonespedpro (codemp,tiptra,numtra,numren,codart,nomart,coduni,cantid,preuni,totren,codiva,codcen,desren,acumula,num_docs) values('{}','{}','{}',{},'{}','{}','{}','{}','{}',{},'{}','{}',{},{},'{}')"\
        # .format(codemp,TIPTRA,NUMTRA,numren,codart,nomart,coduni,cantid,preuni,totren,codiva,codcen,desren,acumula,num_docs)
  # else:
     # sql = "INSERT INTO renglonespedpro (codemp,tiptra,numtra,numren,codart,nomart,cantid,preuni,totren,numite,codiva,codcen,desren,acumula,num_docs) values('{}','{}','{}',{},'{}','{}','{}','{}',{},'{}','{}','{}',{},{},'{}')"\
        # .format(codemp,TIPTRA,NUMTRA,numren,codart,nomart,cantid,preuni,totren,datos['numite'],codiva,codcen,desren,acumula,num_docs)
     

  print (sql) 
  curs.execute(sql)
  conn.commit()
  
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  
  d = {'status': 'INSERTADO RENGLON'}
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/generar_pedido_ruta', methods=['POST'])
def generar_pedido_ruta():
  datos = request.json
  print ("##########  ENTRADA GENERAR PEDIDO RUTA ######")
  print (datos)
  
  dateTimeObj = datetime.now()
  hora= dateTimeObj.strftime("%H:%M:%S")
  print (hora)

  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  sql = ''
  
  if (datos['existe_fecha_entrega']=='SI'):
    sql = "INSERT INTO pedido_ruta (empresa,numtra_pedido,fectra,hora,idruta,id_agencia,status_entrega,fecha_entrega,hora_entrega) values('{}','{}','{}','{}','{}','{}','{}','{}','{}')"\
          .format(datos['empresa'] ,datos['numtra_pedido'],datos['fectra'],hora,datos['idruta'],datos['id_agencia'],'POR PLANIFICAR',datos['fecha_entrega'],datos['hora_entrega'])

  if (datos['existe_fecha_entrega']=='NO'):
    sql = "INSERT INTO pedido_ruta (empresa,numtra_pedido,fectra,hora,idruta,id_agencia,status_entrega) values('{}','{}','{}','{}','{}','{}','{}')"\
          .format(datos['empresa'] ,datos['numtra_pedido'],datos['fectra'],hora,datos['idruta'],datos['id_agencia'],'POR PLANIFICAR')
   
  print (sql) 
  curs.execute(sql)
  conn.commit()
  
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  
  d = {'status': 'RUTA PEDIDO GENERADA'}
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/crear_nueva_agencia', methods=['POST'])
def crear_nueva_agencia():
  datos = request.json
  print ("##########  ENTRADA CREAR NUEVA AGENCIA ######")
  print (datos)
  
  # dateTimeObj = datetime.now()
  # hora= dateTimeObj.strftime("%H:%M:%S")
  # print (hora)

  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  
  sql = "insert into agencia_cliente(empresa,tipo_agencia,codcli,nomcli,dir_agencia,idruta) values('{}','{}','{}','{}','{}','{}')"\
        .format(datos['empresa'],datos['tipo_agencia'],datos['codcli'],datos['nomcli'],datos['dir_agencia'],datos['idruta'])

  print (sql) 
  curs.execute(sql)
  conn.commit()
  
  ### Para obtener la nueva secuencia..
  sql = """ select max(a1.id_agencia) as id_agencia from agencia_cliente a1 where a1.empresa='{}' """.format(datos['empresa'])
  curs = conn.cursor()
  curs.execute(sql)
  r = curs.fetchone()
  print (r)   
  next_id_agencia = ''
  if r[0]:
       next_id_agencia = str(r[0])
  # else:
       # next_id_agencia = str(1)
  
  
  
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  
  d = {'status': 'AGENCIA CREADA', 'id_agencia':next_id_agencia}
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
  
  
  

  
  
  
@app.route('/clientes', methods=['POST'])
def clientes():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos = ['codemp', 'nomcli','rucced','codcli','email','dircli','ciucli','telcli','telcli2','tipo']
  # sql = "select codemp,nombres, rucced, codcli,email,dircli,ciucli,telcli,telcli2 from clientes where codemp='{}' and rucced like '%{}%'".format(datos['codemp'],datos['ruc'])
  # sql = "select codemp,nombres, rucced, codcli,email,dircli,ciucli,telcli,telcli2 from clientes where codemp='{}' and rucced = '{}' and tpIdCliente='{}'".format(datos['codemp'],datos['ruc'],datos['tpIdCliente'])
  sql = "select codemp,nombres, rucced, codcli,email,dircli,ciucli,telcli,telcli2,tipo from clientes where codemp='{}' and rucced = '{}'".format(datos['codemp'],datos['ruc'],datos['tpIdCliente'])
  curs.execute(sql)
  print (sql)
  r = curs.fetchone()
  if r:
    d = dict(zip(campos, r))
  else:
    d = {'rucced': False}
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  

  
@app.route('/saldo_cartera', methods=['POST'])
def saldo_cartera():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos = ['saldo_cliente']
  # # sql = "select codemp,nombres, rucced, codcli,email,dircli,ciucli,telcli,telcli2 from clientes where codemp='{}' and rucced like '%{}%'".format(datos['codemp'],datos['ruc'])
  sql = "select f_saldo_clientes_pedidosweb ('{}','{}','{}') ".format(datos['codemp'],datos['codcli'],datos['fecha_cartera'])
  curs.execute(sql)
  r = curs.fetchone()
  if r:
    d = dict(zip(campos, r))
  else:
    d = {'rucced': False}
  # d = {'rucced': False}
  # print("CERRANDO SESION SIACI")
  # curs.close()
  # conn.close()
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/validar_exist_agencia', methods=['POST'])
def validar_exist_agencia():
    datos = request.json
    print (datos)
    try:
        conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
    except Exception as e:
        print (str(e))
    sql = """
          SELECT trim(r.codruta),r.descripcion,a.id_agencia,a.dir_agencia FROM agencia_cliente a, ruta r 
          where a.idruta=trim(r.codruta)
          and tipo_agencia='{}' and a.codcli='{}' and a.empresa='{}'
          """.format(datos['tipo_agencia'],datos['codcli'],datos['codemp'])
    curs = conn.cursor()
    curs.execute(sql)
    campos = ['idruta','nombre_ruta','id_agencia','dir_agencia']
    r = curs.fetchone()
    if r:
       d = dict(zip(campos, r))
    else:
       # sql = """ select max(a1.id_agencia)+1 as next_id_agencia from agencia_cliente a1 where a1.empresa='{}' """.format('02')
       # curs = conn.cursor()
       # curs.execute(sql)
       # r = curs.fetchone()
       # print (r)   
       # next_id_agencia = ''
       # if r[0]:
          # next_id_agencia = str(r[0])
       # else:
          # next_id_agencia = str(1)
		  
       d = {'idruta': False,'id_agencia':False}
    print("CERRANDO SESION SIACI")
    # regs = curs.fetchall()
    # arr_datos = [] 
    # for reg in regs:
        # datos_ppal = {}
        # datos_ppal['nombre_ruta'] = reg[0]
        # datos_ppal['dir_agencia'] = reg[1]
        # arr_datos.append(datos_ppal)

    curs.close()
    conn.close()
    response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
    response.headers['content-type'] = 'application/json'
    return(response)
	
@app.route('/get_sucursales', methods=['POST'])
def get_sucursales():
    datos = request.json
    print (datos)
    try:
        conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
    except Exception as e:
        print (str(e))
    sql = """
          SELECT dir_agencia,id_agencia FROM "DBA"."agencia_cliente" where tipo_agencia='{}' and idruta='{}' and codcli='{}' and empresa='{}'
          """.format(datos['tipo_agencia'],datos['idruta'],datos['codcli'],datos['empresa'])
    curs = conn.cursor()
    curs.execute(sql)
    # campos = ['idruta','nombre_ruta']
    regs = curs.fetchall()
    arr_datos = [] 
    for reg in regs:
        datos_rutas = {}
        datos_rutas['dir_agencia'] = reg[0]
        datos_rutas['id_agencia'] = reg[1]
        arr_datos.append(datos_rutas)
    # r = curs.fetchone()
    # if r:
       # d = dict(zip(campos, r))
    # else:
       # d = {'idruta': False,'id_agencia':False}
    print("CERRANDO SESION SIACI")
    
   
    curs.close()
    conn.close()

    response = make_response(dumps(arr_datos, sort_keys=False, indent=2, default=json_util.default))
    response.headers['content-type'] = 'application/json'
    return(response)

@app.route('/get_sucursal_pedido', methods=['POST'])
def get_sucursal_pedido():
    datos = request.json
    print (datos)
    try:
        conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
    except Exception as e:
        print (str(e))
    sql = """      
          select idruta,id_agencia,
          (select r.descripcion from ruta r where trim(r.codruta) = pr.idruta and r.codemp = pr.empresa) as ruta,
          (select dir_agencia ac from agencia_cliente ac where ac.empresa = pr.empresa and ac.id_agencia = pr.id_agencia) as dir_agencia,
		  DATEFORMAT(fecha_entrega, 'DD-MM-YYYY') as fecha_entrega_formateado,fecha_entrega,hora_entrega
          from pedido_ruta pr
          where pr.empresa = '{}'
          and pr.numtra_pedido = '{}'
          """.format(datos['codemp'],datos['pedido'])
    curs = conn.cursor()
    curs.execute(sql)
    campos = ['idruta','id_agencia','nombre_ruta','dir_agencia','fecha_entrega_formateado','fecha_entrega','hora_entrega']
    # regs = curs.fetchall()
    # arr_datos = [] 
    # for reg in regs:
        # datos_rutas = {}
        # datos_rutas['dir_agencia'] = reg[0]
        # datos_rutas['id_agencia'] = reg[1]
        # arr_datos.append(datos_rutas)
    
    r = curs.fetchone()
    if r:
       d = dict(zip(campos, r))
    else:
       d = {'idruta': False,'id_agencia':False}
    print("CERRANDO SESION SIACI")
    
   
    curs.close()
    conn.close()

    response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
    response.headers['content-type'] = 'application/json'
    return(response)
	
@app.route('/update_sucursal_pedido', methods=['POST'])
def update_sucursal_pedido():
    datos = request.json
    print ("**** DENTRO DE UPDATE SUCURSAL ****")
    print (datos)
    try:
        conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
    except Exception as e:
        print (str(e))
    sql = """      
           update pedido_ruta set idruta = '{}', id_agencia = '{}', fecha_entrega = '{}', hora_entrega = '{}' where numtra_pedido = '{}' and empresa='{}';
          """.format(datos['idruta'],datos['id_agencia'],datos['fecha_entrega'],datos['hora_entrega'],datos['numtra_pedido'],datos['empresa'])
    curs = conn.cursor()
    curs.execute(sql)
    conn.commit()
    d = {'resultado': 'exitoso'}
    print("CERRANDO SESION SIACI")
    
   
    curs.close()
    conn.close()

    response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
    response.headers['content-type'] = 'application/json'
    return(response)

	
@app.route('/get_pedidos_ruta', methods=['POST'])
def get_pedidos_ruta():
    datos = request.json
    print ("##### DENTRO DE PEDIDO RUTA PENDIENTE DE PLANIFICAR #####")
    print (datos)
    try:
        conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
    except Exception as e:
        print (str(e))
    sql = """
          select p.numtra_pedido,p.fectra,p.hora,r.descripcion, s.nomcli,s.dir_agencia,p.status_entrega,p.fecha_entrega,p.hora_entrega
          from pedido_ruta p,ruta r, agencia_cliente s,encabezadopedpro ep
          where p.idruta = trim(r.codruta)
          and s.id_agencia = p.id_agencia 
          and trim(r.codruta) = '{}'
          and p.empresa= '{}'
          and r.codemp = p.empresa
          and r.codemp= s.empresa
          and ep.codemp = p.empresa
          and ep.codemp = s.empresa
    --      and p.fectra = ep.fectra
          and ep.codcli = s.codcli
		  and p.numtra_pedido = ep.numtra
          and ep.estado <> 'A'
          and p.fecha_entrega is null
          order by p.fectra asc
          """.format(datos['idruta'],datos['empresa'])
    curs = conn.cursor()
    curs.execute(sql)
    print (sql)
    # campos = ['idruta','nombre_ruta']
    regs = curs.fetchall()
    arr_datos = [] 
    for reg in regs:
        datos_rutas = {}
        datos_rutas['numtra_pedido'] = reg[0]
        datos_rutas['fectra'] = reg[1]
        datos_rutas['hora'] = reg[2]
        datos_rutas['nombre_ruta'] = reg[3]
        datos_rutas['nomcli'] = reg[4]
        datos_rutas['dir_agencia'] = reg[5]
        datos_rutas['status_entrega'] = reg[6]
        arr_datos.append(datos_rutas)
    print("CERRANDO SESION SIACI")
    
   
    curs.close()
    conn.close()

    response = make_response(dumps(arr_datos, sort_keys=False, indent=2, default=json_util.default))
    response.headers['content-type'] = 'application/json'
    return(response)
	
@app.route('/get_pedidos_ruta_programada', methods=['POST'])
def get_pedidos_ruta_programada():
    datos = request.json
    print (datos)
    try:
        conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
    except Exception as e:
        print (str(e))
    # sql = """
          # select p.numtra_pedido,p.fectra,p.hora,r.nombre_ruta, s.nomcli,s.dir_agencia,p.status_entrega,p.fecha_entrega,p.hora_entrega
          # from pedido_ruta p,ruta_despacho r, agencia_cliente s
          # where p.idruta = r.idruta 
          # and s.id_agencia = p.id_agencia 
          # and r.idruta = '{}'
          # and p.empresa= '{}'
		  # and p.fecha_entrega is not null
          # order by fectra asc
          # """.format(datos['idruta'],datos['empresa'])
		  
    sql = """
          select p.numtra_pedido,p.fectra,p.hora,r.descripcion, s.nomcli,s.dir_agencia,p.status_entrega,p.fecha_entrega,p.hora_entrega
          from pedido_ruta p,ruta r, agencia_cliente s,encabezadopedpro ep
          where p.idruta = trim(r.codruta)
          and s.id_agencia = p.id_agencia 
          and trim(r.codruta) = '{}'
          and p.empresa= '{}'
          and r.codemp = p.empresa
          and r.codemp = s.empresa
          and ep.codemp = p.empresa
          and ep.codemp = s.empresa
       --   and p.fectra = ep.fectra
          and ep.codcli = s.codcli
		  and p.numtra_pedido = ep.numtra
          and ep.estado <> 'A'
		  and p.fecha_entrega is not null
          order by p.fectra asc
          """.format(datos['idruta'],datos['empresa'])
    curs = conn.cursor()
    print (sql)
    curs.execute(sql)
    # campos = ['idruta','nombre_ruta']
    regs = curs.fetchall()
    arr_datos = []
    print (regs)
    for reg in regs:
        datos_rutas = {}
        # datos_rutas['numtra_pedido'] = reg[0]
        # datos_rutas['fectra'] = reg[1]
        # datos_rutas['hora'] = reg[2]
        # datos_rutas['nombre_ruta'] = reg[3]
        # datos_rutas['nomcli'] = reg[4]
        # datos_rutas['dir_agencia'] = reg[5]
        # datos_rutas['status_entrega'] = reg[6]
		
        datos_rutas['title'] = reg[4]+"/"+reg[0]
        if (reg[8] == '00:00:00.000'):
            datos_rutas['start'] = reg[7]
        else:
            datos_rutas['start'] = reg[7]+"T"+reg[8]+"-05:00"
        # datos_rutas['end'] = reg[1]+"T"+reg[2]+"-05:00"
        # datos_rutas['nombre_ruta'] = reg[3]
        # datos_rutas['nomcli'] = reg[4]
        # datos_rutas['dir_agencia'] = reg[5]
        # datos_rutas['status_entrega'] = reg[6]
		# datos_rutas['fecha_entrega'] = reg[7]
		# datos_rutas['hora_entrega'] = reg[8]
		
		
        arr_datos.append(datos_rutas)
    print("CERRANDO SESION SIACI")
    
   
    curs.close()
    conn.close()

    response = make_response(dumps(arr_datos, sort_keys=False, indent=2, default=json_util.default))
    response.headers['content-type'] = 'application/json'
    return(response)
	
@app.route('/set_fecha_hora_pedido', methods=['POST'])
def set_fecha_hora_pedido():
    datos = request.json
    print (datos)
    print ("#####  DENTRO DE set_fecha_hora_pedido  ##### ")
    sql = """ update pedido_ruta p set p.fecha_entrega='{}',p.hora_entrega='{}' where p.empresa='{}' and p.numtra_pedido='{}'
          """.format(datos['fecha_entrega'],datos['hora_entrega'],datos['empresa'],datos['num_pedido'])
	
    if ((datos['accion'] == 'ARRASTRAR') and (datos['hora_entrega'] == '00:00:00')):
       print("##### CAMBIANDO FECHA ######")
       sql = """ update pedido_ruta p set p.fecha_entrega=DATE('{}')+1,p.hora_entrega='{}' where p.empresa='{}' and p.numtra_pedido='{}'
             """.format(datos['fecha_entrega'],datos['hora_entrega'],datos['empresa'],datos['num_pedido'])

       
       
	
	
	
    try:
        conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
    except Exception as e:
        print (str(e))

    curs = conn.cursor()
    print (sql)
    curs.execute(sql)
    conn.commit()
    # campos = ['idruta','nombre_ruta']
    # regs = curs.fetchall()
    # arr_datos = [] 
    # for reg in regs:
        # datos_rutas = {}
        # datos_rutas['numtra_pedido'] = reg[0]
        # datos_rutas['fectra'] = reg[1]
        # datos_rutas['hora'] = reg[2]
        # datos_rutas['nombre_ruta'] = reg[3]
        # datos_rutas['nomcli'] = reg[4]
        # datos_rutas['dir_agencia'] = reg[5]
        # datos_rutas['status_entrega'] = reg[6]
        # arr_datos.append(datos_rutas)
    print("CERRANDO SESION SIACI")
    
   
    curs.close()
    conn.close()
    d = {'idruta': False,'id_agencia':False}

    response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
    response.headers['content-type'] = 'application/json'
    return(response)
	

	
@app.route('/get_rutas', methods=['POST'])
def get_rutas():
    datos = request.json
    print (datos)
    try:
        conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
    except Exception as e:
        print (str(e))
    sql = """
          SELECT trim(codruta),descripcion from ruta
          where codemp='{}'
          """.format(datos['codemp'])
    curs = conn.cursor()
    curs.execute(sql)
    # campos = ['idruta','nombre_ruta']
    regs = curs.fetchall()
    arr_datos = [] 
    for reg in regs:
        datos_rutas = {}
        datos_rutas['idruta'] = reg[0]
        datos_rutas['nombre_ruta'] = reg[1]
        arr_datos.append(datos_rutas)
    # r = curs.fetchone()
    # if r:
       # d = dict(zip(campos, r))
    # else:
       # d = {'idruta': False,'id_agencia':False}
    print("CERRANDO SESION SIACI")
    
   
    curs.close()
    conn.close()

    response = make_response(dumps(arr_datos, sort_keys=False, indent=2, default=json_util.default))
    response.headers['content-type'] = 'application/json'
    return(response)




@app.route('/clientes_nombre', methods=['POST'])
def clientes_nombre():
    datos = request.json
    print (datos)
    try:
        conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
    except Exception as e:
        print (str(e))
    sql = "select codcli, nombres from clientes where codemp= '{}' and nombres like'%{}%'".format(datos['codemp'],datos['patron'])
    curs = conn.cursor()
    curs.execute(sql)
    regs = curs.fetchall()
    curs.close()
    conn.close()
    arr_datos = [] 
    for reg in regs:
        datos_empresa = {}
        datos_empresa['codcli'] = reg[0]
        datos_empresa['nombres'] = reg[1]
        arr_datos.append(datos_empresa)
    
    response = make_response(dumps(arr_datos, sort_keys=False, indent=2, default=json_util.default))
    response.headers['content-type'] = 'application/json'
    return(response)
	
@app.route('/registrar_visita', methods=['POST'])
def registrar_visita():
    datos = request.json
    print (datos)
    dateTimeObj = datetime.now()
    timestampStr= dateTimeObj.strftime("%d-%b-%Y (%H:%M:%S)")
    hora= dateTimeObj.strftime("%H:%M:%S")
    print (timestampStr)
    print (hora)
	
    try:
        conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
        curs = conn.cursor()
    except Exception as e:
        print (str(e))
    sql = """
          insert into registro_visita (codemp,codusu,codven,nomven,fectra,hora,codcli,nomcli,latitud,longitud,direccion)
          values ('{}','{}',
          (SELECT v.codven FROM vendedorescob v, usuario u where v.codus1 = u.codus1 and v.codusu = u.codusu and u.codus1='{}' and u.codemp='{}'),
          (SELECT v.nomven FROM vendedorescob v, usuario u where v.codus1 = u.codus1 and v.codusu = u.codusu and u.codus1='{}' and u.codemp='{}')
          ,DATE('{}'),'{}','{}','{}','{}','{}','{}')
      """.format(datos['codemp'],datos['usuario'],datos['usuario'],datos['codemp'],datos['usuario'],datos['codemp'],datos['fectra'],hora,datos['codcli'],datos['nombres'],datos['latitud'],datos['longitud'],datos['direccion'])
    print (sql) 
    curs.execute(sql)
    conn.commit()

    curs.close()
    conn.close()
    
    d = {'status': 'REGISTRO EXITOSO'}
    response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
    response.headers['content-type'] = 'application/json'
    return(response)
  
  
@app.route('/crear_cliente', methods=['POST'])
def crear_cliente():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  
  
  
  ## SECUENCIA CLIENTE  ###
  sql = "select max(seccli)+1 from clientes where codemp='{}'".format(datos['codemp'])
  curs.execute(sql)
  r = curs.fetchone()
  # curs.close()
  codcli = str(r[0]).zfill(8)  ####COMPLETAR CON 0
  seccli = r[0]
  print (codcli)
  
  
  ##PARA OBTENER CODIGO DE VENDEDOR
  sql = "SELECT v.codven, v.nomven FROM vendedorescob v where  v.codus1='{}' and v.codemp='{}'"\
        .format(datos['codus1'],datos['codemp'])
  curs = conn.cursor()
  curs.execute(sql)
  r = curs.fetchone()
  if r:
    codven = r[0]
  else:
    codven = '01'

  # curs.close() 
  print (codven)
  
  ##PARA VER DUPLICADO DE CLIENTE
  sql = "select count(*) from clientes where  codemp= '{}' and rucced='{}'"\
        .format(datos['codemp'],datos['rucced'])
  curs = conn.cursor()
  curs.execute(sql)
  r = curs.fetchone()
  exist_cliente = r[0]
  print (exist_cliente)
  d=''
  datos['telcli2']= 'null'  if datos['telcli2'] == None else "'"+datos['telcli2']+"'"
  if (exist_cliente == 0):
      print ("###### CREO CLIENTE  ####")
      sql = """
      insert into clientes (codemp,codcli,nomcli,rucced,dircli,telcli,telcli2,estatus,apliva,limcre,lispre,codusu,fecult,ciucli,codven,email,seccli,tipo,nombres,codcla,tpIdCliente,tipovendedor)
      values ('{}','{}','{}','{}','{}','{}',{},'A',0,0,1,'{}',DATE('{}'),'{}','01','{}','{}','{}','{}','01','{}','G')
      """.format(datos['codemp'],codcli,datos['nomcli'],datos['rucced'],datos['dircli'],datos['telcli'],datos['telcli2'],datos['codus1'],datos['fectra'],datos['ciucli'],datos['email'],seccli,datos['tipo'],datos['nomcli'],datos['tpIdCliente'])
      print (sql) 
      curs.execute(sql)
      conn.commit()
      d = {'STATUS': 'EXITOSO'}
  else:
      print ("###### CLIENTE YA EXISTE ####")
      d = {'STATUS': 'DUPLICADO'}
  curs.close()
  conn.close()
  
  # d = {'rucced': 'true'}
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/actualizar_cliente', methods=['POST'])
def actualizar_cliente():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  
  datos['telcli2']= 'null'  if datos['telcli2'] == None else "'"+datos['telcli2']+"'"
	  
  print ("###### CREO CLIENTE  ####")
  sql = """
  update clientes set nomcli='{}',nombres='{}',dircli='{}', telcli='{}', telcli2={}, ciucli='{}', email='{}', rucced='{}', tpIdCliente='{}',tipo='{}'
  where codemp='{}' and codcli='{}'
  """.format(datos['nomcli'],datos['nomcli'],datos['dircli'],datos['telcli'],datos['telcli2'],datos['ciucli'],datos['email'],datos['rucced'],datos['tpIdCliente'],datos['tipo'],datos['codemp'],datos['codcli'])
  print (sql) 
  curs.execute(sql)
  conn.commit()
  d = {'STATUS': 'EXITOSO'}
  curs.close()
  conn.close()
  
  # d = {'rucced': 'true'}
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
 
 
@app.route('/cajapost', methods=['POST'] )
def cajapost():
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  string_campos = 'codemp, codalm, codcierre, fecdoc, hora, tipo, signo, descripcion, cantidad_tipo, codusu, fecult,valor_tipo,valor_total,cajero, tipo_caja, turno, codmon'
  arrdatos = request.json
  print ("####   ENTRADA CAJAPOST  ###")
  print (arrdatos)
  
  dateTimeObj = datetime.now()
  timestampStr= dateTimeObj.strftime("%d-%b-%Y (%H:%M:%S)")
  hora= dateTimeObj.strftime("%H:%M:%S")
  print (timestampStr)
  print (hora)
  
  
  # for datos in arrdatos:
    # datos['fecha'] = datetime.datetime.strptime(str(datos['fecha']), "%d-%m-%Y")
    # horatemp = str(datos['hora']['hour']) + ':' + str(datos['hora']['minute'])
    # datos['hora'] = datetime.datetime.strptime(horatemp, '%H:%M')
	
  sql = """insert into cierre_caja ({}) values('{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}')
  """.format(string_campos, arrdatos['codemp'], arrdatos['codalm'], arrdatos['codcierre'], arrdatos['fecdoc'], hora, arrdatos['tipo'], arrdatos['signo'],arrdatos['descripcion'], arrdatos['cantidad_tipo'], arrdatos['codusu'],arrdatos['fecult'],arrdatos['valor_tipo'],arrdatos['valor_total'] ,arrdatos['cajero'], arrdatos['tipo_caja'], arrdatos['turno'], arrdatos['codmon'] ) 
  curs = conn.cursor()
  curs.execute(sql)
  curs.close()
  curs.close()
  conn.commit()
  conn.close()
  resp = { 'msg': 'OK' }
  response = make_response(dumps(resp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
 
@app.route('/azip/<clave>', methods=['GET'])
def azip(clave):
  print(clave)
  # xml = str(xml).replace('\n','')
  clave = str(clave).replace('.zip','')
  
  with ZipFile(coneccion.imagenes + '\\' + clave + '.zip', 'w') as myzip:
    myzip.write(coneccion.imagenes + '\\' + clave + '.pdf')
    myzip.write(coneccion.imagenes + '\\' + clave + '.xml')
  print("AZIP ZIP")
  print(coneccion.imagenes + clave + '.zip')
  return send_from_directory(coneccion.imagenes, clave + '.zip')


#@app.route('/mail/<clave>/<correos>/<codemp>', methods=['GET'])
@app.route('/mail', methods=['POST'])
def mail():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  
  sql_smtp = "select servidor, cuentafe, passwordfe, port, auth, encrypt from emailsmtp where codemp='{}'".format(datos['codemp'])
  curs.execute(sql_smtp)
  smtp = curs.fetchone()
  curs.close()
  servidorsaliente = smtp[0]
  userid = smtp[1]
  password = smtp[2]
  port = smtp[3]
  auth = smtp[4]
  encrypt = smtp[5]
  correos = ''
  # servidorsaliente = 'mail.siaci.com.ec'
  # userid = 'cobranza@siaci.com.ec'
  # password = 'CobranzaSiaci2019'
  # port = 26
  # auth = 'Y'
  # encrypt = 'None'
  
  # sql = "select codemp, nomemp from empresa"
  # curs.execute(sql)
  # regs = curs.fetchall()
  # arrresp = []
  # for r in regs:
    # d = dict(zip(campos, r))
    # arrresp.append(d)
  
  ##PARA OBTENER CODIGO DE VENDEDOR 
  ##BLOQUE COMENTADO TEMPORALMENTE
  sql = "SELECT v.codven, nomven FROM vendedorescob v, usuario u where v.codus1 = u.codus1 and v.codusu = u.codusu and u.codus1='{}' and u.codemp='{}'"\
        .format(datos['usuario'],datos['codemp'])
  curs = conn.cursor()
  curs.execute(sql)
  r = curs.fetchone()
  
  codven = r[0]
  print ("COD VENDEDOR")
  print (codven)
  
  codusu = r[1]
  print ("CODUSU")
  print (codusu)
  
  # APP_PATH = os.getcwd()
  # print (APP_PATH)
  
  # generar_pdf = pdf.GEN_PDF()
  # resp_pdf = generar_pdf.gen_pdf(datos['codemp'],datos['num_ped'],datos['usuario'])
  
  sql = "select ISNULL(MAX(email),'NA') from nom_datins where codemp = '{}' and isnull(nivel,9) = 1;"\
  .format(datos['codemp'])
  curs = conn.cursor()
  curs.execute(sql)
  r = curs.fetchone()
  
  
  asunto = ''
  mensaje = ''
  nombrepdf = ''
  pdfPath  = ''
  resp =''
  
  if (datos['asunto'] == 'facturacion'):
    asunto = "SOLICITUD DEL FACTURACIÓN DEL PEDIDO N° "+datos['num_ped']
    mensaje = "Estimado(a) DEPARTAMENTO DE FACTURACIÓN."+ '\n\n' +"Por medio de la presente se solicita que el PEDIDO N° "+datos['num_ped']+" sea facturado al cliente "+datos['nomcli']+" registrado en el mencionado pedido, para su posterior despacho."+'\n\n'+"Esta solicitud fue generada por el vendedor "+codusu+" (Código "+codven+") por medio de nuestra plataforma SIACI WEB."+ '\n\n' +"Muchas Gracias por sus gestiones..!!!"+'\n\n'+"Desarrollado por SIACISOLUTIONS - www.siaci.com.ec - 026014727"	
    nombrepdf = 'NO_ADJUNTO'
	##AQUI VA CORREO DEL DEPARTAMENTO DE FACTURACION DE LA EMPRESA
    # correos = 'carlosledezma123@gmail.com;'
    
    sql = "select ISNULL(MAX(email),'NA') from nom_datins where codemp = '{}' and isnull(nivel,9) = 1;"\
    .format(datos['codemp'])
    curs = conn.cursor()
    curs.execute(sql)
    r = curs.fetchone()
    print ("CORREO FACTURACION DE BD")
	
	
    if (r[0] == 'NA'):
       print ("#### NO ESTA DEFINIDO CORREO DE FACTURACION EN SIACI, SE TOMA DEL ARCHIVO DE CONFIGURACION")
       correos = coneccion.CORREOS_DESTINO
       print (correos)
    else:
       print ("CORREO FACTURACION DENTRO DE SIACI")
       correos= r[0]
       print (correos)
	
    correosend = correo.CORREO()
    resp = correosend.enviar(servidorsaliente, port, userid, password, correos, pdfPath, nombrepdf,asunto, mensaje)
    resp = {'rucced': 'ENVIO EXITOSO'}
	
  elif(datos['asunto'] == 'pedido'):
####### GENERO EL PDF  ################################
    generar_pdf = pdf.GEN_PDF()
    resp_pdf = generar_pdf.gen_pdf(datos['codemp'],datos['num_ped'],datos['usuario'])
####### GENERO SETEO VALORES DE CORREO ################
    asunto = "NOTIFICACIÓN DE GENERACION DE PEDIDO N° "+datos['num_ped']
    mensaje = "Estimado(a) Cliente. "+ '\n\n' +"Adjunto sírvase de recibir su correspondiente PEDIDO N° "+datos['num_ped']+" levantado por vendedor "+codusu+" (Código "+codven+") a través de nuestra plataforma SIACI WEB."+ '\n\n' + "Gracias por su confianza." + '\n\n' + "Desarrollado por SIACISOLUTIONS - www.siaci.com.ec - 026014727"	
    pdfPath = 	APP_PATH+'\\PLANTILLA_PEDIDOS\\PEDIDO_'+datos['num_ped']+'_WEB.pdf'
    nombrepdf = 'PEDIDO_'+datos['num_ped']+'_WEB.pdf'
    correos = datos['email']
    sleep(1)
    correosend = correo.CORREO()
    resp = correosend.enviar(servidorsaliente, port, userid, password, correos, pdfPath, nombrepdf,asunto, mensaje)
    resp = {'rucced': 'ENVIO EXITOSO'}
    os.remove(APP_PATH+'\\PLANTILLA_PEDIDOS\\PEDIDO_'+datos['num_ped']+'_WEB.docx')
    os.remove(APP_PATH+'\\PLANTILLA_PEDIDOS\\PEDIDO_'+datos['num_ped']+'_WEB.pdf')
	
  elif(datos['asunto'] == 'pedido_act'):
####### GENERO EL PDF  ################################
    generar_pdf = pdf.GEN_PDF()
    resp_pdf = generar_pdf.gen_pdf(datos['codemp'],datos['num_ped'],datos['usuario'])
####### GENERO SETEO VALORES DE CORREO ################
    asunto = "NOTIFICACIÓN DE MODIFICACIÓN DE PEDIDO N°  "+datos['num_ped']
    mensaje = "Estimado(a) Cliente. "+ '\n\n' +"Adjunto sírvase de recibir su correspondiente PEDIDO N° "+datos['num_ped']+"  modificado por vendedor "+codusu+" (Código "+codven+") a través de nuestra plataforma SIACI WEB."+ '\n\n' + "Gracias por su confianza." + '\n\n' + "Desarrollado por SIACISOLUTIONS - www.siaci.com.ec - 026014727"	
    # clave = '2908201801179223913300120010010000026080000261118'
    # pdfPath = coneccion.imagenes + '\\' + clave + '.pdf'
    pdfPath = 	APP_PATH+'\\PLANTILLA_PEDIDOS\\PEDIDO_'+datos['num_ped']+'_WEB.pdf'
    # nombrepdf = clave + '.pdf'
    nombrepdf = 'PEDIDO_'+datos['num_ped']+'_WEB.pdf'
    correos = datos['email']
    sleep(1)
    correosend = correo.CORREO()
    resp = correosend.enviar(servidorsaliente, port, userid, password, correos, pdfPath, nombrepdf,asunto, mensaje)
    
    os.remove(APP_PATH+'\\PLANTILLA_PEDIDOS\\PEDIDO_'+datos['num_ped']+'_WEB.docx')
    os.remove(APP_PATH+'\\PLANTILLA_PEDIDOS\\PEDIDO_'+datos['num_ped']+'_WEB.pdf')
	
	
  elif(datos['asunto'] == 'orden_trabajo'):
####### GENERO EL PDF  ################################
    generar_pdf = pdf.GEN_PDF()
    resp_pdf = generar_pdf.gen_pdf_orden(datos['codemp'],datos['num_ped'],datos['usuario'])
	
####### GENERO SETEO VALORES DE CORREO ################
    asunto = "ORDEN DE TRABAJO REGISTRADA CON EXITO N°  "+datos['num_ped']
    mensaje = "Estimado(a) Cliente. "+ '\n\n' +"Adjunto sírvase de recibir su correspondiente ORDEN DE TRABAJO N° "+datos['num_ped']+" a través de nuestra plataforma SIACI WEB."+ '\n\n' + "Gracias por su confianza." + '\n\n' + "Desarrollado por SIACISOLUTIONS - www.siaci.com.ec - 026014727"	

    pdfPath = 	APP_PATH+'\\PLANTILLA_PEDIDOS\\ORDEN_'+datos['num_ped']+'_WEB.pdf'

    # pdfPath = 	APP_PATH+'\\ORDENES_TRABAJO\\ORDEN_MODELO_12345.pdf'
    # # nombrepdf = clave + '.pdf'
    nombrepdf = 'ORDEN_'+datos['num_ped']+'_WEB.pdf'
    # nombrepdf = 'NO_ADJUNTO'
    # nombrepdf = 'ORDEN_MODELO_12345.pdf'
	
	
    correos = datos['email']
    sleep(1)
    correosend = correo.CORREO()
    # resp = correosend.enviar(servidorsaliente, port, userid, password, correos, pdfPath, nombrepdf,asunto, mensaje)
    resp = correosend.enviar(servidorsaliente, port, userid, password, correos, pdfPath, nombrepdf,asunto, mensaje)
    
    os.remove(APP_PATH+'\\PLANTILLA_PEDIDOS\\ORDEN_'+datos['num_ped']+'_WEB.docx')
    os.remove(APP_PATH+'\\PLANTILLA_PEDIDOS\\ORDEN_'+datos['num_ped']+'_WEB.pdf')
  

  
  resp = {'rucced': 'ENVIO EXITOSO'}
  # sleep(1)
  # os.remove(APP_PATH+'\\PLANTILLA_PEDIDOS\\PEDIDO_'+datos['num_ped']+'_WEB.docx')
  # os.remove(APP_PATH+'\\PLANTILLA_PEDIDOS\\PEDIDO_'+datos['num_ped']+'_WEB.pdf')
  
  response = make_response(dumps(resp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
  
# @app.route('/caja/<codemp>/<codalm>/<codusu>')
@app.route('/caja', methods=['POST'])
def caja():

  datos = request.json
  print (datos)
  codemp = datos['codemp']
  codalm = datos['codalm']
  codusu = datos['codusu']
  
  print (codemp+" "+codalm+" "+codusu)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  sql_campos = 'nomcaj,numcaj'
  string_campos = 'nomcaj,numcaj'
  arr_campos = string_campos.split(',')
  ## ORIGINAL
  # sql = """select {} from cajapuntoventa where codalm <> '%' 
  # and codemp='{}' and codalm='{}' """.format(sql_campos, codemp, codalm)
  ## PARA LIDER SCHOOL
  sql = """select {} from cajapuntoventa c where c.codalm <> '%' 
  and c.codemp='{}' and c.codalm='{}'
  and c.numcaj = (SELECT v.codcaja FROM "DBA"."vendedorescob" v WHERE v.codus1='{}' and v.codemp='{}')
  """.format(sql_campos, codemp, codalm, codusu,codemp)
  print (sql)
  curs = conn.cursor()
  curs.execute(sql)
  regs = curs.fetchall()
  curs.close()
  curs.close()
  conn.close()
  resp = []
  for r in regs:
    d = dict(zip(arr_campos, r))
    resp.append(d)
  response = make_response(dumps(resp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  

@app.route('/almacen', methods=['POST'])  
# @app.route('/almacen/<codemp>/<codusu>')
def almacen():
  datos = request.json
  print ("#### ENTRADA ALMACEN  #######")
  print (datos)
  codemp = datos['codemp']
  codagencia = datos['codagencia']
  # codusu = datos['codusu']
  # print (datos['codusu'])
  print (datos['codemp'])
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  sql_campos = 'codalm,nomalm'
  string_campos = 'codalm,nomalm'
  arr_campos = string_campos.split(',') 
  sql = """select {} from almacenes where codalm<>'%' and codemp='{}' and agencia='{}'
  and (serie_factura is not null or trim(serie_factura) <> ' ')
  and cliente_relacionado is null
  """.format(sql_campos, codemp,codagencia)
  print (sql)
  curs = conn.cursor()
  curs.execute(sql)
  regs = curs.fetchall()
  curs.close()
  curs.close()
  conn.close()
  resp = []
  for r in regs:
    d = dict(zip(arr_campos, r))
    resp.append(d)
  response = make_response(dumps(resp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)

#########  SERVICIOS PARA MANEJAR DETALLE VEHICULO #######################

@app.route("/guardar_detalle_vehiculo", methods=['POST'])
def guardar_detalle_vehiculo():
  datos = request.json
  print ("ENTRADA GUARDAR DETALLE VEHICULO")
  print (datos)
  
  datos['antena'] = 1 if datos['antena'] else  0
  datos['encendedor'] = 1 if datos['encendedor'] else  0
  datos['llanta'] = 1 if datos['llanta'] else  0
  datos['radio'] = 1 if datos['radio'] else  0
  datos['moquetas'] = 1 if datos['moquetas'] else  0
  datos['gata'] = 1 if datos['gata'] else  0
  datos['plumas'] = 1 if datos['plumas'] else  0
  datos['espejos'] = 1 if datos['espejos'] else  0
  datos['herram'] = 1 if datos['herram'] else  0
  datos['extinguidor'] = 1 if datos['extinguidor'] else  0
  datos['combustible'] = 1 if datos['combustible'] else  0
  datos['triangulos'] = 1 if datos['triangulos'] else  0
  datos['llave_ruedas'] = 1 if datos['llave_ruedas'] else  0
  datos['seguro_aros'] = 1 if datos['seguro_aros'] else  0
  datos['compac'] = 1 if datos['compac'] else  0
  datos['botiquin'] = 1 if datos['botiquin'] else  0
  datos['signos'] = 1 if datos['signos'] else  0
  datos['tapacubos'] = 1 if datos['tapacubos'] else  0
  datos['tapagas'] = 1 if datos['tapagas'] else  0
  datos['alogenos'] = 1 if datos['alogenos'] else  0
  datos['matricula'] = 1 if datos['matricula'] else  0
  datos['cubresol'] = 1 if datos['cubresol'] else  0
  datos['alarma'] = 1 if datos['alarma'] else  0
  datos['controlpuerta'] = 1 if datos['controlpuerta'] else  0
  datos['pantallaradio'] = 1 if datos['pantallaradio'] else  0
  
  
  	# """.format(datos['antena'],datos['encendedor'],datos['llanta'],datos['radio'],
	# datos['moquetas'],datos['gata'],datos['plumas'],datos['espejos'],datos['herram'],datos['extinguidor'],
	# datos['combustible'],datos['triangulos'],datos['llave_ruedas'],datos['seguro_aros'],
	# datos['compac'],datos['botiquin'],datos['signos'],datos['tapacubos'],datos['tapagas'],
	# datos['alogenos'],datos['matricula'],datos['cubresol'],datos['alarma'],datos['controlpuerta'],
	# datos['pantallaradio'],'1',datos['codemp'],datos['numtra']
	# )
  # print (datos['antena'])
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  sql = "select * from detalle_vehiculo where codemp='{}' and numtra='{}'".format(datos['codemp'], datos['numtra'])
  curs = conn.cursor()
  curs.execute(sql)
  regs = curs.fetchall()
  
  if (regs):
    print ("SI HAY ORDEN, ACTALIZO")
    sql = """
    update detalle_vehiculo set 
    antena='{}',encendedor='{}',llanta='{}',radio='{}',moquetas='{}',gata='{}',plumas='{}',espejos='{}',
    herram='{}',extinguidor='{}', combustible='{}',triangulos='{}',llave_ruedas='{}',
    seguro_aros='{}',compac='{}',botiquin='{}',signos='{}',tapacubos='{}',tapagas='{}',
    alogenos='{}',matricula='{}',cubresol='{}',alarma='{}',controlpuerta='{}',pantallaradio='{}',
    num_tapacubos='{}'
	where codemp= '{}' and numtra='{}' and tiptra=7
	""".format(datos['antena'],datos['encendedor'],datos['llanta'],datos['radio'],
	datos['moquetas'],datos['gata'],datos['plumas'],datos['espejos'],datos['herram'],datos['extinguidor'],
	datos['combustible'],datos['triangulos'],datos['llave_ruedas'],datos['seguro_aros'],
	datos['compac'],datos['botiquin'],datos['signos'],datos['tapacubos'],datos['tapagas'],
	datos['alogenos'],datos['matricula'],datos['cubresol'],datos['alarma'],datos['controlpuerta'],
	datos['pantallaradio'],'0',datos['codemp'],datos['numtra']
	)
    print (sql) 
    curs.execute(sql)
    conn.commit()
    curs.close()
  
  
  # # set 
# # antena='{}',encendedor='{}',llanta='{}',radio='{}',moquetas='{}',gata='{}',plumas='{}',
# # herram='{}',extinguidor='{}', combustible='{}',triangulos='{}',llave_ruedas='{}',
# # seguro_aros='{}',compac='{}',botiquin='{}',signos='{}',tapacubos='{}',tapagas='{}'
# # alogenos='{}',matricula='{}',cubresol='{}',alarma='{}',controlpuerta='{}',pantallaradio='{}'
# # num_tapacubos='{}'
      

  else:
    print ("NO HAY ORDEN, CREO EL DETALLE VEHICULO")
    sql = """
    insert into	detalle_vehiculo
    (antena,encendedor,llanta,radio,moquetas,gata,plumas,espejos,herram,extinguidor,combustible,triangulos,llave_ruedas,
    seguro_aros,compac,botiquin,signos,tapacubos,tapagas, alogenos,matricula,cubresol,alarma,controlpuerta,pantallaradio,
    num_tapacubos,codemp,tiptra,codigo,numtra)values
	('{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}',
	'{}','{}','{}','{}','{}','{}','{}','{}','7','1','{}')
    """.format(datos['antena'],datos['encendedor'],datos['llanta'],datos['radio'],
	datos['moquetas'],datos['gata'],datos['plumas'],datos['espejos'],datos['herram'],datos['extinguidor'],
	datos['combustible'],datos['triangulos'],datos['llave_ruedas'],datos['seguro_aros'],
	datos['compac'],datos['botiquin'],datos['signos'],datos['tapacubos'],datos['tapagas'],
	datos['alogenos'],datos['matricula'],datos['cubresol'],datos['alarma'],datos['controlpuerta'],
	datos['pantallaradio'],'0',datos['codemp'],datos['numtra'])
    print (sql) 
    curs.execute(sql)
    conn.commit()
    curs.close()
     
  
	  
  result = {'resultado': 'exitoso'} 
  response = make_response(dumps(result, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
  
@app.route("/get_detalle_vehiculo", methods=['POST'])
def get_detalle_vehiculo():
  datos = request.json
  print ("##### ENTRADA GET DETALLE VEHICULO #######")
  print (datos)

  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  sql = """select antena, encendedor,llanta,radio,moquetas,gata,plumas,espejos,
  herram,extinguidor,combustible,triangulos,llave_ruedas,seguro_aros,compac,botiquin,
  signos,tapacubos,tapagas,alogenos,matricula,cubresol,alarma,controlpuerta,
  pantallaradio,num_tapacubos
  from detalle_vehiculo where codemp='{}' and numtra='{}'""".format(datos['codemp'], datos['numtra'])
  curs = conn.cursor()
  curs.execute(sql)
  regs = curs.fetchone()
  campos = ['antena', 'encendedor','llanta','radio','moquetas','gata','plumas','espejos','herram','extinguidor','combustible','triangulos','llave_ruedas','seguro_aros','compac','botiquin','signos','tapacubos','tapagas','alogenos','matricula','cubresol','alarma','controlpuerta','pantallaradio','num_tapacubos']
  
  # ('1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '0', '0', '1', '1', '1', '0', '1', '0', '0', '0', '0', '0', '0', '0', '0', 0)
 
  if (regs):
    print (regs)
	# regs['antena'] = 1 if datos['antena'] else  0
    result = dict(zip(campos, regs))
  else:
    result = {'resultado': 'no hay detalles registrados'} 

  response = make_response(dumps(result, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
#########  SERVICIOS PARA MANEJAR DATOS VEHICULO #######################

@app.route("/guardar_datos_vehiculo", methods=['POST'])
def guardar_datos_vehiculo():
  datos = request.json
  print ("ENTRADA GUARDAR DATOS VEHICULO")
  print (datos)

  # datos['numche'] = 'null'

  datos['marca'] = "'"+datos['marca']+"'" if datos['marca'] != '' else  'null'
  datos['modelo'] = "'"+datos['modelo']+"'" if datos['modelo'] != '' else  'null'
  datos['chasis'] = "'"+datos['chasis']+"'"  if datos['chasis'] != '' else  "'[NN]'"
  datos['motor'] = "'"+datos['motor']+"'"  if datos['motor'] != '' else  "'[NN]'"
  datos['color'] = "'"+datos['color']+"'"  if datos['color'] != '' else  'null'
  datos['ano'] = "'"+str(datos['ano'])+"'"  if datos['ano'] != '' else  'null'
  datos['ram'] = "'"+datos['ram']+"'"  if datos['ram'] != '' else  'null'
  datos['paisorigen'] = "'"+datos['paisorigen']+"'"  if datos['paisorigen'] != '' else  'null'
  datos['combustible'] = "'"+datos['combustible']+"'"  if datos['combustible'] != '' else  'null'
  datos['klm'] = "'"+str(datos['klm'])+"'" if datos['klm']  != '' else  'null'
  datos['cilindraje'] = "'"+str(datos['cilindraje'])+"'"  if datos['cilindraje'] != '' else  'null'
  datos['pasajeros'] = "'"+str(datos['pasajeros'])+"'"  if datos['pasajeros'] != '' else  'null'
  datos['clase'] = "'"+datos['clase']+"'"  if datos['clase'] != '' else  'null'
  datos['subclase'] = "'"+datos['subclase']+"'"  if datos['subclase'] != '' else  'null'
  datos['torque'] = "'"+datos['torque']+"'"  if datos['torque'] != '' else  'null'
  datos['caja'] = "'"+datos['caja']+"'"  if datos['caja'] != '' else  'null'

  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  sql = "select * from adicionales where codemp='{}' and codart='{}' and ot=7".format(datos['codemp'], datos['codart'])
  curs = conn.cursor()
  curs.execute(sql)
  regs = curs.fetchall()
  
  if (regs):
    print ("SI HAY ORDEN, ACTALIZO")
	
	# (marca,modelo,chasis,motor,color,ano,ram,paisorigen,combustible,klm,cilindarje,pasajeros,
    # clase,subclase,torque,caja,codart,codemp,ot)
	
	
    sql = """
    update adicionales set 
    marca={},modelo={},chasis={},motor={},color={},ano={},ram={},paisorigen={},
    combustible={},klm={}, cilindarje={},pasajeros={},clase={},
    subclase={},torque={},caja={} where codart= '{}' and codemp='{}' and ot=7
	""".format(datos['marca'],datos['modelo'], datos['chasis'] , datos['motor'], datos['color'], datos['ano'],datos['ram'],
    datos['paisorigen'] ,datos['combustible'] ,datos['klm'], datos['cilindraje'] ,datos['pasajeros'],
    datos['clase'], datos['subclase'] , datos['torque'] ,datos['caja'] ,datos['codart'],datos['codemp'] ,7)
    print (sql) 
    curs.execute(sql)
    conn.commit()
    curs.close()
  

      

  else:
    print ("NO HAY ORDEN, CREO EL DETALLE VEHICULO")
	
    sql = """
    insert into	adicionales
    (marca,modelo,chasis,motor,color,ano,ram,paisorigen,combustible,klm,cilindarje,pasajeros,
    clase,subclase,torque,caja,codart,codemp,ot)values
	({},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},'{}','{}','{}')
    """.format(datos['marca'],datos['modelo'], datos['chasis'] , datos['motor'], datos['color'], datos['ano'],datos['ram'],
    datos['paisorigen'] ,datos['combustible'] ,datos['klm'], datos['cilindraje'] ,datos['pasajeros'],
    datos['clase'], datos['subclase'] , datos['torque'] ,datos['caja'] ,datos['codart'],datos['codemp'] ,7)
    print (sql) 
    curs.execute(sql)
    conn.commit()
    curs.close()
     
  
	  
  result = {'resultado': 'exitoso'} 
  response = make_response(dumps(result, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
    
  
@app.route("/get_datos_vehiculo", methods=['POST'])
def get_datos_vehiculo():
  datos = request.json
  print ("##### ENTRADA GET DETALLE VEHICULO #######")
  print (datos)

  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  sql = """select marca,modelo,chasis,motor,color,ano,ram,paisorigen,combustible,klm,cilindarje,pasajeros,
  clase,subclase,torque,caja
  from adicionales where codemp='{}' and codart='{}' and ot='7' """.format(datos['codemp'], datos['codart'])
  curs = conn.cursor()
  curs.execute(sql)
  regs = curs.fetchone()
  campos = ['marca','modelo','chasis','motor','color','ano','ram','paisorigen','combustible','klm','cilindarje','pasajeros','clase','subclase','torque','caja']
  
  # ('1', '0', '0', '0', '0', '1', '0', '1', '0', '0', '0', '0', '1', '1', '1', '0', '1', '0', '0', '0', '0', '0', '0', '0', '0', 0)
 
  if (regs):
    print (regs)
	# regs['antena'] = 1 if datos['antena'] else  0
    result = dict(zip(campos, regs))
  else:
    result = {'resultado': 'no hay detalles registrados'} 

  response = make_response(dumps(result, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
  
@app.route("/upload_imagen_art_serv", methods=['POST'])
def upload_imagen_art_serv():
 if request.method == 'POST':
  datos = request
 
  print (request)
  print (request.form)
 

  # numtra = request.form["dir"][3:]
  codemp = request.form["codemp"]
  codart = request.form["codart"]
  
  print (request.form["codemp"])
  print (request.form["codart"])
  # print (codemp)
  print (request.files)
  print (request.files['uploads'])
  
  f = request.files['uploads']
  filename = secure_filename(f.filename)
  directorio = app.config['UPLOAD_FOLDER_ARTICULOS']

  
  # # if not (os.path.isdir(app.config['UPLOAD_FOLDER_ARTICULOS']):
     # # os.mkdir(app.config['UPLOAD_FOLDER_ARTICULOS'])
  f.save(os.path.join(directorio, filename))
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  sql = """ update articulos set grafico = '{}' where codemp = '{}' and codart='{}'
  """.format(directorio+'\\'+filename,codemp,codart)
  print (sql) 
  curs = conn.cursor()
  curs.execute(sql)
  conn.commit()
  curs.close()
  
  result = {'resultado': 'Archivo subido exitosamente'} 
  response = make_response(dumps(result, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)




@app.route("/uploader", methods=['POST'])
def uploader():
 if request.method == 'POST':
  # obtenemos el archivo del input "archivo"
  datos = request
  # directorio = 'datos'
  # datos['dir']
  
  # dest = APP_PATH+'\\GENERADOS\\'+recv['NUMERO_AUTORIZACION']+'.pdf'
				# print ('########  CONVERTIDOR PDF INSTANCIADO PARA CONVERTIR COMPROBANTE: '+recv['COMPROBANTE']+'########')
				# exitoso = 0
				# while True:
					# try:
						# if os.path.isdir(dest):
  
  
  print (request)
  print (request.form)
  print (request.form["dir"])
  numtra = request.form["dir"][3:]
  codemp = request.form["dir"][:2]
  print (numtra)
  print (codemp)
  print (request.files)
  print (request.files['uploads'])
  
  f = request.files['uploads']
  filename = secure_filename(f.filename)
  directorio = request.form["dir"]
  
  
  # Guardamos el archivo en el directorio "Archivos PDF"
  
  if not (os.path.isdir(app.config['UPLOAD_FOLDER']+'\\'+directorio)):
     os.mkdir(app.config['UPLOAD_FOLDER']+'\\'+directorio)
  f.save(os.path.join(app.config['UPLOAD_FOLDER']+'\\'+directorio, filename))
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  
  sql = """
  select  cname
  from    SYS.SYSCOLUMNS
  where   tname = 'imagen_orden'
  and     cname like 'imagen%'
   """
  print (sql) 
  curs = conn.cursor()
  curs.execute(sql)
  regs = curs.fetchall()
  arrresp = []
  imagen_escoger = ''
  for r in regs:
    print (r)
    sql = """
    SELECT {} FROM "DBA"."imagen_orden" where numtra='{}' and codemp='{}'
    """.format(r[0],numtra,codemp)
    curs = conn.cursor()
    curs.execute(sql)
    imagen = curs.fetchone()
    if imagen:
        if (imagen[0] == None):
           imagen_escoger = r[0]
           print (imagen_escoger) 
           break
    else:
       imagen_escoger = 'imagen1'

  
  if (imagen_escoger):
     if (imagen_escoger == 'imagen1'):
        sql = """
        insert into imagen_orden
        (codemp,tiptra,numtra,{})values
        ('{}',{},'{}','{}')
         """.format(imagen_escoger,codemp,7,numtra,app.config['UPLOAD_FOLDER']+'\\'+directorio+'\\'+filename)
        print (sql) 
        curs = conn.cursor()
        curs.execute(sql)
        conn.commit()
     else :
        sql = """
        update imagen_orden set {} = '{}' where codemp = '{}' and numtra ='{}' and tiptra=7
        """.format(imagen_escoger,app.config['UPLOAD_FOLDER']+'\\'+directorio+'\\'+filename,codemp,numtra)
        print (sql) 
        curs = conn.cursor()
        curs.execute(sql)
        conn.commit()

  curs.close()
  
  
  result = {'resultado': 'Archivo subido exitosamente'} 
  response = make_response(dumps(result, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
  
#########  SERVICIOS PARA MANEJAR DETALLE VEHICULO #######################
  
@app.route("/lista_img", methods=['POST'])
def lista_img():
  datos = request.json
  directorio = datos['dir']
  campos = ['nombre', 'src']
  arr_img = []
  print (app.config['UPLOAD_FOLDER'])
  
          # if ((not recv) or (not (recv['result']['code'] in ['000.100.110', '000.100.112', '000.000.000']))):
  extensions = ("*.png","*.jpg","*.jpeg",)
  # for f in glob.glob(app.config['UPLOAD_FOLDER']+'\\'+directorio+'\\*'):
  for extension in extensions:
     for f in glob.glob(app.config['UPLOAD_FOLDER']+'\\'+directorio+'\\'+extension):
         print (f)
         arr_path_img = f.split('\\')
         img_name = arr_path_img[-1]
         img = (img_name,'assets/img_talleres/'+directorio+'/'+img_name)
         # print (f)
         # print (img_name)
         a = dict(zip(campos, img))
         arr_img.append(a)
  # print (arr_img)
	  
  # result = {'resultado': 'imagenes'} 
  response = make_response(dumps(arr_img, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route("/lista_audios", methods=['POST'])
def lista_audios():
  datos = request.json
  directorio = datos['dir']
  campos = ['nombre', 'src']
  arr_img = []
  print (app.config['UPLOAD_FOLDER'])
  
          # if ((not recv) or (not (recv['result']['code'] in ['000.100.110', '000.100.112', '000.000.000']))):
  extensions = ("*.ogg",)
  # for f in glob.glob(app.config['UPLOAD_FOLDER']+'\\'+directorio+'\\*'):
  for extension in extensions:
     for f in glob.glob(app.config['UPLOAD_FOLDER']+'\\'+directorio+'\\'+extension):
         print (f)
         arr_path_img = f.split('\\')
         img_name = arr_path_img[-1]
         img = (img_name,'assets/img_talleres/'+directorio+'/'+img_name)
         # print (f)
         # print (img_name)
         a = dict(zip(campos, img))
         arr_img.append(a)
  # print (arr_img)
	  
  # result = {'resultado': 'imagenes'} 
  response = make_response(dumps(arr_img, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
  

@app.route("/eliminar_imagen", methods=['POST'])
def eliminar_imagen():
  datos = request.json
  
  print ("###### DATOS DE IMAGEN A ELIMINAR ######")
  print (datos)


  f = app.config['UPLOAD_FOLDER']+'\\'+datos['dir']+'\\'+datos['nombre']
  os.remove(f)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  sql = """
  select  cname
  from    SYS.SYSCOLUMNS
  where   tname = 'imagen_orden'
  and     cname like 'imagen%'
   """
  print (sql) 
  curs = conn.cursor()
  curs.execute(sql)
  regs = curs.fetchall()

  for r in regs:
    print (r)
    sql = """
    SELECT {} FROM "DBA"."imagen_orden" where {} like '%{}%' and codemp='{}' and numtra='{}'
    """.format(r[0],r[0],datos['nombre'],datos['codemp'],datos['numtra'])
    curs = conn.cursor()
    curs.execute(sql)
    print (sql)
    image_name = curs.fetchone()
    print (image_name)
    if image_name:
       sql = """
       UPDATE imagen_orden SET {}= null WHERE codemp='{}' AND numtra = '{}'
       """.format(r[0],datos['codemp'],datos['numtra'])
       print (sql)
       curs = conn.cursor()
       curs.execute(sql)
       conn.commit()
  
  ######### VALIDAR SI TODAS LAS IMAGENES ESTAN EN NULL PARA ELIMINAR EL REGISTRO ######

  sql = """
  SELECT count(*) FROM "DBA"."imagen_orden" where 
  numtra='{}'
  and codemp='{}'
  and imagen1 is null 
  and imagen2 is null
  and imagen3 is null
  and imagen4 is null
  and imagen5 is null
  """.format(datos['numtra'],datos['codemp'])
  curs = conn.cursor()
  curs.execute(sql)
  print (sql)
  count = curs.fetchone()
  print (count)
  if (count[0] == 1):
     sql = """
     DELETE imagen_orden WHERE codemp='{}' AND numtra = '{}'
     """.format(datos['codemp'],datos['numtra'])
     print (sql)
     curs = conn.cursor()
     curs.execute(sql)
     conn.commit()
  
  

  curs.close()

  result = {'resultado': 'Archivo subido exitosamente'} 
  response = make_response(dumps(result, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route("/eliminar_audio", methods=['POST'])
def eliminar_audio():
  datos = request.json
  print (datos)
  # for f in glob.glob(app.config['UPLOAD_FOLDER']+'\\'+datos['nombre']):
  f = app.config['UPLOAD_FOLDER']+'\\'+datos['dir']+'\\'+datos['nombre']
  os.remove(f)

  result = {'resultado': 'Archivo eliminado exitosamente'} 
  response = make_response(dumps(result, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
  
@app.route("/tipo_inventarios", methods=['POST'])
def tipo_inventarios():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos = ['codemp', 'codgeo','nomgeo']
  sql = "SELECT codtipo,descripcion,tipo FROM tipo_inventarios where codemp='{}' and tipo = 'E' and codalm='01' and codtipo = 'E'".format(datos['codemp'])
  curs.execute(sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    d = dict(zip(campos, r))
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)


############ FIN SERVICIOS PARA MANEJAR SUBIDA DE IMAGENES  ############


@app.route('/busqueda_proveedor', methods=['POST'])
def busqueda_proveedor():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  # campos = ['nomcli', 'rucced','tpIdCliente','email','dircli','codcli']
  campos = ['nompro', 'rucced','tipo_identifica','email','dirpro','codpro']
  # sql = "select codart, nomart, round(prec01, 2), (exiact-(select case when sum(cantid) is null then 0 else sum(cantid) end  as sum from v_exitencias_pedpro where codemp = '{}' and codart like '%{}%')) as exiact,coduni,punreo,codiva  from articulos where (nomart like '%{}%' or codart like '%{}%') and codemp = '{}' order by nomart asc".format(datos['codemp'],datos['nomart'],datos['nomart'],datos['nomart'],datos['codemp'])
  
  sql = "select p.nompro,p.rucced,p.tipo_identifica,p.email,p.dirpro,p.codpro from proveedores p where p.codemp = '{}' and p.nompro like '%{}%' order by p.nompro asc".format(datos['codemp'],datos['patron_proveedor'])
  curs.execute(sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    d = dict(zip(campos, r))
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
  
@app.route('/generar_encabezado_ingreso_bodega', methods=['POST'])
def generar_encabezado_ingreso_bodega():
  datos = request.json
  print ("##########  ENTRADA GENERAR PEDIDOS ######")
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
 
  
  sql = "SELECT seccue FROM secuencias where codalm= (SELECT AGENCIA FROM ALMACENES WHERE CODEMP='{}' AND CODALM='{}') and codsec = \'CP_ING\' and codemp='{}'".format(datos['codemp'],datos['codalm'],datos['codemp'])
  curs.execute(sql)
  r = curs.fetchone()
  print (r)
  print (sql)

  if (r):
    NEXT_NUMTRA=r[0]
    datos['orden_produccion']= 'null'  if datos['orden_produccion'] == None else "'"+datos['orden_produccion']+"'"
    datos['observ']= 'null'  if datos['observ'] == None else "'"+datos['observ']+"'"

  
    sql = """INSERT INTO encabezadoingresos (codemp,numfac,codpro,fecfac,observ,codmon,valcot,codalm,conpag,codusu,fecult,estado,
         totfac,codcom,externo,numtra) 
         values('{}','{}','{}','{}',{},'{}','{}','{}','{}','{}','{}','{}',{},'{}',{},{})""".format(datos['codemp'],NEXT_NUMTRA,datos['codpro'],datos['fecfac'],datos['observ'],'01','01',datos['codalm'],datos['conpag'],datos['codusu'],datos['fecfac'],'N',datos['totfac'],'03',1,datos['orden_produccion'])

    print (sql) 
    curs.execute(sql)
    conn.commit()
	
    if datos['orden_produccion'] == 'null':
       sql = """update encabezadoordcom oc set estado = 'I' where codemp = '{}' and numtra= '{}'  """.format(datos['codemp'],datos['orden_compra'])
       print (sql) 
       curs.execute(sql)
       conn.commit()
  
  
    print ("PARA OBTENER SECUENCIA  NUEVA DE PEDIDOS")
    print (NEXT_NUMTRA)
    print (len(NEXT_NUMTRA))
    print (int(NEXT_NUMTRA)+1)
    print (str((int(NEXT_NUMTRA)+1)).zfill(len(NEXT_NUMTRA)))
    numfac_nueva = str((int(NEXT_NUMTRA)+1)).zfill(len(NEXT_NUMTRA))
  
    # sql = "update secuencias set seccue = seccue+1 where codalm=\'01\' and codsec = \'VC_PED\' and codemp='{}'".format(datos['codemp'])
    sql = "update secuencias set seccue = '{}' where codalm=(SELECT AGENCIA FROM ALMACENES WHERE CODEMP='{}' AND CODALM='{}') and codsec = 'CP_ING' and codemp='{}'".format(numfac_nueva,datos['codemp'],datos['codalm'],datos['codemp'])
    curs.execute(sql)
    conn.commit()
  
    print("CERRANDO SESION SIACI")
    curs.close()
    conn.close()
    d = {'status': 'INSERTADO CON EXITO','numtra': NEXT_NUMTRA}
  else:
    d = {'status': 'AGENCIA NO POSEE SECUENCIA PARA INGRESOS DEFINIDA','numtra': '00000000'}
  

  # d = {'status': 'INSERTADO CON EXITO','numtra': NEXT_NUMTRA}
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/generar_encabezado_ingreso_bodega_simple', methods=['POST'])
def generar_encabezado_ingreso_bodega_simple():
  datos = request.json
  print ("##########  ENTRADA GENERAR PEDIDOS ######")
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
 
  
  sql = "SELECT seccue FROM secuencias where codalm= (SELECT AGENCIA FROM ALMACENES WHERE CODEMP='{}' AND CODALM='{}') and codsec = \'CP_ING\' and codemp='{}'".format(datos['codemp'],datos['codalm'],datos['codemp'])
  curs.execute(sql)
  r = curs.fetchone()
  print (r)
  print (sql)

  if (r):
    NEXT_NUMTRA=r[0]
    # datos['orden_produccion']= 'null'  if datos['orden_produccion'] == None else "'"+datos['orden_produccion']+"'"
    datos['observ']= 'null'  if datos['observ'] == None else "'"+datos['observ']+"'"

  
    sql = """INSERT INTO encabezadoingresos (codemp,numfac,codpro,fecfac,observ,codmon,valcot,codalm,conpag,codusu,fecult,estado,
         totfac,codcom,externo) 
         values('{}','{}','{}','{}',{},'{}','{}','{}','{}','{}','{}','{}',{},'{}',{})""".format(datos['codemp'],NEXT_NUMTRA,datos['codpro'],datos['fecfac'],datos['observ'],'01','01',datos['codalm'],datos['conpag'],datos['codusu'],datos['fecfac'],'N',datos['totfac'],'03',1)

    print (sql) 
    curs.execute(sql)
    conn.commit()
	
    # if datos['orden_produccion'] == 'null':
       # sql = """update encabezadoordcom oc set estado = 'I' where codemp = '{}' and numtra= '{}'  """.format(datos['codemp'],datos['orden_compra'])
       # print (sql) 
       # curs.execute(sql)
       # conn.commit()
  
  
    print ("PARA OBTENER SECUENCIA  NUEVA DE PEDIDOS")
    print (NEXT_NUMTRA)
    print (len(NEXT_NUMTRA))
    print (int(NEXT_NUMTRA)+1)
    print (str((int(NEXT_NUMTRA)+1)).zfill(len(NEXT_NUMTRA)))
    numfac_nueva = str((int(NEXT_NUMTRA)+1)).zfill(len(NEXT_NUMTRA))
  
    # sql = "update secuencias set seccue = seccue+1 where codalm=\'01\' and codsec = \'VC_PED\' and codemp='{}'".format(datos['codemp'])
    sql = "update secuencias set seccue = '{}' where codalm=(SELECT AGENCIA FROM ALMACENES WHERE CODEMP='{}' AND CODALM='{}') and codsec = 'CP_ING' and codemp='{}'".format(numfac_nueva,datos['codemp'],datos['codalm'],datos['codemp'])
    curs.execute(sql)
    conn.commit()
  
    print("CERRANDO SESION SIACI")
    curs.close()
    conn.close()
    d = {'status': 'INSERTADO CON EXITO','numtra': NEXT_NUMTRA}
  else:
    d = {'status': 'AGENCIA NO POSEE SECUENCIA PARA INGRESOS DEFINIDA','numtra': '00000000'}
  

  # d = {'status': 'INSERTADO CON EXITO','numtra': NEXT_NUMTRA}
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)


@app.route('/generar_renglones_ingreso_bodega', methods=['POST'])
def generar_renglones_ingreso_bodega():
  datos = request.json
  print ("##########  ENTRADA GENERAR PEDIDOS ######")
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
 
    
  sql = """INSERT INTO renglonesingresos (codemp,numfac,numren,numite,codart,nomart,coduni,cantid,preuni,desren,totren,codmon,valcot,totext,codcen,serie,prepub,peso,arancel,observaciones) 
         values('{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}')
		 """.format(datos['codemp'],datos['numfac'],datos['numren'],datos['numren'],datos['codart'],datos['nomart'],datos['coduni'],datos['cant'],datos['cospro'],
		 datos['punreo'],datos['subtotal_art'],'01','1',datos['subtotal_art'],'01.',datos['maneja_serie'],'0','0','0',datos['observ'])

  print (sql) 
  curs.execute(sql)
  conn.commit()
  
  sql = """DELETE serie_articulo WHERE numfac = '{}' and codemp = '{}'
		 """.format(datos['numfac'],datos['codemp'])
  print (sql) 
  curs.execute(sql)
  conn.commit()
  
  
  
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()

  d = {'status': 'INSERTADO CON EXITO'}
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/generar_renglones_ingreso_bodega_simple', methods=['POST'])
def generar_renglones_ingreso_bodega_simple():
  datos = request.json
  print ("##########  ENTRADA GENERAR RENGLONES SIMPLE ######")
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
 
    
  sql = """INSERT INTO renglonesingresos (codemp,numfac,numren,numite,codart,nomart,coduni,cantid,preuni,desren,totren,codmon,valcot,totext,codcen,serie,prepub,peso,arancel,observaciones) 
         values('{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}')
		 """.format(datos['codemp'],datos['numfac'],datos['numren'],datos['numren'],datos['codart'],datos['nomart'],datos['coduni'],datos['cant'],datos['cospro'],
		 datos['punreo'],datos['subtotal_art'],'01','1',datos['subtotal_art'],'01.',datos['maneja_serie'],'0','0','0',datos['observ'])

  print (sql) 
  curs.execute(sql)
  conn.commit()
  
  sql = """DELETE serie_articulo WHERE numfac = '{}' and codemp = '{}'
		 """.format(datos['numfac'],datos['codemp'])
  print (sql) 
  curs.execute(sql)
  conn.commit()
  
  
  
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()

  d = {'status': 'INSERTADO CON EXITO'}
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
  
@app.route('/guardar_series_ingreso_bodega', methods=['POST'])
def guardar_series_ingreso_bodega():
  datos = request.json
  print ("##########  ENTRADA GENERAR PEDIDOS ######")
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
 
    
  sql = """INSERT INTO serie_articulo (codemp,codalm,numfac,codclipro,codart,codserie,numserie,estado,tipo,cantid,disponible,numfac_org,feccad,posicion) 
         values('{}','{}','{}','{}','{}','{}','{}','{}','{}',{},{},'{}','{}','{}')
		 """.format(datos['codemp'],datos['codalm'],datos['numfac'],datos['codclipro'],datos['codart'],datos['codserie'],datos['serie'],datos['estado'],datos['tipo'],
		 datos['cant'],datos['disponible'],datos['numfac'],datos['caducidad'],datos['ubicacion'])

  print (sql) 
  curs.execute(sql)
  conn.commit()
  
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  
  # if r:
    # d = dict(zip(campos, r))
  # else:
    # d = {'rucced': False}
  d = {'status': 'INSERTADO CON EXITO'}
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
  
@app.route('/guardar_cod_barra_lote', methods=['POST'])
def guardar_cod_barra_lote():
  datos = request.json
  print ("##########  ENTRADA GENERAR PEDIDOS ######")
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  
  lote = datos['serie']
  caducidad = (datos['caducidad'].replace('-',''))[2:8]
  print (lote)
  print (caducidad)
  
###################   CONF MAT PRIMA   ##################
  INICIO_COD_PRIMA=''
  LONGITUD_COD_PRIMA=''
  INICIO_CADUCIDAD_PRIMA=''
  LONGITUD_CADUCIDAD_PRIMA=''
  INICIO_LOTE_PRIMA=''
  LONGITUD_LOTE_PRIMA=''

###################  CONF PROD TERMINADO  ##################
  INICIO_COD_TERMINADO=''
  LONGITUD_COD_TERMINADO=''
  INICIO_CADUCIDAD_TERMINADO=''
  LONGITUD_CADUCIDAD_TERMINADO=''
  INICIO_LOTE_TERMINADO=''
  LONGITUD_LOTE_TERMINADO=''
 
  PATH_CONFIG = APP_PATH+'\\CONF_CODBARRAS.txt'
  
  if os.path.isfile(PATH_CONFIG):
     config = open(PATH_CONFIG,"r")
     for linea in config.readlines():
        if (datos['nombre_almacen'] == 'Materia prima'):
           pattern_cod = re.compile(r'INICIO_COD_PRIMA=')
           pattern_long_cod = re.compile(r'LONGITUD_COD_PRIMA=')
           pattern_cad = re.compile(r'INICIO_CADUCIDAD_PRIMA=')
           pattern_long_cad = re.compile(r'LONGITUD_CADUCIDAD_PRIMA=')
           pattern_cod_lote = re.compile(r'INICIO_LOTE_PRIMA=')
           pattern_long_lote = re.compile(r'LONGITUD_LOTE_PRIMA=')
           if pattern_cod.match(linea):
              linea_array = linea.split('=')
              INICIO_COD_PRIMA = linea_array [1].replace('\n','')
           if pattern_long_cod.match(linea):
              linea_array = linea.split('=')
              LONGITUD_COD_PRIMA = linea_array [1].replace('\n','')
           if pattern_cad.match(linea):
              linea_array = linea.split('=')
              INICIO_CADUCIDAD_PRIMA = linea_array [1].replace('\n','')
           if pattern_long_cad.match(linea):
              linea_array = linea.split('=')
              LONGITUD_CADUCIDAD_PRIMA = linea_array [1].replace('\n','')
           if pattern_cod_lote.match(linea):
              linea_array = linea.split('=')
              INICIO_LOTE_PRIMA = linea_array [1].replace('\n','')
           if pattern_long_lote.match(linea):
              linea_array = linea.split('=')
              LONGITUD_LOTE_PRIMA = linea_array [1].replace('\n','')
		   
        if (datos['nombre_almacen'] == 'Producto terminado'):
           pattern_cod = re.compile(r'INICIO_COD_TERMINADO=')
           pattern_long_cod = re.compile(r'LONGITUD_COD_TERMINADO=')
           pattern_cad = re.compile(r'INICIO_CADUCIDAD_TERMINADO=')
           pattern_long_cad = re.compile(r'LONGITUD_CADUCIDAD_TERMINADO=')
           pattern_cod_lote = re.compile(r'INICIO_LOTE_TERMINADO=')
           pattern_long_lote = re.compile(r'LONGITUD_LOTE_TERMINADO=')
           if pattern_cod.match(linea):
              linea_array = linea.split('=')
              INICIO_COD_TERMINADO = linea_array [1].replace('\n','')
           if pattern_long_cod.match(linea):
              linea_array = linea.split('=')
              LONGITUD_COD_TERMINADO = linea_array [1].replace('\n','')
           if pattern_cad.match(linea):
              linea_array = linea.split('=')
              INICIO_CADUCIDAD_TERMINADO = linea_array [1].replace('\n','')
           if pattern_long_cad.match(linea):
              linea_array = linea.split('=')
              LONGITUD_CADUCIDAD_TERMINADO = linea_array [1].replace('\n','')
           if pattern_cod_lote.match(linea):
              linea_array = linea.split('=')
              INICIO_LOTE_TERMINADO = linea_array [1].replace('\n','')
           if pattern_long_lote.match(linea):
              linea_array = linea.split('=')
              LONGITUD_LOTE_TERMINADO = linea_array [1].replace('\n','')
  config.close
  # else:
    # print ("### ARCHIVO CONFIG_API_WEB.txt NO ENCONTRADO...INICIANDO POR EL PUERTO POR DEFECTO = "+PUERTO_EXE+"#########")
	
  if (datos['nombre_almacen'] == 'Producto terminado'):
     codigobarras = '014'+datos['codart']+'17'+caducidad+'10'+lote
     sql = """INSERT INTO codigo_barra_articulo (codemp,codart,codigobarras,fecult,codusu,num_etiquetas,present,codart_ini,codart_cant,lote_ini,lote_cant,caduca_ini,caduca_cant) 
         values('{}','{}','{}','{}','{}','{}','00',3,13,26,6,18,6)
		 """.format(datos['codemp'],datos['codart'],codigobarras,datos['fectra'],datos['usuario'],datos['num_etiqueta'],INICIO_COD_TERMINADO,LONGITUD_COD_TERMINADO,INICIO_LOTE_TERMINADO,LONGITUD_LOTE_TERMINADO,INICIO_CADUCIDAD_TERMINADO,LONGITUD_CADUCIDAD_TERMINADO)

  if (datos['nombre_almacen'] == 'Materia prima'):
     codigobarras = '014'+datos['codart']+'17'+caducidad+'10'+lote
     sql = """INSERT INTO codigo_barra_articulo (codemp,codart,codigobarras,fecult,codusu,num_etiquetas,present,codart_ini,codart_cant,lote_ini,lote_cant,caduca_ini,caduca_cant) 
         values('{}','{}','{}','{}','{}','{}','00',0,0,0,0,0,0)
		 """.format(datos['codemp'],datos['codart'],codigobarras,datos['fectra'],datos['usuario'],datos['num_etiqueta'],INICIO_COD_PRIMA,LONGITUD_COD_PRIMA,INICIO_LOTE_PRIMA,LONGITUD_LOTE_PRIMA,INICIO_CADUCIDAD_PRIMA,LONGITUD_CADUCIDAD_PRIMA)

  # if (datos['nombre_almacen'] == 'Producto terminado'):
     # codigobarras = '014'+datos['codart']+'17'+caducidad+'10'+lote
     # sql = """INSERT INTO codigo_barra_articulo (codemp,codart,codigobarras,fecult,codusu,num_etiquetas,present,codart_ini,codart_cant,lote_ini,lote_cant,caduca_ini,caduca_cant) 
         # values('{}','{}','{}','{}','{}','{}','00',3,13,26,6,18,6)
		 # """.format(datos['codemp'],datos['codart'],codigobarras,datos['fectra'],datos['usuario'],datos['num_etiqueta'])

  # if (datos['nombre_almacen'] == 'Materia prima'):
     # codigobarras = '014'+datos['codart']+'17'+caducidad+'10'+lote
     # sql = """INSERT INTO codigo_barra_articulo (codemp,codart,codigobarras,fecult,codusu,num_etiquetas,present,codart_ini,codart_cant,lote_ini,lote_cant,caduca_ini,caduca_cant) 
         # values('{}','{}','{}','{}','{}','{}','00',0,0,0,0,0,0)
		 # """.format(datos['codemp'],datos['codart'],codigobarras,datos['fectra'],datos['usuario'],datos['num_etiqueta'])

  print (sql) 
  curs.execute(sql)
  conn.commit()
  
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
	
  d = {'status': 'INSERTADO CON EXITO'}
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  

@app.route('/generar_encabezado_egreso_bodega', methods=['POST'])
def generar_encabezado_egreso_bodega():
  datos = request.json
  print ("##########  ENTRADA GENERAR PEDIDOS ######")
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
 
  
  sql = "SELECT seccue FROM secuencias where codalm= (SELECT AGENCIA FROM ALMACENES WHERE CODEMP='{}' AND CODALM='{}') and codsec = \'VC_EGR\' and codemp='{}'".format(datos['codemp'],datos['codalm'],datos['codemp'])
  curs.execute(sql)
  r = curs.fetchone()

  
  print (r)

  if (r):
    NEXT_NUMTRA=r[0]
    datos['orden_produccion']= 'null'  if datos['orden_produccion'] == None else "'"+datos['orden_produccion']+"'"
 
    sql = """INSERT INTO encabezadoegresos (codemp,numfac,codcli,codalm,codven,fecfac,lispre,observ,codmon,valcot,codusu,fecult,conpag,codcen,totfac,estado,codcom,orden,externo)
         values('{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}',{},'{}','{}',{},{})""".format(datos['codemp'],NEXT_NUMTRA,datos['codcli'],datos['codalm'],'01',datos['fecfac'],'1',datos['observ'],'01','01',datos['usuario'],datos['fecfac'],'C',datos['codagencia']+'.',datos['totfac'],'0','03',datos['orden_produccion'],1)

    print (sql) 
    curs.execute(sql)
    conn.commit()
  
  
    print ("PARA OBTENER SECUENCIA  NUEVA DE PEDIDOS")
    print (NEXT_NUMTRA)
    print (len(NEXT_NUMTRA))
    print (int(NEXT_NUMTRA)+1)
    print (str((int(NEXT_NUMTRA)+1)).zfill(len(NEXT_NUMTRA)))
    numfac_nueva = str((int(NEXT_NUMTRA)+1)).zfill(len(NEXT_NUMTRA))
  
    # sql = "update secuencias set seccue = seccue+1 where codalm=\'01\' and codsec = \'VC_PED\' and codemp='{}'".format(datos['codemp'])
    sql = "update secuencias set seccue = '{}' where codalm=(SELECT AGENCIA FROM ALMACENES WHERE CODEMP='{}' AND CODALM='{}') and codsec = 'VC_EGR' and codemp='{}'".format(numfac_nueva,datos['codemp'],datos['codalm'],datos['codemp'])
    curs.execute(sql)
    conn.commit()
    d = {'status': 'INSERTADO CON EXITO','numtra': NEXT_NUMTRA}
  else:
    d = {'status': 'AGENCIA NO POSEE SECUENCIA PARA INGRESOS DEFINIDA','numtra': '00000000'}
  
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()

  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/generar_encabezado_egreso_bodega_simple', methods=['POST'])
def generar_encabezado_egreso_simple():
  datos = request.json
  print ("##########  ENTRADA GENERAR PEDIDOS ######")
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
 
  
  sql = "SELECT seccue FROM secuencias where codalm= (SELECT AGENCIA FROM ALMACENES WHERE CODEMP='{}' AND CODALM='{}') and codsec = \'VC_EGR\' and codemp='{}'".format(datos['codemp'],datos['codalm'],datos['codemp'])
  curs.execute(sql)
  r = curs.fetchone()

  
  print (r)

  if (r):
    NEXT_NUMTRA=r[0]
    # datos['orden_produccion']= 'null'  if datos['orden_produccion'] == None else "'"+datos['orden_produccion']+"'"
 
    sql = """INSERT INTO encabezadoegresos (codemp,numfac,codcli,codalm,codven,fecfac,lispre,observ,codmon,valcot,codusu,fecult,conpag,codcen,totfac,estado,codcom,externo)
         values('{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}',{},'{}','{}',{})""".format(datos['codemp'],NEXT_NUMTRA,datos['codcli'],datos['codalm'],'01',datos['fecfac'],'1',datos['observ'],'01','01',datos['usuario'],datos['fecfac'],'C',datos['codagencia']+'.',datos['totfac'],'0','03',1)

    print (sql) 
    curs.execute(sql)
    conn.commit()
  
  
    print ("PARA OBTENER SECUENCIA  NUEVA DE PEDIDOS")
    print (NEXT_NUMTRA)
    print (len(NEXT_NUMTRA))
    print (int(NEXT_NUMTRA)+1)
    print (str((int(NEXT_NUMTRA)+1)).zfill(len(NEXT_NUMTRA)))
    numfac_nueva = str((int(NEXT_NUMTRA)+1)).zfill(len(NEXT_NUMTRA))
  
    # sql = "update secuencias set seccue = seccue+1 where codalm=\'01\' and codsec = \'VC_PED\' and codemp='{}'".format(datos['codemp'])
    sql = "update secuencias set seccue = '{}' where codalm=(SELECT AGENCIA FROM ALMACENES WHERE CODEMP='{}' AND CODALM='{}') and codsec = 'VC_EGR' and codemp='{}'".format(numfac_nueva,datos['codemp'],datos['codalm'],datos['codemp'])
    curs.execute(sql)
    conn.commit()
    d = {'status': 'INSERTADO CON EXITO','numtra': NEXT_NUMTRA}
  else:
    d = {'status': 'AGENCIA NO POSEE SECUENCIA PARA INGRESOS DEFINIDA','numtra': '00000000'}
  
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()

  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)


@app.route('/generar_renglones_egreso_bodega', methods=['POST'])
def generar_renglones_egreso_bodega():
  datos = request.json
  print ("##########  ENTRADA GENERAR PEDIDOS ######")
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
 
    
  sql = """INSERT INTO renglonesegresos (codemp,numfac,numren,numite,codart,nomart,coduni,cantid,preuni,desren,totren,codmon,valcot,totext,codcen) 
         values('{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}')
		 """.format(datos['codemp'],datos['numfac'],datos['numren'],datos['numren'],datos['codart'],datos['nomart'],datos['coduni'],datos['cant'],datos['cospro'],
		 datos['punreo'],datos['subtotal_art'],'01','1',datos['subtotal_art'],datos['codagencia']+'.')

  print (sql) 
  curs.execute(sql)
  conn.commit()
  
  # sql = """DELETE serie_articulo WHERE numfac = '{}' and codemp = '{}'
		 # """.format(datos['numfac'],datos['codemp'])
  # print (sql) 
  # curs.execute(sql)
  # conn.commit()
  
  
  
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()

  d = {'status': 'INSERTADO CON EXITO'}
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/guardar_series_egreso_bodega', methods=['POST'])
def guardar_series_egreso_bodega():
  datos = request.json
  print ("##########  ENTRADA GENERAR EGRESO BODEGA ######")
  print (datos)
  
  # {'codart': '0000000000145', 'serie': '555556', 'caducidad': '2022-02-28', 'cant': 10, 'codalm': '01', 
  # 'codserie': 1, 'tipo': 'FAC', 'tipo_des': 'ING', 'numfac_des': '16002851', 'codemp': '01', 'usuario': 'SUPERVISOR'}
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  
  dateTimeObj = datetime.now()
  timestampStr= dateTimeObj.strftime("%d-%b-%Y (%H:%M:%S)")
  hora= dateTimeObj.strftime("%H:%M:%S")
  fecha= dateTimeObj.strftime("%Y-%B-%d")
 
    
  sql = """INSERT INTO serie_articulo_descarga (codemp,codalm,numfac,codart,codserie,numserie,tipo,cantid,numfac_des,tipo_des,entrega,hora,codusu,fecult) 
         values('{}','{}','{}','{}','{}','{}','{}',{},'{}','{}','{}','{}','{}','{}')
		 """.format(datos['codemp'],datos['codalm'],datos['numfac'],datos['codart'],datos['codserie'],datos['serie'],datos['tipo'],
		 datos['cant'],datos['numfac_des'],datos['tipo_des'],fecha,hora,datos['usuario'],fecha)
		 
  print (sql) 
  curs.execute(sql)
  conn.commit()
  
  
  if (datos['tipo'] == 'EGR'):
     sql = """UPDATE renglonesegresos set serie = 'ASIGNADO', codserie = '{}'  where codemp='{}' and numfac='{}' and codart='{}'
		 """.format(datos['codserie'],datos['codemp'],datos['numfac'],datos['codart'])
     print (sql)
     curs.execute(sql)
     conn.commit()

  if (datos['tipo'] == 'FAC'):
     sql = """UPDATE renglonesfacturas set serie = 'ASIGNADO', codserie = '{}' where codemp='{}' and numfac='{}' and codart='{}'
		 """.format(datos['codserie'],datos['codemp'],datos['numfac'],datos['codart'])
     print (sql)
     curs.execute(sql)
     conn.commit()
  
	 


  # print("CERRANDO SESION SIACI")
  # curs.close()
  # conn.close()

  d = {'status': 'INSERTADO CON EXITO'}
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  

  
  
@app.route('/get_series_ingreso_bodega', methods=['POST'])
def get_series_ingreso_bodega():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos) 
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
 
  campos = ['numfac', 'codclipro','codart','codserie','serie','cant','disponible','ubicacion','caducidad','cant_unid_present','num_etiqueta']
  
  # {'codart': '7861006200435', 'serie': '220303', 'caducidad': '2022-03-28', 'cant': 100, 'ubicacion': 'BODEGA3',
  # 'num_etiqueta': 20, 'cant_unid_present': '5', 'codserie': 1, 'codemp': '04'
    # 'num_etiqueta': 5, 'cant_unid_present': '20', 'codserie': 1, 'codemp': '04'
  
  sql = """ SELECT numfac,codclipro,codart,codserie,numserie,cantid,disponible,posicion,feccad 
  FROM "DBA"."serie_articulo" s where s.numfac= '{}' and codemp='{}' and codalm='{}'
  """.format(datos['numtra'],datos['codemp'],datos['codalm'])

  curs.execute(sql)
  print (sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    print (r)
	
    sql = """
    SELECT NUM_ETIQUETAS AS cant_unid_present
	from  "DBA"."codigo_barra_articulo" c 
    where c.codemp='{}' 
    and codart='{}'
    and codigobarras like '%{}'	
	""".format(datos['codemp'],r[2],r[4])
    curs.execute(sql)
    r1 = curs.fetchone()
    print (sql)
    print (r1)
    if (r1):
       campos = ['numfac', 'codclipro','codart','codserie','serie','cant','disponible','ubicacion','caducidad','cant_unid_present','num_etiqueta']
       cant_unid_present = r1[0]
       num_etiqueta_imprimir = r[5]/cant_unid_present
       reg = (r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],cant_unid_present,num_etiqueta_imprimir)
       d = dict(zip(campos, reg))
    else:
       campos = ['numfac', 'codclipro','codart','codserie','serie','cant','disponible','ubicacion','caducidad','cant_unid_present','num_etiqueta']
       reg = (r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],'N/D','N/D')
       d = dict(zip(campos, reg))

    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  # print(arrresp)
  curs.close()
  conn.close()

  return (jsonify(arrresp))
  
@app.route('/get_series_egreso_bodega', methods=['POST'])
def get_series_egreso_bodega():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos) 
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
 
  campos = ['numfac','codart','codserie','serie','cant','caducidad']
  
  sql = """ SELECT numfac,codart,codserie,numserie,cantid,
  (select sa.feccad from serie_articulo sa where sa.codemp=s.codemp and sa.codalm=s.codalm and sa.numserie=s.numserie and sa.codart =s.codart) as feccad 
  FROM "DBA"."serie_articulo_descarga" s where s.numfac= '{}' and codemp='{}' and codalm='{}' and tipo = 'EGR'
  """.format(datos['numtra'],datos['codemp'],datos['codalm'])

  curs.execute(sql)
  print (sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    print (r)
    d = dict(zip(campos, r))
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  # print(arrresp)
  curs.close()
  conn.close()

  return (jsonify(arrresp))
  
@app.route('/lista_ingresos', methods=['POST'])
def lista_ingresos():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos) 
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
 
  campos = ['numfac', 'codpro','fecfac','observ','codalm','codusu','totfac','nompro','nomalm']

  
  
  sql = """ SELECT ei.numfac,ei.codpro,ei.fecfac,ei.observ,ei.codalm,ei.codusu,ei.totfac,p.nompro,
  (SELECT 
  --*
  nomalm
  FROM "DBA"."almacenes" a where a.agencia ='{}' and a.codemp = ei.codemp and a.codalm=ei.codalm) as nomalm
  FROM encabezadoingresos ei, proveedores p 
  where ei.codemp='{}'  
  /* and ei.codalm 
  in (select usuario_x_ccosto.codalm_materia_prima --es la bodega de materia prima 
  from usuario_x_ccosto
  where	usuario_x_ccosto.codemp = '{}' and
		usuario_x_ccosto.codus1 = '{}' and
		substr(usuario_x_ccosto.codcen,1,2) = '{}'
  union
  select usuario_x_ccosto.codalm_producto_terminado  --es la bodega de producto terminado
  from usuario_x_ccosto
  where	usuario_x_ccosto.codemp = '{}' and
		usuario_x_ccosto.codus1 = '{}' and
		substr(usuario_x_ccosto.codcen,1,2) = '{}') */
  and ei.codpro=p.codpro
  and ei.codemp=p.codemp
  and ei.fecfac between '{}' and '{}'
  order by fecfac desc
  """.format(datos['codagencia'],datos['codemp'],datos['codemp'],datos['usuario'],datos['codagencia'],datos['codemp'],datos['usuario'],datos['codagencia'],datos['fecha_desde'],datos['fecha_hasta'])

  curs.execute(sql)
  print (sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    # print (r)
    d = dict(zip(campos, r))
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  # print(arrresp)
  curs.close()
  conn.close()

  return (jsonify(arrresp))
  
  
@app.route('/lista_egresos_bodega', methods=['POST'])
def lista_egresos_bodega():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos) 
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()

  campos = ['numfac', 'fecfac','nomcli','nomalm','totfac','observ','codusu']

  
  
  sql = """ SELECT eg.numfac,eg.fecfac,(select nomcli from clientes c where c.codcli=eg.codcli and c.codemp = eg.codemp),
      (select nomcen from centro_costo cc where cc.codemp = eg.codemp and cc.codcen=eg.codcen ),eg.totfac,eg.observ,eg.codusu
      FROM "DBA"."encabezadoegresos" eg 
      where eg.codemp = '{}'
      AND eg.fecfac between '{}' and '{}'
      order by eg.fecfac desc;
  """.format(datos['codemp'],datos['fecha_desde'],datos['fecha_hasta'])

  curs.execute(sql)
  print (sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    # print (r)
    d = dict(zip(campos, r))
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  # print(arrresp)
  curs.close()
  conn.close()

  return (jsonify(arrresp))
  
@app.route('/lista_productos', methods=['POST'])
def lista_productos():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos) 
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()

  campos = ['codart', 'nomart','clase','precio','exiact','estado','poriva','codiva','coduni']

  sql = """ SELECT a.codart
  ,a.nomart
  ,(select c.nomcla from clasesarticulos c where c.codcla=a.codcla and c.codemp= a.codemp)
  ,a.prec01,exiact,
  (CASE WHEN estado = 'A' THEN 'ACTIVO' WHEN estado = 'I' THEN 'INACTIVO' END) as estado,
   (select poriva from iva i where i.codiva=a.codiva) as poriva,codiva,coduni
  FROM "DBA"."articulos" a
  where codemp='{}';
  """.format(datos['codemp'])

  curs.execute(sql)
  print (sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    # print (r)
    d = dict(zip(campos, r))
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  # print(arrresp)
  curs.close()
  conn.close()

  return (jsonify(arrresp))
  
@app.route('/lista_servicios', methods=['POST'])
def lista_servicios():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos) 
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()

  campos = ['codemp', 'codser','nomser','preser','codiva','clase','poriva']

  sql = """select s.codemp,s.codser,s.nomser,s.preser,s.codiva,
  (select nomcla from claseservicio cs where cs.codemp=s.codemp and cs.codcla=s.codcla) as clase,
  (select poriva from iva i where i.codiva=s.codiva) as poriva
  FROM "DBA"."serviciosvarios" s
  where codemp='{}' and tipo='FAC'
  """.format(datos['codemp'])
  print (sql)
  curs.execute(sql)

  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    # print (r)
    d = dict(zip(campos, r))
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  # print(arrresp)
  curs.close()
  conn.close()

  return (jsonify(arrresp))
  
  
@app.route('/crear_articulo', methods=['POST'])
def crear_articulo():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos) 
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  
  dateTimeObj = datetime.now()
  timestampStr= dateTimeObj.strftime("%d-%b-%Y (%H:%M:%S)")
  fecult = dateTimeObj.strftime("%Y-%m-%d")

  sql = """ insert into articulos (codemp,codart,codalt,nomart,codiva,codcla,coduni,prec01,punreo,codusu,fecult,estado,codalm,codgrupo,codsub,exiact,cospro,cosprod)
  values('{}','{}','{}','{}','{}','01','{}','{}','{}','{}','{}','A','01','N','0101',0,0,0);
  """.format(datos['codemp'],datos['codart'],datos['codalt'],datos['nomart'],datos['codiva'],datos['coduni'],datos['prec01'],datos['punreo'],datos['codusu'],fecult)
  print (sql)
  curs.execute(sql)
  conn.commit()
  
  ###VALIDAR SI TIENE REGISTROS EN ARTICULO BODEGA
  sql = """ select count (*) from articulobodega where codemp='{}' and codart='{}';
  """.format(datos['codemp'],datos['codart'])
  print (sql)
  curs.execute(sql)
  r = curs.fetchone()
  print (r)
  if (r[0] == 0):
    sql = """ insert into articulobodega (codemp,codart,codalm,existe)
    values('{}','{}','%',0);
    """.format(datos['codemp'],datos['codart'])
    print (sql)
    curs.execute(sql)
    conn.commit()

    sql = """ insert into articulobodega (codemp,codart,codalm,existe)
    values('{}','{}','01',0);
    """.format(datos['codemp'],datos['codart'])
    print (sql)
    curs.execute(sql)
    conn.commit()
 
  d = {'STATUS': 'EXITOSO'}
  print("CERRANDO SESION SIACI")
  # print(arrresp)
  # curs.close()
  # conn.close()

  return (jsonify(d))
  
@app.route('/actualizar_articulo', methods=['POST'])
def actualizar_articulo():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos) 
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  
  dateTimeObj = datetime.now()
  timestampStr= dateTimeObj.strftime("%d-%b-%Y (%H:%M:%S)")
  fecult = dateTimeObj.strftime("%Y-%m-%d")

  sql = """ update articulos set codart='{}',codalt='{}',nomart='{}',codiva='{}',prec01='{}',punreo='{}',estado='{}',coduni='{}' where
  codemp='{}' and codart='{}'
  """.format(datos['codart'],datos['codalt'],datos['nomart'],datos['codiva'],datos['prec01'],datos['punreo'],datos['estado'],datos['coduni'],datos['codemp'],datos['codart_old'])
  print (sql)
  curs.execute(sql)
  conn.commit()
  
  ###VALIDAR SI TIENE REGISTROS EN ARTICULO BODEGA
  sql = """ select count (*) from articulobodega where codemp='{}' and codart='{}';
  """.format(datos['codemp'],datos['codart'])
  print (sql)
  curs.execute(sql)
  r = curs.fetchone()
  print (r)
  if (r[0] == 0):
    sql = """ insert into articulobodega (codemp,codart,codalm,existe)
    values('{}','{}','%',0);
    """.format(datos['codemp'],datos['codart'])
    print (sql)
    curs.execute(sql)
    conn.commit()

    sql = """ insert into articulobodega (codemp,codart,codalm,existe)
    values('{}','{}','01',0);
    """.format(datos['codemp'],datos['codart'])
    print (sql)
    curs.execute(sql)
    conn.commit()
  
  d = {'STATUS': 'EXITOSO'}
  print("CERRANDO SESION SIACI")

  return (jsonify(d))
  
  
@app.route('/articulo_detalle', methods=['POST'])
def articulo_detalle():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos) 
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()

  campos = ['codart', 'nomart','clase','precio','existencia','codiva','estado','cospro','codalt','punreo','coduni','src']
  
    # if (r[9]):
        # print ("hay imagen")
        # arr_path_img = r[9].split('\\')
        # img_name = arr_path_img[-1]
        # art= (r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],'../../assets/img_articulos/'+img_name,r[10])
		
		        # art= (r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],'../../assets/img_articulos/img-no-disp.jpg',r[10])
				
				# isnull(a.grafico,'../../assets/img_articulos/subir-imagen.jpg')
				
    # if (r[9]):
        # print ("hay imagen")
        # arr_path_img = r[9].split('\\')
        # img_name = arr_path_img[-1]
        # art= (r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],'../../assets/img_articulos/'+img_name,r[10])
			 
    # else:
        # print ("NO HAY IMAGEN")
        # art= (r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],'../../assets/img_articulos/img-no-disp.jpg',r[10])

  sql = """ SELECT a.codart
  ,a.nomart
  ,(select c.nomcla from clasesarticulos c where c.codcla=a.codcla and c.codemp= a.codemp) as clase
  ,round(a.prec01,2) as precio,
  a.exiact,a.codiva,a.estado,a.cospro,a.codalt,a.punreo,a.coduni,a.grafico
  FROM "DBA"."articulos" a
  where codemp='{}' and codart='{}';
  """.format(datos['codemp'],datos['codart'])

  curs.execute(sql)
  print (sql)
  r = curs.fetchone()
  print (r)
  if (r):
    if (r[11]):
        print ("hay imagen")
        arr_path_img = r[11].split('\\')
        img_name = arr_path_img[-1]
        art= (r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],r[9],r[10],'../../assets/img_articulos/'+img_name)
        d = dict(zip(campos, art))
    else:
        print ("NO HAY IMAGEN")
        art= (r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],r[9],r[10],'../../assets/img_articulos/subir-imagen.png')
        d = dict(zip(campos, art))
	 
  else:
     d = {'error': 'Codigo de producto no encontrado en la empresa '+datos['codemp']}
     
  # arrresp = []
  # for r in regs:
    # print (r)
  

    # arrresp.append(d)

  print("CERRANDO SESION SIACI")
  # print(arrresp)
  curs.close()
  conn.close()

  return (jsonify(d))
  

  
  
  
@app.route('/lista_msg_whatsapp', methods=['POST'])
def lista_msg_whatsapp():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos) 
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()

  # campos = ['numfac', 'fecfac','nomcli','nomalm','totfac','observ','codusu']
  campos = ['id','opcion','tipo_comprobante','nombre_archivo','mensaje','msg_fecha_info','fecha_envio','hora_envio','num_destino','ruta_archivo','status','resultado']


  
  sql = """ SELECT id,opcion,tipo_comprobante,nombre_archivo,
       mensaje,msg_fecha_info,DATEFORMAT(eg.fecha_envio, 'DD-MM-YYYY'),
	   hora_envio,num_destino,ruta_archivo,
	   (CASE WHEN status = 'P' THEN 'Pendiente por enviar' WHEN status = 'E' THEN 'Enviado'  WHEN status = 'N' THEN 'Envio fallido' ELSE status END) as status
	   ,resultado
      FROM "DBA"."comandos_whatsapp" eg 
      where eg.codemp = '{}'
      AND eg.fecha_envio between '{}' and '{}'
      order by eg.fecha_envio,eg.hora_envio desc;
  """.format(datos['codemp'],datos['fecha_desde'],datos['fecha_hasta'])

  curs.execute(sql)
  print (sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    # print (r)
    d = dict(zip(campos, r))
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  # print(arrresp)
  curs.close()
  conn.close()

  return (jsonify(arrresp))
  
@app.route('/reenviar_msg_ws', methods=['POST'])
def reenviar_msg_ws():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos) 
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()

  # campos = ['numfac', 'fecfac','nomcli','nomalm','totfac','observ','codusu']
  # campos = ['id','opcion','tipo_comprobante','nombre_archivo','mensaje','msg_fecha_info','fecha_envio','hora_envio','num_destino','ruta_archivo','status','resultado']


  
  sql = """UPDATE comandos_whatsapp SET STATUS='P' WHERE ID= {} and codemp = '{}'
  """.format(datos['id'],datos['codemp'])
  print (sql)
  curs.execute(sql)
  conn.commit()

  
 
  print("CERRANDO SESION SIACI")
  # print(arrresp)
  curs.close()
  conn.close()
  d = {'status': 'EXITOSO'}
  
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'

  return (response)
  
@app.route('/envio_notif_msg_ws', methods=['POST'])
def envio_notif_msg_ws():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos) 
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  
  
  dateTimeObj = datetime.now()
  timestampStr= dateTimeObj.strftime("%d-%b-%Y (%H:%M:%S)")
  hora= dateTimeObj.strftime("%H:%M:%S")
  fecha= dateTimeObj.strftime("%Y-%B-%d")
  
  ##Para enviar por whastapp
  
  
  
  arr_telf_destino = coneccion.TELF_NOTIF_AUTO_FAC_WS.split(";")
  
  for telf in arr_telf_destino:
    sql_ws = """ INSERT INTO comandos_whatsapp (codemp,opcion,tipo_comprobante,nombre_archivo,mensaje,
		 msg_fecha_info,fecha_envio,hora_envio,num_destino,ruta_archivo,status)
		 VALUES ('{}','mensaje','NA','NA','Estimado usuario, se notifica que la siguiente factura esta *DESPACHADA* y pendiente por autorizar: {} cliente {}','NA','{}','{}','{}','NA','P')
	    """.format(datos['codemp'],datos['faccli'],datos['nomcli'],fecha,hora,telf)
    print (sql_ws)
    curs.execute(sql_ws)
    conn.commit()

  print("CERRANDO SESION SIACI")
  # print(arrresp)
  curs.close()
  conn.close()
  d = {'status': 'EXITOSO'}
  
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return (response)
  
  
@app.route('/lista_egresos_facturas', methods=['POST'])
def lista_egresos_facturas():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos) 
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos =['faccli','fecfac','nombres','nomalm','estado','totfac','observ','numfac']


  
  
  sql = """ SELECT e.serie+'-'+e.faccli,e.fecfac,c.nombres,a.nomalm,e.estado,e.totfac,e.observ,e.numfac
		FROM encabezadofacturas e,clientes c,almacenes a
		WHERE e.codemp = c.codemp AND
		e.codcli = c.codcli AND
		e.codemp = a.codemp AND
		e.codalm = a.codalm AND
		e.codemp = '{}' AND 
		e.estado = 'P' 
		AND f_verifica_fc_despacho(e.codemp,e.numfac) = 0
		AND isnull(num_contribuyente,'') = ''
		AND e.fecfac between '{}' and '{}'
		order by e.fecfac desc;
  """.format(datos['codemp'],datos['fecha_desde'],datos['fecha_hasta'])

  curs.execute(sql)
  print (sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    # print (r)
    d = dict(zip(campos, r))
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  # print(arrresp)
  curs.close()
  conn.close()

  return (jsonify(arrresp))
  
  
@app.route('/lista_egresos_facturas_despachadas', methods=['POST'])
def lista_egresos_facturas_despachadas():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos) 
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos =['fecfac','faccli','nombres','totfac','idfactura']

  sql = """ SELECT fechaemision,establecimiento+puntoemision+'-'+secuencial,razonsocialcomprador,convert(numeric(12,2),round(importetotal,2)),idfactura
		FROM factura_electronica
		WHERE empresa = '{}'
		AND isnull(status,'0') = '1' 
		AND isnull(autorizacionsri,'') = '' 
		AND f_verifica_fc_despacho(empresa,secuencialinterno) = 1
		and fechaemision between '{}' and '{}'
		order by fechaemision desc;
  """.format(datos['codemp'],datos['fecha_desde'],datos['fecha_hasta'])

  curs.execute(sql)
  print (sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    # print (r)
    d = dict(zip(campos, r))
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  # print(arrresp)
  curs.close()
  conn.close()

  return (jsonify(arrresp))
  
@app.route('/datos_panel_control', methods=['POST'])
def datos_panel_control():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos) 
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  
  sql = """ SELECT count(*) as facturas_pendientes_auth
		FROM factura_electronica
		WHERE empresa = '{}'
		AND isnull(status,'0') = '1' 
		AND isnull(autorizacionsri,'') = '' 
		AND f_verifica_fc_despacho(empresa,secuencialinterno) = 1
		and fechaemision between '{}' and '{}';
  """.format(datos['codemp'],datos['fecha_desde'],datos['fecha_hasta'])
  
  curs.execute(sql)
  print (sql)
  r = curs.fetchone()
  cont_fact_auth = r[0]
  
  
  
  sql = """ SELECT count(*) as facturas_despachadas
		FROM encabezadofacturas e,clientes c,almacenes a
		WHERE e.codemp = c.codemp AND
		e.codcli = c.codcli AND
		e.codemp = a.codemp AND
		e.codalm = a.codalm AND
		e.codemp = '{}' AND 
		e.estado = 'P' 
		AND f_verifica_fc_despacho(e.codemp,e.numfac) = 0
		AND isnull(num_contribuyente,'') = ''
		AND e.fecfac between '{}' and '{}';
  """.format(datos['codemp'],datos['fecha_desde'],datos['fecha_hasta'])
  
  curs.execute(sql)
  print (sql)
  r = curs.fetchone()
  cont_fact_desp = r[0]
  
  d = {'cont_fact_auth': cont_fact_auth, 'cont_fact_desp': cont_fact_desp}
  
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'

  return (response)

  
  
  
  
  
  
@app.route('/autorizar_facturas_despachadas', methods=['POST'])
def autorizar_facturas_despachadas():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos) 
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos =['fecfac','faccli','nombres','totfac']


  
  
  sql = """ UPDATE factura_electronica SET status = '0' WHERE
		empresa = '{}' AND
		isnull(status,'0') = '1'
		AND isnull(autorizacionsri,'') = '' AND
		idfactura = '{}'
  """.format(datos['codemp'],datos['idfactura'])

  curs.execute(sql)
  conn.commit()
  print (sql)

  print("CERRANDO SESION SIACI")
  # print(arrresp)
  curs.close()
  conn.close()
  d = {'status': 'INSERTADO CON EXITO'}
  
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'

  return (response)
  
@app.route('/get_encabezado_ingreso', methods=['POST'])  
def get_encabezado_ingreso():
		
	datos = request.json
	print (datos)
	conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
	curs = conn.cursor()
	
	# sql = """
	# SELECT ei.numfac,ei.codpro,ei.fecfac,ei.observ,ei.codalm,ei.codusu,ei.conpag,p.nompro,p.rucced,p.dirpro,p.telpro,
	# p.email,p.tipo_identifica,ei.totfac,(select i.poriva from iva i where i.codiva='S') as poriva, ei.totfac-round (((totfac*poriva)/100),2) as subtotal
	# FROM encabezadoingresos ei, proveedores p
    # where ei.codalm = '{}' and ei.codemp='{}' and ei.numfac = '{}'
    # and ei.codpro=p.codpro
    # and ei.codemp=p.codemp
    # order by fecfac desc
	# """. format(datos['codalm'],datos['codemp'],datos['numfac'])
	
	sql = """
	SELECT ei.numfac,ei.codpro,ei.fecfac,ei.observ,ei.codalm,ei.codusu,ei.conpag,p.nompro,p.rucced,
	p.email,p.tipo_identifica,ei.totfac,(select i.poriva from iva i where i.codiva='S') as poriva, ei.totfac-round (((totfac*poriva)/100),2) as subtotal
	/*,
	(CASE 
	WHEN (select usuario_x_ccosto.codalm_materia_prima  
		from usuario_x_ccosto where 
		usuario_x_ccosto.codemp = '{}' and
		usuario_x_ccosto.codus1 = '{}' and
		substr(usuario_x_ccosto.codcen,1,2) = '{}') = ei.codalm then 'Materia prima'
	WHEN (select usuario_x_ccosto.codalm_producto_terminado
		from usuario_x_ccosto where 
		usuario_x_ccosto.codemp = '{}' and
		usuario_x_ccosto.codus1 = '{}' and
		substr(usuario_x_ccosto.codcen,1,2) = '{}') = ei.codalm then 'Producto terminado'
	ELSE 'STATUS_NO_ENCONTRADO' END),
	ei.numtra*/
	FROM encabezadoingresos ei, proveedores p
	where ei.codemp='{}' and ei.numfac = '{}'
    and ei.codpro=p.codpro
    and ei.codemp=p.codemp
    order by fecfac desc
	""". format(datos['codemp'],datos['usuario'],datos['codagencia'],datos['codemp'],datos['usuario'],datos['codagencia'],datos['codemp'],datos['numfac'])
	
	curs.execute(sql)
	r = curs.fetchone()
	
	
	# campos = ['numfac','codpro','fecfac','observ','codalm','codusu','conpag','nompro','rucced','email','tipo_identifica','totfac','poriva','subtotal','nomalm','numtra']
	campos = ['numfac','codpro','fecfac','observ','codalm','codusu','conpag','nompro','rucced','email','tipo_identifica','totfac','poriva','subtotal']
	print (r)
	if r:
		d = dict(zip(campos, r))
	else:
		d = {'codus1': False}
	response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
	response.headers['content-type'] = 'application/json'
	conn.close()
	
	return(response) 
	
	
@app.route('/get_encabezado_egreso', methods=['POST'])  
def get_encabezado_egreso():
		
	datos = request.json
	print (datos)
	conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
	curs = conn.cursor()
	
	sql = """
    SELECT ei.numfac,ei.codcli,ei.fecfac,ei.observ,ei.codalm,ei.codusu,ei.conpag,p.nomcli,p.rucced,
	p.email,p.tpIdCliente,ei.totfac,(select i.poriva from iva i where i.codiva='S') as poriva, ei.totfac-round (((totfac*poriva)/100),2) as subtotal
	--,
	/*(CASE 
	WHEN (select usuario_x_ccosto.codalm_materia_prima  
		from usuario_x_ccosto where 
		usuario_x_ccosto.codemp = '{}' and
		usuario_x_ccosto.codus1 = '{}' and
		substr(usuario_x_ccosto.codcen,1,2) = '{}') = ei.codalm then 'Materia prima'
	WHEN (select usuario_x_ccosto.codalm_producto_terminado
		from usuario_x_ccosto where 
		usuario_x_ccosto.codemp = '{}' and
		usuario_x_ccosto.codus1 = '{}' and
		substr(usuario_x_ccosto.codcen,1,2) = '{}') = ei.codalm then 'Producto terminado'
	ELSE 'STATUS_NO_ENCONTRADO' END),
	ei.orden*/
	FROM encabezadoegresos ei, clientes p
	where ei.codemp='{}' and ei.numfac = '{}'
    and ei.codcli=p.codcli
    and ei.codemp=p.codemp
    order by fecfac desc 
	""". format(datos['codemp'],datos['usuario'],datos['codagencia'],datos['codemp'],datos['usuario'],datos['codagencia'],datos['codemp'],datos['numfac'])
	
	curs.execute(sql)
	r = curs.fetchone()
	
	print (sql)
	
	
	campos = ['numfac','codpro','fecfac','observ','codalm','codusu','conpag','nompro','rucced','email','tipo_identifica','totfac','poriva','subtotal','nomalm','numtra']
	print (r)
	if r:
		d = dict(zip(campos, r))
	else:
		d = {'codus1': False}
	response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
	response.headers['content-type'] = 'application/json'
	conn.close()
	
	return(response)
	
@app.route('/get_encabezado_factura', methods=['POST'])  
def get_encabezado_facturas():
		
	datos = request.json
	print (datos)
	conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
	curs = conn.cursor()

	
	# sql = """
	# SELECT ei.numfac,ei.codpro,ei.fecfac,ei.observ,ei.codalm,ei.codusu,ei.conpag,p.nompro,p.rucced,
	# p.email,p.tipo_identifica,ei.totfac,(select i.poriva from iva i where i.codiva='S') as poriva, ei.totfac-round (((totfac*poriva)/100),2) as subtotal,
	# (CASE 
	# WHEN (select usuario_x_ccosto.codalm_materia_prima  
		# from usuario_x_ccosto where 
		# usuario_x_ccosto.codemp = '{}' and
		# usuario_x_ccosto.codus1 = '{}' and
		# substr(usuario_x_ccosto.codcen,1,2) = '{}') = ei.codalm then 'Materia prima'
	# WHEN (select usuario_x_ccosto.codalm_producto_terminado
		# from usuario_x_ccosto where 
		# usuario_x_ccosto.codemp = '{}' and
		# usuario_x_ccosto.codus1 = '{}' and
		# substr(usuario_x_ccosto.codcen,1,2) = '{}') = ei.codalm then 'Producto terminado'
	# ELSE 'STATUS_NO_ENCONTRADO' END),
	# ei.numtra
	# FROM encabezadoingresos ei, proveedores p
	# where ei.codemp='{}' and ei.numfac = '{}'
    # and ei.codpro=p.codpro
    # and ei.codemp=p.codemp
    # order by fecfac desc
	# """. format(datos['codemp'],datos['usuario'],datos['codagencia'],datos['codemp'],datos['usuario'],datos['codagencia'],datos['codemp'],datos['numfac'])
	
	
	sql = """
    SELECT (select nomcli from clientes c where c.codcli = e.codcli and c.codemp=e.codemp),
	e.fecfac,e.observ,isnull(e.direcop,(select dircli from clientes c where c.codcli = e.codcli and c.codemp=e.codemp)) 
	FROM "DBA"."encabezadofacturas" e where e.codemp = '{}' and e.numfac= '{}'
	""". format(datos['codemp'],datos['numfac'])
	
	curs.execute(sql)
	r = curs.fetchone()
	
	
	campos = ['nomcli','fecfac','observ','direcop']
	print (r)
	if r:
		d = dict(zip(campos, r))
	else:
		d = {'codus1': False}
	response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
	response.headers['content-type'] = 'application/json'
	conn.close()
	
	return(response) 
	
	
@app.route('/get_renglones_ingreso', methods=['POST'])  
def get_renglones_ingreso():
		
	datos = request.json
	print (datos)
	codemp=datos['codemp']
	numtra=datos['numtra']
	codusl=datos['usuario']
	conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
	curs = conn.cursor()
	
	sql = """
	SELECT codart,nomart, coduni, (select a.codiva from articulos a where a.codemp=r.codemp and a.codart=r.codart) as codiva,
	round (cantid,2) as cantid,
	preuni,
	(select i.poriva from iva i where i.codiva='S') as poriva,
	round (((totren*poriva)/100),2) as cant_iva,totren,
    desren,observaciones,
	round((((desren*preuni)/100) * cantid),2) as des_cant,numren,serie
    FROM renglonesingresos r
	where numfac='{}' and r.codemp='{}' order by r.numren asc
	""".format(numtra,codemp)
	curs.execute(sql)
	print (sql)
	r = curs.fetchall()
	campos = ['codart','nomart','coduni','codiva','cant','cospro','poriva','precio_iva','subtotal_art','punreo','observ','v_desc_art','index','maneja_serie']
	renglones_pedido = []
	for reg in r:
	   # print (reg)
	   # reg_encabezado = dict(zip(campos, reg))
	   # renglones_pedido.append(reg_encabezado)
		print ("LO QUE VIENE DE LA BASE DE DATOS")
		print (reg)
		# row_db = [reg[0],reg[1],reg[2],reg[3],convert_decimal(reg[4]),convert_decimal(reg[5]),reg[6],convert_decimal(reg[7]),convert_decimal(reg[8]),convert_decimal(reg[9]),reg[10],convert_decimal(reg[11])]
		# reg = (reg[0],reg[1],reg[2],reg[3],convert_decimal(reg[4]),convert_decimal(reg[5]),reg[6],convert_decimal(reg[7]),convert_decimal(reg[8]),convert_decimal(reg[9]),reg[10],convert_decimal(reg[11]))
		# print (row_db)
		print (reg)
		# row = (row_db[0],row_db[1],row_db[2],row_db[3],row_db[4],row_db[5],row_db[6],row_db[7],row_db[8],row_db[9],row_db[10],row_db[11],row_db[12])
		reg_encabezado = dict(zip(campos, reg))
		renglones_pedido.append(reg_encabezado)
	print (renglones_pedido) 
	conn.close()
	
	return (jsonify(renglones_pedido))
	
	
	
@app.route('/get_renglones_orden_compra', methods=['POST'])  
def get_renglones_orden_compra():
		
	datos = request.json
	print (datos)
	codemp=datos['codemp']
	numtra=datos['numtra']
	codusl=datos['usuario']
	conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
	curs = conn.cursor()
	
	sql = """
	SELECT 
	codart,nomart, coduni, 
	(select a.codiva from articulos a where a.codemp=r.codemp and a.codart=r.codart) as codiva,
	round (cantid,2) as cantid,
	0 as cospro,
	--preuni,
	(select i.poriva from iva i where i.codiva='S') as poriva,
	round (((totren*poriva)/100),2) as cant_iva,
	0 as totren,
	--totren,
	0 as desren,
	observacion,
	0 as des_cant,
	numren,
	(select a.codgrupo from articulos a where a.codemp=r.codemp and a.codart=r.codart) as serie
	FROM renglonesordcom r
	where r.numtra='{}' and r.codemp='{}' order by r.numren asc
	""".format(numtra,codemp)
	curs.execute(sql)
	print (sql)
	r = curs.fetchall()
	campos = ['codart','nomart','coduni','codiva','cant','cospro','poriva','precio_iva','subtotal_art','punreo','observ','v_desc_art','index','maneja_serie']
	renglones_pedido = []
	for reg in r:
	   # print (reg)
	   # reg_encabezado = dict(zip(campos, reg))
	   # renglones_pedido.append(reg_encabezado)
		print ("LO QUE VIENE DE LA BASE DE DATOS")
		print (reg)
		# row_db = [reg[0],reg[1],reg[2],reg[3],convert_decimal(reg[4]),convert_decimal(reg[5]),reg[6],convert_decimal(reg[7]),convert_decimal(reg[8]),convert_decimal(reg[9]),reg[10],convert_decimal(reg[11])]
		# reg = (reg[0],reg[1],reg[2],reg[3],convert_decimal(reg[4]),convert_decimal(reg[5]),reg[6],convert_decimal(reg[7]),convert_decimal(reg[8]),convert_decimal(reg[9]),reg[10],convert_decimal(reg[11]))
		# print (row_db)
		print (reg)
		# row = (row_db[0],row_db[1],row_db[2],row_db[3],row_db[4],row_db[5],row_db[6],row_db[7],row_db[8],row_db[9],row_db[10],row_db[11],row_db[12])
		reg_encabezado = dict(zip(campos, reg))
		renglones_pedido.append(reg_encabezado)
	print (renglones_pedido) 
	conn.close()
	
	return (jsonify(renglones_pedido))
	

@app.route('/get_renglones_egreso', methods=['POST'])  
def get_renglones_egreso():
		
	datos = request.json
	print (datos)
	codemp=datos['codemp']
	numtra=datos['numtra']
	codusl=datos['usuario']
	conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
	curs = conn.cursor()
	
	sql = """
	SELECT codart,nomart, coduni, (select a.codiva from articulos a where a.codemp=r.codemp and a.codart=r.codart) as codiva,
	round (cantid,2) as cantid,
	preuni,
	(select i.poriva from iva i where i.codiva='S') as poriva,
	round (((totren*poriva)/100),2) as cant_iva,totren,
    desren,observaciones,
	round((((desren*preuni)/100) * cantid),2) as des_cant,numren,
	(select codgrupo from articulos a where a.codemp = r.codemp and a.codart=r.codart) as maneja_serie,
	(select count(*) from serie_articulo s where s.codemp = r.codemp and s.codart = r.codart ) as registra_serie
    FROM renglonesegresos r
	where numfac='{}' and r.codemp='{}' order by r.numren asc
	""".format(numtra,codemp)
	curs.execute(sql)
	print (sql)
	r = curs.fetchall()
	campos = ['codart','nomart','coduni','codiva','cant','cospro','poriva','precio_iva','subtotal_art','punreo','observ','v_desc_art','index','maneja_serie','registra_serie']
	
	
	# CASE WHEN preser4 is null THEN 0 ELSE preser4 END)
	# (CASE WHEN ac.tipo_agencia = 'P' THEN 'PRINCIPAL' WHEN ac.tipo_agencia = 'S' THEN 'SUCURSAL' END)
	renglones_egreso = []
	for reg in r:
	   # print (reg)
	   # reg_encabezado = dict(zip(campos, reg))
	   # renglones_egreso.append(reg_encabezado)
		print ("LO QUE VIENE DE LA BASE DE DATOS")
		print (reg)
		# row_db = [reg[0],reg[1],reg[2],reg[3],convert_decimal(reg[4]),convert_decimal(reg[5]),reg[6],convert_decimal(reg[7]),convert_decimal(reg[8]),convert_decimal(reg[9]),reg[10],convert_decimal(reg[11])]
		# reg = (reg[0],reg[1],reg[2],reg[3],convert_decimal(reg[4]),convert_decimal(reg[5]),reg[6],convert_decimal(reg[7]),convert_decimal(reg[8]),convert_decimal(reg[9]),reg[10],convert_decimal(reg[11]))
		# print (row_db)
		print (reg)
		# row = (row_db[0],row_db[1],row_db[2],row_db[3],row_db[4],row_db[5],row_db[6],row_db[7],row_db[8],row_db[9],row_db[10],row_db[11],row_db[12])
		reg_encabezado = dict(zip(campos, reg))
		renglones_egreso.append(reg_encabezado)
	print (renglones_egreso) 
	conn.close()
	
	return (jsonify(renglones_egreso))
	
	
	
	
	
@app.route('/get_renglones_facturas', methods=['POST'])  
def get_renglones_facturas():
		
	datos = request.json
	print (datos)
	codemp=datos['codemp']
	numtra=datos['numtra']
	conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
	curs = conn.cursor()
	
	# sql = """
	# SELECT codart,nomart, coduni, (select a.codiva from articulos a where a.codemp=r.codemp and a.codart=r.codart) as codiva,
	# round (cantid,2) as cantid,
	# preuni,
	# (select i.poriva from iva i where i.codiva='S') as poriva,
	# round (((totren*poriva)/100),2) as cant_iva,totren,
    # desren,observaciones,
	# round((((desren*preuni)/100) * cantid),2) as des_cant,numren,serie
    # FROM renglonesingresos r
	# where numfac='{}' and r.codemp='{}' order by r.numren asc
	# """.format(numtra,codemp)
	
	sql = """
	SELECT codart,nomart,coduni,cantid,observacion,numite,
	(select codgrupo from articulos a where a.codemp = r.codemp and a.codart=r.codart),
	(select count(*) from serie_articulo s where s.codemp = r.codemp and s.codart = r.codart and s.estado='D' and s.codalm='{}') as registra_serie
	FROM renglonesfacturas r
	where numfac = '{}' and codemp = '{}' and codart <> '*' and substr(codart,1,1) <> '\\' 
	""".format(datos['codalm'],numtra,codemp)
	
	curs.execute(sql)
	print (sql)
	r = curs.fetchall()
	# campos = ['codart','nomart','coduni','codiva','cant','cospro','poriva','precio_iva','subtotal_art','punreo','observ','v_desc_art','index','maneja_serie']
	campos = ['codart','nomart','coduni','cant','observ','index','maneja_serie','registra_serie']
	renglones_pedido = []
	for reg in r:
	   # print (reg)
	   # reg_encabezado = dict(zip(campos, reg))
	   # renglones_pedido.append(reg_encabezado)
		print ("LO QUE VIENE DE LA BASE DE DATOS")
		print (reg)
		# row_db = [reg[0],reg[1],reg[2],reg[3],convert_decimal(reg[4]),convert_decimal(reg[5]),reg[6],convert_decimal(reg[7]),convert_decimal(reg[8]),convert_decimal(reg[9]),reg[10],convert_decimal(reg[11])]
		# reg = (reg[0],reg[1],reg[2],reg[3],convert_decimal(reg[4]),convert_decimal(reg[5]),reg[6],convert_decimal(reg[7]),convert_decimal(reg[8]),convert_decimal(reg[9]),reg[10],convert_decimal(reg[11]))
		# print (row_db)
		print (reg)
		# row = (row_db[0],row_db[1],row_db[2],row_db[3],row_db[4],row_db[5],row_db[6],row_db[7],row_db[8],row_db[9],row_db[10],row_db[11],row_db[12])
		reg_encabezado = dict(zip(campos, reg))
		renglones_pedido.append(reg_encabezado)
	print (renglones_pedido) 
	conn.close()
	
	return (jsonify(renglones_pedido))
	
@app.route('/seleccion_agencia', methods=['POST'])  
def seleccion_agencia():
    datos = request.json
    print (datos)
	
    conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
    curs = conn.cursor()
    sql = """
    select substr(usuario_x_ccosto.codcen,1,2),almacenes.nomalm
    from usuario_x_ccosto,almacenes
    where usuario_x_ccosto.codemp = almacenes.codemp and
    substr(usuario_x_ccosto.codcen,1,2) = almacenes.codalm and
    usuario_x_ccosto.codemp = '{}' and
    usuario_x_ccosto.codus1 = '{}';
	""".format(datos['empresa'],datos['usuario'])
    print(sql)
    curs.execute(sql)
    r = curs.fetchall()
    campos = ['codagencia','nomalm']
    arr_lista_agencias = []
    for reg in r:
        arr_lista_agencias.append(dict(zip(campos, reg)))
    conn.close()
    return (jsonify(arr_lista_agencias))
	
	
@app.route('/lista_bodegas_centro_costo', methods=['POST'])  
def lista_bodegas_centro_costo():
    datos = request.json
    print (datos)
	
    conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
    curs = conn.cursor()
	

	
	
    # sql = """
    # select usuario_x_ccosto.codalm_materia_prima,usuario_x_ccosto.codalm_producto_terminado --es la bodega de producto terminado
    # from usuario_x_ccosto
    # where	usuario_x_ccosto.codemp = '{}' and
    # usuario_x_ccosto.codus1 = '{}' and
    # substr(usuario_x_ccosto.codcen,1,2) = '{}';
	# """.format(datos['codemp'],datos['usuario'],datos['codagencia'])
	
    campos = ['nombre_almacen','codalm']
	
    sql = """
    select 'Materia prima' as 'nombre_almacen', usuario_x_ccosto.codalm_materia_prima --es la bodega de producto terminado
    from usuario_x_ccosto
    where usuario_x_ccosto.codemp = '{}' and
    usuario_x_ccosto.codus1 = '{}' and
    substr(usuario_x_ccosto.codcen,1,2) = '{}'
    union
    select 'Producto terminado' as 'nombre_almacen', usuario_x_ccosto.codalm_producto_terminado --es la bodega de producto terminado
    from usuario_x_ccosto
    where usuario_x_ccosto.codemp = '{}' and
    usuario_x_ccosto.codus1 = '{}' and
    substr(usuario_x_ccosto.codcen,1,2) = '{}'
    """.format(datos['codemp'],datos['usuario'],datos['codagencia'],datos['codemp'],datos['usuario'],datos['codagencia'])
	
	# curs.execute(sql)
    # r = curs.fetchone()
    # print (sql)
    # print (r)
	
    curs.execute(sql)
    r = curs.fetchall()
    print (sql)
    print (r)
    
    arr_almacenes_ccosto = []
    for reg in r:
        if reg[1]:
           arr_almacenes_ccosto.append(dict(zip(campos, reg)))
     
    conn.close()
    return (jsonify(arr_almacenes_ccosto))
	
	
@app.route('/facturas_egresos_pendientes_despachos', methods=['POST'])  
def facturas_egresos_pendientes_despachos():
    datos = request.json
    print (datos)
	
    conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
    curs = conn.cursor()
    sql = """
    SELECT e.serie,e.faccli,e.fecfac,c.nombres,a.nomalm
    FROM encabezadofacturas e,clientes c,almacenes a
    WHERE e.codemp = c.codemp AND
        e.codcli = c.codcli AND
        e.codemp = a.codemp AND
        e.codalm = a.codalm AND
        e.codemp = '{}' AND 
        e.estado = 'P'
    AND f_verifica_fc_despacho(e.codemp,e.numfac) = 0 AND isnull(num_contribuyente,'') = ''
    order by e.fecfac desc
	""".format(datos['codemp'],datos['usuario'],datos['codagencia'])
    curs.execute(sql)
    r = curs.fetchone()
    print (sql)
    print (r)
	
    # campos = ['codagencia','nomalm']
    arr_lista_agencias = []
    # for reg in r:
    arr_almacenes_ccosto = [{"nombre_almacen": "Materia prima","codalm":r[0]},{"nombre_almacen": "Producto terminado","codalm":r[1]}]
    conn.close()
    return (jsonify(arr_almacenes_ccosto))
	

@app.route('/conf_codbarra_art', methods=['POST'])  
def conf_codbarra_art():
    datos = request.json
    print (datos)
	
    conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
    curs = conn.cursor()
    sql = """
    select num_etiquetas as num_uni_presentacion,
	present as presentacion,
	codart_ini,
	codart_cant,
	lote_ini,
	lote_cant,
	caduca_ini,
	caduca_cant
	from codigo_barra_articulo where codart = '{}' and codemp = '{}' and codigobarras = '{}'
	""".format(datos['codart'],datos['codemp'],datos['codbarra'])
    curs.execute(sql)
    r = curs.fetchone()
    print (sql)
    print (r)
	
    campos = ['num_uni_present','presentacion','codart_ini','codart_cant','lote_ini','lote_cant','caduca_ini','caduca_cant']
	
    if r:
      d = dict(zip(campos, r))
    else:
      reg=('NO','NO','NO','NO','NO','NO','NO','NO')
      d = dict(zip(campos, reg)) 
	  
    conn.close()


    response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
    response.headers['content-type'] = 'application/json'
    return(response)
	
@app.route('/crear_dbf', methods=['POST'])  
def crear_dbf():
    datos = request.json
    print (datos)
	
    # create DBF
    APP_PATH_DBF = APP_PATH+'\\DBF\\'
    LOTE = datos['serie']
    CODART = datos['codart']
    # FECHA_CAD = '210310'
    # COD_BARRA = '014'+CODART+'17'+FECHA_CAD+'10'+LOTE
    # COD_BARRA = '01478610062001451721031010201210'
	# DESC_ART = 'CHICHARRON PIC NIC KIKOS 150 G'+' PAQUETE DE '+PRESENT
    CANT_PRESENT = datos['cant_unid_present']
    PRESENT = str(CANT_PRESENT)+' UNIDADES'
    NUM_ETIQUETAS = datos['num_etiqueta'] 

	
	
    conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
    curs = conn.cursor()
    sql = """
    select nomart from articulos where codart = '{}' and codemp = '{}'	
	""".format(CODART,datos['codemp'])
    curs.execute(sql)
    r = curs.fetchone()
    print (sql)
    print (r)
    DESC_ART = r[0]+' PAQUETE DE '+PRESENT
	
    sql = """
    SELECT codigobarras from  "DBA"."codigo_barra_articulo" c 
    where c.codemp='{}' 
    and codart='{}'
    and codigobarras like '%{}'	
	""".format(datos['codemp'],CODART,LOTE)
    curs.execute(sql)
    r = curs.fetchone()
    print (sql)
    print (r)
    
	
    
	
    if r:
       COD_BARRA = r[0]
       FILE_DBF_PATH = APP_PATH_DBF+'ETIQ_LOTE_'+LOTE+'_'+CODART+'.dbf'
       if not os.path.isfile(FILE_DBF_PATH):
          db = dbf.Dbf(FILE_DBF_PATH, new=True)
          db.header.code_page = 0x78
          db.add_field(
           ('C', 'CODIGO', 50),
           ('C', 'BARRAS', 50),
           ('C', 'DESCRIPCIO', 255),
          )

          NUM_REGISTROS = range (NUM_ETIQUETAS)
          for n in NUM_REGISTROS:
             rec = db.new()
             rec['CODIGO'] = CODART
             rec['BARRAS'] = COD_BARRA
             rec['DESCRIPCIO'] = DESC_ART
             db.write(rec)
             print(db, '\n\n')
	  
          db.close()
       d = {'STATUS':'EXITOSO'}
    else:
       d = {'STATUS':'COD BARRA LOTE NO GENERADO'}
    conn.close()
    response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
    response.headers['content-type'] = 'application/json'
    return(response)
	
@app.route('/usuario_defecto_produccion', methods=['POST'])  
def usuario_defecto_produccion():
    datos = request.json
    print (datos)
	
    conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
    curs = conn.cursor()
	
    if (datos['tipo_accion'] == 'INGRESO'):
       sql = """
       SELECT CODPRO_CLI,NOMBRE FROM pro_origen_destino WHERE TIPO = 'O' AND CODEMP = '{}'---PROVEEDOR INGRESO DEFECTO...PREFERIBLE PRODUCTO TERMINADO
	   """.format(datos['codemp'])
	   
    if (datos['tipo_accion'] == 'EGRESO'):   
       sql = """
       SELECT CODPRO_CLI,NOMBRE FROM pro_origen_destino WHERE TIPO = 'D' AND CODEMP = '{}' ----CLIENTE SOLO PARA EGRESOS (SOLO MATERIAS PRIMAS PREFERIBLEMENTE)
	   """.format(datos['codemp'])
    print (sql)
    curs.execute(sql)
    r = curs.fetchone()

    print (r)
	
    campos = ['codpro_cli','razon_social']
	
    if r:
      d = dict(zip(campos, r))
    else:
      reg=('NO DISPONIBLE','NO DISPONIBLE')
      d = dict(zip(campos, reg)) 
	  
    conn.close()
    response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
    response.headers['content-type'] = 'application/json'
    return(response)
	
	
@app.route('/buscar_articulos_conteo', methods=['POST'])  
def buscar_articulos_conteo():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  campos = ['codart', 'nomart','prec01','exiact','coduni','punreo','codiva','poriva','precio_iva','codbarra']
  
  # or a.codart = (select codart from v_articulos where codalterno = '{}'))
  
  sql = """select a.codart, a.nomart, round(prec01,2), (a.exiact-(select case when sum(p.cantid) is null then 0 else sum(p.cantid) 
  end  as sum from v_exitencias_pedpro p where p.codemp = '{}' and p.codart like a.codart||'%'))  as exiact,
  a.coduni,a.punreo,a.codiva,
 (select i.poriva from iva i where i.codiva=a.codiva) as poriva , 
  round(((poriva*prec01)/100),2) as precio_iva,
  (select c1.codalterno from v_articulos c1 where c1.codemp = a.codemp and c1.codart = a.codart and c1.codalterno='{}') as codalterno 
  from articulos a where 
  (a.nomart like '%{}%' or a.codart like '%{}%' or 
  a.codart = (select codart from v_articulos where codalterno = '{}')
  ) and a.codemp = '{}' 
  order by a.nomart asc""".format(datos['codemp'],datos['nomart'],datos['nomart'],datos['nomart'],datos['nomart'],datos['codemp'])
  curs.execute(sql)
  print (sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    # codart = r[0]
    # print (codart)
    # sql2 = "SELECT precio FROM precio_cliente where codemp= '{}' and codart= '{}' and codcli = '{}' and tipo = 'P' and lispre = 1".format(datos['codemp'],codart,datos['codcli'])
    # curs.execute(sql2)
    # print (sql2)
    # regs2 = curs.fetchone()
    # if (regs2):
        # print ("PRECIO POLITICA CLIENTE")
        # # (poriva*precio01)/100
        # precio_iva_new = round((r[7]*regs2[0])/100,2)
        # r = (r[0],r[1],regs2[0],r[3],r[4],r[5],r[6],r[7],precio_iva_new)
    # else:
        # print ("PRECIO FICHA ARTICULO")
    d = dict(zip(campos, r))
    arrresp.append(d)

  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  response = make_response(dumps(arrresp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/generar_conteo', methods=['POST'])
def generar_conteo():
  datos = request.json
  print ("##########  ENTRADA GENERAR CONTEO ######")
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  

  for datos in registro_conteo:
     datos['codbarra']= 'NO DISPONIBLE' if datos['codbarra'] == None else datos['codbarra']
     sql = """INSERT INTO conteo_fisico (codemp,codalm,fecha,codusu,codigobarra,codart,nomart,cantidad,estado) 
          values('{}','{}','{}','{}','{}','{}','{}',{},'{}')
		  """.format(datos['codemp'],datos['codalm'],datos['fectra'],datos['usuario'],datos['codbarra'],datos['codart'],datos['nomart'],datos['cant'],datos['estado'])

     print (sql) 
     curs.execute(sql)
  conn.commit()
  
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()

  d = {'status': 'INSERTADO CON EXITO'}
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/anular_factura', methods=['POST'])
def anular_factura():
  datos = request.json
  print ("##########  ENTRADA ANULAR FACTURA ######")
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
  curs = conn.cursor()
  
  ##### CAPTURO AUTORIZACION Y LA COLOCO EN OBSERVACION COMO TEMPORALMENTE
  sql = """UPDATE encabezadopuntosventa SET observ=autorizacion, autorizacion=null where codemp='{}' and numfac='{}'
        """.format(datos['codemp'],datos['numfac'])
  print (sql) 
  curs.execute(sql)
  conn.commit()
  
  ##### ELIMINO LOS RENGLONES 
  
  sql = """ delete from renglonespuntosventa where codemp='{}' and numfac='{}'
        """.format(datos['codemp'],datos['numfac'])
  print (sql) 
  curs.execute(sql)
  conn.commit()
  
  ##### ELIMINO DETALLE_FORMA_PAGO_SRI
  
  sql = """ delete from detalle_formas_pago_sri where codemp='{}' and numfac='{}'
        """.format(datos['codemp'],datos['numfac'])
  print (sql) 
  curs.execute(sql)
  conn.commit()
  
  
  ##### TENTATIVAMENTE ELIMINO CUENTAS POR COBRAR
  


  ##### COLOCO TODAS LAS FORMAS DE PAGO EN 0 EN ENCABEZADOFACTURA Y COLOCO EN ANULADO FACTOK = A ...
  sql = """UPDATE encabezadopuntosventa SET totnet=0,totdes=0,totbas=0,totfac=0,valefe=0,valche=0,valtar=0,valdep=0,valcre=0,valtrans=0,
      numche='',numtar='',numdep='',numtrans=null,pordes=0,totiva=0,totrec=0,numpag=0,plapag=0
      where codemp='{}' and numfac='{}'
        """.format(datos['codemp'],datos['numfac'])
  print (sql) 
  curs.execute(sql)
  conn.commit()
  
  
  sql = """UPDATE encabezadopuntosventa SET autorizacion=observ, observ=null, factok='A' where codemp='{}' and numfac='{}'
        """.format(datos['codemp'],datos['numfac'])
  print (sql) 
  curs.execute(sql)
  conn.commit()
 
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()

  d = {'status': 'ANULADO CON EXITO'}
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
	
	
	
 
	


if __name__ == "__main__":
    # app.config['SESSION_TYPE'] = 'memcached'
    # app.run(host='0.0.0.0', port=5000)
    # app.run(debug=True, host='0.0.0.0', port=5000)
	app.config['SESSION_TYPE'] = 'memcached'
	PUERTO_EXE = '5000'
	SSL = 'NO'
	
	
	PATH_CONFIG = APP_PATH+'\\CONFIG_API_WEB.txt'
	if os.path.isfile(PATH_CONFIG):
		config = open(PATH_CONFIG,"r")
		for linea in config.readlines():
			pattern_port = re.compile(r'PUERTO=')
			pattern_SSL = re.compile(r'ACTIVAR_SSL=')
			if pattern_port.match(linea):
				linea_array = linea.split('=')
				PUERTO_EXE = linea_array [1]
				print ("###PUERTO DE ESCUCHA API EN EL ARCHIVO DE CONFIGURACION= "+PUERTO_EXE)
			if pattern_SSL.match(linea):
				linea_array = linea.split('=')
				SSL = linea_array [1].replace('\n','')
				print ("###SSL ACTIVA= "+SSL)
		config.close
		try:
			entero = int(PUERTO_EXE)
			# print("PUERTO VALIDO ENTERO")
		except ValueError:
			print("PUERTO "+PUERTO_EXE+" INVALIDO EN EL ARCHIVO DE CONFIGURACION, INICIANDO POR EL PUERTO POR DEFECTO 5000 ")
			PUERTO_EXE = '5000'
			# sys.exit()
	else:
		print ("### ARCHIVO CONFIG_API_WEB.txt NO ENCONTRADO...INICIANDO POR EL PUERTO POR DEFECTO = "+PUERTO_EXE+"#########")

	# app.run(host='0.0.0.0', port=PUERTO_EXE, debug=True,ssl_context='adhoc')
	# app.run(host='0.0.0.0', port=PUERTO_EXE, debug=True)


	if (SSL == 'NO'):
		print ("### SE PUBLICARÁ POR HTTP NORMAL ###")
		app.run(host='0.0.0.0',debug=True,threaded=True, port=PUERTO_EXE)
		# app.run(host='0.0.0.0',debug=True,port=PUERTO_EXE,ssl_context=('SIACI_WEB.crt', 'SIACI_WEB.key'), threaded=True)
	if (SSL == 'SI'):
		print ("### SE PUBLICARÁ POR HTTPS (MODO SEGURO) PARA RECIBIR COORDENADAS DE GOOGLE MAPS ###")
		app.run(host='0.0.0.0',debug=True,port=PUERTO_EXE,ssl_context=('SIACI_WEB.crt', 'SIACI_WEB.key'), threaded=True)


