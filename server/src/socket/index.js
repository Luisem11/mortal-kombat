const uuid = require('uuid')

let socketServer = (httpServer) => {
    const io = require('socket.io')(httpServer)

    let channel = "";
    let channels = [] 
    
    // Se establece conexion de los jugadores
    io.on('connection', async (socket) => {

        let chann = channels.find(channel => channel.size < 2)

        if(!chann){
            channel = uuid.v4()
            channels.push({
                name: channel,
                size: 1,
                sockets: [socket]
            })
        }
        else {
            chann.sockets.push(socket)
            chann.size = 2            
        }
        // Unir al usuario a un room aleatorio
        await socket.join(channel)

        // Se emite el video al oponente
        socket.on('videoStream', (data) => {
            let rooms = Object.values(socket.rooms)
            let room = rooms.find(room => room !== socket.id)
            socket.to(room).broadcast.emit('video', data)        
        })

        socket.on('disconnect', () => {
            channels = channels.filter(chann => {
                let chan = chann.sockets.find(socket1 => socket1.id === socket.id) 
                if(!chan){
                    return chann
                }
            })

            // socket.leave(room)
            socket.broadcast.emit('video', {id: socket.conn.id, data: null})
        })
    })

}

module.exports = {
    socketServer
}




