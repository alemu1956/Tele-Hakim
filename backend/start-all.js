// start-all.js
const { spawn } = require('child_process');

function startServer(script, name) {
    const process = spawn('node', [script], { stdio: 'inherit' });

    process.on('close', (code) => {
        console.log(`${name} exited with code ${code}`);
    });
}

startServer('server.js', 'Main Server');
startServer('signaling-server.js', 'Signaling Server');