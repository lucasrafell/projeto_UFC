from neo4j import GraphDatabase

uri = "bolt://localhost:7687"
username = "neo4j"
password = "wr99582435"

class CRUD:
    def __init__(self, uri, username, password):
        self.driver = GraphDatabase.driver(uri, auth=(username, password))
        self.create_indexes()
                                            # metodos com final "_tx" sao os metodos de transacao que interagem com o banco de dados
    def close(self):                        # do neo4j, eles sao chamados em uma funcao para excecultar operacoes no bd
        self.driver.close()                 # ja os que nao tem, sao metodos publicos que sao chamados externamente para iniciar uma transacao

    def create_indexes(self):
        with self.driver.session() as session:
            session.write_transaction(self.create_id_index)

    def create_id_index(self, tx):
        tx.run("CREATE INDEX IF NOT EXISTS FOR (show:ShowCatalog) ON (show.id)")
        tx.run("CREATE INDEX IF NOT EXISTS FOR (director:Director) ON (director.director_name)")
        tx.run("CREATE INDEX IF NOT EXISTS FOR (actor:Actor) ON (actor.actor_name)")

    def create_show(self, show_data):                               
        with self.driver.session() as session:   
            session.write_transaction(self.create_show_tx, show_data)

    def create_show_tx(self, tx, show_data):
        tx.run(                                         
            """                                     
            CREATE (show:ShowCatalog {
                id: $id,
                type_show: $type_show,
                title: $title,
                director: $director,
                cast: $cast,
                country: $country,
                date_added: $date_added,
                release_year: $release_year,
                rating: $rating,
                duration: $duration,
                listed_in: $listed_in,
                description_show: $description_show
            })
            """,
            **show_data
        )

    def create_director(self, director_name):
        with self.driver.session() as session:
            session.write_transaction(self.create_director_tx, director_name)

    def create_director_tx(self, tx, director_name):
        tx.run("CREATE (:Director {director_name: $director_name})", director_name=director_name)



    def create_actor(self, actor_name):
        with self.driver.session() as session:
            session.write_transaction(self.create_actor_tx, actor_name)

    def create_actor_tx(self, tx, actor_name):
        tx.run("CREATE (:Actor {actor_name: $actor_name})", actor_name=actor_name)



    def delete_show(self, show_id):
        with self.driver.session() as session:
            session.write_transaction(self.delete_show_tx, show_id)

    def delete_show_tx(self, tx, show_id):
        tx.run("MATCH (show:ShowCatalog {id: $id}) DETACH DELETE show", id=show_id)



    def update_show(self, show_id, new_data):
        with self.driver.session() as session:
            session.write_transaction(self.update_show_tx, show_id, new_data)

    def update_show_tx(self, tx, show_id, new_data):
        tx.run(
            """
            MATCH (show:ShowCatalog {id: $id})
            SET show += $new_data
            RETURN show
            """,
            id=show_id,
            new_data=new_data
        )

    def read_show(self, show_id):
        with self.driver.session() as session:
            return session.read_transaction(self.read_show_tx, show_id)

    def read_show_tx(self, tx, show_id):
        result = tx.run("MATCH (show:ShowCatalog {id: $id}) RETURN show", id=show_id)
        return result.single()["show"]


###     codigos de teste    #####


crud = CRUD(uri, username, password)


crud.create_director("Kirsten Johnson")


crud.create_actor("Indefinido")


new_show = {
    "id": 1,
    "type_show": "movie",
    "title": "Dick Johnson Is Dead",
    "director": "Kirsten Johnson",
    "cast": "Indefinido",
    "country": "United States",
    "date_added": "2021-09-25",
    "release_year": 2020,
    "rating": "PG-13",
    "duration": "90 minutes",
    "listed_in": "Documentaries",
    "description_show": "As her father nears the end of his life, filmmaker Kirsten Johnson stages his death in inventive and comical ways to help them both face the inevitable."
}
crud.create_show(new_show)


show = crud.read_show(1)
print("Show que foi lido:", show)


update_show = {
    "rating": "R",
    "duration": "100 minutes"
}
crud.update_show(1, update_show)


crud.delete_show(1)


crud.close()
