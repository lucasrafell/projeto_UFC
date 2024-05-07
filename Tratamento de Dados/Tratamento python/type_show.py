#Mudanca de nome na coluna TYPE para TYPE_SHOW, porque "type" e uma palavra reservada do mysql, alem de mudar seu tipo para STRING.

import pandas as pd

arq = 'Arquivo CSV/Arquivo RAW/netflix.csv'

df = pd.read_csv(arq)


df.rename(columns={'type': 'type_show'}, inplace=True)		# mudar nome da coluna
df['type_show'] = df['type_show'].astype(str)			# mudar tipo da coluna para STRING
