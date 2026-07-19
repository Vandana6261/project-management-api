import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js"
import optionRoute from "./routes/optionRoute.js"
import projectRoute from "./routes/projectRoute.js"
import { errorMiddleware } from "./middlewares/errorMiddleware.js";


const app = express();
app.allowOrigin = [
    "http://localhost:5173"
]

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
}));
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(req.url, "req url");
    console.log(req.method, "req method");
    next();
})

app.use("/api/auth", authRoute);
app.use("/api/project", optionRoute);
app.use("/api/project", projectRoute);


app.use(errorMiddleware)

export default app;