const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 5001 });

const rooms = {};

server.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        let data = null;
        try {
            data = JSON.parse(message);
        } catch (e) {
            console.error('Invalid JSON', e);
            return;
        }

        const { type, room, payload } = data;

        switch (type) {
            case 'join':
                if (!rooms[room]) {
                    rooms[room] = [];
                }
                rooms[room].push(ws);
                console.log(`Client joined room ${room}`);
                break;

            case 'signal':
                if (rooms[room]) {
                    rooms[room].forEach(client => {
                        if (client !== ws && client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                type: 'signal',
                                payload: payload
                            }));
                        }
                    });
                }
                break;

            default:
                console.log('Unknown message type:', type);
                break;
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        for (const room in rooms) {
            rooms[room] = rooms[room].filter(client => client !== ws);
            if (rooms[room].length === 0) {
                delete rooms[room];
            }
        }
    });
});

console.log('Signaling server is running on port 5001');