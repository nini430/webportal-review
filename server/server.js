import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import SequelizeStore from "connect-session-sequelize";
import http from "http";

import authRouter from "./routes/auth.js";
import reviewRouter from "./routes/review.js";
import userRouter from "./routes/user.js";
import commentRouter from "./routes/comment.js";
import passportAuthRouter from "./routes/passportAuth.js";
import adminRouter from "./routes/admin.js";

import sequelize from "./config/Database.js";
import "./passportSetup.js";
import socket from "./socket.js";

const app = express();
const server = http.createServer(app);

const onListening = () => {
  console.log("Server running at 8000");
};

const port = process.env.PORT;

server.listen(port || 8000);
server.on("listening", onListening);

const io = socket(server);

const sequelizeStore = SequelizeStore(session.Store);

const store = new sequelizeStore({ db: sequelize });

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    store,
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/comments", commentRouter);
app.use(passportAuthRouter);
app.use("/api/v1/admin", adminRouter);
