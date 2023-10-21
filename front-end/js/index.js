const socket = io('127.0.0.1:3000', {
    // const socket = io('192.168.1.38:3000', {
    reconnectionAttempts: 3 // Try to reconnect up to 3 times
});
socket.on('connect_error', error => {
    console.log('Connection error:', error);
    alert('Error connection with server try again after play server on port 3000 ,we will try connect 3 times  ');
});

socket.on('connect_timeout', timeout => {
    console.log('Connection timeout:', timeout);
    alert('Error connect_timeout with server try again after play server on port 3000 ');

});


const messageForm = document.getElementById('send-form');
const messageInput = document.getElementById('send-input');
const messages = document.getElementById('messages-container');
const usernameInput = document.getElementById('username');
const formUserName = document.getElementById('form-username');
const myName = document.getElementById('myName');
const exit = document.getElementById('exit');
let username;
const tele = "../front-end/public/tele.mp3"
const logo = document.getElementById('background-img');


// get name from user and initialize the socket connection 
formUserName.addEventListener('submit', e => {
    e.preventDefault();
    messages.style.display = "block"
    messageForm.style.display = "block"
    formUserName.style.display = "none"

    username = usernameInput.value;
    myName.innerHTML = "Name:" + username
    socket.emit('username', username)

    socket.on('user-connected', username => {

        var message = {
            date: Date.now(),
            username: username,
            msg: `${username} connect on server `
        }
        append(message)

    })

    socket.on('chat-message', data => {
        if (data.msg != null && data.date != null) {
            append(data)
        }
    })

    socket.on('user-disconnected', username => {

        var message = {
            date: Date.now(),
            username: username,
            msg: `${username} leave the server `
        }
        append(message)

    })

})

messageForm.addEventListener('submit', e => {
    if (!messageInput.value) {
        return;
    }
    e.preventDefault();
    const message = {
        msg: encryptMessage(withoutTag(messageInput.value)).toString(),
        date: Date.now()
    };
    console.log(message);
    socket.emit('send-chat-message', message)
    appendMe(withoutTag(messageInput.value))
    // console.log( messageInput.value);
    messageInput.focus()
    messageInput.value = '';
})

exit.addEventListener('click', () => {
    location.reload();
})


const append = (message) => {
    play() //play telegram sound 
    moveLogo()

    // notification(message.username,decryptMessage(message.msg)) // append notification 


    const messageElement = document.createElement('div');
    messageElement.classList.add('container', 'darker', "card");
    console.log(message.msg)
    messageElement.innerHTML = `

        <span>${message.username}</span>
        <p>
           ${decryptMessage(message.msg)}
            <span class="time-right ">${humanDate(message.date)}</span>
        </p>
    `
    messages.append(messageElement);

    scroll()
}


const appendMe = (message) => {
    moveLogo()

    const messageElement = document.createElement('div');
    messageElement.classList.add('container', "card");
    messageElement.innerHTML = `
   
    <span> Me</span>
    <p>
    ${message}
 
        <span class="time-right ">${humanDate()}</span>
    </p>

    `
    messages.append(messageElement);

    scroll()
}
