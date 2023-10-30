from docxtpl import DocxTemplate
import sys
import os
import comtypes.client
import win32com.client
import win32process
import shutil
import coneccion
import sqlanydb


def convert_decimal(d):
	print ("ESTOY EN CONVERT")
	total_pedido = str(format(d,",.2f")).replace(',',' ')
	total_pedido = str(total_pedido).replace('.',',')
	total_pedido = str(total_pedido).replace(' ','.')
	total_pedido = str(total_pedido).replace(',00','')
	return total_pedido


class GEN_PDF():


	
	def gen_pdf(self, codemp, numtra, codusl):
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
		where p.numtra = '{}' and p.tiptra = 1 and p.codemp='{}'
		and p.codcli=c.codcli
		""".format(codusl,codemp,numtra,codemp)
		curs.execute(sql)
		r = curs.fetchone()
		# curs.fetchall()
		# codven = r[0]
		print (r)


		num_pedido = r[0]
		fectra = r[1]
		identificacion=r[2]
		cliente=r[3]
		direccion=r[4]
		telefono=r[5]
		email=r[6]
		observ=r[7]
		totnet=convert_decimal(r[8])
		iva_cantidad=convert_decimal(r[9])
		codusu=r[10]
		ciucli=r[11]
		nomven=r[12]
		total_pedido=convert_decimal(r[13])


		print (num_pedido,fectra,identificacion,cliente,direccion,telefono,email,observ,totnet,iva_cantidad,codusu,ciucli,nomven,total_pedido)
		# print (total_neto)

		sql = """
		SELECT codart,nomart, coduni,
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
		campos = ['codart','nomart','coduni','cantid','preuni','poriva','cant_iva','totren','desren','num_docs','des_cant']
		renglones_pedido = []
		for reg in r:
		   # print (reg)
		   # reg_encabezado = dict(zip(campos, reg))
		   # renglones_pedido.append(reg_encabezado)
			print (reg)
			row_db = [reg[0],reg[1],reg[2],convert_decimal(reg[3]),convert_decimal(reg[4]),reg[5],convert_decimal(reg[6]),convert_decimal(reg[7]),convert_decimal(reg[8]),reg[9],convert_decimal(reg[10])]
			reg = (reg[0],reg[1],reg[2],convert_decimal(reg[3]),convert_decimal(reg[4]),reg[5],convert_decimal(reg[6]),convert_decimal(reg[7]),convert_decimal(reg[8]),reg[9],convert_decimal(reg[10]))
			print (row_db)
			print (reg)
			# row = (row_db[0],row_db[1],row_db[2],row_db[3],row_db[4],row_db[5],row_db[6],row_db[7],row_db[8],row_db[9],row_db[10],row_db[11],row_db[12])
			reg_encabezado = dict(zip(campos, reg))
			renglones_pedido.append(reg_encabezado)
		print (renglones_pedido) 
		conn.close()




		tpl=DocxTemplate(APP_PATH+'\\PLANTILLA_PEDIDOS\\PEDIDO_PLANTILLA_PYTHON3.docx')
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
					'renglones_pedido': renglones_pedido  #####ARREGLO DE RENGLONES
		}

		tpl.render(context)
		word_out = APP_PATH+'\\PLANTILLA_PEDIDOS\\PEDIDO_'+num_pedido+'_WEB.docx'
		tpl.save(word_out)

		###CONVERTIR A PDF EL PEDIDO PEDIDO_10000221_WEB.pdf
		print ("########### CONVIRTIENDO A PDF ###########")
		comtypes.CoInitialize()
		c = win32com.client.DispatchEx("Word.Application")
		# t, p = win32process.GetWindowThreadProcessId(c.Hwnd)
		# print (p)
		
		f = word_out
		dest = APP_PATH+'\\PLANTILLA_PEDIDOS\\PEDIDO_'+num_pedido+'_WEB.pdf'
		doc = c.Documents.Open(f)
		doc.SaveAs(dest, FileFormat=17)
		doc.Close()
		c.Quit()
		del c

		
		# c.convert(f, dest, "-c PDF") PEDIDO_10000221_WEB.pdf
		# sleep(0.2) # Time in seconds
		comtypes.CoUninitialize()
		return 'PDF GENERADO CON EXITO'
