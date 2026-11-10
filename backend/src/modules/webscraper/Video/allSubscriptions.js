const cheerio = require('cheerio');

async function getVideoOffers() {
    const response = await fetch('https://www.abo24.de/streaming-abo-vergleich');
    const html = await response.text();
    const $ = cheerio.load(html);

    const rtlOffers = $('td[data-column="1"] a.offer-list-link')
        .map((_, el) => {
            const name = $(el).find('strong').text().trim();
            const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const wowOffers = $('td[data-column="2"] a.offer-list-link')
        .map((_, i) => {
            const name = $(i).find('strong').text().trim();
            const price = $(i).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const paramountOffers = $('td[data-column="3"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const primeOffers = $('td[data-column="4"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const hbomaxOffers = $('td[data-column="5"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const appleOffers = $('td[data-column="6"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const joynOffers = $('td[data-column="7"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();


    const disneyOffers = $('td[data-column="8"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();


    const netflixOffers = $('td[data-column="9"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();



    return [
        { name: 'RTL+', items: rtlOffers },
        { name: 'WOW', items: wowOffers },
        { name: 'Paramount+', items: paramountOffers },
        { name: 'Amazon Prime Video', items: primeOffers },
        { name: 'HBO Max', items: hbomaxOffers },
        { name: 'Apple TV+', items: appleOffers },
        { name: 'Joyn', items: joynOffers },
        { name: 'Disney+', items: disneyOffers },
        { name: 'Netflix', items: netflixOffers },
    ];
}

module.exports = { getVideoOffers };