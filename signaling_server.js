const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
const path = require('path');

const serverOptions = {
    key: fs.readFileSync(path.join(__dirname, '../ssl/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../ssl/cert.pem'))
};

const httpsServer = https.createServer(serverOptions);
const wss = new WebSocket.Server({ server: httpsServer });

const rooms = {};

wss.on('connection', ws => {
    ws.on('message', data => {
        try {
            let message = JSON.parse(data);
            const { room } = message;

            if (!rooms[room]) rooms[room] = [];
            rooms[room].push(ws);

            rooms[room].forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(message));
                }
            });

        } catch (err) {
            console.error("Invalid message received:", err);
        }
    });
});

httpsServer.listen(8080, () => {
    console.log("✅ Secure Signaling Server running on wss://your-domain:8080");
});