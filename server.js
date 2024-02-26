const axios = require("axios");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors()); // This enables CORS for all routes

require("dotenv").config();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/khalti-api', async (req, res) => {
    const payload = req.body;
    try {
        const khaltiResponse = await axios.post(
            'https://a.khalti.com/api/v2/epayment/initiate/',
            payload, {
                headers: {
                    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                },
            }
        );
        res.json({
            success: true,
            data: khaltiResponse.data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        });
    }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, '0.0.0.0', () => console.log(`Server listening on port ${PORT}`));
