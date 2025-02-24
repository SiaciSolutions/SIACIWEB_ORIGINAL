import sqlanydb   

conn = sqlanydb.connect(uid='DBA', pwd='197304', eng='SIACI_DB_17',host='127.0.0.1:2638')
curs = conn.cursor()

codemp='01'
sql = "select * from articulos where codemp='{}' ".format(codemp)
curs.execute(sql)

# r = curs.fetchone()  ##Si el Query retorna 1 solo registro

regs = curs.fetchall() ##Si el Query retorna varios registros
for r in regs:
   print (r)