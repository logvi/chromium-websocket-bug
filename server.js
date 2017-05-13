const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const PORT = process.env.PORT || 3000;

const staticFiles = path.resolve(__dirname, 'frontend', 'dist');
const views = path.join(staticFiles, 'views');

app.set('views', views);
app.set('view engine', 'ejs');

app.use(express.static(staticFiles));
app.use(express.static(views));

app.get('/', function (req, res) {
    res.sendFile('index.html');
});

app.get('/1', function (req, res) {
    res.sendFile('noinput.html', { root: staticFiles });
});

server.listen(PORT, function () {
    console.log('App listening on port ' + PORT + '!');
});

setInterval(() => {
    io.emit('time', {time: new Date()});
}, 1000);
