const express = require('express');
const path    = require('path');
const http    = require('http');
const socket  = require('socket.io');
const app     = express();
const PORT    = 3000 || process.env.PORT;

const server  = http.createServer(app);
app.use(express.static(path.join(__dirname, 'public')));

server.listen(PORT, () => {
	console.log(`Connecting to port ${PORT}`);
});

const io = socket(server);

io.on('connection', socket => {
	socket.on('joinChat', data => {
		const userInfo = {name: data.user, userId: socket.id}
		io.sockets.emit('joinChat', userInfo);
	});

	socket.on('leaveChat', data => {
		const userInfo = {userId: socket.id}
		io.sockets.emit('leaveChat', userInfo);
	});

	socket.on('chat', data => {
		io.sockets.emit('chat', data);
	});

	socket.on('typing', data => {
		socket.broadcast.emit('typing', data);
		// comment
	});
});