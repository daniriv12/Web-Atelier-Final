/**
 * Created by Daniel on 08/12/14.
 */
require("/socket.io/socket.io.js");

var socket = io.connect('http://localhost');
socket.on('news', function (data) {
    console.log(data);
    console.log(sessionStorage.getItem("user"));
    socket.emit('my other event', { my: 'data' });
});
