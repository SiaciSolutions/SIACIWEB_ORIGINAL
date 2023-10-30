from datetime import date
from dbfpy3 import dbf
import os



APP_PATH = os.getcwd()
# create DBF
APP_PATH_DBF = APP_PATH+'\\DBF\\'
LOTE = '201211'
CODART = '7861006200145'
CA
UNIDxPRESENTACION = 30
COD_BARRA = '01478610062001451721031010201210'
PRESENT = UNIDxPRESENTACION+' UNIDADES'
DESC_ART = 'CHICHARRON PIC NIC KIKOS 150 G'+' PAQUETE DE '+PRESENT
PREC_ART = 5

FILE_DBF_PATH = APP_PATH_DBF+'ETIQ_LOTE_'+LOTE+'_'+CODART+'.dbf'
NUM_ETIQUETAS = range (10)


if not os.path.isfile(FILE_DBF_PATH):
   db = dbf.Dbf(FILE_DBF_PATH, new=True)
   db.header.code_page = 0x78
   db.add_field(
    ('C', 'CODIGO', 50),
    ('C', 'BARRAS', 50),
    ('C', 'DESCRIPCIO', 200),
    ('C', 'PRECIO', 10),
   )

   # for (CODIGO, BARRAS, DESCRIPCIO,PRECIO) in (
        # ('059121012A', '7862109177570', 'BOMBA AGUA  AUXILIAR AMAROK','20'),
		# ('059121012A', '7862109177570', 'BOMBA AGUA  AUXILIAR AMAROK','20'),
		# ('059121012A', '7862109177570', 'BOMBA AGUA  AUXILIAR AMAROK','20'),
		# ('059121012A', '7862109177570', 'BOMBA AGUA  AUXILIAR AMAROK','20'),
		# ('059121012A', '7862109177570', 'BOMBA AGUA  AUXILIAR AMAROK','20'),
   # ):
   
   # r = (
        # ('059121012A', '7862109177570', 'BOMBA AGUA  AUXILIAR AMAROK','20'),
		# ('059121012A', '7862109177570', 'BOMBA AGUA  AUXILIAR AMAROK','20'),
		# ('059121012A', '7862109177570', 'BOMBA AGUA  AUXILIAR AMAROK','20'),
		# ('059121012A', '7862109177570', 'BOMBA AGUA  AUXILIAR AMAROK','20'),
		# ('059121012A', '7862109177570', 'BOMBA AGUA  AUXILIAR AMAROK','20'),
      # )
   
   # for (CODIGO, BARRAS, DESCRIPCIO,PRECIO) in  r :
      # # print (CODIGO)
      # rec = db.new()
      # rec['CODIGO'] = CODIGO
      # rec['BARRAS'] = BARRAS
      # rec['DESCRIPCIO'] = DESCRIPCIO
      # rec['PRECIO'] = PRECIO
      # db.write(rec)
      # print(db, '\n\n')
   for n in NUM_ETIQUETAS:
      rec = db.new()
      rec['CODIGO'] = CODART
      rec['BARRAS'] = COD_BARRA
      rec['DESCRIPCIO'] = DESC_ART
      rec['PRECIO'] = PREC_ART
      db.write(rec)
      print(db, '\n\n')
	  
   db.close()


################################## DEMO ORIGINAL  ########################################
# create DBF
# db = dbf.Dbf('new.dbf', new=True)
# db.header.code_page = 0x78
# db.add_field(
    # ('C', 'NAME', 15),
    # ('C', 'SURNAME', 25),
    # ('D', 'BIRTHDATE'),
# )

# for (name, surname, birthdate) in (
        # ('John', 'Miller', (1981, 1, 2)),
        # ('Andy', 'Larkin', (1982, 3, 4)),
        # ('Bill', 'Clinth', (1983, 5, 6)),
        # ('Bobb', 'McNail', (1984, 7, 8)),
# ):
    # rec = db.new()
    # rec['NAME'] = name
    # rec['SURNAME'] = surname
    # rec['BIRTHDATE'] = birthdate
    # db.write(rec)

# print(db, '\n\n')
# db.close()

# read and update DBF

# print("Windows console can't print unicode characters, "
      # 'so this may raise error')

# # Use `with` statement
# with dbf.Dbf('table.dbf') as db:
    # print(db, '\n')
    # for record in db:
        # print(record, '\n')
        # record[b'INT'] = 100
        # record[b'DATE'] = date.today()
        # db.write(record)