#Coluna "release_year" estava como DATE na V_1.0 do modelo fisico, foi substituido para INT.


import pandas as pd

arq = 'Arquivo CSV/Arquivo RAW/netflix.csv'

df = pd.read_csv(arq)

df['release_year'] = df['release_year'].astype(int)


