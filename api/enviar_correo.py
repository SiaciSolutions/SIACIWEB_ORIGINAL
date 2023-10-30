import smtplib
from email.mime.text import MIMEText
import datetime
from smtplib import SMTP_SSL as SMTP
import mimetypes
import os
import datetime
import email
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import time



class CORREO():

    def enviar(self, servidorsaliente, port, userid, password, emailresponsable, archivo, nombrepdf, asunto, mensaje ):

        body = mensaje #"Estimado(a) Cliente. Adjunto sirvase encontrar su correspondiente COMPROBANTE ELECTRONICO autorizado por el SRI"+ '\n' + " Gracias por su confianza." + '\n' + "Desarrollado por SIACISOLUTIONS - www.siaci.com.ec - 026014727"
        subject = asunto #"FACTURACION ELECTRONICA"
        mime_message = MIMEMultipart() #MIMEText(msg, "plain")
        mime_message["From"] = userid
        mime_message["To"] = emailresponsable
        mime_message["Subject"] = subject
        mime_message.attach(MIMEText(body))
        # print(archivo)
        # time.sleep( 5 )
        print ("### ENVIANDO DOCUMENTO  ###")
        print (nombrepdf)
		
        if (nombrepdf != 'NO_ADJUNTO'):
           try:
               #time.sleep( 10 )
               if not os.path.exists(archivo):
                  print ("no existe:" + archivo)
                  return {'status':'NENV','descripcion':'Archivo adjunto no encontrado'}
               else:
                  print("adjuntado pdf:" + archivo)
            # time.sleep( 5 )
               fp = open(archivo, 'rb')
            # msg = MIMEBase('multipart', 'plain')
               msg = MIMEBase('application', 'octet-stream')
               msg.set_payload(fp.read())
               fp.close()
               encoders.encode_base64(msg)
               msg.add_header('Content-Disposition',
                            'attachment', filename=nombrepdf)
               mime_message.attach(msg)
            # time.sleep( 5 )
           except Exception as e:
               print (str(e))
               print ("error archivo : " + archivo)
               # return 'ENVIO DE CORREO FALLIDO'
               return {'status':'NENV','descripcion':str(e)}
            # salir = input()
			
		
        username = userid
        password = password
        try:
            port = int(port)
            if port == 25:
                s = smtplib.SMTP(servidorsaliente, port)
            elif port == 587:
                s = smtplib.SMTP(servidorsaliente, port)
                s.ehlo()
                s.starttls()
                s.ehlo()
            elif port == 465:
                s = smtplib.SMTP_SSL(servidorsaliente, port)
            else:
                s = smtplib.SMTP(servidorsaliente, port)
            s.login(username, password)
            s.sendmail(username,mime_message["To"].split(";"),  mime_message.as_string())
            s.quit()
            # return 'ENV'
            # return 'CORREO ENVIADO CON EXITO'
            return {'status':'ENV','descripcion':'CORREO ENVIADO CON EXITO'}
            
        except Exception as e:
            print(str(e))
            print ("error al envio: " + archivo)
            # print (archivo_xml)
            # return 'ENVIO DE CORREO FALLIDO'
            return {'status':'NENV','descripcion':str(e)}
            
    def enviar_html(self, servidorsaliente, port, userid, password, emailresponsable, archivo, nombrepdf, asunto, mensaje ):

        body = mensaje #"Estimado(a) Cliente. Adjunto sirvase encontrar su correspondiente COMPROBANTE ELECTRONICO autorizado por el SRI"+ '\n' + " Gracias por su confianza." + '\n' + "Desarrollado por SIACISOLUTIONS - www.siaci.com.ec - 026014727"
        subject = asunto #"FACTURACION ELECTRONICA"
        mime_message = MIMEMultipart() #MIMEText(msg, "plain")
        mime_message["From"] = userid
        mime_message["To"] = emailresponsable
        mime_message["Subject"] = subject
        # mime_message.attach(MIMEText(body))
        mime_message.attach(MIMEText(body, "html"))
        # print(archivo)
        # time.sleep( 5 )
        print ("### ENVIANDO DOCUMENTO  ###")
        print (nombrepdf)
		
        if (nombrepdf != 'NO_ADJUNTO'):
           try:
               #time.sleep( 10 )
               if not os.path.exists(archivo):
                  print ("no existe:" + archivo)
                  return {'status':'NENV','descripcion':'Archivo adjunto no encontrado'}
               else:
                  print("adjuntado pdf:" + archivo)
            # time.sleep( 5 )
               fp = open(archivo, 'rb')
            # msg = MIMEBase('multipart', 'plain')
               msg = MIMEBase('application', 'octet-stream')
               msg.set_payload(fp.read())
               fp.close()
               encoders.encode_base64(msg)
               msg.add_header('Content-Disposition',
                            'attachment', filename=nombrepdf)
               mime_message.attach(msg)
            # time.sleep( 5 )
           except Exception as e:
               print (str(e))
               print ("error archivo : " + archivo)
               # return 'ENVIO DE CORREO FALLIDO'
               return {'status':'NENV','descripcion':str(e)}
            # salir = input()
			
		
        username = userid
        password = password
        try:
            port = int(port)
            if port == 25:
                s = smtplib.SMTP(servidorsaliente, port)
            elif port == 587:
                s = smtplib.SMTP(servidorsaliente, port)
                s.ehlo()
                s.starttls()
                s.ehlo()
            elif port == 465:
                s = smtplib.SMTP_SSL(servidorsaliente, port)
            else:
                s = smtplib.SMTP(servidorsaliente, port)
            s.login(username, password)
            s.sendmail(username,mime_message["To"].split(";"),  mime_message.as_string())
            s.quit()
            # return 'ENV'
            # return 'CORREO ENVIADO CON EXITO'
            return {'status':'ENV','descripcion':'CORREO ENVIADO CON EXITO'}
            
        except Exception as e:
            print(str(e))
            print ("error al envio: " + archivo)
            # print (archivo_xml)
            # return 'ENVIO DE CORREO FALLIDO'
            return {'status':'NENV','descripcion':str(e)}
