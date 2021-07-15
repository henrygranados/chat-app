const socket = io();
var users = [];
$ = (id) => document.getElementById(id);
var username        = $('username'),
	appChat         = $('app-chat'),
	welcomePanel    = $('welcome-panel'),
	loggedInUser    = $('loggedInUser'),
	message         = $('message'),
	sendMessage     = $('send-message'),
	leaveChat       = $('leave-chat'),
	typingMessage   = $('typing-message'),
	output          = $('output'),
	lisOfUsers      = $('lisOfUsers');

if(sendMessage){
	sendMessage.addEventListener('click', () => {
		if(message.value){
			socket.emit('chat', {
				message: message.value,
				user: loggedInUser.value
			});
		}
	
		message.value = '';
	});	
}

if(leaveChat){
	leaveChat.addEventListener('click', () => {
		socket.emit('leaveChat', { message: "user leaves chat room"});
		username.value = '';
		welcomePanel.style.display = "block";
		appChat.style.display = "none";	
	});
}

if(message){
	message.addEventListener('keyup', () => {
		if(username.value){
			socket.emit('typing', {
				name: loggedInUser.value,
				text: message.value
			});
		}
	});
}

/* Users sends a message */
socket.on('chat', data => {
	typingMessage.innerHTML = '';
	output.innerHTML += `<p><strong>${data.user}: </strong>${data.message}</p>`;
});

/* User is typing a message */
socket.on('typing', data => {
	typingMessage.innerHTML = data.text ? `<p><em>${data.name} is typing a message...</em></p>` : '';
});	

/* User joins the chat room */
socket.on('joinChat', data => {
	// adding new user to list
	users.push(data);
	outputUsers(users);
});	

/* User leaves the chat room */
socket.on('leaveChat', data => {
	const indexToBeDeleted = users.findIndex(obj => obj.userId === data.userId);
	users.splice(indexToBeDeleted, 1);
	outputUsers(users);
});	

// Add users to DOM
function outputUsers(users) {
	lisOfUsers.innerHTML = '';
	users.forEach((user) => {
	  const li = document.createElement('li');
	  li.innerText = user.name;
	  lisOfUsers.appendChild(li);
	});
  }
 /* User enters the chat rooom */
function enterChat() {
	if (username.value) {
		welcomePanel.style.display = "none";
		appChat.style.display = "block";
		var currentUsername = username.value;
		loggedInUser.value = currentUsername;

		socket.emit('joinChat', {
			user: currentUsername,
		});
	}
}
