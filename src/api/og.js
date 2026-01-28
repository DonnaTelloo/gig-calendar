const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');
const fs = require('fs')
const {getArticleByDate} = require("../features/event/api/event.api.js");

app.get('/:date', async (req, res) => {
    const { date } = req.params;

    // Use the correct path to the index.html file
    const filePath = path.resolve(__dirname, '../../index.html');

    fs.readFile(filePath, 'utf8', async (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error loading page');
        }

        try {
            // 👉 fetch data from API / DB using the date from the request
            const article = await getArticleByDate(date);

            // Get the base URL for absolute URLs
            const baseUrl = `${req.protocol}://${req.get('host')}`;

            // Format the image URL correctly
            // Check different possible image properties in the response
            const imagePath = article?.ImagePath || article?.imagePath || article?.image;

            const imageUrl = imagePath 
                ? (imagePath.startsWith('http') ? imagePath : `${baseUrl}${imagePath}`)
                : `${baseUrl}/assets/nothing-found.svg`;

            // Find the localization for the current language or use the first one
            const localization = article?.localizations?.find(loc => loc.languageCode === 'en') || 
                                article?.localizations?.[0];

            const title = localization?.title || article?.title || 'Historical Event';
            const description = localization?.description || article?.text || 'Check this historical event';

            const html = data
                .replace(/\$OG_TITLE/g, title)
                .replace(/\$OG_DESCRIPTION/g, description)
                .replace(/\$OG_IMAGE/g, imageUrl)
                .replace(/\$OG_URL/g, `${baseUrl}/${date}`);

            res.send(html);
        } catch (error) {
            console.error('Error fetching article:', error);

            // Still send a response with default values if there's an error
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const title = 'Historical Event';
            const description = 'Check this historical event';
            const imageUrl = `${baseUrl}/assets/nothing-found.svg`;

            const html = data
                .replace(/\$OG_TITLE/g, title)
                .replace(/\$OG_DESCRIPTION/g, description)
                .replace(/\$OG_IMAGE/g, imageUrl)
                .replace(/\$OG_URL/g, `${baseUrl}/${date}`);

            res.send(html);
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`OG server listening at http://localhost:${port}`);
});
