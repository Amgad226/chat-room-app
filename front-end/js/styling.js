
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
const icon = "../public/socket-icon.png"

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

function moveLogo() {
    logo.style.transform = 'rotate(360deg)';
    setTimeout(() => {

        logo.style.transform = 'rotate(0deg)';
    }, 500);
}

function scroll() {
    var container = document.getElementById("messages-container");
    container.scrollTop = container.scrollHeight;
}
