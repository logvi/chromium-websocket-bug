import '../styles/style.scss';

import io from 'socket.io-client';

const socket = io.connect('http://localhost:3000');
socket.on('time', (data) => {
    timeNode.innerText = new Date(data.time).toLocaleTimeString();
});

const timeNode = document.getElementById('time');
document.getElementById('fix').addEventListener('change', ({target}) => {
    if (target.checked) {
        window.addEventListener('mousewheel', blankEventHandler);
    } else {
        window.removeEventListener('mousewheel', blankEventHandler);
    }
});

const blankEventHandler = () => {};





