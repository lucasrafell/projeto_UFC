const express     = require('express');
const app         = express();

require("dotenv").config()
const db          = require('./config/db/dbConnection');
const router      = require('./routes/router');

const PORT        = process.env.PORT;

// configuração para transporte dos dados em json.

app.use(express.urlencoded({extended:true}))
app.use(express.json())

// rota iniciada para teste

app.get('/', (req, res) => {
  res.send('Resposta enviada')
})

// conexão com banco

db()


app.use('/api', router)

app.listen(PORT, () => {
  console.log(`Server running in port: ${PORT}`);
})