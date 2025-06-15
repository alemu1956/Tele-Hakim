const express = require('express');
const router = express.Router();

// Example protected route
router.get('/protected', (req, res) => {
    res.json({ message: 'This is a protected route.' });
});

module.exports = router;