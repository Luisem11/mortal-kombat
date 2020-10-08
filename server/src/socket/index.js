let socketServer = (httpServer) => {
    const io = require('socket.io')(httpServer)

    // Se establece conexion de los jugadores
    io.on('connection', (socket) => {
        console.log(socket.id)

        // Se emite el video al oponente
        socket.on('videoStream', (data) => {
            socket.broadcast.emit('video', data)        
        })

        socket.on('disconnect', () => {
            socket.broadcast.emit('video', {id: socket.conn.id, data: null})
        })
    })

}

module.exports = {
    socketServer
}




