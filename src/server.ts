import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"
import { corsConfig } from "./config/cors"
import { connectDB } from "./config/db"
import authRoutes from "./routes/authRoutes"
import projectRoutes from "./routes/ProjectRoutes"


//Acceso a variables de entorno
dotenv.config()

//Conectar a la DB
connectDB()

//Instancia de Express
const app = express()
//CORS config
app.use(cors(corsConfig))

//Logging
app.use(morgan("dev"))

//Habilitar lectura de jsons en el req.body
app.use(express.json())

//Routes
app.use("/api/auth", authRoutes)
app.use("/api/projects", projectRoutes)

export default app

