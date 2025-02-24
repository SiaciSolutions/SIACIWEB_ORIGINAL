from docxtpl import DocxTemplate
from docxtpl import InlineImage
from docx.shared import Mm
import sys
import os
import comtypes.client
import win32com.client
import win32process
import shutil
import coneccion
import sqlanydb
from jinja2 import Environment, FileSystemLoader
from reportlab.graphics.barcode import code93
from reportlab.graphics.barcode import code39
from reportlab.graphics.barcode import usps
from reportlab.graphics.barcode import usps4s
from reportlab.graphics.barcode import ecc200datamatrix
from reportlab.graphics.barcode import code128
from xhtml2pdf import pisa             # import python module


def convert_decimal(d):
	print ("ESTOY EN CONVERT")
	total_pedido = str(format(d,",.2f")).replace(',',' ')
	total_pedido = str(total_pedido).replace('.',',')
	total_pedido = str(total_pedido).replace(' ','.')
	total_pedido = str(total_pedido).replace(',00','')
	return total_pedido
	
def from_template(template, output):
		"""
		Generate a pdf from a html file
		
		Parameters
		----------
		source : str
			content to write in the pdf file
		output  : str
			name of the file to create
		"""
		## Reading our template
		source_html = open(template, "r")
		content = source_html.read() ## the HTML to convert
		source_html.close() ## close template file
		
		html_to_pdf(content, output)

# Methods section ....
def html_to_pdf(content, output):
		"""
		Generate a pdf using a string content
		
		Parameters
		----------
		content : str
			content to write in the pdf file
		output  : str
			name of the file to create
		"""
		## Open file to write
		result_file = open(output, "w+b") # w+b to write in binary mode.
		
		## convert HTML to PDF
		pisa_status = pisa.CreatePDF(
				content,                   # the HTML to convert
				dest=result_file	       # file handle to recieve result
		)           

		##close output file
		result_file.close()

		result = pisa_status.err

		if not result:
			print("Successfully created PDF")
		else:
			print("Error: unable to create the PDF")    

		## return False on success and True on errors
		return result


