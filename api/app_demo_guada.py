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
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
  curs = conn.cursor()
  print (d)
  campos = ['codus1', 'clausu','tipacc','geoloc','punto_venta','correo_ped_cli','correo_fact','edit_ped','nomemp']
  sql = "select u.codus1,u.clausu,u.tipacc,e.nomemp,u.codemp from usuario u, empresa e where u.codemp=e.codemp and u.codus1='{}' and u.clausu='{}' and u.codemp='{}'".format(d['usuario'],d['password'],d['empresa'])
  curs.execute(sql)
  print (sql)
  print ("GEOLOCALIZACION ACTIVA= "+coneccion.GEOLOC)
  print ("PUNTO DE VENTA ACTIVO= "+coneccion.PUNTO_VENTA)
  print ("ENVIAR_CORREO_PEDIDO_CLIENTE ACTIVO= "+coneccion.ENVIAR_CORREO_PEDIDO_CLIENTE)
  print ("ENVIAR_CORREO_FACTURACION ACTIVO= "+coneccion.ENVIAR_CORREO_FACTURACION)
  print ("EDITAR_PEDIDO ACTIVO= "+coneccion.EDITAR_PEDIDO)
  
  ### PARA OBTENER EL NOMBRE DE LA EMPRESA ####
  

  r = curs.fetchone()
  if r:
    reg=(r[0],r[1],r[2],coneccion.GEOLOC,coneccion.PUNTO_VENTA,coneccion.ENVIAR_CORREO_PEDIDO_CLIENTE,coneccion.ENVIAR_CORREO_FACTURACION,coneccion.EDITAR_PEDIDO,r[3])
    d = dict(zip(campos, reg))
  else:
    d = {'codus1': False}

  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/status_caja', methods=['POST'])
def status_caja():
  d = request.json
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
  curs = conn.cursor()
  campos = ['tipo_caja','fecdoc','hora','almacen','nomalm', 'caja','turno']
  # sql = "SELECT tipo_caja, fecdoc,hora,codalm,codcierre,turno FROM cierre_caja where codusu = '{}' and codemp = '{}' and codigo=(select max(codigo) from cierre_caja)".format(d['usuario'],d['codemp'])
  
  sql = """ SELECT c.tipo_caja, c.fecdoc,c.hora,c.codalm, (select a.nomalm from almacenes a where a.codalm=c.codalm )as nomalm ,c.codcierre,c.turno
  FROM cierre_caja c where c.codusu = '{}' and c.codemp = '{}' and c.codigo=(select max(c.codigo) from cierre_caja c) """.format(d['usuario'],d['codemp'])
  curs.execute(sql)
  r = curs.fetchone()
  # len(r)
  if (r):
      print("SALIDA")
      print (r)
      reg=(r[0],r[1],r[2],r[3],r[4],r[5],r[6])
      d = dict(zip(campos, reg))
  else:
      print("SALIDA en 0")
      reg=('C','C','C','C','C','C','C')
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
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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


@app.route('/empresas', methods=['GET'])
def empresas():
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
  
@app.route('/vendedores', methods=['POST'])
def vendedores():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
  curs = conn.cursor()
  campos = ['codven','nomven']
  sql = "SELECT codven,nomven FROM vendedorescob where codemp='{}'".format(datos['codemp'])
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
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
  curs = conn.cursor()
  # campos = ['prec1', 'prec2','prec3','prec4','prec5']
  campos = ['prec']
  sql = "SELECT prec01,prec02,prec03,prec04,prec05 FROM articulos WHERE codemp = '{}' and codart = '{}'".format(datos['codemp'],datos['codart'])
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
  
  sql = "SELECT precio FROM precio_cliente where codemp= '{}' and codart= '{}' and codcli = '{}' order by lispre asc".format(datos['codemp'],datos['codart'],datos['codcli'])
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
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
  curs = conn.cursor()
  campos = ['prec01', 'prec02','prec03','prec04']
  sql = "SELECT preser,preser2,preser3,(CASE WHEN preser4 is null THEN 0 ELSE preser4 END) as preser4 FROM serviciosvarios WHERE codemp = '{}' and codser = '{}'".format(datos['codemp'],datos['codart'])
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
  
@app.route('/cosulta_sucursales', methods=['POST'])
def cosulta_sucursales():
  datos = request.json
  print ('ENTRADAAAAA GET SUCURSALES')
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
	conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
	curs = conn.cursor()
	
	
	sql = """
	SELECT p.numtra,DATEFORMAT(p.fectra, 'DD-MM-YYYY') as fectra , DATEFORMAT(p.fecult, 'DD-MM-YYYY') as fecult ,c.rucced,c.nombres,c.dircli,c.codcli,c.telcli,c.email,p.observ,p.totnet,p.iva_cantidad,p.codusu,p.ciucli,
	(SELECT nomven FROM vendedorescob v, usuario u where v.codus1 = u.codus1 and v.codusu = u.codusu and u.codus1='{}' and u.codemp='{}'), 
	round((p.totnet+iva_cantidad),2) as total_pedido
	FROM encabezadopedpro p, clientes c
	where p.numtra = '{}' and p.tiptra = 1 and p.codemp='{}'
	and p.codcli=c.codcli
	""".format(codusl,codemp,numtra,codemp)
	curs.execute(sql)
	r = curs.fetchone()
	# num_pedido = r[0]
	# fectra = r[1]
	# identificacion=r[2]
	# cliente=r[3]
	# direccion=r[4]
	# telefono=r[5]
	# email=r[6]
	# observ=r[7]
	# totnet=convert_decimal(r[8])
	# iva_cantidad=convert_decimal(r[9])
	# codusu=r[10]
	# ciucli=r[11]
	# nomven=r[12]
	# total_pedido=convert_decimal(r[13])


	# print (num_pedido,fectra,identificacion,cliente,direccion,telefono,email,observ,totnet,iva_cantidad,codusu,ciucli,nomven,total_pedido)
	
	campos = ['num_pedido', 'fectra','fecult','identificacion','cliente','direccion','codcli','telefono','email','observ','totnet','iva_cantidad','codusu','ciucli','nomven','total_pedido']
	print (r)
	if r:
		reg = (r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],r[9],convert_decimal(r[10]),convert_decimal(r[11]),r[12],r[13],r[14],convert_decimal(r[15]))
		d = dict(zip(campos, reg))
    # arrresp.append(d)
		
		# d = dict(zip(campos, r))
	else:
		d = {'codus1': False}
	response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
	response.headers['content-type'] = 'application/json'
	# return(response)



	# print (total_neto)

	# sql = """
	# SELECT codart,nomart, coduni,
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
	# campos = ['codart','nomart','coduni','cantid','preuni','poriva','cant_iva','totren','desren','num_docs','des_cant']
	# renglones_pedido = []
	# for reg in r:
	   # # print (reg)
	   # # reg_encabezado = dict(zip(campos, reg))
	   # # renglones_pedido.append(reg_encabezado)
		# print (reg)
		# row_db = [reg[0],reg[1],reg[2],convert_decimal(reg[3]),convert_decimal(reg[4]),reg[5],convert_decimal(reg[6]),convert_decimal(reg[7]),convert_decimal(reg[8]),reg[9],convert_decimal(reg[10])]
		# reg = (reg[0],reg[1],reg[2],convert_decimal(reg[3]),convert_decimal(reg[4]),reg[5],convert_decimal(reg[6]),convert_decimal(reg[7]),convert_decimal(reg[8]),reg[9],convert_decimal(reg[10]))
		# print (row_db)
		# print (reg)
		# # row = (row_db[0],row_db[1],row_db[2],row_db[3],row_db[4],row_db[5],row_db[6],row_db[7],row_db[8],row_db[9],row_db[10],row_db[11],row_db[12])
		# reg_encabezado = dict(zip(campos, reg))
		# renglones_pedido.append(reg_encabezado)
	# print (renglones_pedido) 
	conn.close()
	
	return(response) 
	
	
