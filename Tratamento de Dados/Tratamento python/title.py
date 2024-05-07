#A coluna "title" que tinha OBJECT como tipo, foi substituido para STRING.

import pandas as pd

arq = 'Arquivo CSV/Arquivo RAW/netflix.csv'

df = pd.read_csv(arq)


df['title'] = df['title'].astype(str) 				# mudar o tipo da coluna para string

