import express from "express";
import cors from "cors"
import authRoute from "./routes/authRoute.js"
import { errorMiddleware } from "./middlewares/errorMiddleware.js";


const app = express();
app.allowOrigin = [
    "http://localhost:5173"
]

app.use(express.json());


app.use((req, res, next) => {
    console.log(req.url, "req url");
    console.log(req.method, "req method");
    next();
})

app.use("/api/auth", authRoute);

app.use(errorMiddleware)

export default app;