@app.route('/get_renglones_pedido', methods=['POST'])  
def get_renglones_pedido():
		
	datos = request.json
	print (datos)
	codemp=datos['codemp']
	numtra=datos['pedido']
	codusl=datos['usuario']
	conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
		print (reg)
		row_db = [reg[0],reg[1],reg[2],reg[3],convert_decimal(reg[4]),convert_decimal(reg[5]),reg[6],convert_decimal(reg[7]),convert_decimal(reg[8]),convert_decimal(reg[9]),reg[10],convert_decimal(reg[11])]
		reg = (reg[0],reg[1],reg[2],reg[3],convert_decimal(reg[4]),convert_decimal(reg[5]),reg[6],convert_decimal(reg[7]),convert_decimal(reg[8]),convert_decimal(reg[9]),reg[10],convert_decimal(reg[11]))
		print (row_db)
		print (reg)
		# row = (row_db[0],row_db[1],row_db[2],row_db[3],row_db[4],row_db[5],row_db[6],row_db[7],row_db[8],row_db[9],row_db[10],row_db[11],row_db[12])
		reg_encabezado = dict(zip(campos, reg))
		renglones_pedido.append(reg_encabezado)
	print (renglones_pedido) 
	conn.close()
	
	return (jsonify(renglones_pedido))

  
@app.route('/lista_pedidos', methods=['POST'])
def lista_pedidos():
  datos = request.json
  print ('ENTRADAAAAA')
  print (datos) 
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
  
  campos = ['numtra', 'codcli','nomusu','fectra','nomcli','observ','total_iva','status','email','fecha_entrega','hora_entrega','direccion_entrega','ruta','idruta','id_agencia']
  
####QUERY SIN CONSULTAR RUTAS   #################  
  # if (datos["tipacc"] == 'T'):
      # sql = "SELECT p.numtra,p.codcli,p.codusu,DATEFORMAT(p.fectra, 'DD-MM-YYYY') as fectra,c.nomcli, p.observ,round((p.totnet+p.iva_cantidad),2) as total_iva, (CASE WHEN estado = \'P\' THEN \'EMITIDO\' WHEN estado = \'A\' THEN \'ANULADO\' WHEN estado = \'S\' THEN \'PROCESADO\' WHEN estado = \'F\' THEN \'FACTURADO\'WHEN estado = \'E\' THEN \'EN ESPERA\' WHEN estado = \'C\' THEN \'COMPRADA\' ELSE \'STATUS_NO_ENCONTRADO\' END) AS status, c.email FROM encabezadopedpro p, clientes c where p.tiptra=1 and p.codemp='{}' and p.codemp = c.codemp and p.codcli = c.codcli and codalm=\'01\' and estado=\'P\' order by p.fectra desc".format(datos['codemp'])
  # else:
      # sql = "SELECT p.numtra,p.codcli,p.codusu,DATEFORMAT(p.fectra, 'DD-MM-YYYY') as fectra,c.nomcli, p.observ,round((p.totnet+p.iva_cantidad),2) as total_iva, (CASE WHEN estado = \'P\' THEN \'EMITIDO\' WHEN estado = \'A\' THEN \'ANULADO\' WHEN estado = \'S\' THEN \'PROCESADO\' WHEN estado = \'F\' THEN \'FACTURADO\'WHEN estado = \'E\' THEN \'EN ESPERA\' WHEN estado = \'C\' THEN \'COMPRADA\' ELSE \'STATUS_NO_ENCONTRADO\' END) AS status, c.email FROM encabezadopedpro p, clientes c where p.tiptra=1 and p.codemp='{}' and p.codusu='{}' and p.codemp = c.codemp and p.codcli = c.codcli and codalm=\'01\' and estado=\'P\' order by p.fectra desc".format(datos['codemp'],datos['usuario'])

