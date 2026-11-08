const cheerio = require('cheerio');

async function getEBookOffers() {
    const response = await fetch('https://www.abo24.de/ebook-abo-vergleich');
    const html = await response.text();
    const $ = cheerio.load(html);



    const skoobeOffers = $('td[data-column="1"] a.offer-list-link')
        .map((_, el) => {
            const name = $(el).find('strong').text().trim();
            const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();


    const kindleUnlimitedOffers = $('td[data-column="2"] a.offer-list-link')
        .map((_, el) => {
            const name = $(el).find('strong').text().trim();
            const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();


    const storytelOffers = $('td[data-column="3"] a.offer-list-link')
        .map((_, el) => {
            const name = $(el).find('strong').text().trim();
            const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();


    const bookBeatOffers = $('td[data-column="4"] a.offer-list-link')
        .map((_, el) => {
            const name = $(el).find('strong').text().trim();
            const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();


    const legimiOffers = $('td[data-column="5"] a.offer-list-link')
        .map((_, el) => {
            const name = $(el).find('strong').text().trim();
            const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();


    const nextoryOffers = $('td[data-column="6"] a.offer-list-link')
        .map((_, el) => {
            const name = $(el).find('strong').text().trim();
            const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();


    const tolinoSelectOffers = $('td[data-column="7"] a.offer-list-link')
        .map((_, el) => {
            const name = $(el).find('strong').text().trim();
            const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const primeReadingOffers = $('td[data-column="8"] a.offer-list-link')
        .map((_, el) => {
            const name = $(el).find('strong').text().trim();
            const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const symbols24Offers = $('td[data-column="9"] a.offer-list-link')
        .map((_, el) => {
            const name = $(el).find('strong').text().trim();
            const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();


    const perlegoOffers = $('td[data-column="10"] a.offer-list-link')
        .map((_, el) => {
            const name = $(el).find('strong').text().trim();
            const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();

    const everandOffers = $('td[data-column="11"] a.offer-list-link')
        .map((_, el) => {
            const name = $(el).find('strong').text().trim();
            const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
            return { name, price };
        })
        .get();


    return [
    { name: 'Skoobe',            items: skoobeOffers },
    { name: 'Kindle Unlimited',  items: kindleUnlimitedOffers },
    { name: 'Storytel',          items: storytelOffers },

    { name: 'BookBeat',          items: bookBeatOffers },
    { name: 'Legimi',            items: legimiOffers },
    { name: 'Nextory',           items: nextoryOffers },

    { name: 'tolino select',     items: tolinoSelectOffers },
    { name: 'Prime Reading',     items: primeReadingOffers },
    { name: '24symbols',         items: symbols24Offers },

    { name: 'Perlego',           items: perlegoOffers },
    { name: 'Everand',           items: everandOffers },
    ];
}

module.exports = { getEBookOffers };

