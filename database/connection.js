const mongoose = require("mongoose")

module.exports = async () => {
    try {
        const db_url = process.env.DB_URL

        await mongoose.connect(db_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        console.log(`DB is successfully connected....`)
    } catch (error) {
        console.error("Error on DB Connection:")
        console.error(error)
    }
}
