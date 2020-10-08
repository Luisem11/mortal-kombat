const express = require('express')
const path = require('path')
const morgan = require('morgan')
const fs = require('fs');

const app = express()

const options = {
    key: fs.readFileSync('./server/key.pem', 'utf8'),
    cert: fs.readFileSync('./server/server.crt', 'utf8')
};

const http = require('http').createServer(app)

require('./socket/index.js').socketServer(http)

const { PORT } = require('./config/environment')


app.use(morgan('tiny'))

app.use(express.static(path.join(__dirname, '../../')))



http.listen(PORT, () => {
    console.log(`Server listen in port ${PORT}`)
})