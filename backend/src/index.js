import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from './app.js'
import { Server } from "socket.io";
import { createServer } from "http";


dotenv.config({
    path: './.env'
})

const server = createServer(app);


const io = new Server(server, {
    pingTimeout: 60000,
  cors: {
    origin: "*",
    // credentials: true,
  },
  });

  io.on("connection", (socket) => {
    console.log("connected to socket");

    socket.on("join room", (username) => {
        socket.join(username)
        console.log("joined room",username)
    })

    socket.on("new message", (msgData) => {
        console.log(msgData.users)
        msgData.users.forEach((username) => {
            io.in(username).emit("mesrec", msgData._doc)
        });
    })

    socket.on("sent request", (data) => {
        socket.in(data.otheruser).emit("new req", data)
        io.in(data.user).emit("new req", data)
    })

    socket.on("sent friend", (data) => {
        socket.in(data.otheruser).emit("new friend", data)
        io.in(data.user).emit("new friend", data)
    })

    socket.on("leave room", (username) => {
        socket.leave(username)
        console.log("User logged out");
    })
  })




connectDB().then(() => {
    server.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
