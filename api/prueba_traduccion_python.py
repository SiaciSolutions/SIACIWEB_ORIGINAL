import openai
from openai import OpenAI

# Crear cliente OpenAI
client = OpenAI(api_key="sk-tu_clave_aquí")  # <-- pon tu API key aquí

def traducir_a_chino(texto):
    response = client.chat.completions.create(
        model="gpt-4",  # o "gpt-3.5-turbo"
        messages=[
            {"role": "system", "content": "Eres un traductor profesional. Traduce solo al chino simplificado."},
            {"role": "user", "content": f"Traduce al chino: {texto}"}
        ],
        temperature=0.3,
    )
    return response.choices[0].message.content.strip()

# Uso
texto_espanol = "Dirección completa del destinatario"
traduccion = traducir_a_chino(texto_espanol)
print("Traducción:", traduccion)