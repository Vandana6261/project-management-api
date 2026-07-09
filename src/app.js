import express from "express";
import cors from "cors"
import authRoute from "./routes/authRoute.js"


const app = express();
app.allowOrigin = [
    "http://localhost:5173"
]

app.use(express.json());


app.use((req, res, next) => {
    console.log(req.url, "req url");
    console.log(req.method, "req method");
    console.log("Anything")
    next();
})

app.use("/api/user", authRoute);

export default app;