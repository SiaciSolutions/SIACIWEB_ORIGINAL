import requests
from bs4 import BeautifulSoup

guia = "9023349160"
url = f"https://www.servientrega.com.ec/Tracking/?guia={guia}&tipo=GUIA"

headers = {
    "User-Agent": "Mozilla/5.0"
}

response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, "html.parser")

# Inicializamos todas las variables
estado_actual = destino = fecha_entrega = None
fecha_envio = origen = recibido_por = None

# Buscar todos los bloques col-info-2 (hay dos info-part-tracking independientes)
bloques = soup.find_all("div", class_="col-info-2")

for bloque in bloques:
    label_span = bloque.find("span")
    if not label_span:
        continue

    texto = label_span.get_text(strip=True).lower()
    input_tag = bloque.find("input")
    valor = input_tag["value"].strip() if input_tag and input_tag.has_attr("value") else None

    if "estado actual" in texto:
        estado_actual = valor
    elif "destino" in texto:
        destino = valor
    elif "fecha entrega" in texto:
        fecha_entrega = valor
    elif "fecha envío" in texto or "fecha envio" in texto:
        fecha_envio = valor
    elif "origen" in texto:
        origen = valor
    elif "recibido por" in texto:
        recibido_por = valor

# Mostrar resultados
print("📦 Estado actual: ", estado_actual or "No encontrado")
print("📍 Destino:        ", destino or "No encontrado")
print("📅 Fecha entrega:  ", fecha_entrega or "No encontrada")
print("🕒 Fecha envío:    ", fecha_envio or "No encontrada")
print("🏙️  Origen:         ", origen or "No encontrado")
print("👤 Recibido por:   ", recibido_por or "No encontrado")