####QUERY CONSULTANDO RUTAS GUADAPRODUC ################# 
  datos["tipacc"] = 'T'
 
  if (datos["tipacc"] == 'T'):
      # sql = "SELECT p.numtra,p.codcli,p.codusu,DATEFORMAT(p.fectra, 'DD-MM-YYYY') as fectra,c.nomcli, p.observ,round((p.totnet+p.iva_cantidad),2) as total_iva, (CASE WHEN estado = \'P\' THEN \'EMITIDO\' WHEN estado = \'A\' THEN \'ANULADO\' WHEN estado = \'S\' THEN \'PROCESADO\' WHEN estado = \'F\' THEN \'FACTURADO\'WHEN estado = \'E\' THEN \'EN ESPERA\' WHEN estado = \'C\' THEN \'COMPRADA\' ELSE \'STATUS_NO_ENCONTRADO\' END) AS status, c.email FROM encabezadopedpro p, clientes c where p.tiptra=1 and p.codemp='{}' and p.codemp = c.codemp and p.codcli = c.codcli and codalm=\'01\' and estado=\'P\' order by p.fectra desc".format(datos['codemp'])
      
	  sql = """ SELECT p.numtra,p.codcli,p.codusu,
			DATEFORMAT(p.fectra, 'DD-MM-YYYY') as fectra,c.nomcli,
			p.observ,round((p.totnet+p.iva_cantidad),2) as total_iva,
			(CASE WHEN estado = 'P' THEN 'EMITIDO' WHEN estado = 'A' THEN 'ANULADO' WHEN estado = 'S' THEN 'PROCESADO' WHEN estado = 'F' THEN 'FACTURADO'WHEN estado = 'E' THEN 'EN ESPERA' WHEN estado = 'C' THEN 'COMPRADA' ELSE 'STATUS_NO_ENCONTRADO' END) AS status,
			c.email, DATEFORMAT(pr.fecha_entrega, 'DD-MM-YYYY'),CONVERT(VARCHAR, pr.hora_entrega, 108),dir_agencia,r.descripcion,pr.idruta,a.id_agencia
			FROM encabezadopedpro p, clientes c, pedido_ruta pr, agencia_cliente a, ruta r
			where p.tiptra=1 and p.codemp='{}' 
			and pr.idruta = trim(r.codruta)
		--	and a.idruta = trim(r.codruta) 
			and p.codemp=r.codemp
			and p.codemp = c.codemp 
			and p.codcli = c.codcli 
			and codalm='01' 
			and estado='P' 
			and pr.numtra_pedido = p.numtra
			and a.empresa = p.codemp
			and a.codcli = p.codcli
			and a.id_agencia = pr.id_agencia
			order by p.fectra desc
        """.format(datos['codemp'])
  
  else:
      # sql = "SELECT p.numtra,p.codcli,p.codusu,DATEFORMAT(p.fectra, 'DD-MM-YYYY') as fectra,c.nomcli, p.observ,round((p.totnet+p.iva_cantidad),2) as total_iva, (CASE WHEN estado = \'P\' THEN \'EMITIDO\' WHEN estado = \'A\' THEN \'ANULADO\' WHEN estado = \'S\' THEN \'PROCESADO\' WHEN estado = \'F\' THEN \'FACTURADO\'WHEN estado = \'E\' THEN \'EN ESPERA\' WHEN estado = \'C\' THEN \'COMPRADA\' ELSE \'STATUS_NO_ENCONTRADO\' END) AS status, c.email FROM encabezadopedpro p, clientes c where p.tiptra=1 and p.codemp='{}' and p.codusu='{}' and p.codemp = c.codemp and p.codcli = c.codcli and codalm=\'01\' and estado=\'P\' order by p.fectra desc".format(datos['codemp'],datos['usuario'])
	  
      sql = """ SELECT p.numtra,p.codcli,p.codusu,
		DATEFORMAT(p.fectra, 'DD-MM-YYYY') as fectra,c.nomcli,
		p.observ,round((p.totnet+p.iva_cantidad),2) as total_iva,
		(CASE WHEN estado = 'P' THEN 'EMITIDO' WHEN estado = 'A' THEN 'ANULADO' WHEN estado = 'S' THEN 'PROCESADO' WHEN estado = 'F' THEN 'FACTURADO'WHEN estado = 'E' THEN 'EN ESPERA' WHEN estado = 'C' THEN 'COMPRADA' ELSE 'STATUS_NO_ENCONTRADO' END) AS status,
		c.email, DATEFORMAT(pr.fecha_entrega, 'DD-MM-YYYY'),CONVERT(VARCHAR, pr.hora_entrega, 108),dir_agencia,r.descripcion,pr.idruta,a.id_agencia
		FROM encabezadopedpro p, clientes c, pedido_ruta pr, agencia_cliente a, ruta r
		where p.tiptra=1 and p.codemp='{}' and p.codusu='{}'
		and pr.idruta = trim(r.codruta)
	--	and a.idruta = trim(r.codruta) 
		and p.codemp=r.codemp
		and p.codemp = c.codemp 
		and p.codcli = c.codcli 
		and codalm='01' 
		and estado='P' 
		and pr.numtra_pedido = p.numtra
		and a.empresa = p.codemp
		and a.codcli = p.codcli
		and a.id_agencia = pr.id_agencia
		order by p.fectra desc
	""".format(datos['codemp'],datos['usuario'])
   
  
  curs.execute(sql)
  print (sql)
  regs = curs.fetchall()
  arrresp = []
  # arr_up = []
  for r in regs:
    # print (r)
    reg = (r[0],r[1],r[2],r[3],r[4],r[5],convert_decimal(r[6]),r[7],r[8],r[9],r[10],r[11],r[12],r[13],r[14])
    d = dict(zip(campos, reg))
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
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
  curs = conn.cursor()
  campos = ['codart', 'nomart','prec01','exiact','coduni','punreo','codiva','poriva','precio_iva']
  # sql = "select codart, nomart, round(prec01, 2), (exiact-(select case when sum(cantid) is null then 0 else sum(cantid) end  as sum from v_exitencias_pedpro where codemp = '{}' and codart like '%{}%')) as exiact,coduni,punreo,codiva  from articulos where (nomart like '%{}%' or codart like '%{}%') and codemp = '{}' order by nomart asc".format(datos['codemp'],datos['nomart'],datos['nomart'],datos['nomart'],datos['codemp'])
  
  sql = "select a.codart, a.nomart, round(a.prec01, 2) as precio01, (a.exiact-(select case when sum(p.cantid) is null then 0 else sum(p.cantid) end  as sum from v_exitencias_pedpro p where p.codemp = '{}' and p.codart like '%'||a.codart||'%'))  as exiact,a.coduni,a.punreo,a.codiva, (select i.poriva from iva i where i.codiva=a.codiva) as poriva , round(((poriva*precio01)/100),2) as precio_iva from articulos a where (a.nomart like '%{}%' or a.codart like '%{}%') and a.codemp = '{}' order by a.nomart asc".format(datos['codemp'],datos['nomart'],datos['nomart'],datos['codemp'])
  curs.execute(sql)
  print (sql)
  regs = curs.fetchall()
  arrresp = []
  for r in regs:
    codart = r[0]
    print (codart)
    sql2 = "SELECT precio FROM precio_cliente where codemp= '{}' and codart= '{}' and codcli = '{}' and lispre = 1".format(datos['codemp'],codart,datos['codcli'])
    curs.execute(sql2)
    print (sql2)
    regs2 = curs.fetchone()
    if (regs2):
        print ("PRECIO POLITICA CLIENTE")
        r = (r[0],r[1],regs2[0],r[3],r[4],r[5],r[6],r[7],r[8])
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

