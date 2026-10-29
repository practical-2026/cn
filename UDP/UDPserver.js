const dgram = require('dgram');
const readline = require('readline');

const server = dgram.createSocket('udp4');
const clients = new Map();   // UDP has no connections, so we remember the address of each sender

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Type your message: '
});

// message received from a client -> show it and send it to the other clients
server.on('message', (data, rinfo) => {
    const id = rinfo.address + ':' + rinfo.port;
    clients.set(id, rinfo);

    const msg = data.toString().trim();
    console.log('\nClient ' + ': ' + msg);
    rl.prompt();

    for (const [otherId, other] of clients) {
        if (otherId !== id) {
            server.send('Client: ' + msg, other.port, other.address);
        }
    }
});

server.on('error', (err) => {
    console.log('Error:', err.message);
    server.close();
});

server.bind(3000, '127.0.0.1', () => {
    console.log('UDP server running on port 3000');
    rl.prompt();
});

// server operator types a message -> send to all known clients
rl.on('line', (line) => {
    if (line === 'exit') {
        server.close();
        process.exit();
    }
    for (const c of clients.values()) {
        server.send('Server: ' + line, c.port, c.address);
    }
    rl.prompt();
});
