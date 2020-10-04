let socketServer = (httpServer) => {
    const io = require('socket.io')(httpServer)

    sockets = []

    io.on('connection', (socket) => {
        console.log(socket.id)

        sockets.push(socket)

        socket.on('videoStream', (data) => {
            sockets.forEach(socket => {
                if(socket.id != data.id){
                    // console.log(data)
                    socket.emit('video', data)
                }
            })  
        
        })

        socket.on('key', (data) => {
            sockets.forEach(socket => {
                if(socket.id != data.id){
                    console.log(data)
                    socket.emit('keypress', data)
                }
            })   
        })

        socket.on('disconnect', (socket1) => {
            console.log("socket desconectado", socket1)
            socket.broadcast.emit('video', {id: socket.conn.id, data: null})
        })
    })


}

module.exports = {
    socketServer
}




