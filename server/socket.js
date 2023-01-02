import {Server} from "socket.io"

export default (server)=>{
    const io=new Server(server,{cors:{origin:"*"}});

    io.on("connection",(socket)=>{
        const id=socket.handshake.query.id;
        console.log(`${id} is connected`);
            
        socket.join(id);

       socket.on("add_comment",(data)=>{
        console.log("aq shadis")
        console.log(data,"datikooooo");
        io.except(data.sender).emit("receive_message",data.data);
       })

       socket.on("delete_comment",({id,sender})=>{
        console.log("aqa shedis")
        io.except(sender).emit("receive_delete",{id});
       })

       socket.on("edit_comment",({id,text,sender})=>{
        io.except(sender).emit("receive_edit",{id,text});
       })

       socket.on("react_comment",({sender,data})=>{
        io.except(sender).emit("receive_react",data);
       })

       socket.on("unreact_comment",({userId,id,oldEmoji})=>{
        io.except(userId).emit("receive_unreact",{id,oldEmoji,userId});
       })
        
    })  

    return io;
}