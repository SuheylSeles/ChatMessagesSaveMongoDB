const express = require('express')
const socket = require('socket.io')

const app = express()
const mongoose = require('mongoose')
const server = app.listen(3442)
mongoose.connect('mongodb://localhost:27017/chatSave', {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true
}).then(() => {
    console.log("MongoDb'ye bağlandı.")
}).catch(err => {
    console.log("MongoDb'ye bağlanmadı.", err)
})

const chatSchema = new mongoose.Schema({
    sender : String,
    message : String,
},{timestamps:true})

const dbMessage = mongoose.model('Message', chatSchema)

app.use(express.static('public'))

const io = socket(server)

io.on('connection', (socket) => {
    console.log(socket.id)

    socket.on('chat', data => {
        io.sockets.emit('chat', data);
        //save
        dbMessage(data).save()
    })

    socket.on('typing', data => {
        socket.broadcast.emit('typing', data)
    })

})