class GEN_PDF():
	def gen_pdf(self, codemp, numtra, codusl,tiptra):
		APP_PATH = os.getcwd()
		print (APP_PATH)
		
		codemp=codemp
		numtra=numtra
		codusl=codusl
		
		conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
		curs = conn.cursor()
        
		sql = """SELECT 
        nomemp,dir01,ruc,lugemp,(select logoemp from dato_empresa d where d.codemp=e.codemp)
        FROM empresa e
        where codemp='{}'
		""".format(codemp)
		curs.execute(sql)
		r = curs.fetchone()
		print (r)
        
		ruc_empresa=r[2]
		razon_social_empresa = r[0]
		dir_empresa=r[1]
		ciudad_empresa=r[3]
		logoemp = r[4]
        
			
		sql = """
		SELECT p.numtra,DATEFORMAT(p.fectra, 'DD-MM-YYYY') as fectra ,c.rucced,c.nombres,c.dircli,c.telcli,c.email,p.soli_gra,
        p.totnet,p.iva_cantidad,p.codusu,p.ciucli,
		(SELECT nomven FROM vendedorescob v where v.codus1='{}' and v.codemp='{}'), 
        round((p.totnet+iva_cantidad),2) as total_pedido,p.iva_pctje,p.condiciones_pago,p.info_adicional,p.tiempo_entrega
		FROM encabezadopedpro p, clientes c
		where p.numtra = '{}' and p.tiptra = {} and p.codemp='{}'
		and p.codcli=c.codcli
        and p.codemp = c.codemp
		""".format(codusl,codemp,numtra,tiptra,codemp)
		curs.execute(sql)
		r = curs.fetchone()
		print (r)

		if (tiptra=='1'):
			tipodoc='PEDIDO'
		if (tiptra=='2'):
			tipodoc='PROFORMA'
		num_pedido = r[0]
		fectra = r[1]
		identificacion=r[2]
		cliente=r[3]
		direccion=r[4]
		telefono=r[5]
		email=r[6]
        
        
		observ=r[7]
		if observ == None:
			observ = ''
		condiciones_pago = r[15]
		if condiciones_pago == None:
			condiciones_pago = ''
		info_adicional = r[16]
		if info_adicional == None:
			info_adicional = ''
		tiempo_entrega = r[17]
		if tiempo_entrega == None:
			tiempo_entrega = ''

		# totnet=format(r[8], ',')
		# iva_cantidad=format(r[9], ',')
		# total_pedido=format(r[13], ',')

		totnet=r[8]
		iva_cantidad=r[9]
		total_pedido=r[13]

		codusu=r[10]
		ciucli=r[11]
		nomven=r[12]


		iva_pctje=format(r[14])

        


		print (num_pedido,fectra,identificacion,cliente,direccion,telefono,email,observ,totnet,iva_cantidad,codusu,ciucli,nomven,total_pedido,condiciones_pago,info_adicional,tiempo_entrega)
		# print (total_neto)

		sql = """
		SELECT codart,nomart, coduni,
		cantid,
		preuni,
		(select i.poriva from iva i where i.codiva=r.codiva) as poriva,
		round (((totren*poriva)/100),2) as cant_iva,
		totren,desren,num_docs,
		round((((desren*preuni)/100) * cantid),2) as des_cant 
		FROM renglonespedpro r
		where numtra='{}' and codemp='{}' and tiptra={} order by numren asc
		""".format(numtra,codemp,tiptra)
		print (sql)
		curs.execute(sql)
		r = curs.fetchall()
		campos = ['codart','nomart','coduni','cantid','preuni','poriva','cant_iva','totren','desren','num_docs','des_cant']
		renglones_pedido = []
		for reg in r:
		   # print (reg)
		   # reg_encabezado = dict(zip(campos, reg))
		   # renglones_pedido.append(reg_encabezado)
           # datos['ruta'] = 'null'  if datos['ruta'] == None else "'"+datos['ruta']+"'"
			# print (reg)
			observacion = '' if reg[9] == None else reg[9]
			coduni = 'N/A' if reg[2] == None else reg[2]			 			
			# row_db = [reg[0],reg[1],reg[2],convert_decimal(reg[3]),convert_decimal(reg[4]),reg[5],convert_decimal(reg[6]),convert_decimal(reg[7]),convert_decimal(reg[8]),observacion,convert_decimal(reg[10])]
			# reg = (reg[0],reg[1],reg[2],convert_decimal(reg[3]),convert_decimal(reg[4]),reg[5],convert_decimal(reg[6]),convert_decimal(reg[7]),convert_decimal(reg[8]),observacion,convert_decimal(reg[10]))
            ####### EMPRESA DE ETIQUETAS  ####### "{:.6f}".format(reg[4])
            # {{ "$%.2f"|format(price) }}
			reg = (reg[0],reg[1],coduni,reg[3],reg[4],reg[5],format(reg[6], ','),reg[7],reg[8],observacion,reg[10])

			print (reg)
			# row = (row_db[0],row_db[1],row_db[2],row_db[3],row_db[4],row_db[5],row_db[6],row_db[7],row_db[8],row_db[9],row_db[10],row_db[11],row_db[12])
			reg_encabezado = dict(zip(campos, reg))
			renglones_pedido.append(reg_encabezado)
		print (renglones_pedido) 
		# conn.close()

		sql = """SELECT VALOR FROM "DBA"."parametros_siaciweb" where parametro='FORMATO_PEDIDO' AND CODEMP='{}'""".format(codemp)
		curs.execute(sql)
		r = curs.fetchone()
		print (r)
        
		ruta_plantilla_pedidos=r[0]
        
		conn.close()


        
		# tpl=DocxTemplate(APP_PATH+'\\PLANTILLA_PEDIDOS\\PEDIDO_PLANTILLA_PYTHON3.docx')# The image must be already saved on the disk
		tpl=DocxTemplate(APP_PATH+ruta_plantilla_pedidos)# The image must be already saved on the disk
        # reading images from url is not supported
		# logo = InlineImage(tpl, 'C:\\SISTEMA\\LOGO_PEDIDO.png', width=Mm(100) ,height=Mm(20))
		# logo = InlineImage(tpl,logoemp, width=Mm(90) ,height=Mm(18))
		logo = InlineImage(tpl,logoemp)
        
		context = { 'fectra' : fectra,
					'num_pedido' : num_pedido,
					'cliente' : cliente,
					'identificacion' : identificacion,
					'direccion' : direccion,
					'telefono' : telefono,
					'email' : email,
					'totnet' : totnet,
					'iva_cantidad' : iva_cantidad,
					'observ' : observ,
					'nomven' : nomven,
					'total_pedido' : total_pedido,
                    'iva_pctje' : iva_pctje,
					'renglones_pedido': renglones_pedido,  #####ARREGLO DE RENGLONES
                    'logo' : logo,
                    'rz_empresa' : razon_social_empresa,
                    'ruc_empresa':ruc_empresa,
                    'direccion_empresa': dir_empresa,
                    'lugemp': ciudad_empresa,
                    'tipodoc': tipodoc,
                    'condiciones_pago':condiciones_pago,
                    'validez':info_adicional,
                    'tiempo_entrega':tiempo_entrega
                    
                    
		}

		tpl.render(context)
		if (tiptra=='1'):
			word_out = APP_PATH+'\\PLANTILLA_PEDIDOS\\PEDIDO_'+codemp+'_'+num_pedido+'_WEB.docx'
		if (tiptra=='2'):
			word_out = APP_PATH+'\\PLANTILLA_PEDIDOS\\PROFORMA_'+codemp+'_'+num_pedido+'_WEB.docx'
		tpl.save(word_out)

		###CONVERTIR A PDF EL PEDIDO PEDIDO_10000221_WEB.pdf
		print ("########### CONVIRTIENDO A PDF aa ###########")
		comtypes.CoInitialize()
		c = win32com.client.DispatchEx("Word.Application")
		# t, p = win32process.GetWindowThreadProcessId(c.Hwnd)
		# print (p)
		
		f = word_out
		if (tiptra=='1'):
			dest = APP_PATH+'\\PLANTILLA_PEDIDOS\\PEDIDO_'+codemp+'_'+num_pedido+'_WEB.pdf'
		if (tiptra=='2'):
			dest = APP_PATH+'\\PLANTILLA_PEDIDOS\\PROFORMA_'+codemp+'_'+num_pedido+'_WEB.pdf'
		doc = c.Documents.Open(f)
		doc.SaveAs(dest, FileFormat=17)
		doc.Close()
		c.Quit()
		del c
		os.remove(word_out)
		
		

		
		# c.convert(f, dest, "-c PDF") PEDIDO_10000221_WEB.pdf
		# sleep(0.2) # Time in seconds
		comtypes.CoUninitialize()
		return 'PDF GENERADO CON EXITO'
		
	def gen_pdf_orden(self, codemp, numtra, codusl):
		APP_PATH = os.getcwd()
		print (APP_PATH)
		
		codemp=codemp
		numtra=numtra
		codusl=codusl
		
		conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
		curs = conn.cursor()
			
		sql = """
		SELECT p.numtra,DATEFORMAT(p.fectra, 'DD-MM-YYYY') as fectra ,c.rucced,c.nombres,c.dircli,c.telcli,c.email,p.observ,p.totnet,p.iva_cantidad,p.codusu,p.ciucli,
		(SELECT nomven FROM vendedorescob v, usuario u where v.codus1 = u.codus1 and v.codusu = u.codusu and u.codus1='{}' and u.codemp='{}'), 
		round((p.totnet+iva_cantidad),2) as total_pedido
		FROM encabezadopedpro p, clientes c
		where p.numtra = '{}' and p.tiptra = 7 and p.codemp='{}'
		and p.codcli=c.codcli
		""".format(codusl,codemp,numtra,codemp)
		curs.execute(sql)
		r = curs.fetchone()
		print (r)


		num_pedido = r[0]
		fectra = r[1]
		identificacion=r[2]
		cliente=r[3]
		direccion=r[4]
		telefono=r[5]
		email=r[6]
		observ=r[7]
		totnet=r[8]
		iva_cantidad=r[9]
		codusu=r[10]
		ciucli=r[11]
		nomven=r[12]
		total_pedido=r[13]


		print (num_pedido,fectra,identificacion,cliente,direccion,telefono,email,observ,totnet,iva_cantidad,codusu,ciucli,nomven,total_pedido)
		
		sql = """
        select marca,modelo,chasis,motor,color,CAST(ano as integer),ram,paisorigen,combustible,klm,cilindarje,pasajeros,
        clase,subclase,torque,caja
        from adicionales where codemp='{}' and codart='{}' and ot='7'
		""".format(codemp,numtra)
		curs.execute(sql)
		r = curs.fetchone()
		print (r)
		if r:
			marca_vehiculo = r[0]
			modelo_vehiculo = r[1]
			anio=r[5]
			placa=r[14]
		else:
			marca_vehiculo = 'No registrado'
			modelo_vehiculo = 'No registrado'
			anio = 'No registrado'
			placa = 'No registrado'

		print (marca_vehiculo,modelo_vehiculo,anio,placa)


		sql = """
		SELECT codart,nomart, coduni,
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
		r = curs.fetchall()
		campos = ['codart','nomart','coduni','cantid','preuni','poriva','cant_iva','totren','desren','num_docs','des_cant']
		renglones_pedido = []
		for reg in r:
		   # print (reg)
		   # reg_encabezado = dict(zip(campos, reg))
		   # renglones_pedido.append(reg_encabezado)
			print (reg)
			observacion = '' if reg[9] == None else reg[9]
			coduni = 'N/A' if reg[2] == None else reg[2]
			# row_db = [reg[0],reg[1],reg[2],convert_decimal(reg[3]),convert_decimal(reg[4]),reg[5],convert_decimal(reg[6]),convert_decimal(reg[7]),convert_decimal(reg[8]),reg[9],convert_decimal(reg[10])]
			# reg = (reg[0],reg[1],reg[2],convert_decimal(reg[3]),convert_decimal(reg[4]),reg[5],convert_decimal(reg[6]),convert_decimal(reg[7]),convert_decimal(reg[8]),reg[9],convert_decimal(reg[10]))
			reg = (reg[0],reg[1],coduni,reg[3],reg[4],reg[5],reg[6],reg[7],reg[8],observacion,reg[10])
			# print (row_db)
			print (reg)
			# row = (row_db[0],row_db[1],row_db[2],row_db[3],row_db[4],row_db[5],row_db[6],row_db[7],row_db[8],row_db[9],row_db[10],row_db[11],row_db[12])
			reg_encabezado = dict(zip(campos, reg))
			renglones_pedido.append(reg_encabezado)
		print (renglones_pedido) 
		conn.close()




		tpl=DocxTemplate(APP_PATH+'\\PLANTILLA_PEDIDOS\\ORDEN_TRABAJO_PLANTILLA_PYTHON.docx')
		context = { 'fectra' : fectra,
					'num_pedido' : num_pedido,
					'cliente' : cliente,
					'identificacion' : identificacion,
					'direccion' : direccion,
					'telefono' : telefono,
					'email' : email,
					'totnet' : totnet,
					'iva_cantidad' : iva_cantidad,
					'observ' : observ,
					'nomven' : nomven,
					'total_pedido' : total_pedido,
					'marca_vehiculo' : marca_vehiculo,
					'modelo_vehiculo' : modelo_vehiculo,
					'anio' : anio,
					'placa' : placa,
					'renglones_pedido': renglones_pedido  #####ARREGLO DE RENGLONES
		}

		tpl.render(context)
        
        # APP_PATH+'\\PLANTILLA_PEDIDOS\\PEDIDO_'+codemp+'_'+num_pedido+'_WEB.pdf'
		word_out = APP_PATH+'\\PLANTILLA_PEDIDOS\\ORDEN_'+codemp+'_'+num_pedido+'_WEB.docx'
		tpl.save(word_out)

		###CONVERTIR A PDF EL PEDIDO PEDIDO_10000221_WEB.pdf
		print ("########### CONVIRTIENDO A PDF ###########")
		comtypes.CoInitialize()
		c = win32com.client.DispatchEx("Word.Application")
		# t, p = win32process.GetWindowThreadProcessId(c.Hwnd)
		# print (p)
		
		f = word_out
		dest = APP_PATH+'\\PLANTILLA_PEDIDOS\\ORDEN_'+codemp+'_'+num_pedido+'_WEB.pdf'
		doc = c.Documents.Open(f)
		doc.SaveAs(dest, FileFormat=17)
		doc.Close()
		c.Quit()
		del c
		os.remove(word_out)

		
		# c.convert(f, dest, "-c PDF") PEDIDO_10000221_WEB.pdf
		# sleep(0.2) # Time in seconds
		comtypes.CoUninitialize()
		return 'PDF GENERADO CON EXITO'
	
	def gen_ticket_pdf(self, codemp, numfac):
		APP_PATH = os.getcwd()
		print (APP_PATH)

		numfac_arr = numfac.split('.')
		numfac = numfac_arr[0]
		
		conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
		curs = conn.cursor()
		
		sql = """
		SELECT --*
		ep.numfac,ep.serie,ep.faccli,
		(select ruc from empresa e where e.codemp=ep.codemp) as ruc_empresa,
		(select nomemp from empresa e where e.codemp=ep.codemp) as nomemp,
		(select rucced from clientes c where c.codcli=ep.codcli) as rucced,
		(select dircli from clientes c where c.codcli=ep.codcli) as dircli,
		ep.nomcli,
		DATEFORMAT(ep.fecfac,'DD-MM-YYYY') as fecha,
		ep.hora,autorizacion,
		ep.poriva,ep.totnet,ep.totbas,(ep.totnet-ep.totbas) as totbas0,ep.totdes,ep.totiva,ep.totfac,ep.tipefe,ep.tiptar,ep.tipcre,ep.tiptrans,ep.tipche
		FROM "DBA"."encabezadopuntosventa" ep
		where numfac='{}' 
		and codemp='{}'
		""".format(numfac,codemp)
		print (sql)
		curs.execute(sql)
		r = curs.fetchone()
		print (r)


		numfac = r[0]
		faccli = r[1]+'-'+r[2]
		ruc_empresa=r[3]
		nomemp=r[4]
		rucced=r[5]
		dircli=r[6]
		nomcli=r[7]
		fecha=r[8]
		hora=r[9][0:8]
		autorizacion=r[10]
		
		if not (autorizacion):
			autorizacion = '*** PENDIENTE AUTO ***' 
		poriva=r[11]
		totnet=r[12]
		totbas=r[13]
		totbase0=r[14]
		totdes=r[15]
		totiva=r[16]
		totfac=r[17]
	############ FORMAS DE PAGO #############
		tipefe=r[18]
		tiptar=r[19]
		tipcre=r[20]
		tiptrans=r[21]
		tipche=r[22]
		
		
		print (tipefe)
		print (tiptar)
		print (tipcre)
		print (tiptrans)
		print (tipche)
		print ("HOLAMUNDO")
		
		formas_pago = []
		
		if (tipefe == 'E'):
			formas_pago.append({'forma':'EFECTIVO'})
		if (tiptar == 'T'):
			formas_pago.append({'forma':'TARJETA'})
		if (tipcre == 'R'):
			formas_pago.append({'forma':'CREDITO'})
		if (tiptrans == 'B'):
			formas_pago.append({'forma':'TRANSFERENCIA'})
		if (tipche == 'C'):
			formas_pago.append({'forma':'CHEQUE'})

		
		# formas_pago=[{'forma':'EFECTIVO'},{'forma':'TARJETA'},{'forma':'CHEQUE'},{'forma':'TRANSFERENCIA'},{'forma':'CREDITO'}]

		
		
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
		""".format(numfac,codemp)
		
		curs.execute(sql)
		print (sql)
		r = curs.fetchall()

		campos = ['index','codart','nomart','coduni','cant','prec01','totren','punreo','codiva','poriva','precio_iva','v_desc_art','subtotal_art']
		renglones_pdv = []
		for reg in r:
			# print (reg)
			reg_encabezado = dict(zip(campos, reg))
			renglones_pdv.append(reg_encabezado)
			# print (renglones_pdv)

		root = os.path.dirname(os.path.abspath(__file__))
		templates_dir = os.path.join(root, 'templates_ticket')
		env = Environment( loader = FileSystemLoader(templates_dir) )
		template = env.get_template('invoice_template.html')
		
		##Filename for our PDF file.
		OUTPUT_FILENAME = "C:\\SISTEMA\\temporales\\ticket_"+codemp+"_"+numfac+".pdf"
		
		# renglones_factura=[
		# {"cant":"1","producto":"CEBOLLA EN RAMA A GRANEL CON FLETE DE QUITO GUAYAQUIL","prec":"200.3","subtotal":"10"},
		# {"cant":"1","producto":"TRANSPORTE DE QUITO CON FLETE DE QUITO GUAYAQUIL Y A SUPERMAXI Y CORPORACION EL ROSADO","prec":"15000.33","subtotal":"10"},
		# {"cant":"1","producto":"AAAAAAAAA rAAAAAAAAAA BBBBBBBBBBBBA AAAAAAASSSS SSSSSSKKKKNJJV RJJMFMEFE EJEJNJENJENJEN EEEEJNEJEEJENEEE NENEUUUEESS","prec":"15000.33","subtotal":"10"}
		# ]
		
		
		renglones_factura=renglones_pdv
		
		# ruc='0602290694001'
		# rz='ROMERO URREA IVAN MARCELO'
		# nombre_cliente = 'CARLOS LEDEZMA'
		# direccion = 'ATAHUALPA'
		
		# 1 renglon = 90 mm  MUY MINIMO 87mm
		alto_minimo= 500
		longitud_renglones = 10

		for renglon in renglones_factura:
			cant_renglon = 1
			if(len(renglon['nomart']) > 9):
				cant_renglon = round(len(renglon['nomart'])/18)
			print (cant_renglon)
			longitud_renglones = longitud_renglones+cant_renglon

		# formula =alto minimo + (suma de la cantidad de lineas por renglon*4 minimetros cada renglon ) + 10 mm de holgura de seguridad
		alto_minimo = alto_minimo + (longitud_renglones*4) + 10
		
		filename = os.path.join(root, 'templates_ticket', 'invoice_salida.html')
		with open(filename, 'w') as fh:
			fh.write(template.render(
				alto_frame = alto_minimo,
				alto_pagina = alto_minimo,
				renglones_factura = renglones_factura,
				ruc = ruc_empresa,
				rz = nomemp,
				nombre_cliente = nomcli,
				direccion = dircli,
				faccli = faccli,
				rucced = rucced,
				fecha = fecha,
				hora = hora,
				autorizacion = autorizacion,
				totfac = totfac,
				totdes = totdes,
				totiva = totiva,
				totnet = totnet,
				totbas = totbas,
				totbase0 = totbase0,
				poriva = poriva,
				formas_pago = formas_pago
		))
			
		from_template(filename, OUTPUT_FILENAME)
		return 'PDF GENERADO CON EXITO'

	def gen_ticket_html(self, codemp, numfac):
		APP_PATH = os.getcwd()
		print (APP_PATH)

		numfac_arr = numfac.split('.')
		numfac = numfac_arr[0]
		
		conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
		curs = conn.cursor()
		
		sql = """
		SELECT --*
		ep.numfac,ep.serie,ep.faccli,
		(select ruc from empresa e where e.codemp=ep.codemp) as ruc_empresa,
		(select nomemp from empresa e where e.codemp=ep.codemp) as nomemp,
		(select rucced from clientes c where c.codcli=ep.codcli) as rucced,
		(select dircli from clientes c where c.codcli=ep.codcli) as dircli,
		ep.nomcli,
		DATEFORMAT(ep.fecfac,'DD-MM-YYYY') as fecha,
		ep.hora,autorizacion,
		ep.poriva,ep.totnet,ep.totbas,(ep.totnet-ep.totbas) as totbas0,ep.totdes,ep.totiva,ep.totfac,ep.tipefe,ep.tiptar,ep.tipcre,ep.tiptrans,ep.tipche
		FROM "DBA"."encabezadopuntosventa" ep
		where numfac='{}' 
		and codemp='{}'
		""".format(numfac,codemp)
		print (sql)
		curs.execute(sql)
		r = curs.fetchone()
		print (r)


		numfac = r[0]
		faccli = r[1]+'-'+r[2]
		ruc_empresa=r[3]
		nomemp=r[4]
		rucced=r[5]
		dircli=r[6]
		nomcli=r[7]
		fecha=r[8]
		hora=r[9][0:8]
		autorizacion=r[10]
		
		if not (autorizacion):
			autorizacion = '*** PENDIENTE AUTO ***' 
		poriva=r[11]
		totnet=r[12]
		totbas=round(r[13],2)
		totbase0=round(r[14],2)
		totdes=r[15]
		totiva=r[16]
		totfac=r[17]
	############ FORMAS DE PAGO #############
		tipefe=r[18]
		tiptar=r[19]
		tipcre=r[20]
		tiptrans=r[21]
		tipche=r[22]
		
		
		print (tipefe)
		print (tiptar)
		print (tipcre)
		print (tiptrans)
		print (tipche)
		print ("HOLAMUNDO")
		
		formas_pago = []
		
		if (tipefe == 'E'):
			formas_pago.append({'forma':'EFECTIVO'})
		if (tiptar == 'T'):
			formas_pago.append({'forma':'TARJETA'})
		if (tipcre == 'R'):
			formas_pago.append({'forma':'CREDITO'})
		if (tiptrans == 'B'):
			formas_pago.append({'forma':'TRANSFERENCIA'})
		if (tipche == 'C'):
			formas_pago.append({'forma':'CHEQUE'})

		
		# formas_pago=[{'forma':'EFECTIVO'},{'forma':'TARJETA'},{'forma':'CHEQUE'},{'forma':'TRANSFERENCIA'},{'forma':'CREDITO'}]

		
		
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
		""".format(numfac,codemp)
		
		curs.execute(sql)
		print (sql)
		r = curs.fetchall()

		campos = ['index','codart','nomart','coduni','cant','prec01','totren','punreo','codiva','poriva','precio_iva','v_desc_art','subtotal_art']
		renglones_pdv = []
		for reg in r:
			print (reg)
			reg_encabezado = dict(zip(campos, reg))
			renglones_pdv.append(reg_encabezado)
			print (renglones_pdv)

		root = os.path.dirname(os.path.abspath(__file__))
		templates_dir = os.path.join(root, 'templates_ticket')
		print (templates_dir)
		# templates_dir = APP_PATH+'\\templates_ticket\\invoice_template.html'
		templates_dir = APP_PATH+'\\templates_ticket'
		print (templates_dir)
		env = Environment( loader = FileSystemLoader(templates_dir) )
		template = env.get_template('invoice_template.html')
		# template = (APP_PATH+'\\templates_ticket\\invoice_template.html')
		
		OUTPUT_HTML = "C:\\SISTEMA\\temporales\\ticket_"+codemp+"_"+numfac+".html"
		OUTPUT_PDF = "C:\\SISTEMA\\temporales\\ticket_"+codemp+"_"+numfac+".pdf"
		# Evaluar esta impresora
		# SAT38TUSE
		
		# renglones_factura=[
		# {"cant":"1","producto":"CEBOLLA EN RAMA A GRANEL CON FLETE DE QUITO GUAYAQUIL","prec":"200.3","subtotal":"10"},
		# {"cant":"1","producto":"TRANSPORTE DE QUITO CON FLETE DE QUITO GUAYAQUIL Y A SUPERMAXI Y CORPORACION EL ROSADO","prec":"15000.33","subtotal":"10"},
		# {"cant":"1","producto":"AAAAAAAAA rAAAAAAAAAA BBBBBBBBBBBBA AAAAAAASSSS SSSSSSKKKKNJJV RJJMFMEFE EJEJNJENJENJEN EEEEJNEJEEJENEEE NENEUUUEESS","prec":"15000.33","subtotal":"10"}
		# ]
		
		
		renglones_factura=renglones_pdv
		
		# ruc='0602290694001'
		# rz='ROMERO URREA IVAN MARCELO'
		# nombre_cliente = 'CARLOS LEDEZMA'
		# direccion = 'ATAHUALPA'
		
		# 1 renglon = 90 mm  MUY MINIMO 87mm
		alto_minimo=90
		longitud_renglones = 0

		# for renglon in renglones_factura:
			# cant_renglon = 1
			# if(len(renglon['nomart']) > 9):
				# cant_renglon = round(len(renglon['nomart'])/18)
                
			# print (cant_renglon)
			# longitud_renglones = longitud_renglones+cant_renglon

		# formula =alto minimo + (suma de la cantidad de lineas por renglon*4 minimetros cada renglon ) + 10 mm de holgura de seguridad
		# alto_minimo = alto_minimo + (longitud_renglones*5) + 10
		alto_minimo = alto_minimo + len(renglones_factura)*7 + 10
		
		filename = os.path.join(root, 'templates_ticket',OUTPUT_HTML)
		with open(filename, 'w') as fh:
			fh.write(template.render(
				alto_frame = alto_minimo,
				alto_pagina = alto_minimo,
				renglones_factura = renglones_factura,
				ruc = ruc_empresa,
				rz = nomemp,
				nombre_cliente = nomcli,
				direccion = dircli,
				faccli = faccli,
				rucced = rucced,
				fecha = fecha,
				hora = hora,
				autorizacion = autorizacion,
				totfac = totfac,
				totdes = totdes,
				totiva = totiva,
				totnet = totnet,
				totbas = totbas,
				totbase0 = totbase0,
				poriva = poriva,
				formas_pago = formas_pago
		))
			
		from_template(filename, OUTPUT_PDF)
		return 'HTML GENERADO CON EXITO'



# ModuleNotFoundError: No module named 'reportlab.graphics.barcode.code128'