#a coluna duration tinha numeros e letras dentro dela e era dividida em minutos e seasons.
#tiramos todos os caracteres que nao fossem numericos de dentro dela e transformamos ela para INT

import pandas as pd

arq = 'Arquivo CSV/Arquivo RAW/netflix.csv'

df = pd.read_csv(arq)

df['duration'] = df['duration'].replace(r'\D', '', regex=True)

df['duration'] = df['duration'].replace('', pd.NA)

df['duration'] = df['duration'].fillna(0)

df['duration'] = df['duration'].astype(int)