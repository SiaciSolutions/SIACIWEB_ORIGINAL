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
  sql = """ SELECT ep.numtra+'*'+c.nomcli+'*'+ac.dir_agencia+'*'+substring(string(pr.hora_entrega),1,5) as hora_entrega 
        FROM "DBA"."encabezadopedpro" ep, clientes c,pedido_ruta pr, agencia_cliente ac  where ep.numtra in (
        select p.numtra_pedido
        from pedido_ruta p,ruta r, agencia_cliente s
        where p.idruta = trim(r.codruta) 
        and s.id_agencia = p.id_agencia
        and p.idruta = '{}'
        and p.fecha_entrega = '{}'
        and p.empresa = '{}'
        )and ep.codcli = c.codcli
        and ep.numtra = pr.numtra_pedido
        and ep.codemp = c.codemp
        and ep.codemp = '{}'
		and ep.estado <>'A'
		and ac.id_agencia = pr.id_agencia
		and ac.empresa = ep.codemp
        order by pr.hora_entrega asc """.format(datos['idruta'],datos['fecha_entrega'],datos['codemp'],datos['codemp'])
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
  sql = """SELECT ep.numtra+'*'+c.nomcli+'*'+ac.dir_agencia+'*'+substring(string(pr.hora_entrega),1,5)+'*'+ru.descripcion
        FROM "DBA"."encabezadopedpro" ep, clientes c,pedido_ruta pr, ruta ru, agencia_cliente ac
		where ep.numtra in (
        select p.numtra_pedido
        from pedido_ruta p,ruta r, agencia_cliente s
        where p.idruta = trim(r.codruta)
        and s.id_agencia = p.id_agencia
        and p.fecha_entrega = '{}'
        and p.empresa = '{}'
        )and ep.codcli = c.codcli
        and ep.codemp = c.codemp
        and ep.numtra = pr.numtra_pedido
        and ep.codemp = '{}'
        and ep.estado <>'A'
		and ac.id_agencia = pr.id_agencia
		and ac.empresa = ep.codemp
		and pr.idruta = trim(ru.codruta)
		and ep.codemp = ru.codemp
        order by descripcion,pr.hora_entrega asc """.format(datos['fecha_entrega'],datos['codemp'],datos['codemp'])
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
             and ep.codemp = s.empresa
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
  



if __name__ == "__main__":
    # app.config['SESSION_TYPE'] = 'memcached'
    # app.run(host='0.0.0.0', port=5000)
    # app.run(debug=True, host='0.0.0.0', port=5000)
	app.config['SESSION_TYPE'] = 'memcached'
	PUERTO_EXE = '5003'

	app.run(host='0.0.0.0',threaded=True, port=PUERTO_EXE)
	


