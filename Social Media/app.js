const express = require("express");
const router = require("./src/routes/router")
const app = express();
const port = 3000;

const databaseSosmed = require("./src/databases/connectionSosmed")

app.use(express.urlencoded({ extended: true }));

app.use("/api", router)

const initApp = async () => {
    console.log("Testing database connection")
    try {
        await databaseSosmed.authenticate();
        console.log("Berhasil konek");
    } catch (error) {
       console.error("Tidak bisa konek database : ", error.original) 
    }
}

initApp()

/**
 * Start the web server on the specified port.
 */
app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`)
);