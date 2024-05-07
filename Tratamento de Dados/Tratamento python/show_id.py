#A coluna "show_id" tinha um "s" antes de todo o numero do ID. Então o primeiro passo foi retirar esse "s" e deixar apenas o número para mudarmos o tipo da coluna para INT.
		
import pandas as pd

arq = 'Arquivo CSV/Arquivo RAW/netflix.csv'

df = pd.read_csv(arq)


df['show_id'] = df['show_id'].str.replace('s', '') 	# tirar o S
df['show_id'] = df['show_id'].astype(int) 		# mudar o tipo da coluna para INT
