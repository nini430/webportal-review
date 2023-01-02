import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser"
import passport from "passport";
import session from "express-session";
import SequelizeStore from "connect-session-sequelize";
import http from "http"



import authRouter from "./routes/auth.js"
import reviewRouter from "./routes/review.js"
import userRouter from "./routes/user.js"
import commentRouter from "./routes/comment.js"
import passportAuthRouter from "./routes/passportAuth.js"

import sequelize from "./config/Database.js";
import "./passportSetup.js"
import { keys } from "./env.js";
import socket from "./socket.js";


const app=express();
const server=http.createServer(app);


const onListening=()=>{
    console.log("Server running at 8000")
}

server.listen(8000);
server.on("listening",onListening);

  
const io=socket(server);
  
const sequelizeStore=SequelizeStore(session.Store);
  
const store=new sequelizeStore({db:sequelize})


app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));  

app.use(express.json())
app.use(cookieParser())
app.use(session({store,name:keys.SESSION_NAME,secret:keys.SESSION_SECRET,resave:false,saveUninitialized:false}))


app.use(passport.initialize())
app.use(passport.session())

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/reviews",reviewRouter)
app.use("/api/v1/user",userRouter)
app.use("/api/v1/comments",commentRouter);
app.use(passportAuthRouter);



