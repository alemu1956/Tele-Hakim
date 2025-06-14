// server.js (Cloud Version for Railway)

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const app = express();

// Enable CORS globally
app.use(cors());

// Multer config for file uploads
const upload = multer({ dest: 'uploads/' });

// ✅ Serve frontend static files (optional, if you want to serve from backend)
const publicPath = path.resolve(__dirname, '../frontend');
app.use(express.static(publicPath));

// ✅ Serve session-room.html directly (optional route)
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'session-room.html'));
});

// ✅ Whisper backend audio upload route
app.post('/upload-audio', upload.single('file'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));

        const response = await axios.post('https://your-whisper-api-endpoint/transcribe', formData, {
            headers: formData.getHeaders(),
            maxBodyLength: Infinity,
        });

        fs.unlinkSync(filePath); // cleanup after processing
        res.json({ transcription: response.data.transcription });

    } catch (err) {
        console.error('❌ Whisper transcription failed:', err);
        res.status(500).json({ error: 'Transcription failed' });
    }
});

// ✅ Listen on Railway provided PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Cloud Backend running on port ${PORT}`);
});