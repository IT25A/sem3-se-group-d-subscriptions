import * as cheerio from 'cheerio';

const response = await fetch('https://www.abo24.de/streaming-abo-vergleich');
const html = await response.text();
const $ = cheerio.load(html);

const names = $('[itemprop="brand"] [itemprop="name"]') 
    .map((_, el) => $(el).attr('content'))
    .get();


const prices = $('[itemprop="price"]') 
    .map((_, el) => $(el).attr('content'))
    .get();


export { names, prices };
