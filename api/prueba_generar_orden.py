import gen_pdf_pedidos as pdf

generar_pdf = pdf.GEN_PDF()
resp_pdf = generar_pdf.gen_pdf_orden('01','17000025','SUPERVISOR')
print (resp_pdf)