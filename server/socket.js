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

       socket.on("like_review",({sender})=>{
            io.except(sender).emit("receive_like");
       })

       socket.on("rate_review",({sender})=>{
        io.except(sender).emit("receive_rate");
       })

       socket.on("request_admin",({sender})=>{
        io.except(sender).emit("receive_request");
       })

       socket.on("react_notify",({recipient,notification})=>{
         console.log("react notify");
          io.to(recipient).emit("receive_notify",notification);
       })

       socket.on("unreact",({recipient,notification})=>{
            io.to(recipient).emit("receive_unreact",notification);
       })

       socket.on("react_replace",({recipient,notification})=>{
          io.to(recipient).emit("receive_replace",notification);
       })

       socket.on("respond_request",({recipient,request,adminPin})=>{
         io.to(recipient).emit("receive_respond",{request,adminPin});
       })

       

       
        
    })  

    return io;
}