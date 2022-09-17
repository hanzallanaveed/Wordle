const PORT = 8000;
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors());

app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`) });

app.get('/word', (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://random-words5.p.rapidapi.com/getMultipleRandom',
        params: { count: '5', wordLength: '5' },
        headers: {
            'X-RapidAPI-Key': '854382967cmsh4da201cfb50ffc3p1bcf5djsn51dfb246762d',
            'X-RapidAPI-Host': 'random-words5.p.rapidapi.com'
        }
    };

    axios.request(options).then(function (response) {
        console.log(response.data);
        res.json(response.data[0]);
    }).catch(function (error) {
        console.error(error);
    });
})