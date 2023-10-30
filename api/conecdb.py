import os
import sqlanydb
import coneccion

#conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng, host=coneccion.host, preFetchRows='15000')
#.connect(uid="dba", pwd="197304", eng="SIACI_DB",host="localhost")
#curs = conn.cursor()
#curs.execute("SELECT codemp,nomemp FROM empresa WHERE codemp = '03'")
#datos = curs.fetchall()

#for fila in datos:
#	print(fila)

#os.environ['PATH'] += ";C:\sistema\dlls"
# dirname, filename = os.path.split(os.path.abspath(__file__))
print(coneccion.uid)
print(coneccion.pwd)
print(coneccion.eng)
print(coneccion.host)
try:
    conn = sqlanydb.connect(uid=coneccion.uid, pwd=coneccion.pwd, eng=coneccion.eng,host=coneccion.host)
except Exception as e:
    print (e)
    print("Revise la ip o los datos de coneccion registrados en spagfic")