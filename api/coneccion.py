import winreg
import os
import re
import socket
import sys
# datos para conectarse a la base siaci
####################HACIA EL INDICADO POR SPAGFIG  ############### Venezuela01

# hKey = winreg.OpenKey(winreg.HKEY_CURRENT_USER,"Software\ODBC\ODBC.INI\spagfic")
# registrov = str(winreg.QueryValueEx(hKey, "CommLinks")).split('=')[1].split('}')[0]
# registrov = registrov.strip()
# server = registrov.replace(';',',')
# server = server.split(',')

# registrov = str(winreg.QueryValueEx(hKey, "DatabaseName"))
# registrov = registrov.strip().split(',')[0].replace('"','').replace("'","").replace('(','')
# database = registrov

# host = server[0]
# eng = database
pwd='197304'
uid='dba'

# print ("TOMANDO CONFIGURACION")
############PARAMETROS UTILIZADOS POR EL SCRIPT API.PY
host = ''
eng = ''
pwd=''
uid=''
port=''
ip = ''
puerto = ''
imagenes = ''

# xml = str(xml).replace('\n','')

APP_PATH = os.getcwd()
PATH_CONFIG = APP_PATH+'\\CONFIG_API_WEB.txt'
pattern_config_spagfic = re.compile(r'CONFIG_SPAGFIC=')

if os.path.isfile(PATH_CONFIG):
	config = open(PATH_CONFIG,"r")
	for linea in config.readlines():
		if pattern_config_spagfic.match(linea):
			linea_array = linea.split('=')
			config_spagfic = str(linea_array [1]).replace('\n','')
	config.close

	config = open(PATH_CONFIG,"r")
	for linea in config.readlines():
		if (config_spagfic == 'SI'):
			# print ("****TOMANDO CONFIGURACION CONEXION BD SIACI DEL SPAGFIG*****")
			hKey = winreg.OpenKey(winreg.HKEY_CURRENT_USER,"Software\ODBC\ODBC.INI\spagfic")
			registrov = str(winreg.QueryValueEx(hKey, "CommLinks")).split('=')[1].split('}')[0]
			registrov = registrov.strip()
			server = registrov.replace(';',',')
			server = server.split(',')
			registrov = str(winreg.QueryValueEx(hKey, "DatabaseName"))
			registrov = registrov.strip().split(',')[0].replace('"','').replace("'","").replace('(','')
			database = registrov
			host = server[0]
			eng = database
			pwd='197304'
			uid='dba'
			port='2638'
			print ("###HOST BD SIACI DEL SPAGFIG= "+host)
			print ("###ENG BD SIACI DEL SPAGFIG= "+eng)
			print ("###PORT BD SIACI DEL SPAGFIG= "+port)
			break
		if (config_spagfic == 'NO'):
			# print ("****TOMANDO CONFIGURACION CONEXION BD SIACI DEL ARCHIVO DE CONFIGURACION*****")
			# print (linea)
			pattern_host = re.compile(r'host=')
			pattern_eng = re.compile(r'eng=')
			pattern_pwd = re.compile(r'pwd=')
			pattern_uid = re.compile(r'uid=')
			pattern_port= re.compile(r'port=')
			if pattern_host.match(linea):
				linea_array = linea.split('=')
				host = str(linea_array [1]).replace('\n','')
				if host != "localhost":
					try: 
						socket.inet_aton(host)
					except socket.error: 
						print ("IP "+host+" DEL ARCHIVO DE CONFIGURACION NO VALIDA, INICIANDO POR EL HOST SIACI POR DEFECTO 127.0.0.1")
						host = '127.0.0.1'
				print ("###HOST BD SIACI DEL ARCHIVO DE CONFIGURACION= "+host)
			if pattern_eng.match(linea):
				linea_array = linea.split('=')
				eng = str(linea_array [1]).replace('\n','')
				print ("### ENG BD SIACI DEL ARCHIVO DE CONFIGURACION= "+eng)
			if pattern_pwd.match(linea):
				linea_array = linea.split('=')
				pwd = str(linea_array [1]).replace('\n','')
				# print ("### PWD BD SIACI DEL ARCHIVO DE CONFIGURACION= "+pwd)
			if pattern_uid.match(linea):
				linea_array = linea.split('=')
				uid = str(linea_array [1]).replace('\n','')
				# print ("### UID BD SIACI DEL ARCHIVO DE CONFIGURACION= "+uid)
			if pattern_port.match(linea):
				linea_array = linea.split('=')
				port = str(linea_array [1]).replace('\n','')
				try:
					entero = int(port)
				# # print("PUERTO VALIDO ENTERO")
				except ValueError:
					print("PUERTO "+port+" INVALIDO EN EL ARCHIVO DE CONFIGURACION, INICIANDO POR EL PUERTO de BD DE SIACI POR DEFECTO 2638  ")
					port = '2638'
				
				print ("### PORT BD SIACI DEL ARCHIVO DE CONFIGURACION= "+port)
				break
	config.close
	
	
	print ("### VALORES DE IP Y PUERTO ARCHIVO DE CONFIGURACION CONFIG_API_WEB.txt #########")
	PATH_CONFIG = APP_PATH+'\\CONFIG_API_WEB.txt'
	config = open(PATH_CONFIG,"r")
	IP_API = ''
	PUERTO = ''
	PATH_GENERADOS = ''
	CORREOS_DESTINO = ''
	GEOLOC = ''
	PUNTO_VENTA = ''
	ENVIAR_CORREO_PEDIDO_CLIENTE = ''
	ENVIAR_CORREO_FACTURACION = ''
	EDITAR_PEDIDO = ''
	ACTIVAR_CAJA_REG = ''
	ACTIVAR_CALENDARIO = ''
	ACTIVAR_TALLERES = ''
	ACTIVAR_SSL = ''
	ACTIVAR_CLIENTES = ''
	ACTIVAR_PEDIDOS = ''
	ACTIVAR_WHATSAPP = ''
	ACTIVAR_NOTIF_AUTO_FAC_WS = ''
	TELF_NOTIF_AUTO_FAC_WS = ''
	ACTIVAR_RETENCIONES_PDV = ''
	ACTIVAR_ABRIR_CIERRE_CAJA = ''
	ACTIVAR_TOTAL_RECIBIDO_CAMBIO = ''
	ACTIVAR_SELECC_ARTICULO_SERVICIO_PDV = ''
	ACTIVAR_PAGO_EFECTIVO_PDV=''
	ACTIVAR_PAGO_TARJETA_PDV=''
	ACTIVAR_PAGO_CHEQUE_PDV=''
	ACTIVAR_PAGO_TRANS_PDV=''
	ACTIVAR_PAGO_CREDITO_PDV=''
	ACTIVAR_EDICION_PLAZO_CREDITO=''
	CONSULTAR_ESTADO_CARTERA = ''
	ACTIVAR_ING_BODEGA = ''
	ACTIVAR_EGR_BODEGA= ''
	ACTIVAR_ARTICULO = ''
	ACTIVAR_SERVICIO = ''
	TIPO_BUSQUEDA_DEFECTO = ''
	SERVICIO_DEFECTO_PDV = ''
	CONF_PARAM_BD= ''
	
	
	
