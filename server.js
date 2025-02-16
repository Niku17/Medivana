const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/analyze-symptoms', async (req, res) => {
    try {
        const { symptoms } = req.body;

        // Forward the symptoms to Flask backend for processing
        const response = await axios.post('http://127.0.0.1:5000/predict', {
            symptoms: symptoms
        });

        // Assuming the Flask backend returns a list of medicines
        res.json({ medicines: response.data.medicines });
    } catch (error) {
        console.error('Error communicating with Flask backend:', error);
        res.status(500).json({ error: 'Failed to fetch predictions' });
    }
});

app.listen(PORT, () => {
    console.log(`Node.js server running on http://localhost:${PORT}`);
});
