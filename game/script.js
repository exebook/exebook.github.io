
var can = document.getElementById('canvas1');
var ctx = can.getContext('2d', {alpha: true});
var serverURL = 'ws://192.168.0.102:5401/', server

function out () {
	document.title = 'out!'
	setTimeout(function() {
		document.location.reload()
	}, 1000)
}

function message () {
	console.log('msg!')
}

function connect () {
	if (server && server.readyState == 'open') return
	try { server = new eio.Socket(serverURL) }
	catch (e) {
		document.title = 'sok err'+e
		return
	}
	server.on('close', out)
	server.on('error', out)
	server.on('message', message)
}

connect()
