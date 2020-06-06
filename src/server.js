const express = require("express")
const server = express() 

// Pegar o banco de dados
const db = require("./database/db")

// configurar pasta "public"
server.use(express.static("public"))

// Habilitar o uso do re.body na nossa aplicação
server.use(express.urlencoded({ extended: true }))

const nunjucks = require ("nunjucks") 
nunjucks.configure("src/view", {
  express: server,
  noCache: true
})

server.get("/", (req, res) => {
  return res.render("index.html", { title: "Um título" })
})

server.get("/create-point", (req, res) => {
  
  return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
  
  const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `

    const values = [
      req.body.image,
      req.body.name,
      req.body.address,
      req.body.address2,
      req.body.state,
      req.body.city,
      req.body.items
    ]

    function afterInsertData(err) {
        if(err) {
            return console.log(err)
            return res.send("Erro no cadastro")
        }

        console.log("Cadastrado com sucesso")
        console.log(this)
    }

    db.run(query, values, afterInsertData)

  return res.render("create-point.html", { saved: true })
})

server.get("/search-results", (req, res) => {

  const search = req.query.search

  if(search == "") {
    // Pesquisa vazia
    return res.render("search-results.html", { total: 0 })
  }
  
  // Pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if(err) {
            return console.log(err)
        }

        const total = rows.length

        // Mostrar a página HTML com os dados do banco de dados 
        return res.render("search-results.html", { places: rows, total: total })
    })
})

server.listen(3000)