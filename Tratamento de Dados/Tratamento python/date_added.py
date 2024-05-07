#a coluna "date_added" estava no formato "August 4, 2017" quando deveria estar nesse %B, %d, %Y para ser um do tipo DATE.

import pandas as pd

arq = 'Arquivo CSV/Arquivo RAW/netflix.csv'

df = pd.read_csv(arq)

meses_numeros = {
    'January': 1, 'February': 2, 'March': 3, 'April': 4,
    'May': 5, 'June': 6, 'July': 7, 'August': 8,
    'September': 9, 'October': 10, 'November': 11, 'December': 12
}

def converter(date_str):
    if pd.isnull(date_str):
        return None
    
    partes = date_str.split()
    
    mes_nome = partes[0]
    dia = int(partes[1][:-1])
    ano = partes[2]
    
    mes_numero = meses_numeros[mes_nome]
    
    data_formatada = f"{mes_numero:02d}/{dia:02d}/{ano}"
    
    return data_formatada

df['date_added'] = df['date_added'].apply(converter)  
df['date_added'] = pd.to_datetime(df['date_added'])  

