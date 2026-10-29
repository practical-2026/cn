const net = require('net');
const readline = require('readline');

const clients = [];   // all connected clients

const server = net.createServer((socket) => {
    clients.push(socket);
    console.log('\nClient connected');
    rl.prompt();

    // message received from a client -> show it and send it to the other clients
    socket.on('data', (data) => {
        const msg = data.toString().trim();
        console.log('\nClient:', msg);
        rl.prompt();
        for (const c of clients) {
            if (c !== socket) c.write('Client: ' + msg + '\n');
        }
    });

    socket.on('end', () => {
        clients.splice(clients.indexOf(socket), 1);
        console.log('\nClient disconnected');
        rl.prompt();
    });

    socket.on('error', () => {});
});

server.listen(3000, '127.0.0.1', () => {
    console.log('Server running on port 3000');
    rl.prompt();
});

// server operator types a message -> send to all clients
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Type your message: '
});
rl.on('line', (line) => {
    if (line === 'exit') {
        server.close();
        process.exit();
    }
    for (const c of clients) c.write('Server: ' + line + '\n');
    rl.prompt();
});