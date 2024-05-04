from neo4j import GraphDatabase
import csv

neo4j_url = "bolt://localhost:7687"
neo4j_username = "neo4j"
neo4j_password = "wr99582435"
arq = 'Arquivo CSV/Arquivo_transicao/show_extract.csv'

def criar_indices_e_inserir_neo4j(neo4j_url, neo4j_username, neo4j_password, csv_file):

    conexao = GraphDatabase.driver(neo4j_url, auth=(neo4j_username, neo4j_password))

    # Criando índices
    with conexao.session() as session:
        session.run("CREATE INDEX IF NOT EXISTS FOR (a:Actor) ON (a.actor_name)")
        session.run("CREATE INDEX IF NOT EXISTS FOR (c:Country) ON (c.name_country)")
        session.run("CREATE INDEX IF NOT EXISTS FOR (d:Director) ON (d.director_name)")

    # Inserindo nós e relacionamentos
    with conexao.session() as session:
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                # Criar nó ShowCatalog
                query_show = (
                    "CREATE (:ShowCatalog {id: toInteger($show_id), type_show: $type_show, title: $title, director: $director, cast: $cast, "
                    "country: $country, date_added: $date_added, release_year: toInteger($release_year), rating: $rating, duration: $duration, "
                    "listed_in: $listed_in, description_show: $description_show})"
                )
                session.run(query_show, row)

                # Criar relacionamento entre ShowCatalog e Actor
                query_actor = (
                    "MATCH (sc:ShowCatalog {id: toInteger($show_id)}) "
                    "UNWIND split($cast, ',') AS actor_name "
                    "MERGE (a:Actor {actor_name: trim(actor_name)}) "
                    "CREATE (sc)-[:HAS_CAST]->(a)"
                )
                session.run(query_actor, row)

                # Criar relacionamento entre ShowCatalog e Country
                query_country = (
                    "MATCH (sc:ShowCatalog {id: toInteger($show_id)}) "
                    "MERGE (c:Country {name_country: $country}) "
                    "CREATE (sc)-[:LOCATED_IN]->(c)"
                )
                session.run(query_country, row)

                # Criar relacionamento entre ShowCatalog e Director
                query_director = (
                    "MATCH (sc:ShowCatalog {id: toInteger($show_id)}) "
                    "MERGE (d:Director {director_name: $director}) "
                    "CREATE (sc)-[:DIRECTED_BY]->(d)"
                )
                session.run(query_director, row)

    # Fechar conexão
    conexao.close()

# Executar função para criar índices e inserir dados
criar_indices_e_inserir_neo4j(neo4j_url, neo4j_username, neo4j_password, arq)