# ACTIVAR_ING_BODEGA=SI
# ACTIVAR_EGR_BODEGA=SI
# ACTIVAR_ARTICULO=SI
# ACTIVAR_SERVICIO=SI
	
	for linea in config.readlines():
		pattern_ip = re.compile(r'IP_API=')
		pattern_port = re.compile(r'PUERTO=')
		pattern_generados = re.compile(r'PATH_GENERADOS=')
		pattern_CORREOS_DESTINO= re.compile(r'CORREOS_DESTINO=')
		pattern_geolocalizacion = re.compile(r'ACTIVAR_GEOLOCALIZACION=')
		pattern_PUNTO_VENTA = re.compile(r'ACTIVAR_PUNTO_VENTA=')
		pattern_ENVIAR_CORREO_PEDIDO_CLIENTE = re.compile(r'ENVIAR_CORREO_PEDIDO_CLIENTE=')
		pattern_ENVIAR_CORREO_FACTURACION = re.compile(r'ENVIAR_CORREO_FACTURACION=')
		pattern_EDITAR_PEDIDO = re.compile(r'EDITAR_PEDIDO=')
		pattern_ACTIVAR_CAJA_REG = re.compile(r'ACTIVAR_CAJA_REG=')
		pattern_ACTIVAR_CALENDARIO = re.compile(r'ACTIVAR_CALENDARIO=')
		pattern_ACTIVAR_TALLERES= re.compile(r'ACTIVAR_TALLERES=')
		pattern_ACTIVAR_SSL= re.compile(r'ACTIVAR_SSL=')
		pattern_ACTIVAR_CLIENTES= re.compile(r'ACTIVAR_CLIENTES=')
		pattern_ACTIVAR_PEDIDOS= re.compile(r'ACTIVAR_PEDIDOS=')
		pattern_ACTIVAR_WHATSAPP= re.compile(r'ACTIVAR_WHATSAPP=')
		pattern_ACTIVAR_NOTIF_AUTO_FAC_WS= re.compile(r'ACTIVAR_NOTIF_AUTO_FAC_WS=')
		pattern_TELF_NOTIF_AUTO_FAC_WS= re.compile(r'TELF_NOTIF_AUTO_FAC_WS=')
		pattern_ACTIVAR_RETENCIONES_PDV= re.compile(r'ACTIVAR_RETENCIONES_PDV=')
		pattern_ACTIVAR_ABRIR_CIERRE_CAJA= re.compile(r'ACTIVAR_ABRIR_CIERRE_CAJA=')
		pattern_ACTIVAR_TOTAL_RECIBIDO_CAMBIO= re.compile(r'ACTIVAR_TOTAL_RECIBIDO_CAMBIO=')
		pattern_ACTIVAR_SELECC_ARTICULO_SERVICIO_PDV= re.compile(r'ACTIVAR_SELECC_ARTICULO_SERVICIO_PDV=')
		pattern_ACTIVAR_PAGO_EFECTIVO_PDV= re.compile(r'ACTIVAR_PAGO_EFECTIVO_PDV=')
		pattern_ACTIVAR_PAGO_TARJETA_PDV= re.compile(r'ACTIVAR_PAGO_TARJETA_PDV=')
		pattern_ACTIVAR_PAGO_CHEQUE_PDV= re.compile(r'ACTIVAR_PAGO_CHEQUE_PDV=')
		pattern_ACTIVAR_PAGO_TRANS_PDV= re.compile(r'ACTIVAR_PAGO_TRANS_PDV=')
		pattern_ACTIVAR_PAGO_CREDITO_PDV= re.compile(r'ACTIVAR_PAGO_CREDITO_PDV=')
		pattern_ACTIVAR_EDICION_PLAZO_CREDITO= re.compile(r'ACTIVAR_EDICION_PLAZO_CREDITO=')
		pattern_CONSULTAR_ESTADO_CARTERA= re.compile(r'CONSULTAR_ESTADO_CARTERA=')
		pattern_ACTIVAR_ING_BODEGA= re.compile(r'ACTIVAR_ING_BODEGA=')
		pattern_ACTIVAR_EGR_BODEGA= re.compile(r'ACTIVAR_EGR_BODEGA=')
		pattern_ACTIVAR_ARTICULO= re.compile(r'ACTIVAR_ARTICULO=')
		pattern_ACTIVAR_SERVICIO= re.compile(r'ACTIVAR_SERVICIO=')
		pattern_TIPO_BUSQUEDA_DEFECTO= re.compile(r'TIPO_BUSQUEDA_DEFECTO=')
		pattern_SERVICIO_DEFECTO_PDV= re.compile(r'SERVICIO_DEFECTO_PDV=')
		pattern_CONF_PARAM_BD= re.compile(r'CONF_PARAM_BD=')

		if pattern_ip.match(linea):
			# print ("OBTENGO IP")
			# print (linea)
			linea_array = linea.split('=')
			IP_API = linea_array [1]
		if pattern_port.match(linea):
			# print ("OBTENGO PUERTO")
			# print (linea)
			linea_array = linea.split('=')
			PUERTO = linea_array [1]
		if pattern_generados.match(linea):
			# print ("OBTENGO PUERTO")
			# print (linea)
			linea_array = linea.split('=')
			PATH_GENERADOS = linea_array [1]
		if pattern_CORREOS_DESTINO.match(linea):
			linea_array = linea.split('=')
			CORREOS_DESTINO = linea_array [1]
		if pattern_geolocalizacion.match(linea):
			linea_array = linea.split('=')
			GEOLOC = linea_array [1].replace('\n','')
		if pattern_PUNTO_VENTA.match(linea):
			linea_array = linea.split('=')
			PUNTO_VENTA = linea_array [1].replace('\n','')
		if pattern_ENVIAR_CORREO_PEDIDO_CLIENTE.match(linea):
			linea_array = linea.split('=')
			ENVIAR_CORREO_PEDIDO_CLIENTE = linea_array[1].replace('\n','')
		if pattern_ENVIAR_CORREO_FACTURACION.match(linea):
			linea_array = linea.split('=')
			ENVIAR_CORREO_FACTURACION = linea_array[1].replace('\n','')
		if pattern_EDITAR_PEDIDO.match(linea):
			linea_array = linea.split('=')
			EDITAR_PEDIDO = linea_array[1].replace('\n','')
		if pattern_ACTIVAR_CAJA_REG.match(linea):
			linea_array = linea.split('=')
			ACTIVAR_CAJA_REG = linea_array[1].replace('\n','')
		if pattern_ACTIVAR_CALENDARIO.match(linea):
			linea_array = linea.split('=')
			ACTIVAR_CALENDARIO = linea_array[1].replace('\n','')
		if pattern_ACTIVAR_ING_BODEGA.match(linea):
			linea_array = linea.split('=')
			ACTIVAR_ING_BODEGA = linea_array[1].replace('\n','')
		if pattern_ACTIVAR_TALLERES.match(linea):
			linea_array = linea.split('=')
			ACTIVAR_TALLERES = linea_array[1].replace('\n','')
		if pattern_ACTIVAR_SSL.match(linea):
			linea_array = linea.split('=')
			ACTIVAR_SSL = linea_array[1].replace('\n','')
		if pattern_ACTIVAR_CLIENTES.match(linea):
			linea_array = linea.split('=')
			ACTIVAR_CLIENTES = linea_array[1].replace('\n','')
		if pattern_ACTIVAR_PEDIDOS.match(linea):
			linea_array = linea.split('=')
			ACTIVAR_PEDIDOS = linea_array[1].replace('\n','')
		if pattern_ACTIVAR_WHATSAPP.match(linea):
			linea_array = linea.split('=')
			ACTIVAR_WHATSAPP = linea_array[1].replace('\n','')
		if pattern_ACTIVAR_NOTIF_AUTO_FAC_WS.match(linea):
			linea_array = linea.split('=')
			ACTIVAR_NOTIF_AUTO_FAC_WS = linea_array[1].replace('\n','')
		if pattern_TELF_NOTIF_AUTO_FAC_WS.match(linea):
			linea_array = linea.split('=')
			TELF_NOTIF_AUTO_FAC_WS = linea_array[1].replace('\n','')
		if pattern_ACTIVAR_RETENCIONES_PDV.match(linea):
			linea_array = linea.split('=')
			ACTIVAR_RETENCIONES_PDV = linea_array[1].replace('\n','')
		if pattern_ACTIVAR_ABRIR_CIERRE_CAJA.match(linea):
			linea_array = linea.split('=')
			ACTIVAR_ABRIR_CIERRE_CAJA = linea_array[1].replace('\n','')
		if pattern_ACTIVAR_TOTAL_RECIBIDO_CAMBIO.match(linea):
			linea_array = linea.split('=')
			ACTIVAR_TOTAL_RECIBIDO_CAMBIO = linea_array[1].replace('\n','')
		if pattern_ACTIVAR_SELECC_ARTICULO_SERVICIO_PDV.match(linea):
			linea_array = linea.split('=')
			ACTIVAR_SELECC_ARTICULO_SERVICIO_PDV = linea_array[1].replace('\n','')
		if pattern_ACTIVAR_PAGO_EFECTIVO_PDV.match(linea):
			linea_array = linea.split('=')
			ACTIVAR_PAGO_EFECTIVO_PDV = linea_array[1].replace('\n','')
		if pattern_ACTIVAR_PAGO_TARJETA_PDV.match(linea):
			linea_array = linea.split('=')
			ACTIVAR_PAGO_TARJETA_PDV= linea_array[1].replace('\n','')
		if pattern_ACTIVAR_PAGO_CHEQUE_PDV.match(linea):
			linea_array = linea.split('=')
			ACTIVAR_PAGO_CHEQUE_PDV = linea_array[1].replace('\n','')
		if pattern_ACTIVAR_PAGO_TRANS_PDV.match(linea):
			linea_array = linea.split('=')
			ACTIVAR_PAGO_TRANS_PDV = linea_array[1].replace('\n','')
		if pattern_ACTIVAR_PAGO_CREDITO_PDV.match(linea):
			linea_array = linea.split('=')
			ACTIVAR_PAGO_CREDITO_PDV = linea_array[1].replace('\n','')
		if pattern_ACTIVAR_EDICION_PLAZO_CREDITO.match(linea):
			linea_array = linea.split('=')
			ACTIVAR_EDICION_PLAZO_CREDITO = linea_array[1].replace('\n','')
		if pattern_CONSULTAR_ESTADO_CARTERA.match(linea):
			linea_array = linea.split('=')
			CONSULTAR_ESTADO_CARTERA = linea_array[1].replace('\n','')
		if pattern_ACTIVAR_EGR_BODEGA.match(linea):
			linea_array = linea.split('=')
			ACTIVAR_EGR_BODEGA = linea_array[1].replace('\n','')
		if pattern_ACTIVAR_ARTICULO.match(linea):
			linea_array = linea.split('=')
			ACTIVAR_ARTICULO = linea_array[1].replace('\n','')
		if pattern_ACTIVAR_SERVICIO.match(linea):
			linea_array = linea.split('=')
			ACTIVAR_SERVICIO = linea_array[1].replace('\n','')
		if pattern_TIPO_BUSQUEDA_DEFECTO.match(linea):
			linea_array = linea.split('=')
			TIPO_BUSQUEDA_DEFECTO = linea_array[1].replace('\n','')
		if pattern_SERVICIO_DEFECTO_PDV.match(linea):
			linea_array = linea.split('=')
			SERVICIO_DEFECTO_PDV = linea_array[1].replace('\n','')
		if pattern_CONF_PARAM_BD.match(linea):
			linea_array = linea.split('=')
			CONF_PARAM_BD = linea_array[1].replace('\n','')


			
		
		
		
		
	config.close

	# s1.strip()

	IP_API = str(IP_API).replace('\n','')
	IP_API = IP_API.strip()
	print ("### IP_API_XMLs_PDFs DEL ARCHIVO DE CONFIGURACION: "+IP_API)
	PUERTO = str(PUERTO).replace('\n','')
	PUERTO = PUERTO.strip()
	print ("### PUERTO_API_XMLs_PDFs DEL ARCHIVO DE CONFIGURACION: "+PUERTO)
	PATH_GENERADOS = str(PATH_GENERADOS).replace('\n','')
	PATH_GENERADOS = PATH_GENERADOS.strip()
	print ("### RUTA DE CARPETA GENERADOS DEL ARCHIVO DE CONFIGURACION: "+PATH_GENERADOS)
	imagenes = PATH_GENERADOS
	ip = IP_API
	puerto = PUERTO
	print ("### CORREOS DESTINO DEPARTAMENTO DE FACTURACION DEL ARCHIVO DE CONFIGURACION: "+CORREOS_DESTINO)
	print ("### GEOLOCALIZACION ACTIVA: "+GEOLOC)
	print ("### PUNTO_VENTA ACTIVA: "+PUNTO_VENTA)
	print ("### ENVIAR_CORREO_PEDIDO_CLIENTE  ACTIVA: "+ENVIAR_CORREO_PEDIDO_CLIENTE)
	print ("### ENVIAR_CORREO_FACTURACION  ACTIVA: "+ENVIAR_CORREO_FACTURACION)
	print ("### EDITAR_PEDIDO  ACTIVA: "+EDITAR_PEDIDO)
	
