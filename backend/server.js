const express = require('express');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Setup file storage for uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Example route
app.get('/', (req, res) => {
    res.send('TeleHakim backend running!');
});

// Example file upload route
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ message: 'File uploaded successfully' });
});

// Load SSL certificates
const serverOptions = {
    key: fs.readFileSync(path.join(__dirname, '../192.168.1.170+2-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../192.168.1.170+2.pem'))
};

// Start HTTPS server
const httpsServer = https.createServer(serverOptions, app);
httpsServer.listen(8443, () => {
    console.log('✅ Secure Backend Server running at https://localhost:8443');
});