const cheerio = require('cheerio');

async function getAudioBookOffers() {
    const response = await fetch('https://www.abo24.de/hoerbuch-abo-vergleich');
    const html = await response.text();
    const $ = cheerio.load(html);

    const audibleOffers = $('td[data-column="1"] a.offer-list-link')
        .map((_, el) => {
            const name = $(el).find('strong').text().trim();
            const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const blinkistOffers = $('td[data-column="2"] a.offer-list-link')
        .map((_, i) => {
            const name = $(i).find('strong').text().trim();
            const price = $(i).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const bookBeatOffers = $('td[data-column="3"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const storytelOffers = $('td[data-column="4"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const kindleUnlimitedOffers = $('td[data-column="5"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const skoobeOffers = $('td[data-column="6"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const nextoryOffers = $('td[data-column="7"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const legimiOffers = $('td[data-column="8"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const podimoOffers = $('td[data-column="9"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const primeReadingOffers = $('td[data-column="10"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const audiobooksComOffers = $('td[data-column="11"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const thaliaOffers = $('td[data-column="12"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const everandOffers = $('td[data-column="13"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const tigertonesOffers = $('td[data-column="14"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const audiotekaOffers = $('td[data-column="15"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const hugendubelOffers = $('td[data-column="16"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const femtasyOffers = $('td[data-column="17"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const bloomStoriesOffers = $('td[data-column="18"] a.offer-list-link')
        .map((_, y) => {
            const name = $(y).find('strong').text().trim();
            const price = $(y).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    return [
        { name: 'Audible',          items: audibleOffers },
        { name: 'Blinkist',         items: blinkistOffers },
        { name: 'BookBeat',         items: bookBeatOffers },
        { name: 'Storytel',         items: storytelOffers },
        { name: 'Kindle Unlimited', items: kindleUnlimitedOffers },
        { name: 'Skoobe',           items: skoobeOffers },
        { name: 'Nextory',          items: nextoryOffers },
        { name: 'Legimi',           items: legimiOffers },
        { name: 'Podimo',           items: podimoOffers },
        { name: 'Prime Reading',    items: primeReadingOffers },
        { name: 'audiobooks.com',   items: audiobooksComOffers },
        { name: 'Thalia',           items: thaliaOffers },
        { name: 'Everand',          items: everandOffers },
        { name: 'tigertones',       items: tigertonesOffers },
        { name: 'Audioteka',        items: audiotekaOffers },
        { name: 'Hugendubel',       items: hugendubelOffers },
        { name: 'Femtasy',          items: femtasyOffers },
        { name: 'Bloom Stories',    items: bloomStoriesOffers },
    ];
}

module.exports = { getAudioBookOffers };