@app.route('/busqueda_razon_social', methods=['POST'])
def busqueda_razon_social():
  datos = request.json
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
  curs = conn.cursor()
  campos = ['codart', 'nomart','prec01','exiact','coduni','punreo','codiva','poriva','precio_iva']
  # sql = "select codart, nomart, round(prec01, 2), (exiact-(select case when sum(cantid) is null then 0 else sum(cantid) end  as sum from v_exitencias_pedpro where codemp = '{}' and codart like '%{}%')) as exiact,coduni,punreo,codiva  from articulos where (nomart like '%{}%' or codart like '%{}%') and codemp = '{}' order by nomart asc".format(datos['codemp'],datos['nomart'],datos['nomart'],datos['nomart'],datos['codemp'])
  
  #sql = "select a.codart, a.nomart, round(a.prec01, 2) as precio01, (a.exiact-(select case when sum(p.cantid) is null then 0 else sum(p.cantid) end  as sum from v_exitencias_pedpro p where p.codemp = '{}' and p.codart like '%'||a.codart||'%'))  as exiact,a.coduni,a.punreo,a.codiva, (select i.poriva from iva i where i.codiva=a.codiva) as poriva , round(((poriva*precio01)/100),2) as precio_iva from articulos a where (a.nomart like '%{}%' or a.codart like '%{}%') and a.codemp = '{}' order by a.nomart asc".format(datos['codemp'],datos['nomart'],datos['nomart'],datos['codemp'])
  sql = """ select a.codser, a.nomser,round(a.preser, 2) as precio01, 'N/A' as exiact,'N/A' as coduni,
            '0' as punreo, a.codiva, 
            (select i.poriva from iva i where i.codiva=a.codiva) as poriva ,
            round(((poriva*precio01)/100),2) as precio_iva
            from serviciosvarios a 
            where (a.nomser like '%{}%' or a.nomser like '%{}%') and a.codemp = '{}' order by a.nomser asc
        """.format(datos['nomart'],datos['nomart'],datos['codemp'])
  
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
  
  
  
  
@app.route('/reporte_lista_pedidos_ruta', methods=['POST'])
def reporte_lista_pedidos_ruta():
  datos = request.json
  # g.user_id = request.headers.get('user-id')
  # print (g.user_id)
  print (datos)
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)

  ##SECUENCIA INTERNA SIACI
  # sql = "select seccue from secuencias where  codemp='{}' and codalm='{}' and numcaj='{}' and codsec='PV_FAC'".format(
  sql = "select seccue from secuencias where  codemp='{}' and codalm='{}' and codsec='PV_FAC'".format(
  datos['codemp'], datos['codalm']
  # datos['codemp'], datos['codalm'], datos['numcaj']
  )
  curs = conn.cursor()
  curs.execute(sql)
  regsec = curs.fetchone()
  curs.close()
  numfac = regsec[0]
  
  print (numfac)
  
  ##SECUENCIA TRIBUTARIA
  # sql = "select seccue from secuencias_tmp where  codemp='{}' and codalm='{}' and numcaj='{}' and codsec='PV_FAC'".format(
  sql = "select seccue from secuencias_tmp where  codemp='{}' and codalm='{}' and codsec='PV_FAC'".format(
  # datos['codemp'], datos['codalm'], datos['numcaj'])
  datos['codemp'], datos['codalm'])
  curs = conn.cursor()
  curs.execute(sql)
  regsec = curs.fetchone()
  curs.close()
  numfac_tributaria = regsec[0]
  
  print (numfac_tributaria)
  
  
  
  
  ##PARA OBTENER CODIGO DE VENDEDOR
  curs = conn.cursor()
  sql = "SELECT v.codven, nomven FROM vendedorescob v, usuario u where v.codus1 = u.codus1 and v.codusu = u.codusu and u.codus1='{}' and u.codemp='{}'"\
        .format(datos['codus1'],datos['codemp'])
  curs.execute(sql)
  r = curs.fetchone()
  codven = r[0]
  print ("COD VENDEDOR")
  print (codven)
  
  codusu = r[1]
  print ("CODUSU")
  print (codusu)
  
  
  ##PARA OBTENER CODIGO DE VENDEDOR
  curs = conn.cursor()
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
    tipcre = datos['tipcre']
    numpag = datos['numpag']
    plapag = datos['plapag']
    valcre = datos['valcre']
    forpag = datos['forpag']
    cuecob = datos['cuecob']
	
      
  # SELECT vc_lis FROM "DBA"."parametrosiniciales" where numren='PV' and codemp='01'
  
  
  
  # sql = "select seccue from secuencias_tmp where  codemp='{}' and codalm='{}' and numcaj='{}' and codsec='PV_FAC'".format(
   # datos['codemp'], datos['codalm'], datos['numcaj']
  # )
  # curs = conn.cursor()
  # curs.execute(sql)
  # regsec = curs.fetchone()
  # curs.close()
  # if regsec == None:
    # faccli = 1
  # else:
    # faccli = regsec[0]
  # # string_campos = 'numfac,codemp,codven,codalm,nomcli,codban,codtar,coddep,fecfac,lispre,observ,poriva,totnet,totdes,totbas,totfac,fecven,conpag,tipefe,valefe,tipche,numche,valche,tiptar,numtar,valtar,tipdep,numdep,valdep,pordes,tiptra,numtra,totiva,totrec,codusu,fecult,codmon,valcot,codcli,estado,numcaj,hora,otrcar,telcli,observacion,factok,facnot,codapu,tipcre,numpag,plapag,valcre,proyecto,forpag,cuecob,anulada,mes,dia,pagada,codruta,guia_remision,valor_asegurado,codremitente,nomremitente,telremitente,ruccedremitente,coddestinat,nomdestinat,teldestinat,entregardestinat,asegurado,paga_seguro,tipodocumento,guia_origen,nummanifiesto,tipo_guia,endespacho,opcion,anticipo,codvhi,numdoc,codcom,codiva,porivar,valiva,codret,porret,valret,serie,autorizacion,numret,numiva,num_contribuyente,vigencia,fecauto,faccli,turno,inscripcion,sri_fuente,sri_iva,periodo,tipoorigen'
  
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
	
	
  string_campos = '''numfac,codemp,codven,codalm,nomcli,fecfac,totnet,totdes,totbas,poriva,totfac,tipefe,valefe,tipche,numche,
  valche,tiptar,numtar,valtar,totiva,totrec,codusu,fecult,codmon,valcot,codcli,estado,numcaj,telcli,codiva,porivar,valiva,codret,porret,valret,faccli,tipodocumento,serie,turno,inserta,otrcar,
  factok,facnot,codapu,tipoorigen,tipdep,numdep,valdep,tiptra,fecven,lispre,hora,conpag,tipcre,numpag,plapag,valcre,forpag,cuecob,pordes'''
  
  
      # tipcre
    # numpag
    # plagag
    # valcre
    # forpag
    # cuecob	
  
  sql = """insert into encabezadopuntosventa ({}) values('{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}',{},'{}','{}',{},'{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}',{},{},{},{},{},{},'{}','{}','{}','{}',{},'{}','{}','{}','{}','{}','{}',{},'{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}')
  """.format(string_campos,numfac,datos['codemp'],codven,datos['codalm'],datos['nomcli'],
  datos['fecfac'],datos['totnet'],datos['totdes'],datos['totnet'],datos['poriva'],datos['totfac'],datos['tipefe'],datos['valefe'],datos['tipche'],
  datos['numche'],datos['valche'],datos['tiptar'],datos['numtar'],datos['valtar'], datos['totiva'],datos['totrec'],codusu,datos['fecfac'],'01','1',datos['codcli'],'X',
  datos['numcaj'],datos['telcli'],codiva,porivar,valiva,
  codret,porret,valret,numfac_tributaria,'01',datos['serie'],datos['turno'],'null','0','O','F','FC'+numfac,'NC','X','null','0','1',datos['fecfac'],lispre,hora,datos['conpag'],tipcre,numpag,plapag,valcre,forpag,cuecob,datos['pordes']) 
  curs = conn.cursor()

  print (sql)
  curs.execute(sql)
  curs.close()
  conn.commit()
  
  
  
  print ("PARA OBTENER SECUENCIA INTERNA NUEVA")
  print (numfac)
  print (len(numfac))
  print (int(numfac)+1)
  print (str((int(numfac)+1)).zfill(len(numfac)))
  numfac_nueva = str((int(numfac)+1)).zfill(len(numfac))
  
  #### CAMBIO DE SECUENCIAS  ####
  curs = conn.cursor()
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
  curs = conn.cursor()
  # sql = "update secuencias_tmp set seccue = '{}' where codalm='{}' and codsec = 'PV_FAC' and codemp='{}' and numcaj='{}'".format(numfac_tributaria_nueva,datos['codalm'],datos['codemp'],datos['numcaj'])
  sql = "update secuencias_tmp set seccue = '{}' where codalm='{}' and codsec = 'PV_FAC' and codemp='{}'".format(numfac_tributaria_nueva,datos['codalm'],datos['codemp'])
  curs.execute(sql)
  conn.commit()
  
  print("CERRANDO SESION SIACI")
  curs.close()
  conn.close()
  resp = {'status': 'INSERTADO CON EXITO','numfac': numfac}
  # resp = {'status': 'INSERTADO CON EXITO','numfac': '1111'}
  response = make_response(dumps(resp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  
@app.route('/generar_renglones_pdv', methods = ['POST'])
def generar_renglones_pdv():
  datos = request.json
  print ("##########  ENTRADA GENERAR RENGLONES PEDIDOS ######")
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
  curs = conn.cursor()
  
  codemp=datos['codemp']  
  print ("CODEMP " +codemp )  
 
  # TIPTRA = '1' 
  # print ("TIPTRA "+TIPTRA )

  codcen='01.' 
  print ("codcen" + codcen)
  
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
  print ("CANTID "+cantid)  

  preuni=datos['prec01']
  print ("PREUNI "+ str(preuni))   
 
  totren=datos['subtotal_art']
  print ("TOTREN "+str(totren))    

  codiva=datos['codiva']
  print ("CODIVA "+codiva) 
  
  desren=datos['punreo']
  print ("DESREN "+str(desren))
  
  numcaj=datos['numcaj']
  print ("NUMCAJ "+numcaj) 
  
  ## PARA OBTENER EL PROYECTO (CLASE DE ARTICULO)
  
  # SELECT codcla FROM "DBA"."articulos" where codemp='01' and codart='304222'
  
  FLAG_ARTICULO = 0
  ##PARA OBTENER CODIGO DE VENDEDOR
  curs = conn.cursor()
  sql = "SELECT codcla FROM articulos where codemp='{}' and codart='{}'"\
        .format(datos['codemp'],datos['codart'])
  curs.execute(sql)
  r_codcla = curs.fetchone()
  if (r_codcla):
    proyecto=r_codcla[0]
    FLAG_ARTICULO = 1
	
  else:
    proyecto= 'null'
  
  
  # acumula=1
  # print ("ACUMULA "+str(acumula))
  
  # num_docs=datos['observ']
  # pattern_observ = re.compile(r'Puede agregar detalles del artículo')
  
  # if pattern_observ.search(num_docs):
     # print ("SETEO OBSERVACION A NULL")
     # num_docs= ""

  # print ("DESCRIP_ART "+num_docs)
  
  sql = "INSERT INTO renglonespuntosventa (codemp,numfac,numren,numite,codart,nomart,coduni,cantid,preuni,totren,estart,estcan,estpre,codiva,codmon,valcot,totext,numcaj,proyecto,codcen,tipodocumento,totaldesc,peso,inserta) values('{}','{}','{}',{},'{}','{}','{}','{}','{}',{},'{}','{}','{}','{}','{}','{}','{}','{}',{},'{}','{}','{}','{}',{})"\
        .format(codemp,NUMFAC,numren,numren,codart,nomart,coduni,cantid,preuni,totren,"P","P","P",codiva,"01","1",totren,numcaj,proyecto,codcen,"01",desren,"0.00","null")

  print (sql) 
  curs.execute(sql)
  conn.commit()
  
  
  if (FLAG_ARTICULO == 1):
    ### SI ES ARTICULO, RESTO
    sql = "update articulos set exiact = (exiact-{}) where codemp='{}' and codart='{}'"\
        .format(cantid,datos['codemp'],datos['codart'])
    print (sql) 
    curs.execute(sql)
    conn.commit()
  
  
  
  conn.close()

  d = {'status': 'INSERTADO RENGLON'}
  response = make_response(dumps(d, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)
  


@app.route('/generar_pedido', methods=['POST'])
def generar_pedido():
  datos = request.json
  print ("##########  ENTRADA GENERAR PEDIDOS ######")
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
  
  print ("TIPTRA")
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
  ESTADO='P'
  print (ESTADO)
  
  sql = "SELECT seccue FROM secuencias where codalm=\'01\' and codsec = \'VC_PED\' and codemp='{}'".format(datos['codemp'])
  curs.execute(sql)
  r = curs.fetchone()
  NEXT_NUMTRA=r[0]
  
  print ("OBSERVACION")
  observ=datos['observ']
  print (observ)
  
  # print ("NEXT_NUMTRA")
  # print (NEXT_NUMTRA)
  
  sql = "INSERT INTO encabezadopedpro (codemp,tiptra,numtra,codcli,codven,codalm,fectra,lispre,totnet,codmon,valcot,codusu,fecult,codcen,estado,descuento,iva_cantidad,iva_pctje,externo,observ,ciucli) values('{}',{},'{}','{}','{}','{}',{},'{}','{}','{}','{}','{}',{},'{}','{}',{},{},{},{},'{}','{}' )"\
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
  sql = "update secuencias set seccue = '{}' where codalm=\'01\' and codsec = \'VC_PED\' and codemp='{}'".format(numfac_nueva,datos['codemp'])
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
  
  
@app.route('/actualizar_encabezado_pedido', methods=['POST'])
def actualizar_encabezado_pedido():
  datos = request.json
  print ("##########  ENTRADA ACTULIZACION ENCABEZADO PEDIDOS ######")
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
  curs = conn.cursor()
  fecult='DATE(\''+datos['fecult']+'\')'
  print ("FECULT")
  print (fecult)

  sql = "update encabezadopedpro set codcli= '{}',observ='{}',ciucli='{}',totnet={},iva_cantidad={}, fecult= '{}', fectra= '{}' where codemp='{}' and numtra='{}' and tiptra=1"\
  .format(datos['codcli'],datos['observ'],datos['ciucli'],datos['totnet'],datos['iva_cantidad'],datos['fecult'],datos['fectra'],datos['codemp'],datos['numtra'])
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

@app.route('/generar_renglones_pedido', methods=['POST'])
def generar_renglones_pedido():
  datos = request.json
  print ("##########  ENTRADA GENERAR RENGLONES PEDIDOS ######")
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
  print ("NOMART "+nomart )  

  coduni=datos['coduni']
  print ("CODUNI "+coduni) 

  cantid=datos['cant']
  print ("CANTID "+cantid)  

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
  
  num_docs=datos['observ']
  pattern_observ = re.compile(r'Puede agregar detalles del artículo')
  
  if (pattern_observ.search(num_docs)):
     print ("SETEO OBSERVACION A NULL")
     num_docs= ""

  print ("DESCRIP_ART "+num_docs)

# insert into renglonespedpro (codemp,tiptra,numtra,numren,codart,nomart,coduni,cantid,preuni,totren,codiva,codcen,desren,acumula)
# values ('01',1,'30000030',1,'75W-90','ACEITE CAJAC MEC GETRIEBEOL EP SYNTH','UNI',1,11.62,10.46,'S','01.',10,1)
  
  sql = "INSERT INTO renglonespedpro (codemp,tiptra,numtra,numren,codart,nomart,coduni,cantid,preuni,totren,codiva,codcen,desren,acumula,num_docs) values('{}','{}','{}',{},'{}','{}','{}','{}','{}',{},'{}','{}',{},{},'{}')"\
        .format(codemp,TIPTRA,NUMTRA,numren,codart,nomart,coduni,cantid,preuni,totren,codiva,codcen,desren,acumula,num_docs)

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
  
@app.route('/actualizar_renglones_pedido', methods=['POST'])
def actualizar_renglones_pedido():
  datos = request.json
  print ("##########  ENTRADA ACTUALIZAR RENGLONES PEDIDOS ######")
  print (datos)
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
  
  num_docs=datos['observ']
  pattern_observ = re.compile(r'Puede agregar detalles del artículo')
  
  if (pattern_observ.search(num_docs) or (num_docs == 'null')):
     print ("SETEO OBSERVACION A NULL")
     num_docs= ""

  print ("DESCRIP_ART "+num_docs)

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
  
@app.route('/generar_pedido_ruta', methods=['POST'])
def generar_pedido_ruta():
  datos = request.json
  print ("##########  ENTRADA GENERAR PEDIDO RUTA ######")
  print (datos)
  
  dateTimeObj = datetime.now()
  hora= dateTimeObj.strftime("%H:%M:%S")
  print (hora)

  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
  curs = conn.cursor()
  
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

  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
  curs = conn.cursor()
  campos = ['codemp', 'nomcli','rucced','codcli','email','dircli','ciucli','telcli','telcli2']
  # sql = "select codemp,nombres, rucced, codcli,email,dircli,ciucli,telcli,telcli2 from clientes where codemp='{}' and rucced like '%{}%'".format(datos['codemp'],datos['ruc'])
  sql = "select codemp,nombres, rucced, codcli,email,dircli,ciucli,telcli,telcli2 from clientes where codemp='{}' and rucced = '{}' and tpIdCliente='{}'".format(datos['codemp'],datos['ruc'],datos['tpIdCliente'])
  curs.execute(sql)
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
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
        conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
        conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
        conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
    except Exception as e:
        print (str(e))
    sql = """      
          select idruta,id_agencia,
          (select r.descripcion from ruta r where trim(r.codruta) = pr.idruta and r.codemp = pr.empresa) as ruta,
          (select dir_agencia ac from agencia_cliente ac where ac.empresa = pr.empresa and ac.id_agencia = pr.id_agencia) as dir_agencia
          from pedido_ruta pr
          where pr.empresa = '{}'
          and pr.numtra_pedido = '{}'
          """.format(datos['codemp'],datos['pedido'])
    curs = conn.cursor()
    curs.execute(sql)
    campos = ['idruta','id_agencia','nombre_ruta','dir_agencia']
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
        conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
    except Exception as e:
        print (str(e))
    sql = """      
           update pedido_ruta set idruta = '{}', id_agencia = '{}', fecha_entrega = null, hora_entrega = null where numtra_pedido = '{}' and empresa='{}';
          """.format(datos['idruta'],datos['id_agencia'],datos['numtra_pedido'],datos['empresa'])
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
        conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
          and p.fectra = ep.fectra
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
        conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
          and p.fectra = ep.fectra
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
        conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
        conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
        conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
        conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
  curs = conn.cursor()
  
  ## SECUENCIA CLIENTE  ###
  sql = "select max(seccli) from clientes where codemp='{}'".format(datos['codemp'])
  curs.execute(sql)
  r = curs.fetchone()
  # curs.close()
  codcli = str(r[0]).zfill(8)  ####COMPLETAR CON 0
  print (codcli)
  
  
  ##PARA OBTENER CODIGO DE VENDEDOR
  sql = "SELECT v.codven, nomven FROM vendedorescob v, usuario u where v.codus1 = u.codus1 and v.codusu = u.codusu and u.codus1='{}' and u.codemp='{}'"\
        .format(datos['codus1'],datos['codemp'])
  curs = conn.cursor()
  curs.execute(sql)
  r = curs.fetchone()
  codven = r[0]
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
  if (exist_cliente == 0):
      print ("###### CREO CLIENTE  ####")
      sql = """
      insert into clientes (codemp,codcli,nomcli,rucced,dircli,telcli,telcli2,estatus,apliva,limcre,lispre,codusu,fecult,ciucli,codven,email,seccli,tipo,nombres,codcla,tpIdCliente,tipovendedor)
      values ('{}','{}','{}','{}','{}','{}','{}','C',0,0,1,'{}',DATE('{}'),'{}','01','{}',(select (max(seccli)+1) from clientes),'{}','{}','01','{}','G')
      """.format(datos['codemp'],codcli,datos['nomcli'],datos['rucced'],datos['dircli'],datos['telcli'],datos['telcli2'],datos['codus1'],datos['fectra'],datos['ciucli'],datos['email'],datos['tipo'],datos['nomcli'],datos['tpIdCliente'])
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
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
  curs = conn.cursor()
  
	  
  print ("###### CREO CLIENTE  ####")
  sql = """
  update clientes set dircli='{}', telcli='{}', telcli2='{}', ciucli='{}', email='{}'
  where codemp='{}' and rucced='{}'
  """.format(datos['dircli'],datos['telcli'],datos['telcli2'],datos['ciucli'],datos['email'],datos['codemp'],datos['rucced'])
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
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
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
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
  curs = conn.cursor()
  sql_campos = 'nomcaj,numcaj'
  string_campos = 'nomcaj,numcaj'
  arr_campos = string_campos.split(',') 
  sql = "select {} from cajapuntoventa where codalm <> '%' and codemp='{}' and codalm='{}'".format(sql_campos, codemp, codalm)
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
  codusu = datos['codusu']
  print (datos['codusu'])
  print (datos['codemp'])
  
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
  curs = conn.cursor()
  sql_campos = 'codalm,nomalm'
  string_campos = 'codalm,nomalm'
  arr_campos = string_campos.split(',') 
  sql = "select {} from almacenes where codalm<>'%' and codemp='{}'".format(sql_campos, codemp)
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


@app.route('/reporte', methods=['POST'])
def reporte():
  datos = request.json
  print (datos)
  try:
    f1 = datos['f1'].split('T')[0]
    f2 = datos['f2'].split('T')[0]
  except Exception as e:
    print(e)
    f2 = time.strftime("%Y-%m-%d")
    f1 = date.today() + timedelta(days=-30)
    f1 = f1.strftime("%Y-%m-%d")

  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
  curs = conn.cursor()
  

  campos = 'idfactura,fechaemision,estadodocumento,descripcionerror,FechaAutorizacion,claveacceso,codigodocumento'
  arrcampos = campos.split(',')
  arrcampos.append('pdf')
  arrcampos.append('xml')
  arrcampos.append('zip')

  sql = """
  select idfactura,fechaemision,estadodocumento,descripcionerror,FechaAutorizacion,claveacceso,codigodocumento from factura_electronica 
  where identificacioncomprador='{}' and fechaemision between '{}' and '{}' and estadodocumento = 'AUTORIZADO'
  union 
  select idnotacredito,fechaemision,estadodocumento,descripcionerror,FechaAutorizacion,claveacceso,codigodocumento from nota_credito_electronica
  where identificacioncomprador='{}' and fechaemision between '{}' and '{}' and estadodocumento = 'AUTORIZADO'
  union
  select idretencion,fechaemision,estadodocumento,descripcionerror,FechaAutorizacion,claveacceso,codigodocumento from  retencion_electronica
  where identificacionproveedor='{}' and fechaemision between '{}' and '{}' and estadodocumento = 'AUTORIZADO'
   """.format(datos['ruc'],f1, f2,datos['ruc'],f1, f2,datos['ruc'],f1, f2)
  
  # select idguia,iniciotraslado,estadodocumento,fintraslado,placa,claveacceso,codigodocumento from  v_guia_electronica
  # where ructransportista='{}'
  curs = conn.cursor()
  curs.execute(sql)
  regs = curs.fetchall()
  resp = []
  # print (len(resp))
  for reg in regs:
    d = dict(zip(arrcampos,reg))
    try:
      d['pdf'] = urlfile + d['claveacceso'] + '.pdf'
      d['xml'] = urlfile + d['claveacceso'] + '.xml'
      d['zip'] = urlzip + d['claveacceso'] + '.zip'
      d['fechaa'] = d['FechaAutorizacion']
    except Exception as e:
      pass
    del d['FechaAutorizacion']
    d['fecha'] = d['fechaemision']
    # del d['fechaemision']
    d['clave'] = d['claveacceso']
    # del d['claveacceso']
    if d['codigodocumento'] == '01':
      d['tipodoc'] = 'factura'
    elif d['codigodocumento'] == '04':
      d['tipodoc'] = 'nota de credito'
    elif d['codigodocumento'] == '07':
      d['tipodoc'] = 'retencion'
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
    d['tipodoc'] = 'guia de remision'
    del d['codigodocumento']
    resp.append(d)

  conn.close()
  
  print (len(resp))
  response = make_response(dumps(resp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)

@app.route('/exist_identificacion', methods=['POST'])
def exist_identificacion():
  datos = request.json
  print (datos)
  print (datos['ruc'])
  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
  curs = conn.cursor()
    # sql = "select codus1, clausu from usuario where codus1='{}' and clausu='{}'".format(d['usuario'], d['password'])

  sql = """
  select idfactura,fechaemision,estadodocumento,descripcionerror,FechaAutorizacion,claveacceso,codigodocumento from factura_electronica 
  where identificacioncomprador='{}' and estadodocumento = 'AUTORIZADO'
  union 
  select idnotacredito,fechaemision,estadodocumento,descripcionerror,FechaAutorizacion,claveacceso,codigodocumento from nota_credito_electronica
  where identificacioncomprador='{}' and estadodocumento = 'AUTORIZADO'
  union
  select idretencion,fechaemision,estadodocumento,descripcionerror,FechaAutorizacion,claveacceso,codigodocumento from  retencion_electronica
  where identificacionproveedor='{}' and estadodocumento = 'AUTORIZADO'
   """.format(datos['ruc'],datos['ruc'],datos['ruc'])
  
  # select idguia,iniciotraslado,estadodocumento,fintraslado,placa,claveacceso,codigodocumento from  v_guia_electronica
  # where ructransportista='{}'
  curs = conn.cursor()
  curs.execute(sql)
  regs1 = curs.fetchall()
  # resp = []
  print (len(regs1))

  
  sqlguia = """select idguia,iniciotraslado,estadodocumento,fintraslado,placa,claveacceso,codigodocumento from  v_guia_electronica
  where ructransportista='{}'""".format(datos['ruc'])
  curs = conn.cursor()
  curs.execute(sqlguia)
  regs2 = curs.fetchall()
  resp = []
  print (len(regs2))
  conn.close()
  
  if ((len(regs1) == 0) and (len(regs2) == 0)):
   resp = {'codus1': 'false'}
  else:
   resp = {'codus1': 'true'}
  response = make_response(dumps(resp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)

@app.route('/images/<imagename>')
def images(imagename):
    imagename = imagename.replace("*","/")
    return send_from_directory(coneccion.imagenes, imagename)


@app.route('/reporteu', methods=['POST'])
def reporteu():
  datos = request.json
  print (datos)
  try:
    f1 = datos['f1'].split('T')[0]
    f2 = datos['f2'].split('T')[0]
  except Exception as e:
    print(e)
    f2 = time.strftime("%Y-%m-%d")
    f1 = date.today() + timedelta(days=-30)
    f1 = f1.strftime("%Y-%m-%d")

  if datos['ruc'] == None:
    datos['ruc'] = ''
  if datos['codemp'] == None:
    datos['codemp'] = ''
  
  codemp = datos['codemp']

  conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host+':'+coneccion.port)
  curs = conn.cursor()
  

  # campos = 'idfactura,fechaemision,razonsocial,identificacioncomprador,secuencialinterno,emailresponsable,dircomprador,importetotal,autorizacionsri,estadodocumento,descripcionerror,FechaAutorizacion,claveacceso,codigodocumento'
  campos = ''
  

  
  if datos['tipo'] == 'facturas':
    sql = """
    select idfactura,fechaemision,razonsocial,identificacioncomprador,secuencialinterno,emailresponsable,dircomprador,importetotal,autorizacionsri,estadodocumento,descripcionerror,FechaAutorizacion,claveacceso,codigodocumento from factura_electronica 
    where identificacioncomprador like'%{}%' and fechaemision between '{}' and '{}' and empresa = '{}' 
    """.format(datos['ruc'],f1, f2, codemp)
    campos = 'idfactura,fechaemision,razonsocial,identificacioncomprador,secuencialinterno,emailresponsable,dircomprador,importetotal,autorizacionsri,estadodocumento,descripcionerror,FechaAutorizacion,claveacceso,codigodocumento'
  elif datos['tipo'] == 'notascredito':
    # sql = """ 
    # select idnotacredito,fechaemision,estadodocumento,descripcionerror,FechaAutorizacion,claveacceso,codigodocumento from nota_credito_electronica
    # where identificacioncomprador like'%{}%' and fechaemision between '{}' and '{}' and empresa = '{}' 
    # """.format(datos['ruc'],f1, f2, codemp)
    # campos = 'idnotacredito,fechaemision,estadodocumento,descripcionerror,FechaAutorizacion,claveacceso,codigodocumento'
	
    sql = """ 
    select idnotacredito,fechaemision,razonsocial,identificacioncomprador,secuencialinterno,emailresponsable,ValorModificacion,autorizacionsri,estadodocumento,descripcionerror,FechaAutorizacion,claveacceso,codigodocumento from nota_credito_electronica
    where identificacioncomprador like'%{}%' and fechaemision between '{}' and '{}' and empresa = '{}' 
    """.format(datos['ruc'],f1, f2, codemp)
    # campos = 'idnotacredito,fechaemision,estadodocumento,descripcionerror,FechaAutorizacion,claveacceso,codigodocumento'
    campos = 'idnotacredito,fechaemision,razonsocial,identificacioncomprador,secuencialinterno,emailresponsable,ValorModificacion,autorizacionsri,estadodocumento,descripcionerror,FechaAutorizacion,claveacceso,codigodocumento'
  elif datos['tipo'] == 'retenciones':
    sql = """
    select idretencion,fechaemision,razonsocial,identificacionproveedor,secuencialinterno,emailresponsable,dirsujetoretenido,totalretencion,autorizacionsri,estadodocumento,descripcionerror,FechaAutorizacion,claveacceso,codigodocumento from retencion_electronica 
    where identificacionproveedor like'%{}%' and fechaemision between '{}' and '{}' and empresa = '{}' 
    """.format(datos['ruc'],f1, f2, codemp)
    campos = 'idretencion,fechaemision,razonsocial,identificacionproveedor,secuencialinterno,emailresponsable,dirsujetoretenido,totalretencion,autorizacionsri,estadodocumento,descripcionerror,FechaAutorizacion,claveacceso,codigodocumento'
    # sql = """
    # select idretencion,fechaemision,estadodocumento,descripcionerror,FechaAutorizacion,claveacceso,codigodocumento from  retencion_electronica
    # where identificacionproveedor like'%{}%' and fechaemision between '{}' and '{}' and empresa = '{}'
    # """.format(datos['ruc'],f1, f2, codemp)
    # campos = 'idretencion,fechaemision,estadodocumento,descripcionerror,FechaAutorizacion,claveacceso,codigodocumento'
  
  arrcampos = campos.split(',')
  arrcampos.append('pdf')
  arrcampos.append('xml')
  arrcampos.append('zip')
  arrcampos.append('mail')


  # select idguia,iniciotraslado,estadodocumento,fintraslado,placa,claveacceso,codigodocumento from  v_guia_electronica
  # where ructransportista='{}'
  curs = conn.cursor()
  curs.execute(sql)
  regs = curs.fetchall()
  resp = []
  for reg in regs:
    d = dict(zip(arrcampos,reg))
    # print(d)    
    try:
      d['pdf'] = urlfile + d['claveacceso'] + '.pdf'
      d['xml'] = urlfile + d['claveacceso'] + '.xml'
      d['zip'] = urlzip + d['claveacceso'] + '.zip'
      d['mail'] = urlmail + d['claveacceso'] + '/' + d['emailresponsable'] + '/' + codemp
      d['fechaa'] = d['FechaAutorizacion']
    except Exception as e:
      pass
    # del d['FechaAutorizacion']
    d['codemp'] = codemp
    d['fecha'] = d['fechaemision']
    # del d['fechaemision']
    d['clave'] = d['claveacceso']
    # del d['claveacceso']
    if d['codigodocumento'] == '01':
      d['tipodoc'] = 'factura'
    elif d['codigodocumento'] == '04':
      d['tipodoc'] = 'nota de credito'
    elif d['codigodocumento'] == '07':
      d['tipodoc'] = 'retencion'
    # del d['codigodocumento']
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
      d['mail'] = urlmail + d['claveacceso'] + '/' + d['emailresponsable'] + '/' + codemp
      d['fechaa'] = d['FechaAutorizacion']
    except Exception as e:
      pass
    # del d['FechaAutorizacion']
    d['codemp'] = codemp
    d['fecha'] = d['fechaemision']
    # del d['fechaemision']
    d['clave'] = d['claveacceso']
    # del d['claveacceso']
    d['tipodoc'] = 'guia de remision'
    # del d['codigodocumento']
    resp.append(d)

  conn.close()
  # print (resp)
  response = make_response(dumps(resp, sort_keys=False, indent=2, default=json_util.default))
  response.headers['content-type'] = 'application/json'
  return(response)




if __name__ == "__main__":
    # app.config['SESSION_TYPE'] = 'memcached'
    # app.run(host='0.0.0.0', port=5000)
    # app.run(debug=True, host='0.0.0.0', port=5000)
	app.config['SESSION_TYPE'] = 'memcached'
	PUERTO_EXE = '5000'
	GEOLOC = 'NO'
	
	
	PATH_CONFIG = APP_PATH+'\\CONFIG_API_WEB.txt'
	if os.path.isfile(PATH_CONFIG):
		config = open(PATH_CONFIG,"r")
		for linea in config.readlines():
			pattern_port = re.compile(r'PUERTO=')
			pattern_geolocalizacion = re.compile(r'ACTIVAR_GEOLOCALIZACION=')
			if pattern_port.match(linea):
				linea_array = linea.split('=')
				PUERTO_EXE = linea_array [1]
				print ("###PUERTO DE ESCUCHA API EN EL ARCHIVO DE CONFIGURACION= "+PUERTO_EXE)
			if pattern_geolocalizacion.match(linea):
				linea_array = linea.split('=')
				GEOLOC = linea_array [1].replace('\n','')
				print ("###GEOLOCALIZACION ACTIVA= "+GEOLOC)
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


	if (GEOLOC == 'NO'):
		print ("### SE PUBLICARÁ POR HTTP NORMAL ###")
		app.run(host='0.0.0.0',debug=True,threaded=True, port=PUERTO_EXE)
	if (GEOLOC == 'SI'):
		print ("### SE PUBLICARÁ POR HTTPS (MODO SEGURO) PARA RECIBIR COORDENADAS DE GOOGLE MAPS ###")
		app.run(host='0.0.0.0',debug=True,port=PUERTO_EXE,ssl_context=('SIACI_WEB.crt', 'SIACI_WEB.key'), threaded=True)


