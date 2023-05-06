const io = require("socket.io")(3000, { cors: { origin: "*", } });

var users = {}
io.on('connection', socket => {

    socket.on('username', name => {
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)
    });

    socket.on('send-chat-message', message => {
        console.log(users[socket.id], 123);
        var message = {
            msg: message.msg,
            date: message.date,
            username: users[socket.id],
        }
        socket.broadcast.emit('chat-message', message)
    });


    socket.on('disconnect', () => {
        if (users[socket.id]) {
            socket.broadcast.emit('user-disconnected', users[socket.id]);
            delete users[socket.id]
        }
    });

});