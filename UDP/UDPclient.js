const dgram = require('dgram');
const readline = require('readline');

const PORT = 3000;
const HOST = '127.0.0.1';

const client = dgram.createSocket('udp4');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Type your message: '
});

// message received from server
client.on('message', (data) => {
    console.log('\n' + data.toString().trim());
    rl.prompt();
});

client.on('error', (err) => {
    console.log('Error:', err.message);
    process.exit();
});

// tell the server we exist (UDP has no connect step)
client.send('joined', PORT, HOST, () => {
    console.log('Sent to server ' + HOST + ':' + PORT);
    rl.prompt();
});

// user types a message -> send to server
rl.on('line', (line) => {
    if (line === 'exit') {
        client.close();
        process.exit();
    }
    client.send(line, PORT, HOST);
    rl.prompt();
});