else:
	print ("### ARCHIVO config_frontend NO ENCONTRADO...INICIANDO CONEXION CONFIGURACION DE SIACI POR DEFECTO DEL REGISTRO DE WINDOWS")
	# print ("****TOMANDO CONFIGURACION CONEXION BD SIACI DEL SPAGFIG*****")
	hKey = winreg.OpenKey(winreg.HKEY_CURRENT_USER,"Software\ODBC\ODBC.INI\spagfic")
	registrov = str(winreg.QueryValueEx(hKey, "CommLinks")).split('=')[1].split('}')[0]
	registrov = registrov.strip()
	server = registrov.replace(';',',')
	server = server.split(',')
	registrov = str(winreg.QueryValueEx(hKey, "DatabaseName"))
	registrov = registrov.strip().split(',')[0].replace('"','').replace("'","").replace('(','')
	database = registrov
	host = server[0]
	eng = database
	pwd='197304'
	uid='dba'
	port='2638'
	ip = "127.0.0.1"
	puerto = "5000"
	imagenes = "C:\SISTEMA\GENERADOS"
	
	print ("###HOST del CommLinks registro windows  BD SIACI DEL SPAGFIG= "+host)
	print ("###ENG DatabaseName registro windows BD SIACI DEL SPAGFIG= "+eng)
	print ("###PORT BD SIACI DEL SPAGFIG= "+port)
	print ("###IP_API para los XMLs, PDFs y ZIPs y ENVIO CORREOS POR DEFECTO= "+ip)
	print ("###PUERTO_API para los XMLs, PDFs y ZIPs y ENVIO CORREOS POR DEFECTO="+puerto)
	print ("###RUTA DE LA CARPETA GENERADOS EN SIACI POR DEFECTO="+imagenes)


# datos donde se ejecutará el api
imagenes = "C:\SISTEMA\GENERADOS" #"U:\\GENERADOS"
ip = "127.0.0.1"
puerto = "5001"