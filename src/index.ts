import  express from "express"
const config = require("config")

const PORT: number = config.get("port") || 5000

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//app.get("/", (req: Request, res: Response) => res.send("Hello"))


const start = async (): Promise<void> => {
    try {
        app.listen(PORT, () =>
            console.log(`Server has been started on port ${PORT}...`)
        )
    } catch (e) {
        console.log("Server error: ", e)
        process.exit(1)
    }
}

start()
