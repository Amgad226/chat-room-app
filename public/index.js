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

    // Handle the timeout here
});


const messageForm = document.getElementById('send-form');
const messageInput = document.getElementById('send-input');
const messages = document.getElementById('messages-container');
const usernameInput = document.getElementById('username');
const formUserName = document.getElementById('form-username');
const myName = document.getElementById('myName');
const exit = document.getElementById('exit');
let username;
const icon = "./public/socket-icon.png"
const tele = "./public/tele.mp3"
const logo = document.getElementById('background-img');



formUserName.addEventListener('submit', e => {
    e.preventDefault();
    messages.style.display = "block"
    messageForm.style.display = "block"
    formUserName.style.display = "none"

    username = usernameInput.value;
    myName.innerHTML = "Name:" + username
    console.log(socket.connected);
    console.log(socket.id);
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
    // console.log(username);
    const message = { msg: withoutTag(messageInput.value), date: Date.now() };
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
    play()
    moveLogo()

    // notification(message.username,message.msg)
    var container = document.querySelector('#messages-container');

    // Scroll to the bottom of the container
    container.scrollTop = container.scrollHeight;



    const messageElement = document.createElement('div');
    messageElement.classList.add('container', 'darker', "card");
    messageElement.innerHTML = `

        <span>${message.username}</span>
        <p>
           ${message.msg}
            <span class="time-right ">${humanDate(message.date)}</span>
        </p>
    `
    messages.append(messageElement);

    scroll()
}

function scroll() {
    var container = document.getElementById("messages-container");
    container.scrollTop = container.scrollHeight;
    // console.log("Scrolled to bottom");

}

function moveLogo() {
    // console.log('move');
    logo.style.transform = 'rotate(360deg)';
    setTimeout(() => {

        logo.style.transform = 'rotate(0deg)';
    }, 500);
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

function humanDate(timestamp = Date.now()) {
    const date = new Date(timestamp); // Create a new Date object using the timestamp
    return date.toLocaleString(); // Convert the date to a human-readable string
}

function play(sound = tele) {

    var url = sound;
    window.AudioContext = window.AudioContext || window.webkitAudioContext; //fix up prefixing
    var context = new AudioContext(); //context
    var source = context.createBufferSource(); //source node
    source.connect(context.destination); //connect source to speakers so we can hear it
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer'; //the  response is an array of bits
    request.onload = function () {
        context.decodeAudioData(request.response, function (response) {
            source.buffer = response;
            source.start(0); //play audio immediately
            source.loop = false;
        }, function () { console.error('The request failed.'); });
    }
    request.send();
}
function notification(title, body) {
    // Check if the browser supports notifications
    if ("Notification" in window) {
        // Request permission to show notifications
        Notification.requestPermission()
            .then(function (permission) {
                // If permission is granted, create a notification
                if (permission === "granted") {
                    var notification = new Notification(title, {
                        body: body,
                        icon: icon,
                    });
                    // Close the notification after a certain time (in milliseconds)
                    setTimeout(notification.close.bind(notification), 5000);

                }
            })
            .catch(function (err) {
                console.error("Error in requesting permission for notification", err);
            });
    }

}
function withoutTag(string) {
    // return string;
    return string.replace(/[<>]/g, ' _ ')
}

