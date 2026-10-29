const net = require('net');
const readline = require('readline');

const client = net.createConnection({ port: 3000, host: '127.0.0.1' }, () => {
    console.log('Connected to server');
    rl.prompt();
});

// message received from server
client.on('data', (data) => {
    console.log('\n' + data.toString().trim());
    rl.prompt();
});

client.on('end', () => {
    console.log('Disconnected from server');
    process.exit();
});

client.on('error', (err) => {
    console.log('Error:', err.message);
    process.exit();
});

// user types a message -> send to server
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Type your message: '
});
rl.on('line', (line) => {
    if (line === 'exit') {
        client.end();
        process.exit();
    }
    client.write(line);
    rl.prompt();
});