const cheerio = require('cheerio');


async function getLanguageOffers() {
    const response = await fetch('https://www.abo24.de/sprachlern_app-abo-vergleich');
    const html = await response.text();
    const $ = cheerio.load(html);



    const duolingoOffers = $('td[data-column="1"] a.offer-list-link')
        .map((_, el) => {
            const name = $(el).find('strong').text().trim();
            const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const busuuOffers = $('td[data-column="2"] a.offer-list-link')
        .map((_, i) => {
            const name = $(i).find('strong').text().trim();
            const price = $(i).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const rosettaStoneOffers = $('td[data-column="3"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const babbelOffers = $('td[data-column="4"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const mondlyOffers = $('td[data-column="5"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const jickiSprachduchenOffers = $('td[data-column="6"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const yablaOffers = $('td[data-column="7"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const lingopieOffers = $('td[data-column="8"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const mosaLinguaOffers = $('td[data-column="9"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const lingQOffers = $('td[data-column="10"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const chatterbugOffers = $('td[data-column="11"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const birlingoOffers = $('td[data-column="12"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();


    return [
    { name: 'Duolingo', items: duolingoOffers },
    { name: 'busuu', items: busuuOffers },
    { name: 'Rosetta Stone', items: rosettaStoneOffers },

    { name: 'babbel', items: babbelOffers },
    { name: 'Mondly', items: mondlyOffers },
    { name: 'Jicki Sprachduschen', items: jickiSprachduchenOffers },

    { name: 'Yabla', items: yablaOffers },
    { name: 'Lingopie', items: lingopieOffers },
    { name: 'MosaLingua', items: mosaLinguaOffers },

    { name: 'LingQ', items: lingQOffers },
    { name: 'Chatterbug', items: chatterbugOffers },
    { name: 'Birlingo', items: birlingoOffers },
    ];
}

module.exports = { getLanguageOffers };
