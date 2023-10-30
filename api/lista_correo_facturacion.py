import coneccion
import sqlanydb

# APP_PATH = os.getcwd()
# print (APP_PATH)



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



