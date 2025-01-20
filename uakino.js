// Інтеграція uakino.me в плагін Lampa.mx
const axios = require('axios');
const cheerio = require('cheerio');

const uakino = {
    baseUrl: 'https://uakino.me',

    async search(query) {
        try {
            const response = await axios.get(`${this.baseUrl}/index.php`, {
                params: {
                    do: 'search',
                    subaction: 'search',
                    story: query,
                },
            });

            const $ = cheerio.load(response.data);
            const results = [];

            $('.movie-item').each((i, element) => {
                const title = $(element).find('.movie-title').text().trim();
                const link = $(element).find('.movie-title').attr('href');
                const image = $(element).find('.movie-img img').attr('src');
                const description = $(element).find('.desc-about-text').text().trim();
                const imdbRating = $(element).find('.deck-value').text().trim();

                results.push({
                    title,
                    link: `${this.baseUrl}${link}`,
                    image: `${this.baseUrl}${image}`,
                    description,
                    imdbRating,
                });
            });

            return results;
        } catch (error) {
            console.error('Помилка під час пошуку на uakino.me:', error);
            return [];
        }
    },

    async getStreams(link) {
        try {
            const response = await axios.get(link);
            const $ = cheerio.load(response.data);

            const streams = [];
            $('source').each((i, element) => {
                const streamUrl = $(element).attr('src');
                if (streamUrl) {
                    streams.push({ url: streamUrl });
                }
            });

            return streams;
        } catch (error) {
            console.error('Помилка під час отримання потоків із uakino.me:', error);
            return [];
        }
    },
};

module.exports = uakino;
