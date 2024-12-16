const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

// requiring files
const api = require("./routes")
const databaseConnection = require("./database/connection")

const app = express()
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.get("/test", (req, res) => {
    res.send("API is working successfully")
})

//connection with mongo db
databaseConnection()

// middleware

//route call
api(app)

app.listen({ port: process.env.PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:` + process.env.PORT)
)
    .on("error", (err) => {
        console.log(err)
        process.exit()
    })
    .on("close", () => {
        channel.close()
    })