const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);

const staticFiles = path.resolve(__dirname, 'frontend', 'dist');
const views = path.join(staticFiles, 'views');

app.set('views', views);
app.set('view engine', 'ejs');

app.use(express.static(staticFiles));
app.use(express.static(views));

app.get('/', function (req, res) {
    res.sendFile('index.html');
});

server.listen(3000, function () {
    console.log('App listening on port 3000!')
});

setInterval(() => {
    io.emit('time', {time: new Date()});
}, 1000);
