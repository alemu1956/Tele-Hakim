// signaling-server.js (FINAL VERSION)
const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
const path = require('path');

// SSL Certificates (same files as your backend)
const serverOptions = {
    key: fs.readFileSync(path.join(__dirname, '../192.168.1.170+2-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../192.168.1.170+2.pem'))
};

// Start secure HTTPS server
const httpsServer = https.createServer(serverOptions);
const wss = new WebSocket.Server({ server: httpsServer });

const rooms = {};

wss.on('connection', ws => {
    ws.on('message', data => {  // use 'data' to avoid confusion
        try {
            let message;
            try {
                message = JSON.parse(data);
            } catch (err) {
                console.error('Invalid JSON:', err);
                return;
            }

            const { room } = message;

            if (!rooms[room]) rooms[room] = [];
            rooms[room].push(ws);

            // Forward message to all clients in the room except sender
            rooms[room].forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(message));
                }
            });

        } catch (err) {
            console.error("❌ Invalid message received:", err);
        }
    });
});
// Start listening
httpsServer.listen(8080, () => {
    console.log("✅ Secure Signaling Server running on wss://192.168.1.170:8080");
});