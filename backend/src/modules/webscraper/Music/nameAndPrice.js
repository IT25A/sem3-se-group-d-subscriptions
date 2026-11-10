const cheerio = require('cheerio');

async function getMusicNamesAndPrices() {
    const response = await fetch('https://www.abo24.de/musik_streaming-abo-vergleich');
    const html = await response.text();
    const $ = cheerio.load(html);

    const names = $('[itemprop="brand"] [itemprop="name"]')
        .map((_, el) => $(el).attr('content'))
        .get();

    const prices = $('[itemprop="price"]')
        .map((_, el) => $(el).attr('content'))
        .get();

    return { names, prices };
}

module.exports = { getMusicNamesAndPrices };
