

var express = require('express');
var server = express(); 
server.use(express.static(__dirname + '/static'));

server.listen(3000, () => console.log('Running in port 3000'));

